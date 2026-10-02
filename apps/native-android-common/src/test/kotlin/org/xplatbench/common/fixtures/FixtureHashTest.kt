package org.xplatbench.common.fixtures

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.xplatbench.common.bench.LaunchCommand
import org.xplatbench.common.bench.parseLaunchUrl
import java.io.File

/** Every scenario/size hash must equal scenarios/fixtures/manifest.json (the TS generator's output). */
class FixtureHashTest {
    private val manifest: Map<String, String> by lazy {
        val path = System.getProperty("xplatbench.manifest") ?: "../../../scenarios/fixtures/manifest.json"
        val text = File(path).readText()
        val re = Regex("\"([a-z-]+/[SML])\"\\s*:\\s*\\{.*?\"hash\"\\s*:\\s*\"([0-9a-f]+)\"", RegexOption.DOT_MATCHES_ALL)
        re.findAll(text).associate { it.groupValues[1] to it.groupValues[2] }
    }

    @Test
    fun hashesMatchManifest() {
        var checked = 0
        val mismatches = ArrayList<String>()
        for (sc in SCENARIOS) {
            for (size in SIZES) {
                val key = "${sc.id}/$size"
                val expected = manifest[key] ?: error("$key missing from manifest")
                val actual = fixtureFor(sc.id, size).hash
                if (actual != expected) mismatches.add("$key: expected $expected, got $actual")
                checked++
            }
        }
        assertEquals("hash mismatches:\n${mismatches.joinToString("\n")}", 0, mismatches.size)
        assertEquals(SCENARIOS.size * SIZES.size, checked)
        assertEquals(manifest.size, checked)
        println("FixtureHashTest: $checked scenario/size hashes match manifest.json")
    }

    @Test
    fun parsesLaunchUrls() {
        val run = parseLaunchUrl("xplatbench://run?host=127.0.0.1%3A9797&run=r1-native-android-abc")
        assertTrue(run is LaunchCommand.Run)
        run as LaunchCommand.Run
        assertEquals("127.0.0.1:9797", run.host)
        assertEquals("r1-native-android-abc", run.runId)
        val show = parseLaunchUrl("xplatbench-native-android://show?scenario=grid-dashboard&size=S")
        assertTrue(show is LaunchCommand.Show)
        assertEquals("S", (show as LaunchCommand.Show).size)
        assertEquals(null, parseLaunchUrl("xplatbench://show?scenario=nope"))
        assertEquals("M", (parseLaunchUrl("xplatbench://show?scenario=text-flow") as LaunchCommand.Show).size)
    }
}
