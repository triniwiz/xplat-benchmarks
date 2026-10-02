import UIKit

/// CSS `flex-direction: row; flex-wrap: wrap` (UIKit has no wrapping stack). Not virtualized:
/// every item is a real subview. Items are measured once with Auto Layout
/// (`systemLayoutSizeFitting` at their fixed width), packed into lines, and stretched to the
/// line height (`align-items: stretch`). Height is reported through intrinsicContentSize.
final class WrapView: UIView {
    let padding: CGFloat
    let itemWidth: CGFloat
    let itemMargin: CGFloat
    private(set) var items: [UIView] = []
    private var heights: [CGFloat] = []
    private var packedWidth: CGFloat = -1
    private var packedHeight: CGFloat = 0

    init(padding: CGFloat, itemWidth: CGFloat, itemMargin: CGFloat) {
        self.padding = padding
        self.itemWidth = itemWidth
        self.itemMargin = itemMargin
        super.init(frame: .zero)
        translatesAutoresizingMaskIntoConstraints = false
        setContentHuggingPriority(.required, for: .vertical)
        setContentCompressionResistancePriority(.required, for: .vertical)
    }

    required init?(coder: NSCoder) { fatalError() }

    func insert(_ views: [UIView], at index: Int) {
        let measured = views.map(measure)
        for v in views {
            v.translatesAutoresizingMaskIntoConstraints = true
            addSubview(v)
        }
        items.insert(contentsOf: views, at: index)
        heights.insert(contentsOf: measured, at: index)
        invalidate()
    }

    func remove(_ range: Range<Int>) {
        for v in items[range] { v.removeFromSuperview() }
        items.removeSubrange(range)
        heights.removeSubrange(range)
        invalidate()
    }

    private func invalidate() {
        packedWidth = -1
        invalidateIntrinsicContentSize()
        setNeedsLayout()
    }

    private func measure(_ v: UIView) -> CGFloat {
        v.systemLayoutSizeFitting(CGSize(width: itemWidth, height: 0),
                                  withHorizontalFittingPriority: .required,
                                  verticalFittingPriority: .fittingSizeLevel).height
    }

    /// Before the first layout our own width is unknown, so use the nearest laid-out ancestor's
    /// width (the scroll host content). Width flows top-down here exactly as in a CSS block.
    private func resolvedWidth() -> CGFloat {
        if bounds.width > 0 { return bounds.width }
        var v = superview
        while let s = v {
            if s.bounds.width > 0 { return s.bounds.width }
            v = s.superview
        }
        return 0
    }

    @discardableResult
    private func pack(_ width: CGFloat, apply: Bool) -> CGFloat {
        let avail = width - 2 * padding
        let outer = itemWidth + 2 * itemMargin
        var y = padding
        var i = 0
        let n = items.count
        while i < n {
            var x: CGFloat = 0
            var j = i
            var lineH: CGFloat = 0
            while j < n && (j == i || x + outer <= avail + 0.001) {
                lineH = max(lineH, heights[j])
                x += outer
                j += 1
            }
            if apply {
                var cx = padding
                for k in i..<j {
                    items[k].frame = CGRect(x: cx + itemMargin, y: y + itemMargin, width: itemWidth, height: lineH)
                    cx += outer
                }
            }
            y += lineH + 2 * itemMargin
            i = j
        }
        return y + padding
    }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil { invalidate() }
    }

    override var intrinsicContentSize: CGSize {
        if window == nil && bounds.width == 0 { return CGSize(width: UIView.noIntrinsicMetric, height: 0) }
        let w = resolvedWidth()
        if w != packedWidth {
            packedHeight = pack(w, apply: false)
            packedWidth = w
        }
        return CGSize(width: UIView.noIntrinsicMetric, height: packedHeight)
    }

    override func sizeThatFits(_ size: CGSize) -> CGSize {
        CGSize(width: size.width, height: pack(size.width, apply: false))
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        let w = bounds.width
        let h = pack(w, apply: true)
        if w != packedWidth || h != packedHeight {
            packedWidth = w
            packedHeight = h
            invalidateIntrinsicContentSize()
        }
    }
}
