

initApp();
function initApp() {
    if (typeof initModal === "function") {
        initModal();
    }

    if (typeof initAccessibility === "function") {
        initAccessibility();
    }

    if (typeof trackView === "function") {
        trackView();
    }
}

initApp();