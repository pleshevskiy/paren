import { Attrs } from "../core/node.ts";
import { isNotSkip, join, Skipable } from "../core/utils.ts";

export function classNames(vals: Skipable<string>[]): Attrs {
  const val = join(" ", vals.filter(isNotSkip));
  return !val.length ? {} : { class: val };
}
