/*
MOTOVEST MAIN JAVASCRIPT
main.js
*/

document.addEventListener("DOMContentLoaded", () => {

  /*
  INITIALIZE LUCIDE ICONS
  */
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /*
  MOBILE MENU (open / close + icon swap)
  Rebuilds the <i> each time, because lucide.createIcons()
  replaces <i data-lucide> with an <svg>, so the original
  <i> no longer exists to re-query.
  */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    const setMenuIcon = name => {
      menuToggle.innerHTML = `<i data-lucide="${name}"></i>`;
      if (window.lucide) window.lucide.createIcons();
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      setMenuIcon(isOpen ? "x" : "menu");
    });

    // Close the menu when any nav link is tapped
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-label", "Open menu");
        setMenuIcon("menu");
      });
    });
  }

  /*
  STICKY HEADER
  */
  const header = document.querySelector(".site-header");

  const handleHeaderScroll = () => {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();

  /*
  SMOOTH SCROLL (in-page anchors only)
  */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  /*
  CAREERS APPLICATION MODAL CONTROLLER
  Handles ONLY opening/closing the modal and stamping the chosen role.
  The form submission itself is handled by forms.js (#job-application-form),
  so it validates and shows the same inline confirmation as every other
  form — no alert(), and no double-handling.
  */
  const modal = document.getElementById("application-modal");
  const dynamicRoleTitle = document.getElementById("dynamic-role-title");
  const appliedRoleInput = document.getElementById("applied-role-input");
  const applicationForm = document.getElementById("job-application-form");
  const applyButtons = document.querySelectorAll(".apply-trigger");
  const closeElements = document.querySelectorAll("[data-close-modal]");

  if (modal) {
    // Open modal and capture the role from the clicked button
    applyButtons.forEach(button => {
      button.addEventListener("click", () => {
        const roleName = button.getAttribute("data-role") || "General Application";

        if (dynamicRoleTitle) dynamicRoleTitle.textContent = roleName;
        if (appliedRoleInput) appliedRoleInput.value = roleName;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // prevent background scroll
      });
    });

    // Close modal (X button, dimmed overlay, or Esc)
    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // restore scrolling
      if (applicationForm) {
        applicationForm.reset();
        const msg = applicationForm.querySelector(".form-message");
        if (msg) { msg.style.display = "none"; msg.textContent = ""; }
      }
    };

    closeElements.forEach(element => {
      element.addEventListener("click", closeModal);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    // After a successful submit (event from forms.js), let the
    // confirmation show briefly, then close the modal on its own.
    if (applicationForm) {
      applicationForm.addEventListener("form-success", () => {
        setTimeout(closeModal, 2000);
      });
    }
  }

  /*
  FAQ ACCORDION
  */
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const faqItem = button.parentElement;
      if (faqItem) {
        faqItem.classList.toggle("open");
      }
    });
  });

  /*
  FAQ SEARCH
  */
  const faqSearch = document.querySelector(".faq-search input");

  if (faqSearch) {
    faqSearch.addEventListener("keyup", function() {
      const value = this.value.toLowerCase();
      const faqItems = document.querySelectorAll(".faq-item");

      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(value) ? "block" : "none";
      });
    });
  }

  /*
  FAQ CATEGORY FILTER
  Buttons carry data-filter ("all", "eligibility", …);
  items carry data-category. Clicking a button shows only
  the matching items (or all).
  */
  const categoryButtons = document.querySelectorAll(".faq-category");

  if (categoryButtons.length) {
    categoryButtons.forEach(button => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        categoryButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        document.querySelectorAll(".faq-item").forEach(item => {
          const category = item.getAttribute("data-category");
          const show = filter === "all" || category === filter;
          item.style.display = show ? "block" : "none";
        });
      });
    });
  }

  /*
  VEHICLE FILTER (vehicles page)
  Buttons carry data-filter ("all", "ford", "toyota"); cards carry
  data-category. Guarded by .filter-btn so it only runs on the
  vehicles page and never clashes with the FAQ filter.
  */
  const vehicleFilterButtons = document.querySelectorAll(".filter-btn");

  if (vehicleFilterButtons.length) {
    const vehicleCards = document.querySelectorAll(".vehicle-card");

    vehicleFilterButtons.forEach(button => {
      button.addEventListener("click", () => {
        vehicleFilterButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        vehicleCards.forEach(card => {
          const category = card.getAttribute("data-category");
          const show = filter === "all" || category === filter;
          card.style.display = show ? "block" : "none";
        });
      });
    });
  }

  /*
  SCROLL ANIMATIONS
  */
  const animatedElements = document.querySelectorAll(
    ".benefit-card, .vehicle-card, .step-card, .impact-card, .office-card, .team-card, .document-card, .testimonial-card, .journey-card, .partner-card, .stat-card, .role-card"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /*
  ACTIVE NAVIGATION (scroll-spy)
  Only runs on pages whose nav uses in-page anchors.
  On multipage navs (drivers.html, about.html, …) the links are
  page links, so we leave the HTML-set .active class untouched.
  */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navItems.length) {
    const setActiveNavLink = () => {
      let current = "";

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });

      navItems.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
      });
    };

    window.addEventListener("scroll", setActiveNavLink);
    setActiveNavLink();
  }

  /*
  CURRENT YEAR (handles one or many .current-year elements)
  */
  document.querySelectorAll(".current-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});