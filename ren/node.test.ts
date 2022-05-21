import { assertEquals, assertInstanceOf } from "testing/asserts.ts";
import { Elem, Fragment, TextNode } from "../core/node.ts";

import { E, F } from "./node.ts";

Deno.test({
  name: "should create fragment via util",
  fn: () => {
    const el = E("p", [], "hello world");
    const innerFrag = F(["inner"]);
    const frag = F(["hello", innerFrag, "world", el]);

    assertInstanceOf(frag, Fragment);
    assertEquals(frag.children, [
      new TextNode("hello"),
      new TextNode("inner"),
      new TextNode("world"),
      el,
    ]);
  },
});

Deno.test({
  name: "should create element via util",
  fn: () => {
    const child = E("p", [], "hello world");
    const el = E("div", { class: "hello" }, [child]);

    assertInstanceOf(el, Elem);
    assertEquals(el.tagName, "div");
    assertEquals(el.attrs, { class: "hello" });
    assertEquals(el.children, [child]);
  },
});
