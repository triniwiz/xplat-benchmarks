package org.xplatbench.nativeandroid

import android.graphics.drawable.GradientDrawable
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import org.xplatbench.common.android.Mounted
import org.xplatbench.common.android.Placement
import org.xplatbench.common.fixtures.ListData
import org.xplatbench.common.fixtures.ListItem
import org.xplatbench.common.fixtures.Tokens
import org.xplatbench.nativeandroid.Ui.Companion.CENTER_V
import org.xplatbench.nativeandroid.Ui.Companion.MATCH
import org.xplatbench.nativeandroid.Ui.Companion.WRAP

/**
 * list-scroll: the one virtualized scenario. RecyclerView with one view type per item type (the
 * Android counterpart of FlashList's getItemType). The RecyclerView is the sentinel: its first
 * layout builds the visible cells.
 */
fun list(ui: Ui, d: ListData): Mounted {
    val rv = RecyclerView(ui.ctx).apply {
        setBackgroundColor(Tokens.bg)
        layoutManager = LinearLayoutManager(ui.ctx)
        adapter = ListAdapter(ui, d.items)
    }
    return Mounted(rv, rv, Placement.FILL)
}

private val TYPES = listOf("a", "b", "c")

private class ListAdapter(private val ui: Ui, private val items: List<ListItem>) : RecyclerView.Adapter<Cell>() {
    override fun getItemCount() = items.size
    override fun getItemViewType(position: Int) = TYPES.indexOf(items[position].type)
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = Cell.create(ui, TYPES[viewType])
    override fun onBindViewHolder(holder: Cell, position: Int) = holder.bind(items[position])
}

private class Cell(
    root: View,
    private val visual: GradientDrawable,
    private val title: TextView,
    private val subtitle: TextView,
    private val meta: TextView,
    private val body: TextView?,
    private val badges: List<Pair<TextView, GradientDrawable>>,
) : RecyclerView.ViewHolder(root) {

    fun bind(item: ListItem) {
        visual.setColor(Tokens.palette[item.color])
        title.text = item.title
        subtitle.text = item.subtitle
        meta.text = item.meta
        body?.text = item.body
        for ((i, b) in badges.withIndex()) {
            if (i < item.badges.size) {
                b.first.visibility = View.VISIBLE
                b.first.text = item.badges[i]
                b.second.setColor(Tokens.paletteLight[item.color])
            } else {
                b.first.visibility = View.GONE
            }
        }
    }

    companion object {
        fun create(ui: Ui, type: String): Cell = with(ui) {
            val line = px(1)
            val side = if (type == "b") 56 else 32
            val visual = rounded(Tokens.palette[0], if (type == "b") 8f else 16f)
            val mark = View(ctx).apply { background = visual }
            val title = text(null, 14, Tokens.text, bold = true)
            val subtitle = text(null, 12, Tokens.muted)
            val meta = text(null, 12, Tokens.muted)
            val badges = ArrayList<Pair<TextView, GradientDrawable>>()
            fun badgeRow(): LinearLayout {
                val row = row()
                repeat(3) {
                    val bg = rounded(Tokens.paletteLight[0], 4f)
                    val b = text(null, 10).apply { background = bg }
                    pad(b, 2f, 6f, 2f, 6f)
                    row.addView(b, lp(WRAP, WRAP).margins(0f, 4f, 0f, 0f))
                    badges.add(b to bg)
                }
                return row
            }
            val textCol = column()
            textCol.addView(title, lp(MATCH, WRAP))
            textCol.addView(subtitle, lp(MATCH, WRAP))

            fun head(r: LinearLayout) {
                r.gravity = CENTER_V
                r.addView(mark, lp(px(side), px(side)).margins(0f, 12f, 0f, 0f))
                r.addView(textCol, lp(0, WRAP, 1f))
                r.addView(meta, lp(WRAP, WRAP).margins(0f, 0f, 0f, 8f))
            }

            val root: View
            var body: TextView? = null
            if (type != "c") {
                if (type == "b") textCol.addView(badgeRow(), lp(MATCH, WRAP).margins(4f, 0f, 0f, 0f))
                val r = row()
                r.background = EdgeDrawable(Tokens.surface, bottom = line, bottomColor = Tokens.border)
                r.setPadding(px(16), px(12), px(16), px(12) + line)
                head(r)
                r.layoutParams = RecyclerView.LayoutParams(MATCH, WRAP)
                root = r
            } else {
                val headRow = row()
                head(headRow)
                val b = text(null, 14, Tokens.text, lineHeight = 20)
                body = b
                val card = column()
                card.background = rounded(Tokens.surface, 12f, 1f, Tokens.border)
                pad(card, 13f)
                card.addView(headRow, lp(MATCH, WRAP))
                card.addView(b, lp(MATCH, WRAP).margins(8f, 0f, 0f, 0f))
                card.addView(badgeRow(), lp(MATCH, WRAP).margins(4f, 0f, 0f, 0f))
                card.layoutParams = RecyclerView.LayoutParams(MATCH, WRAP).apply {
                    setMargins(px(12), px(8), px(12), px(8))
                }
                root = card
            }
            Cell(root, visual, title, subtitle, meta, body, badges)
        }
    }
}
