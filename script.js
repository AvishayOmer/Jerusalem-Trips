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
}emailjs.init("YOUR_PUBLIC_KEY");
