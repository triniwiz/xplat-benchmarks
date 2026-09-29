type Child = object | null | undefined | false;

/**
 * Imperative element helper used identically by ns-core and ns-core-mason, so
 * the two apps differ only in element classes and CSS: new Ctor(), assign
 * props, append children (detached; the root is attached once at the end).
 */
export function h<T extends object>(Ctor: new () => T, props?: Record<string, unknown> | null, children?: readonly Child[]): T {
  const view = new Ctor();
  if (props) for (const k in props) (view as any)[k] = props[k];
  if (children) for (const c of children) if (c) (view as any).addChild(c);
  return view;
}
