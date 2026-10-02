package org.xplatbench.common.bench

import org.xplatbench.common.fixtures.SIZES
import org.xplatbench.common.fixtures.getScenario
import java.io.ByteArrayOutputStream

// Port of scenarios/src/protocol.ts (the parts the app needs).
const val PROTOCOL_VERSION = 1
const val LOG_PREFIX = "XPLATBENCH"

sealed class LaunchCommand {
    data class Run(val host: String, val runId: String) : LaunchCommand()
    data class Show(val scenario: String, val size: String) : LaunchCommand()
}

private val LAUNCH_RE = Regex("^xplatbench(?:-[a-z0-9-]+)?://([a-z]+)/?(?:\\?(.*))?$")

fun parseLaunchUrl(url: String?): LaunchCommand? {
    val m = LAUNCH_RE.find(url?.trim() ?: return null) ?: return null
    val query = HashMap<String, String>()
    for (pair in m.groupValues[2].split('&')) {
        if (pair.isEmpty()) continue
        val i = pair.indexOf('=')
        val k = decodeURIComponent(if (i < 0) pair else pair.substring(0, i))
        query[k] = if (i < 0) "" else decodeURIComponent(pair.substring(i + 1))
    }
    val host = query["host"]
    val run = query["run"]
    if (m.groupValues[1] == "run" && !host.isNullOrEmpty() && !run.isNullOrEmpty()) return LaunchCommand.Run(host, run)
    val scenario = query["scenario"]
    if (m.groupValues[1] == "show" && !scenario.isNullOrEmpty() && getScenario(scenario) != null) {
        val size = query["size"] ?: "M"
        if (size in SIZES) return LaunchCommand.Show(scenario, size)
    }
    return null
}

/** decodeURIComponent: %XX UTF-8 sequences only ('+' stays '+', unlike URLDecoder). */
fun decodeURIComponent(s: String): String {
    if ('%' !in s) return s
    val out = StringBuilder()
    val bytes = ByteArrayOutputStream()
    var i = 0
    while (i < s.length) {
        val c = s[i]
        if (c == '%' && i + 2 < s.length) {
            val v = s.substring(i + 1, i + 3).toIntOrNull(16)
            if (v != null) {
                bytes.write(v)
                i += 3
                continue
            }
        }
        if (bytes.size() > 0) {
            out.append(bytes.toString("UTF-8"))
            bytes.reset()
        }
        out.append(c)
        i++
    }
    if (bytes.size() > 0) out.append(bytes.toString("UTF-8"))
    return out.toString()
}

/** encodeURIComponent for the run id in the plan URL. */
fun encodeURIComponent(s: String): String {
    val keep = "-_.!~*'()"
    val out = StringBuilder()
    for (b in s.toByteArray(Charsets.UTF_8)) {
        val c = b.toInt() and 0xff
        val ch = c.toChar()
        if (c < 0x80 && (ch.isLetterOrDigit() || ch in keep)) out.append(ch)
        else out.append('%').append(c.toString(16).uppercase().padStart(2, '0'))
    }
    return out.toString()
}
