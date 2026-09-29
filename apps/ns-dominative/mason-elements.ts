import { makeView, registerElement, scope } from 'dominative';
import { getMasonKitElements } from '@triniwiz/nativescript-masonkit/elements';

// Registers MasonKit elements with dominative, shared by the React and Solid
// apps (both render through dominative). makeMasonElement is the wrapper from
// nativescript-mason apps/demo-solid/src/index.ts: a mason-backed element that
// accepts element children (laid out by mason) and raw text-node children
// (routed to mason's text-node-aware insertBefore).

function makeMasonElement(base: any) {
  const view: any = makeView(base, { childrenPolicy: 'layout' });

  return class MasonElement extends view {
    constructor(...args: any[]) {
      super(...args);
      this.__dominative_role = 'Layout';
    }

    __dominative_onInsertChild(child: any, ref: any) {
      if (child.nodeType === 3) {
        const effectiveRef = ref ?? child.nextSibling ?? null;
        try {
          super.insertBefore(child, effectiveRef);
        } catch {
          super.insertBefore(child, ref ?? null);
        }
        return;
      }
      if (!ref) {
        const nextSib = child.nextSibling;
        if (nextSib != null) {
          try {
            super.insertBefore(child, nextSib);
            return;
          } catch {
            // not trackable in the Mason tree; append
          }
        }
        this.addChild(child);
        return;
      }
      try {
        super.insertBefore(child, ref);
      } catch {
        super.__dominative_onInsertChild(child, ref);
      }
    }

    __dominative_onRemoveChild(child: any) {
      if (child.nodeType === 3) {
        super.removeChild(child);
        return;
      }
      super.__dominative_onRemoveChild(child);
    }
  };
}

/**
 * Mason elements (View, Text, Scroll, Ul, ...) under lowercase tags. Web tags
 * are not registered: they map to Div, a scroll container, where the
 * benchmark uses View. Afterwards every registered tag (core ones included)
 * gets a lowercase alias, where free, so JSX can use them as intrinsics (<gridlayout>).
 */
export function registerMasonElements(): void {
  for (const { tag, ctor, isContainer } of getMasonKitElements({ web: false })) {
    const key = tag.toLowerCase();
    // dominative pre-registers some tags against core widgets; MasonKit's win.
    if (scope[key]) delete scope[key];
    registerElement(key, isContainer ? makeMasonElement(ctor) : makeView(ctor, {}));
  }
  // Not dominative's aliasTagName: it overwrites, and scope also holds undom's
  // DOM `Text` node class, which would replace Mason's `text` element.
  for (const name of Object.keys(scope)) {
    const lower = name.toLowerCase();
    if (!scope[lower]) scope[lower] = scope[name];
  }
}
