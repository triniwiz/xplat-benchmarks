package org.xplatbench.common.android

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import org.json.JSONObject
import org.xplatbench.common.bench.BenchAdapter
import org.xplatbench.common.bench.LaunchCommand
import org.xplatbench.common.bench.PaintTiming
import org.xplatbench.common.bench.parseLaunchUrl
import org.xplatbench.common.bench.runPlan
import org.xplatbench.common.fixtures.ScenarioFixture
import org.xplatbench.common.fixtures.Tokens
import org.xplatbench.common.fixtures.fixtureFor
import java.util.Locale

enum class Placement { SCROLL, FILL }

/** One mounted scenario: its root, the sentinel whose layout marks "painted", and its mutations. */
class Mounted(
    val root: View,
    val sentinel: View,
    val placement: Placement = Placement.SCROLL,
    val mutate: (String) -> Unit = {},
)

/** The app frame: a status line above a full-screen vertical scroll host (as ns-common/shell.ts). */
interface Chrome {
    val root: View
    fun setStatus(text: String)
    fun setBody(view: View, placement: Placement)
    fun clear()
    fun home(title: String, pick: (scenario: String, size: String) -> Unit): View
}

/**
 * Shared shell: launch-URL handling, the BenchAdapter and the runner. Each app supplies its chrome
 * and its scenario builders.
 */
abstract class BenchActivity : Activity(), BenchAdapter {
    abstract override val app: String
    abstract val benchTitle: String
    abstract fun framework(): Map<String, String>
    abstract fun createChrome(): Chrome
    abstract fun build(f: ScenarioFixture): Mounted

    protected lateinit var chrome: Chrome
    private var current: Mounted? = null
    private var watch: PaintWatch? = null
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var lastStatus = ""
    private var lastUrl = ""
    private var lastUrlAt = 0L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        chrome = createChrome()
        val frame = FrameLayout(this)
        frame.setBackgroundColor(Tokens.bg)
        frame.addView(chrome.root, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
        ViewCompat.setOnApplyWindowInsetsListener(frame) { v, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            WindowInsetsCompat.CONSUMED
        }
        setContentView(frame)
        setStatus("$app · ready")
        chrome.setBody(chrome.home(benchTitle, ::show), Placement.SCROLL)
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

    private fun setStatus(text: String) {
        if (text == lastStatus) return
        lastStatus = text
        chrome.setStatus(text)
    }

    // BenchAdapter

    override fun now(): Double = nowMs()

    override fun info(): JSONObject {
        val dm = resources.displayMetrics
        val fw = JSONObject()
        framework().forEach { (k, v) -> fw.put(k, v) }
        return JSONObject()
            .put("platform", "android")
            .put("osVersion", Build.VERSION.RELEASE)
            .put("deviceModel", "${Build.MANUFACTURER} ${Build.MODEL}")
            .put("framework", fw)
            .put("screenWidth", dm.widthPixels / dm.density.toDouble())
    }

    override fun mount(fixture: ScenarioFixture, done: (PaintTiming?) -> Unit) {
        val m = build(fixture)
        current = m
        val built = now()
        var attached = 0.0
        watch = PaintWatch(m.sentinel) { layout, end ->
            watch = null
            done(PaintTiming(end = end, marks = linkedMapOf("built" to built, "attached" to attached, "layout" to layout)))
        }
        chrome.setBody(m.root, m.placement)
        attached = now()
    }

    override fun mutate(fixture: ScenarioFixture, mutation: String, done: (PaintTiming?) -> Unit) {
        val m = current ?: return done(null)
        watch = PaintWatch(m.sentinel) { layout, end ->
            watch = null
            done(PaintTiming(end = end, marks = mapOf("layout" to layout)))
        }
        m.mutate(mutation)
    }

    override fun unmount(done: () -> Unit) {
        watch?.cancel()
        watch = null
        current = null
        chrome.clear()
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
        setStatus("$app · $scenario/$size")
        unmount {
            val t0 = now()
            mount(f) { setStatus(String.format(Locale.US, "%s · %s/%s · %.1f ms", app, scenario, size, now() - t0)) }
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
                runPlan(this@BenchActivity, cmd.host, cmd.runId) { s ->
                    if (s.iteration == 0) setStatus("$app · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}")
                }
            }
            null -> {}
        }
    }
}
