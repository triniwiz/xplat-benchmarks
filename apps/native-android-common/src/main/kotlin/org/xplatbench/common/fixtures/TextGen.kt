package org.xplatbench.common.fixtures

// Port of scenarios/src/text.ts.
private val WORDS = listOf(
    "layout", "native", "render", "frame", "measure", "flex", "grid", "view",
    "style", "border", "shadow", "radius", "gradient", "column", "row", "wrap",
    "align", "justify", "content", "baseline", "stretch", "center", "padding",
    "margin", "inset", "track", "span", "area", "template", "auto", "fill",
    "basis", "grow", "shrink", "order", "gap", "overflow", "clip", "scroll",
    "opacity", "transform", "rotate", "scale", "translate", "font", "weight",
    "line", "height", "letter", "spacing", "ellipsis", "text", "image", "cover",
    "contain", "aspect", "ratio", "minimum", "maximum", "percent", "pixel",
    "device", "density", "thread",
)

object TextGen {
    fun words(rng: Rng, count: Int): String {
        val out = ArrayList<String>(maxOf(0, count))
        for (i in 0 until count) out.add(rng.pick(WORDS))
        return out.joinToString(" ")
    }

    fun title(rng: Rng, min: Int = 2, max: Int = 4): String {
        val w = words(rng, rng.int(min, max))
        if (w.isEmpty()) return w
        return w.substring(0, 1).uppercase() + w.substring(1)
    }

    fun sentence(rng: Rng, min: Int, max: Int): String = title(rng, min, max) + "."

    fun paragraph(rng: Rng, minWords: Int, maxWords: Int): String {
        val target = rng.int(minWords, maxWords)
        val parts = ArrayList<String>()
        var count = 0
        while (count < target) {
            val n = minOf(rng.int(4, 12), target - count)
            parts.add(sentence(rng, n, n))
            count += n
        }
        return parts.joinToString(" ")
    }
}
