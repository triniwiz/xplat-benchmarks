import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SCENARIOS_SRC = join(ROOT, 'scenarios', 'src');
export const RESULTS_DIR = join(ROOT, 'results');
export const MANIFEST = join(ROOT, 'scenarios', 'fixtures', 'manifest.json');
