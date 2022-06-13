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

export * from "../core/node.ts";

import {
  AnyNode,
  Attrs,
  Elem,
  ElemTagName,
  Fragment,
  FragmentNode,
  isFragment,
  TextNode,
} from "../core/node.ts";
import { isNotSkip, isNum, isStr, Skipable, toArr } from "../core/utils.ts";

export function F(children: Skipable<EChild>[]): Fragment {
  return new Fragment(
    children.filter(isNotSkip).flatMap((c) =>
      normFragmentChild(normElemChild(c))
    ),
  );
}

type EAttrs = Attrs | Attrs[];
type ETextNode = string | number | TextNode;
type EChild = ETextNode | Fragment | Elem;

export function E(
  tagName: ElemTagName,
  attrs: EAttrs,
  children?: ETextNode | Skipable<EChild>[],
): Elem {
  return new Elem(
    tagName,
    mergeAttrs(attrs ?? []),
    toArr(children ?? []).filter(isNotSkip).map(normElemChild),
  );
}

function mergeAttrs(attrs: EAttrs): Attrs {
  return !Array.isArray(attrs)
    ? attrs
    : attrs.reduce((acc, attrs) => ({ ...acc, ...attrs }), {} as Attrs);
}

function normFragmentChild(node: AnyNode): FragmentNode | FragmentNode[] {
  return isFragment(node) ? node.children : node;
}

function normElemChild(node: EChild): AnyNode {
  return isStr(node) || isNum(node) ? new TextNode(String(node)) : node;
}
