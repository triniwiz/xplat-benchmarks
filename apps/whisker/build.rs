fn main() {
    println!("cargo:rerun-if-changed=Cargo.lock");
    let lock = std::fs::read_to_string("Cargo.lock").unwrap_or_default();
    let version = lock
        .split("[[package]]")
        .find(|p| p.lines().any(|l| l.trim() == "name = \"whisker\""))
        .and_then(|p| p.lines().find_map(|l| l.trim().strip_prefix("version = \"")))
        .map(|v| v.trim_end_matches('"').to_string())
        .unwrap_or_else(|| "unknown".into());
    println!("cargo:rustc-env=XPLATBENCH_WHISKER_VERSION={version}");
}
