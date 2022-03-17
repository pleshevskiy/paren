import { Elem } from "./nodes.js";
export interface Renderer<T> {
    render(node: Elem | Promise<Elem>): Promise<T>;
}
