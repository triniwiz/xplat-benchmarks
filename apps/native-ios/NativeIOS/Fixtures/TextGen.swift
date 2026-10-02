import Foundation

// Port of scenarios/src/text.ts.
private let WORDS: [String] = [
    "layout", "native", "render", "frame", "measure", "flex", "grid", "view",
    "style", "border", "shadow", "radius", "gradient", "column", "row", "wrap",
    "align", "justify", "content", "baseline", "stretch", "center", "padding",
    "margin", "inset", "track", "span", "area", "template", "auto", "fill",
    "basis", "grow", "shrink", "order", "gap", "overflow", "clip", "scroll",
    "opacity", "transform", "rotate", "scale", "translate", "font", "weight",
    "line", "height", "letter", "spacing", "ellipsis", "text", "image", "cover",
    "contain", "aspect", "ratio", "minimum", "maximum", "percent", "pixel",
    "device", "density", "thread",
]

enum TextGen {
    static func words(_ rng: Rng, _ count: Int) -> String {
        var out: [String] = []
        out.reserveCapacity(count)
        for _ in 0..<max(0, count) { out.append(rng.pick(WORDS)) }
        return out.joined(separator: " ")
    }

    static func title(_ rng: Rng, _ min: Int = 2, _ max: Int = 4) -> String {
        let w = words(rng, rng.int(min, max))
        guard let first = w.first else { return w }
        return first.uppercased() + w.dropFirst()
    }

    static func sentence(_ rng: Rng, _ min: Int, _ max: Int) -> String {
        title(rng, min, max) + "."
    }

    static func paragraph(_ rng: Rng, _ minWords: Int, _ maxWords: Int) -> String {
        let target = rng.int(minWords, maxWords)
        var parts: [String] = []
        var count = 0
        while count < target {
            let n = Swift.min(rng.int(4, 12), target - count)
            parts.append(sentence(rng, n, n))
            count += n
        }
        return parts.joined(separator: " ")
    }
}
