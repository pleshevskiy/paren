import { Attrs } from "../core/node.ts";
import { isNotSkip, isStr, join, Skipable } from "../core/utils.ts";

export function classNames(vals: string | Skipable<string>[]): Attrs {
  const val = isStr(vals) ? vals : join(" ", vals.filter(isNotSkip));
  return !val.length ? {} : { class: val };
}
