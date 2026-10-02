import SwiftUI
#if canImport(UIKit)
import UIKit
typealias PlatformFont = UIFont
#else
import AppKit
typealias PlatformFont = NSFont
#endif

// SwiftUI counterparts of the token values used by native-ios (UI/Styles.swift there); pt == dp.
extension Color {
    init(hex: String) {
        var v: UInt64 = 0
        Scanner(string: String(hex.dropFirst())).scanHexInt64(&v)
        self.init(.sRGB, red: Double((v >> 16) & 0xff) / 255, green: Double((v >> 8) & 0xff) / 255,
                  blue: Double(v & 0xff) / 255, opacity: 1)
    }
}

enum C {
    static let bg = Color(hex: Tokens.bg)
    static let surface = Color(hex: Tokens.surface)
    static let border = Color(hex: Tokens.border)
    static let text = Color(hex: Tokens.text)
    static let muted = Color(hex: Tokens.muted)
    static let accent = Color(hex: Tokens.accent)
    static let positive = Color(hex: Tokens.positive)
    static let negative = Color(hex: Tokens.negative)
    static let white = Color.white
    static let palette = Tokens.palette.map { Color(hex: $0) }
    static let paletteLight = Tokens.paletteLight.map { Color(hex: $0) }
}

/// The same system fonts native-ios uses (systemFont / boldSystemFont), so metrics match exactly.
enum F {
    static func regular(_ size: CGFloat) -> Font { Font(PlatformFont.systemFont(ofSize: size) as CTFont) }
    static func bold(_ size: CGFloat) -> Font { Font(PlatformFont.boldSystemFont(ofSize: size) as CTFont) }

    /// UIFont.lineHeight (ascender + descender + leading), the default line box of a Text line.
    static func lineHeight(_ size: CGFloat, bold: Bool = false) -> CGFloat {
        let f = (bold ? PlatformFont.boldSystemFont(ofSize: size) : PlatformFont.systemFont(ofSize: size)) as CTFont
        return CTFontGetAscent(f) + CTFontGetDescent(f) + CTFontGetLeading(f)
    }
}

/// Absolute line height from the spec: round(fontSize * 1.4).
func specLineHeight(_ size: CGFloat) -> CGFloat { (size * 1.4).rounded() }

extension View {
    /// An absolute line height as native-ios sets it (min = max line height, glyphs centred in the line):
    /// the extra space goes between lines as lineSpacing and half of it above the first and below the last.
    func fixedLineHeight(_ lh: CGFloat, size: CGFloat, bold: Bool = false) -> some View {
        let extra = max(0, lh - F.lineHeight(size, bold: bold))
        return lineSpacing(extra).padding(.vertical, extra / 2)
    }
}
