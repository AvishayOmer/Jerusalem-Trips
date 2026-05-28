
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

})();