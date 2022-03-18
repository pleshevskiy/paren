import { Nil, Nilable } from "./lang.js";
export declare type AnyNode = TextNode | Elem | Frag | Nil | false;
export declare class TextNode extends String {
}
export declare function F(...children: AnyNode[]): Frag;
export declare class Frag {
    #private;
    constructor();
    get children(): Nilable<AnyNode[]>;
    withText(text: string): this;
    addText(text: string): void;
    withChildren(...nodes: AnyNode[]): this;
    addChild(node: AnyNode): void;
}
export declare function E(tagName: string, attrs: ElemAttrs, ...children: AnyNode[]): Elem;
export declare type ElemAttrs = Record<string, unknown>;
export declare class Elem extends Frag {
    #private;
    constructor(tagName: string);
    get tagName(): string;
    get attrs(): Record<string, unknown>;
    withAttrs(attrs: Record<string, unknown>): Elem;
    withAttr(name: string, value: unknown): Elem;
    addAttr(name: string, value: unknown): void;
    addChild(node: AnyNode): void;
}
