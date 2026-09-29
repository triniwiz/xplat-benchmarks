import { makeView, registerElement, scope } from 'dominative';
import { getMasonKitElements } from '@triniwiz/nativescript-masonkit/elements';

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

export function registerMasonElements(): void {
  for (const { tag, ctor, isContainer } of getMasonKitElements({ web: false })) {
    const key = tag.toLowerCase();
    if (scope[key]) delete scope[key];
    registerElement(key, isContainer ? makeMasonElement(ctor) : makeView(ctor, {}));
  }
  for (const name of Object.keys(scope)) {
    const lower = name.toLowerCase();
    if (!scope[lower]) scope[lower] = scope[name];
  }
}
