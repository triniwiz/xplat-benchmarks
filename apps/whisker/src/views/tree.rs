use whisker::css::Border;
use whisker::prelude::*;

use super::{col, flex1, row, sentinel, view};
use crate::adapter::AppState;
use crate::bench::generate::{Dir, TreeData, TreeNode};
use crate::tokens;

fn node(state: AppState, n: &TreeNode, in_row: bool) -> Element {
    let flex = if in_row { flex1() } else { Css::new() };
    if n.children.is_empty() {
        return view(col().merge(flex).merge(css!(height: px(12), background_color: tokens::palette(n.color))), vec![]);
    }
    let base = match n.dir {
        Dir::Row => row(),
        Dir::Column => col(),
    }
    .merge(flex)
    .merge(css!(background_color: tokens::palette_light(n.color)));
    let color = n.color;
    let restyled = state.restyled;
    let style = computed(move || {
        let (padding, border) = if restyled.get() { (3, tokens::ACCENT) } else { (1, tokens::palette(color)) };
        base.clone().merge(css!(padding: px(padding), border: Border::new().width(px(1)).solid().color(border)))
    });
    let children = n.children.iter().map(|c| node(state, c, n.dir == Dir::Row)).collect::<Vec<_>>();
    View::builder().style(style).body(|b| b.extend(children)).build()
}

pub fn tree(state: AppState, data: &TreeData) -> Element {
    let shrunk = state.shrunk;
    let frame_style = computed(move || col().merge(css!(width: percent(if shrunk.get() { 80 } else { 100 }))));
    let root = node(state, &data.root, false);
    let frame = View::builder()
        .style(frame_style)
        .body(|b| {
            b.push(root);
            b.push(sentinel());
        })
        .build();
    view(col(), vec![frame])
}
