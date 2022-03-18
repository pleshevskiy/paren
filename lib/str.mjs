import { isBool, isNil } from "./lang.mjs";
import { Elem, TextNode } from "./nodes.mjs";
export class StrRenderer {
    render(node) {
        return encodeNode(node);
    }
}
function encodeAnyNode(node) {
    return !node
        ? null
        : node instanceof TextNode
            ? encodeTextNode(node)
            : encodeNode(node);
}
function encodeTextNode(node) {
    return String(node);
}
function encodeNode(node) {
    const encodedChildren = isNil(node.children)
        ? undefined
        : node.children.map(encodeAnyNode).filter((c) => Boolean(c));
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
