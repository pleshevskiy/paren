import { assertEquals } from "testing/asserts.ts";
import * as a from "./attrs.ts";

Deno.test({
  name: "should return empty attrs object",
  fn: () => {
    assertEquals(a.classNames([]), {});
    assertEquals(a.classNames([false, null, undefined]), {});
  },
});

Deno.test({
  name: "should return class attr",
  fn: () => {
    assertEquals(a.classNames(["hello"]), { class: "hello" });
    assertEquals(a.classNames(["hello", "world"]), { class: "hello world" });
  },
});

Deno.test({
  name: "should return filter skipable and return class attr",
  fn: () => {
    assertEquals(
      a.classNames([
        null && "my",
        undefined && "name",
        "hello",
        false && "world",
      ]),
      { class: "hello" },
    );
  },
});
