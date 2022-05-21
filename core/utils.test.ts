import { assertEquals } from "testing/asserts.ts";

import { isNil, isSkip } from "./utils.ts";

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
