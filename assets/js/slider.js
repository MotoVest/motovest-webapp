/*
   MOTOVEST SLIDER
   slider.js
 */

document.addEventListener("DOMContentLoaded", () => {

  const AUTOPLAY_MS = 5000;
  const SWIPE_THRESHOLD = 45;  

  document.querySelectorAll("[data-slider]").forEach(slider => {

    const track = slider.querySelector("[data-slider-track]");
    const slides = slider.querySelectorAll("[data-slide]");
    const prevBtn = slider.querySelector("[data-slider-prev]");
    const nextBtn = slider.querySelector("[data-slider-next]");
    const dotsContainer = slider.querySelector("[data-slider-dots]");

    if (!track || slides.length === 0) return;

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      if (dotsContainer) dotsContainer.style.display = "none";
      return;
    }

    let currentIndex = 0;
    let autoplay = null;

    /*  Dots */
    let dots = [];
    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot" + (index === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
        dot.addEventListener("click", () => manualGo(index));
        dotsContainer.appendChild(dot);
      });
      dots = dotsContainer.querySelectorAll(".slider-dot");
    }

    /*  Render  */
    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      updateSlider();
    }

    function manualGo(index) {
      goToSlide(index);
      restartAutoplay();
    }

    /*  Autoplay (always on, never pauses on hover)  */
    function startAutoplay() {
      if (autoplay) return;
      autoplay = setInterval(() => goToSlide(currentIndex + 1), AUTOPLAY_MS);
    }

    function stopAutoplay() {
      clearInterval(autoplay);
      autoplay = null;
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    /*  Controls  */
    nextBtn?.addEventListener("click", () => manualGo(currentIndex + 1));
    prevBtn?.addEventListener("click", () => manualGo(currentIndex - 1));

    /*  Pause only when the tab is hidden  */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    /*  Touch / swipe  */
    let startX = 0;
    let dragging = false;

    slider.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
      dragging = true;
    }, { passive: true });

    slider.addEventListener("touchend", e => {
      if (!dragging) return;
      dragging = false;
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        manualGo(currentIndex + (delta < 0 ? 1 : -1));
      }
    });

    /*  Init  */
    updateSlider();
    startAutoplay();

  });
});