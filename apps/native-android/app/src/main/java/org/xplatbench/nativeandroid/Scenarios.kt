package org.xplatbench.nativeandroid

import android.graphics.drawable.GradientDrawable
import android.view.View
import android.widget.LinearLayout
import com.google.android.flexbox.AlignContent
import com.google.android.flexbox.AlignItems
import com.google.android.flexbox.FlexDirection
import com.google.android.flexbox.FlexWrap
import com.google.android.flexbox.FlexboxLayout
import org.xplatbench.common.android.Mounted
import org.xplatbench.common.fixtures.Card
import org.xplatbench.common.fixtures.CardsData
import org.xplatbench.common.fixtures.ChainData
import org.xplatbench.common.fixtures.DashboardData
import org.xplatbench.common.fixtures.StatCard
import org.xplatbench.common.fixtures.TableRow
import org.xplatbench.common.fixtures.TextFlowData
import org.xplatbench.common.fixtures.Tile
import org.xplatbench.common.fixtures.TilesData
import org.xplatbench.common.fixtures.Tokens
import org.xplatbench.common.fixtures.TreeData
import org.xplatbench.common.fixtures.TreeNode
import org.xplatbench.nativeandroid.Ui.Companion.CENTER_V
import org.xplatbench.nativeandroid.Ui.Companion.MATCH
import org.xplatbench.nativeandroid.Ui.Companion.WRAP

// Android Views versions of the scenarios. Structure and dp values follow
// apps/react-native/src/{scenarios.tsx,styles.ts}; borders are drawn by the background drawable and
// added to the padding (RN/CSS border-box), flex: 1 is a LinearLayout weight, and cross-axis stretch
// is MATCH_PARENT in a WRAP_CONTENT LinearLayout (forceUniformHeight).

private fun Ui.sentinel(): View = View(ctx).apply { setBackgroundColor(Tokens.bg) }

/** Scenario root: a column holding the content and, last, the 1 dp sentinel. */
private fun Ui.wrap(vararg content: View): Mounted {
    val root = column()
    for (c in content) root.addView(c, lp(MATCH, WRAP))
    val s = sentinel()
    root.addView(s, lp(MATCH, px(1)))
    return Mounted(root, s)
}

// nested-chain

fun chain(ui: Ui, d: ChainData): Mounted = with(ui) {
    var inner: View = text(d.label, 12).also { pad(it, 4f) }
    val border = px(1)
    for (level in d.depth - 1 downTo 0) {
        val c = level % Tokens.palette.size
        val box = column()
        box.background = EdgeDrawable(Tokens.paletteLight[c], left = border, leftColor = Tokens.palette[c])
        box.setPadding(px(1) + border, px(1), 0, px(1))
        box.addView(inner, lp(MATCH, WRAP))
        inner = box
    }
    wrap(inner)
}

// tree-fanout, relayout-resize, relayout-style

private class InnerNode(val view: LinearLayout, val drawable: GradientDrawable, val color: Int)

fun tree(ui: Ui, d: TreeData): Mounted = with(ui) {
    val inner = ArrayList<InnerNode>()
    val stroke = px(1)
    val normal = px(1) + stroke
    val restyled = px(3) + stroke

    fun build(node: TreeNode): View {
        if (node.children.isEmpty()) return View(ctx).apply { setBackgroundColor(Tokens.palette[node.color]) }
        val isRow = node.dir == "row"
        val v = if (isRow) row() else column()
        val bg = GradientDrawable().apply {
            setColor(Tokens.paletteLight[node.color])
            setStroke(stroke, Tokens.palette[node.color])
        }
        v.background = bg
        v.setPadding(normal, normal, normal, normal)
        inner.add(InnerNode(v, bg, Tokens.palette[node.color]))
        for (c in node.children) {
            val leaf = c.children.isEmpty()
            val clp = if (isRow) lp(0, if (leaf) px(12) else MATCH, 1f) else lp(MATCH, if (leaf) px(12) else WRAP)
            v.addView(build(c), clp)
        }
        return v
    }

    // width: 100% / 80% of the outer box, as a weight against weightSum 1.
    val outer = row().apply { weightSum = 1f }
    val frame = column()
    val s = sentinel()
    frame.addView(build(d.root), lp(MATCH, WRAP))
    frame.addView(s, lp(MATCH, px(1)))
    val frameLp = lp(0, WRAP, 1f)
    outer.addView(frame, frameLp)

    fun restyle(on: Boolean) {
        val p = if (on) restyled else normal
        for (n in inner) {
            n.view.setPadding(p, p, p, p)
            n.drawable.setStroke(stroke, if (on) Tokens.accent else n.color)
        }
    }

    Mounted(outer, s) { name ->
        when (name) {
            "shrink" -> { frameLp.weight = 0.8f; frame.layoutParams = frameLp }
            "grow" -> { frameLp.weight = 1f; frame.layoutParams = frameLp }
            "restyle" -> restyle(true)
            "restore" -> restyle(false)
        }
    }
}

