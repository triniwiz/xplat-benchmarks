import SwiftUI
import Observation

/// One mounted scenario: its view (a column whose last child is the sentinel) plus its mutations,
/// which only change SwiftUI state (@Observable models read by the views).
final class MountedScenario {
    let id = UUID()
    let probe = LayoutProbe()
    let isList: Bool
    private(set) var content = AnyView(EmptyView())
    private var onMutate: (String) -> Void = { _ in }

    init(isList: Bool = false) { self.isList = isList }

    fileprivate func set<V: View>(_ view: V, mutate: @escaping (String) -> Void = { _ in }) -> MountedScenario {
        content = AnyView(view)
        onMutate = mutate
        return self
    }

    func mutate(_ name: String) { onMutate(name) }
}

func buildScenario(_ f: ScenarioFixture) -> MountedScenario {
    switch f.data {
    case .list(let d):
        let s = MountedScenario(isList: true)
        return s.set(ListScenarioView(items: d.items, probe: s.probe))
    case .chain(let d):
        let s = MountedScenario()
        return s.set(Column(probe: s.probe) { ChainLevel(level: 0, depth: d.depth, label: d.label) })
    case .tree(let d):
        let s = MountedScenario()
        let state = TreeState()
        return s.set(TreeScenarioView(root: d.root, state: state, probe: s.probe)) { state.mutate($0) }
    case .tiles(let d):
        let s = MountedScenario()
        let state = TilesState(d)
        return s.set(Column(probe: s.probe) { TilesView(state: state) }) { state.mutate($0) }
    case .dashboard(let d):
        let s = MountedScenario()
        return s.set(Column(probe: s.probe) { DashboardView(d: d) })
    case .textFlow(let d):
        let s = MountedScenario()
        return s.set(Column(probe: s.probe) { TextFlowView(d: d) })
    case .cards(let d):
        let s = MountedScenario()
        return s.set(Column(probe: s.probe) { CardsView(d: d) })
    }
}

/// The scenario root: content then the 1pt sentinel.
struct Column<Content: View>: View {
    let probe: LayoutProbe
    @ViewBuilder let content: Content

    var body: some View {
        VStack(spacing: 0) {
            content
            Sentinel(probe: probe)
        }
    }
}

// MARK: nested-chain

/// Each level: padding 1 (left 1 + the 1pt left border), light fill, left border in the palette colour.
struct ChainLevel: View {
    let level: Int
    let depth: Int
    let label: String

    var body: some View {
        let c = level % C.palette.count
        Group {
            if level == depth - 1 {
                Text(label).font(F.regular(12)).foregroundColor(C.text).padding(4)
                    .frame(maxWidth: .infinity, alignment: .leading)
            } else {
                ChainLevel(level: level + 1, depth: depth, label: label)
            }
        }
        .padding(EdgeInsets(top: 1, leading: 2, bottom: 1, trailing: 0))
        .background(alignment: .leading) {
            ZStack(alignment: .leading) {
                C.paletteLight[c]
                C.palette[c].frame(width: 1)
            }
        }
    }
}

// MARK: tree-fanout, relayout-resize, relayout-style

@Observable
final class TreeState {
    var shrunk = false
    var restyled = false

    func mutate(_ name: String) {
        switch name {
        case "shrink": shrunk = true
        case "grow": shrunk = false
        case "restyle": restyled = true
        case "restore": restyled = false
        default: break
        }
    }
}

/// Root column at 100% / 80% of the width (leading-aligned); the sentinel sits inside it, as in native-ios.
struct TreeScenarioView: View {
    let root: TreeNode
    let state: TreeState
    let probe: LayoutProbe

    var body: some View {
        FractionWidth(fraction: state.shrunk ? 0.8 : 1) {
            VStack(spacing: 0) {
                TreeNodeView(node: root, restyled: state.restyled)
                Sentinel(probe: probe)
            }
        }
    }
}

/// Inner nodes: padding 1 + border 1 (restyled: padding 3 and the accent border, as the RN context switch).
/// Rows give every child an equal share; leaves are 12pt bars.
struct TreeNodeView: View {
    let node: TreeNode
    let restyled: Bool

    var body: some View {
        if node.children.isEmpty {
            C.palette[node.color].frame(height: 12)
        } else {
            Group {
                if node.dir == "row" {
                    HStack(spacing: 0) {
                        ForEach(node.children, id: \.id) { TreeNodeView(node: $0, restyled: restyled).frame(maxWidth: .infinity) }
                    }
                } else {
                    VStack(spacing: 0) {
                        ForEach(node.children, id: \.id) { TreeNodeView(node: $0, restyled: restyled) }
                    }
                }
            }
            .padding(restyled ? 4 : 2)
            .background(C.paletteLight[node.color])
            .border(restyled ? C.accent : C.palette[node.color], width: 1)
        }
    }
}

// MARK: flex-wrap-tiles, insert-remove

@Observable
final class TilesState {
    @ObservationIgnored let data: TilesData
    var inserted = false

    init(_ d: TilesData) { data = d }

    var tiles: [Tile] { inserted ? data.insert + data.tiles : data.tiles }

