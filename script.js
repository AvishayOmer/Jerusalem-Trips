/* =========================================================
   JERUSALEM TOURS — ENTERPRISE BOOKING ENGINE
   PART 1/4 — CORE SYSTEM + STATE + API LAYER
========================================================= */

(() => {
"use strict";

/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
    apiDelay: 600,
    currency: "ILS",
    whatsapp: "972503251251",
    maxGuests: 20,
    storageKeys: {
        user: "jt_user",
        bookings: "jt_bookings",
        theme: "jt_theme"
    }
};
/* ===== סליידר ראשי ===== */

const sliderImages = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg",
  "images/4.jpg",
  "images/5.jpg",
  "images/6.jpg"
];

let currentSlide = 0;

function changeSliderImage() {

  const slider = document.getElementById("image-slider");

  if (!slider) return;

  currentSlide++;

  if (currentSlide >= sliderImages.length) {
    currentSlide = 0;
  }

  slider.style.opacity = "0";

  setTimeout(() => {
    slider.src = sliderImages[currentSlide];
    slider.style.opacity = "1";
  }, 400);
}

let sliderInterval = setInterval(changeSliderImage, 7000);
/* =========================================================
   GLOBAL STATE MANAGER
========================================================= */

window.State = {
    user: null,
    bookings: [],
    currentRegion: null,
    selectedDate: null,
    selectedGuests: 1,
    selectedPackage: null
};

/* =========================================================
   LOCAL STORAGE ENGINE
========================================================= */

const Storage = {

    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};

/* =========================================================
   INIT LOAD STATE
========================================================= */

function initState() {
    State.user = Storage.load(CONFIG.storageKeys.user);
    State.bookings = Storage.load(CONFIG.storageKeys.bookings) || [];
}

/* =========================================================
   MOCK API LAYER (SIMULATED BACKEND)
========================================================= */

const Api = {

    async delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    },

    async getRegions() {
        await this.delay(CONFIG.apiDelay);

        return [
            { id: "jerusalem", name: "ירושלים" },
            { id: "telaviv", name: "תל אביב" },
            { id: "eilat", name: "אילת" },
            { id: "deadsea", name: "ים המלח" },
            { id: "haifa", name: "חיפה" }
        ];
    },

    async getPackages(regionId) {
        await this.delay(CONFIG.apiDelay);

        const packages = {
            jerusalem: [
                { id: "j1", title: "סיור עיר עתיקה", price: 250 },
                { id: "j2", title: "ירושלים הלילה", price: 320 }
            ],
            telaviv: [
                { id: "t1", title: "תל אביב קלאסי", price: 280 },
                { id: "t2", title: "חיי לילה", price: 350 }
            ],
            eilat: [
                { id: "e1", title: "צלילה באילת", price: 400 },
                { id: "e2", title: "נופש ים סוף", price: 500 }
            ]
        };

        return packages[regionId] || [];
    },

    async createBooking(booking) {
        await this.delay(CONFIG.apiDelay);

        const id = "BKG_" + Math.random().toString(36).substr(2, 9);

        return {
            success: true,
            id,
            ...booking
        };
    }
};

/* =========================================================
   BOOKING ENGINE CORE
========================================================= */

