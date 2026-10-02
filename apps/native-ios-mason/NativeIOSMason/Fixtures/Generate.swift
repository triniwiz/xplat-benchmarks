import Foundation

// Port of scenarios/src/generate.ts. `json(_:)` reproduces JSON.stringify key order exactly.
struct ChainData { let depth: Int; let label: String }

final class TreeNode {
    let id: Int
    let depth: Int
    let dir: String
    var color: Int
    var children: [TreeNode] = []
    init(id: Int, depth: Int, dir: String, color: Int) {
        self.id = id; self.depth = depth; self.dir = dir; self.color = color
    }
}

struct TreeData { let root: TreeNode; let nodeCount: Int; let leafCount: Int }
struct Tile { let id: Int; let title: String; let subtitle: String; let color: Int }
struct TilesData { let tiles: [Tile]; let insert: [Tile] }
struct StatCard { let id: Int; let label: String; let value: String; let delta: String; let up: Bool; let bars: [Int] }
struct NavItem { let id: Int; let label: String; let active: Bool }
struct TableRow { let id: Int; let name: String; let cells: [String]; let color: Int }

struct DashboardData {
    let title: String
    let pills: [String]
    let nav: [NavItem]
    let stats: [StatCard]
    let columns: [String]
    let rows: [TableRow]
}

struct Paragraph { let id: Int; let size: Int; let bold: Bool; let spacing: Bool; let clamp: Bool; let text: String }
struct TextFlowData { let paragraphs: [Paragraph] }
struct Card { let id: Int; let variant: Int; let title: String; let body: String; let chips: [String]; let color: Int; let color2: Int }
struct CardsData { let cards: [Card] }

struct ListItem {
    let id: Int
    let type: String
    let title: String
    let subtitle: String
    let body: String
    let badges: [String]
    let meta: String
    let color: Int
}

struct ListData { let items: [ListItem] }

enum FixtureData {
    case chain(ChainData)
    case tree(TreeData)
    case tiles(TilesData)
    case dashboard(DashboardData)
    case textFlow(TextFlowData)
    case cards(CardsData)
    case list(ListData)
}

private let P = Tokens.palette.count

private func chain(_ rng: Rng, _ p: [String: Int]) -> ChainData {
    let d = p["depth"]!
    return ChainData(depth: d, label: "depth \(d)")
}

private func tree(_ rng: Rng, _ p: [String: Int]) -> TreeData {
    var id = 0
    var leaves = 0
    let maxDepth = p["depth"]!, branching = p["branching"]!
    func build(_ depth: Int) -> TreeNode {
        let node = TreeNode(id: id, depth: depth, dir: depth % 2 == 0 ? "row" : "column", color: depth % P)
        id += 1
        if depth < maxDepth {
            for _ in 0..<branching { node.children.append(build(depth + 1)) }
        } else {
            node.color = node.id % P
            leaves += 1
        }
        return node
    }
    let root = build(0)
    return TreeData(root: root, nodeCount: id, leafCount: leaves)
}

private func tile(_ rng: Rng, _ id: Int) -> Tile {
    let title = TextGen.title(rng, 1, 2)
    let subtitle = TextGen.words(rng, 2)
    return Tile(id: id, title: title, subtitle: subtitle, color: id % P)
}

private func tiles(_ rng: Rng, _ p: [String: Int]) -> TilesData {
    let count = p["count"]!, ins = p["insert"]!
    var out: [Tile] = []
    for i in 0..<count { out.append(tile(rng, i)) }
    var insert: [Tile] = []
    for i in 0..<ins { insert.append(tile(rng, count + i)) }
    return TilesData(tiles: out, insert: insert)
}

private func dashboard(_ rng: Rng, _ p: [String: Int]) -> DashboardData {
    var nav: [NavItem] = []
    for i in 0..<p["nav"]! { nav.append(NavItem(id: i, label: TextGen.title(rng, 1, 2), active: i == 0)) }
    var stats: [StatCard] = []
    for i in 0..<p["stats"]! {
        let up = rng.chance(0.6)
        var bars: [Int] = []
        for _ in 0..<7 { bars.append(rng.int(4, 40)) }
        let label = TextGen.title(rng, 1, 3)
        let a = rng.int(1, 999)
        let b = rng.int(0, 9)
        let value = "\(a).\(b)k"
        let delta = "\(up ? "+" : "-")\(rng.int(1, 40))%"
        stats.append(StatCard(id: i, label: label, value: value, delta: delta, up: up, bars: bars))
    }
    var rows: [TableRow] = []
    for i in 0..<p["rows"]! {
        let name = TextGen.title(rng, 2, 3)
        let c0 = "\(rng.int(1, 9999))"
        let c1 = "\(rng.int(0, 100))%"
        let c2 = rng.pick(["Active", "Paused", "Draft", "Done"])
        rows.append(TableRow(id: i, name: name, cells: [c0, c1, c2], color: i % P))
    }
    return DashboardData(title: "Layout dashboard", pills: ["Today", "Week", "Month"], nav: nav, stats: stats,
                         columns: ["Name", "Count", "Share", "Status"], rows: rows)
}

