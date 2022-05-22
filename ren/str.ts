import {
  AnyNode,
  Attrs,
  Elem,
  Fragment,
  isElem,
  isFragment,
  isTextNode,
  TextNode,
} from "../core/node.ts";
import { concat, join } from "../core/utils.ts";
import { Renderer } from "./types.ts";

interface StrRendererOpts {
  doctype?: string;
  forceRenderDoctype?: boolean;
  wrapNode?: (node: AnyNode) => AnyNode;
}

export class StrRenderer implements Renderer<string> {
  #doctype: string;
  #forceRenderDoctype: boolean;
  #wrapNode: (node: AnyNode) => AnyNode;

  constructor(opts?: StrRendererOpts) {
    this.#doctype = opts?.doctype ?? "html";
    this.#forceRenderDoctype = opts?.forceRenderDoctype ?? false;
    this.#wrapNode = opts?.wrapNode ?? identity;
  }

  render(node: AnyNode): string {
    const wrappedNode = this.#wrapNode(node);
    const shouldRenderDoctype = this.#forceRenderDoctype ||
      (isElem(wrappedNode) && wrappedNode.tagName === "html");
    return concat([
      shouldRenderDoctype && encodeDoctype(this.#doctype),
      encodeAnyNode(wrappedNode),
    ]);
  }
}

function identity<T>(val: T): T {
  return val;
}

function encodeDoctype(value: string): string {
  return `<!doctype ${value}>`;
}

function encodeAnyNode(node: AnyNode): string {
  return isTextNode(node)
    ? encodeTextNode(node)
    : isFragment(node)
    ? encodeHtmlFragment(node)
    : encodeHtmlElement(node);
}

function encodeTextNode(node: TextNode): string {
  return node.innerText;
}

function encodeHtmlFragment(node: Fragment): string {
  return concat(node.children.map(encodeAnyNode));
}

function encodeHtmlElement(
  { tagName, attrs, children }: Elem,
): string {
  const open = `<${join(" ", [tagName, encodeAttrs(attrs)])}>`;
  if (isSelfClosedTagName(tagName)) return open;

  const encodedChildren = children.map(encodeAnyNode);
  return `${open}${concat(encodedChildren)}</${tagName}>`;
}

function encodeAttrs(attrs: Attrs): string {
  return join(
    " ",
    Object.entries(attrs).map(([key, value]) => encodeAttr(key, value)),
  );
}

function encodeAttr(key: string, value: string): string {
  return `${key}="${value}"`;
}

function isSelfClosedTagName(tagName: string): boolean {
  return SELF_CLOSED_HTML_TAG_NAMES.includes(tagName);
}

const SELF_CLOSED_HTML_TAG_NAMES = [
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
  "command",
  "keygen",
  "menuitem",
];