const Booking = {

    async create(data) {

        if (!Auth.isLoggedIn()) {
            throw new Error("USER_NOT_LOGGED_IN");
        }

        const booking = {
            userId: State.user.id,
            region: data.region,
            package: data.package,
            date: data.date,
            guests: data.guests,
            price: data.price,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        const res = await Api.createBooking(booking);

        if (res.success) {
            window.State.bookings.push(res);
            Storage.save(CONFIG.storageKeys.bookings, window.State.bookings);
        }

        return res;
    },

    getAll() {
        return window.State.bookings;
    },

    cancel(id) {
        const b = window.State.bookings.find(x => x.id === id);
        if (b) b.status = "cancelled";

        Storage.save(CONFIG.storageKeys.bookings, window.State.bookings);
    }
};

/* =========================================================
   PRICE CALCULATOR ENGINE
========================================================= */

const Pricing = {

    calculate(basePrice, guests) {
        let total = basePrice * guests;

        if (guests >= 5) {
            total *= 0.9; // discount
        }

        return Math.round(total);
    }
};

/* =========================================================
   DATE ENGINE (BOOKING CALENDAR LOGIC)
========================================================= */

const Calendar = {

    isAvailable(date) {
        const d = new Date(date);
        const today = new Date();

        return d > today;
    },

    format(date) {
        return new Date(date).toISOString().split("T")[0];
    }
};

/* =========================================================
   REGION ENGINE
========================================================= */

const Region = {

    current: null,

    select(id) {
        window.State.currentRegion = id;
        this.current = id;
    }
};
/* =========================================================
   UI EVENT BUS (INTERNAL COMMUNICATION)
========================================================= */

const EventBus = {

    events: {},

    on(event, cb) {
        (this.events[event] ||= []).push(cb);
    },

    emit(event, data) {
        (this.events[event] || []).forEach(cb => cb(data));
    }
};

/* =========================================================
   BOOKING FLOW CONTROLLER
========================================================= */

const BookingFlow = {

    start(regionId) {
        Region.select(regionId);
        EventBus.emit("region:selected", regionId);
    },

    selectPackage(pkg) {
        window.State.selectedPackage = pkg;
        EventBus.emit("package:selected", pkg);
    },

    selectDate(date) {
        if (!Calendar.isAvailable(date)) return false;

        window.State.selectedDate = date;
        EventBus.emit("date:selected", date);

        return true;
    },

    setGuests(num) {
        const guests = Math.min(CONFIG.maxGuests, num);

        window.State.selectedGuests = guests;
        EventBus.emit("guests:selected", guests);
    },

    async confirm() {

        const pkg = State.selectedPackage;

        if (!pkg || !window.State.selectedDate || !window.State.currentRegion) {
            throw new Error("MISSING_DATA");
        }

        const price = Pricing.calculate(
            pkg.price,
            window.State.selectedGuests
        );

        return await Booking.create({
            region: window.State.currentRegion,
            package: pkg,
            date: window.State.selectedDate,
            guests: window.State.selectedGuests,
            price
        });
    }
};
/* =========================================================
   INIT SYSTEM
========================================================= */

function init() {
    initState();

    console.log("🚀 ENTERPRISE BOOKING ENGINE PART 1 LOADED");
}

document.addEventListener("DOMContentLoaded", init);

})();/* =========================================================
   PART 2/4 — PAYMENTS + COUPONS + AVAILABILITY ENGINE
========================================================= */

