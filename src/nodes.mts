import { intoArr, isNil, Nil, Nilable } from "./lang.mjs";

export function Et(tagName: string, ...texts: string[]): Elem {
  return new Elem(tagName).withText(texts);
}

export function Ea(
  tagName: string,
  attrs?: ElemAttrs,
  children?: AnyNode | AnyNode[]
): Elem {
  const el = new Elem(tagName);
  if (attrs) el.addAttrs(attrs);
  if (children) el.addChildren(children);
  return el;
}

export function E(tagName: string, children: AnyNode | AnyNode[]): Elem {
  return new Elem(tagName).withChildren(children);
}

export function F(...children: AnyNode[]): Frag {
  return new Frag().withChildren(children);
}

export type AnyNode = TextNode | Elem | Frag | Nil | false;
export type TextNode = string;

export class Frag {
  #children: Nilable<AnyNode[]>;

  constructor() {
    this.#children = undefined;
  }

  get children(): Nilable<AnyNode[]> {
    return this.#children;
  }

  withText(texts: TextNode | TextNode[]): this {
    this.addText(texts);
    return this;
  }

  addText(texts: TextNode | TextNode[]): void {
    this.addChildren(
      intoArr(texts)
        .map((t) => t.trim())
        .join(" ")
    );
  }

  withChildren(nodes: AnyNode | AnyNode[]): this {
    this.addChildren(nodes);
    return this;
  }

  addChildren(nodes: AnyNode | AnyNode[]): void {
    intoArr(nodes).forEach((n) => this.addChild(n));
  }

  addChild(node: AnyNode): void {
    if (isNil(this.#children)) this.#children = [];
    this.#children.push(node);
  }
}

export type ElemAttrs = Record<string, unknown>;

export class Elem extends Frag {
  #tagName: string;
  #attrs: ElemAttrs;
  #isSelfClosed: boolean;

  constructor(tagName: string) {
    super();
    this.#tagName = tagName;
    this.#attrs = {};
    this.#isSelfClosed = selfClosedTagNames.has(tagName);
  }

  get tagName(): string {
    return this.#tagName;
  }

  get attrs(): Record<string, unknown> {
    return this.#attrs;
  }

  withAttrs(attrs: ElemAttrs): Elem {
    this.addAttrs(attrs);
    return this;
  }

  addAttrs(attrs: ElemAttrs): void {
    Object.entries(attrs).forEach(([key, value]) => this.addAttr(key, value));
  }

  addAttr(name: string, value: unknown): void {
    this.#attrs[name] = value;
  }

  addChild(node: AnyNode): void {
    if (this.#isSelfClosed)
      throw new Error("You cannot add child to self closed element");
    super.addChild(node);
  }
}

const selfClosedTagNames = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
