import { isBool, isNil } from "./lang.mjs";
import { Elem, TextNode } from "./nodes.mjs";
export class StrRenderer {
    async render(node) {
        return encodeNode(await node);
    }
}
async function encodeAnyNode(node) {
    const syncNode = await node;
    return !syncNode
        ? null
        : syncNode instanceof TextNode
            ? encodeTextNode(syncNode)
            : encodeNode(syncNode);
}
function encodeTextNode(node) {
    return String(node);
}
async function encodeNode(node) {
    const encodedChildren = isNil(node.children)
        ? undefined
        : await Promise.all(node.children.map(encodeAnyNode)).then((children) => children.filter((c) => Boolean(c)));
    return node instanceof Elem
        ? encodeHtmlElement(node.tagName, node.attrs, encodedChildren)
        : encodeHtmlFragment(encodedChildren);
}
function encodeHtmlFragment(children) {
    return children?.join("") ?? "";
}
function encodeHtmlElement(tagName, attrs, children) {
    const open = `<${tagName} ${encodeAttrs(attrs)}>`;
    if (isNil(children))
        return open;
    return `${open}${children.join("")}</${tagName}>`;
}
function encodeAttrs(attrs) {
    if (!attrs)
        return "";
    return Object.entries(attrs)
        .map(([key, value]) => encodeAttr(key, value))
        .filter(Boolean)
        .join(" ");
}
function encodeAttr(key, value) {
    if (isNil(value))
        return null;
    if (isBool(value))
        return value ? key : null;
    return `${key}="${value}"`;
}
