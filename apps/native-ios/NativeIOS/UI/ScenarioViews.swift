import UIKit

/// One mounted scenario: a root view (a column whose last child is the sentinel) plus its mutations.
class MountedScenario {
    let root: UIStackView
    let sentinel = SentinelView()

    init(_ content: [UIView], alignment: UIStackView.Alignment = .fill) {
        root = stack(.vertical, content + [sentinel], alignment: alignment)
    }

    init(root: UIStackView) {
        self.root = root
    }

    func mutate(_ name: String) {}
}

func buildScenario(_ f: ScenarioFixture) -> MountedScenario {
    switch f.data {
    case .chain(let d): return ChainScenario(d)
    case .tree(let d): return TreeScenario(d)
    case .tiles(let d): return TilesScenario(d)
    case .dashboard(let d): return DashboardScenario(d)
    case .textFlow(let d): return TextFlowScenario(d)
    case .cards(let d): return CardsScenario(d)
    case .list: fatalError("list-scroll is mounted by ListScenario")
    }
}

// MARK: nested-chain

final class ChainScenario: MountedScenario {
    init(_ d: ChainData) {
        var inner: UIView = BoxLabel(d.label, font: F.regular(12), color: C.text,
                                     insets: UIEdgeInsets(top: 4, left: 4, bottom: 4, right: 4))
        for level in stride(from: d.depth - 1, through: 0, by: -1) {
            let c = level % C.palette.count
            let box = Box(axis: .vertical, margins: insets(1, 2, 1, 0), background: C.paletteLight[c])
            box.edge(.left, 1, C.paletteCG[c])
            box.addArrangedSubview(inner)
            inner = box
        }
        super.init([inner])
    }
}

// MARK: tree-fanout, relayout-resize, relayout-style

final class TreeScenario: MountedScenario {
    private var inner: [(UIStackView, CGColor)] = []
    private let full: NSLayoutConstraint
    private let shrunk: NSLayoutConstraint
    private static let normal = all(2)       // padding 1 + border 1
    private static let restyled = all(4)     // padding 3 + border 1

    init(_ d: TreeData) {
        let outer = stack(.vertical, alignment: .leading)
        let frame = stack(.vertical)
        full = frame.widthAnchor.constraint(equalTo: outer.widthAnchor)
        shrunk = frame.widthAnchor.constraint(equalTo: outer.widthAnchor, multiplier: 0.8)
        super.init(root: outer)
        let tree = build(d.root)
        frame.addArrangedSubview(tree)
        frame.addArrangedSubview(sentinel)
        outer.addArrangedSubview(frame)
        full.isActive = true
    }

    private func build(_ node: TreeNode) -> UIView {
        if node.children.isEmpty {
            return block(height: 12, color: C.palette[node.color])
        }
        let row = node.dir == "row"
        let s = UIStackView()
        s.translatesAutoresizingMaskIntoConstraints = false
        s.axis = row ? .horizontal : .vertical
        s.distribution = row ? .fillEqually : .fill
        s.alignment = .fill
        s.isLayoutMarginsRelativeArrangement = true
        s.directionalLayoutMargins = Self.normal
        s.backgroundColor = C.paletteLight[node.color]
        s.layer.borderWidth = 1
        s.layer.borderColor = C.paletteCG[node.color]
        inner.append((s, C.paletteCG[node.color]))
        for c in node.children { s.addArrangedSubview(build(c)) }
        return s
    }

    private func restyle(_ on: Bool) {
        // Mirrors the RN context switch: every inner node gets padding 3 and the accent border.
        let accent = C.accent.cgColor
        for (s, color) in inner {
            s.directionalLayoutMargins = on ? Self.restyled : Self.normal
            s.layer.borderColor = on ? accent : color
        }
    }

    override func mutate(_ name: String) {
        switch name {
        case "shrink":
            full.isActive = false
            shrunk.isActive = true
        case "grow":
            shrunk.isActive = false
            full.isActive = true
        case "restyle":
            restyle(true)
        case "restore":
            restyle(false)
        default: break
        }
    }
}

// MARK: flex-wrap-tiles, insert-remove

final class TilesScenario: MountedScenario {
    private let wrap = WrapView(padding: 4, itemWidth: 88, itemMargin: 4)
    private let data: TilesData
    private var inserted = 0

    init(_ d: TilesData) {
        data = d
        super.init([wrap])
        wrap.insert(d.tiles.map(Self.tile), at: 0)
    }

    static func tile(_ t: Tile) -> UIView {
        let title = BoxLabel(t.title, font: F.bold(14), color: C.text)
        title.preferredMaxLayoutWidth = 72
        title.setContentHuggingPriority(UILayoutPriority(252), for: .vertical)
        let sub = BoxLabel(t.subtitle, font: F.regular(12), color: C.muted)
        sub.preferredMaxLayoutWidth = 72
        sub.topAligned = true
        let s = stack(.vertical, [title, sub], margins: all(8))
        s.backgroundColor = C.paletteLight[t.color]
        s.layer.cornerRadius = 8
        return s
    }