(() => {
"use strict";

/* =========================================================
   EXTEND GLOBAL STATE
========================================================= */

if (!window.State) window.State = {};

Object.assign(window.State, {
    coupon: null,
    discount: 0,
    availability: {},
    paymentMethod: null,
    lastPrice: 0
});

/* =========================================================
   PAYMENT ENGINE (MOCK - PRODUCTION STYLE)
========================================================= */

const Payment = {

    methods: {
        card: "כרטיס אשראי",
        paypal: "PayPal",
        cash: "מזומן במקום"
    },

    select(method) {
        window.State.paymentMethod = method;
        console.log("Payment selected:", method);
    },

    async process(amount) {

        console.log("Processing payment...");

        await new Promise(r => setTimeout(r, 1200));

        const success = Math.random() > 0.1; // 90% success simulation

        if (!success) {
            throw new Error("PAYMENT_FAILED");
        }

        return {
            success: true,
            transactionId: "TX_" + Date.now(),
            amount
        };
    }
};

/* =========================================================
   COUPON / DISCOUNT ENGINE
========================================================= */

const Coupons = {

    list: {
        "WELCOME10": 10,
        "VIP20": 20,
        "SUMMER15": 15
    },

    apply(code, price) {

        const discount = this.list[code];

        if (!discount) {
            return { valid: false, final: price };
        }

        const final = price - (price * discount / 100);

        window.State.coupon = code;
        window.State.discount = discount;

        return {
            valid: true,
            discount,
            final: Math.round(final)
        };
    }
};

/* =========================================================
   AVAILABILITY ENGINE (REAL BOOKING LOGIC)
========================================================= */

const Availability = {

    slots: {},

    init() {

        // generate fake availability for next 30 days
        const today = new Date();

        for (let i = 0; i < 30; i++) {

            const d = new Date(today);
            d.setDate(today.getDate() + i);

            const key = d.toISOString().split("T")[0];

            this.slots[key] = {
                max: 10,
                booked: Math.floor(Math.random() * 5)
            };
        }
    },

    isAvailable(date, guests = 1) {

        const slot = this.slots[date];

        if (!slot) return false;

        return (slot.booked + guests) <= slot.max;
    },

    book(date, guests) {

        if (!this.isAvailable(date, guests)) {
            throw new Error("NO_AVAILABILITY");
        }

        this.slots[date].booked += guests;

        return true;
    }
};

/* =========================================================
   SMART PRICING ENGINE (DYNAMIC PRICING)
========================================================= */

const SmartPricing = {

    baseMultiplier: 1,

    calculate(base, guests, date) {

        let price = base * guests;

        // weekend boost
        const d = new Date(date);
        if (d.getDay() === 5 || d.getDay() === 6) {
            price *= 1.2;
        }

        // group discount
        if (guests >= 5) {
            price *= 0.85;
        }

        // coupon
        if (window.State.discount) {
            price *= (1 - window.State.discount / 100);
        }

        window.State.lastPrice = Math.round(price);

        return Math.round(price);
    }
};

/* =========================================================
   BOOKING VALIDATION ENGINE
========================================================= */

const BookingValidator = {

    validate(data) {

        const errors = [];

        if (!data.date) errors.push("DATE_MISSING");
        if (!data.package) errors.push("PACKAGE_MISSING");
        if (!data.region) errors.push("REGION_MISSING");

        if (data.guests <= 0) errors.push("INVALID_GUESTS");

        if (!Availability.isAvailable(data.date, data.guests)) {
            errors.push("NOT_AVAILABLE");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
};

/* =========================================================
   ENHANCED BOOKING FLOW (UPGRADED)
========================================================= */

const EnhancedBookingFlow = {

    async confirmBooking() {

        const state = window.State;

        const data = {
            region: state.currentRegion,
            package: state.selectedPackage,
            date: state.selectedDate,
            guests: state.selectedGuests
        };

        const validation = BookingValidator.validate(data);

        if (!validation.valid) {
            throw new Error(validation.errors.join(","));
        }

        // calculate price
        const price = SmartPricing.calculate(
            state.selectedPackage.price,
            state.selectedGuests,
            state.selectedDate
        );

        // book slot
        Availability.book(state.selectedDate, state.selectedGuests);

        // process payment
        const payment = await Payment.process(price);

        return {
            success: true,
            bookingId: "BK_" + Date.now(),
            price,
            payment
        };
    }
};

/* =========================================================
   BOOKING SUMMARY ENGINE (UI DATA BUILDER)
========================================================= */

const BookingSummary = {

    build() {

        const s = window.State;

        return {
            region: s.currentRegion,
            package: s.selectedPackage?.title,
            date: s.selectedDate,
            guests: s.selectedGuests,
            coupon: s.coupon,
            discount: s.discount,
            price: s.lastPrice,
            paymentMethod: s.paymentMethod
        };
    }
};

/* =========================================================
   NOTIFICATION ENGINE (UI SYSTEM)
========================================================= */

const Notify = {

    show(msg, type = "info") {

        const el = document.createElement("div");

        el.className = `notify notify-${type}`;
        el.innerText = msg;

        document.body.appendChild(el);

        setTimeout(() => el.classList.add("show"), 50);

        setTimeout(() => {
            el.classList.remove("show");
            setTimeout(() => el.remove(), 400);
        }, 3000);
    }
};

/* =========================================================
   INIT PART 2
========================================================= */

function initPart2() {

    Availability.init();

    console.log("💳 PART 2 LOADED — PAYMENTS + AVAILABILITY READY");
}

document.addEventListener("DOMContentLoaded", initPart2);

})();/* =========================================================
   PART 3/4 — UI ENGINE + DASHBOARD + ANALYTICS + CALENDAR
========================================================= */

(() => {
"use strict";

/* =========================================================
   GLOBAL UI STATE EXTENSION
========================================================= */

if (!window.State) window.State = {};

Object.assign(window.State, {
    dashboardOpen: false,
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear(),
    notifications: [],
    analytics: {
        views: 0,
        bookings: 0,
        revenue: 0
    }
});

/* =========================================================
   DASHBOARD ENGINE (USER PANEL)
========================================================= */

const Dashboard = {

    open() {
        const el = document.getElementById("dashboard");
        if (!el) return;

        el.classList.add("open");
        window.State.dashboardOpen = true;

        this.render();
    },

    close() {
        const el = document.getElementById("dashboard");
        if (!el) return;

        el.classList.remove("open");
        window.State.dashboardOpen = false;
    },

    render() {
        const el = document.getElementById("dashboard-content");
        if (!el) return;

        const s = window.State;

        el.innerHTML = `
            <h2>דשבורד אישי</h2>

            <div class="dash-box">
                <p>הזמנות: ${s.analytics.bookings}</p>
                <p>צפיות: ${s.analytics.views}</p>
                <p>הכנסות: ₪${s.analytics.revenue}</p>
            </div>
        `;
    }
};



/* =========================================================
   CALENDAR ENGINE (BOOKING UI CALENDAR)
========================================================= */

const CalendarUI = {

    generate(month, year) {

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let html = `<div class="calendar">`;

        html += `<h3>${month + 1}/${year}</h3>`;
        html += `<div class="calendar-grid">`;

        for (let i = 1; i <= daysInMonth; i++) {

            const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

            html += `
                <div class="calendar-day"
                     onclick="selectDate('${date}')">
                     ${i}
                </div>
            `;
        }

        html += `</div></div>`;

        const el = document.getElementById("calendar");
        if (el) el.innerHTML = html;
    }
};

/* =========================================================
   DATE SELECTION SYSTEM
========================================================= */

window.selectDate = function(date) {

    window.State.selectedDate = date;

    const el = document.getElementById("selected-date");
    if (el) el.innerText = "נבחר תאריך: " + date;

    Notification.show("התאריך נבחר בהצלחה");
};

/* =========================================================
   NOTIFICATION SYSTEM (UI TOASTS)
========================================================= */

const Notification = {

    show(msg) {

        const el = document.createElement("div");
        el.className = "toast";
        el.innerText = msg;

        document.body.appendChild(el);

        setTimeout(() => el.classList.add("show"), 50);

        setTimeout(() => {
            el.classList.remove("show");
            setTimeout(() => el.remove(), 400);
        }, 2500);
    }
};

/* =========================================================
   MODAL SYSTEM (GLOBAL UI CONTROL)
========================================================= */

const Modal = {

    open(id) {
        const el = document.getElementById(id);
        if (!el) return;

        el.classList.add("open");
    },

    close(id) {
        const el = document.getElementById(id);
        if (!el) return;

        el.classList.remove("open");
    }
};

/* =========================================================
   SIDEBAR NAVIGATION ENGINE
========================================================= */

const Sidebar = {

    toggle() {
        const el = document.getElementById("sidebar");
        if (!el) return;

        el.classList.toggle("open");
    }
};

/* =========================================================
   SEARCH ENGINE (REAL-TIME FILTER)
========================================================= */

const Search = {

    init() {
        const input = document.getElementById("search");

        if (!input) return;

        input.addEventListener("input", (e) => {
            this.filter(e.target.value);
        });
    },

    filter(query) {

        document.querySelectorAll(".region-card").forEach(card => {

            const text = card.innerText.toLowerCase();

            if (text.includes(query.toLowerCase())) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }
};

/* =========================================================
   SCROLL ANIMATION ENGINE (IMPROVED)
========================================================= */

const ScrollFX = {

    init() {
        this.items = document.querySelectorAll(
            "section, .card, .region-card, .dashboard-box"
        );

        window.addEventListener("scroll", () => this.check());
        this.check();
    },

    check() {

        this.items.forEach(el => {

            const top = el.getBoundingClientRect().top;

            if (top < window.innerHeight - 120) {
                el.classList.add("show");
            }
        });
    }
};

/* =========================================================
   WHATSAPP BOOKING SHARE ENGINE
========================================================= */

const WhatsApp = {

    shareBooking() {

        const s = window.State;

        const msg =
`הזמנה חדשה:
📍 אזור: ${s.currentRegion}
📅 תאריך: ${s.selectedDate}
👥 משתתפים: ${s.selectedGuests}
💰 מחיר: ₪${s.lastPrice}`;

        const url = `https://wa.me/${CONFIG?.whatsapp || "972503251251"}?text=${encodeURIComponent(msg)}`;

        window.open(url, "_blank");
    }
};

/* =========================================================
   ADMIN PANEL (SIMPLE VERSION)
========================================================= */

const Admin = {

    open() {
        const el = document.getElementById("admin");
        if (el) el.classList.add("open");

        this.render();
    },

    render() {

        const el = document.getElementById("admin-content");
        if (!el) return;

        const bookings = window.State.bookings || [];

        el.innerHTML = `
            <h2>ניהול הזמנות</h2>

            ${bookings.map(b => `
                <div class="booking-item">
                    <p>${b.region}</p>
                    <p>${b.date}</p>
                    <p>₪${b.price}</p>
                </div>
            `).join("")}
        `;
    }
};

/* =========================================================
   KEYBOARD SHORTCUTS SYSTEM
========================================================= */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        document.querySelectorAll(".open").forEach(el => {
            el.classList.remove("open");
        });
    }

    if (e.key === "d") {
        document.body.classList.toggle("dark-mode");
    }

    if (e.key === "b") {
        if (window.Dashboard?.open) {
            window.Dashboard.open();
        }
    }

});

/* =========================================================
   INIT SYSTEM
========================================================= */

function init() {

    Analytics.load();
    ScrollFX.init();
    Search.init();
    CalendarUI.generate(window.State.calendarMonth, window.State.calendarYear);

    console.log("🎛️ PART 3 LOADED — UI + DASHBOARD READY");
}

document.addEventListener("DOMContentLoaded", init);

})();/* =========================================================
   PART 4/4 — AUTH + ROLES + CACHE + SEO + PERFORMANCE CORE
   FINAL ENTERPRISE LAYER (PRODUCTION ARCHITECTURE STYLE)
========================================================= */

(() => {
"use strict";

/* =========================================================
   GLOBAL EXTENSION
========================================================= */

if (!window.State) window.State = {};

Object.assign(window.State, {
    role: "guest",
    token: null,
    session: null
});

/* =========================================================
   AUTH SYSTEM (REALISTIC MOCK)
========================================================= */

const Auth = {

    register(name, phone, password) {

        const user = {
            id: "U_" + Date.now(),
            name,
            phone,
            password,
            role: "user"
        };

        localStorage.setItem("jt_user", JSON.stringify(user));

        window.State.role = "user";
        window.State.session = user;

        return user;
    },

    login(phone, password) {

        const user = JSON.parse(localStorage.getItem("jt_user"));

        if (!user) throw new Error("USER_NOT_FOUND");

        if (user.phone !== phone || user.password !== password) {
            throw new Error("INVALID_CREDENTIALS");
        }

        window.State.session = user;
        window.State.role = user.role;

        return user;
    },

    logout() {
        window.State.session = null;
        window.State.role = "guest";
    },

    isAdmin() {
        return window.State.role === "admin";
    }
};

/* =========================================================
   ROLE SYSTEM (ACCESS CONTROL)
========================================================= */

const Roles = {

    requireAdmin() {
        if (!Auth.isAdmin()) {
            throw new Error("ACCESS_DENIED");
        }
    },

    canBook() {
        return window.State.role === "user" || window.State.role === "admin";
    }
};

/* =========================================================
   TOKEN SYSTEM (SIMULATED JWT)
========================================================= */

const Token = {

    generate() {
        const token = btoa(Date.now() + "-" + Math.random());
        window.State.token = token;
        return token;
    },

    validate(token) {
        return token && token.length > 10;
    }
};

/* =========================================================
   CACHE ENGINE (HIGH PERFORMANCE LAYER)
========================================================= */

const Cache = {

    store: new Map(),

    set(key, value, ttl = 60000) {
        this.store.set(key, {
            value,
            expire: Date.now() + ttl
        });
    },

    get(key) {

        const data = this.store.get(key);

        if (!data) return null;

        if (Date.now() > data.expire) {
            this.store.delete(key);
            return null;
        }

        return data.value;
    },

    clear() {
        this.store.clear();
    }
};

/* =========================================================
   PERFORMANCE MONITOR (REAL ENGINE)
========================================================= */

const Performance = {

    marks: {},

    mark(name) {
        this.marks[name] = performance.now();
    },

    measure(start, end) {
        return (this.marks[end] || 0) - (this.marks[start] || 0);
    },

    report() {
        console.table(this.marks);
    }
};

/* =========================================================
   SEO ENGINE (DYNAMIC META + CONTENT)
========================================================= */

const SEO = {

    setTitle(title) {
        document.title = title + " | Jerusalem Tours";
    },

    setMeta(desc) {
        let tag = document.querySelector("meta[name='description']");

        if (!tag) {
            tag = document.createElement("meta");
            tag.name = "description";
            document.head.appendChild(tag);
        }

        tag.content = desc;
    },

    injectRegion(region) {

        const map = {
            jerusalem: "סיורים בירושלים - עיר עתיקה והיסטורית",
            telaviv: "תל אביב - חיי לילה, חופים ואטרקציות",
            eilat: "אילת - חופשה מושלמת בים סוף",
            deadsea: "ים המלח - המקום הנמוך בעולם"
        };

        const text = map[region] || "טיולים בישראל";

        SEO.setTitle(text);
        SEO.setMeta(text);
    }
};

/* =========================================================
   ANALYTICS CORE (FINAL VERSION)
========================================================= */

const Analytics = {

    track(event, data = {}) {

        const log = {
            event,
            data,
            time: new Date().toISOString()
        };

        let history = JSON.parse(localStorage.getItem("jt_logs") || "[]");

        history.push(log);

        localStorage.setItem("jt_logs", JSON.stringify(history));
    },

    getLogs() {
        return JSON.parse(localStorage.getItem("jt_logs") || "[]");
    }
};

/* =========================================================
   API LAYER (FINAL MOCK BACKEND)
========================================================= */

const Api = {

    async request(endpoint, data = {}) {

        await new Promise(r => setTimeout(r, 400));

        Cache.set(endpoint, data, 30000);

        return {
            success: true,
            endpoint,
            data
        };
    }
};

/* =========================================================
   ADMIN ENGINE (FULL CONTROL PANEL)
========================================================= */

const Admin = {

    open() {
        Roles.requireAdmin();

        const el = document.getElementById("admin");
        if (el) el.classList.add("open");

        this.render();
    },

    render() {

        const el = document.getElementById("admin-content");
        if (!el) return;

        const logs = Analytics.getLogs();

        el.innerHTML = `
            <h2>Admin Panel</h2>

            <div class="admin-box">
                <p>פעולות מערכת: ${logs.length}</p>
            </div>

            <div class="logs">
                ${logs.slice(-10).map(l => `
                    <div class="log-item">
                        <b>${l.event}</b>
                        <small>${l.time}</small>
                    </div>
                `).join("")}
            </div>
        `;
    }
};

/* =========================================================
   BOOKING FINAL WRAPPER (CONNECTED SYSTEM)
========================================================= */

const BookingSystem = {

    async completeBooking(data) {

        if (!Roles.canBook()) {
            throw new Error("NOT_ALLOWED");
        }

        const response = await Api.request("/booking/create", data);

        Analytics.track("booking_created", data);

        return response;
    }
};

/* =========================================================
   UI HELPERS (FINAL CLEAN LAYER)
========================================================= */

const UI = {

    toast(msg) {

        const el = document.createElement("div");
        el.className = "toast";
        el.innerText = msg;

        document.body.appendChild(el);

        setTimeout(() => el.classList.add("show"), 50);

        setTimeout(() => {
            el.classList.remove("show");
            setTimeout(() => el.remove(), 300);
        }, 2500);
    },

    open(id) {
        document.getElementById(id)?.classList.add("open");
    },

    close(id) {
        document.getElementById(id)?.classList.remove("open");
    }
};

/* =========================================================
   GLOBAL SHORTCUTS
========================================================= */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        document.querySelectorAll(".open").forEach(el => el.classList.remove("open"));
    }

    if (e.key === "a") {
        try { Admin.open(); } catch(e) { UI.toast("אין הרשאת אדמין"); }
    }
});

