package org.xplatbench.lynx

import android.app.Application
import com.lynx.service.http.LynxHttpService
import com.lynx.service.log.LynxLogService
import com.lynx.tasm.LynxEnv
import com.lynx.tasm.service.LynxServiceCenter

class BenchApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Log for console output; HTTP backs fetch() (plans and results go to the harness).
        LynxServiceCenter.inst().registerService(LynxLogService)
        LynxServiceCenter.inst().registerService(LynxHttpService)
        LynxEnv.inst().init(this, null, null, null)
    }
}
