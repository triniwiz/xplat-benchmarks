import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SCENARIOS, SIZES } from '../../scenarios/src/scenarios';
import type { AppDef } from './apps';
import { aggregate } from './report';
import { summarize } from './stats';

type Group = 'ns-core' | 'ns-mason' | 'react-native' | 'lynx';

const GROUPS: { id: Group; label: string }[] = [
  { id: 'ns-core', label: 'NativeScript core' },
  { id: 'ns-mason', label: 'NativeScript + Mason' },
  { id: 'react-native', label: 'React Native' },
  { id: 'lynx', label: 'Lynx' },
];

const shortTitle = (app: AppDef) => app.title.replace(/^NativeScript /, 'NS ');

const groupOf = (app: AppDef): Group =>
  app.id === 'ns-core' ? 'ns-core' : app.id.startsWith('ns-') ? 'ns-mason' : (app.id as Group);

interface Bar {
  app: string;
  group: Group;
  median: number;
  p90: number;
  n: number;
}

interface Panel {
  size: string;
  bars: { painted: Bar[]; layout: Bar[] };
}

interface Section {
  id: string;
  title: string;
  kind: string;
  series: { name: string; panels: Panel[] }[];
}

export function buildHtmlReport(dir: string): string {
  const { files, series, problems, apps } = aggregate(dir);
  const first = files[0];

  const sections: Section[] = [];
  for (const def of SCENARIOS) {
    const out: Section = { id: def.id, title: def.title, kind: def.kind, series: [] };
    for (const name of ['mount', ...def.mutations]) {
      const panels: Panel[] = [];
      for (const size of SIZES) {
        const bars = (key: string) => {
          const byApp = series.get(`${def.id}/${size}/${key}`);
          if (!byApp) return [];
          return apps
            .filter((a) => byApp.get(a.id)?.length)
            .map((a) => {
              const st = summarize(byApp.get(a.id)!);
              return { app: shortTitle(a), group: groupOf(a), median: st.median, p90: st.p90, n: st.n };
            });
        };
        const painted = bars(name);
        if (painted.length) panels.push({ size, bars: { painted, layout: bars(`${name}.layout`) } });
      }
      if (panels.length) out.series.push({ name, panels });
    }
    if (out.series.length) sections.push(out);
  }

  const deviceName = [first.device.manufacturer, first.device.model ?? first.target.name].filter(Boolean).join(' ');
  const meta = {
    title: `Results: ${deviceName} (${first.target.platform} ${first.device.osVersion ?? first.target.osVersion ?? ''})`,
    subtitle: `${new Set(files.map((f) => f.round)).size} round(s) · warmup ${first.record.plan.warmup} · ${first.record.plan.iterations} iterations per round · median, whisker = p90 · lower is better`,
    emulated: first.target.kind !== 'device',
    notes: apps.flatMap((a) => (a.notes ?? []).map((n) => `${a.title}: ${n}`)),
    problems,
  };

  const data = JSON.stringify({ meta, groups: GROUPS, sections }).replace(/</g, '\\u003c');
  return TEMPLATE.replace('__DATA__', data);
}

export function writeHtmlReport(dir: string): string {
  const path = join(dir, 'report.html');
  writeFileSync(path, buildHtmlReport(dir));
  return path;
}

