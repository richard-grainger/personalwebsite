---
title: "An example article: what goes where"
date: 2037-08-01
summary: "A placeholder article showing the format — front matter at the top, Markdown below. Delete me when you publish your first real piece."
category: Primer
---

This is a placeholder article so you can see how publishing works. Every
article is a single plain-text file in the `src/articles/` folder, named
however you like (a `YYYY-MM-DD-slug.md` convention keeps the folder tidy).

The block at the very top between the `---` lines is called *front matter*.
It holds three things: the **title** (shown on the page and the homepage),
the **date** (controls ordering — newest first), and an optional **summary**
(shown under the title on the homepage).

Everything below the front matter is the article itself, written in
Markdown. A quick tour of what you'll actually use:

## A section heading

Paragraphs are just paragraphs — leave a blank line between them. You can
use *italics* for emphasis, **bold** sparingly, and [links like this](https://example.com).

- Bulleted lists start with a hyphen
- Like this

1. Numbered lists work too
2. Like this

> Block quotes are indented like this — useful for quoting a paper or a
> standard.

Inline `code or chemical formulae in monospace` use backticks, and
subscripts can be written with HTML when needed: Al<sub>2</sub>O<sub>3</sub>.

That's essentially the whole vocabulary. Write the file, add it to the
folder, and the site does the rest.
