import { assertEquals } from "testing/asserts.ts";

import { concat, isNil, isSkip, join } from "./utils.ts";

Deno.test({
  name: "should check value on nil",
  fn: () => {
    assertEquals(isNil(null), true);
    assertEquals(isNil(undefined), true);
    assertEquals(isNil(0), false);
    assertEquals(isNil(""), false);
    assertEquals(isNil(false), false);
    assertEquals(isNil({}), false);
    assertEquals(isNil([]), false);
  },
});

Deno.test({
  name: "should check value on skip",
  fn: () => {
    assertEquals(isSkip(null), true);
    assertEquals(isSkip(undefined), true);
    assertEquals(isSkip(0), false);
    assertEquals(isSkip(""), false);
    assertEquals(isSkip(false), true);
    assertEquals(isSkip({}), false);
    assertEquals(isSkip([]), false);
  },
});

Deno.test({
  name: "should return joined array",
  fn: () => {
    assertEquals(join(" ", ["hello", "world"]), "hello world");
    assertEquals(
      join(" ", ["hello", "", null, undefined, false, "world"]),
      "hello world",
    );
  },
});

Deno.test({
  name: "should return concated array",
  fn: () => {
    assertEquals(concat(["hello", "world"]), "helloworld");
    assertEquals(
      concat(["hello", "", null, undefined, false, "world"]),
      "helloworld",
    );
  },
});
