document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. אתחול EmailJS ================= */
    if (typeof emailjs !== 'undefined') {
        emailjs.init("u9MRRRVgErghPjkuE");
    }

    /* ================= 2. פתיחת שירותים בקליק ================= */
    const toggleBtn = document.getElementById('toggleServicesBtn');
    const servicesGrid = document.getElementById('servicesGrid');

    if (toggleBtn && servicesGrid) {
        toggleBtn.onclick = () => {
            // בדיקה האם הגריד מוצג כרגע
            const isVisible = window.getComputedStyle(servicesGrid).display !== 'none';
            
            if (isVisible) {
                servicesGrid.style.display = 'none';
                toggleBtn.textContent = '🔍 לצפייה במגוון השירותים';
            } else {
                servicesGrid.style.display = 'grid';
                toggleBtn.textContent = '✖️ סגור שירותים';
                
                setTimeout(() => {
                    servicesGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        };
    }

    /* ================= 3. הגנות תמונות והורדה ================= */
    const applyImageProtection = () => {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            img.addEventListener('contextmenu', e => e.preventDefault());
            img.addEventListener('dragstart', e => e.preventDefault());
        });
    };
    applyImageProtection();

    document.body.oncopy = e => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            alert('התוכן והתמונות מוגנים בזכויות יוצרים.');
        }
    };

    /* ================= 4. סליידר תמונות ================= */
    const imagesArray = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg', 'images/6.jpg', 'images/7.jpg', 'images/8.jpg'];
    let index = 0;
    const slider = document.getElementById('image-slider');
    if (slider) {
        setInterval(() => {
            index = (index + 1) % imagesArray.length;
            slider.style.opacity = 0;
            setTimeout(() => {
                slider.src = imagesArray[index];
                slider.style.opacity = 1;
            }, 500);
        }, 8000);
    }

    /* ================= 5. מצב כהה ================= */
    const toggle = document.getElementById('modeToggle');
    const setMode = dark => {
        document.body.classList.toggle('dark-mode', dark);
        if (toggle) toggle.textContent = dark ? '☀️ מצב יום' : '🌙 מצב לילה';
        localStorage.setItem('darkMode', dark);
    };
    if (localStorage.getItem('darkMode') === 'true') setMode(true);
    if (toggle) toggle.onclick = () => setMode(!document.body.classList.contains('dark-mode'));

    /* ================= 6. חזרה למעלה ווואטסאפ ================= */
    const topBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (topBtn) topBtn.classList.toggle('show', window.scrollY > 300);
    });
    if (topBtn) topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const whatsappBtn = document.getElementById('whatsapp-chat');
    if (whatsappBtn) whatsappBtn.onclick = () => window.open('https://wa.me/972503251251');

    /* ================= 7. מודאל צור קשר ================= */
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openContactModal');
    const closeBtn = document.querySelector('.close');

    if (openBtn && modal) openBtn.onclick = () => modal.style.display = 'block';
    if (closeBtn && modal) closeBtn.onclick = () => modal.style.display = 'none';

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.onsubmit = e => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'שולח...';

            emailjs.send("tripjeru_service", "template_4qoa25e", {
                first_name: document.getElementById('firstName').value,
                last_name: document.getElementById('lastName').value,
                phone: document.getElementById('phone').value,
                user_email: document.getElementById('email').value
            }).then(() => {
                alert('נשלח בהצלחה!');
                modal.style.display = 'none';
                contactForm.reset();
            }).finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'שליחה';
            });
        };
    }

    /* ================= 8. תצוגת תמונה בגדול (LightBox) ================= */
    const imageModal = document.getElementById('imageModal');
    const fullImg = document.getElementById('fullImage');
    const closeViewer = document.querySelector('.close-viewer');

    document.querySelectorAll('.img-container').forEach(container => {
        container.addEventListener('click', () => {
            const img = container.querySelector('img:not(.watermark)');
            if (imageModal && fullImg && img) {
                imageModal.style.display = "block";
                fullImg.src = img.src;
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = () => {
        if (imageModal) {
            imageModal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    };

    if (closeViewer) closeViewer.onclick = closeModal;
    
    /* סגירת מודאלים בלחיצה בחוץ - מאוחד */
    window.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === imageModal) closeModal();
    });

    /* ================= 9. תפריט נגישות ================= */
    const a11yBtn = document.getElementById('accessibility-btn');
    const a11yMenu = document.getElementById('accessibility-menu');

    if (a11yBtn && a11yMenu) {
        a11yBtn.onclick = (e) => {
            e.stopPropagation();
            a11yMenu.style.display = a11yMenu.style.display === 'block' ? 'none' : 'block';
        };

        document.addEventListener('click', () => {
            a11yMenu.style.display = 'none';
        });

        a11yMenu.onclick = (e) => e.stopPropagation();
    }
});

/* ================= 10. פונקציות נגישות גלובליות ================= */
function toggleGrayscale() {
    document.documentElement.classList.toggle('grayscale');
}

function toggleHighContrast() {
    document.documentElement.classList.toggle('high-contrast');
}

let fontSizeLabel = 100;
function changeFontSize(action) {
    fontSizeLabel += (action * 10);
    document.body.style.fontSize = fontSizeLabel + "%";
}

function resetA11y() {
    document.documentElement.classList.remove('grayscale', 'high-contrast');
    document.body.style.fontSize = "100%";
    fontSizeLabel = 100;
}

/* ================= FIX: WhatsApp Safe Open ================= */
const whatsappBtn = document.getElementById('whatsapp-chat');

if (whatsappBtn) {
    whatsappBtn.style.cursor = 'pointer';
    whatsappBtn.style.zIndex = '999999';

    whatsappBtn.onclick = (e) => {
        e.preventDefault();
        window.open('https://wa.me/972503251251', '_blank');
    };
}
/* ===================== INTRO AUTO CLOSE ===================== */
window.addEventListener("load", () => {
    const intro = document.getElementById("intro");
    if (intro) {
        setTimeout(() => {
            intro.style.display = "none";
        }, 2200);
    }
});

/* ===================== SCROLL REVEAL ===================== */
const revealElements = document.querySelectorAll("section, .gallery-wrapper, .service-card");

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < windowHeight - 100) {
            el.classList.add("reveal", "active");
        } else {
            el.classList.add("reveal");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* ===================== PARALLAX MOUSE EFFECT ===================== */
document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 10;

    document.body.style.backgroundPosition = `
        calc(50% + ${moveX}px) calc(50% + ${moveY}px)
    `;
});
/* ===================== GLOBAL SHINE INIT ===================== */
window.addEventListener("load", () => {
    document.querySelectorAll(".gallery-wrapper, .service-card").forEach(el => {
        el.classList.add("shine");
    });
});

