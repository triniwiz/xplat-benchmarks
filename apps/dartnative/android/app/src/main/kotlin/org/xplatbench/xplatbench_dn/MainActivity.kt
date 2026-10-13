package org.xplatbench.xplatbench_dn

import android.os.Build
import android.os.Bundle
import android.system.Os
import com.dartnative.runtime.DartNativeActivity

class MainActivity : DartNativeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        intent?.dataString?.let { Os.setenv("XPLATBENCH_URL", it, true) }
        Os.setenv("XPLATBENCH_DEVICE", "${Build.MANUFACTURER} ${Build.MODEL}", true)
        super.onCreate(savedInstanceState)
    }
}
