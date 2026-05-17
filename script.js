/* =========================================================
   JERUSALEM TOURS — ULTRA PREMIUM FINAL JS
   FULL RESTORE + SEO + NETFLIX + ACCESSIBILITY
   SAFE VERSION — NO FEATURE REMOVED
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    "use strict";

    /* =========================================================
       EMAILJS INIT
    ========================================================= */

    if (typeof emailjs !== "undefined") {
        emailjs.init("u9MRRRVgErghPjkuE");
    }

    /* =========================================================
       INTRO OVERLAY AUTO CLOSE
    ========================================================= */

    const intro = document.getElementById("intro");

    if (intro) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                intro.style.opacity = "0";

                setTimeout(() => {
                    intro.style.display = "none";
                }, 900);

            }, 2200);
        });
    }

    /* =========================================================
       NETFLIX CINEMATIC SCROLL
    ========================================================= */

    const cinematicItems = document.querySelectorAll(`
        section,
        .gallery-wrapper,
        .service-card,
        .room-card,
        .region,
        .seo-block
    `);

    const revealOnScroll = () => {

        cinematicItems.forEach(el => {

            const top = el.getBoundingClientRect().top;

            if (top < window.innerHeight - 100) {
                el.classList.add("show");
            }

        });

    };

    revealOnScroll();

    window.addEventListener("scroll", revealOnScroll);

    /* =========================================================
       HERO IMAGE SLIDER
    ========================================================= */

    const slider = document.getElementById("image-slider");

    const sliderImages = [
        "images/1.webp",
        "images/2.webp",
        "images/3.webp",
        "images/4.webp",
        "images/5.webp",
        "images/6.webp",
        "images/7.webp",
        "images/8.webp"
    ];

    let currentSlide = 0;

    if (slider) {

        setInterval(() => {

            currentSlide++;

            if (currentSlide >= sliderImages.length) {
                currentSlide = 0;
            }

            slider.style.opacity = "0";

            setTimeout(() => {

                slider.src = sliderImages[currentSlide];

                slider.style.opacity = "1";

            }, 450);

        }, 7000);

    }

    /* =========================================================
       DARK MODE SYSTEM
    ========================================================= */

    const modeBtn = document.getElementById("modeToggle");

    const setDarkMode = (enabled) => {

        if (enabled) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "true");

            if (modeBtn) {
                modeBtn.innerHTML = "☀️ מצב יום";
            }

        } else {

            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "false");

            if (modeBtn) {
                modeBtn.innerHTML = "🌙 מצב לילה";
            }
        }
    };

    if (localStorage.getItem("darkMode") === "true") {
        setDarkMode(true);
    }

    if (modeBtn) {

        modeBtn.addEventListener("click", () => {

            const isDark =
                document.body.classList.contains("dark-mode");

            setDarkMode(!isDark);

        });

    }

    /* =========================================================
       BACK TO TOP
    ========================================================= */

    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {

        if (!backToTop) return;

        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    });

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

    /* =========================================================
       WHATSAPP BUTTON
    ========================================================= */

    const whatsappBtn = document.getElementById("whatsapp-chat");

    if (whatsappBtn) {

        whatsappBtn.style.cursor = "pointer";

        whatsappBtn.addEventListener("click", () => {

            window.open(
                "https://wa.me/972503251251?text=שלום הגעתי מאתר טיולי ירושלים",
                "_blank"
            );

        });

    }

    /* =========================================================
       CONTACT MODAL
    ========================================================= */

    const contactModal = document.getElementById("contactModal");

    const openContactBtn =
        document.getElementById("openContactModal");

    const closeContactBtn =
        document.querySelector(".close");

    if (openContactBtn && contactModal) {

        openContactBtn.addEventListener("click", () => {

            contactModal.classList.add("open");

            document.body.classList.add("modal-open");

        });

    }

    if (closeContactBtn && contactModal) {

        closeContactBtn.addEventListener("click", () => {

            contactModal.classList.remove("open");

            document.body.classList.remove("modal-open");

        });

    }

    window.addEventListener("click", (e) => {

        if (e.target === contactModal) {

            contactModal.classList.remove("open");

            document.body.classList.remove("modal-open");

        }

    });

    /* =========================================================
       CONTACT FORM EMAILJS
    ========================================================= */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const submitBtn =
                contactForm.querySelector("button");

            if (submitBtn) {

                submitBtn.disabled = true;
                submitBtn.innerHTML = "שולח...";

            }

            emailjs.send(
                "tripjeru_service",
                "template_4qoa25e",
                {
                    first_name:
                        document.getElementById("firstName").value,

                    last_name:
                        document.getElementById("lastName").value,

                    phone:
                        document.getElementById("phone").value,

                    user_email:
                        document.getElementById("email").value
                }

            ).then(() => {

                alert("הטופס נשלח בהצלחה ✅");

                contactForm.reset();

                contactModal.classList.remove("open");

                document.body.classList.remove("modal-open");

            }).catch(() => {

                alert("אירעה שגיאה בשליחה");

            }).finally(() => {

                if (submitBtn) {

                    submitBtn.disabled = false;
                    submitBtn.innerHTML = "שליחה";

                }

            });

        });

    }

    /* =========================================================
       IMAGE PROTECTION
    ========================================================= */

    document.querySelectorAll("img").forEach(img => {

        img.addEventListener("contextmenu", e => {
            e.preventDefault();
        });

        img.addEventListener("dragstart", e => {
            e.preventDefault();
        });

    });

    document.body.addEventListener("copy", (e) => {

        const tag = e.target.tagName;

        if (
            tag !== "INPUT" &&
            tag !== "TEXTAREA"
        ) {
            e.preventDefault();
        }

    });

    /* =========================================================
       LIGHTBOX GALLERY
    ========================================================= */

    const imageModal = document.getElementById("imageModal");

    const fullImage = document.getElementById("fullImage");

    const closeViewer =
        document.querySelector(".close-viewer");

    document.querySelectorAll(`
        .gallery img,
        .gallery-grid img,
        .full-gallery-grid img
    `).forEach(img => {

        img.addEventListener("click", () => {

            if (!imageModal || !fullImage) return;

            imageModal.classList.add("open");

            fullImage.src = img.src;

            document.body.classList.add("modal-open");

        });

    });

    const closeLightbox = () => {

        if (!imageModal) return;

        imageModal.classList.remove("open");

        document.body.classList.remove("modal-open");

    };

    if (closeViewer) {

        closeViewer.addEventListener("click", closeLightbox);

    }

    window.addEventListener("click", (e) => {

        if (e.target === imageModal) {
            closeLightbox();
        }

    });

    /* =========================================================
       ACCESSIBILITY MENU
    ========================================================= */

    const a11yBtn =
        document.getElementById("accessibility-btn");

    const a11yMenu =
        document.getElementById("accessibility-menu");

    if (a11yBtn && a11yMenu) {

        a11yBtn.addEventListener("click", (e) => {

            e.stopPropagation();

            a11yMenu.style.display =
                a11yMenu.style.display === "block"
                ? "none"
                : "block";

        });

        document.addEventListener("click", () => {

            a11yMenu.style.display = "none";

        });

        a11yMenu.addEventListener("click", (e) => {

            e.stopPropagation();

        });

    }

    /* =========================================================
       SERVICES EXPAND
    ========================================================= */

    const toggleServicesBtn =
        document.getElementById("toggleServicesBtn");

    const servicesGrid =
        document.getElementById("servicesGrid");

    if (toggleServicesBtn && servicesGrid) {

        toggleServicesBtn.addEventListener("click", () => {

            const visible =
                servicesGrid.style.display === "grid";

            if (visible) {

                servicesGrid.style.display = "none";

                toggleServicesBtn.innerHTML =
                    "🔍 לצפייה במגוון השירותים";

            } else {

                servicesGrid.style.display = "grid";

                toggleServicesBtn.innerHTML =
                    "✖️ סגור שירותים";

                servicesGrid.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    }

    /* =========================================================
       NETFLIX REGION OVERLAY
    ========================================================= */

    const roomOverlay =
        document.getElementById("room-overlay");

    const roomContent =
        document.getElementById("room-overlay-content");

    window.openRegionRoom = function(content) {

        if (!roomOverlay || !roomContent) return;

        roomContent.innerHTML = content;

        roomOverlay.style.display = "flex";

        setTimeout(() => {
            roomOverlay.classList.add("show");
        }, 50);

        document.body.classList.add("modal-open");
    };

    window.closeRegionRoom = function() {

        if (!roomOverlay) return;

        roomOverlay.classList.remove("show");

        setTimeout(() => {

            roomOverlay.style.display = "none";

        }, 250);

        document.body.classList.remove("modal-open");
    };

    /* =========================================================
       PARALLAX EFFECT
    ========================================================= */

    document.addEventListener("mousemove", (e) => {

        const x =
            (e.clientX / window.innerWidth - 0.5) * 12;

        const y =
            (e.clientY / window.innerHeight - 0.5) * 12;

        document.body.style.backgroundPosition =
            `${50 + x}% ${50 + y}%`;

    });

    /* =========================================================
       MICRO INTERACTIONS
    ========================================================= */

    document.querySelectorAll(`
        button,
        .btn-primary,
        .region
    `).forEach(btn => {

        btn.addEventListener("mousedown", () => {

            btn.style.transform = "scale(0.96)";

        });

        btn.addEventListener("mouseup", () => {

            btn.style.transform = "";

        });

        btn.addEventListener("mouseleave", () => {

            btn.style.transform = "";

        });

    });

});

/* =========================================================
   GLOBAL ACCESSIBILITY FUNCTIONS
========================================================= */

let currentFontSize = 100;

function changeFontSize(step) {

    currentFontSize += step * 10;

    if (currentFontSize < 80) {
        currentFontSize = 80;
    }

    if (currentFontSize > 200) {
        currentFontSize = 200;
    }

    document.body.style.fontSize =
        currentFontSize + "%";
}

function toggleGrayscale() {

    document.documentElement
        .classList.toggle("grayscale");

}

function toggleHighContrast() {

    document.body
        .classList.toggle("high-contrast");

}

function resetA11y() {

    currentFontSize = 100;

    document.body.style.fontSize = "100%";

    document.documentElement
        .classList.remove("grayscale");

    document.body
        .classList.remove("high-contrast");

}

/* =========================================================
   SPA NAVIGATION
========================================================= */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.remove("active");

    });

    const target =
        document.getElementById(pageId);

    if (target) {

        target.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}

