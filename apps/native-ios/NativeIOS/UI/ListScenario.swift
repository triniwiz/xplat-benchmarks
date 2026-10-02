import UIKit

/// list-scroll: the one virtualized scenario. UITableView with self-sizing cells and one reuse
/// identifier per item type (the UIKit counterpart of FlashList's getItemType).
final class ListTableView: UITableView {
    var onLayout: (() -> Void)?

    override func layoutSubviews() {
        super.layoutSubviews()
        onLayout?()
    }
}

final class ListController: NSObject, UITableViewDataSource {
    let table = ListTableView(frame: .zero, style: .plain)
    private let items: [ListItem]

    init(_ d: ListData) {
        items = d.items
        super.init()
        table.translatesAutoresizingMaskIntoConstraints = false
        table.backgroundColor = C.bg
        table.separatorStyle = .none
        table.rowHeight = UITableView.automaticDimension
        table.estimatedRowHeight = 64
        table.allowsSelection = false
        table.register(ListCell.self, forCellReuseIdentifier: "a")
        table.register(ListCell.self, forCellReuseIdentifier: "b")
        table.register(ListCell.self, forCellReuseIdentifier: "c")
        table.dataSource = self
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { items.count }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let item = items[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: item.type, for: indexPath) as! ListCell
        cell.configure(item)
        return cell
    }
}

final class ListCell: UITableViewCell {
    private let visual = block(color: C.palette[0])
    private let title = BoxLabel(nil, font: F.bold(14), color: C.text)
    private let subtitle = BoxLabel(nil, font: F.regular(12), color: C.muted)
    private let meta = BoxLabel(nil, font: F.regular(12), color: C.muted)
    private let body = UILabel()
    private var badges: [BoxLabel] = []
    private var built = false

    private func badgeRow() -> UIStackView {
        let row = stack(.horizontal, spacing: 4)
        for _ in 0..<3 {
            let b = BoxLabel(nil, font: F.regular(10), color: C.text, insets: UIEdgeInsets(top: 2, left: 6, bottom: 2, right: 6), lines: 1)
            badges.append(b)
            row.addArrangedSubview(b)
        }
        row.addArrangedSubview(spacer())
        return row
    }

    private func build(_ type: String) {
        built = true
        backgroundColor = C.bg
        contentView.backgroundColor = C.bg
        let text = stack(.vertical, [title, subtitle])
        text.setContentHuggingPriority(UILayoutPriority(1), for: .horizontal)
        meta.setContentHuggingPriority(.required, for: .horizontal)
        meta.setContentCompressionResistancePriority(.required, for: .horizontal)
        let side: CGFloat = type == "b" ? 56 : 32
        visual.widthAnchor.constraint(equalToConstant: side).isActive = true
        visual.heightAnchor.constraint(equalToConstant: side).isActive = true
        visual.layer.cornerRadius = type == "b" ? 8 : 16

        let root: UIView
        var pin = UIEdgeInsets.zero
        if type != "c" {
            if type == "b" {
                let row = badgeRow()
                text.addArrangedSubview(row)
                text.setCustomSpacing(4, after: subtitle)
            }
            let row = Box(axis: .horizontal, margins: insets(12, 16, 13, 16), background: C.surface, alignment: .center)
            row.edge(.bottom, 1, C.border.cgColor)
            row.addArrangedSubview(visual)
            row.addArrangedSubview(text)
            row.addArrangedSubview(meta)
            row.setCustomSpacing(12, after: visual)
            row.setCustomSpacing(8, after: text)
            root = row
        } else {
            let head = stack(.horizontal, [visual, text, meta], alignment: .center)
            head.setCustomSpacing(12, after: visual)
            head.setCustomSpacing(8, after: text)
            body.numberOfLines = 0
            body.translatesAutoresizingMaskIntoConstraints = false
            let card = Box(axis: .vertical, margins: all(13), background: C.surface)
            card.layer.cornerRadius = 12
            card.layer.borderWidth = 1
            card.layer.borderColor = C.border.cgColor
            card.addArrangedSubview(head)
            card.addArrangedSubview(body)
            card.addArrangedSubview(badgeRow())
            card.setCustomSpacing(8, after: head)
            card.setCustomSpacing(4, after: body)
            root = card
            pin = UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12)
        }
        contentView.addSubview(root)
        let bottom = root.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -pin.bottom)
        bottom.priority = UILayoutPriority(999)
        NSLayoutConstraint.activate([
            root.topAnchor.constraint(equalTo: contentView.topAnchor, constant: pin.top),
            root.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: pin.left),
            root.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -pin.right),
            bottom,
        ])
    }

    func configure(_ item: ListItem) {
        if !built { build(item.type) }
        visual.backgroundColor = C.palette[item.color]
        title.text = item.title
        subtitle.text = item.subtitle
        meta.text = item.meta
        if item.type == "c" {
            body.attributedText = lineHeightText(item.body, font: F.regular(14), color: C.text, lineHeight: 20)
        }
        for (i, b) in badges.enumerated() {
            if i < item.badges.count {
                b.isHidden = false
                b.text = item.badges[i]
                b.fill(C.paletteLight[item.color], radius: 4)
            } else {
                b.isHidden = true
            }
        }
    }
}
