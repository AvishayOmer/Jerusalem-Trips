document.addEventListener("DOMContentLoaded", () => {

  const $ = (id) => document.getElementById(id);

  const backToTop = $("backToTop");
  const modeToggle = $("modeToggle");
  const modal = $("contactModal");
  const openModal = $("floatingContactBtn"); // תיקון חשוב
  const closeModal = document.querySelector(".close-modal");
  const a11yBtn = $("accessibility-btn");
  const a11yMenu = $("accessibility-menu");
  const mobileMenu = $("mobileMenu");

  /* ================= BACK TO TOP ================= */
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (!backToTop) return;
    backToTop.style.display =
      window.scrollY > 300 ? "block" : "none";
  });

  /* ================= DARK MODE ================= */
  modeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  /* ================= MODAL ================= */
  openModal?.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModal?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  /* ================= ACCESSIBILITY ================= */
  a11yBtn?.addEventListener("click", () => {
    a11yMenu.classList.toggle("show");
  });

  /* ================= MOBILE MENU ================= */
  window.toggleMenu = () => {
    mobileMenu?.classList.toggle("active");
  };

  /* ================= IMAGE SAFETY ================= */
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("contextmenu", e => e.preventDefault());
    img.setAttribute("draggable", "false");
  });

});bindImageSafety()
 {
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("contextmenu", e => e.preventDefault());
    img.setAttribute("draggable", "false");
  });
}