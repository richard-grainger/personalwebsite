---
layout: base.njk
title: About
permalink: /about/
---
<div class="about">

<header class="about-intro">
<div class="about-intro-text">
<h1>About</h1>
<p class="about-lede">I'm Richard Grainger, an engineer who makes materials that survive heat. I co-founded <a href="https://htms-composites.com">HTMS Composites</a>, where I'm CTO, and I write here about how advanced materials work, how they are made, and why good ones so often struggle to reach the world.</p>
</div>
<img class="portrait" src="{{ site.portraits[0] }}" alt="Dr Richard Grainger" width="400" height="500" data-portraits="{{ site.portraits | join: ',' }}">
</header>

<section class="about-section">
<h2>What I work on</h2>

At HTMS we develop <a href="/articles/cmc/">ceramic matrix composites</a> and <a href="/articles/inorganic-polymers/">inorganic polymer composites</a>: materials that protect aircraft, vehicles and battery systems from extreme heat. I look after technology, production and special projects, which in practice means taking chemistries from the lab bench to our production facility in Malmesbury, and making them work at scale.

The writing on this site comes in two kinds. **Primers** explain how a material or process works, from first principles. **Perspectives** are my view on where the field is heading, usually through a story from engineering history and what it means for us now.
</section>

<section class="about-section">
<h2>Before HTMS</h2>

I've worked at the sharp end of advanced materials development at the <a href="https://www.amrc.co.uk">Advanced Manufacturing Research Centre</a>, <a href="https://www.rolls-royce.com">Rolls-Royce</a> and the <a href="https://www.nccuk.com">National Composites Centre</a>, including qualifying new materials for aerospace.

HTMS was born from a gap I kept running into: there was no high-quality UK or European ceramic composite I could actually buy. My co-founder Danilo Di Salvo and I built the company from a garage, a feasibility grant and a conviction that the problem was solvable.
</section>

<section class="about-section">
<h2>Background</h2>

My path into materials science started with badminton, not a lab. A schoolboy fascination with the carbon fibre in my racket led to a degree and then a PhD at the <a href="https://www.sheffield.ac.uk">University of Sheffield</a> on self-healing, self-sensing carbon fibre composites: materials that repair their own micro-cracks.

I'm a Chartered Engineer, and I've always been drawn to the places where disciplines meet. Chemistry, physics, maths and biology all sit inside a single composite material, and I've spent my career finding the connections between them.
</section>

{% if site.turnstileSiteKey %}
<section class="about-section contact" id="contact">
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
<section class="about-section" id="contact">
<h2>Get in touch</h2>
<p>I can be contacted through <a href="https://www.linkedin.com/in/dr-richard-grainger">LinkedIn</a>.</p>
</section>
{% endif %}

</div>
<script>
  (function () {
    const img = document.querySelector("img.portrait");
    const list = (img?.dataset.portraits || "").split(",").filter(Boolean);
    if (list.length > 1) img.src = list[Math.floor(Math.random() * list.length)];
  })();
</script>
