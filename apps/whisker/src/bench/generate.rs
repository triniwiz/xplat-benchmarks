use serde::{Serialize, Serializer};

use super::hash::{fnv1a, hash_json};
use super::prng::Rng;
use super::scenarios::{FixtureId, Params, ScenarioId, Size};
use super::text::{paragraph, sentence, title, words};

const P: u32 = 8;

#[derive(Serialize)]
pub struct ChainData {
    pub depth: u32,
    pub label: String,
}

#[derive(Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Dir {
    Row,
    Column,
}

#[derive(Serialize)]
pub struct TreeNode {
    pub id: u32,
    pub depth: u32,
    pub dir: Dir,
    pub color: u32,
    pub children: Vec<TreeNode>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TreeData {
    pub root: TreeNode,
    pub node_count: u32,
    pub leaf_count: u32,
}

#[derive(Serialize)]
pub struct Tile {
    pub id: u32,
    pub title: String,
    pub subtitle: String,
    pub color: u32,
}

#[derive(Serialize)]
pub struct TilesData {
    pub tiles: Vec<Tile>,
    pub insert: Vec<Tile>,
}

#[derive(Serialize)]
pub struct NavItem {
    pub id: u32,
    pub label: String,
    pub active: bool,
}

#[derive(Serialize)]
pub struct StatCard {
    pub id: u32,
    pub label: String,
    pub value: String,
    pub delta: String,
    pub up: bool,
    pub bars: [u32; 7],
}

#[derive(Serialize)]
pub struct TableRow {
    pub id: u32,
    pub name: String,
    pub cells: [String; 3],
    pub color: u32,
}

#[derive(Serialize)]
pub struct DashboardData {
    pub title: &'static str,
    pub pills: [&'static str; 3],
    pub nav: Vec<NavItem>,
    pub stats: Vec<StatCard>,
    pub columns: [&'static str; 4],
    pub rows: Vec<TableRow>,
}

/// JS writes the spacing as `0` or `0.5`; an f64 `0.0` would serialize as `0.0` and change the hash.
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Spacing {
    None,
    Half,
}

impl Serialize for Spacing {
    fn serialize<S: Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        match self {
            Spacing::None => s.serialize_u8(0),
            Spacing::Half => s.serialize_f64(0.5),
        }
    }
}

#[derive(Serialize)]
pub struct Paragraph {
    pub id: u32,
    pub size: u32,
    pub bold: bool,
    pub spacing: Spacing,
    pub clamp: bool,
    pub text: String,
}

#[derive(Serialize)]
pub struct TextFlowData {
    pub paragraphs: Vec<Paragraph>,
}

#[derive(Serialize)]
pub struct Card {
    pub id: u32,
    pub variant: u32,
    pub title: String,
    pub body: String,
    pub chips: [String; 3],
    pub color: u32,
    pub color2: u32,
}

#[derive(Serialize)]
pub struct CardsData {
    pub cards: Vec<Card>,
}

#[derive(Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ItemType {
    A,
    B,
    C,
}

#[derive(Serialize)]
pub struct ListItem {
    pub id: u32,
    #[serde(rename = "type")]
    pub kind: ItemType,
    pub title: String,
    pub subtitle: String,
    pub body: String,
    pub badges: Vec<String>,
    pub meta: String,
    pub color: u32,
}

#[derive(Serialize)]
pub struct ListData {
    pub items: Vec<ListItem>,
}

#[derive(Serialize)]
#[serde(untagged)]
pub enum FixtureData {
    Chain(ChainData),
    Tree(TreeData),
    Tiles(TilesData),
    Dashboard(DashboardData),
    TextFlow(TextFlowData),
    Cards(CardsData),
    List(ListData),
}

pub struct ScenarioFixture {
    pub scenario: ScenarioId,
    pub size: Size,
    pub data: FixtureData,
    pub hash: String,
}

fn tree(depth: u32, branching: u32, max_depth: u32, id: &mut u32, leaves: &mut u32) -> TreeNode {
    let node_id = *id;
    *id += 1;
    let leaf = depth >= max_depth;
    let children = if leaf {
        Vec::new()
    } else {
        (0..branching).map(|_| tree(depth + 1, branching, max_depth, id, leaves)).collect()
    };
    if leaf {
        *leaves += 1;
    }
    TreeNode {
        id: node_id,
        depth,
        dir: if depth % 2 == 0 { Dir::Row } else { Dir::Column },
        color: if leaf { node_id % P } else { depth % P },
        children,
    }
}

fn tile(rng: &mut Rng, id: u32) -> Tile {
    let title = title(rng, 1, 2);
    let subtitle = words(rng, 2);
    Tile { id, title, subtitle, color: id % P }
}

fn dashboard(rng: &mut Rng, nav: u32, stats: u32, rows: u32) -> DashboardData {
    let nav = (0..nav)
        .map(|i| NavItem { id: i, label: title(rng, 1, 2), active: i == 0 })
        .collect();
    let stats = (0..stats)
        .map(|i| {
            let up = rng.chance(0.6);
            let bars = std::array::from_fn(|_| rng.int(4, 40));
            let label = title(rng, 1, 3);
            let value = format!("{}.{}k", rng.int(1, 999), rng.int(0, 9));
            let delta = format!("{}{}%", if up { '+' } else { '-' }, rng.int(1, 40));
            StatCard { id: i, label, value, delta, up, bars }
        })
        .collect();
    let rows = (0..rows)
        .map(|i| {
            let name = title(rng, 2, 3);
            let count = rng.int(1, 9999).to_string();
            let share = format!("{}%", rng.int(0, 100));
            let status = rng.pick(&["Active", "Paused", "Draft", "Done"]).to_string();
            TableRow { id: i, name, cells: [count, share, status], color: i % P }
        })
        .collect();
    DashboardData {
        title: "Layout dashboard",
        pills: ["Today", "Week", "Month"],
        nav,
        stats,
        columns: ["Name", "Count", "Share", "Status"],
        rows,
    }
}

fn text_flow(rng: &mut Rng, paragraphs: u32) -> TextFlowData {
    let paragraphs = (0..paragraphs)
        .map(|i| {
            let size = rng.int(0, 3);
            let bold = rng.chance(0.25);
            let spacing = if rng.chance(0.3) { Spacing::Half } else { Spacing::None };
            let text = paragraph(rng, 20, 80);
            Paragraph { id: i, size, bold, spacing, clamp: i % 5 == 4, text }
        })
        .collect();
    TextFlowData { paragraphs }
}

fn cards(rng: &mut Rng, count: u32) -> CardsData {
    let cards = (0..count)
        .map(|id| {
            let title = title(rng, 2, 4);
            let body = sentence(rng, 10, 24);
            let chips = std::array::from_fn(|_| title_one(rng));
            let color = rng.int(0, P - 1);
            let color2 = rng.int(0, P - 1);
            Card { id, variant: id % 6, title, body, chips, color, color2 }
        })
        .collect();
    CardsData { cards }
}

fn title_one(rng: &mut Rng) -> String {
    title(rng, 1, 1)
}

fn list(rng: &mut Rng, count: u32) -> ListData {
    let items = (0..count)
        .map(|i| {
            let r = rng.next();
            let kind = if r < 0.5 {
                ItemType::A
            } else if r < 0.8 {
                ItemType::B
            } else {
                ItemType::C
            };
            let badges = match kind {
                ItemType::A => Vec::new(),
                ItemType::B | ItemType::C => {
                    let n = rng.int(1, 3);
                    (0..n).map(|_| title_one(rng)).collect()
                }
            };
            let title = title(rng, 2, 5);
            let subtitle_words = rng.int(3, 8);
            let subtitle = words(rng, subtitle_words);
            let body = match kind {
                ItemType::C => paragraph(rng, 15, 40),
                ItemType::A | ItemType::B => String::new(),
            };
            let meta = format!("{}m", rng.int(1, 59));
            ListItem { id: i, kind, title, subtitle, body, badges, meta, color: i % P }
        })
        .collect();
    ListData { items }
}

pub fn generate(fixture: FixtureId, size: Size) -> FixtureData {
    let mut rng = Rng::new(fnv1a(&format!("{}:{}", fixture.as_str(), size.as_str())));
    let rng = &mut rng;
    match fixture.params(size) {
        Params::Chain { depth } => FixtureData::Chain(ChainData { depth, label: format!("depth {depth}") }),
        Params::Tree { branching, depth } => {
            let (mut id, mut leaves) = (0, 0);
            let root = tree(0, branching, depth, &mut id, &mut leaves);
            FixtureData::Tree(TreeData { root, node_count: id, leaf_count: leaves })
        }
        Params::Tiles { count, insert } => {
            let tiles = (0..count).map(|i| tile(rng, i)).collect();
            let insert = (0..insert).map(|i| tile(rng, count + i)).collect();
            FixtureData::Tiles(TilesData { tiles, insert })
        }
        Params::Dashboard { nav, stats, rows } => FixtureData::Dashboard(dashboard(rng, nav, stats, rows)),
        Params::TextFlow { paragraphs } => FixtureData::TextFlow(text_flow(rng, paragraphs)),
        Params::Cards { cards: count } => FixtureData::Cards(cards(rng, count)),
        Params::List { items } => FixtureData::List(list(rng, items)),
    }
}

pub fn fixture_for(scenario: ScenarioId, size: Size) -> ScenarioFixture {
    let data = generate(scenario.fixture(), size);
    let json = serde_json::to_string(&data).expect("fixture data serializes");
    ScenarioFixture { scenario, size, data, hash: hash_json(&json) }
}
