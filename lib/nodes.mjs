import { isNil } from "./lang.mjs";
export class TextNode extends String {
}
export function F(...children) {
    return new Frag().withChildren(children);
}
export class Frag {
    #children;
    constructor() {
        this.#children = undefined;
    }
    get children() {
        return this.#children;
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
        if (isNil(this.#children))
            this.#children = [];
        this.#children.push(node);
    }
}
export function E(tagName, attrs, ...children) {
    return new Elem(tagName).withAttrs(attrs).withChildren(children);
}
export class Elem extends Frag {
    #tagName;
    #attrs;
    #isSelfClosed;
    constructor(tagName) {
        super();
        this.#tagName = tagName;
        this.#attrs = {};
        this.#isSelfClosed = selfClosedTagNames.has(tagName);
    }
    get tagName() {
        return this.#tagName;
    }
    get attrs() {
        return this.#attrs;
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
    addChild(node) {
        if (this.#isSelfClosed)
            throw new Error("You cannot add child to self closed element");
        super.addChild(node);
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
