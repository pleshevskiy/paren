import { assertEquals, assertInstanceOf } from "testing/asserts.ts";

import { E, Elem, F, Fragment, TextNode } from "./node.ts";

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
  name: "should create element",
  fn: () => {
    const child = new Elem("p", {}, [new TextNode("hello world")]);
    const el = new Elem("div", { class: "hello" }, [child]);

    assertEquals(el.tagName, "div");
    assertEquals(el.attrs, { class: "hello" });
    assertEquals(el.children, [child]);
  },
});

Deno.test({
  name: "should create element via util",
  fn: () => {
    const child = E("p", [], "hello world");
    const el = E("div", { class: "hello" }, [child]);

    assertEquals(el.tagName, "div");
    assertEquals(el.attrs, { class: "hello" });
    assertEquals(el.children, [child]);
  },
});
