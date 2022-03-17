import { Renderer } from "./types.js";
import { Elem } from "./nodes.js";
export declare class StrRenderer implements Renderer<string> {
    render(node: Elem | Promise<Elem>): Promise<string>;
}
