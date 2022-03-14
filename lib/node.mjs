import { isNil } from "./lang.mjs";
export class TextNode {
    #text;
    constructor(text) {
        this.#text = text;
    }
    get text() {
        return this.#text;
    }
}
export class Node {
    #tagName;
    #attrs;
    #children;
    #isSelfClosed;
    constructor(tagName) {
        this.#tagName = tagName;
        this.#attrs = {};
        this.#children = undefined;
        this.#isSelfClosed = selfClosedTagNames.has(tagName);
    }
    get tagName() {
        return this.#tagName;
    }
    get attrs() {
        return this.#attrs;
    }
    get children() {
        return this.#children;
    }
    withAttrs(attrs) {
        Object.entries(attrs).forEach(([key, value]) => this.addAttr(key, value));
        return this;
    }
    withAttr(name, value) {
        this.addAttr(name, value);
        return this;
    }
    addAttr(name, value) {
        this.#attrs[name] = value;
    }
    withText(text) {
        this.addText(text);
        return this;
    }
    addText(text) {
        this.addChild(new TextNode(text));
    }
    withChildren(nodes) {
        nodes.forEach((n) => this.addChild(n));
        return this;
    }
    withChild(node) {
        this.addChild(node);
        return this;
    }
    addChild(node) {
        if (this.#isSelfClosed)
            throw new Error("You cannot add child to self closed element");
        if (isNil(this.#children))
            this.#children = [];
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
