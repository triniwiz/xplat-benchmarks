package org.xplatbench.common.bench

import android.os.Handler
import android.os.Looper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import org.xplatbench.common.fixtures.ScenarioFixture
import org.xplatbench.common.fixtures.fixtureFor
import org.xplatbench.common.fixtures.getScenario
import java.net.HttpURLConnection
import java.net.URL
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

// Port of scenarios/src/runner.ts. Same messages, endpoints, retry policy and sample semantics.
class PaintTiming(
    val end: Double? = null,
    val phases: Map<String, Double> = emptyMap(),
    val marks: Map<String, Double> = emptyMap(),
)

class BenchError(message: String) : Exception(message)

class RunStatus(
    var phase: String = "fetching",
    var caseIndex: Int = 0,
    var caseCount: Int = 0,
    var iteration: Int = 0,
    var label: String = "",
)

/** BenchAdapter from runner.ts. Callback based, so the runner can time a step out without leaking it. */
interface BenchAdapter {
    val app: String
    fun now(): Double
    fun info(): JSONObject
    fun mount(fixture: ScenarioFixture, done: (PaintTiming?) -> Unit)
    fun mutate(fixture: ScenarioFixture, mutation: String, done: (PaintTiming?) -> Unit)
    fun unmount(done: () -> Unit)
    fun align(done: () -> Unit)
    fun gc()
    fun diagnostics(): Map<String, Double>? = null
    fun log(message: String)
}

class Plan(json: JSONObject) {
    val protocol = json.getInt("protocol")
    val runId: String = json.getString("runId")
    val app: String = json.getString("app")
    val warmup = json.getInt("warmup")
    val iterations = json.getInt("iterations")
    val cooldownMs = json.getDouble("cooldownMs")
    val timeoutMs = json.getDouble("timeoutMs")
    val cases: List<Pair<String, String>> = json.getJSONArray("cases").let { a ->
        (0 until a.length()).map { a.getJSONObject(it).let { c -> c.getString("scenario") to c.getString("size") } }
    }
}

private val main = Handler(Looper.getMainLooper())

private fun jsNumber(v: Double): String = if (v == Math.floor(v) && Math.abs(v) < 1e15) v.toLong().toString() else v.toString()

/** String(e) for an Error in JS. */
private fun errorString(e: Throwable): String = "Error: ${e.message ?: e.javaClass.simpleName}"

/**
 * Runs one adapter step with the plan's timeout. The step reports through `done`; if it never does,
 * the coroutine fails with the runner.ts timeout message and a late `done` is ignored.
 */
private suspend fun <T> step(ms: Double, what: String, op: ((T) -> Unit) -> Unit): T =
    suspendCancellableCoroutine { cont ->
        var finished = false
        val timer = Runnable {
            if (!finished) {
                finished = true
                cont.resumeWithException(BenchError("timeout after ${jsNumber(ms)}ms: $what"))
            }
        }
        main.postDelayed(timer, ms.toLong())
        op { value ->
            if (!finished) {
                finished = true
                main.removeCallbacks(timer)
                cont.resume(value)
            }
        }
    }

private suspend fun getJson(url: String): JSONObject = withContext(Dispatchers.IO) {
    val c = URL(url).openConnection() as HttpURLConnection
    try {
        c.useCaches = false
        c.connectTimeout = 10_000
        c.readTimeout = 30_000
        val status = c.responseCode
        if (status !in 200..299) throw BenchError("GET $url → $status")
        JSONObject(c.inputStream.bufferedReader().readText())
    } finally {
        c.disconnect()
    }
}

private suspend fun postJson(url: String, body: JSONObject, attempts: Int = 4) {
    val payload = body.toString().toByteArray(Charsets.UTF_8)
    var i = 1
    while (true) {
        try {
            withContext(Dispatchers.IO) {
                val c = URL(url).openConnection() as HttpURLConnection
                try {
                    c.requestMethod = "POST"
                    c.doOutput = true
                    c.connectTimeout = 10_000
                    c.readTimeout = 30_000
                    c.setRequestProperty("Content-Type", "application/json")
                    c.setFixedLengthStreamingMode(payload.size)
                    c.outputStream.use { it.write(payload) }
                    val status = c.responseCode
                    if (status !in 200..299) throw BenchError("POST $url → $status")
                    c.inputStream.use { it.readBytes() }
                } finally {
                    c.disconnect()
                }
            }
            return
        } catch (e: Exception) {
            if (i >= attempts) throw e
            delay((500 * Math.pow(2.0, (i - 1).toDouble())).toLong())
            i++
        }
    }
}

private fun emit(adapter: BenchAdapter, kind: String, payload: JSONObject) {
    adapter.log("${LOG_PREFIX}_$kind $payload")
}

private fun seriesJson(m: Map<String, List<Double>>): JSONObject {
    val o = JSONObject()
    for ((k, v) in m) o.put(k, JSONArray().apply { v.forEach { put(it) } })
    return o
}

