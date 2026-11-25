// Generates a social sharing card (1200×630 PNG) for each article at build
// time, in the site's warm editorial style. Cards are written to
// _site/assets/og/<slug>.png and referenced from each article's <head>.
//
// Uses satori (layout to SVG) and resvg (SVG to PNG). No browser needed.

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);
const font = (pkg, file) =>
  fs.readFile(path.join(path.dirname(require.resolve(`${pkg}/package.json`)), "files", file));

const C = {
  paper: "#faf8f4",
  ink: "#24221f",
  muted: "#6e6962",
  faint: "#8f8981",
  rule: "#e6e0d6",
  accent: "#a8462a",
  wash: "#f3e7e1",
  chip: "#efeae2",
};

// Tiny element helper so the layout reads like HTML
const h = (type, style, ...children) => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.flat().filter((c) => c !== null && c !== false) },
});

function titleSize(title) {
  const n = title.length;
  if (n <= 24) return 92;
  if (n <= 40) return 80;
  if (n <= 60) return 68;
  return 58;
}

function card({ title, summary, category, date }) {
  const isPerspective = (category || "").toLowerCase() === "perspective";
  // Outer 1200×630 canvas; inner box sized explicitly (satori is unreliable
  // with padding on the root element).
  return h(
    "div",
    { width: 1200, height: 630, background: C.paper, alignItems: "flex-start", justifyContent: "flex-start" },
    h(
    "div",
    {
      width: 1008,
      height: 494,
      marginLeft: 96,
      marginTop: 72,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    // Top row: mark + name, category + date
    h(
      "div",
      { alignItems: "center", justifyContent: "space-between" },
      h(
        "div",
        { alignItems: "center", gap: 18 },
        h(
          "div",
          {
            width: 56, height: 56, borderRadius: 28, background: C.ink, color: C.paper,
            alignItems: "center", justifyContent: "center",
            fontFamily: "Plex Mono", fontWeight: 500, fontSize: 20,
          },
          "RG"
        ),
        h("div", { fontFamily: "Newsreader", fontWeight: 500, fontSize: 32, color: C.ink }, "Dr Richard Grainger")
      ),
      category
        ? h(
            "div",
            {
              fontFamily: "Plex Mono", fontWeight: 500, fontSize: 19, letterSpacing: 2,
              padding: "8px 14px 6px", borderRadius: 4,
              background: isPerspective ? C.wash : C.chip,
              color: isPerspective ? C.accent : C.muted,
            },
            category.toUpperCase()
          )
        : null
    ),
    // Title and standfirst
    h(
      "div",
      { flexDirection: "column", gap: 22 },
      h(
        "div",
        {
          fontFamily: "Newsreader", fontWeight: 500, fontSize: titleSize(title),
          lineHeight: 1.08, letterSpacing: -1, color: C.ink,
        },
        title
      ),
      summary
        ? h(
            "div",
            { fontFamily: "Newsreader", fontStyle: "italic", fontSize: 34, lineHeight: 1.3, color: C.muted, maxWidth: 960 },
            summary.length > 120 ? summary.slice(0, 117).trimEnd() + "…" : summary
          )
        : null
    ),
    // Footer
    h(
      "div",
      {
        justifyContent: "space-between", alignItems: "center",
        borderTop: `1.5px solid ${C.rule}`, paddingTop: 24,
        fontFamily: "Plex Mono", fontSize: 21, color: C.faint,
      },
      h("div", {}, "richard-grainger.co.uk"),
      h("div", { color: C.accent }, date)
    )
  )
  );
}

export async function generateOgCards(articles, outDir) {
  const fonts = [
    { name: "Newsreader", weight: 400, style: "normal", data: await font("@fontsource/newsreader", "newsreader-latin-400-normal.woff") },
    { name: "Newsreader", weight: 500, style: "normal", data: await font("@fontsource/newsreader", "newsreader-latin-500-normal.woff") },
    { name: "Newsreader", weight: 400, style: "italic", data: await font("@fontsource/newsreader", "newsreader-latin-400-italic.woff") },
    { name: "Plex Mono", weight: 400, style: "normal", data: await font("@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff") },
    { name: "Plex Mono", weight: 500, style: "normal", data: await font("@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff") },
  ];

  const dir = path.join(outDir, "assets", "og");
  await fs.mkdir(dir, { recursive: true });

  for (const a of articles) {
    const svg = await satori(card(a), { width: 1200, height: 630, fonts });
    const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
    await fs.writeFile(path.join(dir, `${a.slug}.png`), png);
  }
  return articles.length;
}
