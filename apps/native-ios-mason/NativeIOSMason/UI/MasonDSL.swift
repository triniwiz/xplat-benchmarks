import Mason
import UIKit

// Thin helpers over Mason's typed Swift style API. Values are CSS px (= pt on iOS). Mason's
// typed layout lengths and letter-spacing are device pixels, so they go through `px`; font-size
// and absolute line-height are stored as dip (pt) and are passed as is. Strings ("12px", colours,
// gradients, shadows, grid templates) are parsed by Mason itself and take CSS px directly.

let mason = NSCMason.shared

/// CSS px to Mason device pixels.
@inline(__always) func px(_ v: Float) -> Float { v * NSCMason.scale }

func lp(_ v: Float) -> MasonLengthPercentage { .Points(px(v)) }
func lpa(_ v: Float) -> MasonLengthPercentageAuto { .Points(px(v)) }
func dim(_ v: Float) -> MasonDimension { .Points(px(v)) }

/// Token colours as Mason's packed colour values (what MasonStyle.color / backgroundColor take).
enum MC {
    static let bg = C.bg.toUInt32()
    static let surface = C.surface.toUInt32()
    static let text = C.text.toUInt32()
    static let muted = C.muted.toUInt32()
    static let accent = C.accent.toUInt32()
    static let positive = C.positive.toUInt32()
    static let negative = C.negative.toUInt32()
    static let white = UIColor.white.toUInt32()
    static let palette = C.palette.map { $0.toUInt32() }
    static let paletteLight = C.paletteLight.map { $0.toUInt32() }
}

extension MasonStyle {
    /// CSS `padding: t r b l`.
    func pad(_ t: Float, _ r: Float, _ b: Float, _ l: Float) { padding = MasonRect(lp(t), lp(r), lp(b), lp(l)) }
    func pad(_ v: Float) { padding = MasonRect(uniform: lp(v)) }

    /// CSS `margin: t r b l`.
    func mar(_ t: Float, _ r: Float, _ b: Float, _ l: Float) { margin = MasonRect(lpa(t), lpa(r), lpa(b), lpa(l)) }
    func mar(_ v: Float) { margin = MasonRect(uniform: lpa(v)) }

    /// CSS `flex: 1 1 0`.
    func flex1() {
        flexGrow = 1
        flexShrink = 1
        flexBasis = .Points(0)
    }

    /// `border-style: solid; border-width: t r b l; border-color: <color>` (one colour, or four
    /// space-separated). The shorthand string gives every side the solid style; the typed widths
    /// then set the real per-side widths and commit them to layout.
    func solidBorder(_ t: Float, _ r: Float, _ b: Float, _ l: Float, _ color: String) {
        border = "1px solid #000000"
        borderWidth = MasonRect(lp(t), lp(r), lp(b), lp(l))
        setBorderColor(color)
    }

    /// font-size (dip, as Mason stores it) + optional bold + colour.
    func font(_ size: Int32, bold: Bool = false, color: UInt32) {
        fontSize = size
        if bold { fontWeight = "bold" }
        self.color = color
    }

    /// Absolute line-height in CSS px. Stored as dip (pt on iOS), like font-size, not device px.
    func lineHeightPx(_ v: Float) { setLineHeight(v, false) }
}

/// A `View` as the NativeScript + Mason app's stylesheet makes it:
/// `View { display: flex; flex-direction: column; min-width: 0 }`, plus `build` in the same batch.
func div(_ children: [UIView] = [], _ build: (MasonStyle) -> Void = { _ in }) -> MasonUIView {
    let v = mason.createView()
    v.configure { s in
        s.display = .Flex
        s.flexDirection = .Column
        s.minWidth = .Points(0)
        build(s)
    }
    for c in children { v.addView(c) }
    return v
}

/// A Mason `Text` (MasonText, no element type) with its style applied before its text.
func txt(_ value: String, _ build: (MasonStyle) -> Void) -> MasonText {
    let t = MasonText(mason: mason)
    t.configure(build)
    t.textContent = value
    return t
}
