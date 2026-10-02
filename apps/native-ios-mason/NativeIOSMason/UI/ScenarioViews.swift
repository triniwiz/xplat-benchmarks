import Mason
import UIKit

// Every scenario tree mirrors apps/ns-core-mason-perf/app/scenarios.ts + app.css (what NativeScript
// + Mason renders), built with Mason's Swift API instead of NativeScript views and CSS classes.

/// One mounted scenario: the Mason root (`.host`, width 100%) and the sentinel, the last view in
/// the tree. The sentinel is shared by every mount (see Bench), so unmount detaches it.
class MountedScenario {
    let root: MasonUIView
    let sentinel: SentinelView
    private weak var sentinelParent: MasonUIView?

    /// `.host` wrapping `content` and the sentinel.
    init(_ content: MasonUIView, sentinel: SentinelView) {
        self.sentinel = sentinel
        root = div([content]) { $0.width = .Percent(1) }
        root.addView(sentinel)
        sentinelParent = root
    }

    /// For trees that place the sentinel themselves (tree-fanout puts it in `.tree-frame`).
    init(root: MasonUIView, sentinel: SentinelView, sentinelParent: MasonUIView) {
        self.root = root
        self.sentinel = sentinel
        self.sentinelParent = sentinelParent
    }

    func mutate(_ name: String) {}

    func detachSentinel() {
        sentinelParent?.removeView(sentinel)
        sentinelParent = nil
    }
}

/// `.sentinel { height: 1px }`, set up once.
func makeSentinel() -> SentinelView {
    let s = SentinelView()
    mason.configureStyleForView(s) { $0.height = dim(1) }
    return s
}

func buildScenario(_ f: ScenarioFixture, sentinel: SentinelView) -> MountedScenario {
    switch f.data {
    case .chain(let d): return MountedScenario(chain(d), sentinel: sentinel)
    case .tree(let d): return TreeScenario(d, sentinel: sentinel)
    case .tiles(let d): return TilesScenario(d, sentinel: sentinel)
    case .dashboard(let d): return MountedScenario(dashboard(d), sentinel: sentinel)
    case .textFlow(let d): return MountedScenario(textFlow(d), sentinel: sentinel)
    case .cards(let d): return MountedScenario(cards(d), sentinel: sentinel)
    case .list: fatalError("list-scroll is mounted by ListScenario")
    }
}

// MARK: nested-chain

private func chain(_ d: ChainData) -> MasonUIView {
    // .chain-label { font-size: 12px; color: text; padding: 4px }
    var inner: UIView = txt(d.label) { s in
        s.font(12, color: MC.text)
        s.pad(4)
    }
    for level in stride(from: d.depth - 1, through: 0, by: -1) {
        let c = level % Tokens.palette.count
        // .chain { padding: 1px 0 1px 1px; border-left: 1px solid } + bgl-c bc-c
        inner = div([inner]) { s in
            s.pad(1, 0, 1, 1)
            s.solidBorder(0, 0, 0, 1, Tokens.palette[c])
            s.backgroundColor = MC.paletteLight[c]
        }
    }
    return inner as! MasonUIView
}

// MARK: tree-fanout, relayout-resize, relayout-style

final class TreeScenario: MountedScenario {
    private let frame: MasonUIView
    private var inner: [(MasonUIView, Int)] = []

    init(_ d: TreeData, sentinel: SentinelView) {
        // .tree-frame { width: 100% } holding the tree and the sentinel, inside .host
        let frame = div { $0.width = .Percent(1) }
        self.frame = frame
        let host = div([frame]) { $0.width = .Percent(1) }
        super.init(root: host, sentinel: sentinel, sentinelParent: frame)
        frame.addView(build(d.root, parentDir: nil))
        frame.addView(sentinel)
    }