const TEMPLATE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>xplat-benchmarks report</title>
<style>
.viz-root {
  color-scheme: light;
  --page: #f9f9f7; --surface-1: #fcfcfb;
  --text-primary: #0b0b0b; --text-secondary: #52514e; --text-muted: #898781;
  --grid: #e1e0d9; --baseline: #c3c2b7; --border: rgba(11,11,11,0.10);
  --series-1: #2a78d6; --series-2: #eb6834; --series-3: #1baf7a; --series-4: #eda100;
  --critical: #d03b3b;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme="light"])) .viz-root {
    color-scheme: dark;
    --page: #0d0d0d; --surface-1: #1a1a19;
    --text-primary: #ffffff; --text-secondary: #c3c2b7; --text-muted: #898781;
    --grid: #2c2c2a; --baseline: #383835; --border: rgba(255,255,255,0.10);
    --series-1: #3987e5; --series-2: #d95926; --series-3: #199e70; --series-4: #c98500;
  }
}
:root[data-theme="dark"] .viz-root {
  color-scheme: dark;
  --page: #0d0d0d; --surface-1: #1a1a19;
  --text-primary: #ffffff; --text-secondary: #c3c2b7; --text-muted: #898781;
  --grid: #2c2c2a; --baseline: #383835; --border: rgba(255,255,255,0.10);
  --series-1: #3987e5; --series-2: #d95926; --series-3: #199e70; --series-4: #c98500;
}
* { box-sizing: border-box; }
body { margin: 0; }
.viz-root { background: var(--page); color: var(--text-primary); font: 14px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; padding: 24px; min-height: 100vh; }
h1 { font-size: 20px; margin: 0 0 4px; font-weight: 600; }
h2 { font-size: 16px; margin: 32px 0 4px; font-weight: 600; }
h3 { font-size: 13px; margin: 16px 0 8px; font-weight: 600; color: var(--text-secondary); }
.sub { color: var(--text-secondary); margin: 0 0 16px; }
.warn { color: var(--text-primary); border-left: 3px solid var(--critical); padding: 4px 10px; margin: 8px 0; background: var(--surface-1); }
.controls { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin: 16px 0; }
.seg { display: inline-flex; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.seg button { font: inherit; background: var(--surface-1); color: var(--text-secondary); border: 0; padding: 6px 12px; cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--text-primary); color: var(--surface-1); }
.legend { display: flex; gap: 16px; flex-wrap: wrap; color: var(--text-secondary); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
.row { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 540px)); gap: 12px; }
.card { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 12px 12px 8px; }
.card-title { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
svg text { fill: var(--text-secondary); font-size: 11px; }
svg .val { fill: var(--text-primary); font-variant-numeric: tabular-nums; }
svg .tick { fill: var(--text-muted); font-variant-numeric: tabular-nums; font-size: 10px; }
.bar { cursor: default; }
.bar:hover .mark-path, .bar:focus .mark-path { filter: brightness(1.12); }
.bar:focus { outline: none; }
.bar:focus rect.hit { stroke: var(--text-primary); stroke-width: 1; }
details { margin-top: 4px; color: var(--text-secondary); font-size: 12px; }
table { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; }
th, td { text-align: right; padding: 2px 6px; border-bottom: 1px solid var(--grid); }
th:first-child, td:first-child { text-align: left; }
.tip { position: fixed; pointer-events: none; background: var(--surface-1); border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); font-size: 12px; display: none; z-index: 10; }
.tip strong { font-size: 14px; display: block; color: var(--text-primary); }
.tip span { color: var(--text-secondary); }
ul.notes { color: var(--text-secondary); padding-left: 18px; margin: 4px 0; }
</style></head>
<body><div class="viz-root">
<h1 id="title"></h1><p class="sub" id="subtitle"></p>
<div id="banners"></div>
<div class="controls">
  <div class="seg" role="group" aria-label="Metric">
    <button type="button" data-metric="painted" aria-pressed="true">Painted (layout + next frame)</button>
    <button type="button" data-metric="layout" aria-pressed="false">Layout</button>
  </div>
  <div class="legend" id="legend"></div>
</div>
<div id="sections"></div>
<h2>Known deviations</h2><ul class="notes" id="notes"></ul>
<div class="tip" id="tip" role="status"></div>
</div>
<script>
const DATA = __DATA__;
// ?theme=light|dark overrides the OS setting (the data-theme scope wins both ways).
const theme = new URLSearchParams(location.search).get('theme');
if (theme === 'light' || theme === 'dark') document.documentElement.setAttribute('data-theme', theme);
const COLOR = { 'ns-core': 'var(--series-1)', 'ns-mason': 'var(--series-2)', 'react-native': 'var(--series-3)', 'lynx': 'var(--series-4)' };
const el = (tag, attrs = {}, text) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};
const svgEl = (tag, attrs = {}, text) => {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};
const fmt = (v) => (v >= 100 ? v.toFixed(0) : v.toFixed(1));
const niceMax = (v) => {
  const p = Math.pow(10, Math.floor(Math.log10(v || 1)));
  for (const m of [1, 2, 2.5, 5, 10]) if (v <= m * p) return m * p;
  return 10 * p;
};

document.getElementById('title').textContent = DATA.meta.title;
document.getElementById('subtitle').textContent = DATA.meta.subtitle;
const banners = document.getElementById('banners');
if (DATA.meta.emulated) banners.append(el('div', { class: 'warn' }, 'Simulator / emulator run — smoke-test numbers only.'));
for (const p of DATA.meta.problems) banners.append(el('div', { class: 'warn' }, p));
for (const n of DATA.meta.notes) document.getElementById('notes').append(el('li', {}, n));
const legend = document.getElementById('legend');
for (const g of DATA.groups) {
  const s = el('span');
  const sw = el('i'); sw.style.background = COLOR[g.id];
  s.append(sw, document.createTextNode(g.label));
  legend.append(s);
}

const tip = document.getElementById('tip');
function showTip(evt, bar, metric) {
  tip.replaceChildren();
  tip.append(el('strong', {}, fmt(bar.median) + ' ms'), el('span', {}, bar.app + ' · p90 ' + fmt(bar.p90) + ' ms · n ' + bar.n + ' · ' + metric));
  tip.style.display = 'block';
  const r = evt.target.getBoundingClientRect ? evt.target.getBoundingClientRect() : { right: evt.clientX, top: evt.clientY };
  const x = (evt.clientX ?? r.right) + 12, y = (evt.clientY ?? r.top) + 12;
  tip.style.left = Math.min(x, innerWidth - tip.offsetWidth - 8) + 'px';
  tip.style.top = Math.min(y, innerHeight - tip.offsetHeight - 8) + 'px';
}
const hideTip = () => (tip.style.display = 'none');

