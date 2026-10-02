import UIKit

// UIKit chrome only (status line, home screen, sentinel); the scenario trees are Mason (MasonViews.swift).

/// UILabel with padding, for the status line.
final class BoxLabel: UILabel {
    var insets: UIEdgeInsets = .zero { didSet { invalidateIntrinsicContentSize() } }

    convenience init(_ text: String?, font: UIFont, color: UIColor, insets: UIEdgeInsets = .zero, lines: Int = 0) {
        self.init(frame: .zero)
        self.text = text
        self.font = font
        self.textColor = color
        self.insets = insets
        self.numberOfLines = lines
        translatesAutoresizingMaskIntoConstraints = false
    }

    override func textRect(forBounds bounds: CGRect, limitedToNumberOfLines n: Int) -> CGRect {
        if insets == .zero { return super.textRect(forBounds: bounds, limitedToNumberOfLines: n) }
        let r = super.textRect(forBounds: bounds.inset(by: insets), limitedToNumberOfLines: n)
        return r.inset(by: UIEdgeInsets(top: -insets.top, left: -insets.left, bottom: -insets.bottom, right: -insets.right))
    }

    override func drawText(in rect: CGRect) { super.drawText(in: rect.inset(by: insets)) }
}

/// The 1pt plain UIView appended to every scenario root, a foreign leaf in the Mason tree.
/// Mason sets its frame like any other node; its layoutSubviews is the "painted" hook.
final class SentinelView: UIView {
    var onLayout: (() -> Void)?

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = C.bg
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        onLayout?()
    }
}

func stack(_ axis: NSLayoutConstraint.Axis, _ views: [UIView] = [], spacing: CGFloat = 0,
           alignment: UIStackView.Alignment = .fill, margins: NSDirectionalEdgeInsets = .zero) -> UIStackView {
    let s = UIStackView(arrangedSubviews: views)
    s.axis = axis
    s.spacing = spacing
    s.alignment = alignment
    s.translatesAutoresizingMaskIntoConstraints = false
    if margins != .zero {
        s.isLayoutMarginsRelativeArrangement = true
        s.directionalLayoutMargins = margins
    }
    return s
}
