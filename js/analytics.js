
import { State } from "../core/state.js";

export function trackView() {
  State.analytics.views++;
}