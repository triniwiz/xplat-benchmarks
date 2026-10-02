package org.xplatbench.nativeandroidmason

import org.nativescript.mason.masonkit.Dimension
import org.nativescript.mason.masonkit.Point
import org.nativescript.mason.masonkit.Rect
import org.nativescript.mason.masonkit.Size
import org.nativescript.mason.masonkit.View
import org.nativescript.mason.masonkit.enums.AlignItems
import org.nativescript.mason.masonkit.enums.Display
import org.nativescript.mason.masonkit.enums.FlexDirection
import org.nativescript.mason.masonkit.enums.FlexWrap
import org.nativescript.mason.masonkit.enums.Overflow
import org.xplatbench.common.android.Mounted
import org.xplatbench.common.fixtures.Card
import org.xplatbench.common.fixtures.CardsData
import org.xplatbench.common.fixtures.ChainData
import org.xplatbench.common.fixtures.DashboardData
import org.xplatbench.common.fixtures.TextFlowData
import org.xplatbench.common.fixtures.Tile
import org.xplatbench.common.fixtures.TilesData
import org.xplatbench.common.fixtures.Tokens
import org.xplatbench.common.fixtures.TreeData
import org.xplatbench.common.fixtures.TreeNode

// Mason versions of the scenarios: element for element the trees of apps/ns-core-mason-perf/app/
// scenarios.ts, with the declarations of its app.css applied through the typed Style API.

private fun MasonUi.sentinel(): View = box { height(1f); backgroundColor = Tokens.bg }

/** `.host` (width: 100%) holding the content and, last, the sentinel. */
private fun MasonUi.wrap(content: android.view.View): Mounted {
    val s = sentinel()
    val root = box(listOf(content, s)) { size = Size(Dimension.Percent(1f), Dimension.Auto) }
    return Mounted(root, s)
}

// nested-chain

fun chain(ui: MasonUi, d: ChainData): Mounted = with(ui) {
    var inner: android.view.View = text(d.label) { font(12, Tokens.text); pad(4f) }
    for (level in d.depth - 1 downTo 0) {
        val c = level % Tokens.palette.size
        inner = box(listOf(inner)) {
            pad(1f, 0f, 1f, 1f)
            borders(0f, 0f, 0f, 1f, Tokens.palette[c])
            backgroundColor = Tokens.paletteLight[c]
        }
    }
    wrap(inner)
}

// tree-fanout, relayout-resize, relayout-style

fun tree(ui: MasonUi, d: TreeData): Mounted = with(ui) {
    val inner = ArrayList<Pair<View, Int>>()

    fun node(n: TreeNode, parentDir: String?): View {
        val inRow = parentDir == "row"
        if (n.children.isEmpty()) {
            return box {
                height(12f)
                backgroundColor = Tokens.palette[n.color]
                if (inRow) flex1()
            }
        }
        val children = n.children.map { node(it, n.dir) }
        val v = box(children) {
            pad(1f)
            borders(1f, 1f, 1f, 1f, Tokens.palette[n.color])
            backgroundColor = Tokens.paletteLight[n.color]
            flexDirection = if (n.dir == "row") FlexDirection.Row else FlexDirection.Column
            if (inRow) flex1()
        }
        inner.add(v to Tokens.palette[n.color])
        return v
    }

    val s = sentinel()
    val frame = box(listOf(node(d.root, null), s)) { size = Size(Dimension.Percent(1f), Dimension.Auto) }
    val root = box(listOf(frame)) { size = Size(Dimension.Percent(1f), Dimension.Auto) }

    // `.restyled .tn { padding: 3px; border-color: accent }`, applied to every inner node.
    fun restyle(on: Boolean) {
        for ((v, color) in inner) {
            v.style.configure {
                it.pad(if (on) 3f else 1f)
                it.setBorderColor(if (on) Tokens.accent else color)
            }
        }
    }

    Mounted(root, s) { name ->
        when (name) {
            "shrink" -> frame.style.configure { it.setSizeWidth(Dimension.Percent(0.8f)) }
            "grow" -> frame.style.configure { it.setSizeWidth(Dimension.Percent(1f)) }
            "restyle" -> restyle(true)
            "restore" -> restyle(false)
        }
    }
}

