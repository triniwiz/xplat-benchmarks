import Foundation

// Minimal JSON writer with ordered keys, so the output matches JSON.stringify byte for byte.
struct JsonWriter {
    private(set) var out = ""

    mutating func raw(_ s: String) { out += s }

    mutating func str(_ s: String) {
        out += "\""
        for u in s.unicodeScalars {
            switch u {
            case "\"": out += "\\\""
            case "\\": out += "\\\\"
            case "\n": out += "\\n"
            case "\r": out += "\\r"
            case "\t": out += "\\t"
            case "\u{08}": out += "\\b"
            case "\u{0C}": out += "\\f"
            default:
                if u.value < 0x20 {
                    let h = String(u.value, radix: 16)
                    out += "\\u" + String(repeating: "0", count: 4 - h.count) + h
                } else {
                    out.unicodeScalars.append(u)
                }
            }
        }
        out += "\""
    }

    mutating func num(_ n: Int) { out += String(n) }
    mutating func bool(_ b: Bool) { out += b ? "true" : "false" }

    mutating func key(_ k: String, first: Bool = false) {
        if !first { out += "," }
        str(k)
        out += ":"
    }

    mutating func strArray(_ items: [String]) {
        out += "["
        for (i, s) in items.enumerated() {
            if i > 0 { out += "," }
            str(s)
        }
        out += "]"
    }

    mutating func intArray(_ items: [Int]) {
        out += "["
        for (i, n) in items.enumerated() {
            if i > 0 { out += "," }
            num(n)
        }
        out += "]"
    }

    mutating func array<T>(_ items: [T], _ each: (inout JsonWriter, T) -> Void) {
        out += "["
        for (i, x) in items.enumerated() {
            if i > 0 { out += "," }
            each(&self, x)
        }
        out += "]"
    }
}
