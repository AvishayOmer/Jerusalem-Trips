function initApp() {

  /* =========================
     HERO + SLIDERS
  ========================= */
  if (typeof initHeroSlider === "function") initHeroSlider();
  if (typeof initImageSlider === "function") initImageSlider();

  /* =========================
     SCROLL ANIMATIONS
  ========================= */
  if (typeof initScrollFX === "function") initScrollFX();

  /* =========================
     GALLERY
  ========================= */
  if (typeof initGallery === "function") initGallery();

  /* =========================
     MODAL
  ========================= */
  if (typeof initModal === "function") initModal();

  /* =========================
     BACK TO TOP
  ========================= */
  if (typeof initBackToTop === "function") initBackToTop();

  /* =========================
     MENU
  ========================= */
  if (typeof initMenu === "function") initMenu();

  /* =========================
     ACCESSIBILITY
  ========================= */
  if (typeof initAccessibility === "function") initAccessibility();

  console.log("🚀 MAIN INIT LOADED");
}

/* =========================
   START APP (SAFE)
========================= */
document.addEventListener("DOMContentLoaded", initApp);