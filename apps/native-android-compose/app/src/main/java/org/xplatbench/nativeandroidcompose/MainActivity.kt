package org.xplatbench.nativeandroidcompose

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.displayCutout
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.union
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import org.json.JSONObject
import org.xplatbench.common.android.FrameClock
import org.xplatbench.common.android.Placement
import org.xplatbench.common.android.nowMs
import org.xplatbench.common.bench.BenchAdapter
import org.xplatbench.common.bench.LaunchCommand
import org.xplatbench.common.bench.PaintTiming
import org.xplatbench.common.bench.parseLaunchUrl
import org.xplatbench.common.bench.runPlan
import org.xplatbench.common.fixtures.FixtureData
import org.xplatbench.common.fixtures.SCENARIOS
import org.xplatbench.common.fixtures.SIZES
import org.xplatbench.common.fixtures.ScenarioFixture
import org.xplatbench.common.fixtures.fixtureFor
import java.util.Locale

/** One mounted scenario: its content (which places the sentinel last) and its state mutations. */
class Scene(
    val placement: Placement = Placement.SCROLL,
    val mutate: (String) -> Unit = {},
    val content: @Composable (sentinel: Modifier) -> Unit,
)

private sealed interface Body {
    object Empty : Body
    object Home : Body
    class Mounted(val scene: Scene) : Body
}

/**
 * "Painted", as native-android's PaintWatch: the sentinel's first onGloballyPositioned after a
 * mount or mutation is the `layout` mark, the next Choreographer frame ends the sample. `frame` is
 * the first frame after the state write (Compose recomposes on its frame clock), `composed` the
 * mount's SideEffect.
 */
private class PaintWatch(private val done: (marks: Map<String, Double>, end: Double) -> Unit) {
    private var fired = false
    private val marks = LinkedHashMap<String, Double>()

    init {
        FrameClock.next { if (!fired) marks["frame"] = nowMs() }
    }

    fun composed() {
        if (!fired && "composed" !in marks) marks["composed"] = nowMs()
    }

    fun placed() {
        if (fired) return
        fired = true
        marks["layout"] = nowMs()
        FrameClock.next { done(marks, nowMs()) }
    }

    fun cancel() {
        fired = true
    }
}

/**
 * Same shell as native-android's BenchActivity (launch URLs, BenchAdapter, runner), on a
 * ComponentActivity so it can host Compose. The whole frame is one composition.
 */
class MainActivity : ComponentActivity(), BenchAdapter {
    override val app = "native-android-compose"
    private val benchTitle = "Native Android (Jetpack Compose)"

