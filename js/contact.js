/* ==========================
   EMAILJS INIT
========================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof emailjs !== "undefined") {
        emailjs.init("u9MRRRVgErghPjkuE");
    }

    const floatingBtn = document.getElementById("floatingContactBtn");

    if (floatingBtn) {

        floatingBtn.addEventListener("click", () => {

            if (typeof openModal === "function") {
                openModal();
            } else if (modal) {
                modal.style.display = "block";
            }

        });

    }

});

/* ==========================
   ELEMENTS
========================== */

const modal = document.getElementById("contactModal");
const form = document.getElementById("contactForm");
const openBtn = document.getElementById("openContactBtn");
const closeBtn = document.querySelector(".close-modal");

const sendBtn = form?.querySelector("button[data-action='send']");
const waBtn = form?.querySelector("button[data-action='whatsapp']");

/* ==========================
   MODAL
========================== */

function openModal() {

    if (!modal) return;

    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);

}

function closeModal() {

    if (!modal) return;

    modal.classList.remove("active");

    setTimeout(() => {
        modal.style.display = "none";
    }, 250);

}

if (openBtn) openBtn.onclick = openModal;
if (closeBtn) closeBtn.onclick = closeModal;

window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

/* ==========================
   TOAST
========================== */

function showToast(message, type = "success") {

    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.innerText = message;

    toast.style.background =
        type === "success"
            ? "rgba(34,197,94,.95)"
            : "rgba(239,68,68,.95)";

    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2500);

}

/* ==========================
   FORM DATA
========================== */

function getFormData() {

    return {
        firstName: document.getElementById("firstName")?.value.trim() || "",
        lastName: document.getElementById("lastName")?.value.trim() || "",
        phone: document.getElementById("phone")?.value.trim() || "",
        email: document.getElementById("email")?.value.trim() || ""
    };

}

function validate(data) {

    if (!data.firstName) return "נא להזין שם פרטי";
    if (!data.phone) return "נא להזין טלפון";

    return null;

}

/* ==========================
   WHATSAPP
========================== */

function buildWhatsAppMessage(data) {

    return `📩 פנייה חדשה מטיולי ירושלים

👤 ${data.firstName} ${data.lastName}

📞 ${data.phone}

📧 ${data.email}`;

}

/* ==========================
   SEND SYSTEM
========================== */

let isSending = false;

function setLoading(state) {

    if (sendBtn) {
        sendBtn.disabled = state;
        sendBtn.innerText = state ? "שולח..." : "שליחה";
    }

    if (waBtn) {
        waBtn.disabled = state;
    }

}

async function sendForm(openWhatsApp = true) {

    if (isSending) return;

    const data = getFormData();

    const error = validate(data);

    if (error) {
        showToast(error, "error");
        return;
    }

    if (typeof emailjs === "undefined") {
        showToast("EmailJS לא נטען", "error");
        return;
    }

    isSending = true;
    setLoading(true);

    try {

        await emailjs.send(
            "tripjeru_service",
            "template_4qoa25e",
            {
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                user_email: data.email
            }
        );

        showToast("נשלח בהצלחה ✅");

        form?.reset();

        closeModal();

        if (openWhatsApp) {

            window.open(
                `https://wa.me/972503251251?text=${encodeURIComponent(
                    buildWhatsAppMessage(data)
                )}`,
                "_blank",
                "noopener,noreferrer"
            );

        }

    } catch (err) {

        console.error(err);

        showToast("שגיאה בשליחה ❌", "error");

    } finally {

        isSending = false;
        setLoading(false);

    }

}

/* ==========================
   BUTTONS
========================== */

if (form) {

    sendBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        sendForm(true);
    });

    waBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        sendForm(false);
    });

}