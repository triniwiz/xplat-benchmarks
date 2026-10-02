import UIKit

/// Status line above a full-screen vertical scroll host, as in native-ios. The chrome (status,
/// home screen) is UIKit; only the scenario trees are Mason.
final class RootViewController: UIViewController {
    let status = BoxLabel("native-ios-mason · ready", font: .systemFont(ofSize: 11), color: C.muted,
                          insets: UIEdgeInsets(top: 4, left: 8, bottom: 4, right: 8), lines: 1)
    let host = ScrollHost()
    private(set) var bench: Bench!
    private var home: UIView?

    override func viewDidLoad() {
        super.viewDidLoad()
        bench = Bench(self)
        view.backgroundColor = C.bg
        status.backgroundColor = C.surface
        host.translatesAutoresizingMaskIntoConstraints = false
        host.backgroundColor = C.bg
        host.contentInsetAdjustmentBehavior = .never
        view.addSubview(status)
        view.addSubview(host)
        let safe = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            status.topAnchor.constraint(equalTo: safe.topAnchor),
            status.leadingAnchor.constraint(equalTo: safe.leadingAnchor),
            status.trailingAnchor.constraint(equalTo: safe.trailingAnchor),
            status.heightAnchor.constraint(equalToConstant: 24),
            host.topAnchor.constraint(equalTo: status.bottomAnchor),
            host.leadingAnchor.constraint(equalTo: safe.leadingAnchor),
            host.trailingAnchor.constraint(equalTo: safe.trailingAnchor),
            host.bottomAnchor.constraint(equalTo: safe.bottomAnchor),
        ])
        // The home screen sits over the host until the first scenario replaces it.
        let h = buildHome()
        home = h
        view.addSubview(h)
        NSLayoutConstraint.activate([
            h.topAnchor.constraint(equalTo: host.topAnchor),
            h.leadingAnchor.constraint(equalTo: host.leadingAnchor),
            h.trailingAnchor.constraint(equalTo: host.trailingAnchor),
        ])
    }

    func setStatus(_ text: String) { status.text = text }

    func hideHome() {
        home?.removeFromSuperview()
        home = nil
    }

    func showList(_ table: UIView) {
        host.isHidden = true
        view.addSubview(table)
        NSLayoutConstraint.activate([
            table.topAnchor.constraint(equalTo: host.topAnchor),
            table.leadingAnchor.constraint(equalTo: host.leadingAnchor),
            table.trailingAnchor.constraint(equalTo: host.trailingAnchor),
            table.bottomAnchor.constraint(equalTo: host.bottomAnchor),
        ])
    }

    func hideList(_ table: UIView) {
        table.removeFromSuperview()
        host.isHidden = false
    }

    private func buildHome() -> UIView {
        let col = stack(.vertical, margins: NSDirectionalEdgeInsets(top: 12, leading: 12, bottom: 12, trailing: 12))
        col.backgroundColor = C.bg
        let title = BoxLabel("xplat-benchmarks · Native iOS + Mason", font: .boldSystemFont(ofSize: 16), color: C.text)
        col.addArrangedSubview(title)
        col.setCustomSpacing(8, after: title)
        for sc in SCENARIOS {
            let label = BoxLabel(sc.title, font: .systemFont(ofSize: 13), color: C.text)
            label.setContentHuggingPriority(UILayoutPriority(1), for: .horizontal)
            let row = stack(.horizontal, [label], spacing: 4, alignment: .center)
            for size in SIZES {
                var cfg = UIButton.Configuration.plain()
                cfg.attributedTitle = AttributedString(size, attributes: AttributeContainer([.font: UIFont.systemFont(ofSize: 12), .foregroundColor: C.text]))
                cfg.contentInsets = NSDirectionalEdgeInsets(top: 4, leading: 10, bottom: 4, trailing: 10)
                cfg.background.backgroundColor = C.paletteLight[4]
                cfg.background.cornerRadius = 4
                let b = UIButton(configuration: cfg)
                b.addAction(UIAction { [weak self] _ in self?.bench.show(sc.id, size) }, for: .touchUpInside)
                row.addArrangedSubview(b)
            }
            col.addArrangedSubview(row)
            col.setCustomSpacing(4, after: row)
        }
        return col
    }
}
