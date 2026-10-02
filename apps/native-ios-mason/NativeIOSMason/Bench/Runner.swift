import Foundation

// Port of scenarios/src/runner.ts. Same messages, endpoints, retry policy and sample semantics.
struct PaintTiming {
    var end: Double?
    var phases: [String: Double] = [:]
    var marks: [String: Double] = [:]
}

struct BenchError: Error, CustomStringConvertible {
    let message: String
    init(_ message: String) { self.message = message }
    var description: String { "Error: \(message)" }
}

struct RunStatus {
    var phase = "fetching"
    var caseIndex = 0
    var caseCount = 0
    var iteration = 0
    var label = ""
}

/// What each app implements (BenchAdapter in runner.ts). Callback-based so the runner can time out
/// a step without leaking a continuation.
protocol BenchAdapter: AnyObject {
    var app: String { get }
    func now() -> Double
    func info() -> [String: Any]
    func mount(_ fixture: ScenarioFixture, _ done: @escaping (PaintTiming?) -> Void)
    func mutate(_ fixture: ScenarioFixture, _ mutation: String, _ done: @escaping (PaintTiming?) -> Void)
    func unmount(_ done: @escaping () -> Void)
    func align(_ done: @escaping () -> Void)
    func gc()
    func log(_ message: String)
}

@MainActor
private func withTimeout<T>(_ ms: Double, _ what: String, _ op: (@escaping (T) -> Void) -> Void) async throws -> T {
    try await withCheckedThrowingContinuation { (cont: CheckedContinuation<T, Error>) in
        var finished = false
        let timer = DispatchWorkItem {
            if finished { return }
            finished = true
            cont.resume(throwing: BenchError("timeout after \(jsNumber(ms))ms: \(what)"))
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + ms / 1000, execute: timer)
        op { value in
            if finished { return }
            finished = true
            timer.cancel()
            cont.resume(returning: value)
        }
    }
}

private func jsNumber(_ v: Double) -> String {
    v == v.rounded() && abs(v) < 1e15 ? String(Int(v)) : String(v)
}

private func sleep(_ ms: Double) async {
    if ms <= 0 { await Task.yield(); return }
    try? await Task.sleep(nanoseconds: UInt64(ms * 1_000_000))
}

private func encode(_ body: Any) -> Data {
    (try? JSONSerialization.data(withJSONObject: body, options: [])) ?? Data("{}".utf8)
}

private func getJson<T: Decodable>(_ url: String) async throws -> T {
    guard let u = URL(string: url) else { throw BenchError("bad url \(url)") }
    var req = URLRequest(url: u)
    req.cachePolicy = .reloadIgnoringLocalCacheData
    let (data, res) = try await URLSession.shared.data(for: req)
    let status = (res as? HTTPURLResponse)?.statusCode ?? 0
    if !(200..<300).contains(status) { throw BenchError("GET \(url) → \(status)") }
    return try JSONDecoder().decode(T.self, from: data)
}

private func postJson(_ url: String, _ body: Any, attempts: Int = 4) async throws {
    let payload = encode(body)
    var i = 1
    while true {
        do {
            guard let u = URL(string: url) else { throw BenchError("bad url \(url)") }
            var req = URLRequest(url: u)
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = payload
            let (_, res) = try await URLSession.shared.data(for: req)
            let status = (res as? HTTPURLResponse)?.statusCode ?? 0
            if !(200..<300).contains(status) { throw BenchError("POST \(url) → \(status)") }
            return
        } catch {
            if i >= attempts { throw error }
            await sleep(500 * pow(2, Double(i - 1)))
            i += 1
        }
    }
}

private func emit(_ adapter: BenchAdapter, _ kind: String, _ payload: Any) {
    let text = String(data: encode(payload), encoding: .utf8) ?? "{}"
    adapter.log("\(LOG_PREFIX)_\(kind) \(text)")
}

private func errorString(_ e: Error) -> String {
    if let b = e as? BenchError { return b.description }
    if let f = e as? FixtureError { return f.description }
    return "Error: \(e.localizedDescription)"
}

