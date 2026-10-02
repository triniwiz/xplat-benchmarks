package org.xplatbench.nativeandroid

import android.content.Context
import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.Drawable
import android.graphics.drawable.GradientDrawable
import android.text.Layout
import android.text.TextUtils
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.widget.TextViewCompat
import org.xplatbench.common.fixtures.Tokens

/** dp helpers and view factories for the values in apps/react-native/src/styles.ts (dp == RN units). */
class Ui(val ctx: Context) {
    val density = ctx.resources.displayMetrics.density

    fun px(dp: Float): Int = if (dp == 0f) 0 else maxOf(1, (dp * density + 0.5f).toInt())
    fun px(dp: Int): Int = px(dp.toFloat())
    fun pxf(dp: Float): Float = dp * density

    fun column(): LinearLayout = LinearLayout(ctx).apply { orientation = LinearLayout.VERTICAL }
    fun row(): LinearLayout = LinearLayout(ctx).apply { orientation = LinearLayout.HORIZONTAL }

    /** Text as RN draws it on Android: dp sizes, no font padding, simple (greedy) line breaking. */
    fun text(
        value: CharSequence?,
        size: Int,
        color: Int = Tokens.text,
        bold: Boolean = false,
        lineHeight: Int = 0,
    ): TextView = TextView(ctx).apply {
        includeFontPadding = false
        setTextSize(TypedValue.COMPLEX_UNIT_DIP, size.toFloat())
        setTextColor(color)
        if (bold) typeface = Typeface.DEFAULT_BOLD
        if (lineHeight > 0) TextViewCompat.setLineHeight(this, px(lineHeight))
        breakStrategy = Layout.BREAK_STRATEGY_SIMPLE
        hyphenationFrequency = Layout.HYPHENATION_FREQUENCY_NONE
        text = value
    }

    fun clamp(tv: TextView, lines: Int) {
        tv.maxLines = lines
        tv.ellipsize = TextUtils.TruncateAt.END
    }

    fun rounded(fill: Int, radiusDp: Float = 0f, strokeDp: Float = 0f, stroke: Int = 0): GradientDrawable =
        GradientDrawable().apply {
            setColor(fill)
            if (radiusDp > 0f) cornerRadius = pxf(radiusDp)
            if (strokeDp > 0f) setStroke(px(strokeDp), stroke)
        }

    fun block(color: Int, radiusDp: Float = 0f): View = View(ctx).apply {
        if (radiusDp > 0f) background = rounded(color, radiusDp) else setBackgroundColor(color)
    }

    fun pad(v: View, top: Float, right: Float, bottom: Float, left: Float) = v.setPadding(px(left), px(top), px(right), px(bottom))
    fun pad(v: View, all: Float) = px(all).let { v.setPadding(it, it, it, it) }

    fun lp(w: Int, h: Int, weight: Float = 0f): LinearLayout.LayoutParams = LinearLayout.LayoutParams(w, h, weight)

    fun LinearLayout.LayoutParams.margins(top: Float, right: Float, bottom: Float, left: Float) = apply {
        setMargins(px(left), px(top), px(right), px(bottom))
    }

    companion object {
        const val MATCH = ViewGroup.LayoutParams.MATCH_PARENT
        const val WRAP = ViewGroup.LayoutParams.WRAP_CONTENT
        const val CENTER_V = Gravity.CENTER_VERTICAL
    }
}

/** Fill plus per-side borders (Android has no one-sided border drawable). Widths in px. */
class EdgeDrawable(
    private val fill: Int,
    val top: Int = 0, private val topColor: Int = 0,
    val right: Int = 0, private val rightColor: Int = 0,
    val bottom: Int = 0, private val bottomColor: Int = 0,
    val left: Int = 0, private val leftColor: Int = 0,
) : Drawable() {
    private val paint = Paint()

    override fun draw(canvas: Canvas) {
        val b = bounds
        paint.color = fill
        canvas.drawRect(b, paint)
        val l = b.left.toFloat()
        val t = b.top.toFloat()
        val r = b.right.toFloat()
        val bt = b.bottom.toFloat()
        if (top > 0) { paint.color = topColor; canvas.drawRect(l, t, r, t + top, paint) }
        if (bottom > 0) { paint.color = bottomColor; canvas.drawRect(l, bt - bottom, r, bt, paint) }
        if (left > 0) { paint.color = leftColor; canvas.drawRect(l, t + top, l + left, bt - bottom, paint) }
        if (right > 0) { paint.color = rightColor; canvas.drawRect(r - right, t + top, r, bt - bottom, paint) }
    }

    override fun setAlpha(alpha: Int) {
        paint.alpha = alpha
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
        paint.colorFilter = colorFilter
    }

    @Deprecated("Deprecated in Java")
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
}
