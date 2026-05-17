document.addEventListener("DOMContentLoaded", () => {

    /* ================= EMAILJS ================= */
    if (window.emailjs) {
        emailjs.init("u9MRRRVgErghPjkuE");
    }

    /* ================= SERVICES ================= */
    const toggleBtn = document.getElementById("toggleServicesBtn");
    const servicesGrid = document.getElementById("servicesGrid");

    if (toggleBtn && servicesGrid) {
        toggleBtn.onclick = () => {
            const open = servicesGrid.classList.toggle("open");
            toggleBtn.textContent = open ? "✖ סגור שירותים" : "🔍 שירותים";
        };
    }

    /* ================= SLIDER ================= */
    const slider = document.getElementById("image-slider");

    const images = [
        "images/1.jpg","images/2.jpg","images/3.jpg","images/4.jpg",
        "images/5.jpg","images/6.jpg","images/7.jpg","images/8.jpg"
    ];

    let i = 0;

    if (slider) {
        setInterval(() => {
            i = (i + 1) % images.length;
            slider.style.opacity = 0;

            setTimeout(() => {
                slider.src = images[i];
                slider.style.opacity = 1;
            }, 350);

        }, 6000);
    }

    /* ================= DARK MODE ================= */
    const darkBtn = document.getElementById("modeToggle");

    function setDark(v) {
        document.body.classList.toggle("dark-mode", v);
        localStorage.setItem("dark", v);
        if (darkBtn) darkBtn.innerText = v ? "☀️ יום" : "🌙 לילה";
    }

    setDark(localStorage.getItem("dark") === "true");

    if (darkBtn) {
        darkBtn.onclick = () => {
            setDark(!document.body.classList.contains("dark-mode"));
        };
    }

    /* ================= BACK TO TOP ================= */
    const topBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        if (!topBtn) return;
        topBtn.classList.toggle("show", scrollY > 300);
    });

    if (topBtn) {
        topBtn.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
    }

    /* ================= WHATSAPP ================= */
    const wa = document.getElementById("whatsapp-chat");

    if (wa) {
        wa.onclick = () => {
            window.open("https://wa.me/972503251251", "_blank");
        };
    }

    /* ================= MODAL ================= */
    const modal = document.getElementById("contactModal");
    const openModal = document.getElementById("openContactModal");
    const closeModal = document.querySelector(".close");

    if (openModal) openModal.onclick = () => modal.style.display = "flex";
    if (closeModal) closeModal.onclick = () => modal.style.display = "none";

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };

    /* ================= FORM ================= */
    const form = document.getElementById("contactForm");

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();

            const btn = form.querySelector("button");
            btn.disabled = true;

            try {
                await emailjs.send("tripjeru_service", "template_4qoa25e", {
                    first_name: firstName.value,
                    last_name: lastName.value,
                    phone: phone.value,
                    user_email: email.value
                });

                alert("נשלח בהצלחה");
                form.reset();
                modal.style.display = "none";

            } catch (err) {
                alert("שגיאה בשליחה");
            }

            btn.disabled = false;
        };
    }

    /* ================= ACCESSIBILITY ================= */
    const a11yBtn = document.getElementById("accessibility-btn");
    const a11yMenu = document.getElementById("accessibility-menu");

    if (a11yBtn && a11yMenu) {
        a11yBtn.onclick = (e) => {
            e.stopPropagation();
            a11yMenu.classList.toggle("open");
        };

        document.onclick = () => a11yMenu.classList.remove("open");
    }

});

/* ================= GLOBAL A11Y ENGINE ================= */

let font = 100;

function changeFontSize(step) {
    font = Math.min(200, Math.max(70, font + step * 10));
    document.body.style.fontSize = font + "%";
}

function toggleGrayscale() {
    document.documentElement.classList.toggle("grayscale");
}

function toggleHighContrast() {
    document.body.classList.toggle("high-contrast");
}

function resetA11y() {
    font = 100;
    document.body.style.fontSize = "100%";
    document.documentElement.classList.remove("grayscale");
    document.body.classList.remove("high-contrast");
}

/* ================= REGION SYSTEM ================= */

function openRegion(key) {
    const data = {
        jerusalem: "ירושלים – עיר עתיקה, כותל, עיר דוד, הר הזיתים...",
        telaviv: "תל אביב – חיי לילה, יפו, חוף הים...",
        eilat: "אילת – ים סוף, ריף האלמוגים...",
        deadsea: "ים המלח – מצדה, ספא טבעי...",
        hebron: "חברון – מערת המכפלה, היסטוריה יהודית..."
    };

    const box = document.getElementById("region-viewer");
    if (box) box.innerHTML = `<div class="region-box">${data[key] || ""}</div>`;
}

/* ================= NETFLIX ROOMS ================= */

function openRoom(id) {
    const overlay = document.getElementById("room-overlay");
    const room = document.getElementById(id);

    if (!overlay || !room) return;

    overlay.style.display = "flex";
    overlay.classList.add("show");

    document.querySelectorAll(".room").forEach(r => r.style.display = "none");
    room.style.display = "block";
}

function closeRoom() {
    const overlay = document.getElementById("room-overlay");
    if (overlay) overlay.style.display = "none";
}

/* ================= PAGE SYSTEM ================= */

function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

    const el = document.getElementById(id);
    if (el) el.classList.add("active");

    scrollTo({ top: 0, behavior: "smooth" });
}

/* ================= INTRO ================= */

window.addEventListener("load", () => {
    const intro = document.getElementById("intro");
    if (intro) setTimeout(() => intro.style.display = "none", 2000);
});