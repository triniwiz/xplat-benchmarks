use std::sync::Arc;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use serde::ser::SerializeMap;
use serde::{Deserialize, Serialize, Serializer};

use super::generate::{ScenarioFixture, fixture_for};
use super::http;
use super::protocol::{LOG_PREFIX, PROTOCOL_VERSION, encode_uri_component};
use super::scenarios::{Mutation, ScenarioId, Size};

pub enum Step {
    Align,
    Mount(Arc<ScenarioFixture>),
    Mutate(Mutation),
    Unmount,
}

impl Step {
    fn name(&self) -> &'static str {
        match self {
            Step::Align => "align",
            Step::Mount(_) => "mount",
            Step::Mutate(m) => m.as_str(),
            Step::Unmount => "unmount",
        }
    }
}

pub struct Mark {
    pub name: &'static str,
    pub at_ms: f64,
}

pub struct StepTiming {
    pub t0_ms: f64,
    pub end_ms: f64,
    pub marks: Vec<Mark>,
}

pub struct Ordered<V>(pub Vec<(String, V)>);

impl<V: Serialize> Serialize for Ordered<V> {
    fn serialize<S: Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        let mut map = s.serialize_map(Some(self.0.len()))?;
        for (k, v) in &self.0 {
            map.serialize_entry(k, v)?;
        }
        map.end()
    }
}

type Series = Ordered<Vec<f64>>;

