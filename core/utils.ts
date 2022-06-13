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

export function concat(arr: Skipable<string>[]): string {
  return join("", arr);
}

export function join(sep: string, arr: Skipable<string>[]): string {
  return arr.filter((item) => !(isSkip(item) || isEmptyStr(item))).join(sep);
}

export type Skipable<T> = T | Skip;

export type Skip = Nil | false;

export function isNotSkip<T>(val: Skipable<T>): val is T {
  return !isSkip(val);
}

export function isSkip(val: unknown): val is Skip {
  return isNil(val) || val === false;
}

export type Nilable<T> = T | Nil;

export type Nil = undefined | null;

export function isNil(val: unknown): val is Nil {
  return val == null;
}

export function isEmptyStr(val: unknown): val is "" {
  return isStr(val) && val.length === 0;
}

export function isStr(val: unknown): val is string {
  return typeof val === "string";
}

export function isNum(val: unknown): val is number {
  return typeof val === "number";
}

export function toArr<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}
