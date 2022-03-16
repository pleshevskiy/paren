import { Renderer } from "./types.mjs";
import { Elem } from "./nodes.mjs";
export declare class StrRenderer implements Renderer<string> {
    render(node: Elem | Promise<Elem>): Promise<string>;
}
