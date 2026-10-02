import SwiftUI

/// list-scroll: the one virtualized scenario. A ScrollView with a LazyVStack (rows are built as
/// they come on screen). The sentinel sits behind the scroll view, so the `layout` mark is the list
/// container's layout, with the first screen of rows built in the same SwiftUI update.
struct ListScenarioView: View {
    let items: [ListItem]
    let probe: LayoutProbe

    var body: some View {
        ScrollView(.vertical) {
            LazyVStack(spacing: 0) {
                ForEach(items, id: \.id) { ListRowView(item: $0) }
            }
        }
        .background(C.bg)
        .background(alignment: .top) { Sentinel(probe: probe) }
    }
}

struct ListRowView: View {
    let item: ListItem

    private var side: CGFloat { item.type == "b" ? 56 : 32 }

    private var visual: some View {
        RoundedRectangle(cornerRadius: item.type == "b" ? 8 : 16).fill(C.palette[item.color])
            .frame(width: side, height: side)
    }

    private var meta: some View {
        Text(item.meta).font(F.regular(12)).foregroundColor(C.muted).fixedSize()
    }

    private var titles: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(item.title).font(F.bold(14)).foregroundColor(C.text).fixedSize(horizontal: false, vertical: true)
            Text(item.subtitle).font(F.regular(12)).foregroundColor(C.muted).fixedSize(horizontal: false, vertical: true)
            if item.type == "b" { badges.padding(.top, 4) }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    /// Up to three badges (font 10, padding 2/6, radius 4), then the free space.
    private var badges: some View {
        HStack(spacing: 4) {
            ForEach(Array(item.badges.prefix(3).enumerated()), id: \.offset) { _, b in
                Text(b).font(F.regular(10)).foregroundColor(C.text).lineLimit(1)
                    .padding(EdgeInsets(top: 2, leading: 6, bottom: 2, trailing: 6))
                    .background(C.paletteLight[item.color], in: RoundedRectangle(cornerRadius: 4))
            }
            Spacer(minLength: 0)
        }
    }

    private var head: some View {
        HStack(spacing: 0) {
            visual
            titles.padding(.leading, 12)
            meta.padding(.leading, 8)
        }
    }

    var body: some View {
        if item.type != "c" {
            // padding 12/16 + the 1pt bottom border
            head
                .padding(EdgeInsets(top: 12, leading: 16, bottom: 13, trailing: 16))
                .background(C.surface)
                .overlay(alignment: .bottom) { C.border.frame(height: 1) }
        } else {
            // card: padding 12 + border 1, radius 12, inset 8/12 in the row
            VStack(alignment: .leading, spacing: 0) {
                head
                Text(item.body).font(F.regular(14)).foregroundColor(C.text)
                    .fixedLineHeight(20, size: 14)
                    .fixedSize(horizontal: false, vertical: true)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, 8)
                badges.padding(.top, 4)
            }
            .padding(13)
            .background(C.surface, in: RoundedRectangle(cornerRadius: 12))
            .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(C.border, lineWidth: 1))
            .padding(EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12))
        }
    }
}