/* =========================================================
   SEO REGION DATA
========================================================= */

const regionData = {

    jerusalem: `
    <h1>ירושלים והעיר העתיקה</h1>

    <p>
    ירושלים היא אחת הערים החשובות והמרתקות בעולם.
    העיר העתיקה כוללת את הכותל המערבי, שער יפו,
    הרובע היהודי, שוק מחנה יהודה, הר הזיתים,
    טיילת ארמון הנציב ואתרי מורשת רבים.
    טיולים בירושלים משלבים היסטוריה, תרבות,
    מסעדות כשרות ברמה גבוהה, חוויות משפחתיות,
    סיורי לילה וסיורים מודרכים לקבוצות ותיירים.
    </p>

    <div class="gallery-grid">
      <img src="./images/1.webp">
      <img src="./images/2.webp">
      <img src="./images/3.webp">
    </div>
    `,

    telaviv: `
    <h1>תל אביב ויפו</h1>

    <p>
    תל אביב מציעה חיי לילה, מסעדות שף,
    נמל תל אביב, יפו העתיקה, חופי ים,
    שוק הכרמל ותרבות ישראלית מודרנית.
    העיר משלבת קולינריה, אטרקציות וסיורים.
    </p>

    <div class="gallery-grid">
      <img src="./images/4.webp">
      <img src="./images/5.webp">
      <img src="./images/6.webp">
    </div>
    `

};

/* =========================================================
   OPEN REGION
========================================================= */

function openRegion(name) {

    if (!regionData[name]) return;

    openRegionRoom(regionData[name]);

}