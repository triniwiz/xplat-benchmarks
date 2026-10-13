import 'package:dartnative/dartnative.dart';

const bg = Color(0xFFF5F6FA);
const surface = Color(0xFFFFFFFF);
const borderColor = Color(0xFFD0D4E0);
const textColor = Color(0xFF1F2330);
const muted = Color(0xFF6B7185);
const accent = Color(0xFF3B5BDB);
const positive = Color(0xFF2F9E44);
const negative = Color(0xFFE03131);
const white = Color(0xFFFFFFFF);

const palette = [
  Color(0xFFE03131), Color(0xFFF08C00), Color(0xFF2F9E44), Color(0xFF1098AD),
  Color(0xFF1C7ED6), Color(0xFF7048E8), Color(0xFFC2255C), Color(0xFF5C940D),
];

const paletteLight = [
  Color(0xFFFFE3E3), Color(0xFFFFF3BF), Color(0xFFD3F9D8), Color(0xFFC5F6FA),
  Color(0xFFD0EBFF), Color(0xFFE5DBFF), Color(0xFFFFDEEB), Color(0xFFE9FAC8),
];

const fontSizes = [12.0, 14.0, 16.0, 20.0];

double lineHeight(double size) => (size * 1.4).roundToDouble();

TextStyle ts(double size, Color color, {bool bold = false, double? lh, double? spacing}) => TextStyle(
      fontSize: size,
      color: color,
      fontWeight: bold ? FontWeight.bold : null,
      height: lh == null ? null : lh / size,
      letterSpacing: spacing,
    );
