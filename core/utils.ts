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
