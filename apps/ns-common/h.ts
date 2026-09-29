type Child = object | null | undefined | false;

export function h<T extends object>(Ctor: new () => T, props?: Record<string, unknown> | null, children?: readonly Child[]): T {
  const view = new Ctor();
  if (props) for (const k in props) (view as any)[k] = props[k];
  if (children) for (const c of children) if (c) (view as any).addChild(c);
  return view;
}
