import Foundation

// Port of scenarios/src/prng.ts (mulberry32). Must stay bit-identical.
final class Rng {
    private var state: UInt32

    init(seed: UInt32) { state = seed }

    func next() -> Double {
        state = state &+ 0x6d2b79f5
        var t = state
        t = (t ^ (t >> 15)) &* (t | 1)
        t ^= t &+ ((t ^ (t >> 7)) &* (t | 61))
        return Double(t ^ (t >> 14)) / 4294967296.0
    }

    func int(_ min: Int, _ max: Int) -> Int {
        min + Int((next() * Double(max - min + 1)).rounded(.down))
    }

    func pick<T>(_ items: [T]) -> T {
        items[Int((next() * Double(items.count)).rounded(.down))]
    }

    func chance(_ p: Double) -> Bool { next() < p }
}
