package org.xplatbench.common.fixtures

// Port of scenarios/src/generate.ts. Every generator draws from the PRNG in exactly the order the
// TS object literals evaluate, and json() reproduces JSON.stringify's key order.
class ChainData(val depth: Int, val label: String)

class TreeNode(val id: Int, val depth: Int, val dir: String, var color: Int) {
    val children = ArrayList<TreeNode>()
}

class TreeData(val root: TreeNode, val nodeCount: Int, val leafCount: Int)
class Tile(val id: Int, val title: String, val subtitle: String, val color: Int)
class TilesData(val tiles: List<Tile>, val insert: List<Tile>)
class StatCard(val id: Int, val label: String, val value: String, val delta: String, val up: Boolean, val bars: List<Int>)
class NavItem(val id: Int, val label: String, val active: Boolean)
class TableRow(val id: Int, val name: String, val cells: List<String>, val color: Int)

class DashboardData(
    val title: String,
    val pills: List<String>,
    val nav: List<NavItem>,
    val stats: List<StatCard>,
    val columns: List<String>,
    val rows: List<TableRow>,
)

class Paragraph(val id: Int, val size: Int, val bold: Boolean, val spacing: Boolean, val clamp: Boolean, val text: String)
class TextFlowData(val paragraphs: List<Paragraph>)
class Card(val id: Int, val variant: Int, val title: String, val body: String, val chips: List<String>, val color: Int, val color2: Int)
class CardsData(val cards: List<Card>)

class ListItem(
    val id: Int,
    val type: String,
    val title: String,
    val subtitle: String,
    val body: String,
    val badges: List<String>,
    val meta: String,
    val color: Int,
)

class ListData(val items: List<ListItem>)

sealed class FixtureData {
    class Chain(val d: ChainData) : FixtureData()
    class Tree(val d: TreeData) : FixtureData()
    class Tiles(val d: TilesData) : FixtureData()
    class Dashboard(val d: DashboardData) : FixtureData()
    class TextFlow(val d: TextFlowData) : FixtureData()
    class Cards(val d: CardsData) : FixtureData()
    class List(val d: ListData) : FixtureData()
}

private val P get() = Tokens.palette.size

private fun chain(p: Map<String, Int>): ChainData {
    val d = p.getValue("depth")
    return ChainData(d, "depth $d")
}

private fun tree(p: Map<String, Int>): TreeData {
    var id = 0
    var leaves = 0
    val maxDepth = p.getValue("depth")
    val branching = p.getValue("branching")
    fun build(depth: Int): TreeNode {
        val node = TreeNode(id++, depth, if (depth % 2 == 0) "row" else "column", depth % P)
        if (depth < maxDepth) {
            for (i in 0 until branching) node.children.add(build(depth + 1))
        } else {
            node.color = node.id % P
            leaves++
        }
        return node
    }
    val root = build(0)
    return TreeData(root, id, leaves)
}

private fun tile(rng: Rng, id: Int): Tile {
    val title = TextGen.title(rng, 1, 2)
    val subtitle = TextGen.words(rng, 2)
    return Tile(id, title, subtitle, id % P)
}

private fun tiles(rng: Rng, p: Map<String, Int>): TilesData {
    val count = p.getValue("count")
    val ins = p.getValue("insert")
    val out = ArrayList<Tile>(count)
    for (i in 0 until count) out.add(tile(rng, i))
    val insert = ArrayList<Tile>(ins)
    for (i in 0 until ins) insert.add(tile(rng, count + i))
    return TilesData(out, insert)
}

