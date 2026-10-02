import SwiftUI
import Observation

/// Shared between a scenario's state and its sentinel. `gen` is bumped in the same transaction
/// as a mutation; the sentinel only reports once SwiftUI has applied that generation.
@Observable
final class LayoutProbe {
    var gen = 0
    @ObservationIgnored var onLayout: (() -> Void)?
}

#if canImport(UIKit)
import UIKit

/// The UIView behind the sentinel. Its layoutSubviews is the "painted" hook, as in native-ios.
final class SentinelUIView: UIView {
    var gen = -1
    weak var probe: LayoutProbe?

    override func layoutSubviews() {
        super.layoutSubviews()
        guard window != nil, let probe, gen == probe.gen else { return }
        probe.onLayout?()
    }
}

private struct SentinelRep: UIViewRepresentable {
    let probe: LayoutProbe
    let gen: Int

    func makeUIView(context: Context) -> SentinelUIView {
        let v = SentinelUIView()
        v.backgroundColor = UIColor(C.bg)
        v.isUserInteractionEnabled = false
        update(v)
        return v
    }

    func updateUIView(_ v: SentinelUIView, context: Context) { update(v) }

    // Runs inside SwiftUI's update, after this generation's state is in the graph; the layout pass
    // that follows reaches the sentinel only after the hosting view has laid out the whole tree.
    private func update(_ v: SentinelUIView) {
        v.probe = probe
        if v.gen != gen {
            v.gen = gen
            v.setNeedsLayout()
        }
    }

    // Fixed size, so SwiftUI never measures (and lays out) the UIView itself.
    func sizeThatFits(_ proposal: ProposedViewSize, uiView: SentinelUIView, context: Context) -> CGSize? {
        CGSize(width: proposal.width ?? 1, height: 1)
    }
}

/// The 1pt sentinel. Reading `probe.gen` here keeps the invalidation to this one small view.
struct Sentinel: View {
    let probe: LayoutProbe

    var body: some View {
        SentinelRep(probe: probe, gen: probe.gen).frame(height: 1)
    }
}
#else
struct Sentinel: View {
    let probe: LayoutProbe
    var body: some View { C.bg.frame(height: 1) }
}
#endif
