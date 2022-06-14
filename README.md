# Paren

Paren is experemental, radically simple library for parsing and rendering
information. It consists of two parts: ren (Renderer) and par (Parser)

## Ren Design Principles

- Focused on server-side rendering.
- Has a very simple interface for creating components.
- Object-oriented and allows you to change types of rendering without changing
  components.

## Par

Parser was originally developed for my [personal site](https://pleshevski.ru) to
use markdown as page content. It's still in the early stages of development, and
the concept is not well thought out.

# Use Paren

You can try it with [deno](https://deno.land/). Just copy following to your
`import_map.json`

```json
{
  "imports": {
    "paren/": "https://git.pleshevski.ru/pleshevskiy/paren/raw/commit/ac60fc50bfd4d5027925c9077a016697382c667e/"
  }
}
```

or you can use branch
`https://git.pleshevski.ru/pleshevskiy/paren/raw/branch/main/`

> **Note**: Use always a specific commit instead of branch

# License

GNU General Public License v3.0 or later

See [COPYING](./COPYING) to see the full text.