impl Series {
    fn push(&mut self, key: String, value: f64) {
        match self.0.iter_mut().find(|(k, _)| *k == key) {
            Some((_, values)) => values.push(value),
            None => self.0.push((key, vec![value])),
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceInfo {
    pub platform: &'static str,
    pub os_version: String,
    pub device_model: String,
    pub framework: Ordered<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub screen_width: Option<f64>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Phase {
    Fetching,
    Running,
    Done,
    Failed,
}

pub struct RunStatus {
    pub phase: Phase,
    pub case_index: usize,
    pub case_count: usize,
    pub label: String,
}

pub trait Adapter {
    fn app(&self) -> &'static str;
    fn now(&self) -> f64;
    fn info(&self) -> DeviceInfo;
    fn run_step_blocking(&self, step: Step, timeout: Duration, what: &str) -> Result<StepTiming, String>;
    fn status(&self, status: &RunStatus);
    fn log(&self, line: &str);
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Plan {
    protocol: u32,
    run_id: String,
    app: String,
    warmup: u32,
    iterations: u32,
    cooldown_ms: f64,
    timeout_ms: f64,
    cases: Vec<PlanCase>,
}

impl Plan {
    fn timeout(&self) -> Duration {
        Duration::from_secs_f64(self.timeout_ms / 1000.0)
    }
}

#[derive(Deserialize)]
struct PlanCase {
    scenario: String,
    size: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CaseResult<'a> {
    run_id: &'a str,
    app: &'a str,
    scenario: &'a str,
    size: &'a str,
    fixture_hash: String,
    samples: Series,
    #[serde(skip_serializing_if = "Option::is_none")]
    phases: Option<Series>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Hello<'a> {
    #[serde(flatten)]
    info: DeviceInfo,
    run_id: &'a str,
    app: &'a str,
    started_at: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Done<'a> {
    run_id: &'a str,
    app: &'a str,
    ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
    duration_ms: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ErrorLine<'a> {
    run_id: &'a str,
    error: String,
}

fn js_error(message: impl std::fmt::Display) -> String {
    format!("Error: {message}")
}

fn emit(adapter: &dyn Adapter, kind: &str, payload: &impl Serialize) {
    let json = serde_json::to_string(payload).unwrap_or_default();
    adapter.log(&format!("{LOG_PREFIX}_{kind} {json}"));
}

fn get_json<T: for<'de> Deserialize<'de>>(base: &str, path: &str) -> Result<T, String> {
    let res = http::request("GET", base, path, None).map_err(js_error)?;
    if !(200..300).contains(&res.status) {
        return Err(js_error(format!("GET {base}{path} → {}", res.status)));
    }
    serde_json::from_str(&res.body).map_err(js_error)
}

fn post_json(base: &str, path: &str, body: &impl Serialize) -> Result<(), String> {
    let payload = serde_json::to_string(body).map_err(js_error)?;
    let mut attempt = 1;
    loop {
        let result = http::request("POST", base, path, Some(&payload)).map_err(js_error).and_then(|res| {
            if (200..300).contains(&res.status) {
                Ok(())
            } else {
                Err(js_error(format!("POST {base}{path} → {}", res.status)))
            }
        });
        match result {
            Ok(()) => return Ok(()),
            Err(e) if attempt >= 4 => return Err(e),
            Err(_) => {
                std::thread::sleep(Duration::from_millis(500 * 2u64.pow(attempt - 1)));
                attempt += 1;
            }
        }
    }
}

fn run_case<'a>(adapter: &dyn Adapter, plan: &'a Plan, fixture: Arc<ScenarioFixture>) -> Result<CaseResult<'a>, String> {
    let scenario = fixture.scenario;
    let label = format!("{}/{}", scenario.as_str(), fixture.size.as_str());
    let mut samples = Ordered(vec![("mount".to_string(), vec![]), ("unmount".to_string(), vec![])]);
    samples.0.extend(scenario.mutations().iter().map(|m| (m.as_str().to_string(), vec![])));
    let mut phases = Ordered(vec![]);
    let step = |s: Step| {
        let what = format!("{label} {}", s.name());
        adapter.run_step_blocking(s, plan.timeout(), &what)
    };

    for i in 0..plan.warmup + plan.iterations {
        let measured = i >= plan.warmup;
        let mut record = |series: &str, timing: StepTiming| {
            if !measured {
                return;
            }
            samples.push(series.to_string(), timing.end_ms - timing.t0_ms);
            for mark in timing.marks {
                phases.push(format!("{series}.{}", mark.name), mark.at_ms - timing.t0_ms);
            }
        };

        step(Step::Align)?;
        record("mount", step(Step::Mount(Arc::clone(&fixture)))?);
        for &m in scenario.mutations() {
            step(Step::Align)?;
            record(m.as_str(), step(Step::Mutate(m))?);
        }
        step(Step::Align)?;
        let mut unmount = step(Step::Unmount)?;
        unmount.marks.clear();
        record("unmount", unmount);
        std::thread::sleep(Duration::from_secs_f64(plan.cooldown_ms.max(0.0) / 1000.0));
    }

    Ok(CaseResult {
        run_id: &plan.run_id,
        app: &plan.app,
        scenario: scenario.as_str(),
        size: fixture.size.as_str(),
        fixture_hash: fixture.hash.clone(),
        samples,
        phases: if phases.0.is_empty() { None } else { Some(phases) },
        error: None,
    })
}

pub fn run_plan(adapter: &dyn Adapter, host: &str, run_id: &str) {
    let base = format!("http://{host}");
    let started = adapter.now();
    let mut status = RunStatus { phase: Phase::Fetching, case_index: 0, case_count: 0, label: String::new() };
    adapter.status(&status);

    let plan = get_json::<Plan>(&base, &format!("/plan?run={}", encode_uri_component(run_id))).and_then(|plan| {
        if plan.protocol != PROTOCOL_VERSION {
            return Err(js_error(format!("protocol mismatch: app {PROTOCOL_VERSION}, harness {}", plan.protocol)));
        }
        let started_at = SystemTime::now().duration_since(UNIX_EPOCH).map_or(0, |d| d.as_millis() as u64);
        post_json(&base, "/hello", &Hello { info: adapter.info(), run_id, app: adapter.app(), started_at })?;
        Ok(plan)
    });
    let plan = match plan {
        Ok(plan) => plan,
        Err(e) => {
            status.phase = Phase::Failed;
            status.label = e.clone();
            adapter.status(&status);
            emit(adapter, "ERROR", &ErrorLine { run_id, error: e });
            return;
        }
    };

    let mut ok = true;
    let mut last_error = None;
    status.phase = Phase::Running;
    status.case_count = plan.cases.len();
    for (c, case) in plan.cases.iter().enumerate() {
        let label = format!("{}/{}", case.scenario, case.size);
        status.case_index = c;
        status.label = label.clone();
        adapter.status(&status);
        let fixture = match (ScenarioId::parse(&case.scenario), Size::parse(&case.size)) {
            (Some(scenario), Some(size)) => Ok(Arc::new(fixture_for(scenario, size))),
            (None, _) => Err(js_error(format!("Unknown scenario: {}", case.scenario))),
            (Some(_), None) => Err(js_error(format!("Unknown size: {}", case.size))),
        };
        let result = match fixture.and_then(|fixture| run_case(adapter, &plan, fixture)) {
            Ok(result) => result,
            Err(e) => {
                ok = false;
                last_error = Some(format!("{label}: {e}"));
                let _ = adapter.run_step_blocking(Step::Unmount, plan.timeout(), "unmount after error");
                CaseResult {
                    run_id,
                    app: adapter.app(),
                    scenario: &case.scenario,
                    size: &case.size,
                    fixture_hash: String::new(),
                    samples: Ordered(vec![]),
                    phases: None,
                    error: Some(e),
                }
            }
        };
        emit(adapter, "RESULT", &result);
        if let Err(e) = post_json(&base, "/case", &result) {
            emit(adapter, "ERROR", &ErrorLine { run_id, error: format!("post case: {e}") });
        }
    }

    let done = Done { run_id, app: adapter.app(), ok, error: last_error.clone(), duration_ms: adapter.now() - started };
    status.phase = if ok { Phase::Done } else { Phase::Failed };
    status.label = last_error.unwrap_or_else(|| "done".into());
    adapter.status(&status);
    emit(adapter, "DONE", &done);
    if let Err(e) = post_json(&base, "/done", &done) {
        emit(adapter, "ERROR", &ErrorLine { run_id, error: format!("post done: {e}") });
    }
}
