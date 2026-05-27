
const openBtn = document.getElementById("openContactModal");
const modal = document.getElementById("contactModal");
const closeBtn = document.querySelector(".close");

openBtn?.addEventListener("click", () => {
    modal.classList.add("show");
});

closeBtn?.addEventListener("click", () => {
    modal.classList.remove("show");
});