// jsxImportSource for NativeScript elements: React's runtime, with a JSX
// namespace whose intrinsic elements are the untyped dominative tags (Mason
// and core, lowercase), instead of React DOM's HTML/SVG element types.
import type * as React from 'react';

export { Fragment, jsx, jsxs } from 'react/jsx-runtime';

export namespace JSX {
  export type Element = React.JSX.Element;
  export type ElementType = React.JSX.ElementType;
  export interface ElementClass extends React.JSX.ElementClass {}
  export interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
  export interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
  export type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
  export interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
  export interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
  export interface IntrinsicElements {
    [tag: string]: any;
  }
}
