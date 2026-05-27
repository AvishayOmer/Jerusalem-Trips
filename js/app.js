import { initMenu } from "./menu.js";
import { initModal } from "./modal.js";
import { trackView } from "./analytics.js";
import { updateUI } from "./ui.js";

initMenu();
initModal();
trackView();
updateUI();