

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
initGalleryRoom()
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
initButtons() 
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
}