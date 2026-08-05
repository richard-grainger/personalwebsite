# richardgrainger.co.uk — site source

Personal site of Dr Richard Grainger. Built with [Eleventy](https://www.11ty.dev/),
hosted on Cloudflare Pages. Articles are plain Markdown files.

## Publishing a new article

1. Create a new file in `src/articles/`, e.g. `2026-09-14-my-article.md`.
2. Start it with front matter, then write in Markdown:

   ```
   ---
   title: "Your article title"
   date: 2026-09-14
   summary: "One or two sentences shown on the homepage."
   ---

   Article text here...
   ```

3. Commit the file (on GitHub: **Add file → Create new file** in the
   `src/articles/` folder works entirely in the browser).
4. Cloudflare Pages rebuilds and publishes automatically within a minute or two.

## Scheduled publishing (queueing articles)

The `date` in an article's front matter is its publication date, and you can
set it to whatever you like — including the future. Future-dated articles
are held back entirely (no page, not on the homepage, not in the feed) until
their date arrives.

Because the site only changes when it rebuilds, a queued article appears at
the **first rebuild on or after its date**. Two ways to make that happen:

- **Manual:** commit anything (even a whitespace tweak) and the site
  rebuilds. Fine if you're already visiting weekly.
- **Automatic:** `.github/workflows/scheduled-rebuild.yml` rebuilds the site
  every Monday at 08:00 UTC. It needs a one-off setup — create a Deploy Hook
  in Cloudflare (Pages project -> Settings -> Builds & deployments -> Deploy
  hooks), then add its URL as a GitHub secret named `CLOUDFLARE_DEPLOY_HOOK`
  (repo -> Settings -> Secrets and variables -> Actions). Full steps are in
  comments at the top of that workflow file.

So for a weekly drip: commit all your written articles now, dated on
successive Mondays, do the deploy-hook setup once, and they'll publish
themselves one per week. Dates are treated as midnight UTC, so the Monday
08:00 rebuild publishes anything dated that Monday or earlier.

## Changing the look

Everything visual lives in `src/css/style.css` — colours, fonts and spacing
are variables in the block at the top of the file.

Site title, subtitle and description live in `src/_data/site.json`.
Set `url` in that file to the real domain once it's attached (it's used by
the RSS feed).

## Cloudflare Pages settings

When creating the Pages project:

| Setting          | Value            |
| ---------------- | ---------------- |
| Framework preset | Eleventy         |
| Build command    | `npx @11ty/eleventy` |
| Output directory | `_site`          |

## Running locally (optional)

Requires Node.js. `npm install` once, then `npm run serve` and open the
address it prints. Not needed for publishing — Cloudflare builds the site
for you.

## Structure

```
src/
  _data/site.json      site title, subtitle, description, URL
  _includes/base.njk   page shell (header, nav, footer)
  _includes/article.njk  article page layout
  index.njk            homepage (lists articles, newest first)
  about.md             about page
  articles/            one Markdown file per article
  css/style.css        the entire visual identity
```
