/* =========================================================
   MAIN FEATURES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const $ = (id) => document.getElementById(id);

  const modal = $("contactModal");
  const openModalBtn = $("floatingContactBtn");
  const closeModalBtn = document.querySelector(".close-modal");

  const backToTop = $("backToTop");
  const modeToggle = $("modeToggle");
  const a11yBtn = $("accessibility-btn");
  const a11yMenu = $("accessibility-menu");
  const mobileMenu = $("mobileMenu");

  /* BACK TO TOP */
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (!backToTop) return;
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
  });

  /* DARK MODE (fallback אם core לא קיים) */
  modeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  /* MODAL (fallback בלבד) */
  openModalBtn?.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModalBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  /* ACCESSIBILITY */
  a11yBtn?.addEventListener("click", () => {
    a11yMenu.classList.toggle("show");
  });

  /* MOBILE MENU fallback */
  window.toggleMenu = () => {
    mobileMenu?.classList.toggle("active");
  };

});