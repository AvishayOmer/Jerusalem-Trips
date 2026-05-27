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
  "images/6.jpg",
   "images/7.jpg",
  "images/8.jpg",
  "images/9.jpg",
  "images/10.jpg",
  "images/11.jpg",
  "images/12.jpg",
   "images/13.jpg",
  "images/14.jpg",
  "images/15.jpg",
  "images/16.jpg",
  "images/logo.jpg",
  "images/logo2.jpg"
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
   ANALYTICS CORE (FINAL VERSION)
========================================================= */

const Analytics = {
init(){

this.load();

},
load(){

const logs=
JSON.parse(
localStorage.getItem(
"jt_logs"
)||"[]"
);

/* אם State לא קיים — צור אותו */
window.State=
window.State||{};

window.State.analytics=
window.State.analytics||{};

window.State.analytics.views=
logs.length;

return logs;

},

track(event,data={}){

const log={

event,
data,
time:new Date().toISOString()

};

let history=
JSON.parse(
localStorage.getItem(
"jt_logs"
)||"[]"
);

history.push(log);

localStorage.setItem(
"jt_logs",
JSON.stringify(history)
);

},

getLogs(){

return JSON.parse(
localStorage.getItem(
"jt_logs"
)||"[]"
);

}

};

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
            userId:State.session.id,
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

        const s = window.State || {};

        const msg =
`הזמנה חדשה:
📍 אזור: ${s.currentRegion || "לא נבחר"}
📅 תאריך: ${s.selectedDate || "לא נבחר"}
👥 משתתפים: ${s.selectedGuests || "לא צוין"}
💰 מחיר: ₪${s.lastPrice || 0}`;

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

  if (typeof Analytics !== "undefined") {

Analytics.init();

}if (typeof Analytics !== "undefined") {

Analytics.track();

}
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
   AUTH SYSTEM v2
   PRODUCTION STRUCTURE
========================================================= */

