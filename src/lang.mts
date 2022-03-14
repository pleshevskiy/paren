export function isNil<T>(v: Nilable<T>): v is Nil {
  return v == null;
}

export type Nullable<T> = T | null;

export type Nilable<T> = T | Nil;

export type Nil = null | undefined;

export function isBool(v: unknown): v is boolean {
  return typeof v === "boolean";
}
