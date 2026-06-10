(() => {
"use strict";

window.App = {
  state: {
    darkMode: false
  },

  init() {
    this.cacheDOM();
    this.bindEvents();
    console.log("🚀 CORE FIXED + ROOM SYSTEM OK");
  },

  /* ================= DOM ================= */
  cacheDOM() {
    this.el = {
      body: document.body,

      backToTop: document.getElementById("backToTop"),
      whatsapp: document.getElementById("whatsapp-chat"),

      mobileMenu: document.getElementById("mobileMenu"),

      modal: document.getElementById("contactModal"),
      openModal: document.getElementById("floatingContactBtn"),
      closeModal: document.querySelector(".close-modal"),

      accessibilityBtn: document.getElementById("accessibility-btn"),
      accessibilityMenu: document.getElementById("accessibility-menu"),

      room: document.getElementById("room"),
      roomInner: document.getElementById("room-inner")
    };
  },

  /* ================= EVENTS ================= */
  bindEvents() {

    /* BACK TO TOP */
    this.el.backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* WHATSAPP */
    this.el.whatsapp?.addEventListener("click", () => {
      window.open("https://wa.me/972503251251", "_blank");
    });

    /* MODAL OPEN */
    this.el.openModal?.addEventListener("click", () => {
      this.openModal();
    });

    this.el.closeModal?.addEventListener("click", () => {
      this.closeModal();
    });

    window.addEventListener("click", (e) => {
      if (e.target === this.el.modal) {
        this.closeModal();
      }
    });

    /* ESC */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAll();
      }
    });

    /* ACCESSIBILITY */
    this.el.accessibilityBtn?.addEventListener("click", () => {
      this.el.accessibilityMenu?.classList.toggle("show");
    });
  },

  /* ================= ROOM SYSTEM (CRITICAL FIX) ================= */

  openRoom(id) {
    const section = document.getElementById(id);
    if (!section || !this.el.room || !this.el.roomInner) return;

    this.el.roomInner.innerHTML = section.innerHTML;
    this.el.room.style.display = "flex";

    requestAnimationFrame(() => {
      this.el.room.classList.add("show");
    });

    document.body.style.overflow = "hidden";
  },

  closeRoom() {
    if (!this.el.room) return;

    this.el.room.classList.remove("show");

    setTimeout(() => {
      this.el.room.style.display = "none";
      this.el.roomInner.innerHTML = "";
      document.body.style.overflow = "";
    }, 250);
  },

  /* expose globally (חשוב לכפתורים שלך ב-HTML) */
  bindRoomGlobals() {
    window.openRoom = (id) => this.openRoom(id);
    window.closeRoom = () => this.closeRoom();
  },

  /* ================= MODAL ================= */

  openModal() {
    if (!this.el.modal) return;

    this.el.modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  },

  closeModal() {
    if (!this.el.modal) return;

    this.el.modal.style.display = "none";
    document.body.style.overflow = "";
  },

  /* ================= MENU ================= */

  bindMenu() {
    window.toggleMenu = () => {
      this.el.mobileMenu?.classList.toggle("active");
    };
  },

  /* ================= CLOSE ALL ================= */

  closeAll() {
    this.closeRoom();
    this.closeModal();
    this.el.accessibilityMenu?.classList.remove("show");
    this.el.mobileMenu?.classList.remove("active");
  }
};

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
  window.App.bindRoomGlobals();
  window.App.bindMenu();
});

})();