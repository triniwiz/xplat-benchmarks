// Type-only jsxImportSource (babel-preset-solid compiles the JSX): intrinsic
// elements are the untyped dominative tags (Mason and core, lowercase).
export namespace JSX {
  export type Element = any;
  export interface ElementChildrenAttribute {
    children: {};
  }
  export interface IntrinsicElements {
    [tag: string]: any;
  }
}
