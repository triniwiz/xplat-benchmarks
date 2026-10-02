import UIKit

/// requestAnimationFrame for UIKit: callbacks run on the next CADisplayLink tick.
final class FrameClock: NSObject {
    static let shared = FrameClock()
    private var link: CADisplayLink?
    private var callbacks: [() -> Void] = []

    func next(_ cb: @escaping () -> Void) {
        callbacks.append(cb)
        if link == nil {
            let l = CADisplayLink(target: self, selector: #selector(tick))
            l.add(to: .main, forMode: .common)
            link = l
        }
        link?.isPaused = false
    }

    func frames(_ n: Int, _ cb: @escaping () -> Void) {
        if n <= 0 { return cb() }
        next { self.frames(n - 1, cb) }
    }

    @objc private func tick() {
        let cbs = callbacks
        callbacks = []
        for cb in cbs { cb() }
        if callbacks.isEmpty { link?.isPaused = true }
    }
}