function chart(bars, metric) {
  const labelW = 130, valueW = 52, row = 22, barH = 14, top = 4, axisH = 18, width = 520;
  const plotW = width - labelW - valueW;
  const max = niceMax(Math.max(...bars.map((b) => b.p90)));
  const height = top + bars.length * row + axisH;
  // Natural size, shrinking only when the card is narrower (text stays 11px).
  const svg = svgEl('svg', { viewBox: '0 0 ' + width + ' ' + height, width: width, role: 'img' });
  svg.style.maxWidth = '100%';
  svg.style.height = 'auto';
  const x = (v) => labelW + (v / max) * plotW;
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    svg.append(svgEl('line', { x1: x(v), x2: x(v), y1: top, y2: top + bars.length * row, stroke: i === 0 ? 'var(--baseline)' : 'var(--grid)', 'stroke-width': 1 }));
    svg.append(svgEl('text', { x: x(v), y: height - 4, 'text-anchor': 'middle', class: 'tick' }, v % 1 === 0 ? v.toLocaleString() : v.toFixed(1)));
  }
  bars.forEach((b, i) => {
    const y = top + i * row + (row - barH) / 2;
    const g = svgEl('g', { class: 'bar', tabindex: 0, 'aria-label': b.app + ': ' + fmt(b.median) + ' ms median, p90 ' + fmt(b.p90) + ' ms' });
    g.append(svgEl('text', { x: labelW - 8, y: y + barH / 2 + 4, 'text-anchor': 'end' }, b.app));
    const w = Math.max(1, x(b.median) - labelW);
    // 4px rounded data-end, square at the baseline.
    const r = Math.min(4, w / 2);
    g.append(svgEl('path', { class: 'mark-path', fill: COLOR[b.group],
      d: 'M' + labelW + ',' + y + 'h' + (w - r) + 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r + 'v' + (barH - 2 * r) + 'a' + r + ',' + r + ' 0 0 1 -' + r + ',' + r + 'h-' + (w - r) + 'z' }));
    // p90 whisker: hairline from the median to p90 with a short cap.
    g.append(svgEl('line', { x1: x(b.median), x2: x(b.p90), y1: y + barH / 2, y2: y + barH / 2, stroke: 'var(--text-muted)', 'stroke-width': 1 }));
    g.append(svgEl('line', { x1: x(b.p90), x2: x(b.p90), y1: y + 3, y2: y + barH - 3, stroke: 'var(--text-muted)', 'stroke-width': 1 }));
    g.append(svgEl('text', { x: x(Math.max(b.p90, b.median)) + 6, y: y + barH / 2 + 4, class: 'val' }, fmt(b.median)));
    // Hit target: the whole row, bigger than the mark.
    const hit = svgEl('rect', { class: 'hit', x: 0, y: top + i * row, width: width, height: row, fill: 'transparent' });
    g.prepend(hit);
    g.addEventListener('pointermove', (e) => showTip(e, b, metric));
    g.addEventListener('pointerleave', hideTip);
    g.addEventListener('focus', (e) => { const r = g.getBoundingClientRect(); showTip({ clientX: r.left + labelW, clientY: r.bottom, target: g }, b, metric); });
    g.addEventListener('blur', hideTip);
    svg.append(g);
  });
  return svg;
}

function table(bars) {
  const t = el('table');
  const h = el('tr');
  for (const c of ['App', 'Median ms', 'p90 ms', 'n']) h.append(el('th', {}, c));
  t.append(h);
  for (const b of bars) {
    const r = el('tr');
    r.append(el('td', {}, b.app), el('td', {}, fmt(b.median)), el('td', {}, fmt(b.p90)), el('td', {}, String(b.n)));
    t.append(r);
  }
  return t;
}

function render(metric) {
  const root = document.getElementById('sections');
  root.replaceChildren();
  for (const s of DATA.sections) {
    root.append(el('h2', {}, s.title + ' (' + s.id + ')'));
    for (const ser of s.series) {
      root.append(el('h3', {}, ser.name === 'mount' ? 'Mount' : 'Mutation: ' + ser.name));
      const rowEl = el('div', { class: 'row' });
      for (const p of ser.panels) {
        const bars = p.bars[metric].length ? p.bars[metric] : p.bars.painted;
        const card = el('div', { class: 'card' });
        card.append(el('div', { class: 'card-title' }, 'Size ' + p.size + (p.bars[metric].length ? '' : ' · layout mark not reported; showing painted')));
        card.append(chart(bars, metric));
        const d = el('details'); d.append(el('summary', {}, 'Table'), table(bars));
        card.append(d);
        rowEl.append(card);
      }
      root.append(rowEl);
    }
  }
}

for (const b of document.querySelectorAll('.seg button')) {
  b.addEventListener('click', () => {
    for (const o of document.querySelectorAll('.seg button')) o.setAttribute('aria-pressed', String(o === b));
    render(b.dataset.metric);
  });
}
render('painted');
</script></body></html>
`;
