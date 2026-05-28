```js
/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

  const mobileMenu =
    document.getElementById("mobileMenu");

  if(mobileMenu){

    mobileMenu.classList.toggle("open");

  }

}


/* =========================
   CONTACT MODAL
========================= */

const modal =
document.getElementById("contactModal");

const openBtn =
document.getElementById("openContactModal");

const closeBtn =
document.querySelector(".close");


if(openBtn && modal){

  openBtn.addEventListener("click", ()=>{

    modal.style.display = "block";

  });

}


if(closeBtn && modal){

  closeBtn.addEventListener("click", ()=>{

    modal.style.display = "none";

  });

}


window.addEventListener("click", (e)=>{

  if(modal && e.target === modal){

    modal.style.display = "none";

  }

});


/* =========================
   ACCESSIBILITY MENU
========================= */

const a11yBtn =
document.getElementById("accessibility-btn");

const a11yMenu =
document.getElementById("accessibility-menu");


if(a11yBtn && a11yMenu){

  a11yBtn.addEventListener("click", ()=>{

    a11yMenu.classList.toggle("show");

  });

}


/* =========================
   ACCESSIBILITY FUNCTIONS
========================= */

let fontSize = 16;


function changeFontSize(delta){

  fontSize += delta;

  document.body.style.fontSize =
    fontSize + "px";

}


function toggleHighContrast(){

  document.body.classList.toggle(
    "high-contrast"
  );

}


function toggleGrayscale(){

  document.body.classList.toggle(
    "grayscale"
  );

}


function resetA11y(){

  document.body.classList.remove(
    "high-contrast",
    "grayscale"
  );

  document.body.style.fontSize = "16px";

  fontSize = 16;

}
```