    override func mutate(_ name: String) {
        if name == "insert", inserted == 0 {
            wrap.insert(data.insert.map(Self.tile), at: 0)
            inserted = data.insert.count
        } else if name == "remove", inserted > 0 {
            wrap.remove(0..<inserted)
            inserted = 0
        }
    }
}

// MARK: grid-dashboard (flex-emulated, as in React Native)

final class DashboardScenario: MountedScenario {
    init(_ d: DashboardData) {
        // header
        let header = Box(axis: .horizontal, margins: insets(0, 12, 1, 12), background: C.surface, alignment: .center)
        header.spacing = 4
        header.edge(.bottom, 1, C.border.cgColor)
        header.heightAnchor.constraint(equalToConstant: 56).isActive = true
        // Title is flex: 1 (takes the rest of the line); pills keep their max-content width.
        let title = BoxLabel(d.title, font: F.bold(16), color: C.text, lines: 1)
        title.setContentHuggingPriority(UILayoutPriority(1), for: .horizontal)
        title.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
        header.addArrangedSubview(title)
        for p in d.pills {
            let pill = BoxLabel(p, font: F.regular(12), color: C.text, insets: UIEdgeInsets(top: 4, left: 8, bottom: 4, right: 8), lines: 1)
            pill.fill(C.bg)
            pill.pill = true
            pill.setContentHuggingPriority(.required, for: .horizontal)
            pill.setContentCompressionResistancePriority(.required, for: .horizontal)
            header.addArrangedSubview(pill)
        }

        // nav
        let nav = Box(axis: .vertical, margins: insets(8, 0, 8, 1), background: C.surface)
        nav.edge(.right, 1, C.border.cgColor)
        nav.widthAnchor.constraint(equalToConstant: 96).isActive = true
        for n in d.nav {
            let item = BoxLabel(n.label, font: n.active ? F.bold(12) : F.regular(12), color: n.active ? C.accent : C.muted,
                                insets: UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12))
            if n.active { item.fill(C.paletteLight[4]) }
            nav.addArrangedSubview(item)
        }
        nav.addArrangedSubview(spacer())

        // stats: rows of two flex:1 cards; margins 4 + padding 4 become stack spacing/margins of 8
        let stats = stack(.vertical, spacing: 8, margins: all(8))
        var i = 0
        while i < d.stats.count {
            let pair = d.stats[i..<min(i + 2, d.stats.count)].map(Self.stat)
            stats.addArrangedSubview(stack(.horizontal, pair, spacing: 8, distribution: .fillEqually))
            i += 2
        }

        // table
        let table = stack(.vertical, margins: insets(4, 8, 4, 8))
        table.addArrangedSubview(Self.row(d.columns.map { BoxLabel($0, font: F.bold(12), color: C.text) }))
        for r in d.rows {
            table.addArrangedSubview(Self.row([Self.nameCell(r)] + r.cells.map { BoxLabel($0, font: F.regular(12), color: C.text) }))
        }

        let main = stack(.vertical, [stats, table])
        let body = stack(.horizontal, [nav, main])
        super.init([header, body])
    }

    private static func stat(_ st: StatCard) -> UIView {
        let card = Box(axis: .vertical, margins: all(9), background: C.surface)
        card.layer.cornerRadius = 8
        card.layer.borderWidth = 1
        card.layer.borderColor = C.border.cgColor
        let delta = BoxLabel(st.delta, font: F.regular(12), color: st.up ? C.positive : C.negative)
        let bars = stack(.horizontal, st.bars.map { block(height: CGFloat($0), color: C.accent, radius: 2) },
                         spacing: 2, alignment: .bottom, distribution: .fillEqually, margins: insets(0, 1, 0, 1))
        bars.heightAnchor.constraint(equalToConstant: 40).isActive = true
        card.addArrangedSubview(BoxLabel(st.label, font: F.regular(12), color: C.muted))
        card.addArrangedSubview(BoxLabel(st.value, font: F.bold(20), color: C.text))
        card.addArrangedSubview(delta)
        card.addArrangedSubview(bars)
        card.addArrangedSubview(spacer())
        card.setCustomSpacing(4, after: delta)
        return card
    }

    /// cellName: dot (8x8, margin-right 6) then the name. As in RN (Yoga measures a flexShrink: 0 Text
    /// against the whole cell width, not the width left after the dot), the name may be as wide as
    /// the cell and runs past its end instead of wrapping early.
    private static func nameCell(_ r: TableRow) -> UIView {
        let cell = UIView()
        cell.translatesAutoresizingMaskIntoConstraints = false
        let dot = block(width: 8, height: 8, color: C.palette[r.color], radius: 4)
        let label = BoxLabel(r.name, font: F.regular(12), color: C.text)
        label.setContentHuggingPriority(.required, for: .horizontal)
        cell.addSubview(dot)
        cell.addSubview(label)
        NSLayoutConstraint.activate([
            dot.leadingAnchor.constraint(equalTo: cell.leadingAnchor),
            dot.centerYAnchor.constraint(equalTo: cell.centerYAnchor),
            label.leadingAnchor.constraint(equalTo: dot.trailingAnchor, constant: 6),
            label.widthAnchor.constraint(lessThanOrEqualTo: cell.widthAnchor),
            label.topAnchor.constraint(equalTo: cell.topAnchor),
            label.bottomAnchor.constraint(equalTo: cell.bottomAnchor),
        ])
        return cell
    }

    /// `flex: 2 / 1 / 1 / 1` cells, centred, with a bottom border.
    private static func row(_ cells: [UIView]) -> UIView {
        let r = Box(axis: .horizontal, margins: insets(6, 0, 7, 0), alignment: .center)
        r.edge(.bottom, 1, C.border.cgColor)
        for c in cells { r.addArrangedSubview(c) }
        let unit = cells[1]
        cells[0].widthAnchor.constraint(equalTo: unit.widthAnchor, multiplier: 2).isActive = true
        for c in cells[2...] { c.widthAnchor.constraint(equalTo: unit.widthAnchor).isActive = true }
        return r
    }
}

