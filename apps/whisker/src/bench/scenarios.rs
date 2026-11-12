#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Size {
    S,
    M,
    L,
}

pub const SIZES: [Size; 3] = [Size::S, Size::M, Size::L];

impl Size {
    pub fn as_str(self) -> &'static str {
        match self {
            Size::S => "S",
            Size::M => "M",
            Size::L => "L",
        }
    }

    pub fn parse(s: &str) -> Option<Size> {
        SIZES.into_iter().find(|z| z.as_str() == s)
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FixtureId {
    NestedChain,
    TreeFanout,
    FlexWrapTiles,
    GridDashboard,
    TextFlow,
    StyledCards,
    ListScroll,
    ScrollPlain,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Params {
    Chain { depth: u32 },
    Tree { branching: u32, depth: u32 },
    Tiles { count: u32, insert: u32 },
    Dashboard { nav: u32, stats: u32, rows: u32 },
    TextFlow { paragraphs: u32 },
    Cards { cards: u32 },
    List { items: u32 },
}

impl FixtureId {
    pub fn as_str(self) -> &'static str {
        match self {
            FixtureId::NestedChain => "nested-chain",
            FixtureId::TreeFanout => "tree-fanout",
            FixtureId::FlexWrapTiles => "flex-wrap-tiles",
            FixtureId::GridDashboard => "grid-dashboard",
            FixtureId::TextFlow => "text-flow",
            FixtureId::StyledCards => "styled-cards",
            FixtureId::ListScroll => "list-scroll",
            FixtureId::ScrollPlain => "scroll-plain",
        }
    }

    pub fn params(self, size: Size) -> Params {
        let pick = |s, m, l| match size {
            Size::S => s,
            Size::M => m,
            Size::L => l,
        };
        match self {
            FixtureId::NestedChain => Params::Chain { depth: pick(32, 64, 128) },
            FixtureId::TreeFanout => Params::Tree { branching: 3, depth: pick(5, 6, 7) },
            FixtureId::FlexWrapTiles => Params::Tiles { count: pick(250, 1000, 2500), insert: 100 },
            FixtureId::GridDashboard => Params::Dashboard {
                nav: pick(8, 12, 16),
                stats: pick(8, 16, 32),
                rows: pick(20, 100, 300),
            },
            FixtureId::TextFlow => Params::TextFlow { paragraphs: pick(50, 200, 600) },
            FixtureId::StyledCards => Params::Cards { cards: pick(30, 120, 400) },
            FixtureId::ListScroll => Params::List { items: pick(500, 2000, 5000) },
            FixtureId::ScrollPlain => Params::Cards { cards: pick(100, 300, 600) },
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ScenarioKind {
    Mount,
    Relayout,
    Scroll,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Mutation {
    Shrink,
    Grow,
    Restyle,
    Restore,
    Insert,
    Remove,
}

impl Mutation {
    pub fn as_str(self) -> &'static str {
        match self {
            Mutation::Shrink => "shrink",
            Mutation::Grow => "grow",
            Mutation::Restyle => "restyle",
            Mutation::Restore => "restore",
            Mutation::Insert => "insert",
            Mutation::Remove => "remove",
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ScenarioId {
    NestedChain,
    TreeFanout,
    FlexWrapTiles,
    GridDashboard,
    TextFlow,
    StyledCards,
    RelayoutResize,
    RelayoutStyle,
    InsertRemove,
    ListScroll,
    ScrollPlain,
}

pub const SCENARIOS: [ScenarioId; 11] = [
    ScenarioId::NestedChain,
    ScenarioId::TreeFanout,
    ScenarioId::FlexWrapTiles,
    ScenarioId::GridDashboard,
    ScenarioId::TextFlow,
    ScenarioId::StyledCards,
    ScenarioId::RelayoutResize,
    ScenarioId::RelayoutStyle,
    ScenarioId::InsertRemove,
    ScenarioId::ListScroll,
    ScenarioId::ScrollPlain,
];

impl ScenarioId {
    pub fn as_str(self) -> &'static str {
        match self {
            ScenarioId::NestedChain => "nested-chain",
            ScenarioId::TreeFanout => "tree-fanout",
            ScenarioId::FlexWrapTiles => "flex-wrap-tiles",
            ScenarioId::GridDashboard => "grid-dashboard",
            ScenarioId::TextFlow => "text-flow",
            ScenarioId::StyledCards => "styled-cards",
            ScenarioId::RelayoutResize => "relayout-resize",
            ScenarioId::RelayoutStyle => "relayout-style",
            ScenarioId::InsertRemove => "insert-remove",
            ScenarioId::ListScroll => "list-scroll",
            ScenarioId::ScrollPlain => "scroll-plain",
        }
    }

    pub fn parse(s: &str) -> Option<ScenarioId> {
        SCENARIOS.into_iter().find(|id| id.as_str() == s)
    }

    pub fn kind(self) -> ScenarioKind {
        match self {
            ScenarioId::NestedChain
            | ScenarioId::TreeFanout
            | ScenarioId::FlexWrapTiles
            | ScenarioId::GridDashboard
            | ScenarioId::TextFlow
            | ScenarioId::StyledCards => ScenarioKind::Mount,
            ScenarioId::RelayoutResize | ScenarioId::RelayoutStyle | ScenarioId::InsertRemove => {
                ScenarioKind::Relayout
            }
            ScenarioId::ListScroll | ScenarioId::ScrollPlain => ScenarioKind::Scroll,
        }
    }

    pub fn fixture(self) -> FixtureId {
        match self {
            ScenarioId::NestedChain => FixtureId::NestedChain,
            ScenarioId::TreeFanout | ScenarioId::RelayoutResize | ScenarioId::RelayoutStyle => {
                FixtureId::TreeFanout
            }
            ScenarioId::FlexWrapTiles | ScenarioId::InsertRemove => FixtureId::FlexWrapTiles,
            ScenarioId::GridDashboard => FixtureId::GridDashboard,
            ScenarioId::TextFlow => FixtureId::TextFlow,
            ScenarioId::StyledCards => FixtureId::StyledCards,
            ScenarioId::ListScroll => FixtureId::ListScroll,
            ScenarioId::ScrollPlain => FixtureId::ScrollPlain,
        }
    }

    pub fn mutations(self) -> &'static [Mutation] {
        match self {
            ScenarioId::RelayoutResize => &[Mutation::Shrink, Mutation::Grow],
            ScenarioId::RelayoutStyle => &[Mutation::Restyle, Mutation::Restore],
            ScenarioId::InsertRemove => &[Mutation::Insert, Mutation::Remove],
            ScenarioId::NestedChain
            | ScenarioId::TreeFanout
            | ScenarioId::FlexWrapTiles
            | ScenarioId::GridDashboard
            | ScenarioId::TextFlow
            | ScenarioId::StyledCards
            | ScenarioId::ListScroll
            | ScenarioId::ScrollPlain => &[],
        }
    }
}
