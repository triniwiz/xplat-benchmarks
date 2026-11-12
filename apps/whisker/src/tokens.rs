use whisker::css::Color;

pub const BG: Color = Color::hex(0xF5F6FA);
pub const SURFACE: Color = Color::hex(0xFFFFFF);
pub const BORDER: Color = Color::hex(0xD0D4E0);
pub const TEXT: Color = Color::hex(0x1F2330);
pub const MUTED: Color = Color::hex(0x6B7185);
pub const ACCENT: Color = Color::hex(0x3B5BDB);
pub const POSITIVE: Color = Color::hex(0x2F9E44);
pub const NEGATIVE: Color = Color::hex(0xE03131);
pub const WHITE: Color = Color::hex(0xFFFFFF);

const PALETTE: [u32; 8] = [0xE03131, 0xF08C00, 0x2F9E44, 0x1098AD, 0x1C7ED6, 0x7048E8, 0xC2255C, 0x5C940D];
const PALETTE_LIGHT: [u32; 8] = [0xFFE3E3, 0xFFF3BF, 0xD3F9D8, 0xC5F6FA, 0xD0EBFF, 0xE5DBFF, 0xFFDEEB, 0xE9FAC8];

pub const FONT_SIZES: [f32; 4] = [12.0, 14.0, 16.0, 20.0];

pub fn palette(i: u32) -> Color {
    Color::hex(PALETTE[i as usize % 8])
}

pub fn palette_light(i: u32) -> Color {
    Color::hex(PALETTE_LIGHT[i as usize % 8])
}

pub fn line_height(font_size: f32) -> f32 {
    (font_size * 1.4).round()
}
