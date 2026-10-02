import SwiftUI
import UIKit
import Observation

/// Everything the root view shows. Bench changes it; SwiftUI re-renders from it.
@Observable
final class AppModel {
    var status = "native-ios-swiftui · ready"
    var home = true
    var scenario: MountedScenario?
    var list: MountedScenario?
}

/// The window root: a UIHostingController around RootView, so the scene and URL handling stay
/// as in native-ios.
final class HostController: UIHostingController<RootView> {
    let bench: Bench

    init() {
        let model = AppModel()
        let bench = Bench(model)
        self.bench = bench
        super.init(rootView: RootView(model: model, bench: bench))
        bench.host = self
    }

    @MainActor required dynamic init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(C.bg)
    }
}

/// Status line above a full-screen vertical ScrollView, as in the other apps. list-scroll covers
/// the scroll host with its own lazy list (native-ios hides the host and shows a table there).
struct RootView: View {
    let model: AppModel
    let bench: Bench

    var body: some View {
        VStack(spacing: 0) {
            StatusBar(model: model)
            ScrollView(.vertical) {
                ScrollContent(model: model, bench: bench)
            }
            .overlay { ListHost(model: model) }
        }
        .background(C.bg.ignoresSafeArea())
    }
}

struct StatusBar: View {
    let model: AppModel

    var body: some View {
        Text(model.status).font(F.regular(11)).foregroundColor(C.muted).lineLimit(1)
            .padding(.horizontal, 8)
            .frame(maxWidth: .infinity, alignment: .leading)
            .frame(height: 24)
            .background(C.surface)
    }
}

struct ScrollContent: View {
    let model: AppModel
    let bench: Bench

    var body: some View {
        VStack(spacing: 0) {
            if model.home { HomeView(bench: bench) }
            if let s = model.scenario { s.content.id(s.id) }
        }
    }
}

struct ListHost: View {
    let model: AppModel

    var body: some View {
        if let l = model.list { l.content.id(l.id) }
    }
}

struct HomeView: View {
    let bench: Bench

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("xplat-benchmarks · Native iOS (SwiftUI)").font(F.bold(16)).foregroundColor(C.text)
                .padding(.bottom, 4)
            ForEach(SCENARIOS, id: \.id) { sc in
                HStack(spacing: 4) {
                    Text(sc.title).font(F.regular(13)).foregroundColor(C.text)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    ForEach(SIZES, id: \.self) { size in
                        Button { bench.show(sc.id, size) } label: {
                            Text(size).font(F.regular(12)).foregroundColor(C.text)
                                .padding(EdgeInsets(top: 4, leading: 10, bottom: 4, trailing: 10))
                                .background(C.paletteLight[4], in: RoundedRectangle(cornerRadius: 4))
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
