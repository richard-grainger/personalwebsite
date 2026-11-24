---
layout: base.njk
title: About
permalink: /about/
---
<div class="page">

<img class="portrait" src="/assets/headshot.jpg" alt="Dr Richard Grainger">

## About

Richard Grainger is the co-founder and CTO of HTMS, developing next-generation ceramic matrix composites for aerospace, motorsport and energy storage.

Richard's path into materials science started with badminton, not a lab. A schoolboy fascination with the carbon fibre in his racket led him to a degree and then a PhD in self-healing, self-sensing carbon fibre composites, materials that repair their own micro-cracks in aerospace.
From there he moved through the Advanced Manufacturing Research Centre, Rolls-Royce and the National Composite Centre, working at the sharp end of advanced materials development.

HTMS was born from a gap he kept running into: there was no high-quality UK or European ceramic composite he could actually buy.
Richard and co-founder Danilo Di Salvo built the company from a garage, a feasibility grant and a conviction that the problem was solvable. HTMS has its own production facility in Malmesbury, taking chemistries that protect aircraft, vehicles and battery systems from extreme heat from lab bench to scale.

Richard is a hands-on technical leader who thinks across disciplines: chemistry, physics, maths and biology all sit inside a single composite material, and he has spent his career finding the connections between them.

{% if site.turnstileSiteKey %}
<section class="contact" id="contact">
<h2>Get in touch</h2>
<p>For speaking, writing or collaboration enquiries, use the form below or connect on <a href="https://www.linkedin.com/in/dr-richard-grainger">LinkedIn</a>.</p>
<form class="contact-form" action="/api/contact" method="post">
  <div class="contact-row">
    <label>Name<input type="text" name="name" autocomplete="name" maxlength="100" required></label>
    <label>Email<input type="email" name="email" autocomplete="email" maxlength="200" required></label>
  </div>
  <label>Message<textarea name="message" rows="6" maxlength="5000" required></textarea></label>
  <label class="contact-trap" aria-hidden="true">Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
  <div class="cf-turnstile" data-sitekey="{{ site.turnstileSiteKey }}" data-size="flexible"></div>
  <div class="contact-actions">
    <button type="submit">Send message</button>
    <p class="contact-status" role="status" aria-live="polite"></p>
  </div>
</form>
</section>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script src="/js/contact.js" defer></script>
{% else %}
Richard can be contacted through his [LinkedIn profile.](https://www.linkedin.com/in/dr-richard-grainger)
{% endif %}

</div>

