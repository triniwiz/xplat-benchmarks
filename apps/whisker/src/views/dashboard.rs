use whisker::css::{AlignItems, Border, Display, GridLine, GridTemplate, GridTrack};
use whisker::prelude::*;

use super::{bold, col, flex1, font, row, text, view};
use crate::bench::generate::{DashboardData, StatCard, TableRow};
use crate::tokens;

fn line() -> Border {
    Border::new().width(px(1)).solid().color(tokens::BORDER)
}

fn area(row_start: i16, row_end: i16, col_start: i16, col_end: i16) -> Css {
    css!(
        grid_row_start: GridLine::Number(row_start),
        grid_row_end: GridLine::Number(row_end),
        grid_column_start: GridLine::Number(col_start),
        grid_column_end: GridLine::Number(col_end),
    )
}

fn table_row(cells: Vec<Element>) -> Element {
    view(
        col().merge(css!(
            display: Display::Grid,
            grid_template_columns: GridTemplate::tracks([
                GridTrack::fraction(2.0),
                GridTrack::fraction(1.0),
                GridTrack::fraction(1.0),
                GridTrack::fraction(1.0),
            ]),
            align_items: AlignItems::Center,
            padding: (px(6), px(0)),
            border_bottom: line(),
        )),
        cells,
    )
}

fn stat(s: &StatCard) -> Element {
    let bars = s
        .bars
        .iter()
        .map(|&h| {
            view(
                col().merge(flex1()).merge(css!(
                    height: px(h),
                    margin: (px(0), px(1)),
                    border_radius: px(2),
                    background_color: tokens::ACCENT,
                )),
                vec![],
            )
        })
        .collect();
    view(
        col().merge(css!(
            margin: px(4),
            padding: px(8),
            border_radius: px(8),
            background_color: tokens::SURFACE,
            border: line(),
        )),
        vec![
            text(s.label.clone(), font(12.0, tokens::MUTED)),
            text(s.value.clone(), font(20.0, tokens::TEXT).merge(bold())),
            text(s.delta.clone(), font(12.0, if s.up { tokens::POSITIVE } else { tokens::NEGATIVE })),
            view(row().merge(css!(align_items: AlignItems::FlexEnd, height: px(40), margin_top: px(4))), bars),
        ],
    )
}

fn body_row(r: &TableRow) -> Element {
    let cell = |s: &str| text(s.to_string(), font(12.0, tokens::TEXT));
    let dot = view(
        col().merge(css!(
            width: px(8),
            height: px(8),
            border_radius: px(4),
            margin_right: px(6),
            background_color: tokens::palette(r.color),
        )),
        vec![],
    );
    let name = view(row().merge(css!(align_items: AlignItems::Center)), vec![dot, cell(&r.name)]);
    table_row(vec![name, cell(&r.cells[0]), cell(&r.cells[1]), cell(&r.cells[2])])
}

pub fn dashboard(data: &DashboardData) -> Element {
    let pills = data.pills.iter().map(|p| {
        text(
            p.to_string(),
            font(12.0, tokens::TEXT).merge(css!(
                margin_left: px(4),
                padding: (px(4), px(8)),
                border_radius: px(999),
                background_color: tokens::BG,
            )),
        )
    });
    let header = view(
        row().merge(area(1, 2, 1, 4)).merge(css!(
            align_items: AlignItems::Center,
            padding: (px(0), px(12)),
            background_color: tokens::SURFACE,
            border_bottom: line(),
        )),
        std::iter::once(text(data.title, font(16.0, tokens::TEXT).merge(bold()).merge(flex1()))).chain(pills).collect(),
    );
    let nav = view(
        col().merge(area(2, 4, 1, 2)).merge(css!(
            padding: (px(8), px(0)),
            background_color: tokens::SURFACE,
            border_right: line(),
        )),
        data.nav
            .iter()
            .map(|n| {
                let style = font(12.0, tokens::MUTED).merge(css!(padding: (px(8), px(12))));
                let style = if n.active {
                    style.merge(font(12.0, tokens::ACCENT)).merge(bold()).merge(css!(background_color: tokens::palette_light(4)))
                } else {
                    style
                };
                text(n.label.clone(), style)
            })
            .collect(),
    );
    let stats = view(
        col().merge(area(2, 3, 2, 4)).merge(css!(
            display: Display::Grid,
            grid_template_columns: GridTemplate::tracks([GridTrack::fraction(1.0), GridTrack::fraction(1.0)]),
            padding: px(4),
        )),
        data.stats.iter().map(stat).collect(),
    );
    let head = table_row(data.columns.iter().map(|c| text(c.to_string(), font(12.0, tokens::TEXT).merge(bold()))).collect());
    let table = view(
        col().merge(area(3, 4, 2, 4)).merge(css!(padding: (px(4), px(8)))),
        std::iter::once(head).chain(data.rows.iter().map(body_row)).collect(),
    );
    view(
        col().merge(css!(
            display: Display::Grid,
            grid_template_columns: GridTemplate::tracks([
                GridTrack::fixed(px(96)),
                GridTrack::fraction(1.0),
                GridTrack::fraction(1.0),
            ]),
            grid_template_rows: GridTemplate::tracks([GridTrack::fixed(px(56)), GridTrack::auto(), GridTrack::auto()]),
        )),
        vec![header, nav, stats, table],
    )
}
