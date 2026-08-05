// Eleventy configuration.
// You should rarely need to touch this file.

export default function (eleventyConfig) {
  // Copy the stylesheet straight through to the built site.
  eleventyConfig.addPassthroughCopy("src/css");

  // "articles" collection: every Markdown file in src/articles, newest first.
  // Articles dated in the future are excluded from the build, so you can
  // commit pieces ahead of time and they'll appear once their date arrives
  // (at the next site rebuild — see "Scheduled publishing" in the README).
  eleventyConfig.addCollection("articles", (collectionApi) => {
    const now = new Date();
    return collectionApi
      .getFilteredByGlob("src/articles/*.md")
      .filter((article) => article.date <= now)
      .sort((a, b) => b.date - a.date);
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
