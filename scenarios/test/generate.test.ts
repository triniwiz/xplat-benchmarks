import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fixtureFor, type TreeData } from '../src/generate';
import { parseLaunchUrl, runUrl, showUrl } from '../src/protocol';
import { SCENARIOS, SIZES } from '../src/scenarios';

const manifest = JSON.parse(readFileSync(new URL('../fixtures/manifest.json', import.meta.url), 'utf8'));

test('fixtures are deterministic and match the committed manifest', () => {
  for (const def of SCENARIOS) {
    for (const size of SIZES) {
      const a = fixtureFor(def.id, size);
      const b = fixtureFor(def.id, size);
      assert.equal(a.hash, b.hash, `${def.id}/${size} not deterministic`);
      assert.equal(a.hash, manifest[`${def.id}/${size}`].hash, `${def.id}/${size} drifted from manifest`);
    }
  }
});

test('relayout scenarios share data with the mount scenario they reuse', () => {
  assert.equal(fixtureFor('relayout-resize', 'M').hash, fixtureFor('tree-fanout', 'M').hash);
  assert.equal(fixtureFor('insert-remove', 'L').hash, fixtureFor('flex-wrap-tiles', 'L').hash);
});

test('tree-fanout node counts', () => {
  const counts = SIZES.map((s) => (fixtureFor('tree-fanout', s).data as TreeData).nodeCount);
  assert.deepEqual(counts, [364, 1093, 3280]);
});

test('launch URLs round-trip', () => {
  assert.deepEqual(parseLaunchUrl(runUrl('192.168.1.4:9797', 'r1-ns-core-abc')), {
    mode: 'run',
    host: '192.168.1.4:9797',
    runId: 'r1-ns-core-abc',
  });
  assert.deepEqual(parseLaunchUrl(showUrl('grid-dashboard', 'S')), { mode: 'show', scenario: 'grid-dashboard', size: 'S' });
  assert.equal(parseLaunchUrl('xplatbench://show?scenario=nope'), null);
  assert.equal(parseLaunchUrl('https://example.com'), null);
  assert.deepEqual(parseLaunchUrl('xplatbench-ns-core-mason://show?scenario=text-flow&size=L'), {
    mode: 'show',
    scenario: 'text-flow',
    size: 'L',
  });
  assert.equal(parseLaunchUrl(undefined), null);
});