    private func build(_ n: TreeNode, parentDir: String?) -> MasonUIView {
        let inRow = parentDir == "row"
        if n.children.isEmpty {
            // .leaf { height: 12px } + bg-c (+ .in-row { flex: 1 1 0 })
            return div { s in
                s.height = dim(12)
                s.backgroundColor = MC.palette[n.color]
                if inRow { s.flex1() }
            }
        }
        // .tn { padding: 1px; border: 1px solid } + row/col + bgl-c bc-c (+ in-row)
        let v = div { s in
            s.pad(1)
            s.solidBorder(1, 1, 1, 1, Tokens.palette[n.color])
            s.backgroundColor = MC.paletteLight[n.color]
            if n.dir == "row" { s.flexDirection = .Row }
            if inRow { s.flex1() }
        }
        inner.append((v, n.color))
        for c in n.children { v.addView(build(c, parentDir: n.dir)) }
        return v
    }

    /// `.restyled .tn { padding: 3px; border-color: accent }` on every inner node.
    private func restyle(_ on: Bool) {
        for (v, color) in inner {
            v.configure { s in
                s.pad(on ? 3 : 1)
                s.setBorderColor(on ? Tokens.accent : Tokens.palette[color])
            }
        }
    }

    override func mutate(_ name: String) {
        switch name {
        case "shrink": frame.configure { $0.width = .Percent(0.8) }
        case "grow": frame.configure { $0.width = .Percent(1) }
        case "restyle": restyle(true)
        case "restore": restyle(false)
        default: break
        }
    }
}

// MARK: flex-wrap-tiles, insert-remove

final class TilesScenario: MountedScenario {
    private let container: MasonUIView
    private let data: TilesData
    private var inserted: [MasonUIView] = []

    init(_ d: TilesData, sentinel: SentinelView) {
        data = d
        // .tiles { flex-direction: row; flex-wrap: wrap; padding: 4px }
        container = div(d.tiles.map(Self.tile)) { s in
            s.flexDirection = .Row
            s.flexWrap = .Wrap
            s.pad(4)
        }
        super.init(container, sentinel: sentinel)
    }

    static func tile(_ t: Tile) -> MasonUIView {
        // .tile { width: 88px; margin: 4px; padding: 8px; border-radius: 8px } + bgl-c
        div([
            txt(t.title) { $0.font(14, bold: true, color: MC.text) },
            txt(t.subtitle) { $0.font(12, color: MC.muted) },
        ]) { s in
            s.width = dim(88)
            s.mar(4)
            s.pad(8)
            s.borderRadius = "8px"
            s.backgroundColor = MC.paletteLight[t.color]
        }
    }

    override func mutate(_ name: String) {
        if name == "insert", inserted.isEmpty {
            inserted = data.insert.map(Self.tile)
            for (i, v) in inserted.enumerated() { container.addView(v, at: i) }
        } else if name == "remove", !inserted.isEmpty {
            for v in inserted { container.removeView(v) }
            inserted = []
        }
    }
}

// MARK: grid-dashboard (CSS grid, as the NativeScript + Mason stylesheet does)

