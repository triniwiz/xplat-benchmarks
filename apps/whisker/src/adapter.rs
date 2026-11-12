use std::cell::{Cell, RefCell};
use std::sync::{Arc, OnceLock, mpsc};
use std::time::Duration;

use whisker::prelude::*;
use whisker::runtime::view::{observe_layout, on_next_frame_applied};
use whisker::{Element, RuntimeDispatcher};

use crate::bench::generate::ScenarioFixture;
use crate::bench::runner::{self, DeviceInfo, Mark, Ordered, Phase, RunStatus, Step, StepTiming};
use crate::bench::scenarios::Mutation;
use crate::host;

pub const APP_ID: &str = "whisker";

#[derive(Clone)]
pub struct Mounted {
    pub generation: u64,
    pub fixture: Arc<ScenarioFixture>,
}

impl PartialEq for Mounted {
    fn eq(&self, other: &Self) -> bool {
        self.generation == other.generation
    }
}

#[derive(Clone, Copy)]
pub struct AppState {
    pub mounted: RwSignal<Option<Mounted>>,
    pub status: RwSignal<String>,
    pub shrunk: RwSignal<bool>,
    pub restyled: RwSignal<bool>,
    pub inserted: RwSignal<bool>,
    pub frame_forcer: RwSignal<bool>,
}

type Reply = Box<dyn FnOnce(StepTiming)>;

struct Pending {
    t0_ms: f64,
    reply: Reply,
}

thread_local! {
    static STATE: Cell<Option<AppState>> = const { Cell::new(None) };
    static DISPATCHER: RefCell<Option<RuntimeDispatcher>> = const { RefCell::new(None) };
    static FRAME_FORCER: Cell<Option<Element>> = const { Cell::new(None) };
    static PENDING: RefCell<Option<Pending>> = const { RefCell::new(None) };
    static JOBS: RefCell<Vec<Box<dyn FnOnce()>>> = const { RefCell::new(Vec::new()) };
    static GENERATION: Cell<u64> = const { Cell::new(0) };
}

static SCREEN_WIDTH: OnceLock<Option<f32>> = OnceLock::new();

pub fn init(dispatcher: RuntimeDispatcher, screen_width: Option<f32>) -> AppState {
    let _ = SCREEN_WIDTH.set(screen_width);
    let state = AppState {
        mounted: signal(None),
        status: signal(format!("{APP_ID} · ready")),
        shrunk: signal(false),
        restyled: signal(false),
        inserted: signal(false),
        frame_forcer: signal(false),
    };
    STATE.set(Some(state));
    DISPATCHER.replace(Some(dispatcher));
    state
}

pub fn state() -> AppState {
    STATE.get().expect("adapter::init ran")
}

pub fn set_frame_forcer(element: Element) {
    FRAME_FORCER.set(Some(element));
}

// Closures posted while the runtime drains its dispatch queue run in that same drain, so frame
// waits post only from the present phase, when the queue is next drained on the following vsync.
fn post_local(job: impl FnOnce() + 'static) {
    JOBS.with_borrow_mut(|jobs| jobs.push(Box::new(job)));
    DISPATCHER.with_borrow(|d| {
        if let Some(d) = d {
            d.post(|| {
                for job in JOBS.take() {
                    job();
                }
            });
        }
    });
}

fn force_frame_then(job: impl FnOnce() + 'static) {
    let state = state();
    state.frame_forcer.update(|t| *t = !*t);
    let frame_forcer = FRAME_FORCER.get().expect("frame forcer is mounted");
    let registered = on_next_frame_applied(frame_forcer, move |_| job());
    assert!(registered, "renderer supports frame-applied callbacks");
}

fn next_tick(job: impl FnOnce() + 'static) {
    force_frame_then(move || post_local(job));
}

pub fn sentinel(element: Element) -> Element {
    observe_layout(element, Box::new(move |_| sentinel_layout(element)));
    element
}

