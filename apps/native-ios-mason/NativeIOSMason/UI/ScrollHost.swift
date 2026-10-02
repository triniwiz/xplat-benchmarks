import Mason
import UIKit

/// The vertical scroll host: a UIScrollView whose one subview is the scenario's Mason root.
///
/// The host drives the root the way a NativeScript ScrollView drives a Mason root: in its own
/// layoutSubviews it computes the root at its width with a max-content height
/// (computeWithSize(width, -2), which also applies every frame in the tree), marks the compute
/// as applied so the root's own layoutSubviews (Mason's autoComputeIfRoot) doesn't lay it out
/// again, and sizes the scroll content to the root.
final class ScrollHost: UIScrollView {
    private(set) var root: MasonUIView?

    func setRoot(_ view: MasonUIView?) {
        root?.removeFromSuperview()
        root = view
        if let view { addSubview(view) }
        contentOffset = .zero
        setNeedsLayout()
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        guard let root else { return }
        let width = bounds.width
        guard width > 0 else { return }
        // Scrolling also lands here; only a dirty tree or a new width needs a pass.
        guard root.isNodeDirty() || !laidOut(root, at: width) else { return }
        let w = px(Float(width))
        root.computeWithSize(w, -2)
        root.markRootComputeApplied(w, -2)
        let size = CGSize(width: width, height: CGFloat(root.node.computedLayout.height / NSCMason.scale))
        if root.frame != CGRect(origin: .zero, size: size) { root.frame = CGRect(origin: .zero, size: size) }
        if contentSize != size { contentSize = size }
    }
}

/// Whether `root` (width: 100%) was last laid out at `width` points.
func laidOut(_ root: MasonUIView, at width: CGFloat) -> Bool {
    let layout = root.node.computedLayout
    return abs(CGFloat(layout.width / NSCMason.scale) - width) < 0.25
}
