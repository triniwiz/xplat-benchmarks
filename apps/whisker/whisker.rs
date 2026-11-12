fn main() {
    whisker_cng::run(|app| {
        app.name("Whisker Bench")
            .bundle_id("org.xplatbench.whisker")
            .background("#F5F6FA")
            .version("0.1.0")
            .build_number(1);

        app.android(|a| {
            a.package("org.xplatbench.whisker")
                .application_id("org.xplatbench.whisker")
                .launcher_activity(".MainActivity")
                .min_sdk(31)
                .target_sdk(34);
        });
    });
}
