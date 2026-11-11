package org.xplatbench.nsh

import android.app.Activity
import android.os.Build
import android.os.Bundle
import com.longbridge.nsh.NshView

class MainActivity : Activity() {
    private lateinit var nsh: NshView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        nsh = NshView(this)
        // Embedded apps get a 2 s budget per JS call by default; a large mount is one call.
        // nsh's own standalone activity runs without limits, so match it as closely as the public API allows.
        nsh.setLimits(0, 0, 60_000, 60_000, 1_000_000)
        nsh.setGrantedCapabilities("""{"network":{"hosts":["127.0.0.1"]}}""")
        nsh.setFontScale(1f)
        nsh.setParams(
            mapOf(
                "launchUrl" to (intent?.dataString ?: ""),
                "osVersion" to Build.VERSION.RELEASE,
                "deviceModel" to "${Build.MANUFACTURER} ${Build.MODEL}",
                "nshVersion" to assets.open("nsh-version.txt").bufferedReader().use { it.readText() },
            ),
        )
        setContentView(nsh)
        nsh.loadAssetBundle("nsh")
    }

    override fun onDestroy() {
        nsh.destroy()
        super.onDestroy()
    }
}
