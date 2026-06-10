/* =====================================================
   GLOBAL UI SYSTEM - CLEAN VERSION
   Works on:
   - index.html
   - gallery.html
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ELEMENTS (SAFE GETTERS)
  ========================= */

  const mobileMenu = document.getElementById("mobileMenu");

  const modal = document.getElementById("contactModal");
  const openBtn = document.getElementById("openContactModal");
  const closeBtn = document.querySelector(".close");

  const a11yBtn = document.getElementById("accessibility-btn");
  const a11yMenu = document.getElementById("accessibility-menu");

  const backToTop = document.getElementById("backToTop");

 
  /* =========================
     CONTACT MODAL
  ========================= */

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (modal && e.target === modal) {
      modal.style.display = "none";
    }
  });

  /* =========================
     ACCESSIBILITY MENU
  ========================= */

  if (a11yBtn && a11yMenu) {
    a11yBtn.addEventListener("click", () => {
      a11yMenu.classList.toggle("show");
    });
  }

  /* =========================
     BACK TO TOP
  ========================= */

  if (backToTop) {

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", () => {

      if (window.scrollY > 300) {
        backToTop.style.display = "block";
      } else {
        backToTop.style.display = "none";
      }

    });

  }

});
/* =====================================================
   ACCESSIBILITY SYSTEM (GLOBAL)
===================================================== */

window.App = window.App || {};

window.App.fontSize = window.App.fontSize || 16;

function applyFont() {
  document.body.style.fontSize =
    window.App.fontSize + "px";
}

window.changeFontSize = function (delta) {
  window.App.fontSize += delta;

 if (window.App.fontSize < 12)
  window.App.fontSize = 12;

if (window.App.fontSize > 30)
  window.App.fontSize = 30;

  applyFont();
};

window.toggleHighContrast = function () {
  document.body.classList.toggle("high-contrast");
};

window.toggleGrayscale = function () {
  document.body.classList.toggle("grayscale");
};

window.resetA11y = function () {
  document.body.classList.remove("high-contrast", "grayscale");
  fontSize = 16;
  applyFont();
};

document.addEventListener("DOMContentLoaded", () => {
window.App.fontSize = 16;
  applyFont();
});