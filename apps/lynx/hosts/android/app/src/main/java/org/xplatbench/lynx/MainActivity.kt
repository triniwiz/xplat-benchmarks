package org.xplatbench.lynx

import android.app.Activity
import android.os.Bundle
import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.lynx.tasm.LynxView
import com.lynx.tasm.LynxViewBuilder

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lynxView: LynxView = LynxViewBuilder()
            .setTemplateProvider(AssetTemplateProvider(this))
            .setFontScale(1f)
            .build(this)

        val root = FrameLayout(this)
        root.addView(lynxView, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            WindowInsetsCompat.CONSUMED
        }
        setContentView(root)

        lynxView.setGlobalProps(
            mapOf<String, Any>(
                "launchUrl" to (intent?.dataString ?: ""),
                "lynxSdk" to BuildConfig.LYNX_VERSION,
                "platform" to "android",
                "osVersion" to android.os.Build.VERSION.RELEASE,
                "deviceModel" to "${android.os.Build.MANUFACTURER} ${android.os.Build.MODEL}",
            ),
        )
        lynxView.renderTemplateUrl("main.lynx.bundle", "")
    }
}
