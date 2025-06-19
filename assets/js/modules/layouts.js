// Imports from basic.js and topbar.js (components live elsewhere or are part of the theme)
// Assuming 'initComponents' might be a better name if these are just UI setup.
// For now, keeping the structure that the previous subtask created for these,
// but their definitions would typically be in separate component files.
import { back2top, loadTooptip, modeWatcher } from '../components'; // Path might need checking
import { displaySearch } from '../components/search-display'; // Path might need checking

const ATTR_DISPLAY = 'sidebar-display';
const $sidebar = document.getElementById('sidebar'); // Used by SidebarUtil for z-index
const $trigger = document.getElementById('sidebar-trigger'); // This IS my button now
const $mask = document.getElementById('mask'); // Theme's overlay mask

class SidebarUtil {
  static #isExpanded = false; // Initial state assumed by the theme

  static toggle() {
    // The theme's logic: when sidebar is opened, isExpanded becomes true.
    // Body gets ATTR_DISPLAY=true (or just the attribute name if value is boolean).
    // If starting collapsed (no ATTR_DISPLAY), first click makes isExpanded=true, adds ATTR_DISPLAY.
    // If starting expanded (ATTR_DISPLAY present), first click makes isExpanded=false, removes ATTR_DISPLAY.

    // Let's check how toggleAttribute works. If #isExpanded is true, attr is set. If false, attr is removed.
    // If the page loads with sidebar hidden (no ATTR_DISPLAY), then #isExpanded should be false.
    // First click: #isExpanded becomes true, ATTR_DISPLAY is set. Correct.

    // If the page could load with sidebar initially expanded (ATTR_DISPLAY on body in HTML):
    // Then SidebarUtil.#isExpanded should be initialized to true.
    // For now, assuming it always starts collapsed from HTML structure.
    this.#isExpanded = !this.#isExpanded;
    document.body.toggleAttribute(ATTR_DISPLAY, this.#isExpanded);

    if ($sidebar) { // Ensure sidebar exists
      $sidebar.classList.toggle('z-2', this.#isExpanded); // Theme's z-index management
    }
    if ($mask) { // Ensure mask exists
      $mask.classList.toggle('d-none', !this.#isExpanded); // Theme's mask visibility
    }
  }
}

export function initSidebar() {
  if ($trigger) {
    $trigger.onclick = () => SidebarUtil.toggle();
  }
  // It's possible the theme also uses a mask that, when clicked, closes the sidebar.
  if ($mask) {
    $mask.onclick = () => SidebarUtil.toggle();
  }
  // All other logic (toggling .sidebar-collapsed, manipulating main-wrapper margin)
  // has been removed as it's now handled by SCSS via body[sidebar-display].
}

// These functions were consolidated here by a previous subtask.
// Their actual definitions would come from the imported components.
export function basic() {
  modeWatcher();
  back2top();
  loadTooptip();
}

export function initTopbar() {
  displaySearch();
}
