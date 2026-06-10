/* ==========================================
   ANALYTICS
========================================== */

function trackView() {

  if (!window.App?.state) {
    console.warn("⚠️ App State not found");
    return;
  }

  if (!window.App.state.analytics) {
    window.App.state.analytics = {
      views: 0
    };
  }

  window.App.state.analytics.views++;

  console.log(
    `👀 Total Views: ${window.App.state.analytics.views}`
  );
}

/* ==========================================
   AUTO TRACK PAGE VIEW
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  trackView();
});

console.log("📊 ANALYTICS LOADED");