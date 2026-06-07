
export function initAccessibility() {
  const btn = document.querySelector(".accessibility-btn");

  btn?.addEventListener("click", () => {
    document.body.classList.toggle("large-text");
  });
}let fontSize = 16;

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
function initAccessibility(){

window.toggleGrayscale=function(){

 document.body.classList.toggle('grayscale');

}

window.toggleHighContrast=function(){

 document.body.classList.toggle('high-contrast');

}

}