/* =========================================================
   INIT SYSTEM (FINAL BOOT)
========================================================= */

function init() {

    console.log("🚀 ENTERPRISE SYSTEM FULLY LOADED");

    Analytics.track("app_loaded");

    Performance.report();
}

document.addEventListener("DOMContentLoaded", init);

})();
/* ===== חזרה למעלה ===== */

const backBtn = document.getElementById("backToTop");

if (backBtn) {

  backBtn.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

}/* ===== צור קשר ===== */

const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("openContactModal");
const closeBtn = document.querySelector(".close");

if (openBtn) {

  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

}

if (closeBtn) {

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

}

window.addEventListener("click", (e) => {

  if (e.target === modal) {
    modal.style.display = "none";
  }

});/* חסימת קליק ימני */

document.addEventListener("contextmenu", function(e){
   e.preventDefault();
});

/* חסימת גרירה */

document.querySelectorAll("img").forEach(img => {
   img.addEventListener("dragstart", function(e){
      e.preventDefault();
   });
});

/* חסימת כמה קיצורי מקשים נפוצים */

document.addEventListener("keydown", function(e) {

   if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.key === "u")
   ) {
      e.preventDefault();
   }

}); // 👈 זה היה חסר

/* ===== פתיחת/סגירת תפריט ===== */