// flex-wrap-tiles, insert-remove

private fun Ui.tile(t: Tile): View {
    val v = column()
    v.background = rounded(Tokens.paletteLight[t.color], 8f)
    pad(v, 8f)
    v.addView(text(t.title, 14, Tokens.text, bold = true), lp(MATCH, WRAP))
    v.addView(text(t.subtitle, 12, Tokens.muted), lp(MATCH, WRAP))
    return v
}

private fun Ui.tileLp(): FlexboxLayout.LayoutParams =
    FlexboxLayout.LayoutParams(px(88), WRAP).apply { px(4).let { setMargins(it, it, it, it) } }

fun tiles(ui: Ui, d: TilesData): Mounted = with(ui) {
    val container = FlexboxLayout(ctx).apply {
        flexDirection = FlexDirection.ROW
        flexWrap = FlexWrap.WRAP
        alignItems = AlignItems.STRETCH
        alignContent = AlignContent.FLEX_START
    }
    pad(container, 4f)
    for (t in d.tiles) container.addView(tile(t), tileLp())
    var inserted = 0
    val m = wrap(container)
    Mounted(m.root, m.sentinel) { name ->
        if (name == "insert" && inserted == 0) {
            d.insert.forEachIndexed { i, t -> container.addView(tile(t), i, tileLp()) }
            inserted = d.insert.size
        } else if (name == "remove" && inserted > 0) {
            container.removeViews(0, inserted)
            inserted = 0
        }
    }
}

// grid-dashboard (flex-emulated, as in React Native)

fun dashboard(ui: Ui, d: DashboardData): Mounted = with(ui) {
    val line = px(1)

    val header = row().apply {
        gravity = CENTER_V
        background = EdgeDrawable(Tokens.surface, bottom = line, bottomColor = Tokens.border)
        setPadding(px(12), 0, px(12), line)
    }
    header.addView(text(d.title, 16, Tokens.text, bold = true), lp(0, WRAP, 1f))
    for (p in d.pills) {
        val pill = text(p, 12).apply { background = rounded(Tokens.bg, 999f) }
        pad(pill, 4f, 8f, 4f, 8f)
        header.addView(pill, lp(WRAP, WRAP).margins(0f, 0f, 0f, 4f))
    }

    val nav = column().apply {
        background = EdgeDrawable(Tokens.surface, right = line, rightColor = Tokens.border)
        setPadding(0, px(8), line, px(8))
    }
    for (n in d.nav) {
        val item = text(n.label, 12, if (n.active) Tokens.accent else Tokens.muted, bold = n.active)
        if (n.active) item.setBackgroundColor(Tokens.paletteLight[4])
        pad(item, 8f, 12f, 8f, 12f)
        nav.addView(item, lp(MATCH, WRAP))
    }

    val stats = column().also { pad(it, 4f) }
    for (i in d.stats.indices step 2) {
        val pair = row()
        for (st in d.stats.subList(i, minOf(i + 2, d.stats.size))) {
            pair.addView(stat(st), lp(0, MATCH, 1f).margins(4f, 4f, 4f, 4f))
        }
        stats.addView(pair, lp(MATCH, WRAP))
    }

    val table = column().also { pad(it, 4f, 8f, 4f, 8f) }
    table.addView(tableRow(d.columns.map { text(it, 12, bold = true) }), lp(MATCH, WRAP))
    for (r in d.rows) {
        table.addView(tableRow(listOf(nameCell(r)) + r.cells.map { text(it, 12) }), lp(MATCH, WRAP))
    }

    val main = column()
    main.addView(stats, lp(MATCH, WRAP))
    main.addView(table, lp(MATCH, WRAP))
    val body = row()
    body.addView(nav, lp(px(96), MATCH))
    body.addView(main, lp(0, WRAP, 1f))

    val root = column()
    root.addView(header, lp(MATCH, px(56)))
    root.addView(body, lp(MATCH, WRAP))
    val s = sentinel()
    root.addView(s, lp(MATCH, px(1)))
    Mounted(root, s)
}

private fun Ui.stat(st: StatCard): View {
    val card = column()
    card.background = rounded(Tokens.surface, 8f, 1f, Tokens.border)
    pad(card, 9f)
    card.addView(text(st.label, 12, Tokens.muted), lp(MATCH, WRAP))
    card.addView(text(st.value, 20, Tokens.text, bold = true), lp(MATCH, WRAP))
    card.addView(text(st.delta, 12, if (st.up) Tokens.positive else Tokens.negative), lp(MATCH, WRAP))
    val bars = row().apply { gravity = android.view.Gravity.BOTTOM }
    for (h in st.bars) bars.addView(block(Tokens.accent, 2f), lp(0, px(h), 1f).margins(0f, 1f, 0f, 1f))
    card.addView(bars, lp(MATCH, px(40)).margins(4f, 0f, 0f, 0f))
    return card
}

