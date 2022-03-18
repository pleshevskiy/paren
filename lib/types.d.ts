import { Elem } from "./nodes.js";
export interface Renderer<T> {
    render(node: Elem): T;
}
