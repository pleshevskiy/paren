import { isNotSkip, isNum, isStr, Nilable, Skipable, toArr } from "./utils.ts";

export type Attrs = Record<string, string>;
export type AnyNode = Fragment | FragmentNode;

export function isTextNode(val: unknown): val is TextNode {
  return val instanceof TextNode;
}

export class TextNode {
  #innerText: string;

  get innerText(): string {
    return this.#innerText;
  }

  constructor(text: string) {
    this.#innerText = text;
  }
}

export function isFragment(val: unknown): val is Fragment {
  return val instanceof Fragment;
}

export type FragmentNode = Elem | TextNode;

export class Fragment {
  #children: FragmentNode[];

  get children(): FragmentNode[] {
    return this.#children;
  }

  constructor(children: FragmentNode[]) {
    this.#children = children;
  }
}

export function isElem(val: unknown): val is Elem {
  return val instanceof Elem;
}

export type ElemTagName =
  | keyof HTMLElementTagNameMap
  | keyof SVGElementTagNameMap;

export class Elem {
  #tagName: ElemTagName;
  #attrs: Attrs;
  #children: AnyNode[];

  get tagName(): ElemTagName {
    return this.#tagName;
  }

  get attrs(): Attrs {
    return this.#attrs;
  }

  get children(): AnyNode[] {
    return this.#children;
  }

  constructor(
    tagName: ElemTagName,
    attrs?: Nilable<Attrs>,
    children?: Nilable<AnyNode[]>,
  ) {
    this.#tagName = tagName;
    this.#attrs = attrs ?? {};
    this.#children = children ?? [];
  }
}

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
