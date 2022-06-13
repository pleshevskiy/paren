import { AnyNode } from "../core/node.ts";

export interface Parser {
  parse(input: string): AnyNode;
}
