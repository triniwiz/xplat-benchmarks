mod cards;
mod chain;
mod dashboard;
mod list;
mod text_flow;
mod tiles;
mod tree;

use std::sync::Arc;

use whisker::css::{Color, Flex, FlexBasis, FlexDirection, FontWeight};
use whisker::prelude::*;

use crate::adapter::{self, AppState, Mounted};
use crate::bench::generate::FixtureData;
use crate::tokens;

pub fn col() -> Css {
    css!(flex_direction: FlexDirection::Column, min_width: px(0))
}

pub fn row() -> Css {
    css!(flex_direction: FlexDirection::Row, min_width: px(0))
}

pub fn flex1() -> Css {
    css!(flex: Flex::Full { grow: 1.0, shrink: 1.0, basis: FlexBasis::LengthPercentage(px(0).into()) })
}

pub fn view(style: Css, children: Vec<Element>) -> Element {
    View::builder().style(style).body(|b| b.extend(children)).build()
}

pub fn font(size: f32, color: Color) -> Css {
    css!(font_size: px(size), color: color)
}

pub fn bold() -> Css {
    css!(font_weight: FontWeight::Bold)
}

pub fn text(value: impl Into<String>, style: Css) -> Element {
    Text::builder().value(value.into()).style(col().merge(style)).build()
}

pub fn sentinel() -> Element {
    adapter::sentinel(view(col().merge(css!(height: px(1), background_color: tokens::BG)), vec![]))
}

pub fn scenario(state: AppState, mounted: Mounted) -> Element {
    let host = |content: Vec<Element>| {
        let host = view(col().merge(css!(width: percent(100), background_color: tokens::BG)), content);
        ScrollView::builder()
            .style(col().merge(css!(flex_grow: 1.0, background_color: tokens::BG)))
            .body(|b| b.push(host))
            .build()
    };
    match &mounted.fixture.data {
        FixtureData::Chain(data) => host(vec![chain::chain(data), sentinel()]),
        FixtureData::Tree(data) => host(vec![tree::tree(state, data)]),
        FixtureData::Tiles(data) => host(tiles::tiles(state, Arc::clone(data))),
        FixtureData::Dashboard(data) => host(vec![dashboard::dashboard(data), sentinel()]),
        FixtureData::TextFlow(data) => host(vec![text_flow::text_flow(data), sentinel()]),
        FixtureData::Cards(data) => host(vec![cards::cards(data), sentinel()]),
        FixtureData::List(data) => list::list(Arc::clone(data)),
    }
}
