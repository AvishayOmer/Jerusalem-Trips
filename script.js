document.addEventListener('DOMContentLoaded', () => {

    // אתחול EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("u9MRRRVgErghPjkuE");
    }

    /* ================= הגנות תמונות והורדה (מעודכן) ================= */
    const applyImageProtection = () => {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            // חסימת קליק ימני
            img.addEventListener('contextmenu', e => e.preventDefault());
            // חסימת גרירה
            img.addEventListener('dragstart', e => e.preventDefault());
        });
    };
    
    // הרצה מידית
    applyImageProtection();

    // חסימת העתקה כללית (למעט שדות קלט)
    document.body.oncopy = e => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            alert('התוכן והתמונות מוגנים בזכויות יוצרים.');
        }
    };

    /* ================= סליידר תמונות (רק אם קיים) ================= */
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

    /* ================= מצב כהה ================= */
    const toggle = document.getElementById('modeToggle');
    const setMode = dark => {
        document.body.classList.toggle('dark-mode', dark);
        if (toggle) toggle.textContent = dark ? '☀️ מצב יום' : '🌙 מצב לילה';
        localStorage.setItem('darkMode', dark);
    };
    setMode(localStorage.getItem('darkMode') === 'true');
    if (toggle) toggle.onclick = () => setMode(!document.body.classList.contains('dark-mode'));

    /* ================= חזרה למעלה ווואטסאפ ================= */
    const topBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (topBtn) topBtn.classList.toggle('show', window.scrollY > 300);
    });
    if (topBtn) topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const whatsappBtn = document.getElementById('whatsapp-chat');
    if (whatsappBtn) whatsappBtn.onclick = () => window.open('https://wa.me/972505437050');

    /* ================= מודאל צור קשר (רק אם קיים) ================= */
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openContactModal');
    const closeBtn = document.querySelector('.close');

    if (openBtn) openBtn.onclick = () => modal.style.display = 'block';
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

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
});

/* ================= תצוגת תמונה בגדול ================= */
const imageModal = document.getElementById('imageModal');
const fullImg = document.getElementById('fullImage');
const closeViewer = document.querySelector('.close-viewer');

// פתיחת התמונה בלחיצה
document.querySelectorAll('.img-container').forEach(container => {
    container.addEventListener('click', () => {
        const img = container.querySelector('img:not(.watermark)');
        imageModal.style.display = "block";
        fullImg.src = img.src;
        // מונע גלילה של הדף כשהתמונה פתוחה
        document.body.style.overflow = 'hidden';
    });
});

// סגירה בלחיצה על ה-X או על הרקע
const closeModal = () => {
    imageModal.style.display = "none";
    document.body.style.overflow = 'auto';
};

if (closeViewer) closeViewer.onclick = closeModal;
if (imageModal) imageModal.onclick = (e) => {
    if (e.target === imageModal) closeModal();
};


/* ================= תפריט נגישות ================= */
const a11yBtn = document.getElementById('accessibility-btn');
const a11yMenu = document.getElementById('accessibility-menu');

// פתיחה וסגירה של התפריט
if (a11yBtn) {
    a11yBtn.onclick = (e) => {
        e.stopPropagation();
        a11yMenu.style.display = a11yMenu.style.display === 'block' ? 'none' : 'block';
    };
}

// סגירה בלחיצה בחוץ
document.addEventListener('click', () => {
    if (a11yMenu) a11yMenu.style.display = 'none';
});

if (a11yMenu) {
    a11yMenu.onclick = (e) => e.stopPropagation();
}

// פונקציות הנגישות
function toggleGrayscale() {
    // משתמשים ב-documentElement כדי למנוע את קפיצת ה-fixed
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