import { Application, Button, GridLayout, Label, ScrollView, StackLayout, type View } from '@nativescript/core';
import { gc, now } from './clock';
import { nextFrames, waitPainted } from './frames';
import { h } from './h';
import { deviceInfo } from './info';
import { onLaunchUrl } from './launch';
import { fixtureFor, type ScenarioFixture } from '../shared/generate';
import { parseLaunchUrl, type AppId } from '../shared/protocol';
import { runPlan, type BenchAdapter } from '../shared/runner';
import { SCENARIOS, SIZES, type ScenarioId, type Size } from '../shared/scenarios';

// App shell shared by ns-core and ns-core-mason: a fixed-height status line
// above the bench host (a core ScrollView). Scenarios mount into the host, or
// replace it when they bring their own scrolling (virtualized lists). The two
// apps differ only in `build` and their CSS.

export interface Built {
  root: View;
  /** Layout of this view marks "painted" (see frames.ts). */
  sentinel: View;
  /** 'scroll' mounts inside the host ScrollView; 'fill' replaces it (virtualized lists). */
  placement: 'scroll' | 'fill';
  mutate?(name: string): void;
}

export interface ShellOptions {
  app: AppId;
  title: string;
  build(fixture: ScenarioFixture): Built;
}

export function startShell({ app, title, build }: ShellOptions): void {
  const status = h(Label, { className: 'status', text: `${app} · ready` });
  const scroll = new ScrollView();
  const root = h(GridLayout, { className: 'root', rows: '24,*' }, [status]);
  let body: View = scroll;
  GridLayout.setRow(scroll, 1);
  root.addChild(scroll);

  const replaceBody = (view: View) => {
    root.removeChild(body);
    GridLayout.setRow(view, 1);
    root.addChild(view);
    body = view;
  };
  const setBody = (view: View, placement: Built['placement']) => {
    if (placement === 'scroll') {
      if (body !== scroll) replaceBody(scroll);
      scroll.content = view;
    } else {
      scroll.content = null;
      replaceBody(view);
    }
  };

  let current: Built | null = null;
  const adapter: BenchAdapter = {
    app,
    now,
    info: deviceInfo,
    gc,
    align: () => nextFrames(1),
    async mount(f) {
      current = build(f);
      const painted = waitPainted(current.sentinel);
      setBody(current.root, current.placement);
      return painted;
    },
    async mutate(_f, name) {
      const painted = waitPainted(current!.sentinel);
      current!.mutate!(name);
      return painted;
    },
    async unmount() {
      current = null;
      setBody(new StackLayout(), 'scroll');
      await nextFrames(1);
    },
  };

  const show = (scenario: ScenarioId, size: Size) => {
    status.text = `${app} · ${scenario}/${size}`;
    const t0 = now();
    adapter.mount(fixtureFor(scenario, size)).then(() => {
      status.text = `${app} · ${scenario}/${size} · ${(now() - t0).toFixed(1)} ms`;
    });
  };

  const home = () =>
    h(StackLayout, { className: 'home' }, [
      h(Label, { className: 'home-title', text: `xplat-benchmarks · ${title}` }),
      ...SCENARIOS.map((s) => {
        const row = h(GridLayout, { className: 'home-row', columns: '*,auto,auto,auto' }, [
          h(Label, { className: 'home-label', text: s.title }),
        ]);
        SIZES.forEach((size, i) => {
          const b = h(Button, { className: 'home-btn', text: size });
          b.on('tap', () => show(s.id, size));
          GridLayout.setColumn(b, i + 1);
          row.addChild(b);
        });
        return row;
      }),
    ]);

  onLaunchUrl((url) => {
    const cmd = parseLaunchUrl(url);
    if (!cmd) return;
    if (cmd.mode === 'show') return show(cmd.scenario, cmd.size);
    runPlan(adapter, cmd.host, cmd.runId, (s) => {
      // Only on case boundaries: a status relayout must not land inside a measured iteration.
      if (s.iteration === 0) status.text = `${app} · ${s.phase} ${s.caseIndex + 1}/${s.caseCount} ${s.label}`;
    });
  });

  scroll.content = home();
  Application.run({ create: () => root });
}
