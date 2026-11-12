mod adapter;
pub mod bench;
mod host;
mod tokens;
mod views;

use std::sync::Arc;

use whisker::css::FlexDirection;
use whisker::RuntimeDispatcher;
use whisker::prelude::*;

use bench::generate::fixture_for;
use bench::protocol::{LaunchCommand, parse_launch_url};

fn start(dispatcher: RuntimeDispatcher, url: Option<String>) {
    match url.as_deref().and_then(parse_launch_url) {
        Some(LaunchCommand::Run { host, run_id }) => {
            let worker = adapter::WorkerAdapter { dispatcher };
            std::thread::spawn(move || bench::runner::run_plan(&worker, &host, &run_id));
        }
        Some(LaunchCommand::Show { scenario, size }) => {
            let fixture = Arc::new(fixture_for(scenario, size));
            dispatcher.post(move || adapter::show(fixture));
        }
        None => {
            if let Some(url) = url {
                adapter::state().status.set(format!("{} · ignored launch URL {url}", adapter::APP_ID));
            }
        }
    }
}

#[whisker::main]
fn app() -> Element {
    let dispatcher = runtime_dispatcher().expect("app runs inside a Whisker runtime");
    let launch = host::launch_on_ui_thread().unwrap_or_else(|e| {
        host::log(&format!("launch details unavailable: {e}"));
        host::Launch { url: None, inset_top_dp: 0.0, inset_bottom_dp: 0.0, screen_width_dp: None }
    });
    let state = adapter::init(dispatcher.clone(), launch.screen_width_dp);
    let status = Text::builder()
        .value(state.status)
        .style(views::font(11.0, tokens::MUTED).merge(css!(
            height: px(24),
            padding: (px(4), px(8)),
            background_color: tokens::SURFACE,
        )))
        .build();
    let frame_forcer = View::builder()
        .style(computed(move || css!(height: px(0), width: px(if state.frame_forcer.get() { 1 } else { 0 }))))
        .build();
    adapter::set_frame_forcer(frame_forcer);
    let body = render! {
        ForEach(
            each: move || state.mounted.get().into_iter().collect::<Vec<_>>(),
            key: |m: &adapter::Mounted| m.generation,
            children: move |m: ReadSignal<adapter::Mounted>| views::scenario(state, m.get_untracked()),
        )
    };
    let frame = View::builder()
        .style(css!(
            flex_grow: 1.0,
            flex_direction: FlexDirection::Column,
            padding_top: px(launch.inset_top_dp),
            padding_bottom: px(launch.inset_bottom_dp),
            background_color: tokens::BG,
        ))
        .body(|b| {
            b.push(status);
            b.push(frame_forcer);
            b.push(body);
        })
        .build();
    start(dispatcher, launch.url);
    frame
}
