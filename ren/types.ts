import { AnyNode } from "../core/node.ts";

export interface Renderer<T> {
  render(node: AnyNode): T;
}
