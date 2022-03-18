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
        : node.children.map(encodeAnyNode);
    return node instanceof Elem
        ? encodeHtmlElement(node.tagName, node.attrs, encodedChildren)
        : encodeHtmlFragment(encodedChildren);
}
function encodeHtmlFragment(children) {
    return concat(children ?? []);
}
function encodeHtmlElement(tagName, attrs, children) {
    const open = `<${join(" ", [tagName, encodeAttrs(attrs)])}>`;
    if (isNil(children))
        return open;
    return `${open}${concat(children)}</${tagName}>`;
}
function encodeAttrs(attrs) {
    if (!attrs)
        return null;
    return join(" ", Object.entries(attrs).map(([key, value]) => encodeAttr(key, value)));
}
function encodeAttr(key, value) {
    if (isNil(value))
        return null;
    if (isBool(value))
        return value ? key : null;
    return `${key}="${value}"`;
}
function concat(arr) {
    return join("", arr);
}
function join(sep, arr) {
    return arr.filter(Boolean).join(sep);
}
