
// תפריט מובייל
function toggleMenu() {
  document.getElementById("mobileMenu")
    .classList.toggle("open");
}


// פתיחת מודל צור קשר
const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("openContactModal");
const closeBtn = document.querySelector(".close");

openBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// תפריט נגישות
const a11yBtn =
document.getElementById("accessibility-btn");

const a11yMenu =
document.getElementById("accessibility-menu");

a11yBtn.addEventListener("click", () => {
  a11yMenu.classList.toggle("show");
});


// פונקציות נגישות
let fontSize = 16;

function changeFontSize(delta) {
  fontSize += delta;
  document.body.style.fontSize =
  fontSize + "px";
}

function toggleHighContrast() {
  document.body.classList.toggle(
    "high-contrast"
  );
}

function toggleGrayscale() {
  document.body.classList.toggle(
    "grayscale"
  );
}

function resetA11y() {
  document.body.classList.remove(
    "high-contrast",
    "grayscale"
  );

  document.body.style.fontSize = "16px";
  fontSize = 16;
}