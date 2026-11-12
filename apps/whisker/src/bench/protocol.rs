use super::scenarios::{ScenarioId, Size};

pub const PROTOCOL_VERSION: u32 = 1;
pub const LOG_PREFIX: &str = "XPLATBENCH";

#[derive(Debug, PartialEq, Eq)]
pub enum LaunchCommand {
    Run { host: String, run_id: String },
    Show { scenario: ScenarioId, size: Size },
}

pub fn parse_launch_url(url: &str) -> Option<LaunchCommand> {
    let rest = url.trim().strip_prefix("xplatbench")?;
    let (scheme_suffix, rest) = rest.split_once("://")?;
    if let Some(suffix) = scheme_suffix.strip_prefix('-') {
        if suffix.is_empty() || !suffix.bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-') {
            return None;
        }
    } else if !scheme_suffix.is_empty() {
        return None;
    }
    let (path, query) = rest.split_once('?').unwrap_or((rest, ""));
    let mode = path.strip_suffix('/').unwrap_or(path);
    if mode.is_empty() || !mode.bytes().all(|b| b.is_ascii_lowercase()) {
        return None;
    }
    let mut host = None;
    let mut run = None;
    let mut scenario = None;
    let mut size = None;
    for pair in query.split('&').filter(|p| !p.is_empty()) {
        let (k, v) = pair.split_once('=').unwrap_or((pair, ""));
        let value = decode_uri_component(v)?;
        match decode_uri_component(k)?.as_str() {
            "host" => host = Some(value),
            "run" => run = Some(value),
            "scenario" => scenario = Some(value),
            "size" => size = Some(value),
            _ => {}
        }
    }
    match mode {
        "run" => match (host, run) {
            (Some(host), Some(run_id)) if !host.is_empty() && !run_id.is_empty() => {
                Some(LaunchCommand::Run { host, run_id })
            }
            _ => None,
        },
        "show" => {
            let scenario = ScenarioId::parse(&scenario?)?;
            let size = match size {
                Some(s) => Size::parse(&s)?,
                None => Size::M,
            };
            Some(LaunchCommand::Show { scenario, size })
        }
        _ => None,
    }
}

fn decode_uri_component(s: &str) -> Option<String> {
    let bytes = s.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%' {
            let hex = std::str::from_utf8(bytes.get(i + 1..i + 3)?).ok()?;
            out.push(u8::from_str_radix(hex, 16).ok()?);
            i += 3;
        } else {
            out.push(bytes[i]);
            i += 1;
        }
    }
    String::from_utf8(out).ok()
}

pub fn encode_uri_component(s: &str) -> String {
    s.bytes()
        .map(|b| match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'!' | b'~' | b'*' | b'\'' | b'(' | b')' => {
                (b as char).to_string()
            }
            _ => format!("%{b:02X}"),
        })
        .collect()
}
