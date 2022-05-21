import { assertEquals } from "testing/asserts.ts";
import { E, F, TextNode } from "../core/node.ts";

import { StrRenderer } from "./str.ts";

Deno.test({
  name: "should render text node",
  fn: () => {
    const tn = new TextNode("hello world");

    const ren = new StrRenderer();
    const res = ren.render(tn);

    assertEquals(res, "hello world");
  },
});

Deno.test({
  name: "should render element",
  fn: () => {
    const el = E("p", [], "hello world");

    const ren = new StrRenderer();
    const res = ren.render(el);

    assertEquals(res, "<p>hello world</p>");
  },
});

Deno.test({
  name: "should render empty fragment as empty string",
  fn: () => {
    const frag = F([]);

    const ren = new StrRenderer();
    const res = ren.render(frag);

    assertEquals(res, "");
  },
});

Deno.test({
  name: "should render fragment",
  fn: () => {
    const frag = F([
      "hello world",
      E("div", { class: "hello" }),
      E("p", [], "world"),
    ]);

    const ren = new StrRenderer();
    const res = ren.render(frag);

    assertEquals(res, 'hello world<div class="hello"></div><p>world</p>');
  },
});

Deno.test({
  name: "should recursive render elements",
  fn: () => {
    const layout = E("body", [], [
      E("div", { id: "root" }, [
        E("p", [], "hello world"),
      ]),
    ]);

    const ren = new StrRenderer();
    const res = ren.render(layout);

    assertEquals(res, '<body><div id="root"><p>hello world</p></div></body>');
  },
});

Deno.test({
  name: "should render attributes",
  fn: () => {
    const layout = E("body", { class: "body-lock" }, [
      E("div", { id: "root" }, [
        E("p", { class: "first" }, "hello world"),
      ]),
    ]);

    const ren = new StrRenderer();
    const res = ren.render(layout);

    assertEquals(
      res,
      '<body class="body-lock"><div id="root"><p class="first">hello world</p></div></body>',
    );
  },
});

Deno.test({
  name: "should render default doctype if root node is html",
  fn: () => {
    const layout = E("html", []);

    const ren = new StrRenderer();
    const res = ren.render(layout);

    assertEquals(res, "<!doctype html><html></html>");
  },
});

Deno.test({
  name: "should render custom doctype if root node is html",
  fn: () => {
    const layout = E("html", []);

    const ren = new StrRenderer({
      doctype:
        'html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"',
    });
    const res = ren.render(layout);

    assertEquals(
      res,
      '<!doctype html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html></html>',
    );
  },
});

Deno.test({
  name: "should force render doctype if root node is not html",
  fn: () => {
    const layout = E("body", [], []);

    const ren = new StrRenderer({ forceRenderDoctype: true });
    const res = ren.render(layout);

    assertEquals(res, "<!doctype html><body></body>");
  },
});