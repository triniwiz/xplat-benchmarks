package org.xplatbench.nativeandroidcompose

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import org.xplatbench.common.android.Placement
import org.xplatbench.common.fixtures.ListData
import org.xplatbench.common.fixtures.ListItem

/**
 * list-scroll: the one virtualized scenario. LazyColumn keyed by id with one content type per item
 * type (the counterpart of RecyclerView view types). The LazyColumn is the sentinel: its first
 * layout composes the visible cells.
 */
fun list(d: ListData) = Scene(Placement.FILL) { s ->
    LazyColumn(s.fillMaxSize().background(C.bg)) {
        items(d.items, key = { it.id }, contentType = { it.type }) { item -> ListCell(item) }
    }
}

@Composable
private fun ListCell(item: ListItem) {
    if (item.type != "c") {
        Row(
            Modifier.fillMaxWidth()
                .edges(C.surface, bottom = 1f, bottomColor = C.border)
                .padding(start = 16.dp, top = 12.dp, end = 16.dp, bottom = 13.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) { Head(item) }
    } else {
        Column(
            Modifier.padding(12.dp, 8.dp).fillMaxWidth()
                .background(C.surface, rounded(12)).border(1.dp, C.border, rounded(12))
                .padding(13.dp)
        ) {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) { Head(item) }
            Txt(item.body, 14, Modifier.fillMaxWidth().padding(top = 8.dp), lineHeight = 20)
            Badges(item)
        }
    }
}

/** Mark, title/subtitle (plus badges for type b) and meta. */
@Composable
private fun RowScope.Head(item: ListItem) {
    val b = item.type == "b"
    Box(Modifier.padding(end = 12.dp).size(if (b) 56.dp else 32.dp).background(C.palette[item.color], rounded(if (b) 8 else 16)))
    Column(Modifier.weight(1f)) {
        Txt(item.title, 14, Modifier.fillMaxWidth(), bold = true)
        Txt(item.subtitle, 12, Modifier.fillMaxWidth(), color = C.muted)
        if (b) Badges(item)
    }
    Txt(item.meta, 12, Modifier.padding(start = 8.dp), color = C.muted)
}

@Composable
private fun Badges(item: ListItem) {
    Row(Modifier.fillMaxWidth().padding(top = 4.dp)) {
        for (x in item.badges) {
            Txt(x, 10, Modifier.padding(end = 4.dp).background(C.paletteLight[item.color], rounded(4)).padding(6.dp, 2.dp))
        }
    }
}
