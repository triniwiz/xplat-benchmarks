const _mask = 0xFFFFFFFF;

int imul(int a, int b) => (a * b) & _mask;

class Rng {
  Rng(int seed) : _state = seed & _mask;

  int _state;

  double next() {
    _state = (_state + 0x6d2b79f5) & _mask;
    var t = _state;
    t = imul(t ^ (t >> 15), t | 1);
    t = (t ^ ((t + imul(t ^ (t >> 7), t | 61)) & _mask)) & _mask;
    return (t ^ (t >> 14)) / 4294967296;
  }

  int integer(int min, int max) => min + (next() * (max - min + 1)).floor();

  T pick<T>(List<T> items) => items[(next() * items.length).floor()];

  bool chance(double p) => next() < p;
}
