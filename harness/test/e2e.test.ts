import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PROTOCOL_VERSION, type Plan } from '../../scenarios/src/protocol';
import { runPlan, type BenchAdapter } from '../../scenarios/src/runner';
import { startServer } from '../src/server';
import { summarize } from '../src/stats';

// Drives the real runner against the real server over HTTP with a fake app.
test('runner ↔ server protocol end to end', async () => {
  const server = await startServer(0);
  const plan: Plan = {
    protocol: PROTOCOL_VERSION,
    runId: 'test-run',
    app: 'ns-core',
    warmup: 1,
    iterations: 3,
    cooldownMs: 0,
    timeoutMs: 1000,
    cases: [
      { scenario: 'nested-chain', size: 'S' },
      { scenario: 'relayout-resize', size: 'S' },
      { scenario: 'insert-remove', size: 'S' },
    ],
  };
  const calls: string[] = [];
  let clock = 0;
  const adapter: BenchAdapter = {
    app: 'ns-core',
    now: () => clock,
    info: () => ({ platform: 'android', framework: { fake: '1.0.0' } }),
    async mount(f) {
      calls.push(`mount ${f.scenario}`);
      clock += 10;
    },
    async mutate(_f, m) {
      calls.push(`mutate ${m}`);
      clock += 5;
      // Engine-reported end time and phase, as the Lynx adapter does.
      return m === 'grow' ? { end: clock - 1, phases: { layout: 2 }, marks: { laid: clock - 3 } } : undefined;
    },
    async unmount() {
      clock += 1;
    },
    log: () => {},
  };

  const finished = server.addRun(plan, { timeoutMs: 5000 });
  await runPlan(adapter, `127.0.0.1:${server.port}`, plan.runId);
  const record = await finished;
  await server.close();

  assert.equal(record.timedOut, undefined);
  assert.equal(record.done?.ok, true);
  assert.equal(record.info?.framework.fake, '1.0.0');
  assert.equal(record.cases.length, 3);

  const [chain, resize, insert] = record.cases;
  assert.deepEqual(chain.samples.mount, [10, 10, 10]);
  assert.deepEqual(Object.keys(resize.samples).sort(), ['grow', 'mount', 'shrink', 'unmount']);
  assert.deepEqual(resize.samples.grow, [4, 4, 4]);
  assert.deepEqual(resize.phases?.['grow.layout'], [2, 2, 2]);
  assert.deepEqual(resize.phases?.['grow.laid'], [2, 2, 2]);
  assert.deepEqual(insert.samples.insert, [5, 5, 5]);
  // warmup + iterations mounts per case
  assert.equal(calls.filter((c) => c === 'mount nested-chain').length, 4);
});

test('unknown run is rejected and failures are reported, not thrown', async () => {
  const server = await startServer(0);
  const adapter: BenchAdapter = {
    app: 'lynx',
    now: () => 0,
    info: () => ({ platform: 'ios', framework: {} }),
    mount: () => Promise.reject(new Error('boom')),
    mutate: async () => {},
    unmount: async () => {},
    log: () => {},
  };
  // No plan registered: runner must return without throwing.
  await runPlan(adapter, `127.0.0.1:${server.port}`, 'missing');

  const plan: Plan = {
    protocol: PROTOCOL_VERSION, runId: 'fail-run', app: 'lynx', warmup: 0, iterations: 1,
    cooldownMs: 0, timeoutMs: 1000, cases: [{ scenario: 'text-flow', size: 'S' }],
  };
  const finished = server.addRun(plan, { timeoutMs: 5000 });
  await runPlan(adapter, `127.0.0.1:${server.port}`, plan.runId);
  const record = await finished;
  await server.close();
  assert.equal(record.done?.ok, false);
  assert.match(record.cases[0].error ?? '', /boom/);
});

test('stats', () => {
  const s = summarize([5, 1, 4, 2, 3]);
  assert.equal(s.median, 3);
  assert.equal(s.min, 1);
  assert.equal(s.max, 5);
  assert.equal(s.mad, 1);
  assert.ok(Math.abs(s.p90 - 4.6) < 1e-9);
});

test('a run with no requests from the app is given up after the idle timeout', async () => {
  const server = await startServer(0);
  const plan: Plan = {
    protocol: PROTOCOL_VERSION, runId: 'idle-run', app: 'ns-core', warmup: 0, iterations: 1,
    cooldownMs: 0, timeoutMs: 1000, cases: [{ scenario: 'text-flow', size: 'S' }],
  };
  const t0 = Date.now();
  const record = await server.addRun(plan, { timeoutMs: 60_000, idleTimeoutMs: 1 });
  await server.close();
  assert.equal(record.timedOut, true);
  assert.ok(Date.now() - t0 < 15_000, 'idle timeout should fire within one check interval');
});
