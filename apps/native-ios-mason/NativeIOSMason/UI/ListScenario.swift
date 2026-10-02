import Mason
import UIKit

/// list-scroll: UITableView with one reuse identifier per item type, as in native-ios. Each cell's
/// content is a Mason root (`.li-cell`, width 100%) built like the NativeScript + Mason app's Ul
/// item templates; the cell sizes itself by computing that root at the table width.
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
        table.register(MasonListCell.self, forCellReuseIdentifier: "a")
        table.register(MasonListCell.self, forCellReuseIdentifier: "b")
        table.register(MasonListCell.self, forCellReuseIdentifier: "c")
        table.dataSource = self
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { items.count }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let item = items[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: item.type, for: indexPath) as! MasonListCell
        cell.configure(item)
        return cell
    }
}

final class MasonListCell: UITableViewCell {
    private var root: MasonUIView?
    private var mark: MasonUIView!
    private var title: MasonText!
    private var sub: MasonText!
    private var meta: MasonText!
    private var body: MasonText?
    private var badges: MasonUIView?

    private func build(_ type: String) {
        backgroundColor = C.bg
        contentView.backgroundColor = C.bg
        let view: MasonUIView
        if type == "c" {
            let head = headRow(row: false, thumb: false, withBadges: false)
            // .li-body { 14px/20px text; margin-top: 8px }
            let body = txt("") { s in
                s.font(14, color: MC.text)
                s.lineHeightPx(20)
                s.mar(8, 0, 0, 0)
            }
            self.body = body
            let badges = badgeRow()
            self.badges = badges
            // .li-card { margin: 8px 12px; padding: 12px; border-radius: 12px; bg surface; border: 1px solid border }
            view = div([head, body, badges]) { s in
                s.mar(8, 12, 8, 12)
                s.pad(12)
                s.borderRadius = "12px"
                s.backgroundColor = MC.surface
                s.solidBorder(1, 1, 1, 1, Tokens.border)
            }
        } else {
            view = headRow(row: true, thumb: type == "b", withBadges: type == "b")
        }
        // .li-cell { width: 100% }
        let root = div([view]) { $0.width = .Percent(1) }
        self.root = root
        contentView.addSubview(root)
    }

    /// .li-row (or .li-card-head): mark, .li-text column (title, sub, badges?) and .li-meta.
    private func headRow(row: Bool, thumb: Bool, withBadges: Bool) -> MasonUIView {
        // .avatar { 32x32; radius 16px; margin-right: 12px } / .thumb { 56x56; radius 8px; margin-right: 12px }
        mark = div { s in
            let side: Float = thumb ? 56 : 32
            s.width = dim(side)
            s.height = dim(side)
            s.borderRadius = thumb ? "8px" : "16px"
            s.mar(0, 12, 0, 0)
        }
        title = txt("") { $0.font(14, bold: true, color: MC.text) }
        sub = txt("") { $0.font(12, color: MC.muted) }
        meta = txt("") { s in
            s.font(12, color: MC.muted)
            s.mar(0, 0, 0, 8)
        }
        let col = div([title, sub]) { $0.flex1() }
        if withBadges {
            let b = badgeRow()
            badges = b
            col.addView(b)
        }
        return div([mark, col, meta]) { s in
            s.flexDirection = .Row
            s.alignItems = .Center
            if row {
                // .li-row { padding: 12px 16px; bg surface; border-bottom: 1px }
                s.pad(12, 16, 12, 16)
                s.backgroundColor = MC.surface
                s.solidBorder(0, 0, 1, 0, Tokens.border)
            }
        }
    }

    /// .badges { row; margin-top: 4px }
    private func badgeRow() -> MasonUIView {
        div { s in
            s.flexDirection = .Row
            s.mar(4, 0, 0, 0)
        }
    }

    func configure(_ item: ListItem) {
        if root == nil { build(item.type) }
        mark.configure { $0.backgroundColor = MC.palette[item.color] }
        title.textContent = item.title
        sub.textContent = item.subtitle
        meta.textContent = item.meta
        body?.textContent = item.body
        if let badges {
            // As the NativeScript + Mason app's itemLoading: drop the old badges, add new ones.
            badges.removeAllChildren()
            for b in item.badges {
                // .badge { padding: 2px 6px; margin-right: 4px; border-radius: 4px; 10px text } + bgl-c
                badges.addView(txt(b) { s in
                    s.pad(2, 6, 2, 6)
                    s.mar(0, 4, 0, 0)
                    s.borderRadius = "4px"
                    s.font(10, color: MC.text)
                    s.backgroundColor = MC.paletteLight[item.color]
                })
            }
        }
    }

    /// Computes the Mason root at `width` (max-content height) when it is dirty or the width changed.
    private func height(for width: CGFloat) -> CGFloat {
        guard let root, width > 0 else { return 0 }
        let w = px(Float(width))
        if root.isNodeDirty() || !laidOut(root, at: width) {
            root.computeWithSize(w, -2)
        }
        root.markRootComputeApplied(w, -2)
        return CGFloat(root.node.computedLayout.height / NSCMason.scale)
    }

    override func systemLayoutSizeFitting(_ targetSize: CGSize, withHorizontalFittingPriority h: UILayoutPriority,
                                          verticalFittingPriority v: UILayoutPriority) -> CGSize {
        CGSize(width: targetSize.width, height: height(for: targetSize.width))
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        _ = height(for: contentView.bounds.width)
    }
}
