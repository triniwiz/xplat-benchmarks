import SwiftUI
import UIKit

/// The BenchAdapter for SwiftUI.
///
/// "Painted", as in native-ios: a mount or mutation changes SwiftUI state and bumps the scenario's
/// LayoutProbe generation in the same transaction. The sentinel (last child of the scenario root, a
/// 1pt UIViewRepresentable) gets that generation in updateUIView during SwiftUI's update and marks
/// itself with setNeedsLayout. The hosting view runs the SwiftUI update and layout in its own
/// layoutSubviews, and Core Animation lays layers out top-down, depth-first, so the sentinel's
/// layoutSubviews runs after SwiftUI has placed the whole tree. That callback records the `layout`
/// mark; the next CADisplayLink tick (the commit has been handed to the render server) ends the sample.
final class Bench: BenchAdapter {
    let app = "native-ios-swiftui"
    private let model: AppModel
    weak var host: UIViewController?
    private var current: MountedScenario?
    private var pending: ((PaintTiming?) -> Void)?

    init(_ model: AppModel) { self.model = model }

    func now() -> Double { CACurrentMediaTime() * 1000 }

    func info() -> [String: Any] {
        let os = UIDevice.current.systemVersion
        var info: [String: Any] = [
            "platform": "ios",
            "osVersion": os,
            "deviceModel": Self.model(),
            "framework": ["SwiftUI": os],
        ]
        if let w = host?.view.window?.bounds.width ?? host?.view.bounds.width { info["screenWidth"] = Double(w) }
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
        let s = buildScenario(fixture)
        current = s
        pending = done
        s.probe.onLayout = { [weak self] in self?.painted() }
        model.home = false
        if s.isList { model.list = s } else { model.scenario = s }
    }

    func mutate(_ fixture: ScenarioFixture, _ mutation: String, _ done: @escaping (PaintTiming?) -> Void) {
        guard let s = current, !s.isList else { return done(nil) }
        s.mutate(mutation)
        s.probe.gen += 1
        pending = done
    }

    func unmount(_ done: @escaping () -> Void) {
        pending = nil
        if let s = current {
            s.probe.onLayout = nil
            current = nil
        }
        model.scenario = nil
        model.list = nil
        FrameClock.shared.frames(2, done)
    }

    func align(_ done: @escaping () -> Void) { FrameClock.shared.next(done) }

    func gc() {}

    func log(_ message: String) { NSLog("%@", message) }

    // MARK: launch handling

    private func setStatus(_ text: String) { model.status = text }

    func show(_ scenario: String, _ size: String) {
        guard let f = try? fixtureFor(scenario, size) else { return }
        setStatus("\(app) · \(scenario)/\(size)")
        unmount { [self] in
            let t0 = now()
            mount(f) { [self] _ in
                setStatus("\(app) · \(scenario)/\(size) · \(String(format: "%.1f", now() - t0)) ms")
            }
        }
    }

    func handle(_ url: String?) {
        guard let cmd = parseLaunchUrl(url) else { return }
        switch cmd {
        case .show(let scenario, let size):
            show(scenario, size)
        case .run(let host, let runId):
            model.home = false
            Task { @MainActor in
                await runPlan(self, host: host, runId: runId) { [weak self] s in
                    guard let self, s.iteration == 0 else { return }
                    self.setStatus("\(self.app) · \(s.phase) \(s.caseIndex + 1)/\(s.caseCount) \(s.label)")
                }
            }
        }
    }
}