suspend fun runCase(adapter: BenchAdapter, plan: Plan, fixture: ScenarioFixture, onIteration: ((Int) -> Unit)? = null): JSONObject {
    val def = getScenario(fixture.scenario)!!
    val samples = LinkedHashMap<String, MutableList<Double>>()
    samples["mount"] = ArrayList()
    samples["unmount"] = ArrayList()
    for (m in def.mutations) samples[m] = ArrayList()
    val phases = LinkedHashMap<String, MutableList<Double>>()
    val label = "${fixture.scenario}/${fixture.size}"

    fun record(series: String, t0: Double, end: Double, timing: PaintTiming?, measured: Boolean) {
        if (!measured) return
        samples.getOrPut(series) { ArrayList() }.add(end - t0)
        if (timing == null) return
        for ((k, v) in timing.phases) phases.getOrPut("$series.$k") { ArrayList() }.add(v)
        for ((k, v) in timing.marks) phases.getOrPut("$series.$k") { ArrayList() }.add(v - t0)
    }

    suspend fun align() = step<Unit>(plan.timeoutMs, "$label align") { done -> adapter.align { done(Unit) } }

    val total = plan.warmup + plan.iterations
    for (i in 0 until total) {
        onIteration?.invoke(i)
        val measured = i >= plan.warmup

        align()
        var t0 = adapter.now()
        var timing = step<PaintTiming?>(plan.timeoutMs, "$label mount") { done -> adapter.mount(fixture, done) }
        record("mount", t0, timing?.end ?: adapter.now(), timing, measured)

        for (m in def.mutations) {
            align()
            t0 = adapter.now()
            timing = step(plan.timeoutMs, "$label $m") { done -> adapter.mutate(fixture, m, done) }
            record(m, t0, timing?.end ?: adapter.now(), timing, measured)
        }

        align()
        t0 = adapter.now()
        step<Unit>(plan.timeoutMs, "$label unmount") { done -> adapter.unmount { done(Unit) } }
        record("unmount", t0, adapter.now(), null, measured)

        adapter.gc()
        delay(plan.cooldownMs.toLong())
    }

    val result = JSONObject()
    result.put("runId", plan.runId)
    result.put("app", plan.app)
    result.put("scenario", fixture.scenario)
    result.put("size", fixture.size)
    result.put("fixtureHash", fixture.hash)
    result.put("samples", seriesJson(samples))
    if (phases.isNotEmpty()) result.put("phases", seriesJson(phases))
    return result
}

suspend fun runPlan(adapter: BenchAdapter, host: String, runId: String, onStatus: ((RunStatus) -> Unit)? = null) {
    val base = "http://$host"
    val started = adapter.now()
    val status = RunStatus()
    fun update(patch: RunStatus.() -> Unit = {}) {
        status.patch()
        onStatus?.invoke(status)
    }
    update()

    val plan: Plan
    try {
        plan = Plan(getJson("$base/plan?run=${encodeURIComponent(runId)}"))
        if (plan.protocol != PROTOCOL_VERSION) {
            throw BenchError("protocol mismatch: app $PROTOCOL_VERSION, harness ${plan.protocol}")
        }
        val info = adapter.info()
        info.put("runId", runId)
        info.put("app", adapter.app)
        info.put("startedAt", System.currentTimeMillis())
        postJson("$base/hello", info)
    } catch (e: Exception) {
        val msg = errorString(e)
        update { phase = "failed"; label = msg }
        emit(adapter, "ERROR", JSONObject().put("runId", runId).put("error", msg))
        return
    }

    var ok = true
    var lastError: String? = null
    update { phase = "running"; caseCount = plan.cases.size }
    for ((c, pc) in plan.cases.withIndex()) {
        val (scenario, size) = pc
        update { caseIndex = c; iteration = 0; label = "$scenario/$size" }
        var result: JSONObject
        try {
            val fixture = fixtureFor(scenario, size)
            result = runCase(adapter, plan, fixture) { i -> update { iteration = i } }
        } catch (e: Exception) {
            ok = false
            val msg = errorString(e)
            lastError = "$scenario/$size: $msg"
            result = JSONObject()
                .put("runId", runId).put("app", adapter.app).put("scenario", scenario).put("size", size)
                .put("fixtureHash", "").put("samples", JSONObject()).put("error", msg)
            try {
                step<Unit>(plan.timeoutMs, "unmount after error") { done -> adapter.unmount { done(Unit) } }
            } catch (_: Exception) {
            }
        }
        emit(adapter, "RESULT", result)
        try {
            postJson("$base/case", result)
        } catch (e: Exception) {
            emit(adapter, "ERROR", JSONObject().put("runId", runId).put("error", "post case: ${errorString(e)}"))
        }
    }

    var diagnostics: Map<String, Double>? = null
    try {
        diagnostics = adapter.diagnostics()
    } catch (e: Exception) {
        emit(adapter, "ERROR", JSONObject().put("runId", runId).put("error", "diagnostics: ${errorString(e)}"))
    }
    val done = JSONObject().put("runId", runId).put("app", adapter.app).put("ok", ok)
    if (lastError != null) done.put("error", lastError)
    done.put("durationMs", adapter.now() - started)
    if (diagnostics != null) done.put("diagnostics", JSONObject().apply { diagnostics.forEach { (k, v) -> put(k, v) } })
    update { phase = if (ok) "done" else "failed"; label = lastError ?: "done" }
    emit(adapter, "DONE", done)
    try {
        postJson("$base/done", done)
    } catch (e: Exception) {
        emit(adapter, "ERROR", JSONObject().put("runId", runId).put("error", "post done: ${errorString(e)}"))
    }
}