    func mutate(_ name: String) {
        if name == "insert" { inserted = true } else if name == "remove" { inserted = false }
    }
}

struct TilesView: View {
    let state: TilesState

    var body: some View {
        WrapLayout(padding: 4, itemWidth: 88, itemMargin: 4) {
            ForEach(state.tiles, id: \.id) { TileView(t: $0) }
        }
    }
}

/// 88pt tile, padding 8, radius 8; title then subtitle at the top, the tile stretched to the line height.
struct TileView: View {
    let t: Tile

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(t.title).font(F.bold(14)).foregroundColor(C.text).fixedSize(horizontal: false, vertical: true)
            Text(t.subtitle).font(F.regular(12)).foregroundColor(C.muted).fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(8)
        .background(C.paletteLight[t.color], in: RoundedRectangle(cornerRadius: 8))
    }
}

// MARK: grid-dashboard (flex-emulated, as native-ios and React Native)

struct DashboardView: View {
    let d: DashboardData

    var body: some View {
        VStack(spacing: 0) {
            header
            // nav stretches to the body height (align-items: stretch)
            HStack(alignment: .top, spacing: 0) {
                nav
                VStack(spacing: 0) {
                    stats
                    table
                }
            }
            .fixedSize(horizontal: false, vertical: true)
        }
    }

    /// 56pt high including the 1pt bottom border; title takes the rest of the line, pills keep their width.
    private var header: some View {
        HStack(spacing: 4) {
            Text(d.title).font(F.bold(16)).foregroundColor(C.text).lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
            ForEach(Array(d.pills.enumerated()), id: \.offset) { _, p in
                Text(p).font(F.regular(12)).foregroundColor(C.text).lineLimit(1)
                    .padding(EdgeInsets(top: 4, leading: 8, bottom: 4, trailing: 8))
                    .background(C.bg, in: Capsule())
                    .fixedSize()
            }
        }
        .padding(.horizontal, 12)
        .frame(maxWidth: .infinity)
        .frame(height: 55)
        .padding(.bottom, 1)
        .background(C.surface)
        .overlay(alignment: .bottom) { C.border.frame(height: 1) }
    }

    /// 96pt wide, padding 8 top/bottom, 1pt right border.
    private var nav: some View {
        VStack(spacing: 0) {
            ForEach(d.nav, id: \.id) { n in
                Text(n.label).font(n.active ? F.bold(12) : F.regular(12)).foregroundColor(n.active ? C.accent : C.muted)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(n.active ? C.paletteLight[4] : Color.clear)
            }
        }
        .padding(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 1))
        .frame(width: 96)
        .frame(maxHeight: .infinity, alignment: .top)
        .background(C.surface)
        .overlay(alignment: .trailing) { C.border.frame(width: 1) }
    }

    /// Rows of two flex: 1 cards, 8pt apart, equal height per row.
    private var stats: some View {
        VStack(spacing: 8) {
            ForEach(Array(stride(from: 0, to: d.stats.count, by: 2)), id: \.self) { i in
                HStack(spacing: 8) {
                    ForEach(d.stats[i..<min(i + 2, d.stats.count)], id: \.id) { StatCardView(st: $0) }
                }
                .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(8)
    }

    private var table: some View {
        VStack(spacing: 0) {
            TableRowView {
                ForEach(Array(d.columns.enumerated()), id: \.offset) { _, x in Text(x).font(F.bold(12)).foregroundColor(C.text) }
            }
            ForEach(d.rows, id: \.id) { r in
                TableRowView {
                    NameCell(r: r)
                    ForEach(Array(r.cells.enumerated()), id: \.offset) { _, x in Text(x).font(F.regular(12)).foregroundColor(C.text) }
                }
            }
        }
        .padding(EdgeInsets(top: 4, leading: 8, bottom: 4, trailing: 8))
    }
}

/// padding 8 + border 1, radius 8: label, value, delta, then the 40pt bar chart (bars bottom-aligned).
struct StatCardView: View {
    let st: StatCard

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(st.label).font(F.regular(12)).foregroundColor(C.muted)
            Text(st.value).font(F.bold(20)).foregroundColor(C.text)
            Text(st.delta).font(F.regular(12)).foregroundColor(st.up ? C.positive : C.negative)
            HStack(alignment: .bottom, spacing: 2) {
                ForEach(Array(st.bars.enumerated()), id: \.offset) { _, v in
                    RoundedRectangle(cornerRadius: 2).fill(C.accent).frame(height: CGFloat(v)).frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, 1)
            .frame(height: 40, alignment: .bottom)
            .padding(.top, 4)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(9)
        .background(C.surface, in: RoundedRectangle(cornerRadius: 8))
        .overlay(RoundedRectangle(cornerRadius: 8).strokeBorder(C.border, lineWidth: 1))
    }
}

/// Dot (8x8, then 6pt) and the name. As in native-ios / RN, the name is measured against the whole
/// cell width, not the width left after the dot, so it may run past the end of the cell.
struct NameCell: View {
    let r: TableRow

    var body: some View {
        Text(r.name).font(F.regular(12)).foregroundColor(C.text)
            .frame(maxWidth: .infinity, alignment: .leading)
            .offset(x: 14)
            .overlay(alignment: .leading) { Circle().fill(C.palette[r.color]).frame(width: 8, height: 8) }
    }
}

/// `flex: 2 / 1 / 1 / 1` cells, centred, padding 6 and a 1pt bottom border.
struct TableRowView<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        WeightedRow(weights: [2, 1, 1, 1]) { content }
        .padding(EdgeInsets(top: 6, leading: 0, bottom: 7, trailing: 0))
        .overlay(alignment: .bottom) { C.border.frame(height: 1) }
    }
}

