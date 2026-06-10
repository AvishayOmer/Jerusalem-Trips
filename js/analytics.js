(() => {
"use strict";

/* =========================
   SAFE STATE
========================= */

function getState() {

  if (!window.App) window.App = {};

  if (!window.App.state) {
    window.App.state = {};
  }

  if (!window.App.state.analytics) {
    window.App.state.analytics = {
      views: 0
    };
  }

  return window.App.state.analytics;
}

/* =========================
   SAFE STORAGE
========================= */

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Storage blocked");
  }
}

/* =========================
   LOAD
========================= */

function loadAnalytics() {

  const analytics = getState();

  const saved = safeGet("views");

  if (saved !== null && !isNaN(saved)) {
    analytics.views = parseInt(saved, 10);
  }
}

/* =========================
   TRACK VIEW
========================= */

function trackView() {

  const analytics = getState();

  // מניעת NaN
  if (typeof analytics.views !== "number" || isNaN(analytics.views)) {
    analytics.views = 0;
  }

  analytics.views += 1;

  safeSet("views", analytics.views);

  console.log(`👀 Total Views: ${analytics.views}`);
}

/* =========================
   PREVENT DOUBLE COUNT (קטן אבל חשוב)
========================= */

let hasTracked = false;

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  if (hasTracked) return;
  hasTracked = true;

  loadAnalytics();
  trackView();

});

console.log("📊 ANALYTICS PRO LOADED");

})();