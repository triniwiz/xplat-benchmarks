import UIKit

/// UILabel with padding (the RN `<Text style={{padding}}>` case), an optional pill radius and
/// optional top-aligned drawing for labels that a stretching parent makes taller than their text.
final class BoxLabel: UILabel {
    var insets: UIEdgeInsets = .zero { didSet { invalidateIntrinsicContentSize() } }
    var pill = false
    var topAligned = false

    convenience init(_ text: String?, font: UIFont, color: UIColor, insets: UIEdgeInsets = .zero, lines: Int = 0) {
        self.init(frame: .zero)
        self.text = text
        self.font = font
        self.textColor = color
        self.insets = insets
        self.numberOfLines = lines
        translatesAutoresizingMaskIntoConstraints = false
    }

    /// Background painted on the layer so a corner radius applies without clipping.
    func fill(_ color: UIColor, radius: CGFloat = 0) {
        layer.backgroundColor = color.cgColor
        layer.cornerRadius = radius
    }

    override func textRect(forBounds bounds: CGRect, limitedToNumberOfLines n: Int) -> CGRect {
        if insets == .zero { return super.textRect(forBounds: bounds, limitedToNumberOfLines: n) }
        let r = super.textRect(forBounds: bounds.inset(by: insets), limitedToNumberOfLines: n)
        return r.inset(by: UIEdgeInsets(top: -insets.top, left: -insets.left, bottom: -insets.bottom, right: -insets.right))
    }

    override func drawText(in rect: CGRect) {
        let inner = rect.inset(by: insets)
        if topAligned {
            let r = super.textRect(forBounds: inner, limitedToNumberOfLines: numberOfLines)
            super.drawText(in: CGRect(x: inner.minX, y: inner.minY, width: inner.width, height: min(r.height, inner.height)))
        } else {
            super.drawText(in: inner)
        }
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        if pill { layer.cornerRadius = min(999, bounds.height / 2) }
    }
}

enum Side { case top, left, bottom, right }

/// UIStackView with the CSS box extras UIKit has no property for: one-sided borders, a
/// linear gradient and a shadow path. Padding plus border width goes in the layout margins.
final class Box: UIStackView {
    private var edges: [(Side, CGFloat, CALayer)] = []
    private var gradient: CAGradientLayer?
    var shadowRadius: CGFloat?
    private var lastSize: CGSize = .zero

    convenience init(axis: NSLayoutConstraint.Axis, margins: NSDirectionalEdgeInsets = .zero,
                     background: UIColor? = nil, alignment: UIStackView.Alignment = .fill) {
        self.init(frame: .zero)
        self.axis = axis
        self.alignment = alignment
        translatesAutoresizingMaskIntoConstraints = false
        if margins != .zero {
            isLayoutMarginsRelativeArrangement = true
            directionalLayoutMargins = margins
        }
        if let background { backgroundColor = background }
    }

    func edge(_ side: Side, _ width: CGFloat, _ color: CGColor) {
        let l = CALayer()
        l.backgroundColor = color
        layer.addSublayer(l)
        edges.append((side, width, l))
    }

    /// CSS `linear-gradient(<angle>deg, from, to)`.
    func linearGradient(_ from: CGColor, _ to: CGColor, radius: CGFloat) {
        let g = CAGradientLayer()
        g.colors = [from, to]
        g.cornerRadius = radius
        layer.insertSublayer(g, at: 0)
        gradient = g
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        let size = bounds.size
        if size == lastSize || (edges.isEmpty && gradient == nil && shadowRadius == nil) { return }
        lastSize = size
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        for (side, w, l) in edges {
            switch side {
            case .top: l.frame = CGRect(x: 0, y: 0, width: size.width, height: w)
            case .bottom: l.frame = CGRect(x: 0, y: size.height - w, width: size.width, height: w)
            case .left: l.frame = CGRect(x: 0, y: 0, width: w, height: size.height)
            case .right: l.frame = CGRect(x: size.width - w, y: 0, width: w, height: size.height)
            }
        }
        if let g = gradient, size.width > 0, size.height > 0 {
            // 135deg as in CSS: corners get the exact end colours, isolines perpendicular to 135deg in points.
            // CAGradientLayer interpolates in unit space, so map the point-space gradient into it:
            // t = (x + y) / (w + h) for 135deg, i.e. start (0,0) and end g/|g|^2 with g = (w, h)/(w + h).
            let w = size.width, h = size.height
            let k = (w + h) / (w * w + h * h)
            g.frame = bounds
            g.startPoint = .zero
            g.endPoint = CGPoint(x: w * k, y: h * k)
        }
        if let r = shadowRadius {
            layer.shadowPath = UIBezierPath(roundedRect: bounds, cornerRadius: r).cgPath
        }
        CATransaction.commit()
    }
}

/// The 1pt view appended to every scenario root. Its layoutSubviews is the "painted" hook.
final class SentinelView: UIView {
    var onLayout: (() -> Void)?

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = C.bg
        translatesAutoresizingMaskIntoConstraints = false
        heightAnchor.constraint(equalToConstant: 1).isActive = true
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        onLayout?()
    }
}

func stack(_ axis: NSLayoutConstraint.Axis, _ views: [UIView] = [], spacing: CGFloat = 0,
           alignment: UIStackView.Alignment = .fill, distribution: UIStackView.Distribution = .fill,
           margins: NSDirectionalEdgeInsets = .zero) -> UIStackView {
    let s = UIStackView(arrangedSubviews: views)
    s.axis = axis
    s.spacing = spacing
    s.alignment = alignment
    s.distribution = distribution
    s.translatesAutoresizingMaskIntoConstraints = false
    if margins != .zero {
        s.isLayoutMarginsRelativeArrangement = true
        s.directionalLayoutMargins = margins
    }
    return s
}

/// Fixed-size plain view (avatars, dots, bars, leaves, bands).
func block(width: CGFloat? = nil, height: CGFloat? = nil, color: UIColor, radius: CGFloat = 0) -> UIView {
    let v = UIView()
    v.translatesAutoresizingMaskIntoConstraints = false
    v.backgroundColor = color
    if radius > 0 { v.layer.cornerRadius = radius }
    if let width { v.widthAnchor.constraint(equalToConstant: width).isActive = true }
    if let height { v.heightAnchor.constraint(equalToConstant: height).isActive = true }
    return v
}

/// Absorbs the free space in a stack, like the empty end of a CSS flex line.
func spacer() -> UIView {
    let v = UIView()
    v.translatesAutoresizingMaskIntoConstraints = false
    v.setContentHuggingPriority(UILayoutPriority(1), for: .horizontal)
    v.setContentHuggingPriority(UILayoutPriority(1), for: .vertical)
    return v
}

func insets(_ top: CGFloat, _ leading: CGFloat, _ bottom: CGFloat, _ trailing: CGFloat) -> NSDirectionalEdgeInsets {
    NSDirectionalEdgeInsets(top: top, leading: leading, bottom: bottom, trailing: trailing)
}

func all(_ v: CGFloat) -> NSDirectionalEdgeInsets { insets(v, v, v, v) }
