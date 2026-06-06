
(() => {
"use strict";

/* =========================================================
   APP CORE - SINGLE SOURCE OF TRUTH
========================================================= */

window.App = {
  
  state: {
    darkMode: false,
    fontSize: 16,
    grayscale: false,
    highContrast: false
  },

  init() {
    this.cacheDOM();
    this.bindEvents();
    console.log("✅ APP CORE LOADED");
  },

  cacheDOM() {
    this.el = {
      backToTop: document.getElementById("backToTop"),
      whatsapp: document.getElementById("whatsapp-chat"),
      modeToggle: document.getElementById("modeToggle"),
      accessibilityBtn: document.getElementById("accessibility-btn"),
      accessibilityMenu: document.getElementById("accessibility-menu"),
      body: document.body
    };
  },

  bindEvents() {
    /* ================= BACK TO TOP ================= */
    this.el.backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ================= WHATSAPP ================= */
    this.el.whatsapp?.addEventListener("click", () => {
      window.open(
        "https://wa.me/972503251251",
        "_blank"
      );
    });

    /* ================= DARK MODE ================= */
    this.el.modeToggle?.addEventListener("click", () => {
      this.toggleDarkMode();
    });

    /* ================= ACCESSIBILITY TOGGLE ================= */
    this.el.accessibilityBtn?.addEventListener("click", () => {
      this.toggleAccessibilityMenu();
    });

    /* ================= ESC KEY ================= */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals();
      }
    });
  },

  /* =========================================================
     UI ACTIONS
  ========================================================= */

  toggleDarkMode() {
    this.state.darkMode = !this.state.darkMode;
    this.el.body.classList.toggle("dark-mode");
  },

  toggleAccessibilityMenu() {
    const menu = this.el.accessibilityMenu;
    if (!menu) return;

    menu.style.display =
      menu.style.display === "block" ? "none" : "block";
  },

  closeAllModals() {
    document.querySelectorAll(".open").forEach(el => {
      el.classList.remove("open");
    });

    const menu = this.el.accessibilityMenu;
    if (menu) menu.style.display = "none";
  }

};

/* =========================================================
   INIT SAFE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});

})();document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     SAFE SELECTOR
  ========================= */

  const $ = (id) => document.getElementById(id);

  const backToTop = $("backToTop");
  const modeToggle = $("modeToggle");

  const modal = $("contactModal");
  const openModal = $("openContactModal");
  const closeModal = document.querySelector(".close");

  const a11yBtn = $("accessibility-btn");
  const a11yMenu = $("accessibility-menu");

  const mobileMenu = $("mobileMenu");

  /* =========================
     BACK TO TOP (FIXED)
  ========================= */

  if (backToTop) {

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
      backToTop.style.display =
        window.scrollY > 300 ? "block" : "none";
    });

  }

  /* =========================
     DARK MODE
  ========================= */

  if (modeToggle) {

    modeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });

  }

  /* =========================
     MODAL (CONTACT)
  ========================= */

  if (openModal && modal) {
    openModal.addEventListener("click", () => {
      modal.style.display = "block";
    });
  }

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  /* =========================
     ACCESSIBILITY MENU FIX
  ========================= */

  if (a11yBtn && a11yMenu) {
    a11yBtn.addEventListener("click", () => {
      a11yMenu.classList.toggle("show");
    });
  }

  /* =========================
     MOBILE MENU
  ========================= */

  window.toggleMenu = function () {
    if (mobileMenu) {
      mobileMenu.classList.toggle("open");
    }
  };

  /* =========================
     IMAGE SAFETY (gallery + index)
  ========================= */

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("contextmenu", e => e.preventDefault());
    img.setAttribute("draggable", "false");
  });

});