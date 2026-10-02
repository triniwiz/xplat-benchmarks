package org.xplatbench.common.fixtures

// Port of scenarios/src/tokens.ts. Colors are ARGB ints (Android color ints).
object Tokens {
    const val bg = 0xFFF5F6FA.toInt()
    const val surface = 0xFFFFFFFF.toInt()
    const val border = 0xFFD0D4E0.toInt()
    const val text = 0xFF1F2330.toInt()
    const val muted = 0xFF6B7185.toInt()
    const val accent = 0xFF3B5BDB.toInt()
    const val positive = 0xFF2F9E44.toInt()
    const val negative = 0xFFE03131.toInt()
    const val white = 0xFFFFFFFF.toInt()

    val paletteHex = listOf(
        "#E03131", "#F08C00", "#2F9E44", "#1098AD",
        "#1C7ED6", "#7048E8", "#C2255C", "#5C940D",
    )
    val paletteLightHex = listOf(
        "#FFE3E3", "#FFF3BF", "#D3F9D8", "#C5F6FA",
        "#D0EBFF", "#E5DBFF", "#FFDEEB", "#E9FAC8",
    )
    val palette: IntArray = paletteHex.map(::hexColor).toIntArray()
    val paletteLight: IntArray = paletteLightHex.map(::hexColor).toIntArray()

    val fontSizes = intArrayOf(12, 14, 16, 20)

    /** Absolute line height from the spec: round(fontSize * 1.4). */
    fun lineHeight(size: Int): Int = Math.round(size * 1.4).toInt()

    fun hexColor(hex: String): Int = (0xFF000000L or hex.removePrefix("#").toLong(16)).toInt()
}