/* ===================== SMOOTH APP SCROLL ===================== */
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

/* ===================== MICRO INTERACTIONS ===================== */
document.querySelectorAll("button, .btn-primary").forEach(btn => {
    btn.addEventListener("mousedown", () => {
        btn.style.transform = "scale(0.95)";
    });

    btn.addEventListener("mouseup", () => {
        btn.style.transform = "scale(1)";
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
    });
});

/* ===================== SPA ENGINE ===================== */
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(p => {
        p.classList.remove("active");
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.body.classList.toggle('dark-mode')
}
// למעלה
const topBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    topBtn.classList.add('show');
  } else {
    topBtn.classList.remove('show');
  }
});

topBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};const mainFab = document.querySelector('.main-fab');
const floatingBar = document.querySelector('.floating-bar');

let open = false;

mainFab.onclick = () => {
  open = !open;

  document.querySelectorAll('.floating-bar .fab:not(.main-fab)').forEach((btn, i) => {
    if (open) {
      btn.style.transform = `translateY(-${(i + 1) * 65}px) scale(1)`;
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    } else {
      btn.style.transform = "translateY(0) scale(0.8)";
      btn.style.opacity = "0";
      btn.style.pointerEvents = "none";
    }
  });
};
/* ברירת מחדל */
window.addEventListener("load", () => {
    showPage("home");
    document.body.classList.add("modal-open");
document.querySelector(".modal").classList.add("open");
document.body.classList.remove("modal-open");
document.querySelector(".modal").classList.remove("open");
});