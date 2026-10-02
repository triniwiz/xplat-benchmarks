package org.xplatbench.nativeandroidcompose

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.AbsoluteRoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
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

// Compose versions of apps/native-android's scenarios, same structure and dp values. Borders are
// drawn inside the box and added to the padding (border-box), margins are an outer padding, and
// flex: 1 is a weight. Mutations write snapshot state; nothing touches a View.

/** Scenario root: a full-width column holding the content and, last, the 1 dp sentinel. */
@Composable
private fun Wrap(s: Modifier, content: @Composable () -> Unit) {
    Column(Modifier.fillMaxWidth()) {
        content()
        Sentinel(s)
    }
}

// nested-chain

fun chain(d: ChainData) = Scene { s -> Wrap(s) { ChainLevel(0, d) } }

@Composable
private fun ChainLevel(level: Int, d: ChainData) {
    if (level == d.depth) {
        Txt(d.label, 12, Modifier.fillMaxWidth().padding(4.dp))
    } else {
        val c = level % Tokens.palette.size
        Column(
            Modifier.fillMaxWidth()
                .edges(C.paletteLight[c], left = 1f, leftColor = C.palette[c])
                .padding(start = 2.dp, top = 1.dp, bottom = 1.dp)
        ) { ChainLevel(level + 1, d) }
    }
}

// tree-fanout, relayout-resize, relayout-style

fun tree(d: TreeData): Scene {
    val width = mutableFloatStateOf(1f)
    val restyled = mutableStateOf(false)
    return Scene(mutate = { name ->
        when (name) {
            "shrink" -> width.floatValue = 0.8f
            "grow" -> width.floatValue = 1f
            "restyle" -> restyled.value = true
            "restore" -> restyled.value = false
        }
    }) { s ->
        // width: 100% / 80% of the scroll host; the sentinel sits inside, so a resize moves it.
        Column(Modifier.fillMaxWidth(width.floatValue)) {
            TreeBox(d.root, restyled, Modifier.fillMaxWidth())
            Sentinel(s)
        }
    }
}

/**
 * Inner nodes read `restyled`, so restyle recomposes every inner node. Siblings have identical
 * subtrees (equal heights), so cross-axis stretch needs no IntrinsicSize pass.
 */
@Composable
private fun TreeBox(node: TreeNode, restyled: MutableState<Boolean>, modifier: Modifier) {
    if (node.children.isEmpty()) {
        Box(modifier.background(C.palette[node.color]))
    } else {
        val on = restyled.value
        val m = modifier
            .background(C.paletteLight[node.color])
            .border(1.dp, if (on) C.accent else C.palette[node.color])
            .padding(if (on) 4.dp else 2.dp)
        if (node.dir == "row") {
            Row(m) {
                for (c in node.children) {
                    TreeBox(c, restyled, if (c.children.isEmpty()) Modifier.weight(1f).height(12.dp) else Modifier.weight(1f))
                }
            }
        } else {
            Column(m) {
                for (c in node.children) {
                    TreeBox(c, restyled, if (c.children.isEmpty()) Modifier.fillMaxWidth().height(12.dp) else Modifier.fillMaxWidth())
                }
            }
        }
    }
}

// flex-wrap-tiles, insert-remove

fun tiles(d: TilesData): Scene {
    val tiles = mutableStateListOf<Tile>().apply { addAll(d.tiles) }
    var inserted = 0
    return Scene(mutate = { name ->
        if (name == "insert" && inserted == 0) {
            tiles.addAll(0, d.insert)
            inserted = d.insert.size
        } else if (name == "remove" && inserted > 0) {
            tiles.removeRange(0, inserted)
            inserted = 0
        }
    }) { s -> Wrap(s) { TileFlow(tiles) } }
}

