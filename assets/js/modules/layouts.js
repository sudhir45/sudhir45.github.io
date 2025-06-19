// Imports from basic.js
import { back2top, loadTooptip, modeWatcher } from '../components';
// Imports from topbar.js
import { displaySearch } from '../components/search-display';

const ATTR_DISPLAY = 'sidebar-display';
const $sidebar = document.getElementById('sidebar');
const $mask = document.getElementById('mask');

class SidebarUtil {
  static #isExpanded = false;

  static toggle() {
    this.#isExpanded = !this.#isExpanded;
    document.body.toggleAttribute(ATTR_DISPLAY, this.#isExpanded);
    if ($sidebar) $sidebar.classList.toggle('z-2', this.#isExpanded);
    if ($mask) $mask.classList.toggle('d-none', !this.#isExpanded);
  }
}

export function initSidebar() {
  const originalTrigger = document.getElementById('sidebar-trigger');
  if (originalTrigger && originalTrigger.id !== 'sidebar-toggle') {
    originalTrigger.onclick = () => SidebarUtil.toggle();
  }
  if ($mask) {
    $mask.onclick = () => SidebarUtil.toggle();
  }

  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-collapsed');
      const mainWrapper = document.getElementById('main-wrapper');
      if (mainWrapper) {
        if (sidebar.classList.contains('sidebar-collapsed')) {
          mainWrapper.style.marginLeft = '0';
        } else {
          mainWrapper.style.marginLeft = '';
        }
      }
    });
  }
}

// Actual function from basic.js
export function basic() {
  modeWatcher();
  back2top();
  loadTooptip();
}

// Actual function from topbar.js
export function initTopbar() {
  displaySearch();
}

// Clean up the temporary files basic.js and topbar.js
// This should be done in a separate bash step if possible,
// but I'll try to do it here if the tool allows multiple commands.
// No, stick to overwriting layouts.js for now.
// I will remove basic.js and topbar.js in the next step.
