import { GridLayout } from '@nativescript/core';
import { Scroll, Text, View } from '@triniwiz/nativescript-masonkit';
import { h } from './ns-common/h';
import type { Chrome } from './ns-common/shell';
import { SCENARIOS, SIZES } from './shared/scenarios';

type AnyView = any; // Mason's typings don't unify with core's View type

/**
 * Mason frame: a Mason root (status Text + Mason Scroll host, or a Mason Ul in
 * its place), and a Mason home screen. The only core view is the window root, a single-cell GridLayout
 * that applies the Android system-bar insets (Mason views have no
 * androidOverflowEdge support).
 */
export function masonChrome(): Chrome {
  const status = h(Text, { className: 'status' });
  const scroll = h(Scroll, { className: 'body' });
  const frame = h(View, { className: 'frame' }, [status, scroll]);
  const root = h(GridLayout, { className: 'root', androidOverflowEdge: 'none' }, [frame]);
  let body: AnyView = scroll;

  const replaceBody = (view: AnyView) => {
    frame.removeChild(body);
    frame.addChild(view);
    body = view;
  };

  return {
    root,
    setStatus: (text) => (status.textContent = text),
    setBody(view: AnyView, placement) {
      if (placement === 'scroll') {
        if (body !== scroll) replaceBody(scroll);
        scroll.removeChildren();
        scroll.addChild(view);
      } else {
        scroll.removeChildren();
        replaceBody(view);
      }
    },
    clear() {
      if (body !== scroll) replaceBody(scroll);
      scroll.removeChildren();
    },
    home: (title, pick): AnyView =>
      h(View, { className: 'home' }, [
        h(Text, { className: 'home-title', textContent: `xplat-benchmarks · ${title}` }),
        ...SCENARIOS.map((s) =>
          h(View, { className: 'home-row' }, [
            h(Text, { className: 'home-label', textContent: s.title }),
            ...SIZES.map((size) => {
              const b = h(Text, { className: 'home-btn', textContent: size });
              b.on('tap', () => pick(s.id, size));
              return b;
            }),
          ]),
        ),
      ]),
  };
}
