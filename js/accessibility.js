
export function initAccessibility() {
  const btn = document.querySelector(".accessibility-btn");

  btn?.addEventListener("click", () => {
    document.body.classList.toggle("large-text");
  });
}