private func dashboard(_ d: DashboardData) -> MasonUIView {
    // .dash-header { grid-area: header; row; align-items: center; padding: 0 12px; bg surface; border-bottom: 1px }
    let header = div(
        [txt(d.title) { s in
            s.flex1()
            s.font(16, bold: true, color: MC.text)
        }] + d.pills.map { p in
            // .pill { margin-left: 4px; padding: 4px 8px; border-radius: 999px; bg; 12px text }
            txt(p) { s in
                s.mar(0, 0, 0, 4)
                s.pad(4, 8, 4, 8)
                s.borderRadius = "999px"
                s.backgroundColor = MC.bg
                s.font(12, color: MC.text)
            }
        }
    ) { s in
        s.gridArea = "header"
        s.flexDirection = .Row
        s.alignItems = .Center
        s.pad(0, 12, 0, 12)
        s.backgroundColor = MC.surface
        s.solidBorder(0, 0, 1, 0, Tokens.border)
    }

    // .dash-nav { grid-area: nav; padding: 8px 0; bg surface; border-right: 1px }
    let nav = div(d.nav.map { n in
        // .nav-item { padding: 8px 12px; 12px muted } / .active { accent; bold; bg #D0EBFF }
        txt(n.label) { s in
            s.pad(8, 12, 8, 12)
            s.font(12, bold: n.active, color: n.active ? MC.accent : MC.muted)
            if n.active { s.backgroundColor = MC.paletteLight[4] }
        }
    }) { s in
        s.gridArea = "nav"
        s.pad(8, 0, 8, 0)
        s.backgroundColor = MC.surface
        s.solidBorder(0, 1, 0, 0, Tokens.border)
    }

    // .dash-stats { grid-area: stats; display: grid; grid-template-columns: 1fr 1fr; padding: 4px }
    let stats = div(d.stats.map(stat)) { s in
        s.gridArea = "stats"
        s.display = .Grid
        s.gridTemplateColumns = "1fr 1fr"
        s.pad(4)
    }

    // .dash-table { grid-area: table; padding: 4px 8px }
    let head = trow(d.columns.map { c in txt(c) { $0.font(12, bold: true, color: MC.text) } })
    let rows = d.rows.map { r in
        trow([cellName(r)] + r.cells.map { c in txt(c) { $0.font(12, color: MC.text) } })
    }
    let table = div([head] + rows) { s in
        s.gridArea = "table"
        s.pad(4, 8, 4, 8)
    }

    // .dash { display: grid; 96px 1fr 1fr / 56px auto auto; areas }
    return div([header, nav, stats, table]) { s in
        s.display = .Grid
        s.gridTemplateColumns = "96px 1fr 1fr"
        s.gridTemplateRows = "56px auto auto"
        s.gridTemplateAreas = "\"header header header\" \"nav stats stats\" \"nav table table\""
    }
}

private func stat(_ st: StatCard) -> MasonUIView {
    // .bars { row; align-items: flex-end; height: 40px; margin-top: 4px }
    // .bar { flex: 1 1 0; margin: 0 1px; border-radius: 2px; bg accent } + height
    let bars = div(st.bars.map { h in
        div { s in
            s.flex1()
            s.mar(0, 1, 0, 1)
            s.borderRadius = "2px"
            s.backgroundColor = MC.accent
            s.height = dim(Float(h))
        }
    }) { s in
        s.flexDirection = .Row
        s.alignItems = .FlexEnd
        s.height = dim(40)
        s.mar(4, 0, 0, 0)
    }
    // .stat { margin: 4px; padding: 8px; border-radius: 8px; bg surface; border: 1px solid border }
    return div([
        txt(st.label) { $0.font(12, color: MC.muted) },
        txt(st.value) { $0.font(20, bold: true, color: MC.text) },
        txt(st.delta) { $0.font(12, color: st.up ? MC.positive : MC.negative) },
        bars,
    ]) { s in
        s.mar(4)
        s.pad(8)
        s.borderRadius = "8px"
        s.backgroundColor = MC.surface
        s.solidBorder(1, 1, 1, 1, Tokens.border)
    }
}

/// .trow { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; align-items: center; padding: 6px 0; border-bottom: 1px }
private func trow(_ cells: [UIView]) -> MasonUIView {
    div(cells) { s in
        s.display = .Grid
        s.gridTemplateColumns = "2fr 1fr 1fr 1fr"
        s.alignItems = .Center
        s.pad(6, 0, 6, 0)
        s.solidBorder(0, 0, 1, 0, Tokens.border)
    }
}

