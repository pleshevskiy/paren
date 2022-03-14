import { Renderer } from "./types.mjs";
import { AnyNode, Node, TextNode } from "./node.mjs";
import { isBool, isNil, Nullable } from "./lang.mjs";

export class StrRenderer implements Renderer<string> {
  async render(node: Node): Promise<string> {
    return encodeNode(node);
  }
}

function encodeAnyNode(node: AnyNode): string {
  return node instanceof TextNode ? encodeTextNode(node) : encodeNode(node);
}

function encodeTextNode(node: TextNode): string {
  return node.text;
}

function encodeNode(node: Node): string {
  return encodeHtml(
    node.tagName,
    node.attrs,
    node.children?.map(encodeAnyNode)
  );
}

function encodeHtml(
  tagName: string,
  attrs?: Record<string, unknown>,
  children?: string[]
): string {
  const open = `<${tagName} ${encodeAttrs(attrs)}>`;
  if (isNil(children)) return open;
  return `${open}${children.join("")}</${tagName}>`;
}

function encodeAttrs(attrs?: Record<string, unknown>): string {
  if (!attrs) return "";

  return Object.entries(attrs)
    .map(([key, value]) => encodeAttr(key, value))
    .filter(Boolean)
    .join(" ");
}

function encodeAttr(key: string, value: unknown): Nullable<string> {
  if (isNil(value)) return null;
  if (isBool(value)) return value ? key : null;
  return `${key}="${value}"`;
}
