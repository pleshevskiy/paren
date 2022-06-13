/**
 * Copyright (C) 2022, Dmitriy Pleshevskiy <dmitriy@ideascup.me>
 *
 * This file is part of Paren
 *
 * Paren is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Paren is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Paren.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Nilable } from "./utils.ts";

export type Attrs = Record<string, AttrVal>;
export type AttrEntry = [key: string, value: AttrVal];
export type AttrVal = boolean | string;
export type AnyNode = Fragment | FragmentNode;

export function isTextNode(val: unknown): val is TextNode {
  return val instanceof TextNode;
}

export class TextNode {
  #innerText: string;

  get innerText(): string {
    return this.#innerText;
  }

  constructor(text: string) {
    this.#innerText = text;
  }
}

export function isFragment(val: unknown): val is Fragment {
  return val instanceof Fragment;
}

export type FragmentNode = Elem | TextNode;

export class Fragment {
  #children: FragmentNode[];

  get children(): FragmentNode[] {
    return this.#children;
  }

  constructor(children: FragmentNode[]) {
    this.#children = children;
  }
}

export function isElem(val: unknown): val is Elem {
  return val instanceof Elem;
}

export type ElemTagName =
  | keyof HTMLElementTagNameMap
  | keyof SVGElementTagNameMap;

export class Elem {
  #tagName: ElemTagName;
  #attrs: Attrs;
  #children: AnyNode[];

  get tagName(): ElemTagName {
    return this.#tagName;
  }

  get attrs(): Attrs {
    return this.#attrs;
  }

  get children(): AnyNode[] {
    return this.#children;
  }

  constructor(
    tagName: ElemTagName,
    attrs?: Nilable<Attrs>,
    children?: Nilable<AnyNode[]>,
  ) {
    this.#tagName = tagName;
    this.#attrs = attrs ?? {};
    this.#children = children ?? [];
  }
}
