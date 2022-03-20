import { Nil, Nilable } from "./lang.js";
export declare function Et(tagName: string, ...texts: string[]): Elem;
export declare function Ea(tagName: string, attrs?: ElemAttrs, children?: AnyNode | AnyNode[]): Elem;
export declare function E(tagName: string, children: AnyNode | AnyNode[]): Elem;
export declare function F(...children: AnyNode[]): Frag;
export declare type AnyNode = TextNode | Elem | Frag | Nil | false;
export declare type TextNode = string;
export declare class Frag {
    #private;
    constructor();
    get children(): Nilable<AnyNode[]>;
    withText(texts: TextNode | TextNode[]): this;
    addText(texts: TextNode | TextNode[]): void;
    withChildren(nodes: AnyNode | AnyNode[]): this;
    addChildren(nodes: AnyNode | AnyNode[]): void;
    addChild(node: AnyNode): void;
}
export declare type ElemAttrs = Record<string, unknown>;
export declare class Elem extends Frag {
    #private;
    constructor(tagName: string);
    get tagName(): string;
    get attrs(): Record<string, unknown>;
    withAttrs(attrs: ElemAttrs): Elem;
    addAttrs(attrs: ElemAttrs): void;
    addAttr(name: string, value: unknown): void;
    addChild(node: AnyNode): void;
}
