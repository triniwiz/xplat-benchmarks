package org.xplatbench.common.fixtures

// Port of scenarios/src/hash.ts: FNV-1a over the UTF-16 code units of JSON.stringify(data).
fun fnv1a(input: String): Int {
    var h = 0x811c9dc5.toInt()
    for (c in input) {
        h = h xor c.code
        h *= 0x01000193
    }
    return h
}

fun hashHex(json: String): String = (fnv1a(json).toLong() and 0xffffffffL).toString(16).padStart(8, '0')