/** flex-wrap: wrap, align-items: stretch (fillMaxRowHeight), align-content: flex-start. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun TileFlow(tiles: List<Tile>) {
    FlowRow(Modifier.fillMaxWidth().padding(4.dp)) {
        for (t in tiles) key(t.id) { TileView(t, Modifier.fillMaxRowHeight()) }
    }
}

@Composable
private fun TileView(t: Tile, modifier: Modifier) {
    Column(modifier.padding(4.dp).width(88.dp).background(C.paletteLight[t.color], rounded(8)).padding(8.dp)) {
        Txt(t.title, 14, Modifier.fillMaxWidth(), bold = true)
        Txt(t.subtitle, 12, Modifier.fillMaxWidth(), color = C.muted)
    }
}

// grid-dashboard (flex-emulated, as native-android and React Native)

fun dashboard(d: DashboardData): Scene {
    val pairs = d.stats.chunked(2)
    return Scene { s -> Wrap(s) { Dashboard(d, pairs) } }
}

@Composable
private fun Dashboard(d: DashboardData, pairs: List<List<StatCard>>) {
    Row(
        Modifier.fillMaxWidth().height(56.dp)
            .edges(C.surface, bottom = 1f, bottomColor = C.border)
            .padding(start = 12.dp, end = 12.dp, bottom = 1.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Txt(d.title, 16, Modifier.weight(1f), bold = true)
        for (p in d.pills) {
            Txt(p, 12, Modifier.padding(start = 4.dp).background(C.bg, Pill).padding(8.dp, 4.dp))
        }
    }
    // The nav stretches to the body height (a MATCH_PARENT child in native-android): IntrinsicSize.Min.
    Row(Modifier.fillMaxWidth().height(IntrinsicSize.Min)) {
        Column(
            Modifier.width(96.dp).fillMaxHeight()
                .edges(C.surface, right = 1f, rightColor = C.border)
                .padding(top = 8.dp, end = 1.dp, bottom = 8.dp)
        ) {
            for (n in d.nav) {
                val item = if (n.active) Modifier.fillMaxWidth().background(C.paletteLight[4]) else Modifier.fillMaxWidth()
                Txt(n.label, 12, item.padding(12.dp, 8.dp), color = if (n.active) C.accent else C.muted, bold = n.active)
            }
        }
        Column(Modifier.weight(1f)) {
            Column(Modifier.fillMaxWidth().padding(4.dp)) {
                for (pair in pairs) {
                    Row(Modifier.fillMaxWidth().height(IntrinsicSize.Min)) {
                        for (st in pair) Stat(st, Modifier.weight(1f).fillMaxHeight())
                    }
                }
            }
            Column(Modifier.fillMaxWidth().padding(8.dp, 4.dp)) {
                TableRowView {
                    for ((i, col) in d.columns.withIndex()) Txt(col, 12, Modifier.weight(if (i == 0) 2f else 1f), bold = true)
                }
                for (r in d.rows) {
                    TableRowView {
                        NameCell(r, Modifier.weight(2f))
                        for (cell in r.cells) Txt(cell, 12, Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
private fun Stat(st: StatCard, modifier: Modifier) {
    Column(modifier.padding(4.dp).background(C.surface, rounded(8)).border(1.dp, C.border, rounded(8)).padding(9.dp)) {
        Txt(st.label, 12, Modifier.fillMaxWidth(), color = C.muted)
        Txt(st.value, 20, Modifier.fillMaxWidth(), bold = true)
        Txt(st.delta, 12, Modifier.fillMaxWidth(), color = if (st.up) C.positive else C.negative)
        Row(Modifier.padding(top = 4.dp).fillMaxWidth().height(40.dp), verticalAlignment = Alignment.Bottom) {
            for (h in st.bars) {
                Box(Modifier.weight(1f).padding(horizontal = 1.dp).height(h.dp).background(C.accent, rounded(2)))
            }
        }
    }
}

/** cellName: dot (8x8, margin-right 6) then the name. */
@Composable
private fun NameCell(r: TableRow, modifier: Modifier) {
    Row(modifier, verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.padding(end = 6.dp).size(8.dp).background(C.palette[r.color], rounded(4)))
        Txt(r.name, 12)
    }
}

/** `flex: 2 / 1 / 1 / 1` cells, centred, padding 6 0 and a bottom border. */
@Composable
private fun TableRowView(cells: @Composable RowScope.() -> Unit) {
    Row(
        Modifier.fillMaxWidth()
            .edges(Color.Transparent, bottom = 1f, bottomColor = C.border)
            .padding(top = 6.dp, bottom = 7.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = cells,
    )
}

// text-flow

fun textFlow(d: TextFlowData) = Scene { s ->
    Wrap(s) {
        Column(Modifier.fillMaxWidth().padding(12.dp)) {
            for (p in d.paragraphs) {
                val size = Tokens.fontSizes[p.size]
                Txt(
                    p.text, size, Modifier.fillMaxWidth().padding(bottom = 8.dp),
                    bold = p.bold, lineHeight = Tokens.lineHeight(size), spacing = p.spacing,
                    maxLines = if (p.clamp) 2 else Int.MAX_VALUE,
                )
            }
        }
    }
}

// styled-cards, scroll-plain

fun cards(d: CardsData) = Scene { s ->
    Wrap(s) {
        Column(Modifier.fillMaxWidth().padding(4.dp)) {
            for (c in d.cards) CardView(c)
        }
    }
}

/** Top-left and bottom-right 16 dp, the others square. */
private val V1 = AbsoluteRoundedCornerShape(topLeft = 16.dp, topRight = 0.dp, bottomRight = 16.dp, bottomLeft = 0.dp)

@Composable
private fun CardView(c: Card) {
    val white = c.variant == 2
    val outer = Modifier.padding(8.dp).fillMaxWidth()
    val m = when (c.variant) {
        // box-shadow 0 2 6 rgba(0,0,0,.2) as a 3 dp elevation shadow, as native-android.
        0 -> outer.shadow(3.dp, rounded(12)).background(C.surface, rounded(12))
        1 -> outer.background(C.surface, V1).border(2.dp, C.palette[c.color], V1).padding(2.dp)
        2 -> outer.background(Brush.linearGradient(listOf(C.palette[c.color], C.palette[c.color2])), rounded(8))
        3 -> outer
            .edges(
                C.surface,
                top = 4f, topColor = C.palette[c.color],
                right = 1f, rightColor = C.border,
                bottom = 1f, bottomColor = C.border,
                left = 1f, leftColor = C.border,
            )
            .padding(start = 1.dp, top = 4.dp, end = 1.dp, bottom = 1.dp)
        4 -> outer
            .graphicsLayer {
                alpha = 0.85f
                rotationZ = -1f
                scaleX = 0.98f
                scaleY = 0.98f
            }
            .background(C.surface, rounded(8))
            .border(1.dp, C.border, rounded(8))
            .padding(1.dp)
        else -> outer.clip(rounded(12)).background(C.surface)
    }
    Column(m) {
        if (c.variant == 5) Box(Modifier.fillMaxWidth().height(24.dp).background(C.palette[c.color]))
        Column(Modifier.fillMaxWidth().padding(12.dp)) {
            Txt(c.title, 16, Modifier.fillMaxWidth(), color = if (white) C.white else C.text, bold = true)
            Txt(c.body, 14, Modifier.fillMaxWidth().padding(top = 4.dp), color = if (white) C.white else C.muted, lineHeight = 20)
            Row(Modifier.fillMaxWidth().padding(top = 8.dp)) {
                for (x in c.chips) {
                    Txt(x, 12, Modifier.padding(end = 4.dp).background(C.paletteLight[c.color], Pill).padding(8.dp, 2.dp))
                }
            }
        }
    }
}