fn sentinel_layout(element: Element) {
    let Some(pending) = PENDING.take() else { return };
    let layout = host::now();
    let finish = move || {
        let end = host::now();
        (pending.reply)(StepTiming { t0_ms: pending.t0_ms, end_ms: end, marks: vec![Mark { name: "layout", at_ms: layout }] });
    };
    let registered = on_next_frame_applied(element, move |_| post_local(finish));
    assert!(registered, "renderer supports frame-applied callbacks");
}

fn apply_mutation(state: AppState, mutation: Mutation) {
    match mutation {
        Mutation::Shrink => state.shrunk.set(true),
        Mutation::Grow => state.shrunk.set(false),
        Mutation::Restyle => state.restyled.set(true),
        Mutation::Restore => state.restyled.set(false),
        Mutation::Insert => state.inserted.set(true),
        Mutation::Remove => state.inserted.set(false),
    }
}

pub fn begin(step: Step, reply: Reply) {
    let state = state();
    let t0_ms = host::now();
    match step {
        Step::Align => force_frame_then(move || {
            let now = host::now();
            reply(StepTiming { t0_ms: now, end_ms: now, marks: vec![] });
        }),
        Step::Mount(fixture) => {
            PENDING.replace(Some(Pending { t0_ms, reply }));
            state.shrunk.set(false);
            state.restyled.set(false);
            state.inserted.set(false);
            let generation = GENERATION.get() + 1;
            GENERATION.set(generation);
            state.mounted.set(Some(Mounted { generation, fixture }));
        }
        Step::Mutate(mutation) => {
            PENDING.replace(Some(Pending { t0_ms, reply }));
            apply_mutation(state, mutation);
        }
        Step::Unmount => {
            PENDING.take();
            state.mounted.set(None);
            next_tick(move || {
                next_tick(move || reply(StepTiming { t0_ms, end_ms: host::now(), marks: vec![] }));
            });
        }
    }
}

pub fn show(fixture: Arc<ScenarioFixture>) {
    let label = format!("{APP_ID} · {}/{}", fixture.scenario.as_str(), fixture.size.as_str());
    begin(
        Step::Mount(fixture),
        Box::new(move |t| state().status.set(format!("{label} · {:.1} ms", t.end_ms - t.t0_ms))),
    );
}

pub struct WorkerAdapter {
    pub dispatcher: RuntimeDispatcher,
}

impl runner::Adapter for WorkerAdapter {
    fn app(&self) -> &'static str {
        APP_ID
    }

    fn now(&self) -> f64 {
        host::now()
    }

    fn info(&self) -> DeviceInfo {
        DeviceInfo {
            platform: "android",
            os_version: host::os_version(),
            device_model: host::device_model(),
            framework: Ordered(vec![("whisker".into(), env!("XPLATBENCH_WHISKER_VERSION").into())]),
            screen_width: SCREEN_WIDTH.get().copied().flatten().map(f64::from),
        }
    }

    fn run_step_blocking(&self, step: Step, timeout: Duration, what: &str) -> Result<StepTiming, String> {
        let (tx, rx) = mpsc::channel();
        let posted = self.dispatcher.post(move || {
            begin(step, Box::new(move |t| drop(tx.send(t))));
        });
        if !posted {
            return Err("Error: Whisker runtime is gone".into());
        }
        rx.recv_timeout(timeout).map_err(|_| format!("Error: timeout after {}ms: {what}", timeout.as_millis()))
    }

    fn status(&self, status: &RunStatus) {
        let phase = match status.phase {
            Phase::Fetching => "fetching",
            Phase::Running => "running",
            Phase::Done => "done",
            Phase::Failed => "failed",
        };
        let text = match status.phase {
            Phase::Running => format!("{APP_ID} · {phase} {}/{} {}", status.case_index + 1, status.case_count, status.label),
            Phase::Fetching | Phase::Done | Phase::Failed => format!("{APP_ID} · {phase} {}", status.label),
        };
        self.dispatcher.post(move || state().status.set(text));
    }

    fn log(&self, line: &str) {
        host::log(line);
    }
}
