import Foundation

// Port of scenarios/src/hash.ts: FNV-1a over UTF-16 code units of JSON.stringify(data).
func fnv1a(_ input: String) -> UInt32 {
    var h: UInt32 = 0x811c9dc5
    for u in input.utf16 {
        h ^= UInt32(u)
        h = h &* 0x01000193
    }
    return h
}

func hashHex(_ json: String) -> String {
    let s = String(fnv1a(json), radix: 16)
    return String(repeating: "0", count: max(0, 8 - s.count)) + s
}
