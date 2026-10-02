package org.xplatbench.nativeandroid

import android.os.Build
import android.view.View
import android.widget.FrameLayout
import android.widget.ScrollView
import android.widget.TextView
import org.xplatbench.common.android.BenchActivity
import org.xplatbench.common.android.Chrome
import org.xplatbench.common.android.Mounted
import org.xplatbench.common.android.Placement
import org.xplatbench.common.fixtures.FixtureData
import org.xplatbench.common.fixtures.SCENARIOS
import org.xplatbench.common.fixtures.SIZES
import org.xplatbench.common.fixtures.ScenarioFixture
import org.xplatbench.common.fixtures.Tokens
import org.xplatbench.nativeandroid.Ui.Companion.MATCH
import org.xplatbench.nativeandroid.Ui.Companion.WRAP

class MainActivity : BenchActivity() {
    override val app = "native-android"
    override val benchTitle = "Native Android (Views)"
    private val ui by lazy { Ui(this) }

    override fun framework(): Map<String, String> = linkedMapOf(
        "android-views" to "API ${Build.VERSION.SDK_INT}",
        "flexbox" to BuildConfig.FLEXBOX_VERSION,
        "recyclerview" to BuildConfig.RECYCLERVIEW_VERSION,
    )

    override fun createChrome(): Chrome = ViewsChrome(ui)

    override fun build(f: ScenarioFixture): Mounted = when (val d = f.data) {
        is FixtureData.Chain -> chain(ui, d.d)
        is FixtureData.Tree -> tree(ui, d.d)
        is FixtureData.Tiles -> tiles(ui, d.d)
        is FixtureData.Dashboard -> dashboard(ui, d.d)
        is FixtureData.TextFlow -> textFlow(ui, d.d)
        is FixtureData.Cards -> cards(ui, d.d)
        is FixtureData.List -> list(ui, d.d)
    }
}

/** Status line (24 dp) above a ScrollView host; `fill` bodies (the list) replace the ScrollView. */
class ViewsChrome(private val ui: Ui) : Chrome {
    private val status: TextView = ui.text("", 11, Tokens.muted).apply {
        setBackgroundColor(Tokens.surface)
        ui.pad(this, 4f, 8f, 4f, 8f)
        maxLines = 1
    }
    private val scroll = ScrollView(ui.ctx).apply { setBackgroundColor(Tokens.bg) }
    private val body = FrameLayout(ui.ctx).apply {
        addView(scroll, FrameLayout.LayoutParams(MATCH, MATCH))
    }
    private var fill: View? = null

    override val root: View = ui.column().apply {
        addView(status, ui.lp(MATCH, ui.px(24)))
        addView(body, ui.lp(MATCH, 0, 1f))
    }

    override fun setStatus(text: String) {
        status.text = text
    }

    override fun setBody(view: View, placement: Placement) {
        if (placement == Placement.SCROLL) {
            removeFill()
            scroll.removeAllViews()
            scroll.addView(view, FrameLayout.LayoutParams(MATCH, WRAP))
        } else {
            scroll.removeAllViews()
            scroll.visibility = View.GONE
            fill = view
            body.addView(view, FrameLayout.LayoutParams(MATCH, MATCH))
        }
    }

    private fun removeFill() {
        fill?.let { body.removeView(it) }
        fill = null
        scroll.visibility = View.VISIBLE
    }

    override fun clear() {
        removeFill()
        scroll.removeAllViews()
    }

    override fun home(title: String, pick: (String, String) -> Unit): View {
        val col = ui.column()
        ui.pad(col, 12f)
        col.addView(ui.text("xplat-benchmarks · $title", 16, Tokens.text, bold = true),
            with(ui) { lp(MATCH, WRAP).margins(0f, 0f, 8f, 0f) })
        for (sc in SCENARIOS) {
            val row = ui.row().apply { gravity = Ui.CENTER_V }
            row.addView(ui.text(sc.title, 13), ui.lp(0, WRAP, 1f))
            for (size in SIZES) {
                val b = ui.text(size, 12).apply {
                    background = ui.rounded(Tokens.paletteLight[4], 4f)
                    ui.pad(this, 4f, 10f, 4f, 10f)
                    setOnClickListener { pick(sc.id, size) }
                }
                row.addView(b, with(ui) { lp(WRAP, WRAP).margins(0f, 0f, 0f, 4f) })
            }
            col.addView(row, with(ui) { lp(MATCH, WRAP).margins(0f, 0f, 4f, 0f) })
        }
        return col
    }
}
