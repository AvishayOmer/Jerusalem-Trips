(() => {
"use strict";

function initApp() {

  console.log("🚀 MAIN BOOTSTRAP START");

  /* =========================
     SAFE CORE INIT
  ========================= */
  if (window.App && typeof window.App.init === "function") {
    window.App.init();
  }

  /* =========================
     MOBILE MENU FIX (NO DUPLICATES)
  ========================= */
  window.toggleMenu = function () {
    const menu = document.getElementById("mobileMenu");
    if (!menu) return;
    menu.classList.toggle("active");
  };

  /* =========================
     BACKUP SCROLL ANIMATION
  ========================= */
  const items = document.querySelectorAll(
    "section, .service-card, .review-card"
  );

  const run = () => {
    items.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 80) {
        el.classList.add("show");
      }
    });
  };

  window.addEventListener("scroll", run, { passive: true });
  run();

  /* =========================
     HERO SAFETY (ONLY IF NEEDED)
  ========================= */
  const slides = document.querySelectorAll(".hero-slide");

  if (slides.length > 1) {
    let i = 0;

    setInterval(() => {
      slides[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
    }, 7000);
  }

  /* =========================
     IMAGE SLIDER SAFETY
  ========================= */
  const img = document.getElementById("image-slider");

  if (img) {
    const images = [
      "images/1.jpg","images/2.jpg","images/3.jpg",
      "images/4.jpg","images/5.jpg","images/6.jpg",
      "images/7.jpg","images/8.jpg","images/9.jpg",
      "images/10.jpg","images/11.jpg","images/12.jpg"
    ];

    let i = 0;

    setInterval(() => {
      i = (i + 1) % images.length;
      img.src = images[i];
    }, 5000);
  }

  console.log("✅ MAIN BOOTSTRAP READY");
}

document.addEventListener("DOMContentLoaded", initApp);

})();