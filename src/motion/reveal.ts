import { isFull } from './level';

/** Every primitive declared in styles/motion.css. */
export const PRIMITIVES =
	'[data-rise],[data-draw],[data-stroke],[data-show],[data-ink],[data-unmask],[data-band],[data-iris],[data-slide]';

const ARRIVED_KEY = 'folio:arrived';

const mark = (el: Element, value = '', force = false) => {
	if (force || !el.hasAttribute('data-in')) el.setAttribute('data-in', value);
};

/** Reveal a [data-reveal] group or a single primitive. */
export function revealNow(target: Element, value = '', force = false) {
	if (target.matches('[data-reveal]')) {
		mark(target, value, force);
		target.querySelectorAll(PRIMITIVES).forEach((el) => mark(el, value, force));
	} else mark(target, value, force);
}

/**
 * Restart a group from its first frame. Switching to 'instant' drops the animations;
 * switching back after a reflow starts them again from the beginning.
 */
export function replayGroup(target: Element) {
	revealNow(target, 'instant', true);
	void (target as HTMLElement).getBoundingClientRect();
	revealNow(target, '', true);
}

function arrivedBefore(): boolean {
	try {
		if (sessionStorage.getItem(ARRIVED_KEY)) return true;
		sessionStorage.setItem(ARRIVED_KEY, '1');
	} catch {
		/* Without storage the arrival plays every time. */
	}
	return false;
}

/**
 * Scroll-triggered primitives start when their top passes 15% above the bottom of the viewport,
 * once per page view. [data-reveal] containers reveal all their primitives together, so the
 * --delay values inside a group are relative to the group entering view.
 */
export function setupReveal(signal: AbortSignal) {
	const all = [...document.querySelectorAll(PRIMITIVES), ...document.querySelectorAll('[data-reveal]')];
	if (!isFull()) {
		all.forEach((el) => mark(el, 'instant'));
		return;
	}

	// The homepage arrival (masthead rule and hero) plays once per session; later visits render
	// it in its final state. Scroll reveals further down the page still play every visit.
	if (document.querySelector('[data-arrival]') && arrivedBefore()) {
		document.querySelectorAll('[data-arrival]').forEach((group) => {
			mark(group, 'instant');
			group.querySelectorAll(PRIMITIVES).forEach((el) => mark(el, 'instant'));
			group.querySelectorAll('[data-reveal]').forEach((el) => mark(el, 'instant'));
		});
	}

	const targets = [
		...document.querySelectorAll('[data-reveal]'),
		...[...document.querySelectorAll(PRIMITIVES)].filter((el) => !el.closest('[data-reveal]'))
	];
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				revealNow(entry.target);
				observer.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -15% 0px' }
	);
	targets.forEach((el) => observer.observe(el));
	signal.addEventListener('abort', () => observer.disconnect());
}
