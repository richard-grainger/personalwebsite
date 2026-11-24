// Contact form: submits in the background and shows the result inline.
// Without JavaScript the form still posts normally and the server
// redirects back to /about/?sent=1 (or ?sent=0) with the result.

(function () {
  const form = document.querySelector(".contact-form");
  if (!form) return;
  const status = form.querySelector(".contact-status");
  const button = form.querySelector("button[type=submit]");

  const show = (text, ok) => {
    status.textContent = text;
    status.dataset.state = ok ? "ok" : "error";
  };

  // Result of a no-JavaScript submission
  const sent = new URLSearchParams(location.search).get("sent");
  if (sent === "1") show("Thanks, your message has been sent.", true);
  if (sent === "0") show("Sorry, that didn't go through. Please try again.", false);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    button.disabled = true;
    show("Sending…", true);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.ok) {
        form.reset();
        show("Thanks, your message has been sent.", true);
      } else {
        show(result.error || "Sorry, that didn't go through. Please try again.", false);
      }
    } catch {
      show("Sorry, that didn't go through. Please check your connection and try again.", false);
    } finally {
      button.disabled = false;
      if (window.turnstile) window.turnstile.reset();
    }
  });
})();
