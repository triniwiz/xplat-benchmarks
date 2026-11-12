use super::prng::Rng;

const WORDS: [&str; 64] = [
    "layout", "native", "render", "frame", "measure", "flex", "grid", "view", "style", "border",
    "shadow", "radius", "gradient", "column", "row", "wrap", "align", "justify", "content",
    "baseline", "stretch", "center", "padding", "margin", "inset", "track", "span", "area",
    "template", "auto", "fill", "basis", "grow", "shrink", "order", "gap", "overflow", "clip",
    "scroll", "opacity", "transform", "rotate", "scale", "translate", "font", "weight", "line",
    "height", "letter", "spacing", "ellipsis", "text", "image", "cover", "contain", "aspect",
    "ratio", "minimum", "maximum", "percent", "pixel", "device", "density", "thread",
];

pub fn words(rng: &mut Rng, count: u32) -> String {
    let picked: Vec<&str> = (0..count).map(|_| *rng.pick(&WORDS)).collect();
    picked.join(" ")
}

pub fn title(rng: &mut Rng, min: u32, max: u32) -> String {
    let count = rng.int(min, max);
    let mut w = words(rng, count);
    if let Some(first) = w.get_mut(0..1) {
        first.make_ascii_uppercase();
    }
    w
}

pub fn sentence(rng: &mut Rng, min: u32, max: u32) -> String {
    title(rng, min, max) + "."
}

pub fn paragraph(rng: &mut Rng, min_words: u32, max_words: u32) -> String {
    let target = rng.int(min_words, max_words);
    let mut parts = Vec::new();
    let mut count = 0;
    while count < target {
        let n = rng.int(4, 12).min(target - count);
        parts.push(sentence(rng, n, n));
        count += n;
    }
    parts.join(" ")
}
