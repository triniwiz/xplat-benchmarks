package org.xplatbench.nativeandroidcompose

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.Hyphens
import androidx.compose.ui.text.style.LineBreak
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import org.xplatbench.common.fixtures.Tokens

/** Tokens as Compose colours. */
object C {
    val bg = Color(Tokens.bg)
    val surface = Color(Tokens.surface)
    val border = Color(Tokens.border)
    val text = Color(Tokens.text)
    val muted = Color(Tokens.muted)
    val accent = Color(Tokens.accent)
    val positive = Color(Tokens.positive)
    val negative = Color(Tokens.negative)
    val white = Color(Tokens.white)
    val palette = Tokens.palette.map { Color(it) }
    val paletteLight = Tokens.paletteLight.map { Color(it) }
}

val Pill = RoundedCornerShape(50)
private val shapes = HashMap<Int, RoundedCornerShape>()
fun rounded(dp: Int): RoundedCornerShape = shapes.getOrPut(dp) { RoundedCornerShape(dp.dp) }

/** native-android's Ui.px(): dp to whole px, at least 1 for a non-zero width. */
fun Density.px(dp: Float): Float = if (dp == 0f) 0f else maxOf(1, (dp * density + 0.5f).toInt()).toFloat()

/** Fill plus per-side borders (native-android's EdgeDrawable). Widths in dp. */
fun Modifier.edges(
    fill: Color,
    top: Float = 0f, topColor: Color = Color.Transparent,
    right: Float = 0f, rightColor: Color = Color.Transparent,
    bottom: Float = 0f, bottomColor: Color = Color.Transparent,
    left: Float = 0f, leftColor: Color = Color.Transparent,
): Modifier = drawBehind {
    val w = size.width
    val h = size.height
    if (fill.alpha > 0f) drawRect(fill)
    val t = px(top)
    val r = px(right)
    val b = px(bottom)
    val l = px(left)
    if (t > 0f) drawRect(topColor, Offset.Zero, Size(w, t))
    if (b > 0f) drawRect(bottomColor, Offset(0f, h - b), Size(w, b))
    if (l > 0f) drawRect(leftColor, Offset(0f, t), Size(l, h - t - b))
    if (r > 0f) drawRect(rightColor, Offset(w - r, t), Size(r, h - t - b))
}

/**
 * Text styles as native-android's TextView setup: dp sizes (independent of font scale), greedy line
 * breaking, no hyphenation. includeFontPadding is already false by default in Compose.
 */
class TextStyles(private val density: Density) {
    private val cache = HashMap<Long, TextStyle>()

    fun get(size: Int, color: Color, bold: Boolean, lineHeight: Int, spacing: Boolean): TextStyle {
        val key = (color.toArgb().toLong() and 0xFFFFFFFFL) or (size.toLong() shl 32) or (lineHeight.toLong() shl 40) or
            (if (bold) 1L shl 48 else 0L) or (if (spacing) 1L shl 49 else 0L)
        return cache.getOrPut(key) {
            with(density) {
                TextStyle(
                    color = color,
                    fontSize = size.dp.toSp(),
                    fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal,
                    letterSpacing = if (spacing) (0.5f / size).em else TextUnit.Unspecified,
                    lineHeight = if (lineHeight > 0) lineHeight.dp.toSp() else TextUnit.Unspecified,
                    // TextView's line spacing extra goes below each line except the last.
                    lineHeightStyle = if (lineHeight > 0) LineHeightStyle(LineHeightStyle.Alignment.Top, LineHeightStyle.Trim.Both) else null,
                    lineBreak = LineBreak.Simple,
                    hyphens = Hyphens.None,
                )
            }
        }
    }
}

val LocalTextStyles = staticCompositionLocalOf<TextStyles> { error("TextStyles not provided") }

@Composable
fun Txt(
    value: String,
    size: Int,
    modifier: Modifier = Modifier,
    color: Color = C.text,
    bold: Boolean = false,
    lineHeight: Int = 0,
    spacing: Boolean = false,
    maxLines: Int = Int.MAX_VALUE,
) {
    BasicText(
        value,
        modifier,
        style = LocalTextStyles.current.get(size, color, bold, lineHeight, spacing),
        overflow = if (maxLines == Int.MAX_VALUE) TextOverflow.Clip else TextOverflow.Ellipsis,
        maxLines = maxLines,
    )
}

/** The 1 dp sentinel that ends every scenario; `s` carries the layout callback. */
@Composable
fun Sentinel(s: Modifier) {
    Box(s.fillMaxWidth().height(1.dp).background(C.bg))
}