/// .cell-name { row; align-items: center } with .dot { 8x8; radius 4px; margin-right: 6px } + bg-c
private func cellName(_ r: TableRow) -> MasonUIView {
    let dot = div { s in
        s.width = dim(8)
        s.height = dim(8)
        s.borderRadius = "4px"
        s.mar(0, 6, 0, 0)
        s.backgroundColor = MC.palette[r.color]
    }
    return div([dot, txt(r.name) { $0.font(12, color: MC.text) }]) { s in
        s.flexDirection = .Row
        s.alignItems = .Center
    }
}

// MARK: text-flow

/// .text-flow { padding: 12px }; .para { margin-bottom: 8px; color: text } + .fs-N (+ bold, letter-spacing).
/// Mason has no line clamp, so the clamp paragraphs render in full (as in the NativeScript + Mason app).
private let lineHeights: [Float] = [17, 20, 22, 28]

private func textFlow(_ d: TextFlowData) -> MasonUIView {
    div(d.paragraphs.map { p in
        txt(p.text) { s in
            s.mar(0, 0, 8, 0)
            s.font(Int32(Tokens.fontSizes[p.size]), bold: p.bold, color: MC.text)
            s.lineHeightPx(lineHeights[p.size])
            if p.spacing { s.letterSpacing = px(0.5) }
        }
    }) { $0.pad(12) }
}

// MARK: styled-cards, scroll-plain

private func cards(_ d: CardsData) -> MasonUIView {
    div(d.cards.map(card)) { $0.pad(4) }  // .cards { padding: 4px }
}

private func card(_ c: Card) -> MasonUIView {
    let white = c.variant == 2
    let chips = div(c.chips.map { x in
        // .chip { padding: 2px 8px; margin-right: 4px; border-radius: 999px; 12px text } + bgl-c
        txt(x) { s in
            s.pad(2, 8, 2, 8)
            s.mar(0, 4, 0, 0)
            s.borderRadius = "999px"
            s.font(12, color: MC.text)
            s.backgroundColor = MC.paletteLight[c.color]
        }
    }) { s in
        s.flexDirection = .Row
        s.mar(8, 0, 0, 0)
    }
    // .card-inner { padding: 12px }: title { 16px bold }, body { 14px/20px muted; margin-top: 4px }
    let inner = div([
        txt(c.title) { $0.font(16, bold: true, color: white ? MC.white : MC.text) },
        txt(c.body) { s in
            s.font(14, color: white ? MC.white : MC.muted)
            s.lineHeightPx(20)
            s.mar(4, 0, 0, 0)
        },
        chips,
    ]) { $0.pad(12) }

    // .card { margin: 8px; bg surface } + .vN
    let outer = div { s in
        s.mar(8)
        s.backgroundColor = MC.surface
        switch c.variant {
        case 0:
            s.borderRadius = "12px"
            s.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)"
        case 1:
            s.borderRadius = "16px 0 16px 0"
            s.solidBorder(2, 2, 2, 2, Tokens.palette[c.color])
        case 2:
            s.borderRadius = "8px"
            s.backgroundImage = "linear-gradient(135deg, \(Tokens.palette[c.color]), \(Tokens.palette[c.color2]))"
        case 3:
            s.solidBorder(4, 1, 1, 1, "\(Tokens.palette[c.color]) \(Tokens.border) \(Tokens.border) \(Tokens.border)")
        case 4:
            s.transform = "rotate(-1deg) scale(0.98)"
            s.borderRadius = "8px"
            s.solidBorder(1, 1, 1, 1, Tokens.border)
        default:
            s.borderRadius = "12px"
            s.overflowX = .Hidden
            s.overflowY = .Hidden
        }
    }
    // opacity is a view property in NativeScript too (UIView.alpha), not a Mason style.
    if c.variant == 4 { outer.alpha = 0.85 }
    if c.variant == 5 {
        outer.addView(div { s in  // .band { height: 24px } + bg-c
            s.height = dim(24)
            s.backgroundColor = MC.palette[c.color]
        })
    }
    outer.addView(inner)
    return outer
}
