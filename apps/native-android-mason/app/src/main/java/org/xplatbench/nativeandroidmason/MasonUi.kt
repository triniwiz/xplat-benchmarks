package org.xplatbench.nativeandroidmason

import android.content.Context
import org.nativescript.fontmanager.FontWeight
import org.nativescript.mason.masonkit.Dimension
import org.nativescript.mason.masonkit.LengthPercentage
import org.nativescript.mason.masonkit.LengthPercentageAuto
import org.nativescript.mason.masonkit.Mason
import org.nativescript.mason.masonkit.Point
import org.nativescript.mason.masonkit.Rect
import org.nativescript.mason.masonkit.Size
import org.nativescript.mason.masonkit.Style
import org.nativescript.mason.masonkit.TextView
import org.nativescript.mason.masonkit.View
import org.nativescript.mason.masonkit.enums.BorderStyle
import org.nativescript.mason.masonkit.enums.Display
import org.nativescript.mason.masonkit.enums.FlexDirection

/**
 * Builders for Mason elements with the values of apps/ns-core-mason-perf/app/app.css. Lengths are
 * CSS px (= dp); the typed Style API takes device px, so every length goes through px(). Each
 * element's styles are written in one Style.configure batch, as a CSS class match would be.
 */
class MasonUi(val ctx: Context) {
    val mason: Mason = Mason.shared
    private val density = ctx.resources.displayMetrics.density

    fun px(v: Float): Float = v * density

    fun lp(v: Float): LengthPercentage = LengthPercentage.Points(px(v))
    fun lpa(v: Float): LengthPercentageAuto = LengthPercentageAuto.Points(px(v))
    fun dim(v: Float): Dimension = Dimension.Points(px(v))

    fun Style.pad(top: Float, right: Float, bottom: Float, left: Float) {
        padding = Rect(top = lp(top), right = lp(right), bottom = lp(bottom), left = lp(left))
    }

    fun Style.pad(all: Float) = pad(all, all, all, all)

    fun Style.margins(top: Float, right: Float, bottom: Float, left: Float) {
        margin = Rect(top = lpa(top), right = lpa(right), bottom = lpa(bottom), left = lpa(left))
    }

    fun Style.margins(all: Float) = margins(all, all, all, all)

    /** border-style: solid; border-width: t r b l; border-color: color. */
    fun Style.borders(top: Float, right: Float, bottom: Float, left: Float, color: Int) {
        borderWidth = Rect(top = lp(top), right = lp(right), bottom = lp(bottom), left = lp(left))
        setBorderStyle(BorderStyle.Solid)
        setBorderColor(color)
    }

    fun Style.radius(tl: Float, tr: Float = tl, br: Float = tl, bl: Float = tl) {
        borderTopLeftRadius = Point(lp(tl), lp(tl))
        borderTopRightRadius = Point(lp(tr), lp(tr))
        borderBottomRightRadius = Point(lp(br), lp(br))
        borderBottomLeftRadius = Point(lp(bl), lp(bl))
    }

    /** flex: 1 1 0 */
    fun Style.flex1() {
        flexGrow = 1f
        flexShrink = 1f
        flexBasis = Dimension.Points(0f)
    }

    fun Style.height(v: Float) = setSizeHeight(dim(v))
    fun Style.width(v: Float) = setSizeWidth(dim(v))

    fun Style.font(size: Int, color: Int, bold: Boolean = false) {
        fontSize = size
        this.color = color
        if (bold) fontWeight = FontWeight.Bold
    }

    /** line-height: Npx (absolute). Mason takes an absolute line height in dip, not device px. */
    fun Style.lineHeightPx(v: Int) = setLineHeight(v.toFloat(), false)

    /** A Mason View with the stylesheet's `View { display: flex; flex-direction: column; min-width: 0 }`. */
    fun box(styles: Style.() -> Unit = {}): View {
        val v = mason.createView(ctx)
        v.style.configure {
            it.display = Display.Flex
            it.flexDirection = FlexDirection.Column
            it.minWidth = Dimension.Points(0f)
            it.styles()
        }
        return v
    }

    fun box(children: List<android.view.View>, styles: Style.() -> Unit = {}): View {
        val v = box(styles)
        for (c in children) v.addView(c)
        return v
    }

    fun text(value: String, styles: Style.() -> Unit): TextView {
        val t = mason.createTextView(ctx)
        t.style.configure { it.styles() }
        t.textContent = value
        return t
    }
}
