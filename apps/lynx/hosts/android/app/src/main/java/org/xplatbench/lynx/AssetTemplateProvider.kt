package org.xplatbench.lynx

import android.content.Context
import com.lynx.tasm.provider.AbsTemplateProvider
import java.io.IOException

class AssetTemplateProvider(context: Context) : AbsTemplateProvider() {
    private val context = context.applicationContext

    override fun loadTemplate(uri: String, callback: Callback) {
        Thread {
            try {
                callback.onSuccess(context.assets.open(uri).use { it.readBytes() })
            } catch (e: IOException) {
                callback.onFailed(e.message)
            }
        }.start()
    }
}
