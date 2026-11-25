// Contact form handler for richard-grainger.co.uk
//
// Receives POSTs from the About page form at /api/contact, checks the
// Cloudflare Turnstile token, and emails the message to the single
// verified address set in wrangler.toml. The address never appears on
// the website, and no third-party service sees the message.
//
// Needs (see worker/contact/README.md):
//   - Email Routing enabled on the domain, with the destination verified
//   - secret TURNSTILE_SECRET  (wrangler secret put TURNSTILE_SECRET)

import { EmailMessage } from "cloudflare:email";

const FROM = "website@richard-grainger.co.uk";
const TO = "rich.v.grainger@gmail.com"; // must match destination_address in wrangler.toml
const BACK = "https://richard-grainger.co.uk/about/";

const LIMITS = { name: 100, email: 200, message: 5000 };

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
    }

    const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
    const reply = (ok, error, status) =>
      wantsJson
        ? Response.json(ok ? { ok: true } : { ok: false, error }, { status: status || (ok ? 200 : 400) })
        : Response.redirect(`${BACK}?sent=${ok ? 1 : 0}#contact`, 303);

    let form;
    try {
      form = await request.formData();
    } catch {
      return reply(false, "That didn't look like a form submission.");
    }

    const field = (key) => String(form.get(key) || "").trim();
    const name = field("name");
    const email = field("email");
    const message = field("message");

    // Honeypot: real visitors never see or fill this field.
    // Pretend it worked so bots learn nothing.
    if (field("website")) return reply(true);

    if (!name || !email || !message) return reply(false, "Please fill in your name, email and message.");
    if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
      return reply(false, "That message is too long.");
    }
    if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
      return reply(false, "Please check your email address.");
    }

    // Bot check
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: field("cf-turnstile-response"),
        remoteip: request.headers.get("CF-Connecting-IP") || "",
      }),
    }).then((r) => r.json()).catch(() => ({ success: false }));

    if (!verify.success) return reply(false, "The spam check failed. Please refresh the page and try again.");

    // Build and send the email
    const raw = buildMime({
      from: `Website contact form <${FROM}>`,
      to: TO,
      replyTo: `${clean(name)} <${email}>`,
      subject: `Website message from ${clean(name)}`,
      text:
        `${message}\n\n` +
        `--\n` +
        `From: ${clean(name)} <${email}>\n` +
        `Sent via the contact form on richard-grainger.co.uk\n`,
    });

    try {
      await env.EMAIL.send(new EmailMessage(FROM, TO, raw));
    } catch (err) {
      console.error("send failed", err);
      return reply(false, "Sorry, the message couldn't be sent. Please try again later.", 502);
    }

    return reply(true);
  },
};

// Strip anything that could break out of an email header.
function clean(value) {
  return value.replace(/[\r\n<>"]/g, " ").replace(/\s+/g, " ").trim();
}

// UTF-8 safe encoders for headers and body.
function b64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
function encodeHeader(text) {
  return /^[\x20-\x7e]*$/.test(text) ? text : `=?UTF-8?B?${b64(text)}?=`;
}
function encodeAddress(address) {
  const m = address.match(/^(.*)<(.+)>$/);
  return m ? `${encodeHeader(m[1].trim())} <${m[2]}>` : address;
}

function buildMime({ from, to, replyTo, subject, text }) {
  const body = b64(text).replace(/.{76}/g, "$&\r\n");
  return [
    `From: ${encodeAddress(from)}`,
    `To: ${to}`,
    `Reply-To: ${encodeAddress(replyTo)}`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@richard-grainger.co.uk>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    body,
  ].join("\r\n");
}
