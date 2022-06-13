import { assertEquals } from "testing/asserts.ts";
import { HtmlStrRenderer } from "../ren/html_str.ts";
import { MarkdownParser } from "./md.ts";

const ren = new HtmlStrRenderer();

// Misc

Deno.test({
  name: "should skip empty line",
  fn: () => {
    const par = new MarkdownParser();
    assertEquals(ren.render(par.parse("\n")), "");
    assertEquals(ren.render(par.parse("\r\n")), "");
    assertEquals(ren.render(par.parse("\n\r\n")), "");
    assertEquals(ren.render(par.parse("\n          \n")), "");
  },
});

// ATX Header

Deno.test({
  name: "should parse empty ATX header",
  fn: () => {
    const par = new MarkdownParser();
    const res = par.parse("#");
    assertEquals(ren.render(res), "<h1></h1>");
  },
});

Deno.test({
  name: "should parse ATX header with text",
  fn: () => {
    const par = new MarkdownParser();
    assertEquals(ren.render(par.parse("# hello")), "<h1>hello</h1>");
    assertEquals(ren.render(par.parse("# hello#")), "<h1>hello#</h1>");
  },
});

Deno.test({
  name: "should parse ATX header with specific level",
  fn: () => {
    const par = new MarkdownParser();
    assertEquals(ren.render(par.parse("# hello")), "<h1>hello</h1>");
    assertEquals(ren.render(par.parse("## hello")), "<h2>hello</h2>");
    assertEquals(ren.render(par.parse("### hello")), "<h3>hello</h3>");
    assertEquals(ren.render(par.parse("#### hello")), "<h4>hello</h4>");
    assertEquals(ren.render(par.parse("##### hello")), "<h5>hello</h5>");
    assertEquals(ren.render(par.parse("###### hello")), "<h6>hello</h6>");
  },
});

Deno.test({
  name: "should parse ATX header if line contains additional spaces",
  fn: () => {
    const par = new MarkdownParser();
    assertEquals(ren.render(par.parse(" # hello")), "<h1>hello</h1>");
    assertEquals(ren.render(par.parse("  # hello")), "<h1>hello</h1>");
    assertEquals(ren.render(par.parse("   # hello")), "<h1>hello</h1>");
  },
});

Deno.test({
  name: "should parse ATX header with closing sequence",
  fn: () => {
    const par = new MarkdownParser();
    assertEquals(ren.render(par.parse("# #")), "<h1></h1>");
    assertEquals(ren.render(par.parse("# hello #")), "<h1>hello</h1>");
    assertEquals(ren.render(par.parse("# hello #########")), "<h1>hello</h1>");
    assertEquals(ren.render(par.parse("# hello #        ")), "<h1>hello</h1>");
    assertEquals(ren.render(par.parse("###### hello #")), "<h6>hello</h6>");
  },
});

Deno.test({
  name: "should parse many headers with text",
  fn: () => {
    const par = new MarkdownParser();

    const input = `\
# hello
## world
### this is
#### my world!`;

    assertEquals(
      ren.render(par.parse(input)),
      "<h1>hello</h1><h2>world</h2><h3>this is</h3><h4>my world!</h4>",
    );
  },
});

// Paragraph

Deno.test({
  name: "should parse paragraph",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(ren.render(par.parse("hello")), "<p>hello</p>");
  },
});

Deno.test({
  name: "should parse paragraph with softbreak",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse(`\
hello
world`)),
      "<p>hello world</p>",
    );
  },
});

Deno.test({
  name: "should parse many big paragraphs",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse(`\
hello
world`)),
      "<p>hello world</p>",
    );

    assertEquals(
      ren.render(par.parse(`\
Lorem Ipsum is simply dummy text of the printing
and typesetting industry.

Lorem Ipsum has been the industry's standard dummy
text ever since the 1500s, when an unknown printer
took a galley of type and scrambled it to make a
type specimen book.

It has survived not only five centuries, but also
the leap into electronic typesetting, remaining
essentially unchanged.`)),
      "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>",
    );
  },
});

// Link

