/* =========================================================
   JERUSALEM TOURS — ULTIMATE FRONTEND ENGINE
   SINGLE FILE PRODUCTION VERSION
========================================================= */

(() => {
"use strict";

/* =========================================================
   GLOBAL APP STATE
========================================================= */

window.App = {
    state: {
        darkMode: false,
        fontSize: 16,
        grayscale: false,
        highContrast: false,
        currentSlide: 0
    },

    config: {
        sliderInterval: 7000,
        whatsapp: "972503251251"
    }
};

/* =========================================================
   SAFE SELECTOR
========================================================= */

const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

/* =========================================================
   TOAST SYSTEM
========================================================= */

const Toast = {
    show(msg, time = 2500) {
        const el = document.createElement("div");
        el.className = "toast";
        el.innerText = msg;

        document.body.appendChild(el);

        requestAnimationFrame(() => el.classList.add("show"));

        setTimeout(() => {
            el.classList.remove("show");
            setTimeout(() => el.remove(), 300);
        }, time);
    }
};

window.Toast = Toast;

/* =========================================================
   HERO SLIDER (TEXT + IMAGES)
========================================================= */

function initHeroSlider() {
    const slides = $$(".hero-slide");
    if (!slides.length) return;

    setInterval(() => {
        slides[App.state.currentSlide].classList.remove("active");

        App.state.currentSlide++;

        if (App.state.currentSlide >= slides.length) {
            App.state.currentSlide = 0;
        }

        slides[App.state.currentSlide].classList.add("active");

    }, App.config.sliderInterval);
}

/* =========================================================
   IMAGE SLIDER (MAIN GALLERY ROTATION)
========================================================= */

function initImageSlider() {
    const slider = $("image-slider");
    if (!slider) return;

    const images = [
        "images/1.jpg","images/2.jpg","images/3.jpg","images/4.jpg",
        "images/5.jpg","images/6.jpg","images/7.jpg","images/8.jpg",
        "images/9.jpg","images/10.jpg","images/11.jpg","images/12.jpg"
    ];

    let i = 0;

    setInterval(() => {
        i = (i + 1) % images.length;

        slider.style.opacity = "0";

        setTimeout(() => {
            slider.src = images[i];
            slider.style.opacity = "1";
        }, 400);

    }, App.config.sliderInterval);
}

/* =========================================================
   MOBILE MENU
========================================================= */

window.toggleMenu = function () {
    const menu = $("mobileMenu");
    if (!menu) return;

    menu.classList.toggle("active");
};

/* =========================================================
   ROOM SYSTEM (MODAL CONTENT VIEW)
========================================================= */

const room = $("room");
const roomInner = $("room-inner");

window.openRoom = function (id) {
    const section = $(id);
    if (!section || !room || !roomInner) return;

    roomInner.innerHTML = section.innerHTML;
    room.style.display = "flex";

    setTimeout(() => room.classList.add("show"), 10);
    document.body.style.overflow = "hidden";
};

window.closeRoom = function () {
    if (!room) return;

    room.classList.remove("show");

    setTimeout(() => {
        room.style.display = "none";
        if (roomInner) roomInner.innerHTML = "";
        document.body.style.overflow = "auto";
    }, 250);
};

if (room) {
    room.addEventListener("click", (e) => {
        if (e.target === room) closeRoom();
    });
}

/* ESC closes room */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRoom();
});

/* =========================================================
   ACCESSIBILITY SYSTEM
========================================================= */

window.toggleGrayscale = function () {
    document.body.classList.toggle("grayscale");
};

window.toggleHighContrast = function () {
    document.body.classList.toggle("high-contrast");
};

window.changeFontSize = function (step) {
    const size = parseFloat(getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = (size + step) + "px";
};

window.resetA11y = function () {
    document.body.classList.remove("grayscale", "high-contrast");
    document.body.style.fontSize = "";
};

/* =========================================================
   HEADER SHRINK ON SCROLL
========================================================= */

function initHeader() {
    const header = $("header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        header.classList.toggle("shrink", window.scrollY > 50);
    });
}

/* =========================================================
   FLOATING WHATSAPP (SAFE)
========================================================= */

function initWhatsApp() {
    const btn = $("whatsapp-chat");
    if (!btn) return;

    const msg = encodeURIComponent("שלום, אני מעוניין בפרטים על טיולים");

    btn.href = `https://wa.me/${App.config.whatsapp}?text=${msg}`;
}

/* =========================================================
   CONTACT MODAL + EMAILJS
========================================================= */

function initContact() {
    const modal = $("contactModal");
    const openBtn = $("floatingContactBtn");
    const closeBtn = document.querySelector(".close-modal");
    const form = $("contactForm");

    if (openBtn && modal) {
        openBtn.onclick = () => modal.classList.add("open");
    }

    if (closeBtn && modal) {
        closeBtn.onclick = () => modal.classList.remove("open");
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            Toast.show("שולח טופס...");

            try {
                const data = Object.fromEntries(new FormData(form));

                console.log("FORM DATA:", data);

                Toast.show("נשלח בהצלחה ✅");
                form.reset();
                modal?.classList.remove("open");

            } catch (err) {
                Toast.show("שגיאה בשליחה ❌");
            }
        });
    }
}

/* =========================================================
   GALLERY LIGHT INTERACTION
========================================================= */

function initGallery() {
    $$(".gallery img").forEach(img => {
        img.addEventListener("click", () => {
            $$(".gallery img").forEach(i => i.classList.remove("active"));
            img.classList.add("active");
        });
    });
}

/* =========================================================
   SCROLL REVEAL EFFECT
========================================================= */

function initScrollFX() {
    const items = $$("section, .service-card, .review-card");

    const check = () => {
        items.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < window.innerHeight - 100) {
                el.classList.add("show");
            }
        });
    };

    window.addEventListener("scroll", check);
    check();
}

/* =========================================================
   ANALYTICS (LIGHT LOCAL VERSION)
========================================================= */

const Analytics = {
    track(event) {
        const logs = JSON.parse(localStorage.getItem("jt_logs") || "[]");
        logs.push({ event, time: Date.now() });
        localStorage.setItem("jt_logs", JSON.stringify(logs));
    }
};

window.Analytics = Analytics;

/* =========================================================
   BACK TO TOP (OPTIONAL SAFE)
========================================================= */

function initBackToTop() {
    const btn = $("backToTop");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        btn.style.display = window.scrollY > 400 ? "block" : "none";
    });

    btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================================
   INIT EVERYTHING
========================================================= */

function initApp() {
    initHeroSlider();
    initImageSlider();
    initHeader();
    initWhatsApp();
    initContact();
    initGallery();
    initScrollFX();
    initBackToTop();

    console.log("🚀 Jerusalem Tours Ultimate Engine Loaded");
}

document.addEventListener("DOMContentLoaded", initApp);

})();
