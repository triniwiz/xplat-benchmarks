use std::sync::Arc;

use whisker::css::{FlexWrap, FlexDirection};
use whisker::prelude::*;

use super::{bold, col, font, sentinel, text, view};
use crate::adapter::AppState;
use crate::bench::generate::{Tile, TilesData};
use crate::tokens;

#[derive(Clone, Copy, PartialEq)]
enum Slot {
    Base(usize),
    Inserted(usize),
}

fn tile(t: &Tile) -> Element {
    view(
        col().merge(css!(
            width: px(88),
            margin: px(4),
            padding: px(8),
            border_radius: px(8),
            background_color: tokens::palette_light(t.color),
        )),
        vec![
            text(t.title.clone(), font(14.0, tokens::TEXT).merge(bold())),
            text(t.subtitle.clone(), font(12.0, tokens::MUTED)),
        ],
    )
}

pub fn tiles(state: AppState, data: Arc<TilesData>) -> Vec<Element> {
    let inserted = state.inserted;
    let base = data.tiles.len();
    let added = data.insert.len();
    let key_data = Arc::clone(&data);
    let item_data = Arc::clone(&data);
    let each = move || {
        let head = if inserted.get() { added } else { 0 };
        (0..head).map(Slot::Inserted).chain((0..base).map(Slot::Base)).collect::<Vec<_>>()
    };
    let lookup = move |d: &TilesData, slot: Slot| -> u32 {
        match slot {
            Slot::Base(i) => d.tiles[i].id,
            Slot::Inserted(i) => d.insert[i].id,
        }
    };
    let container = View::builder()
        .style(css!(flex_direction: FlexDirection::Row, flex_wrap: FlexWrap::Wrap, min_width: px(0), padding: px(4)))
        .body(|b| {
            b.push(render! {
                ForEach(
                    each: each,
                    key: move |slot: &Slot| lookup(&key_data, *slot),
                    children: move |slot: ReadSignal<Slot>| match slot.get_untracked() {
                        Slot::Base(i) => tile(&item_data.tiles[i]),
                        Slot::Inserted(i) => tile(&item_data.insert[i]),
                    },
                )
            });
        })
        .build();
    vec![container, sentinel()]
}
