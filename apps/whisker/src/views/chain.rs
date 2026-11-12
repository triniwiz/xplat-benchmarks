use whisker::css::Border;
use whisker::prelude::*;

use super::{col, font, text, view};
use crate::bench::generate::ChainData;
use crate::tokens;

pub fn chain(data: &ChainData) -> Element {
    let label = text(data.label.clone(), font(12.0, tokens::TEXT).merge(css!(padding: px(4))));
    (0..data.depth).rev().fold(label, |inner, level| {
        let style = col().merge(css!(
            padding: (px(1), px(0), px(1), px(1)),
            border_left: Border::new().width(px(1)).solid().color(tokens::palette(level)),
            background_color: tokens::palette_light(level),
        ));
        view(style, vec![inner])
    })
}
