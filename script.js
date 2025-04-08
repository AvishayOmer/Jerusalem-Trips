// script.js

// גלריית תמונות מתחלפות
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
setInterval(() => {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}, 3000);

// כפתור חזרה למעלה
const scrollTopBtn = document.getElementById("scrollTop");
window.onscroll = function () {
  scrollTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
};
scrollTopBtn.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// כפתור וואטסאפ
const whatsappBtn = document.getElementById("whatsapp-chat");
whatsappBtn.onclick = () => {
  const message = encodeURIComponent("שלום! איך אפשר לעזור לך? אני רובוט מידע 😊");
  const phone = "972584181598"; // מספר וואטסאפ
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
};