/** cellName: dot (8x8, margin-right 6) then the name. */
private fun Ui.nameCell(r: TableRow): View {
    val cell = row().apply { gravity = CENTER_V }
    cell.addView(block(Tokens.palette[r.color], 4f), lp(px(8), px(8)).margins(0f, 6f, 0f, 0f))
    cell.addView(text(r.name, 12), lp(WRAP, WRAP))
    return cell
}

/** `flex: 2 / 1 / 1 / 1` cells, centred, padding 6 0 and a bottom border. */
private fun Ui.tableRow(cells: List<View>): View {
    val line = px(1)
    val r = row().apply {
        gravity = CENTER_V
        background = EdgeDrawable(0, bottom = line, bottomColor = Tokens.border)
        setPadding(0, px(6), 0, px(6) + line)
    }
    cells.forEachIndexed { i, c -> r.addView(c, lp(0, WRAP, if (i == 0) 2f else 1f)) }
    return r
}

// text-flow

fun textFlow(ui: Ui, d: TextFlowData): Mounted = with(ui) {
    val container = column().also { pad(it, 12f) }
    for (p in d.paragraphs) {
        val size = Tokens.fontSizes[p.size]
        val t = text(p.text, size, Tokens.text, bold = p.bold, lineHeight = Tokens.lineHeight(size))
        if (p.spacing) t.letterSpacing = 0.5f / size // em
        if (p.clamp) clamp(t, 2)
        container.addView(t, lp(MATCH, WRAP).margins(0f, 0f, 8f, 0f))
    }
    wrap(container)
}

// styled-cards, scroll-plain

fun cards(ui: Ui, d: CardsData): Mounted = with(ui) {
    val container = column().also { pad(it, 4f) }
    for (c in d.cards) container.addView(card(c), lp(MATCH, WRAP).margins(8f, 8f, 8f, 8f))
    wrap(container)
}

private fun Ui.card(c: Card): View {
    val white = c.variant == 2
    val card = column()
    when (c.variant) {
        0 -> {
            card.background = rounded(Tokens.surface, 12f)
            // box-shadow 0 2 6 rgba(0,0,0,.2) as an elevation shadow on the rounded outline.
            card.elevation = pxf(3f)
        }
        1 -> {
            val r = pxf(16f)
            card.background = GradientDrawable().apply {
                setColor(Tokens.surface)
                cornerRadii = floatArrayOf(r, r, 0f, 0f, r, r, 0f, 0f)
                setStroke(px(2), Tokens.palette[c.color])
            }
            pad(card, 2f)
        }
        2 -> card.background = GradientDrawable(
            GradientDrawable.Orientation.TL_BR,
            intArrayOf(Tokens.palette[c.color], Tokens.palette[c.color2]),
        ).apply { cornerRadius = pxf(8f) }
        3 -> {
            val one = px(1)
            card.background = EdgeDrawable(
                Tokens.surface,
                top = px(4), topColor = Tokens.palette[c.color],
                right = one, rightColor = Tokens.border,
                bottom = one, bottomColor = Tokens.border,
                left = one, leftColor = Tokens.border,
            )
            pad(card, 4f, 1f, 1f, 1f)
        }
        4 -> {
            card.background = rounded(Tokens.surface, 8f, 1f, Tokens.border)
            pad(card, 1f)
            card.alpha = 0.85f
            card.rotation = -1f
            card.scaleX = 0.98f
            card.scaleY = 0.98f
        }
        else -> {
            card.background = rounded(Tokens.surface, 12f)
            card.clipToOutline = true
            card.addView(block(Tokens.palette[c.color]), lp(MATCH, px(24)))
        }
    }

    val inner = column().also { pad(it, 12f) }
    inner.addView(text(c.title, 16, if (white) Tokens.white else Tokens.text, bold = true), lp(MATCH, WRAP))
    inner.addView(text(c.body, 14, if (white) Tokens.white else Tokens.muted, lineHeight = 20), lp(MATCH, WRAP).margins(4f, 0f, 0f, 0f))
    val chips = row()
    for (x in c.chips) {
        val chip = text(x, 12).apply { background = rounded(Tokens.paletteLight[c.color], 999f) }
        pad(chip, 2f, 8f, 2f, 8f)
        chips.addView(chip, lp(WRAP, WRAP).margins(0f, 4f, 0f, 0f))
    }
    inner.addView(chips, lp(MATCH, WRAP).margins(8f, 0f, 0f, 0f))
    card.addView(inner, lp(MATCH, WRAP))
    return card
}
