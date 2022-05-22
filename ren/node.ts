export * from "../core/node.ts";

import {
  AnyNode,
  Attrs,
  Elem,
  ElemTagName,
  Fragment,
  FragmentNode,
  isFragment,
  TextNode,
} from "../core/node.ts";
import { isNotSkip, isNum, isStr, Skipable, toArr } from "../core/utils.ts";

export function F(children: Skipable<EChild>[]): Fragment {
  return new Fragment(
    children.filter(isNotSkip).flatMap((c) =>
      normFragmentChild(normElemChild(c))
    ),
  );
}

type EAttrs = Attrs | Attrs[];
type ETextNode = string | number | TextNode;
type EChild = ETextNode | Fragment | Elem;

export function E(
  tagName: ElemTagName,
  attrs: EAttrs,
  children?: ETextNode | Skipable<EChild>[],
): Elem {
  return new Elem(
    tagName,
    mergeAttrs(attrs ?? []),
    toArr(children ?? []).filter(isNotSkip).map(normElemChild),
  );
}

function mergeAttrs(attrs: EAttrs): Attrs {
  return !Array.isArray(attrs)
    ? attrs
    : attrs.reduce((acc, attrs) => ({ ...acc, ...attrs }), {} as Attrs);
}

function normFragmentChild(node: AnyNode): FragmentNode | FragmentNode[] {
  return isFragment(node) ? node.children : node;
}

function normElemChild(node: EChild): AnyNode {
  return isStr(node) || isNum(node) ? new TextNode(String(node)) : node;
}
