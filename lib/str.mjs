import { TextNode } from "./node.mjs";
import { isBool, isNil } from "./lang.mjs";
export class StrRenderer {
    async render(node) {
        return encodeNode(node);
    }
}
function encodeAnyNode(node) {
    return node instanceof TextNode ? encodeTextNode(node) : encodeNode(node);
}
function encodeTextNode(node) {
    return node.text;
}
function encodeNode(node) {
    return encodeHtml(node.tagName, node.attrs, node.children?.map(encodeAnyNode));
}
function encodeHtml(tagName, attrs, children) {
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
