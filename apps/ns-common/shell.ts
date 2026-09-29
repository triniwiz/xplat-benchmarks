import { Application, GridLayout, Label, ScrollView, StackLayout, type View } from '@nativescript/core';
import { gc, now } from './clock';
import { profileStart, profileStop } from './profile';
import { nextFrames, waitPainted } from './frames';
import { h } from './h';
import { deviceInfo } from './info';
import { onLaunchUrl } from './launch';
import { fixtureFor, type ScenarioFixture } from '../shared/generate';
import { parseLaunchUrl, type AppId } from '../shared/protocol';
import { runPlan, type BenchAdapter } from '../shared/runner';
import { SCENARIOS, SIZES, type ScenarioId, type Size } from '../shared/scenarios';

export interface Built {
  root: View;
  sentinel: View;
  placement: 'scroll' | 'fill';
  mutate?(name: string): void;
}

export interface Chrome {
  root: View;
  setStatus(text: string): void;
  setBody(view: View, placement: Built['placement']): void;
  clear(): void;
  home(title: string, pick: (scenario: ScenarioId, size: Size) => void): View;
}

export interface ShellOptions {
  app: AppId;
  title: string;
  build(fixture: ScenarioFixture): Built;
  chrome?: Chrome;
  diagnostics?: BenchAdapter['diagnostics'];
}

export function coreChrome(): Chrome {
  const status = h(Label, { className: 'status' });
  const scroll = new ScrollView();
  const root = h(GridLayout, { className: 'root', rows: '24,*', androidOverflowEdge: 'none' }, [status]);
  let body: View = scroll;
  GridLayout.setRow(scroll, 1);
  root.addChild(scroll);
  const replaceBody = (view: View) => {
    root.removeChild(body);
    GridLayout.setRow(view, 1);
    root.addChild(view);
    body = view;
  };
  return {
    root,
    setStatus: (text) => (status.text = text),
    setBody(view, placement) {
      if (placement === 'scroll') {
        if (body !== scroll) replaceBody(scroll);
        scroll.content = view;
      } else {
        scroll.content = null;
        replaceBody(view);
      }
    },
    clear() {
      if (body !== scroll) replaceBody(scroll);
      scroll.content = new StackLayout();
    },
    home: (title, pick) =>
      h(StackLayout, { className: 'home' }, [
        h(Label, { className: 'home-title', text: `xplat-benchmarks · ${title}` }),
        ...SCENARIOS.map((s) => {
          const row = h(GridLayout, { className: 'home-row', columns: '*,auto,auto,auto' }, [
            h(Label, { className: 'home-label', text: s.title }),
          ]);
          SIZES.forEach((size, i) => {
            const b = h(Label, { className: 'home-btn', text: size });
            b.on('tap', () => pick(s.id, size));
            GridLayout.setColumn(b, i + 1);
            row.addChild(b);
          });
          return row;
        }),
      ]),
  };
}

export function startShell({ app, title, build, chrome = coreChrome(), diagnostics }: ShellOptions): void {
  const setStatus = (text: string) => chrome.setStatus(text);
  setStatus(`${app} · ready`);

  let current: Built | null = null;
  const adapter: BenchAdapter = {
    app,
    now,
    info: deviceInfo,
    gc,
    diagnostics,
    profileStart,
    profileStop,
    align: () => nextFrames(1),
    async mount(f) {
      current = build(f);
      const built = now();
      const painted = waitPainted(current.sentinel);
      chrome.setBody(current.root, current.placement);
      const attached = now();
      return painted.then((t) => ({ ...t, marks: { built, attached, ...t.marks } }));
    },
    async mutate(_f, name) {
      const painted = waitPainted(current!.sentinel);
      current!.mutate!(name);
      return painted;
    },
    async unmount() {
      current = null;
      chrome.clear();
      await nextFrames(1);
    },
  };

  const show = (scenario: ScenarioId, size: Size) => {
    setStatus(`${app} · ${scenario}/${size}`);
    const t0 = now();
    adapter.mount(fixtureFor(scenario, size)).then(() => {
      setStatus(`${app} · ${scenario}/${size} · ${(now() - t0).toFixed(1)} ms`);
    });
  };

  onLaunchUrl((url) => {
    const cmd = parseLaunchUrl(url);
    if (!cmd) return;
    if (cmd.mode === 'show') return show(cmd.scenario, cmd.size);
    runPlan(adapter, cmd.host, cmd.runId, (s) => {
      if (s.iteration === 0) setStatus(`${app} · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}`);
    });
  });

  chrome.setBody(chrome.home(title, show), 'scroll');
  Application.run({ create: () => chrome.root });
}
