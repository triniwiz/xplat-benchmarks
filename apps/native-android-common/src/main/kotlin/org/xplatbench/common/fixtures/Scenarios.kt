package org.xplatbench.common.fixtures

// Port of scenarios/src/scenarios.ts.
enum class ScenarioKind { MOUNT, RELAYOUT, SCROLL }

class ScenarioDef(
    val id: String,
    val kind: ScenarioKind,
    val title: String,
    val fixture: String,
    val sizes: Map<String, Map<String, Int>>,
    val mutations: List<String> = emptyList(),
)

val SIZES = listOf("S", "M", "L")

private val TREE_SIZES = mapOf(
    "S" to mapOf("branching" to 3, "depth" to 5),
    "M" to mapOf("branching" to 3, "depth" to 6),
    "L" to mapOf("branching" to 3, "depth" to 7),
)

private val TILE_SIZES = mapOf(
    "S" to mapOf("count" to 250, "insert" to 100),
    "M" to mapOf("count" to 1000, "insert" to 100),
    "L" to mapOf("count" to 2500, "insert" to 100),
)

val SCENARIOS: List<ScenarioDef> = listOf(
    ScenarioDef("nested-chain", ScenarioKind.MOUNT, "Nested chain", "nested-chain",
        mapOf("S" to mapOf("depth" to 32), "M" to mapOf("depth" to 64), "L" to mapOf("depth" to 128))),
    ScenarioDef("tree-fanout", ScenarioKind.MOUNT, "Tree fan-out", "tree-fanout", TREE_SIZES),
    ScenarioDef("flex-wrap-tiles", ScenarioKind.MOUNT, "Flex-wrap tiles", "flex-wrap-tiles", TILE_SIZES),
    ScenarioDef("grid-dashboard", ScenarioKind.MOUNT, "Grid dashboard", "grid-dashboard",
        mapOf(
            "S" to mapOf("nav" to 8, "stats" to 8, "rows" to 20),
            "M" to mapOf("nav" to 12, "stats" to 16, "rows" to 100),
            "L" to mapOf("nav" to 16, "stats" to 32, "rows" to 300),
        )),
    ScenarioDef("text-flow", ScenarioKind.MOUNT, "Text flow", "text-flow",
        mapOf("S" to mapOf("paragraphs" to 50), "M" to mapOf("paragraphs" to 200), "L" to mapOf("paragraphs" to 600))),
    ScenarioDef("styled-cards", ScenarioKind.MOUNT, "Styled cards", "styled-cards",
        mapOf("S" to mapOf("cards" to 30), "M" to mapOf("cards" to 120), "L" to mapOf("cards" to 400))),
    ScenarioDef("relayout-resize", ScenarioKind.RELAYOUT, "Relayout: root resize", "tree-fanout", TREE_SIZES,
        listOf("shrink", "grow")),
    ScenarioDef("relayout-style", ScenarioKind.RELAYOUT, "Relayout: restyle every node", "tree-fanout", TREE_SIZES,
        listOf("restyle", "restore")),
    ScenarioDef("insert-remove", ScenarioKind.RELAYOUT, "Insert / remove at head", "flex-wrap-tiles", TILE_SIZES,
        listOf("insert", "remove")),
    ScenarioDef("list-scroll", ScenarioKind.SCROLL, "Virtualized list", "list-scroll",
        mapOf("S" to mapOf("items" to 500), "M" to mapOf("items" to 2000), "L" to mapOf("items" to 5000))),
    ScenarioDef("scroll-plain", ScenarioKind.SCROLL, "Plain scroll view", "scroll-plain",
        mapOf("S" to mapOf("cards" to 100), "M" to mapOf("cards" to 300), "L" to mapOf("cards" to 600))),
)

fun getScenario(id: String): ScenarioDef? = SCENARIOS.firstOrNull { it.id == id }
