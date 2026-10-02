package org.xplatbench.common.android

import android.view.Choreographer
import android.view.View

/** requestAnimationFrame for Android: the callback runs in the next Choreographer frame (animation phase). */
object FrameClock {
    private val choreographer: Choreographer by lazy { Choreographer.getInstance() }

    fun next(cb: () -> Unit) {
        choreographer.postFrameCallback { cb() }
    }

    fun frames(n: Int, cb: () -> Unit) {
        if (n <= 0) return cb()
        next { frames(n - 1, cb) }
    }
}

/** Monotonic ms clock shared by t0 and every mark. */
fun nowMs(): Double = System.nanoTime() / 1e6

/**
 * "Painted": the sentinel's OnLayoutChangeListener records the `layout` mark (the sentinel is the
 * last child of the scenario root, so everything before it has been laid out in this pass); the
 * next Choreographer frame ends the sample. Every mutation in the suite moves or resizes the
 * sentinel, so its layout callback always runs.
 */
class PaintWatch(private val sentinel: View, private val done: (layout: Double, end: Double) -> Unit) :
    View.OnLayoutChangeListener {
    private var fired = false

    init {
        sentinel.addOnLayoutChangeListener(this)
    }

    override fun onLayoutChange(v: View, l: Int, t: Int, r: Int, b: Int, ol: Int, ot: Int, or: Int, ob: Int) {
        if (fired) return
        fired = true
        val layout = nowMs()
        sentinel.removeOnLayoutChangeListener(this)
        FrameClock.next { done(layout, nowMs()) }
    }

    fun cancel() {
        fired = true
        sentinel.removeOnLayoutChangeListener(this)
    }
}
