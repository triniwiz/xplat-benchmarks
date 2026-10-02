package org.xplatbench.nativeandroidmason

import android.os.Build
import org.nativescript.mason.masonkit.Dimension
import org.nativescript.mason.masonkit.Scroll
import org.nativescript.mason.masonkit.Size
import org.nativescript.mason.masonkit.TextView
import org.nativescript.mason.masonkit.View
import org.nativescript.mason.masonkit.enums.AlignItems
import org.nativescript.mason.masonkit.enums.FlexDirection
import org.xplatbench.common.android.BenchActivity
import org.xplatbench.common.android.Chrome
import org.xplatbench.common.android.Mounted
import org.xplatbench.common.android.Placement
import org.xplatbench.common.fixtures.FixtureData
import org.xplatbench.common.fixtures.SCENARIOS
import org.xplatbench.common.fixtures.SIZES
import org.xplatbench.common.fixtures.ScenarioFixture
import org.xplatbench.common.fixtures.Tokens

class MainActivity : BenchActivity() {
    override val app = "native-android-mason"
    override val benchTitle = "Native Android + Mason"
    private val ui by lazy { MasonUi(this) }

    override fun framework(): Map<String, String> = linkedMapOf(
        "masonkit" to BuildConfig.MASONKIT_VERSION,
        "android" to "API ${Build.VERSION.SDK_INT}",
    )

    override fun createChrome(): Chrome = MasonChrome(ui)

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

/**
 * Mason end to end, as masonChrome() in apps/ns-core-mason-perf: a Mason root (`.frame`) holding the
 * status Text and a Mason Scroll host (`.body`). `fill` bodies (the list) replace the Scroll.
 */
class MasonChrome(private val ui: MasonUi) : Chrome {
    private val status: TextView = with(ui) {
        text("") {
            height(24f)
            font(11, Tokens.muted)
            pad(4f, 8f, 4f, 8f)
            backgroundColor = Tokens.surface
        }
    }
    private val scroll: Scroll = ui.mason.createScrollView(ui.ctx).also { s ->
        s.configure { with(ui) { it.flex1() } }
    }
    private val frame: View = with(ui) {
        box(listOf(status, scroll)) { size = Size(Dimension.Percent(1f), Dimension.Percent(1f)) }
    }
    private var body: android.view.View = scroll
    private var content: android.view.View? = null

    override val root: android.view.View = frame

    override fun setStatus(text: String) {
        status.textContent = text
    }

    private fun replaceBody(view: android.view.View) {
        frame.removeView(body)
        frame.addView(view)
        body = view
    }

    override fun setBody(view: android.view.View, placement: Placement) {
        clearScroll()
        if (placement == Placement.SCROLL) {
            if (body !== scroll) replaceBody(scroll)
            scroll.addView(view)
            content = view
        } else {
            replaceBody(view)
        }
    }

    private fun clearScroll() {
        content?.let { scroll.removeView(it) }
        content = null
    }

    override fun clear() {
        if (body !== scroll) replaceBody(scroll)
        clearScroll()
    }

    override fun home(title: String, pick: (String, String) -> Unit): android.view.View = with(ui) {
        val rows = ArrayList<android.view.View>()
        rows.add(text("xplat-benchmarks · $title") { font(16, Tokens.text, bold = true); margins(0f, 0f, 8f, 0f) })
        for (sc in SCENARIOS) {
            val cells = ArrayList<android.view.View>()
            cells.add(text(sc.title) { flex1(); font(13, Tokens.text) })
            for (size in SIZES) {
                val b = text(size) {
                    font(12, Tokens.text)
                    pad(4f, 10f, 4f, 10f)
                    margins(0f, 0f, 0f, 4f)
                    radius(4f)
                    backgroundColor = Tokens.paletteLight[4]
                }
                b.setOnClickListener { pick(sc.id, size) }
                cells.add(b)
            }
            rows.add(box(cells) { flexDirection = FlexDirection.Row; alignItems = AlignItems.Center; margins(0f, 0f, 4f, 0f) })
        }
        box(rows) { pad(12f); size = Size(Dimension.Percent(1f), Dimension.Auto) }
    }
}
