package org.xplatbench.common.fixtures

import kotlin.math.floor

// Port of scenarios/src/prng.ts (mulberry32). Int arithmetic wraps like Math.imul / `>>> 0`.
class Rng(seed: Int) {
    private var state = seed

    fun next(): Double {
        state += 0x6d2b79f5
        var t = state
        t = (t xor (t ushr 15)) * (t or 1)
        t = t xor (t + (t xor (t ushr 7)) * (t or 61))
        return ((t xor (t ushr 14)).toLong() and 0xffffffffL).toDouble() / 4294967296.0
    }

    fun int(min: Int, max: Int): Int = min + floor(next() * (max - min + 1)).toInt()

    fun <T> pick(items: List<T>): T = items[floor(next() * items.size).toInt()]

    fun chance(p: Double): Boolean = next() < p
}
