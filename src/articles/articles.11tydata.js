// Directory data for articles.
// Future-dated articles get no page at all until their date arrives —
// this stops an unpublished piece being reachable at its URL early.
export default {
  eleventyComputed: {
    permalink: (data) =>
      data.page.date <= new Date() ? `/articles/${data.page.fileSlug}/` : false,
  },
};
