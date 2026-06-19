/* 
   MOTOVEST FORMS
   forms.js
*/

document.addEventListener("DOMContentLoaded", () => {

  /* 
     CONTACT FORM
   */

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {

    contactForm.addEventListener("submit", function(e) {

      e.preventDefault();

      const fullName =
        this.querySelector('input[type="text"]')?.value.trim();

      const email =
        this.querySelector('input[type="email"]')?.value.trim();

      const message =
        this.querySelector('textarea')?.value.trim();

      if (!fullName || !email || !message) {

        alert("Please complete all required fields.");

        return;
      }

      if (!validateEmail(email)) {

        alert("Please enter a valid email address.");

        return;
      }

      alert(
        "Thank you for contacting MotoVest. We will get back to you shortly."
      );

      this.reset();

    });

  }

  /* 
     DRIVER APPLICATION FORM
   */

  const driverForm = document.querySelector(".driver-form");

  if (driverForm) {

    driverForm.addEventListener("submit", function(e) {

      e.preventDefault();

      const fullName =
        this.querySelector('input[type="text"]')?.value.trim();

      const email =
        this.querySelector('input[type="email"]')?.value.trim();

      const phone =
        this.querySelector('input[type="tel"]')?.value.trim();

      if (!fullName || !email || !phone) {

        alert(
          "Please complete all required fields before submitting."
        );

        return;
      }

      if (!validateEmail(email)) {

        alert(
          "Please provide a valid email address."
        );

        return;
      }

      alert(
        "Application submitted successfully. A MotoVest representative will contact you shortly."
      );

      this.reset();

    });

  }

  /* 
     NEWSLETTER SUBSCRIPTION
   */

  const newsletterForm =
    document.querySelector(".newsletter-form");

  if (newsletterForm) {

    newsletterForm.addEventListener("submit", function(e) {

      e.preventDefault();

      const email =
        this.querySelector('input[type="email"]')?.value.trim();

      if (!email) {

        alert(
          "Please enter your email address."
        );

        return;
      }

      if (!validateEmail(email)) {

        alert(
          "Please enter a valid email address."
        );

        return;
      }

      alert(
        "You have successfully subscribed to MotoVest updates."
      );

      this.reset();

    });

  }

  /* 
     WAITLIST FORM
   */

  const waitlistForm =
    document.querySelector(".waitlist-form");

  if (waitlistForm) {

    waitlistForm.addEventListener("submit", function(e) {

      e.preventDefault();

      const email =
        this.querySelector('input[type="email"]')?.value.trim();

      if (!email) {

        alert(
          "Please enter your email address."
        );

        return;
      }

      if (!validateEmail(email)) {

        alert(
          "Please enter a valid email address."
        );

        return;
      }

      alert(
        "You've been added to the MotoVest vehicle waitlist."
      );

      this.reset();

    });

  }

});

/* 
   EMAIL VALIDATION
 */

function validateEmail(email) {

  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);

}