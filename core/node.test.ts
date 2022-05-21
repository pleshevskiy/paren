import { assertEquals, assertInstanceOf } from "testing/asserts.ts";

import { Elem, Fragment, TextNode } from "./node.ts";

Deno.test({
  name: "should create text node from string",
  fn: () => {
    const sourceText = "hello world";
    const tn = new TextNode(sourceText);

    assertInstanceOf(tn, TextNode);
    assertEquals(tn.innerText, sourceText);
  },
});

Deno.test({
  name: "should create fragment from array",
  fn: () => {
    const hello = new TextNode("hello");
    const world = new TextNode("world");

    const frag = new Fragment([hello, world]);

    assertInstanceOf(frag, Fragment);
    assertEquals(frag.children, [hello, world]);
  },
});

Deno.test({
  name: "should create element",
  fn: () => {
    const child = new Elem("p", {}, [new TextNode("hello world")]);
    const el = new Elem("div", { class: "hello" }, [child]);

    assertEquals(el.tagName, "div");
    assertEquals(el.attrs, { class: "hello" });
    assertEquals(el.children, [child]);
  },
});
