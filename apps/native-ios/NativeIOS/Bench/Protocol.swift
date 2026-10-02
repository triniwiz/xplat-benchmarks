import Foundation

// Port of scenarios/src/protocol.ts (the parts the app needs).
let PROTOCOL_VERSION = 1
let LOG_PREFIX = "XPLATBENCH"

struct PlanCase: Decodable { let scenario: String; let size: String }

struct Plan: Decodable {
    let `protocol`: Int
    let runId: String
    let app: String
    let warmup: Int
    let iterations: Int
    let cooldownMs: Double
    let timeoutMs: Double
    let profile: Bool?
    let cases: [PlanCase]
}

enum LaunchCommand {
    case run(host: String, runId: String)
    case show(scenario: String, size: String)
}

func parseLaunchUrl(_ url: String?) -> LaunchCommand? {
    guard let url = url?.trimmingCharacters(in: .whitespacesAndNewlines), !url.isEmpty else { return nil }
    let re = try! NSRegularExpression(pattern: "^xplatbench(?:-[a-z0-9-]+)?://([a-z]+)/?(?:\\?(.*))?$")
    let ns = url as NSString
    guard let m = re.firstMatch(in: url, range: NSRange(location: 0, length: ns.length)) else { return nil }
    let mode = ns.substring(with: m.range(at: 1))
    var query: [String: String] = [:]
    if m.range(at: 2).location != NSNotFound {
        for pair in ns.substring(with: m.range(at: 2)).split(separator: "&", omittingEmptySubsequences: true) {
            let s = String(pair)
            if let i = s.firstIndex(of: "=") {
                let k = String(s[..<i]).removingPercentEncoding ?? String(s[..<i])
                let v = String(s[s.index(after: i)...])
                query[k] = v.removingPercentEncoding ?? v
            } else {
                query[s.removingPercentEncoding ?? s] = ""
            }
        }
    }
    if mode == "run", let host = query["host"], !host.isEmpty, let run = query["run"], !run.isEmpty {
        return .run(host: host, runId: run)
    }
    if mode == "show", let sc = query["scenario"], getScenario(sc) != nil {
        let size = query["size"] ?? "M"
        if SIZES.contains(size) { return .show(scenario: sc, size: size) }
    }
    return nil
}