private func textFlow(_ rng: Rng, _ p: [String: Int]) -> TextFlowData {
    var out: [Paragraph] = []
    for i in 0..<p["paragraphs"]! {
        let size = rng.int(0, 3)
        let bold = rng.chance(0.25)
        let spacing = rng.chance(0.3)
        let text = TextGen.paragraph(rng, 20, 80)
        out.append(Paragraph(id: i, size: size, bold: bold, spacing: spacing, clamp: i % 5 == 4, text: text))
    }
    return TextFlowData(paragraphs: out)
}

private func card(_ rng: Rng, _ id: Int) -> Card {
    let title = TextGen.title(rng, 2, 4)
    let body = TextGen.sentence(rng, 10, 24)
    let chips = [TextGen.title(rng, 1, 1), TextGen.title(rng, 1, 1), TextGen.title(rng, 1, 1)]
    let color = rng.int(0, P - 1)
    let color2 = rng.int(0, P - 1)
    return Card(id: id, variant: id % 6, title: title, body: body, chips: chips, color: color, color2: color2)
}

private func cards(_ rng: Rng, _ p: [String: Int]) -> CardsData {
    var out: [Card] = []
    for i in 0..<p["cards"]! { out.append(card(rng, i)) }
    return CardsData(cards: out)
}

private func list(_ rng: Rng, _ p: [String: Int]) -> ListData {
    var items: [ListItem] = []
    for i in 0..<p["items"]! {
        let r = rng.next()
        let type = r < 0.5 ? "a" : r < 0.8 ? "b" : "c"
        var badges: [String] = []
        if type != "a" {
            var b = rng.int(1, 3)
            while b > 0 { badges.append(TextGen.title(rng, 1, 1)); b -= 1 }
        }
        let title = TextGen.title(rng, 2, 5)
        let subtitle = TextGen.words(rng, rng.int(3, 8))
        let body = type == "c" ? TextGen.paragraph(rng, 15, 40) : ""
        let meta = "\(rng.int(1, 59))m"
        items.append(ListItem(id: i, type: type, title: title, subtitle: subtitle, body: body, badges: badges, meta: meta, color: i % P))
    }
    return ListData(items: items)
}

func generateFixture(_ fixture: String, _ size: String, _ params: [String: Int]) -> FixtureData {
    let rng = Rng(seed: fnv1a("\(fixture):\(size)"))
    switch fixture {
    case "nested-chain": return .chain(chain(rng, params))
    case "tree-fanout": return .tree(tree(rng, params))
    case "flex-wrap-tiles": return .tiles(tiles(rng, params))
    case "grid-dashboard": return .dashboard(dashboard(rng, params))
    case "text-flow": return .textFlow(textFlow(rng, params))
    case "styled-cards", "scroll-plain": return .cards(cards(rng, params))
    case "list-scroll": return .list(list(rng, params))
    default: fatalError("unknown fixture \(fixture)")
    }
}

struct ScenarioFixture {
    let scenario: String
    let size: String
    let fixture: String
    let params: [String: Int]
    let data: FixtureData
    let hash: String
}

enum FixtureError: Error, CustomStringConvertible {
    case unknownScenario(String)
    var description: String {
        switch self { case .unknownScenario(let id): return "Error: Unknown scenario: \(id)" }
    }
}

func fixtureFor(_ scenario: String, _ size: String) throws -> ScenarioFixture {
    guard let def = getScenario(scenario), let params = def.sizes[size] else { throw FixtureError.unknownScenario(scenario) }
    let data = generateFixture(def.fixture, size, params)
    return ScenarioFixture(scenario: scenario, size: size, fixture: def.fixture, params: params, data: data,
                           hash: hashHex(json(data)))
}

