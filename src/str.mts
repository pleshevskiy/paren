import { Renderer } from "./types.mjs";
import { isBool, isNil, Nilable, Nullable } from "./lang.mjs";
import { AnyNode, Elem, ElemAttrs, Frag, TextNode } from "./nodes.mjs";

export class StrRenderer implements Renderer<string> {
  render(node: Elem): string {
    return encodeNode(node);
  }
}

function encodeAnyNode(node: AnyNode): Nullable<string> {
  return !node
    ? null
    : node instanceof TextNode
    ? encodeTextNode(node)
    : encodeNode(node);
}

function encodeTextNode(node: TextNode): string {
  return String(node);
}

function encodeNode(node: Elem | Frag): string {
  const encodedChildren = isNil(node.children)
    ? undefined
    : node.children.map(encodeAnyNode);
  return node instanceof Elem
    ? encodeHtmlElement(node.tagName, node.attrs, encodedChildren)
    : encodeHtmlFragment(encodedChildren);
}

function encodeHtmlFragment(children?: Nilable<string>[]): string {
  return concat(children ?? []);
}

function encodeHtmlElement(
  tagName: string,
  attrs?: ElemAttrs,
  children?: Nilable<string>[]
): string {
  const open = `<${join(" ", [tagName, encodeAttrs(attrs)])}>`;
  if (isNil(children)) return open;
  return `${open}${concat(children)}</${tagName}>`;
}

function encodeAttrs(attrs?: ElemAttrs): Nullable<string> {
  if (!attrs) return null;

  return join(
    " ",
    Object.entries(attrs).map(([key, value]) => encodeAttr(key, value))
  );
}

function encodeAttr(key: string, value: unknown): Nullable<string> {
  if (isNil(value)) return null;
  if (isBool(value)) return value ? key : null;
  return `${key}="${value}"`;
}

function concat(arr: Nilable<string>[]): string {
  return join("", arr);
}

function join(sep: string, arr: Nilable<string>[]): string {
  return arr.filter(Boolean).join(sep);
}