const a11yBtn = document.getElementById("accessibility-btn");
const a11yMenu = document.getElementById("accessibility-menu");

if (a11yBtn && a11yMenu) {
  a11yBtn.addEventListener("click", () => {
    a11yMenu.style.display =
      a11yMenu.style.display === "block" ? "none" : "block";
  });
}

/* ===== מצב שחור/לבן ===== */

function toggleGrayscale() {
  document.body.classList.toggle("grayscale");
}

/* ===== ניגודיות גבוהה ===== */

function toggleHighContrast() {
  document.body.classList.toggle("high-contrast");
}

/* ===== שינוי גודל טקסט ===== */

function changeFontSize(step) {
  let current = parseFloat(
    window.getComputedStyle(document.body).fontSize
  );

  document.body.style.fontSize = (current + step) + "px";
}

/* ===== איפוס ===== */

function resetA11y() {
  document.body.classList.remove("grayscale");
  document.body.classList.remove("high-contrast");
  document.body.style.fontSize = "";
}/* ===== CONTACT FORM EMAILJS ===== */

/* ===== CONTACT FORM EMAILJS + WHATSAPP (FINAL CLEAN VERSION) ===== */

(function () {

  emailjs.init("u9MRRRVgErghPjkuE");

  const form = document.getElementById("contactForm");
  const modal = document.getElementById("contactModal");

  if (!form) return;

  let isSending = false;

  // הודעות UI (Toast)
  function showToast(msg, type = "success") {

    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.innerText = msg;

    document.body.appendChild(el);

    setTimeout(() => el.classList.add("show"), 50);

    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 400);
    }, 2500);
  }

  // וואטסאפ אחרי שליחה
  function sendWhatsApp(firstName, lastName, phone, email) {

    const message =
`📩 פנייה חדשה מהאתר:
👤 ${firstName} ${lastName}
📞 ${phone}
📧 ${email}`;

    const url = `https://wa.me/972503251251?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(url, "_blank");
    }, 800);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (isSending) return;
    isSending = true;

    const btn = form.querySelector("button[type='submit']");

    if (btn) {
      btn.disabled = true;
      btn.innerText = "שולח...";
    }

    const firstName = document.getElementById("firstName")?.value || "";
    const lastName  = document.getElementById("lastName")?.value || "";
    const phone      = document.getElementById("phone")?.value || "";
    const email      = document.getElementById("email")?.value || "";

    emailjs.send("tripjeru_service", "template_4qoa25e", {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      user_email: email
    })
    .then(() => {

      showToast("הטופס נשלח בהצלחה ✅", "success");

      form.reset();

      if (modal) {
        modal.style.display = "none";
      }

      sendWhatsApp(firstName, lastName, phone, email);

    })
    .catch((err) => {

      console.log("EmailJS Error:", err);
      showToast("שגיאה בשליחה ❌", "error");

    })
    .finally(() => {

      isSending = false;

      if (btn) {
        btn.disabled = false;
        btn.innerText = "שליחה";
      }

    });

  });

})();
document.querySelectorAll(".gallery img").forEach(img => {
  img.addEventListener("click", () => {

    // מוריד מצב מכל התמונות
    document.querySelectorAll(".gallery img")
      .forEach(i => i.classList.remove("active-color"));

    // שם צבע רק על התמונה שנלחצה
    img.classList.add("active-color");
  });
});
document.querySelectorAll(".gallery img").forEach(img => {

  img.addEventListener("click", () => {

    document.querySelectorAll(".gallery img")
      .forEach(i => i.classList.remove("active"));

    img.classList.add("active");

  });

});
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
document.getElementById("backToTop").addEventListener("click", function () {
  const rooms = document.querySelectorAll(".gallery, .slider-container, main, body");

  rooms.forEach(r => {
    r.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
});function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}let index = 0;
const slides = document.querySelectorAll(".hero-slide");

function showSlide() {
  slides.forEach(s => s.classList.remove("active"));
  slides[index].classList.add("active");

  index++;
  if (index >= slides.length) index = 0;
}

setInterval(showSlide, 4000);
// פתיחת תפריט מובייל
function toggleMenu() {
    document.querySelector('.header-nav').classList.toggle('open');
}

// shrink header בגלילה
window.addEventListener('scroll', function () {
    const header = document.querySelector('.sticky-header');

    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});window.addEventListener("scroll", () => {
  const header = document.getElementById("header");

  if(window.scrollY > 50){
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});function openRoom(id){
  const content = document.getElementById(id).innerHTML;
  document.getElementById("room-inner").innerHTML = content;
  document.getElementById("room").style.display = "flex";
}

function closeRoom(){
  document.getElementById("room").style.display = "none";
}