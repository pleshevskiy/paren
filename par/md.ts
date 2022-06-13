import { AnyNode, Elem, Fragment, TextNode } from "../core/node.ts";
import { isNil, Nilable } from "../core/utils.ts";
import { Parser } from "./types.ts";

const RE_EMPTY_LINE = /^[ ]*\r?\n/;

const RE_OPEN_ATX_HEADING = /^[ ]{0,3}(#{1,6})([ ]|$)/;
const RE_CLOSE_ATX_HEADING = /(^|[ ]+)#*[ ]*$/;

const RE_LIST_ITEM = /^[ ]{0,3}([-+*])([ ]|$)/;

// TODO: make better regex for destination
const RE_LINK = /\[([\s\S]*?)]\((?:([^\s]*)|<(.+?)>)(?: ('|")(.+?)\4)?\)/;

export class MarkdownParser implements Parser {
  parse(input: string): AnyNode {
    const astDoc: AstDocument = { kind: AstKind.Document, content: [] };

    let readStr = input;
    while (readStr.length) {
      const newReadStr = skipEmptyLine(readStr) ??
        parseAtxHeading(astDoc, readStr) ??
        parseList(astDoc, readStr) ??
        parseParagraph(astDoc, readStr);
      if (isNil(newReadStr)) break;
      readStr = newReadStr;
    }

    return new Fragment(astDoc.content.map(DocChild));
  }
}

function List(ast: AstList): Elem {
  // switch (ast.kind)
  return BulletList(ast);
}

function BulletList(ast: AstBulletList): Elem {
  return new Elem("ul", {}, ast.content.map(ListItem));
}

function ListItem(ast: AstListItem): Elem {
  return new Elem(
    "li",
    {},
    ast.content.length === 1 && ast.content[0].kind === AstKind.Paragraph
      ? ast.content[0].content.map(InlineContent)
      : ast.content.map(DocChild),
  );
}

function DocChild(ast: AstDocumentChild): Elem {
  switch (ast.kind) {
    case AstKind.AtxHeading:
      return Heading(ast);
    case AstKind.Paragraph:
      return Paragraph(ast);
    case AstKind.List:
      return List(ast);
  }
}

function Heading(ast: AstAtxHeading): Elem {
  return new Elem(`h${ast.level}`, {}, ast.content.map(InlineContent));
}

function Paragraph(ast: AstParagraph): Elem {
  return new Elem("p", {}, ast.content.map(InlineContent));
}

function InlineContent(ast: AstInlineContent): AnyNode {
  return ast.kind === AstKind.Link ? Link(ast) : Text(ast);
}

function Link(ast: AstLink): Elem {
  const attrs: Record<string, string> = { href: ast.destination || "#" };
  if (ast.title) attrs.title = ast.title;

  return new Elem("a", attrs, ast.content.map(Text));
}

function Text(ast: AstText): TextNode {
  return new TextNode(ast.content);
}

// parse utils

function skipEmptyLine(readStr: string): string | null {
  const match = RE_EMPTY_LINE.exec(readStr);
  if (isNil(match)) return null;
  return readStr.slice(match[0].length);
}

function parseAtxHeading(ast: AstDocument, readStr: string): string | null {
  const match = RE_OPEN_ATX_HEADING.exec(readStr);
  if (isNil(match)) return null;

  readStr = readStr.slice(match[0].length);

  const atxHeading: AstAtxHeading = {
    kind: AstKind.AtxHeading,
    level: match[1].length as HeadingLevel,
    content: [],
  };
  ast.content.push(atxHeading);

  if (match[2].length === 0) return readStr;

  const endMatch = RE_CLOSE_ATX_HEADING.exec(readStr);

  const headingInlineContent = !isNil(endMatch)
    ? readStr.slice(0, endMatch.index)
    : readStr.includes("\n")
    ? readStr.slice(0, readStr.indexOf("\n") + 1)
    : readStr;

  parseInlineContent(atxHeading, headingInlineContent);

  return readStr.slice(
    headingInlineContent.length + (endMatch?.[0].length ?? 0),
  );
}

function parseList(ast: AstDocument, readStr: string): string | null {
  if (!readStr.length) return null;

  let listMatch = RE_LIST_ITEM.exec(readStr);
  if (isNil(listMatch)) return null;

  const astList: AstBulletList = {
    kind: AstKind.List,
    type: AstListType.Bullet,
    bulletChar: listMatch[1] as ListBulletChar,
    content: [],
  };
  ast.content.push(astList);

  do {
    const astListItem: AstListItem = {
      kind: AstKind.ListItem,
      content: [],
    };
    astList.content.push(astListItem);

    readStr = readStr.slice(listMatch[0].length);

    const newReadStr = // parseAtxHeading(astList, readStr) ??
      // parseList(astList, readStr) ??
      parseParagraph(astListItem, readStr);
    if (isNil(newReadStr)) break;
    readStr = newReadStr;

    listMatch = RE_LIST_ITEM.exec(readStr);
  } while (!isNil(listMatch));

  return readStr;
}

function parseParagraph(
  ast: AstDocument | AstListItem,
  readStr: string,
): string | null {
  if (!readStr.length) return null;

  const paragraph: AstParagraph = {
    kind: AstKind.Paragraph,
    content: [],
  };

  let paragraphInlineContent = "";
  while (readStr && !RE_EMPTY_LINE.test(readStr)) {
    const listMatch = RE_LIST_ITEM.exec(readStr);
    if (!isNil(listMatch)) break;
    const newPart = readStr.includes("\n")
      ? readStr.slice(0, readStr.indexOf("\n") + 1)
      : readStr;
    paragraphInlineContent += newPart;
    readStr = readStr.slice(newPart.length);
  }

  if (paragraphInlineContent.length) {
    ast.content.push(paragraph);
    parseInlineContent(paragraph, paragraphInlineContent);
  }

  return readStr;
}

function parseInlineContent(
  ast: AstAtxHeading | AstParagraph,
  readStr: string,
): string | null {
  if (!readStr.length) return null;

  const linkMatch = RE_LINK.exec(readStr);
  if (!isNil(linkMatch)) {
    const astLink: AstLink = {
      kind: AstKind.Link,
      destination: encodeURI(linkMatch[3] ?? linkMatch[2]),
      title: linkMatch[5],
      content: [],
    };

    // 1. parse before link
    parseText(ast, readStr.slice(0, linkMatch.index));

    // 2. create link and parse inner content for link
    ast.content.push(astLink);
    parseText(astLink, linkMatch[1]);

    // 3. parse rest text
    return parseInlineContent(
      ast,
      readStr.slice(linkMatch.index + linkMatch[0].length),
    );
  } else {
    return parseText(ast, readStr);
  }
}

function parseText(
  ast: AstAtxHeading | AstParagraph | AstLink,
  readStr: string,
): string | null {
  if (!readStr.length) return null;

  const parts = readStr.split("\n").filter(Boolean).map(
    (textPart): AstText => ({
      kind: AstKind.Text,
      content: textPart.trimStart(),
    }),
  );

  ast.content.push(...parts);

  return "";
}

// AST

type AstDocument = BaseAstItem<AstKind.Document, AstDocumentChild[]>;
type AstDocumentChild = AstAtxHeading | AstBulletList | AstParagraph | AstList;

type AstList = AstBulletList; // | AstOrderedList

enum AstListType {
  Bullet,
  // Ordered,
}

type ListBulletChar = "-" | "+" | "*";

type AstListItem = BaseAstItem<AstKind.ListItem, AstListItemChild[]>;

type AstListItemChild = AstDocumentChild;

interface AstAtxHeading
  extends BaseAstItem<AstKind.AtxHeading, AstInlineContent[]> {
  level: HeadingLevel;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface AstBulletList extends BaseAstItem<AstKind.List, AstListItem[]> {
  type: AstListType.Bullet;
  bulletChar: ListBulletChar;
}

type AstParagraph = BaseAstItem<AstKind.Paragraph, AstInlineContent[]>;

type AstInlineContent = AstText | AstLink;

interface AstLink extends BaseAstItem<AstKind.Link, AstText[]> {
  destination: string;
  title: Nilable<string>;
}

type AstText = BaseAstItem<AstKind.Text, string>;

interface BaseAstItem<K extends AstKind, Cont> {
  kind: K;
  content: Cont;
}

enum AstKind {
  Document,
  AtxHeading,
  Paragraph,
  List,
  ListItem,
  Link,
  Text,
}
