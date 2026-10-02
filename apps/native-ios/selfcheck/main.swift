import Foundation

// macOS self-check: prints "<scenario>/<size> <hash>" for every case, to diff against scenarios/fixtures/manifest.json.
for def in SCENARIOS {
    for size in SIZES {
        let f = try fixtureFor(def.id, size)
        print("\(def.id)/\(size) \(f.hash)")
    }
}