Deno.test({
  name: "should parse link",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse("[]()")),
      '<p><a href="#"></a></p>',
    );
    assertEquals(
      ren.render(par.parse("[hello]()")),
      '<p><a href="#">hello</a></p>',
    );
    assertEquals(
      ren.render(par.parse("[hello]()")),
      '<p><a href="#">hello</a></p>',
    );
  },
});

Deno.test({
  name: "should parse link destination",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse("[](/hello)")),
      '<p><a href="/hello"></a></p>',
    );
    assertEquals(
      ren.render(par.parse("[](/hello?key=value&key2=value2)")),
      '<p><a href="/hello?key=value&key2=value2"></a></p>',
    );
    assertEquals(
      ren.render(par.parse("[hello](https://example.com)")),
      '<p><a href="https://example.com">hello</a></p>',
    );
    assertEquals(
      ren.render(par.parse("[hello](mailto:john@example.com)")),
      '<p><a href="mailto:john@example.com">hello</a></p>',
    );
    assertEquals(
      ren.render(par.parse("[](/привет)")),
      '<p><a href="/%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82"></a></p>',
    );
    assertEquals(
      ren.render(par.parse("[](</hello world>)")),
      '<p><a href="/hello%20world"></a></p>',
    );
    assertEquals(
      ren.render(par.parse("[](</hello world?key=value value2&key2=value3>)")),
      '<p><a href="/hello%20world?key=value%20value2&key2=value3"></a></p>',
    );
  },
});

Deno.test({
  name: "should parse link title",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse("[](/hello 'hello')")),
      '<p><a href="/hello" title="hello"></a></p>',
    );
    assertEquals(
      ren.render(par.parse('[hello](/hello "world")')),
      '<p><a href="/hello" title="world">hello</a></p>',
    );
    assertEquals(
      ren.render(par.parse('[hello](</hello world> "hello world")')),
      '<p><a href="/hello%20world" title="hello world">hello</a></p>',
    );
  },
});

// List

Deno.test({
  name: "should parse list with empty items",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse("-")),
      "<ul><li></li></ul>",
    );
    assertEquals(
      ren.render(par.parse("- ")),
      "<ul><li></li></ul>",
    );
  },
});

Deno.test({
  name: "should parse list if line contains additional spaces",
  fn: () => {
    const expected = "<ul><li>hello</li></ul>";
    const par = new MarkdownParser();
    assertEquals(ren.render(par.parse(" - hello")), expected);
    assertEquals(ren.render(par.parse("  - hello")), expected);
    assertEquals(ren.render(par.parse("   - hello")), expected);
  },
});

Deno.test({
  name: "should not display a single paragraph in the list",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse("- hello")),
      "<ul><li>hello</li></ul>",
    );
    assertEquals(
      ren.render(par.parse(`\
- hello
world`)),
      "<ul><li>hello world</li></ul>",
    );
    assertEquals(
      ren.render(par.parse(`\
- hello
  world`)),
      "<ul><li>hello world</li></ul>",
    );
  },
});

Deno.test({
  name: "should parse many items in the list",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse(`\
- hello
- world`)),
      "<ul><li>hello</li><li>world</li></ul>",
    );
  },
});

// Doc

Deno.test({
  name: "should parse all document from file",
  fn: () => {
    const par = new MarkdownParser();

    assertEquals(
      ren.render(par.parse(Deno.readTextFileSync("test_data/doc_01.md"))),
      "<h1>What is Lorem Ipsum?</h1><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><ul><li>Sed in orci non lorem luctus dictum ac vel justo.</li><li>Nunc non leo vel dolor fringilla imperdiet.</li><li>Proin finibus ipsum quis molestie porta.</li></ul>",
    );

    assertEquals(
      ren.render(par.parse(Deno.readTextFileSync("test_data/doc_02.md"))),
      "<h1>What is Lorem Ipsum?</h1><ul><li>Sed in orci non lorem luctus dictum ac vel justo.</li><li>Nunc non leo vel dolor fringilla imperdiet.</li><li>Proin finibus ipsum quis molestie porta.</li></ul>",
    );
  },
});
