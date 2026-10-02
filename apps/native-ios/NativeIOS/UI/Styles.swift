import UIKit

// UIKit counterparts of the token values used by apps/react-native/src/styles.ts (dp == pt).
extension UIColor {
    convenience init(hex: String) {
        var v: UInt64 = 0
        Scanner(string: String(hex.dropFirst())).scanHexInt64(&v)
        self.init(red: CGFloat((v >> 16) & 0xff) / 255, green: CGFloat((v >> 8) & 0xff) / 255,
                  blue: CGFloat(v & 0xff) / 255, alpha: 1)
    }
}

enum C {
    static let bg = UIColor(hex: Tokens.bg)
    static let surface = UIColor(hex: Tokens.surface)
    static let border = UIColor(hex: Tokens.border)
    static let text = UIColor(hex: Tokens.text)
    static let muted = UIColor(hex: Tokens.muted)
    static let accent = UIColor(hex: Tokens.accent)
    static let positive = UIColor(hex: Tokens.positive)
    static let negative = UIColor(hex: Tokens.negative)
    static let white = UIColor.white
    static let palette = Tokens.palette.map { UIColor(hex: $0) }
    static let paletteLight = Tokens.paletteLight.map { UIColor(hex: $0) }
    static let paletteCG = palette.map { $0.cgColor }
    static let paletteLightCG = paletteLight.map { $0.cgColor }
}

enum F {
    static func regular(_ size: CGFloat) -> UIFont { .systemFont(ofSize: size) }
    static func bold(_ size: CGFloat) -> UIFont { .boldSystemFont(ofSize: size) }
}

/// Absolute line height from the spec: round(fontSize * 1.4).
func lineHeight(_ size: CGFloat) -> CGFloat { (size * 1.4).rounded() }

/// Attributed text with an absolute line height, laid out the way React Native does it on iOS
/// (min = max line height, baseline shifted to centre the glyphs in the line).
func lineHeightText(_ text: String, font: UIFont, color: UIColor, lineHeight lh: CGFloat,
                    kern: CGFloat = 0, truncate: Bool = false) -> NSAttributedString {
    let p = NSMutableParagraphStyle()
    p.minimumLineHeight = lh
    p.maximumLineHeight = lh
    p.lineBreakMode = truncate ? .byTruncatingTail : .byWordWrapping
    var attrs: [NSAttributedString.Key: Any] = [.font: font, .foregroundColor: color, .paragraphStyle: p]
    if lh >= font.lineHeight { attrs[.baselineOffset] = (lh - font.lineHeight) / 2 }
    if kern != 0 { attrs[.kern] = kern }
    return NSAttributedString(string: text, attributes: attrs)
}