// MARK: text-flow

struct TextFlowView: View {
    let d: TextFlowData

    var body: some View {
        // padding 12 + paragraph margin-bottom 8
        VStack(alignment: .leading, spacing: 8) {
            ForEach(d.paragraphs, id: \.id) { p in
                let size = CGFloat(Tokens.fontSizes[p.size])
                Text(p.text).font(p.bold ? F.bold(size) : F.regular(size)).foregroundColor(C.text)
                    .kerning(p.spacing ? 0.5 : 0)
                    .lineLimit(p.clamp ? 2 : nil)
                    .truncationMode(.tail)
                    .fixedLineHeight(specLineHeight(size), size: size, bold: p.bold)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding(EdgeInsets(top: 12, leading: 12, bottom: 20, trailing: 12))
    }
}

// MARK: styled-cards, scroll-plain

struct CardsView: View {
    let d: CardsData

    var body: some View {
        // padding 4 + card margin 8
        VStack(spacing: 16) {
            ForEach(d.cards, id: \.id) { CardView(c: $0) }
        }
        .padding(12)
    }
}

/// CSS 135deg linear-gradient: isolines perpendicular to 135deg in points, corners get the exact end
/// colours (t = (x + y) / (w + h)). LinearGradient's unit points are resolved against the box in points.
struct Gradient135: View {
    let from: Color
    let to: Color
    let radius: CGFloat

    var body: some View {
        GeometryReader { g in
            let w = max(g.size.width, 1), h = max(g.size.height, 1)
            let e = (w + h) / 2
            RoundedRectangle(cornerRadius: radius).fill(LinearGradient(
                colors: [from, to], startPoint: .topLeading, endPoint: UnitPoint(x: e / w, y: e / h)))
        }
    }
}

struct CardView: View {
    let c: Card

    private var white: Bool { c.variant == 2 }

    private var inner: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(c.title).font(F.bold(16)).foregroundColor(white ? C.white : C.text)
                .fixedSize(horizontal: false, vertical: true)
            Text(c.body).font(F.regular(14)).foregroundColor(white ? C.white : C.muted)
                .fixedLineHeight(20, size: 14)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.top, 4)
            HStack(spacing: 4) {
                ForEach(Array(c.chips.enumerated()), id: \.offset) { _, x in
                    Text(x).font(F.regular(12)).foregroundColor(C.text).lineLimit(1)
                        .padding(EdgeInsets(top: 2, leading: 8, bottom: 2, trailing: 8))
                        .background(C.paletteLight[c.color], in: Capsule())
                }
                Spacer(minLength: 0)
            }
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
    }

    var body: some View {
        switch c.variant {
        case 0:
            // CSS box-shadow 0 2 6 rgba(0,0,0,0.2): blur 6 is a Core Animation shadow radius of 3
            inner.background {
                RoundedRectangle(cornerRadius: 12).fill(C.surface)
                    .shadow(color: .black.opacity(0.2), radius: 3, x: 0, y: 2)
            }
        case 1:
            let shape = UnevenRoundedRectangle(topLeadingRadius: 16, bottomLeadingRadius: 0,
                                               bottomTrailingRadius: 16, topTrailingRadius: 0)
            inner.padding(2)
                .background(C.surface, in: shape)
                .overlay(shape.strokeBorder(C.palette[c.color], lineWidth: 2))
        case 2:
            inner.background(Gradient135(from: C.palette[c.color], to: C.palette[c.color2], radius: 8))
        case 3:
            // per-side borders, drawn in native-ios's layer order (top, left, right, bottom)
            inner.padding(EdgeInsets(top: 4, leading: 1, bottom: 1, trailing: 1))
                .background(C.surface)
                .overlay(alignment: .top) { C.palette[c.color].frame(height: 4) }
                .overlay(alignment: .leading) { C.border.frame(width: 1) }
                .overlay(alignment: .trailing) { C.border.frame(width: 1) }
                .overlay(alignment: .bottom) { C.border.frame(height: 1) }
        case 4:
            inner.padding(1)
                .background(C.surface, in: RoundedRectangle(cornerRadius: 8))
                .overlay(RoundedRectangle(cornerRadius: 8).strokeBorder(C.border, lineWidth: 1))
                .compositingGroup()
                .opacity(0.85)
                .scaleEffect(0.98)
                .rotationEffect(.degrees(-1))
        default:
            VStack(spacing: 0) {
                C.palette[c.color].frame(height: 24)
                inner
            }
            .background(C.surface)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
}
