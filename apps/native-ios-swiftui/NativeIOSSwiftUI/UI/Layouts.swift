import SwiftUI

/// CSS `flex-direction: row; flex-wrap: wrap` with fixed-width items and `align-items: stretch`,
/// the SwiftUI counterpart of native-ios's WrapView. Not lazy: every item is a real view. Items are
/// measured once per pass at their fixed width, packed into lines and proposed the line height.
struct WrapLayout: Layout {
    var padding: CGFloat = 4
    var itemWidth: CGFloat = 88
    var itemMargin: CGFloat = 4

    struct Cache { var heights: [CGFloat] }

    func makeCache(subviews: Subviews) -> Cache { Cache(heights: measure(subviews)) }

    func updateCache(_ cache: inout Cache, subviews: Subviews) { cache.heights = measure(subviews) }

    private func measure(_ subviews: Subviews) -> [CGFloat] {
        subviews.map { $0.sizeThatFits(ProposedViewSize(width: itemWidth, height: nil)).height }
    }

    /// Calls `place(index, x, y, lineHeight)` for every item; returns the total height.
    @discardableResult
    private func pack(_ width: CGFloat, _ heights: [CGFloat], _ place: ((Int, CGFloat, CGFloat, CGFloat) -> Void)? = nil) -> CGFloat {
        let avail = width - 2 * padding
        let outer = itemWidth + 2 * itemMargin
        var y = padding
        var i = 0
        let n = heights.count
        while i < n {
            var x: CGFloat = 0
            var j = i
            var lineH: CGFloat = 0
            while j < n && (j == i || x + outer <= avail + 0.001) {
                lineH = max(lineH, heights[j])
                x += outer
                j += 1
            }
            if let place {
                var cx = padding
                for k in i..<j {
                    place(k, cx + itemMargin, y + itemMargin, lineH)
                    cx += outer
                }
            }
            y += lineH + 2 * itemMargin
            i = j
        }
        return y + padding
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout Cache) -> CGSize {
        let w = proposal.width ?? (padding * 2 + itemWidth + itemMargin * 2)
        return CGSize(width: w, height: pack(w, cache.heights))
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout Cache) {
        pack(bounds.width, cache.heights) { k, x, y, h in
            subviews[k].place(at: CGPoint(x: bounds.minX + x, y: bounds.minY + y), anchor: .topLeading,
                              proposal: ProposedViewSize(width: itemWidth, height: h))
        }
    }
}

/// One child at `fraction` of the proposed width, leading-aligned; reports the full width
/// (the relayout-resize root: width 100% / 80% inside a full-width column).
struct FractionWidth: Layout {
    var fraction: CGFloat

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let w = proposal.width ?? 0
        let h = subviews.first?.sizeThatFits(ProposedViewSize(width: w * fraction, height: nil)).height ?? 0
        return CGSize(width: w, height: h)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        subviews.first?.place(at: bounds.origin, anchor: .topLeading,
                              proposal: ProposedViewSize(width: bounds.width * fraction, height: nil))
    }
}

/// A row of cells with `flex: <weight>` widths (no gaps), centred on the cross axis. Each cell is
/// proposed exactly its share and placed at the leading edge of it (the dashboard table rows).
struct WeightedRow: Layout {
    var weights: [CGFloat]

    private func widths(_ total: CGFloat, _ n: Int) -> [CGFloat] {
        let w = (0..<n).map { $0 < weights.count ? weights[$0] : 1 }
        let sum = w.reduce(0, +)
        return w.map { sum > 0 ? total * $0 / sum : 0 }
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let total = proposal.width ?? 0
        let ws = widths(total, subviews.count)
        var h: CGFloat = 0
        for (i, s) in subviews.enumerated() {
            h = max(h, s.sizeThatFits(ProposedViewSize(width: ws[i], height: nil)).height)
        }
        return CGSize(width: total, height: h)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let ws = widths(bounds.width, subviews.count)
        var x = bounds.minX
        for (i, s) in subviews.enumerated() {
            s.place(at: CGPoint(x: x, y: bounds.midY), anchor: .leading, proposal: ProposedViewSize(width: ws[i], height: nil))
            x += ws[i]
        }
    }
}
