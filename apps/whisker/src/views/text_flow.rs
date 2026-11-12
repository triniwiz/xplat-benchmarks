use whisker::css::TextOverflow;
use whisker::prelude::*;

use super::{bold, col, font, view};
use crate::bench::generate::{Paragraph, Spacing, TextFlowData};
use crate::tokens;

fn paragraph(p: &Paragraph) -> Element {
    let size = tokens::FONT_SIZES[p.size as usize];
    let mut style = col().merge(font(size, tokens::TEXT)).merge(css!(line_height: px(tokens::line_height(size)), margin_bottom: px(8)));
    if p.bold {
        style = style.merge(bold());
    }
    match p.spacing {
        Spacing::Half => style = style.merge(css!(letter_spacing: px(0.5))),
        Spacing::None => {}
    }
    let mut text = Text::builder().value(p.text.clone());
    if p.clamp {
        style = style.merge(css!(text_overflow: TextOverflow::Ellipsis));
        text = text.max_lines(2u32);
    }
    text.style(style).build()
}

pub fn text_flow(data: &TextFlowData) -> Element {
    view(col().merge(css!(padding: px(12))), data.paragraphs.iter().map(paragraph).collect())
}