@MainActor
func runCase(_ adapter: BenchAdapter, _ plan: Plan, _ fixture: ScenarioFixture,
             onIteration: ((Int) -> Void)? = nil) async throws -> [String: Any] {
    let def = getScenario(fixture.scenario)!
    var samples: [String: [Double]] = ["mount": [], "unmount": []]
    for m in def.mutations { samples[m] = [] }
    var phases: [String: [Double]] = [:]
    let label = "\(fixture.scenario)/\(fixture.size)"

    func record(_ series: String, _ t0: Double, _ end: Double, _ timing: PaintTiming?, _ measured: Bool) {
        if !measured { return }
        samples[series, default: []].append(end - t0)
        guard let timing else { return }
        for (k, v) in timing.phases { phases["\(series).\(k)", default: []].append(v) }
        for (k, v) in timing.marks { phases["\(series).\(k)", default: []].append(v - t0) }
    }

    func align() async throws {
        let _: Void = try await withTimeout(plan.timeoutMs, "\(label) align") { done in adapter.align { done(()) } }
    }

    let total = plan.warmup + plan.iterations
    for i in 0..<total {
        onIteration?(i)
        let measured = i >= plan.warmup

        try await align()
        var t0 = adapter.now()
        var timing: PaintTiming? = try await withTimeout(plan.timeoutMs, "\(label) mount") { done in adapter.mount(fixture, done) }
        record("mount", t0, timing?.end ?? adapter.now(), timing, measured)

        for m in def.mutations {
            try await align()
            t0 = adapter.now()
            timing = try await withTimeout(plan.timeoutMs, "\(label) \(m)") { done in adapter.mutate(fixture, m, done) }
            record(m, t0, timing?.end ?? adapter.now(), timing, measured)
        }

        try await align()
        t0 = adapter.now()
        let _: Void = try await withTimeout(plan.timeoutMs, "\(label) unmount") { done in adapter.unmount { done(()) } }
        record("unmount", t0, adapter.now(), nil, measured)

        adapter.gc()
        await sleep(plan.cooldownMs)
    }

    var result: [String: Any] = [
        "runId": plan.runId,
        "app": plan.app,
        "scenario": fixture.scenario,
        "size": fixture.size,
        "fixtureHash": fixture.hash,
        "samples": samples,
    ]
    if !phases.isEmpty { result["phases"] = phases }
    return result
}

@MainActor
func runPlan(_ adapter: BenchAdapter, host: String, runId: String, onStatus: ((RunStatus) -> Void)? = nil) async {
    let base = "http://\(host)"
    let started = adapter.now()
    var status = RunStatus()
    func update(_ patch: (inout RunStatus) -> Void = { _ in }) {
        patch(&status)
        onStatus?(status)
    }
    update()

    let plan: Plan
    do {
        let encoded = runId.addingPercentEncoding(withAllowedCharacters: .alphanumerics.union(CharacterSet(charactersIn: "-_.!~*'()"))) ?? runId
        plan = try await getJson("\(base)/plan?run=\(encoded)")
        if plan.protocol != PROTOCOL_VERSION {
            throw BenchError("protocol mismatch: app \(PROTOCOL_VERSION), harness \(plan.protocol)")
        }
        var info = adapter.info()
        info["runId"] = runId
        info["app"] = adapter.app
        info["startedAt"] = Int64((Date().timeIntervalSince1970 * 1000).rounded(.down))
        try await postJson("\(base)/hello", info)
    } catch {
        let msg = errorString(error)
        update { $0.phase = "failed"; $0.label = msg }
        emit(adapter, "ERROR", ["runId": runId, "error": msg])
        return
    }

    var ok = true
    var lastError: String?
    update { $0.phase = "running"; $0.caseCount = plan.cases.count }
    for (c, pc) in plan.cases.enumerated() {
        let scenario = pc.scenario, size = pc.size
        update { $0.caseIndex = c; $0.iteration = 0; $0.label = "\(scenario)/\(size)" }
        var result: [String: Any]
        do {
            let fixture = try fixtureFor(scenario, size)
            result = try await runCase(adapter, plan, fixture) { i in update { $0.iteration = i } }
        } catch {
            ok = false
            let msg = errorString(error)
            lastError = "\(scenario)/\(size): \(msg)"
            result = [
                "runId": runId, "app": adapter.app, "scenario": scenario, "size": size,
                "fixtureHash": "", "samples": [String: Any](), "error": msg,
            ]
            let _: Void? = try? await withTimeout(plan.timeoutMs, "unmount after error") { done in adapter.unmount { done(()) } }
        }
        emit(adapter, "RESULT", result)
        do {
            try await postJson("\(base)/case", result)
        } catch {
            emit(adapter, "ERROR", ["runId": runId, "error": "post case: \(errorString(error))"])
        }
    }

    var done: [String: Any] = ["runId": runId, "app": adapter.app, "ok": ok, "durationMs": adapter.now() - started]
    if let lastError { done["error"] = lastError }
    update { $0.phase = ok ? "done" : "failed"; $0.label = lastError ?? "done" }
    emit(adapter, "DONE", done)
    do {
        try await postJson("\(base)/done", done)
    } catch {
        emit(adapter, "ERROR", ["runId": runId, "error": "post done: \(errorString(error))"])
    }
}
