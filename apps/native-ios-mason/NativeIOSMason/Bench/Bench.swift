import Mason
import UIKit

/// The BenchAdapter for UIKit + Mason (no NativeScript, no JS).
///
/// "Painted" is defined as in native-ios: the sentinel's layoutSubviews, then one CADisplayLink
/// tick. The sentinel is a plain UIView, a leaf of the Mason tree after every other node of the
/// scenario. After a mount or mutation it and the scroll host get setNeedsLayout. Core Animation
/// lays layers out top-down and depth-first in the commit that follows, so the host's
/// layoutSubviews runs first and does the Mason pass (compute + applying every frame, sentinel
/// included); then the Mason views' own layoutSubviews run (text views, shadows, the root's
/// autoComputeIfRoot, which finds the compute already applied), and the sentinel's layoutSubviews
/// runs once everything before it has been placed. That callback records the `layout` mark; the
/// next CADisplayLink tick (the commit, text drawing included, has been handed to the render
/// server) is the end of the sample.
final class Bench: BenchAdapter {
    let app = "native-ios-mason"
    private weak var vc: RootViewController?
    private var current: MountedScenario?
    private var list: ListController?
    private var pending: ((PaintTiming?) -> Void)?
    /// One sentinel for every mount: a plain view stays in Mason's view-to-node map for good.
    private lazy var sentinel = makeSentinel()

    init(_ vc: RootViewController) { self.vc = vc }

    func now() -> Double { CACurrentMediaTime() * 1000 }

    func info() -> [String: Any] {
        let os = UIDevice.current.systemVersion
        let masonVersion = Bundle.main.object(forInfoDictionaryKey: "XPBMasonVersion") as? String ?? "unknown"
        var info: [String: Any] = [
            "platform": "ios",
            "osVersion": os,
            "deviceModel": Self.model(),
            "framework": ["Mason": masonVersion, "UIKit": os],
        ]
        if let w = vc?.view.window?.bounds.width ?? vc?.view.bounds.width { info["screenWidth"] = Double(w) }
        return info
    }

    private static func model() -> String {
        if let sim = ProcessInfo.processInfo.environment["SIMULATOR_MODEL_IDENTIFIER"] { return "\(sim) (simulator)" }
        var u = utsname()
        uname(&u)
        return withUnsafeBytes(of: &u.machine) { String(decoding: $0.prefix { $0 != 0 }, as: UTF8.self) }
    }

    private func painted() {
        guard let done = pending else { return }
        pending = nil
        let layout = now()
        FrameClock.shared.next { [self] in
            done(PaintTiming(end: now(), marks: ["layout": layout]))
        }
    }

    func mount(_ fixture: ScenarioFixture, _ done: @escaping (PaintTiming?) -> Void) {
        guard let vc else { return }
        vc.hideHome()
        pending = done
        if case .list(let d) = fixture.data {
            let l = ListController(d)
            list = l
            l.table.onLayout = { [weak self] in self?.painted() }
            vc.showList(l.table)
            l.table.setNeedsLayout()
            return
        }
        let s = buildScenario(fixture, sentinel: sentinel)
        current = s
        sentinel.onLayout = { [weak self] in self?.painted() }
        vc.host.setRoot(s.root)
        sentinel.setNeedsLayout()
        vc.host.setNeedsLayout()
    }

    func mutate(_ fixture: ScenarioFixture, _ mutation: String, _ done: @escaping (PaintTiming?) -> Void) {
        guard let s = current, let vc else { return done(nil) }
        pending = done
        s.mutate(mutation)
        sentinel.setNeedsLayout()
        vc.host.setNeedsLayout()
    }

    func unmount(_ done: @escaping () -> Void) {
        pending = nil
        if let s = current {
            sentinel.onLayout = nil
            // Detaching queues a (weak) layout pass on the old root; dropping every reference in
            // the same turn frees the tree first, so that pass never runs.
            s.detachSentinel()
            vc?.host.setRoot(nil)
            current = nil
        }
        if let l = list {
            l.table.onLayout = nil
            vc?.hideList(l.table)
            list = nil
        }
        FrameClock.shared.frames(2, done)
    }

    func align(_ done: @escaping () -> Void) { FrameClock.shared.next(done) }

    func gc() {}

    func log(_ message: String) { NSLog("%@", message) }

    // MARK: launch handling

    func show(_ scenario: String, _ size: String) {
        guard let f = try? fixtureFor(scenario, size) else { return }
        vc?.setStatus("\(app) · \(scenario)/\(size)")
        unmount { [self] in
            let t0 = now()
            mount(f) { [self] _ in
                vc?.setStatus("\(app) · \(scenario)/\(size) · \(String(format: "%.1f", now() - t0)) ms")
            }
        }
    }

    func handle(_ url: String?) {
        guard let cmd = parseLaunchUrl(url) else { return }
        switch cmd {
        case .show(let scenario, let size):
            show(scenario, size)
        case .run(let host, let runId):
            vc?.hideHome()
            Task { @MainActor in
                await runPlan(self, host: host, runId: runId) { [weak self] s in
                    guard let self, s.iteration == 0 else { return }
                    self.vc?.setStatus("\(self.app) · \(s.phase) \(s.caseIndex + 1)/\(s.caseCount) \(s.label)")
                }
            }
        }
    }
}
