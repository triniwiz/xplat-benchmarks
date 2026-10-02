import Foundation

// Port of scenarios/src/tokens.ts (hex strings; UIColor conversion lives in UI/Styles.swift).
enum Tokens {
    static let bg = "#F5F6FA"
    static let surface = "#FFFFFF"
    static let border = "#D0D4E0"
    static let text = "#1F2330"
    static let muted = "#6B7185"
    static let accent = "#3B5BDB"
    static let positive = "#2F9E44"
    static let negative = "#E03131"

    static let palette = [
        "#E03131", "#F08C00", "#2F9E44", "#1098AD",
        "#1C7ED6", "#7048E8", "#C2255C", "#5C940D",
    ]
    static let paletteLight = [
        "#FFE3E3", "#FFF3BF", "#D3F9D8", "#C5F6FA",
        "#D0EBFF", "#E5DBFF", "#FFDEEB", "#E9FAC8",
    ]
    static let fontSizes: [Int] = [12, 14, 16, 20]
}
