(() => {
"use strict";

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
   TRACK VIEW
========================= */

function trackView() {

  const analytics = getState();

  analytics.views++;

  // שמירה ב-localStorage (שדרוג חשוב!)
  localStorage.setItem("views", analytics.views);

  console.log(`👀 Total Views: ${analytics.views}`);
}

/* =========================
   LOAD SAVED DATA
========================= */

function loadAnalytics() {

  const saved = localStorage.getItem("views");

  if (saved) {
    const analytics = getState();
    analytics.views = Number(saved);
  }
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  loadAnalytics();
  trackView();

});

console.log("📊 ANALYTICS PRO LOADED");

})();