// MARK: text-flow

final class TextFlowScenario: MountedScenario {
    init(_ d: TextFlowData) {
        // padding 12 + paragraph margin-bottom 8
        let container = stack(.vertical, spacing: 8, margins: insets(12, 12, 20, 12))
        for p in d.paragraphs {
            let size = CGFloat(Tokens.fontSizes[p.size])
            let label = UILabel()
            label.translatesAutoresizingMaskIntoConstraints = false
            label.numberOfLines = p.clamp ? 2 : 0
            label.attributedText = lineHeightText(p.text, font: p.bold ? F.bold(size) : F.regular(size), color: C.text,
                                                  lineHeight: lineHeight(size), kern: p.spacing ? 0.5 : 0, truncate: p.clamp)
            container.addArrangedSubview(label)
        }
        super.init([container])
    }
}

// MARK: styled-cards, scroll-plain

final class CardsScenario: MountedScenario {
    init(_ d: CardsData) {
        // padding 4 + card margin 8
        let container = stack(.vertical, spacing: 16, margins: all(12))
        for c in d.cards { container.addArrangedSubview(Self.card(c)) }
        super.init([container])
    }

    static func card(_ c: Card) -> UIView {
        let white = c.variant == 2
        let card = Box(axis: .vertical, background: C.surface)
        let l = card.layer
        switch c.variant {
        case 0:
            l.cornerRadius = 12
            l.shadowColor = UIColor.black.cgColor
            l.shadowOpacity = 0.2
            l.shadowOffset = CGSize(width: 0, height: 2)
            l.shadowRadius = 3 // CSS blur 6
            card.shadowRadius = 12
        case 1:
            l.cornerRadius = 16
            l.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMaxYCorner]
            l.borderWidth = 2
            l.borderColor = C.paletteCG[c.color]
            card.isLayoutMarginsRelativeArrangement = true
            card.directionalLayoutMargins = all(2)
        case 2:
            l.cornerRadius = 8
            card.linearGradient(C.paletteCG[c.color], C.paletteCG[c.color2], radius: 8)
        case 3:
            card.edge(.top, 4, C.paletteCG[c.color])
            card.edge(.left, 1, C.border.cgColor)
            card.edge(.right, 1, C.border.cgColor)
            card.edge(.bottom, 1, C.border.cgColor)
            card.isLayoutMarginsRelativeArrangement = true
            card.directionalLayoutMargins = insets(4, 1, 1, 1)
        case 4:
            l.cornerRadius = 8
            l.borderWidth = 1
            l.borderColor = C.border.cgColor
            card.isLayoutMarginsRelativeArrangement = true
            card.directionalLayoutMargins = all(1)
            card.alpha = 0.85
            card.transform = CGAffineTransform(rotationAngle: -.pi / 180).scaledBy(x: 0.98, y: 0.98)
        default:
            l.cornerRadius = 12
            card.clipsToBounds = true
            card.addArrangedSubview(block(height: 24, color: C.palette[c.color]))
        }

        let title = BoxLabel(c.title, font: F.bold(16), color: white ? C.white : C.text)
        let body = UILabel()
        body.translatesAutoresizingMaskIntoConstraints = false
        body.numberOfLines = 0
        body.attributedText = lineHeightText(c.body, font: F.regular(14), color: white ? C.white : C.muted, lineHeight: 20)
        let chips = stack(.horizontal, spacing: 4)
        for x in c.chips {
            let chip = BoxLabel(x, font: F.regular(12), color: C.text, insets: UIEdgeInsets(top: 2, left: 8, bottom: 2, right: 8), lines: 1)
            chip.fill(C.paletteLight[c.color])
            chip.pill = true
            chips.addArrangedSubview(chip)
        }
        chips.addArrangedSubview(spacer())
        let inner = stack(.vertical, [title, body, chips], margins: all(12))
        inner.setCustomSpacing(4, after: title)
        inner.setCustomSpacing(8, after: body)
        card.addArrangedSubview(inner)
        return card
    }
}