// MARK: - JSON.stringify equivalent

private func writeTree(_ w: inout JsonWriter, _ n: TreeNode) {
    w.raw("{")
    w.key("id", first: true); w.num(n.id)
    w.key("depth"); w.num(n.depth)
    w.key("dir"); w.str(n.dir)
    w.key("color"); w.num(n.color)
    w.key("children"); w.array(n.children) { w, c in writeTree(&w, c) }
    w.raw("}")
}

private func writeTile(_ w: inout JsonWriter, _ t: Tile) {
    w.raw("{")
    w.key("id", first: true); w.num(t.id)
    w.key("title"); w.str(t.title)
    w.key("subtitle"); w.str(t.subtitle)
    w.key("color"); w.num(t.color)
    w.raw("}")
}

private func writeCards(_ w: inout JsonWriter, _ d: CardsData) {
    w.raw("{")
    w.key("cards", first: true)
    w.array(d.cards) { w, c in
        w.raw("{")
        w.key("id", first: true); w.num(c.id)
        w.key("variant"); w.num(c.variant)
        w.key("title"); w.str(c.title)
        w.key("body"); w.str(c.body)
        w.key("chips"); w.strArray(c.chips)
        w.key("color"); w.num(c.color)
        w.key("color2"); w.num(c.color2)
        w.raw("}")
    }
    w.raw("}")
}

func json(_ data: FixtureData) -> String {
    var w = JsonWriter()
    switch data {
    case .chain(let d):
        w.raw("{")
        w.key("depth", first: true); w.num(d.depth)
        w.key("label"); w.str(d.label)
        w.raw("}")
    case .tree(let d):
        w.raw("{")
        w.key("root", first: true); writeTree(&w, d.root)
        w.key("nodeCount"); w.num(d.nodeCount)
        w.key("leafCount"); w.num(d.leafCount)
        w.raw("}")
    case .tiles(let d):
        w.raw("{")
        w.key("tiles", first: true); w.array(d.tiles, writeTile)
        w.key("insert"); w.array(d.insert, writeTile)
        w.raw("}")
    case .dashboard(let d):
        w.raw("{")
        w.key("title", first: true); w.str(d.title)
        w.key("pills"); w.strArray(d.pills)
        w.key("nav")
        w.array(d.nav) { w, n in
            w.raw("{")
            w.key("id", first: true); w.num(n.id)
            w.key("label"); w.str(n.label)
            w.key("active"); w.bool(n.active)
            w.raw("}")
        }
        w.key("stats")
        w.array(d.stats) { w, s in
            w.raw("{")
            w.key("id", first: true); w.num(s.id)
            w.key("label"); w.str(s.label)
            w.key("value"); w.str(s.value)
            w.key("delta"); w.str(s.delta)
            w.key("up"); w.bool(s.up)
            w.key("bars"); w.intArray(s.bars)
            w.raw("}")
        }
        w.key("columns"); w.strArray(d.columns)
        w.key("rows")
        w.array(d.rows) { w, r in
            w.raw("{")
            w.key("id", first: true); w.num(r.id)
            w.key("name"); w.str(r.name)
            w.key("cells"); w.strArray(r.cells)
            w.key("color"); w.num(r.color)
            w.raw("}")
        }
        w.raw("}")
    case .textFlow(let d):
        w.raw("{")
        w.key("paragraphs", first: true)
        w.array(d.paragraphs) { w, p in
            w.raw("{")
            w.key("id", first: true); w.num(p.id)
            w.key("size"); w.num(p.size)
            w.key("bold"); w.bool(p.bold)
            w.key("spacing"); w.raw(p.spacing ? "0.5" : "0")
            w.key("clamp"); w.bool(p.clamp)
            w.key("text"); w.str(p.text)
            w.raw("}")
        }
        w.raw("}")
    case .cards(let d):
        writeCards(&w, d)
    case .list(let d):
        w.raw("{")
        w.key("items", first: true)
        w.array(d.items) { w, it in
            w.raw("{")
            w.key("id", first: true); w.num(it.id)
            w.key("type"); w.str(it.type)
            w.key("title"); w.str(it.title)
            w.key("subtitle"); w.str(it.subtitle)
            w.key("body"); w.str(it.body)
            w.key("badges"); w.strArray(it.badges)
            w.key("meta"); w.str(it.meta)
            w.key("color"); w.num(it.color)
            w.raw("}")
        }
        w.raw("}")
    }
    return w.out
}
