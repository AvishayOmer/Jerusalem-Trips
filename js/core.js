(() => {
"use strict";

window.App = {

  state: {
    darkMode: localStorage.getItem("darkMode") === "true",
    uiLocked: false
  },

  el: {},

  init() {
    this.cacheDOM();
    this.applyInitialState();
    this.bindEvents();
    this.bindUI();
    console.log("🚀 LEVEL 10 UI ACTIVE");
  },

  cacheDOM() {
    this.el = {
      body: document.body,

      backToTop: document.getElementById("backToTop"),
      whatsapp: document.getElementById("whatsapp-chat"),
      modeToggle: document.getElementById("modeToggle"),

      contactModal: document.getElementById("contactModal"),
      openModal: document.getElementById("openContactBtn"),
      closeModal: document.querySelector(".close-modal"),

      accessibilityBtn: document.getElementById("accessibility-btn"),
      accessibilityMenu: document.getElementById("accessibility-menu"),

      mobileMenu: document.getElementById("mobileMenu")
    };
  },

  applyInitialState() {
    if (this.state.darkMode) {
      this.el.body.classList.add("dark-mode");
    }
  },

  bindEvents() {

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

    this.el.whatsapp?.addEventListener("click", () => {
      window.open("https://wa.me/972503251251", "_blank");
    });

    this.el.modeToggle?.addEventListener("click", () => {
      this.toggleDarkMode();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeAll();
    });
  },

  bindUI() {

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

    this.el.accessibilityBtn?.addEventListener("click", () => {
      this.el.accessibilityMenu?.classList.toggle("show");
    });

    window.toggleMenu = () => {
      this.el.mobileMenu?.classList.toggle("active");
    };
  },

  toggleDarkMode() {
    this.state.darkMode = !this.state.darkMode;
    this.el.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", this.state.darkMode);
  },

  openModal(el) {
    if (!el) return;

    el.style.display = "flex";
    this.el.body.style.overflow = "hidden";
  },

  closeModal(el) {
    if (!el) return;

    el.style.display = "none";
    this.el.body.style.overflow = "";
  },

  closeAll() {
    this.closeModal(this.el.contactModal);
    this.el.accessibilityMenu?.classList.remove("show");
    this.el.mobileMenu?.classList.remove("active");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});

})();