import { Elem } from "./nodes.mjs";

export interface Renderer<T> {
  render(node: Elem): T;
}
