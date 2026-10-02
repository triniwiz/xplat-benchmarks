package org.xplatbench.nativeandroidmason

import org.nativescript.mason.masonkit.Dimension
import org.nativescript.mason.masonkit.ListView
import org.nativescript.mason.masonkit.Size
import org.nativescript.mason.masonkit.TextView
import org.nativescript.mason.masonkit.View
import org.nativescript.mason.masonkit.enums.AlignItems
import org.nativescript.mason.masonkit.enums.FlexDirection
import org.xplatbench.common.android.Mounted
import org.xplatbench.common.android.Placement
import org.xplatbench.common.fixtures.ListData
import org.xplatbench.common.fixtures.ListItem
import org.xplatbench.common.fixtures.Tokens

/**
 * list-scroll: Mason's ListView (the RecyclerView-backed list behind NativeScript's Mason `Ul`), one
 * view type per item type. As in the NS Mason apps, each cell is a full-width Mason root (`.li-cell`)
 * and binding rebuilds the badges. The ListView is the sentinel: its first layout builds the cells.
 */
fun list(ui: MasonUi, d: ListData): Mounted = with(ui) {
    val list = mason.createListView(ctx)
    list.configure {
        it.flex1()
        it.pad(0f)
        it.backgroundColor = Tokens.bg
    }
    list.listener = object : ListView.Listener {
        override fun getItemViewType(position: Int): Int = TYPES.indexOf(d.items[position].type)
        override fun onCreate(type: Int): android.view.View = createItem(ui, TYPES[type])
        override fun onBind(holder: ListView.Holder, index: Int) = bindItem(ui, holder.view, d.items[index])
    }
    list.count = d.items.size
    Mounted(list, list, Placement.FILL)
}

private val TYPES = listOf("a", "b", "c")

private class ItemRefs(
    val mark: View,
    val title: TextView,
    val sub: TextView,
    val meta: TextView,
    val body: TextView?,
    val badges: View?,
)

private fun MasonUi.headRow(withBadges: Boolean, card: Boolean): Pair<View, ItemRefs> {
    val mark = box()
    val title = text("") { font(14, Tokens.text, bold = true) }
    val sub = text("") { font(12, Tokens.muted) }
    val meta = text("") { font(12, Tokens.muted); margins(0f, 0f, 0f, 8f) }
    val badges = if (withBadges) badgesBox() else null
    val col = box(listOfNotNull(title, sub, badges)) { flex1() }
    val row = box(listOf(mark, col, meta)) {
        flexDirection = FlexDirection.Row
        alignItems = AlignItems.Center
        if (!card) {
            pad(12f, 16f, 12f, 16f)
            backgroundColor = Tokens.surface
            borders(0f, 0f, 1f, 0f, Tokens.border)
        }
    }
    return row to ItemRefs(mark, title, sub, meta, null, badges)
}

private fun MasonUi.badgesBox(): View = box { flexDirection = FlexDirection.Row; margins(4f, 0f, 0f, 0f) }

private fun createItem(ui: MasonUi, type: String): android.view.View = with(ui) {
    val view: View
    val refs: ItemRefs
    when (type) {
        "a", "b" -> {
            val (row, r) = headRow(withBadges = type == "b", card = false)
            view = row
            refs = r
        }
        else -> {
            val (head, r) = headRow(withBadges = false, card = true)
            val body = text("") { font(14, Tokens.text); lineHeightPx(20); margins(8f, 0f, 0f, 0f) }
            val badges = badgesBox()
            view = box(listOf(head, body, badges)) {
                margins(8f, 12f, 8f, 12f)
                pad(12f)
                radius(12f)
                backgroundColor = Tokens.surface
                borders(1f, 1f, 1f, 1f, Tokens.border)
            }
            refs = ItemRefs(r.mark, r.title, r.sub, r.meta, body, badges)
        }
    }
    // .avatar 32x32 radius 16 / .thumb 56x56 radius 8, margin-right 12
    val side = if (type == "b") 56f else 32f
    refs.mark.style.configure {
        it.width(side)
        it.height(side)
        it.radius(if (type == "b") 8f else 16f)
        it.margins(0f, 12f, 0f, 0f)
    }
    val cell = box(listOf(view)) { size = Size(Dimension.Percent(1f), Dimension.Auto) }
    cell.tag = refs
    cell
}

private fun bindItem(ui: MasonUi, view: android.view.View, item: ListItem): Unit = with(ui) {
    val r = view.tag as ItemRefs
    r.mark.style.configure { it.backgroundColor = Tokens.palette[item.color] }
    r.title.textContent = item.title
    r.sub.textContent = item.subtitle
    r.meta.textContent = item.meta
    r.body?.textContent = item.body
    r.badges?.let { b ->
        b.removeAllViews()
        for (x in item.badges) {
            b.addView(text(x) {
                pad(2f, 6f, 2f, 6f)
                margins(0f, 4f, 0f, 0f)
                radius(4f)
                font(10, Tokens.text)
                backgroundColor = Tokens.paletteLight[item.color]
            })
        }
    }
    Unit
}