private fun dashboard(rng: Rng, p: Map<String, Int>): DashboardData {
    val nav = ArrayList<NavItem>()
    for (i in 0 until p.getValue("nav")) nav.add(NavItem(i, TextGen.title(rng, 1, 2), i == 0))
    val stats = ArrayList<StatCard>()
    for (i in 0 until p.getValue("stats")) {
        val up = rng.chance(0.6)
        val bars = ArrayList<Int>(7)
        for (b in 0 until 7) bars.add(rng.int(4, 40))
        val label = TextGen.title(rng, 1, 3)
        val a = rng.int(1, 999)
        val b = rng.int(0, 9)
        val value = "$a.${b}k"
        val delta = "${if (up) "+" else "-"}${rng.int(1, 40)}%"
        stats.add(StatCard(i, label, value, delta, up, bars))
    }
    val rows = ArrayList<TableRow>()
    for (i in 0 until p.getValue("rows")) {
        val name = TextGen.title(rng, 2, 3)
        val c0 = "${rng.int(1, 9999)}"
        val c1 = "${rng.int(0, 100)}%"
        val c2 = rng.pick(listOf("Active", "Paused", "Draft", "Done"))
        rows.add(TableRow(i, name, listOf(c0, c1, c2), i % P))
    }
    return DashboardData("Layout dashboard", listOf("Today", "Week", "Month"), nav, stats,
        listOf("Name", "Count", "Share", "Status"), rows)
}

private fun textFlow(rng: Rng, p: Map<String, Int>): TextFlowData {
    val out = ArrayList<Paragraph>()
    for (i in 0 until p.getValue("paragraphs")) {
        val size = rng.int(0, 3)
        val bold = rng.chance(0.25)
        val spacing = rng.chance(0.3)
        val text = TextGen.paragraph(rng, 20, 80)
        out.add(Paragraph(i, size, bold, spacing, i % 5 == 4, text))
    }
    return TextFlowData(out)
}

private fun card(rng: Rng, id: Int): Card {
    val title = TextGen.title(rng, 2, 4)
    val body = TextGen.sentence(rng, 10, 24)
    val chips = listOf(TextGen.title(rng, 1, 1), TextGen.title(rng, 1, 1), TextGen.title(rng, 1, 1))
    val color = rng.int(0, P - 1)
    val color2 = rng.int(0, P - 1)
    return Card(id, id % 6, title, body, chips, color, color2)
}

private fun cards(rng: Rng, p: Map<String, Int>): CardsData {
    val out = ArrayList<Card>()
    for (i in 0 until p.getValue("cards")) out.add(card(rng, i))
    return CardsData(out)
}

private fun list(rng: Rng, p: Map<String, Int>): ListData {
    val items = ArrayList<ListItem>()
    for (i in 0 until p.getValue("items")) {
        val r = rng.next()
        val type = if (r < 0.5) "a" else if (r < 0.8) "b" else "c"
        val badges = ArrayList<String>()
        if (type != "a") {
            var b = rng.int(1, 3)
            while (b > 0) {
                badges.add(TextGen.title(rng, 1, 1))
                b--
            }
        }
        val title = TextGen.title(rng, 2, 5)
        val subtitle = TextGen.words(rng, rng.int(3, 8))
        val body = if (type == "c") TextGen.paragraph(rng, 15, 40) else ""
        val meta = "${rng.int(1, 59)}m"
        items.add(ListItem(i, type, title, subtitle, body, badges, meta, i % P))
    }
    return ListData(items)
}

fun generateFixture(fixture: String, size: String, params: Map<String, Int>): FixtureData {
    val rng = Rng(fnv1a("$fixture:$size"))
    return when (fixture) {
        "nested-chain" -> FixtureData.Chain(chain(params))
        "tree-fanout" -> FixtureData.Tree(tree(params))
        "flex-wrap-tiles" -> FixtureData.Tiles(tiles(rng, params))
        "grid-dashboard" -> FixtureData.Dashboard(dashboard(rng, params))
        "text-flow" -> FixtureData.TextFlow(textFlow(rng, params))
        "styled-cards", "scroll-plain" -> FixtureData.Cards(cards(rng, params))
        "list-scroll" -> FixtureData.List(list(rng, params))
        else -> throw IllegalArgumentException("Unknown fixture: $fixture")
    }
}

class ScenarioFixture(
    val scenario: String,
    val size: String,
    val fixture: String,
    val params: Map<String, Int>,
    val data: FixtureData,
    val hash: String,
)

