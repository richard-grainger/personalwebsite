// Eleventy configuration.
// You should rarely need to touch this file.

import { generateOgCards } from "./og.js";

export default function (eleventyConfig) {
  let ogArticles = [];

  // Copy the stylesheet straight through to the built site.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // "articles" collection: every Markdown file in src/articles, newest first.
  // Articles dated in the future are excluded from the build, so you can
  // commit pieces ahead of time and they'll appear once their date arrives
  // (at the next site rebuild — see "Scheduled publishing" in the README).
  eleventyConfig.addCollection("articles", (collectionApi) => {
    const now = new Date();
    const articles = collectionApi
      .getFilteredByGlob("src/articles/*.md")
      .filter((article) => article.date <= now)
      .sort((a, b) => b.date - a.date);
    ogArticles = articles.map((a) => ({
      slug: a.fileSlug,
      title: a.data.title,
      summary: a.data.summary,
      category: a.data.category,
      date: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(a.date),
    }));
    return articles;
  });

  // After each build, draw a sharing card for every published article
  // (see og.js). They appear when an article link is posted on LinkedIn, X etc.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const n = await generateOgCards(ogArticles, dir.output);
    console.log(`[og] ${n} article sharing cards written`);
  });

  // Date formatting filter, e.g. "5 August 2026".
  eleventyConfig.addFilter("readableDate", (date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date)
  );

  // Current year, used in the footer.
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  // Machine-readable date for <time> elements and the RSS feed.
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
}
