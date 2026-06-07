let fontSize = 16;

function initAccessibility() {

  const btn = document.getElementById("accessibility-btn");
  const menu = document.getElementById("accessibility-menu");

  if (btn && menu) {

    btn.addEventListener("click", () => {

      menu.classList.toggle("show");

    });

  }

  applyFont();
}

function applyFont() {
  document.body.style.fontSize = fontSize + "px";
}

window.changeFontSize = function(delta) {

  fontSize += delta;

  if (fontSize < 12) fontSize = 12;
  if (fontSize > 30) fontSize = 30;

  applyFont();

};

window.toggleHighContrast = function() {

  document.body.classList.toggle("high-contrast");

};

window.toggleGrayscale = function() {

  document.body.classList.toggle("grayscale");

};

window.resetA11y = function() {

  document.body.classList.remove(
    "high-contrast",
    "grayscale",
    "large-text"
  );

  fontSize = 16;
  applyFont();

};