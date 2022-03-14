import { Node } from "./node.mjs";

export interface Renderer<T> {
  render(node: Node): Promise<T>;
}