const Auth = {

usersKey:"jt_users",
sessionKey:"jt_session",

register(name,phone,password){

const users=
JSON.parse(
localStorage.getItem(this.usersKey)
)||[];


/* בדיקה שמשתמש קיים */

const exists=
users.find(
u=>u.phone===phone
);

if(exists){

throw new Error(
"USER_ALREADY_EXISTS"
);

}


/* יצירת משתמש */

const user={

id:"U_"+Date.now(),

name:name.trim(),

phone:phone.replace(/\D/g,""),

password:btoa(password),

role:"user",

createdAt:
new Date().toISOString()

};


users.push(user);

localStorage.setItem(

this.usersKey,

JSON.stringify(users)

);


/* יצירת סשן */

this.createSession(user);

return user;

},


login(phone,password){

const users=
JSON.parse(
localStorage.getItem(
this.usersKey
)
)||[];


const user=
users.find(

u=>

u.phone===phone.replace(/\D/g,"")

);


if(!user){

throw new Error(
"USER_NOT_FOUND"
);

}


/* בדיקת סיסמה */

if(

user.password
!==

btoa(password)

){

throw new Error(
"INVALID_CREDENTIALS"
);

}


/* יצירת סשן */

this.createSession(
user
);

return user;

},


createSession(user){

const session={

userId:user.id,

role:user.role,

token:

btoa(

Date.now()
+"-"+
Math.random()

),

createdAt:
Date.now(),

expires:

Date.now()
+

1000
*
60
*
60
*
24

};


localStorage.setItem(

this.sessionKey,

JSON.stringify(session)

);


window.State.session=
session;

window.State.role=
user.role;

window.State.user=
user;

},


logout(){

localStorage.removeItem(
this.sessionKey
);

window.State.session=
null;

window.State.user=
null;

window.State.role=
"guest";

},


isLoggedIn(){

const session=

JSON.parse(

localStorage.getItem(
this.sessionKey
)

);

if(!session)
return false;


/* בדיקת תוקף */

if(

Date.now()
>

session.expires

){

this.logout();

return false;

}

return true;

},


isAdmin(){

return window.State.role==="admin";

},


currentUser(){

return window.State.user;

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
   API LAYER (FINAL MOCK BACKEND)
========================================================= */

const CoreApi = {

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

window.Admin={

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

        const response = await CoreApi.request("/booking/create", data);

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
/* ====================================
   TRIP JERU PREMIUM FINAL
   HTML SYNC VERSION
==================================== */

document.addEventListener("DOMContentLoaded",()=>{

/* ==========================
   ELEMENTS
========================== */

const backBtn=document.getElementById("backToTop");

const modal=document.getElementById(
"contactModal"
);

const openBtn=document.getElementById(
"openContactModal"
);

const closeBtn=document.querySelector(
".close"
);

const form=document.getElementById(
"contactForm"
);

const a11yBtn=document.getElementById(
"accessibility-btn"
);

const a11yMenu=document.getElementById(
"accessibility-menu"
);

const header=document.getElementById(
"header"
);

const slides=document.querySelectorAll(
".hero-slide"
);


/* ==========================
   EMAILJS
========================== */

if (window.emailjs) {

document.addEventListener("DOMContentLoaded", () => {

if (typeof emailjs !== "undefined") {

emailjs.init(
"u9MRRRVgErghPjkuE"
);

console.log("EmailJS נטען");

} else {

console.error("EmailJS לא נטען");

}

});

} else {

console.error("EmailJS לא נטען");

}

/* ==========================
   TOAST
========================== */

function showToast(
message,
type="success"
){

let toast=
document.getElementById(
"toast"
);

if(!toast){

toast=
document.createElement(
"div"
);

toast.id="toast";

toast.className="toast";

document.body.appendChild(
toast
);

}

toast.innerText=message;

toast.style.background=

type==="success"

?

"rgba(34,197,94,.92)"

:

"rgba(239,68,68,.92)";

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},2500);

}


/* ==========================
   CONTACT MODAL
========================== */

if(openBtn){

openBtn.onclick=()=>{

modal.style.display=
"block";

};

}

if(closeBtn){

closeBtn.onclick=()=>{

modal.style.display=
"none";

};

}

window.onclick=(e)=>{

if(
e.target===modal
){

modal.style.display=
"none";
}

};


/* ==========================
   CONTACT FORM
========================== */

let isSending=false;

if(form){

form.addEventListener(
"submit",
function(e){

e.preventDefault();

if(isSending)
return;

isSending=true;

const btn=
form.querySelector(
"button[type='submit']"
);

btn.disabled=true;

btn.innerText=
"שולח...";


const firstName=
document.getElementById(
"firstName"
)?.value || "";

const lastName=
document.getElementById(
"lastName"
)?.value || "";

const phone=
document.getElementById(
"phone"
)?.value || "";

const email=
document.getElementById(
"email"
)?.value || "";


emailjs.send(

"tripjeru_service",

"template_4qoa25e",

{

first_name:firstName,
last_name:lastName,
phone:phone,
user_email:email

}

)

.then(()=>{

showToast(
"נשלח בהצלחה ✅"
);

form.reset();

modal.style.display=
"none";


const whatsappMessage=`

📩 פנייה חדשה

👤 ${firstName} ${lastName}

📞 ${phone}

📧 ${email}

`;

window.open(

`https://wa.me/972503251251?text=${encodeURIComponent(whatsappMessage)}`,

"_blank"

);

})

.catch((err)=>{

console.log(err);

showToast(

"שגיאה בשליחה ❌",

"error"

);

})

.finally(()=>{

isSending=false;

btn.disabled=false;

btn.innerText=
"שליחה";

});

});

}


/* ==========================
   HERO SLIDER
========================== */

if(slides.length){

let index=0;

setInterval(()=>{

slides.forEach(
slide=>
slide.classList.remove(
"active"
)
);

index++;

if(
index>=slides.length
){

index=0;

}

slides[index]
.classList.add(
"active"
);

},5000);

}


/* ==========================
   HEADER SHRINK
========================== */

window.addEventListener(
"scroll",
()=>{

if(!header)
return;

header.classList.toggle(
"shrink",
window.scrollY>50
);

});



/* ==========================
   BACK TO TOP
========================== */

if(backBtn){

backBtn.onclick=()=>{

window.scrollTo({

top:0,
behavior:"smooth"

});

};

}


/* ==========================
   ACCESSIBILITY
========================== */

if(
a11yBtn &&
a11yMenu
){

a11yBtn.onclick=()=>{

a11yMenu.style.display=

a11yMenu.style.display==="block"

?

"none"

:

"block";

};

}

window.toggleGrayscale=
()=>{

document.body.classList.toggle(
"grayscale"
);

};

window.toggleHighContrast=
()=>{

document.body.classList.toggle(
"high-contrast"
);

};

window.changeFontSize=
(step)=>{

let size=parseFloat(

window.getComputedStyle(
document.body
)

.fontSize

);

document.body.style.fontSize=

(size+step)+"px";

};

window.resetA11y=
()=>{

document.body.classList.remove(
"grayscale"
);

document.body.classList.remove(
"high-contrast"
);

document.body.style.fontSize="";

};


/* ==========================
   GALLERY
========================== */

document
.querySelectorAll(
".gallery img"
)

.forEach(img=>{

img.addEventListener(
"click",
()=>{

document
.querySelectorAll(
".gallery img"
)

.forEach(i=>

i.classList.remove(
"active-color"
)

);

img.classList.add(
"active-color"
);

});

});


/* ==========================
   IMAGE PROTECTION
========================== */

document.addEventListener(

"contextmenu",

e=>e.preventDefault()

);

document
.querySelectorAll("img")

.forEach(img=>{

img.addEventListener(

"dragstart",

e=>e.preventDefault()

);

});

});/* =========================================================
   JERUSALEM TRIPS UI ENGINE v2026
========================================================= */

/* ---------- ROOM SYSTEM ---------- */

const room = document.getElementById("room");
const roomInner = document.getElementById("room-inner");

/* פתיחת חדר */

window.openRoom=function(sectionId){

const section=
document.getElementById(sectionId);

if(!section){

console.log(
"Room not found:",
sectionId
);

return;

}

/* מעתיק תוכן */

roomInner.innerHTML=
section.innerHTML;

/* מציג */

room.style.display="flex";

/* אנימציה */

setTimeout(()=>{

room.classList.add(
"show"
);

},20);

/* חוסם גלילה */

document.body.style.overflow=
"hidden";

/* סוגר תפריט מובייל אם פתוח */

const mobileMenu=
document.getElementById(
"mobileMenu"
);

if(mobileMenu){

mobileMenu.classList.remove(
"active"
);

}

};


/* סגירת חדר */

window.closeRoom=function(){

room.classList.remove(
"show"
);

setTimeout(()=>{

room.style.display="none";

roomInner.innerHTML="";

},300);

document.body.style.overflow=
"auto";

};


/* לחיצה מחוץ לחדר */

if(room){

room.addEventListener(
"click",
function(e){

if(
e.target===room
){

closeRoom();

}

});

}


/* ESC */

document.addEventListener(
"keydown",
function(e){

if(
e.key==="Escape"
){

closeRoom();

}

});


/* ---------- MOBILE MENU ---------- */

window.toggleMenu=function(){

const menu=
document.getElementById(
"mobileMenu"
);

if(!menu)return;

menu.classList.toggle(
"active"
);

};


/* ---------- FAB MENU ---------- */

const fabMenu=
document.getElementById(
"fabMenu"
);

const fabMain=
document.getElementById(
"fabMain"
);

if(fabMain){

fabMain.addEventListener(
"click",
()=>{

fabMenu?.classList.toggle(
"open"
);

});

}


/* ---------- BACK TO TOP ---------- */

const backToTop=
document.getElementById(
"backToTop"
);

if(backToTop){

backToTop.addEventListener(
"click",
()=>{

window.scrollTo({

top:0,
behavior:"smooth"

});

});

}


/* ---------- START ---------- */

console.log(
"🚀 Jerusalem Trips Premium UI Loaded"
);
/* ==========================
   BACK TO TOP
========================== */

document.addEventListener(
"DOMContentLoaded",
function(){

const backToTop =
document.getElementById(
"backToTop"
);

if(backToTop){

backToTop.addEventListener(
"click",
function(){

window.scrollTo({

top:0,
behavior:"smooth"

});

});

}

});

/* הצגה בגלילה */


const backToTop=
document.getElementById(
"backToTop"
);

window.addEventListener("scroll",()=>{
if(!backToTop) return;

if(window.scrollY>300){

backToTop.style.display="block";

}else{

backToTop.style.display="none";

}

});



/* PHONE SANITIZE */

const phone =
document
.getElementById("phone")
?.value
.replace(/\D/g,"")
.substring(0,10)
||"";
document.addEventListener(
"DOMContentLoaded",
()=>{

initState();

initPart2();

Analytics.init();

Search.init();

ScrollFX.init();

CalendarUI.generate(
window.State.calendarMonth,
window.State.calendarYear
);

});