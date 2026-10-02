package org.xplatbench.common.fixtures

// Minimal JSON writer with ordered keys, so the output matches JSON.stringify byte for byte.
class JsonWriter {
    val out = StringBuilder()

    fun raw(s: String) {
        out.append(s)
    }

    fun str(s: String) {
        out.append('"')
        for (c in s) {
            when (c) {
                '"' -> out.append("\\\"")
                '\\' -> out.append("\\\\")
                '\n' -> out.append("\\n")
                '\r' -> out.append("\\r")
                '\t' -> out.append("\\t")
                '\b' -> out.append("\\b")
                '\u000C' -> out.append("\\f")
                else -> if (c.code < 0x20) out.append("\\u").append(c.code.toString(16).padStart(4, '0')) else out.append(c)
            }
        }
        out.append('"')
    }

    fun num(n: Int) {
        out.append(n)
    }

    fun bool(b: Boolean) {
        out.append(if (b) "true" else "false")
    }

    fun key(k: String, first: Boolean = false) {
        if (!first) out.append(',')
        str(k)
        out.append(':')
    }

    fun strArray(items: List<String>) = array(items) { str(it) }

    fun intArray(items: List<Int>) = array(items) { num(it) }

    inline fun <T> array(items: List<T>, each: JsonWriter.(T) -> Unit) {
        out.append('[')
        for ((i, x) in items.withIndex()) {
            if (i > 0) out.append(',')
            each(x)
        }
        out.append(']')
    }

    inline fun obj(body: JsonWriter.() -> Unit) {
        out.append('{')
        body()
        out.append('}')
    }

    override fun toString(): String = out.toString()
}
