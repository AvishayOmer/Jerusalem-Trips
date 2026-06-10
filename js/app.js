

initApp();
function initApp() {
    if (typeof initModal === "function") {
        initModal();
    }

    if (typeof initAccessibility === "function") {
        initAccessibility();
    }

    if (typeof trackView === "function") {
        trackView();
    }
}

initApp();
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("contextmenu", e => e.preventDefault());
  img.setAttribute("draggable", "false");
});
function initGalleryRoom()
 
 {
  const modal = document.getElementById("imageModal");
  const fullImage = document.getElementById("fullImage");
  const closeBtn = document.querySelector(".close-viewer");

  if (!modal || !fullImage) return;

  document.querySelectorAll(".img-container img:first-child")
    .forEach(img => {
      img.addEventListener("click", () => {
        modal.style.display = "flex";
        fullImage.src = img.src;
      });
    });

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}
function initButtons() 
{

  document.getElementById("backToTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("whatsapp-chat")?.addEventListener("click", () => {
    window.open(
      "https://wa.me/972503251251?text=" +
      encodeURIComponent("שלום, אני רוצה פרטים"),
      "_blank"
    );
  });

  document.getElementById("modeToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}/* =====================================================
   JERUSALEM TOURS - PRODUCTION UI SYSTEM
   Works on ALL pages (index + gallery)
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     CACHE ELEMENTS SAFELY
  ========================= */

  const $ = (id) => document.getElementById(id);

  const mobileMenu = $("mobileMenu");
  const modal = $("contactModal");
  const openBtn = $("openContactModal");
  const closeBtn = document.querySelector(".close");

  const a11yBtn = $("accessibility-btn");
  const a11yMenu = $("accessibility-menu");

  const backToTop = $("backToTop");
  const modeToggle = $("modeToggle");

  /* =========================
     LOCAL STORAGE (THEME)
  ========================= */

  const THEME_KEY = "jt_theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  /* =========================
     MOBILE MENU
  ========================= */

  window.toggleMenu = function () {
    if (mobileMenu) {
      mobileMenu.classList.toggle("open");
    }
  };

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
      backToTop.style.display =
        window.scrollY > 300 ? "block" : "none";
    });
  }

  /* =========================
     DARK MODE TOGGLE
  ========================= */

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {

      const isDark = document.body.classList.toggle("dark-mode");

      localStorage.setItem(
        THEME_KEY,
        isDark ? "dark" : "light"
      );

    });
  }

});/* =====================================================
   ACCESSIBILITY SYSTEM - PRODUCTION SAFE
===================================================== */

let fontSize = 16;

function applyFont() {
  document.body.style.fontSize = fontSize + "px";
}

window.changeFontSize = function (delta) {
  fontSize += delta;

  if (fontSize < 12) fontSize = 12;
  if (fontSize > 30) fontSize = 30;

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
  fontSize = 16;
  applyFont();
});
init()
 {
  this.cacheDOM();
  this.bindEvents();

  // 👇 הוספה חדשה
  this.analytics.init();

  console.log("✅ APP CORE LOADED");
}