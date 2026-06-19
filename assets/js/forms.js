/*
   MOTOVEST FORMS
   forms.js

   One shared handler powers every form. Each form validates its
   required fields + any email field, shows an inline message
   (no alerts), disables the button while submitting, and posts to
   the URL in its data-endpoint attribute — or simulates success
   while the backend is still being built.

   On success the message auto-dismisses (fades out) after a few
   seconds; error messages stay until the next submit attempt.
 */

const MESSAGE_DISMISS_MS = 5000; // how long a success message stays before fading

document.addEventListener("DOMContentLoaded", () => {

  // selector  ->  success message
  const FORMS = [
    [".contact-form",       "Thank you for contacting MotoVest. We'll get back to you shortly."],
    [".driver-form",        "Application submitted successfully. A MotoVest representative will contact you shortly."],
    [".newsletter-form",    "You have successfully subscribed to MotoVest updates."],
    [".waitlist-form",      "You've been added to the MotoVest vehicle waitlist."],
    ["#job-application-form", "Application received — thank you! We'll be in touch if there's a strong fit."]
  ];

  FORMS.forEach(([selector, message]) => {
    document.querySelectorAll(selector).forEach(form => attachHandler(form, message));
  });

});


/* ----------------------------------------------------------- */
/*  Core handler                                               */
/* ----------------------------------------------------------- */

function attachHandler(form, successMessage) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearMessage(form);

    // 1. Required fields (covers whatever has the `required` attribute)
    const hasEmpty = [...form.querySelectorAll("[required]")]
      .some(field => !field.value.trim());

    if (hasEmpty) {
      showMessage(form, "Please complete all required fields.", "error");
      return;
    }

    // 2. Email format (if the form has an email field)
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && !validateEmail(emailField.value.trim())) {
      showMessage(form, "Please enter a valid email address.", "error");
      emailField.focus();
      return;
    }

    // 3. Submit (real POST if configured, otherwise simulated)
    const button = form.querySelector('button[type="submit"], button:not([type])');
    const originalText = button ? button.textContent : "";

    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }

    try {
      await submitForm(form);
      showMessage(form, successMessage, "success");
      form.reset();
      autoDismiss(form);            // success message fades out after a few seconds
      // Announce success so other scripts can react (e.g. the careers modal auto-closes)
      form.dispatchEvent(new CustomEvent("form-success", { bubbles: true }));
    } catch (err) {
      showMessage(form, "Something went wrong. Please try again.", "error");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  });
}


/* ----------------------------------------------------------- */
/*  Submission                                                 */
/* ----------------------------------------------------------- */

async function submitForm(form) {
  const endpoint = form.getAttribute("data-endpoint");
  const data = new FormData(form);

  /*
    NO BACKEND YET → simulate a successful submission.
    To go live: add  data-endpoint="https://your-api/endpoint"
    to the <form>, and DELETE this simulation block.
  */
  if (!endpoint) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return;
  }

  // Real submission. FormData posts as multipart/form-data — the
  // browser sets the Content-Type automatically, so don't set it here.
  // (If your API wants JSON instead, swap `body` for
  //  JSON.stringify(Object.fromEntries(data)) and add the header.)
  const response = await fetch(endpoint, {
    method: "POST",
    body: data,
    headers: { "Accept": "application/json" }
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  return response;
}


/* ----------------------------------------------------------- */
/*  Inline messages                                            */
/* ----------------------------------------------------------- */

function getMessageEl(form) {
  let el = form.querySelector(".form-message");
  if (!el) {
    el = document.createElement("p");
    el.className = "form-message";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    form.appendChild(el);
  }
  return el;
}

function showMessage(form, text, type) {
  clearTimeout(form._msgTimer);     // cancel any pending auto-dismiss
  const el = getMessageEl(form);
  el.textContent = text;
  el.classList.remove("success", "error");
  el.classList.add(type);
  el.style.transition = "";
  el.style.opacity = "";
  el.style.display = "block";
}

function clearMessage(form) {
  clearTimeout(form._msgTimer);
  const el = form.querySelector(".form-message");
  if (el) {
    el.textContent = "";
    el.classList.remove("success", "error");
    el.style.opacity = "";
    el.style.transition = "";
    el.style.display = "none";
  }
}

/* Fade the message out, then clear it, after MESSAGE_DISMISS_MS */
function autoDismiss(form, delay = MESSAGE_DISMISS_MS) {
  clearTimeout(form._msgTimer);
  form._msgTimer = setTimeout(() => {
    const el = form.querySelector(".form-message");
    if (!el) return;

    el.style.transition = "opacity .4s ease";
    el.style.opacity = "0";

    setTimeout(() => clearMessage(form), 400);
  }, delay);
}


/* ----------------------------------------------------------- */
/*  Email validation                                           */
/* ----------------------------------------------------------- */

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}