// flex-wrap-tiles, insert-remove

private fun MasonUi.tile(t: Tile): View = box(
    listOf(
        text(t.title) { font(14, Tokens.text, bold = true) },
        text(t.subtitle) { font(12, Tokens.muted) },
    ),
) {
    width(88f)
    margins(4f)
    pad(8f)
    radius(8f)
    backgroundColor = Tokens.paletteLight[t.color]
}

fun tiles(ui: MasonUi, d: TilesData): Mounted = with(ui) {
    val container = box(d.tiles.map { tile(it) }) {
        flexDirection = FlexDirection.Row
        flexWrap = FlexWrap.Wrap
        pad(4f)
    }
    val m = wrap(container)
    var inserted: List<View> = emptyList()
    Mounted(m.root, m.sentinel) { name ->
        if (name == "insert" && inserted.isEmpty()) {
            inserted = d.insert.map { tile(it) }
            inserted.forEachIndexed { i, v -> container.addView(v, i) }
        } else if (name == "remove") {
            for (v in inserted) container.removeView(v)
            inserted = emptyList()
        }
    }
}

// grid-dashboard: real CSS grid (grid-template-areas), as the Mason stylesheet does

fun dashboard(ui: MasonUi, d: DashboardData): Mounted = with(ui) {
    val header = box(
        listOf(text(d.title) { flex1(); font(16, Tokens.text, bold = true) }) +
            d.pills.map { p ->
                text(p) {
                    margins(0f, 0f, 0f, 4f)
                    pad(4f, 8f, 4f, 8f)
                    radius(999f)
                    backgroundColor = Tokens.bg
                    font(12, Tokens.text)
                }
            },
    ) {
        gridArea = "header"
        flexDirection = FlexDirection.Row
        alignItems = AlignItems.Center
        pad(0f, 12f, 0f, 12f)
        backgroundColor = Tokens.surface
        borders(0f, 0f, 1f, 0f, Tokens.border)
    }

    val nav = box(
        d.nav.map { n ->
            text(n.label) {
                pad(8f, 12f, 8f, 12f)
                font(12, if (n.active) Tokens.accent else Tokens.muted, bold = n.active)
                if (n.active) backgroundColor = Tokens.paletteLight[4]
            }
        },
    ) {
        gridArea = "nav"
        pad(8f, 0f, 8f, 0f)
        backgroundColor = Tokens.surface
        borders(0f, 1f, 0f, 0f, Tokens.border)
    }

    val stats = box(
        d.stats.map { st ->
            val bars = box(st.bars.map { h -> box { flex1(); margins(0f, 1f, 0f, 1f); radius(2f); backgroundColor = Tokens.accent; height(h.toFloat()) } }) {
                flexDirection = FlexDirection.Row
                alignItems = AlignItems.FlexEnd
                height(40f)
                margins(4f, 0f, 0f, 0f)
            }
            box(
                listOf(
                    text(st.label) { font(12, Tokens.muted) },
                    text(st.value) { font(20, Tokens.text, bold = true) },
                    text(st.delta) { font(12, if (st.up) Tokens.positive else Tokens.negative) },
                    bars,
                ),
            ) {
                margins(4f)
                pad(8f)
                radius(8f)
                backgroundColor = Tokens.surface
                borders(1f, 1f, 1f, 1f, Tokens.border)
            }
        },
    ) {
        gridArea = "stats"
        display = Display.Grid
        gridTemplateColumns = "1fr 1fr"
        pad(4f)
    }

    fun cell(value: String, bold: Boolean = false) = text(value) { font(12, Tokens.text, bold) }
    fun trow(cells: List<android.view.View>) = box(cells) {
        display = Display.Grid
        gridTemplateColumns = "2fr 1fr 1fr 1fr"
        alignItems = AlignItems.Center
        pad(6f, 0f, 6f, 0f)
        borders(0f, 0f, 1f, 0f, Tokens.border)
    }

    val table = box(
        listOf(trow(d.columns.map { cell(it, bold = true) })) +
            d.rows.map { r ->
                val name = box(
                    listOf(
                        box { width(8f); height(8f); radius(4f); margins(0f, 6f, 0f, 0f); backgroundColor = Tokens.palette[r.color] },
                        cell(r.name),
                    ),
                ) {
                    flexDirection = FlexDirection.Row
                    alignItems = AlignItems.Center
                }
                trow(listOf(name) + r.cells.map { cell(it) })
            },
    ) {
        gridArea = "table"
        pad(4f, 8f, 4f, 8f)
    }

    val dash = box(listOf(header, nav, stats, table)) {
        display = Display.Grid
        gridTemplateColumns = "96px 1fr 1fr"
        gridTemplateRows = "56px auto auto"
        gridTemplateAreas = "\"header header header\" \"nav stats stats\" \"nav table table\""
    }
    wrap(dash)
}

