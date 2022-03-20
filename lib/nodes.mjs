import { intoArr, isNil } from "./lang.mjs";
export function Et(tagName, ...texts) {
    return new Elem(tagName).withText(texts);
}
export function Ea(tagName, attrs, children) {
    const el = new Elem(tagName);
    if (attrs)
        el.addAttrs(attrs);
    if (children)
        el.addChildren(children);
    return el;
}
export function E(tagName, children) {
    return new Elem(tagName).withChildren(children);
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
    withText(texts) {
        this.addText(texts);
        return this;
    }
    addText(texts) {
        this.addChildren(intoArr(texts)
            .map((t) => t.trim())
            .join(" "));
    }
    withChildren(nodes) {
        this.addChildren(nodes);
        return this;
    }
    addChildren(nodes) {
        intoArr(nodes).forEach((n) => this.addChild(n));
    }
    addChild(node) {
        if (isNil(this.#children))
            this.#children = [];
        this.#children.push(node);
    }
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
        this.addAttrs(attrs);
        return this;
    }
    addAttrs(attrs) {
        Object.entries(attrs).forEach(([key, value]) => this.addAttr(key, value));
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
