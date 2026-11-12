use whisker::css::{Border, BoxShadow, Color, ColorStop, Gradient, LinearDirection, Overflow, TransformFn};
use whisker::prelude::*;

use super::{bold, col, font, row, text, view};
use crate::bench::generate::{Card, CardsData};
use crate::tokens;

fn variant_style(c: &Card) -> Css {
    let border = |width: f32, color: Color| Border::new().width(px(width)).solid().color(color);
    match c.variant {
        0 => css!(
            border_radius: px(12),
            box_shadows: [BoxShadow::outer(px(0), px(2), px(6), px(0), Color::rgba(0, 0, 0, 0.2))],
        ),
        1 => css!(
            border_top_left_radius: px(16),
            border_bottom_right_radius: px(16),
            border: border(2.0, tokens::palette(c.color)),
        ),
        2 => css!(
            border_radius: px(8),
            background_image: Gradient::Linear {
                direction: LinearDirection::Angle(135.deg().into()),
                stops: vec![ColorStop::new(tokens::palette(c.color)), ColorStop::new(tokens::palette(c.color2))],
            },
        ),
        3 => css!(
            border: border(1.0, tokens::BORDER),
            border_top: border(4.0, tokens::palette(c.color)),
        ),
        4 => css!(
            opacity: 0.85,
            transform: [TransformFn::Rotate((-1).deg().into()), TransformFn::Scale(0.98.into(), 0.98.into())],
            border_radius: px(8),
            border: border(1.0, tokens::BORDER),
        ),
        5 => css!(border_radius: px(12), overflow: Overflow::Hidden),
        other => unreachable!("card variant is id % 6, got {other}"),
    }
}

fn card(c: &Card) -> Element {
    let on_gradient = c.variant == 2;
    let (title_color, body_color) = if on_gradient { (tokens::WHITE, tokens::WHITE) } else { (tokens::TEXT, tokens::MUTED) };
    let chips = c
        .chips
        .iter()
        .map(|chip| {
            text(
                chip.clone(),
                font(12.0, tokens::TEXT).merge(css!(
                    padding: (px(2), px(8)),
                    margin_right: px(4),
                    border_radius: px(999),
                    background_color: tokens::palette_light(c.color),
                )),
            )
        })
        .collect();
    let inner = view(
        col().merge(css!(padding: px(12))),
        vec![
            text(c.title.clone(), font(16.0, title_color).merge(bold())),
            text(
                c.body.clone(),
                font(14.0, body_color).merge(css!(line_height: px(20), margin_top: px(4))),
            ),
            view(row().merge(css!(margin_top: px(8))), chips),
        ],
    );
    let mut children = Vec::with_capacity(2);
    if c.variant == 5 {
        children.push(view(col().merge(css!(height: px(24), background_color: tokens::palette(c.color))), vec![]));
    }
    children.push(inner);
    view(
        col().merge(css!(margin: px(8), background_color: tokens::SURFACE)).merge(variant_style(c)),
        children,
    )
}

pub fn cards(data: &CardsData) -> Element {
    view(col().merge(css!(padding: px(4))), data.cards.iter().map(card).collect())
}
