use std::collections::HashMap;

use serde::Deserialize;
use xplatbench_whisker::bench::generate::fixture_for;
use xplatbench_whisker::bench::protocol::{LaunchCommand, parse_launch_url};
use xplatbench_whisker::bench::scenarios::{SCENARIOS, SIZES, ScenarioId, Size};

#[derive(Deserialize)]
struct ManifestEntry {
    hash: String,
}

#[test]
fn every_fixture_hash_matches_the_manifest() {
    let path = concat!(env!("CARGO_MANIFEST_DIR"), "/../../scenarios/fixtures/manifest.json");
    let manifest: HashMap<String, ManifestEntry> =
        serde_json::from_str(&std::fs::read_to_string(path).expect("read manifest")).expect("parse manifest");
    let mut mismatches = Vec::new();
    for scenario in SCENARIOS {
        for size in SIZES {
            let key = format!("{}/{}", scenario.as_str(), size.as_str());
            let actual = fixture_for(scenario, size).hash;
            match manifest.get(&key) {
                Some(entry) if entry.hash == actual => {}
                Some(entry) => mismatches.push(format!("{key}: {actual} != manifest {}", entry.hash)),
                None => mismatches.push(format!("{key}: missing from manifest")),
            }
        }
    }
    assert!(mismatches.is_empty(), "{}", mismatches.join("\n"));
    assert_eq!(manifest.len(), SCENARIOS.len() * SIZES.len());
}

#[test]
fn launch_urls_parse_like_protocol_ts() {
    assert_eq!(
        parse_launch_url("xplatbench://run?host=127.0.0.1%3A9797&run=r1-whisker-abc"),
        Some(LaunchCommand::Run { host: "127.0.0.1:9797".into(), run_id: "r1-whisker-abc".into() })
    );
    assert_eq!(
        parse_launch_url("xplatbench-whisker://show?scenario=relayout-style&size=S"),
        Some(LaunchCommand::Show { scenario: ScenarioId::RelayoutStyle, size: Size::S })
    );
    assert_eq!(
        parse_launch_url("xplatbench://show?scenario=text-flow"),
        Some(LaunchCommand::Show { scenario: ScenarioId::TextFlow, size: Size::M })
    );
    assert_eq!(parse_launch_url("xplatbench://show?scenario=nope&size=S"), None);
    assert_eq!(parse_launch_url("xplatbench://show?scenario=text-flow&size=XL"), None);
    assert_eq!(parse_launch_url("xplatbench://run?host=127.0.0.1%3A9797"), None);
    assert_eq!(parse_launch_url("https://run?host=a&run=b"), None);
}