class UnknownScenarioException(id: String) : IllegalArgumentException("Unknown scenario: $id")

fun fixtureFor(scenario: String, size: String): ScenarioFixture {
    val def = getScenario(scenario) ?: throw UnknownScenarioException(scenario)
    val params = def.sizes[size] ?: throw UnknownScenarioException(scenario)
    val data = generateFixture(def.fixture, size, params)
    return ScenarioFixture(scenario, size, def.fixture, params, data, hashHex(json(data)))
}

// JSON.stringify equivalent

private fun JsonWriter.tree(n: TreeNode) {
    obj {
        key("id", first = true); num(n.id)
        key("depth"); num(n.depth)
        key("dir"); str(n.dir)
        key("color"); num(n.color)
        key("children"); array(n.children) { tree(it) }
    }
}

private fun JsonWriter.tile(t: Tile) {
    obj {
        key("id", first = true); num(t.id)
        key("title"); str(t.title)
        key("subtitle"); str(t.subtitle)
        key("color"); num(t.color)
    }
}

fun json(data: FixtureData): String {
    val w = JsonWriter()
    when (data) {
        is FixtureData.Chain -> w.obj {
            key("depth", first = true); num(data.d.depth)
            key("label"); str(data.d.label)
        }
        is FixtureData.Tree -> w.obj {
            key("root", first = true); tree(data.d.root)
            key("nodeCount"); num(data.d.nodeCount)
            key("leafCount"); num(data.d.leafCount)
        }
        is FixtureData.Tiles -> w.obj {
            key("tiles", first = true); array(data.d.tiles) { tile(it) }
            key("insert"); array(data.d.insert) { tile(it) }
        }
        is FixtureData.Dashboard -> w.obj {
            val d = data.d
            key("title", first = true); str(d.title)
            key("pills"); strArray(d.pills)
            key("nav"); array(d.nav) { n ->
                obj {
                    key("id", first = true); num(n.id)
                    key("label"); str(n.label)
                    key("active"); bool(n.active)
                }
            }
            key("stats"); array(d.stats) { s ->
                obj {
                    key("id", first = true); num(s.id)
                    key("label"); str(s.label)
                    key("value"); str(s.value)
                    key("delta"); str(s.delta)
                    key("up"); bool(s.up)
                    key("bars"); intArray(s.bars)
                }
            }
            key("columns"); strArray(d.columns)
            key("rows"); array(d.rows) { r ->
                obj {
                    key("id", first = true); num(r.id)
                    key("name"); str(r.name)
                    key("cells"); strArray(r.cells)
                    key("color"); num(r.color)
                }
            }
        }
        is FixtureData.TextFlow -> w.obj {
            key("paragraphs", first = true); array(data.d.paragraphs) { p ->
                obj {
                    key("id", first = true); num(p.id)
                    key("size"); num(p.size)
                    key("bold"); bool(p.bold)
                    key("spacing"); raw(if (p.spacing) "0.5" else "0")
                    key("clamp"); bool(p.clamp)
                    key("text"); str(p.text)
                }
            }
        }
        is FixtureData.Cards -> w.obj {
            key("cards", first = true); array(data.d.cards) { c ->
                obj {
                    key("id", first = true); num(c.id)
                    key("variant"); num(c.variant)
                    key("title"); str(c.title)
                    key("body"); str(c.body)
                    key("chips"); strArray(c.chips)
                    key("color"); num(c.color)
                    key("color2"); num(c.color2)
                }
            }
        }
        is FixtureData.List -> w.obj {
            key("items", first = true); array(data.d.items) { item ->
                obj {
                    key("id", first = true); num(item.id)
                    key("type"); str(item.type)
                    key("title"); str(item.title)
                    key("subtitle"); str(item.subtitle)
                    key("body"); str(item.body)
                    key("badges"); strArray(item.badges)
                    key("meta"); str(item.meta)
                    key("color"); num(item.color)
                }
            }
        }
    }
    return w.toString()
}
