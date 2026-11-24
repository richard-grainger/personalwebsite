# Contact form Worker

Handles the About page contact form. Messages are checked with Cloudflare
Turnstile and emailed to one verified inbox using Cloudflare Email Routing.
The inbox address is never shown on the website.

The form only appears on the site once `turnstileSiteKey` is filled in
`src/_data/site.json`. Until then the About page shows the LinkedIn line.

## One-off setup (Cloudflare dashboard, about 10 minutes)

1. **Email Routing**: richard-grainger.co.uk -> Email -> Email Routing -> Get
   started. Let Cloudflare add the MX/SPF records it asks for.
   Under **Destination addresses**, add `rich.v.grainger@gmail.com` and click
   the verification link Cloudflare emails to it.
   (You don't need to create any routing rules unless you also want to
   *receive* mail at an @richard-grainger.co.uk address.)

2. **Turnstile**: Account home -> Turnstile -> Add widget.
   Name: `richard-grainger.co.uk`, hostnames: `richard-grainger.co.uk` and
   `www.richard-grainger.co.uk`, mode: Managed. Copy the **site key** and
   **secret key**.

3. **Deploy the Worker**: Workers & Pages -> Create -> Import a repository ->
   `richard-grainger/personalwebsite`.
   - Project name: `rg-contact`
   - Root directory: `worker/contact`
   - Build command: leave empty. Deploy command: `npx wrangler deploy`
   After it deploys: the Worker -> Settings -> Variables and Secrets -> Add
   -> type **Secret**, name `TURNSTILE_SECRET`, value = the Turnstile secret key.
   (Alternatively from a terminal in `worker/contact`:
   `npx wrangler deploy` then `npx wrangler secret put TURNSTILE_SECRET`.)

4. **Switch the form on**: put the Turnstile **site key** (not the secret) in
   `src/_data/site.json` as `"turnstileSiteKey": "0x4AAAA..."` and commit.

## Testing

Send yourself a message from the About page. It arrives from
`website@richard-grainger.co.uk`; pressing Reply in Gmail replies to the
visitor. If nothing arrives, check the Worker's Logs tab in Cloudflare and
Gmail's spam folder (mark it "Not spam" once).