// text-flow

fun textFlow(ui: MasonUi, d: TextFlowData): Mounted = with(ui) {
    val spacing = px(0.5f)
    val paras = d.paragraphs.map { p ->
        val size = Tokens.fontSizes[p.size]
        text(p.text) {
            margins(0f, 0f, 8f, 0f)
            font(size, Tokens.text, p.bold)
            lineHeightPx(Tokens.lineHeight(size))
            if (p.spacing) letterSpacing = spacing
        }
    }
    wrap(box(paras) { pad(12f) })
}

// styled-cards, scroll-plain

private fun MasonUi.card(c: Card): View {
    val white = c.variant == 2
    val inner = box(
        listOf(
            text(c.title) { font(16, if (white) Tokens.white else Tokens.text, bold = true) },
            text(c.body) { font(14, if (white) Tokens.white else Tokens.muted); lineHeightPx(20); margins(4f, 0f, 0f, 0f) },
            box(
                c.chips.map { x ->
                    text(x) {
                        pad(2f, 8f, 2f, 8f)
                        margins(0f, 4f, 0f, 0f)
                        radius(999f)
                        font(12, Tokens.text)
                        backgroundColor = Tokens.paletteLight[c.color]
                    }
                },
            ) { flexDirection = FlexDirection.Row; margins(8f, 0f, 0f, 0f) },
        ),
    ) { pad(12f) }

    val children = if (c.variant == 5) listOf(box { height(24f); backgroundColor = Tokens.palette[c.color] }, inner) else listOf(inner)
    val outer = box(children) {
        margins(8f)
        backgroundColor = Tokens.surface
        when (c.variant) {
            0 -> {
                radius(12f)
                boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)"
            }
            1 -> {
                radius(16f, 0f, 16f, 0f)
                borders(2f, 2f, 2f, 2f, Tokens.palette[c.color])
            }
            2 -> {
                radius(8f)
                backgroundImage = "linear-gradient(135deg, ${Tokens.paletteHex[c.color]}, ${Tokens.paletteHex[c.color2]})"
            }
            3 -> {
                borders(4f, 1f, 1f, 1f, Tokens.border)
                borderColor = Rect(top = Tokens.palette[c.color], right = Tokens.border, bottom = Tokens.border, left = Tokens.border)
            }
            4 -> {
                transform = "rotate(-1deg) scale(0.98)"
                radius(8f)
                borders(1f, 1f, 1f, 1f, Tokens.border)
            }
            else -> {
                radius(12f)
                overflow = Point(Overflow.Hidden, Overflow.Hidden)
            }
        }
    }
    if (c.variant == 4) outer.alpha = 0.85f
    return outer
}

fun cards(ui: MasonUi, d: CardsData): Mounted = with(ui) {
    wrap(box(d.cards.map { card(it) }) { pad(4f) })
}
