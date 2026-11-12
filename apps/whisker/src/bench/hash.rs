pub fn fnv1a(input: &str) -> u32 {
    input.encode_utf16().fold(0x811c9dc5u32, |h, unit| (h ^ unit as u32).wrapping_mul(0x01000193))
}

pub fn hash_json(json: &str) -> String {
    format!("{:08x}", fnv1a(json))
}