    private var status by mutableStateOf("")
    private var body by mutableStateOf<Body>(Body.Empty)
    private var current: Scene? = null
    private var watch: PaintWatch? = null
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var lastUrl = ""
    private var lastUrlAt = 0L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val density = LocalDensity.current
            val styles = remember(density) { TextStyles(density) }
            CompositionLocalProvider(LocalTextStyles provides styles) { Frame() }
        }
        status = "$app · ready"
        body = Body.Home
        handle(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handle(intent)
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }

    // chrome

    /** Status line (24 dp) above a vertical scroll host; `fill` bodies (the list) replace the scroll host. */
    @Composable
    private fun Frame() {
        Column(
            Modifier.fillMaxSize().background(C.bg)
                .windowInsetsPadding(WindowInsets.systemBars.union(WindowInsets.displayCutout))
        ) {
            Txt(
                status, 11,
                Modifier.fillMaxWidth().height(24.dp).background(C.surface).padding(8.dp, 4.dp),
                color = C.muted, maxLines = 1,
            )
            Box(Modifier.fillMaxWidth().weight(1f)) { BodyHost() }
        }
    }

    @Composable
    private fun BodyHost() {
        val scroll = rememberScrollState()
        val sentinel = remember { Modifier.onGloballyPositioned { watch?.placed() } }
        val b = body
        if (b is Body.Mounted && b.scene.placement == Placement.FILL) {
            b.scene.content(sentinel)
            SideEffect { watch?.composed() }
        } else {
            Column(Modifier.fillMaxSize().background(C.bg).verticalScroll(scroll)) {
                when (b) {
                    is Body.Mounted -> {
                        b.scene.content(sentinel)
                        SideEffect { watch?.composed() }
                    }
                    Body.Home -> Home()
                    Body.Empty -> {}
                }
            }
        }
    }

    @Composable
    private fun Home() {
        Column(Modifier.fillMaxWidth().padding(12.dp)) {
            Txt("xplat-benchmarks · $benchTitle", 16, Modifier.padding(bottom = 8.dp), bold = true)
            for (sc in SCENARIOS) {
                Row(Modifier.fillMaxWidth().padding(bottom = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                    Txt(sc.title, 13, Modifier.weight(1f))
                    for (size in SIZES) {
                        Txt(
                            size, 12,
                            Modifier.padding(start = 4.dp).clickable { show(sc.id, size) }
                                .background(C.paletteLight[4], rounded(4)).padding(10.dp, 4.dp),
                        )
                    }
                }
            }
        }
    }

    private fun build(f: ScenarioFixture): Scene = when (val d = f.data) {
        is FixtureData.Chain -> chain(d.d)
        is FixtureData.Tree -> tree(d.d)
        is FixtureData.Tiles -> tiles(d.d)
        is FixtureData.Dashboard -> dashboard(d.d)
        is FixtureData.TextFlow -> textFlow(d.d)
        is FixtureData.Cards -> cards(d.d)
        is FixtureData.List -> list(d.d)
    }

    // BenchAdapter

    override fun now(): Double = nowMs()

    override fun info(): JSONObject {
        val dm = resources.displayMetrics
        val fw = JSONObject()
            .put("jetpack-compose", "BOM ${BuildConfig.COMPOSE_BOM}")
            .put("android", "API ${Build.VERSION.SDK_INT}")
        return JSONObject()
            .put("platform", "android")
            .put("osVersion", Build.VERSION.RELEASE)
            .put("deviceModel", "${Build.MANUFACTURER} ${Build.MODEL}")
            .put("framework", fw)
            .put("screenWidth", dm.widthPixels / dm.density.toDouble())
    }

    override fun mount(fixture: ScenarioFixture, done: (PaintTiming?) -> Unit) {
        val scene = build(fixture)
        current = scene
        val built = now()
        var attached = 0.0
        watch = PaintWatch { marks, end ->
            watch = null
            done(PaintTiming(end = end, marks = linkedMapOf("built" to built, "attached" to attached) + marks))
        }
        body = Body.Mounted(scene)
        attached = now()
    }

    override fun mutate(fixture: ScenarioFixture, mutation: String, done: (PaintTiming?) -> Unit) {
        val scene = current ?: return done(null)
        watch = PaintWatch { marks, end ->
            watch = null
            done(PaintTiming(end = end, marks = marks - "composed"))
        }
        scene.mutate(mutation)
    }

    override fun unmount(done: () -> Unit) {
        watch?.cancel()
        watch = null
        current = null
        body = Body.Empty
        FrameClock.frames(2, done)
    }

    override fun align(done: () -> Unit) = FrameClock.next(done)

    override fun gc() {
        Runtime.getRuntime().gc()
    }

    override fun log(message: String) {
        Log.i("xplatbench", message)
    }

    // launch handling

    private fun show(scenario: String, size: String) {
        val f = fixtureFor(scenario, size)
        status = "$app · $scenario/$size"
        unmount {
            val t0 = now()
            mount(f) { status = String.format(Locale.US, "%s · %s/%s · %.1f ms", app, scenario, size, now() - t0) }
        }
    }

    private fun handle(intent: Intent?) {
        val url = intent?.dataString ?: return
        if (!url.startsWith("xplatbench")) return
        val at = System.currentTimeMillis()
        if (url == lastUrl && at - lastUrlAt < 2000) return
        lastUrl = url
        lastUrlAt = at
        when (val cmd = parseLaunchUrl(url)) {
            is LaunchCommand.Show -> window.decorView.post { show(cmd.scenario, cmd.size) }
            is LaunchCommand.Run -> scope.launch {
                runPlan(this@MainActivity, cmd.host, cmd.runId) { s ->
                    if (s.iteration == 0) status = "$app · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}"
                }
            }
            null -> {}
        }
    }
}
