import { Renderer } from "./types.mjs";
import { isBool, isNil, Nullable } from "./lang.mjs";
import { AnyNode, Elem, Frag, TextNode } from "./nodes.mjs";

export class StrRenderer implements Renderer<string> {
  async render(node: Elem | Promise<Elem>): Promise<string> {
    return encodeNode(await node);
  }
}

async function encodeAnyNode(node: AnyNode): Promise<Nullable<string>> {
  const syncNode = await node;
  return !syncNode
    ? null
    : syncNode instanceof TextNode
    ? encodeTextNode(syncNode)
    : encodeNode(syncNode);
}

function encodeTextNode(node: TextNode): string {
  return String(node);
}

async function encodeNode(node: Elem | Frag): Promise<string> {
  const encodedChildren = isNil(node.children)
    ? undefined
    : await Promise.all(node.children.map(encodeAnyNode)).then((children) =>
        children.filter((c): c is string => Boolean(c))
      );
  return node instanceof Elem
    ? encodeHtmlElement(node.tagName, node.attrs, encodedChildren)
    : encodeHtmlFragment(encodedChildren);
}

function encodeHtmlFragment(children?: string[]): string {
  return children?.join("") ?? "";
}

function encodeHtmlElement(
  tagName: string,
  attrs?: Record<string, unknown>,
  children?: string[]
): string {
  const open = `<${tagName} ${encodeAttrs(attrs)}>`;
  if (isNil(children)) return open;
  return `${open}${children.join("")}</${tagName}>`;
}

function encodeAttrs(attrs?: Record<string, unknown>): Nullable<string> {
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
