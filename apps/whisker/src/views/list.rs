use std::sync::Arc;

use whisker::css::{AlignItems, Border};
use whisker::prelude::*;

use super::{bold, col, flex1, font, row, text, view};
use crate::adapter;
use crate::bench::generate::{ItemType, ListData, ListItem};
use crate::tokens;

fn square(size: f32, radius: f32, color: u32) -> Element {
    view(
        col().merge(css!(
            width: px(size),
            height: px(size),
            border_radius: px(radius),
            margin_right: px(12),
            background_color: tokens::palette(color),
        )),
        vec![],
    )
}

fn badges(item: &ListItem) -> Option<Element> {
    if item.badges.is_empty() {
        return None;
    }
    let badges = item
        .badges
        .iter()
        .map(|b| {
            text(
                b.clone(),
                font(10.0, tokens::TEXT).merge(css!(
                    padding: (px(2), px(6)),
                    margin_right: px(4),
                    border_radius: px(4),
                    background_color: tokens::palette_light(item.color),
                )),
            )
        })
        .collect();
    Some(view(row().merge(css!(margin_top: px(4))), badges))
}

fn text_column(item: &ListItem, with_badges: bool) -> Element {
    let mut children = vec![
        text(item.title.clone(), font(14.0, tokens::TEXT).merge(bold())),
        text(item.subtitle.clone(), font(12.0, tokens::MUTED)),
    ];
    if with_badges {
        children.extend(badges(item));
    }
    view(col().merge(flex1()), children)
}

fn meta(item: &ListItem) -> Element {
    text(item.meta.clone(), font(12.0, tokens::MUTED).merge(css!(margin_left: px(8))))
}

fn line() -> Border {
    Border::new().width(px(1)).solid().color(tokens::BORDER)
}

fn item(item: &ListItem) -> Element {
    let row_style = || {
        row().merge(css!(
            align_items: AlignItems::Center,
            padding: (px(12), px(16)),
            background_color: tokens::SURFACE,
            border_bottom: line(),
        ))
    };
    match item.kind {
        ItemType::A => view(row_style(), vec![square(32.0, 16.0, item.color), text_column(item, false), meta(item)]),
        ItemType::B => view(row_style(), vec![square(56.0, 8.0, item.color), text_column(item, true), meta(item)]),
        ItemType::C => {
            let head = view(
                row().merge(css!(align_items: AlignItems::Center)),
                vec![square(32.0, 16.0, item.color), text_column(item, false), meta(item)],
            );
            let body = text(item.body.clone(), font(14.0, tokens::TEXT).merge(css!(line_height: px(20), margin_top: px(8))));
            let mut children = vec![head, body];
            children.extend(badges(item));
            view(
                col().merge(css!(
                    margin: (px(8), px(12)),
                    padding: px(12),
                    border_radius: px(12),
                    background_color: tokens::SURFACE,
                    border: line(),
                )),
                children,
            )
        }
    }
}

pub fn list(data: Arc<ListData>) -> Element {
    let count = data.items.len();
    let element = render! {
        List(
            each: move || (0..count).collect::<Vec<usize>>(),
            key: |i: &usize| *i,
            children: move |i: ReadSignal<usize>| item(&data.items[i.get_untracked()]),
            style: col().merge(css!(flex_grow: 1.0, background_color: tokens::BG)),
        )
    };
    adapter::sentinel(element)
}
