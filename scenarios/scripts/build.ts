import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixtureFor } from '../src/generate';
import { SCENARIOS, SIZES } from '../src/scenarios';
import { referenceCss } from './css';
import { countElements, page, renderFixture } from './html';

// Writes scenarios/fixtures/*.json, fixtures/manifest.json (hashes every app
// must reproduce) and the browser reference under scenarios/reference/.
//   --check  regenerate in memory and fail if manifest.json would change.

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixturesDir = join(root, 'fixtures');
const referenceDir = join(root, 'reference');
const manifestPath = join(fixturesDir, 'manifest.json');
const check = process.argv.includes('--check');

interface ManifestEntry {
  fixture: string;
  params: Record<string, number>;
  hash: string;
  elements: number;
}

const manifest: Record<string, ManifestEntry> = {};
const links: string[] = [];

mkdirSync(fixturesDir, { recursive: true });
mkdirSync(referenceDir, { recursive: true });

for (const def of SCENARIOS) {
  for (const size of SIZES) {
    const f = fixtureFor(def.id, size);
    const html = renderFixture(f.fixture, f.data as never);
    const key = `${def.id}/${size}`;
    manifest[key] = { fixture: f.fixture, params: f.params, hash: f.hash, elements: countElements(html) };
    if (check) continue;
    if (def.fixture === def.id) {
      writeFileSync(join(fixturesDir, `${def.id}.${size}.json`), JSON.stringify(f.data));
      writeFileSync(join(referenceDir, `${def.id}.${size}.html`), page(`${def.title} ${size}`, html));
      links.push(`<li><a href="${def.id}.${size}.html">${def.title} — ${size}</a> (${manifest[key].elements} elements)</li>`);
    }
  }
}

const serialized = JSON.stringify(manifest, null, 2) + '\n';

if (check) {
  let current = '';
  try {
    current = readFileSync(manifestPath, 'utf8');
  } catch {
    // no manifest yet
  }
  if (current !== serialized) {
    console.error('fixtures/manifest.json is out of date or the generator is non-deterministic. Run `npm run fixtures`.');
    process.exit(1);
  }
  console.log(`manifest OK (${Object.keys(manifest).length} cases)`);
} else {
  writeFileSync(manifestPath, serialized);
  writeFileSync(join(referenceDir, 'styles.css'), referenceCss());
  writeFileSync(
    join(referenceDir, 'index.html'),
    `<!doctype html><meta charset="utf-8"><title>xplat-benchmarks reference</title><ul>${links.join('')}</ul>\n`,
  );
  console.log(`wrote ${Object.keys(manifest).length} manifest entries, ${links.length} reference pages`);
}
