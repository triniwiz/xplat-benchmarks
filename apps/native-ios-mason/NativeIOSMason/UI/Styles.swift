import UIKit

// Token colours as UIColor (from native-ios); MasonDSL.swift packs them for MasonStyle.
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
