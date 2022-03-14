import { isNil, Nilable } from "./lang.mjs";

export type AnyNode = TextNode | Node;

export class TextNode {
  #text: string;

  constructor(text: string) {
    this.#text = text;
  }

  get text(): string {
    return this.#text;
  }
}

export class Node {
  #tagName: string;
  #attrs: Record<string, unknown>;
  #children: Nilable<AnyNode[]>;
  #isSelfClosed: boolean;

  constructor(tagName: string) {
    this.#tagName = tagName;
    this.#attrs = {};
    this.#children = undefined;
    this.#isSelfClosed = selfClosedTagNames.has(tagName);
  }

  get tagName(): string {
    return this.#tagName;
  }

  get attrs(): Record<string, unknown> {
    return this.#attrs;
  }

  get children(): Nilable<AnyNode[]> {
    return this.#children;
  }

  withAttrs(attrs: Record<string, unknown>): Node {
    Object.entries(attrs).forEach(([key, value]) => this.addAttr(key, value));
    return this;
  }

  withAttr(name: string, value: unknown): Node {
    this.addAttr(name, value);
    return this;
  }

  addAttr(name: string, value: unknown): void {
    this.#attrs[name] = value;
  }

  withText(text: string): Node {
    this.addText(text);
    return this;
  }

  addText(text: string): void {
    this.addChild(new TextNode(text));
  }

  withChildren(nodes: AnyNode[]): Node {
    nodes.forEach((n) => this.addChild(n));
    return this;
  }

  withChild(node: AnyNode): Node {
    this.addChild(node);
    return this;
  }

  addChild(node: AnyNode): void {
    if (this.#isSelfClosed)
      throw new Error("You cannot add child to self closed element");
    if (isNil(this.#children)) this.#children = [];
    this.#children.push(node);
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
