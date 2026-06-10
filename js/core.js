(() => {
"use strict";

window.App = {

  state: {
    darkMode: localStorage.getItem("darkMode") === "true",
    uiLocked: false
  },

  init() {
    this.cacheDOM();
    this.applyInitialState();
    this.bindEvents();
    this.bindUI();
    console.log("🚀 LEVEL 10 UI ACTIVE");
  },

  /* ================= DOM ================= */

  cacheDOM() {
    this.el = {
      body: document.body,

      backToTop: document.getElementById("backToTop"),
      whatsapp: document.getElementById("whatsapp-chat"),
      modeToggle: document.getElementById("modeToggle"),

      contactModal: document.getElementById("contactModal"),
      openModal: document.getElementById("openContactModal"),
      closeModal: document.querySelector(".close"),

      accessibilityBtn: document.getElementById("accessibility-btn"),
      accessibilityMenu: document.getElementById("accessibility-menu"),

      mobileMenu: document.getElementById("mobileMenu")
    };
  },

  /* ================= INIT STATE ================= */

  applyInitialState() {
    if (this.state.darkMode) {
      this.el.body.classList.add("dark-mode");
    }
  },

  /* ================= EVENTS ================= */

  bindEvents() {

    /* BACK TO TOP */
    this.el.backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
      const show = window.scrollY > 250;

      if (!this.el.backToTop) return;

      this.el.backToTop.style.opacity = show ? "1" : "0";
      this.el.backToTop.style.transform = show
        ? "translateY(0)"
        : "translateY(25px)";
    });

    /* WHATSAPP */
    this.el.whatsapp?.addEventListener("click", () => {
      window.open("https://wa.me/972503251251", "_blank");
    });

    /* DARK MODE */
    this.el.modeToggle?.addEventListener("click", () => {
      this.toggleDarkMode();
    });

    /* ESC GLOBAL */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeAll();
    });
  },

  /* ================= UI ================= */

  bindUI() {

    /* MODAL (NETFLIX STYLE) */
    this.el.openModal?.addEventListener("click", () => {
      this.openModal(this.el.contactModal);
    });

    this.el.closeModal?.addEventListener("click", () => {
      this.closeModal(this.el.contactModal);
    });

    window.addEventListener("click", (e) => {
      if (e.target === this.el.contactModal) {
        this.closeModal(this.el.contactModal);
      }
    });

    /* ACCESSIBILITY */
    this.el.accessibilityBtn?.addEventListener("click", () => {
      this.el.accessibilityMenu?.classList.toggle("show");
    });

    /* MOBILE MENU */
    window.toggleMenu = () => {
      this.el.mobileMenu?.classList.toggle("open");
    };
  },

  /* ================= DARK MODE ================= */

  toggleDarkMode() {
    this.state.darkMode = !this.state.darkMode;

    this.el.body.classList.toggle("dark-mode");

    localStorage.setItem("darkMode", this.state.darkMode);
  },

  /* ================= MODAL ANIMATION ================= */

  openModal(el) {
    if (!el) return;

    el.style.display = "flex";
    el.style.opacity = "0";
    el.style.transform = "scale(0.9) translateY(40px)";
    this.el.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      el.style.transition = "0.4s cubic-bezier(.2,.8,.2,1)";
      el.style.opacity = "1";
      el.style.transform = "scale(1) translateY(0)";
      this.el.body.style.filter = "blur(4px)";
    });
  },

  closeModal(el) {
    if (!el) return;

    el.style.transition = "0.3s ease";
    el.style.opacity = "0";
    el.style.transform = "scale(0.9) translateY(30px)";

    this.el.body.style.filter = "none";
    this.el.body.style.overflow = "";

    setTimeout(() => {
      el.style.display = "none";
    }, 300);
  },

  /* ================= GLOBAL CLOSE ================= */

  closeAll() {
    this.closeModal(this.el.contactModal);
    this.el.accessibilityMenu?.classList.remove("show");
    this.el.mobileMenu?.classList.remove("open");
  }
};

/* ================= START ================= */

document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});

})();
