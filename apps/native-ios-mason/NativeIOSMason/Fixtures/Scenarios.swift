import Foundation

// Port of scenarios/src/scenarios.ts.
enum ScenarioKind: String { case mount, relayout, scroll }

struct ScenarioDef {
    let id: String
    let kind: ScenarioKind
    let title: String
    let fixture: String
    let sizes: [String: [String: Int]]
    let mutations: [String]
}

let SIZES = ["S", "M", "L"]

private let TREE_SIZES: [String: [String: Int]] = [
    "S": ["branching": 3, "depth": 5],
    "M": ["branching": 3, "depth": 6],
    "L": ["branching": 3, "depth": 7],
]

private let TILE_SIZES: [String: [String: Int]] = [
    "S": ["count": 250, "insert": 100],
    "M": ["count": 1000, "insert": 100],
    "L": ["count": 2500, "insert": 100],
]

let SCENARIOS: [ScenarioDef] = [
    ScenarioDef(id: "nested-chain", kind: .mount, title: "Nested chain", fixture: "nested-chain",
                sizes: ["S": ["depth": 32], "M": ["depth": 64], "L": ["depth": 128]], mutations: []),
    ScenarioDef(id: "tree-fanout", kind: .mount, title: "Tree fan-out", fixture: "tree-fanout",
                sizes: TREE_SIZES, mutations: []),
    ScenarioDef(id: "flex-wrap-tiles", kind: .mount, title: "Flex-wrap tiles", fixture: "flex-wrap-tiles",
                sizes: TILE_SIZES, mutations: []),
    ScenarioDef(id: "grid-dashboard", kind: .mount, title: "Grid dashboard", fixture: "grid-dashboard",
                sizes: [
                    "S": ["nav": 8, "stats": 8, "rows": 20],
                    "M": ["nav": 12, "stats": 16, "rows": 100],
                    "L": ["nav": 16, "stats": 32, "rows": 300],
                ], mutations: []),
    ScenarioDef(id: "text-flow", kind: .mount, title: "Text flow", fixture: "text-flow",
                sizes: ["S": ["paragraphs": 50], "M": ["paragraphs": 200], "L": ["paragraphs": 600]], mutations: []),
    ScenarioDef(id: "styled-cards", kind: .mount, title: "Styled cards", fixture: "styled-cards",
                sizes: ["S": ["cards": 30], "M": ["cards": 120], "L": ["cards": 400]], mutations: []),
    ScenarioDef(id: "relayout-resize", kind: .relayout, title: "Relayout: root resize", fixture: "tree-fanout",
                sizes: TREE_SIZES, mutations: ["shrink", "grow"]),
    ScenarioDef(id: "relayout-style", kind: .relayout, title: "Relayout: restyle every node", fixture: "tree-fanout",
                sizes: TREE_SIZES, mutations: ["restyle", "restore"]),
    ScenarioDef(id: "insert-remove", kind: .relayout, title: "Insert / remove at head", fixture: "flex-wrap-tiles",
                sizes: TILE_SIZES, mutations: ["insert", "remove"]),
    ScenarioDef(id: "list-scroll", kind: .scroll, title: "Virtualized list", fixture: "list-scroll",
                sizes: ["S": ["items": 500], "M": ["items": 2000], "L": ["items": 5000]], mutations: []),
    ScenarioDef(id: "scroll-plain", kind: .scroll, title: "Plain scroll view", fixture: "scroll-plain",
                sizes: ["S": ["cards": 100], "M": ["cards": 300], "L": ["cards": 600]], mutations: []),
]

func getScenario(_ id: String) -> ScenarioDef? { SCENARIOS.first { $0.id == id } }
