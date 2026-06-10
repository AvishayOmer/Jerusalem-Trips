function initModal() {

    const modal = document.getElementById('contactModal');
 const openBtn = document.getElementById('floatingContactBtn');
    const closeBtn = modal ? modal.querySelector('.close') : null;

    if (!modal || !openBtn || !closeBtn) {
        console.warn('Modal init failed: missing elements');
        return;
    }

    let lastFocusedElement = null;

    function openModal() {

        lastFocusedElement = document.activeElement;

        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');

        document.body.style.overflow = 'hidden';

        // הפעלה אחרי רינדור כדי לאפשר אנימציה
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // פוקוס ראשון בתוך המודל
        const focusable = modal.querySelector(
            'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        if (focusable) focusable.focus();
    }

    function closeModal() {

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        document.body.style.overflow = '';

        // מחכה לסיום אנימציה לפני הסתרה
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);

        // החזרת פוקוס למקום שהיה לפני
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
    });

    modal.addEventListener('click', (e) => {
        // סגירה רק אם לוחצים על הרקע
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }

        // Focus trap בסיסי
        if (e.key === 'Tab' && modal.classList.contains('active')) {

            const focusable = modal.querySelectorAll(
                'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );

            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // מצב התחלתי נקי
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
}