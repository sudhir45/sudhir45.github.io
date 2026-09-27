import { isFull } from './level';
import { replayGroup } from './reveal';

/** cubic-bezier(.45, 0, .2, 1), solved for x by Newton's method. */
function ease(x: number) {
	const [x1, y1, x2, y2] = [0.45, 0, 0.2, 1];
	const bez = (t: number, a: number, b: number) =>
		3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
	let t = x;
	for (let i = 0; i < 6; i++) {
		const dx = bez(t, x1, x2) - x;
		const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t ** 2;
		if (Math.abs(d) < 1e-6) break;
		t = Math.min(1, Math.max(0, t - dx / d));
	}
	return bez(t, y1, y2);
}

/**
 * WorkaroundFigure: the CSS primitives draw the gates, task line and arc; this moves the amber dot
 * along the workaround to DONE, and replays the whole sequence once on hover or focus.
 */
export function setupFigures(signal: AbortSignal) {
	document.querySelectorAll<SVGSVGElement>('[data-workaround]').forEach((figure) => {
		const group = figure.closest('[data-reveal]') ?? figure;
		const route = figure.querySelector<SVGPathElement>('[data-route]');
		const dot = figure.querySelector<SVGCircleElement>('[data-dot]');
		if (!route || !dot) return;
		const start = Number(figure.dataset.dotDelay ?? 2600);
		const duration = 1900;
		const length = route.getTotalLength();
		let frame = 0;
		let timer: ReturnType<typeof setTimeout> | undefined;

		const place = (progress: number) => {
			const point = route.getPointAtLength(length * progress);
			dot.setAttribute('transform', `translate(${point.x} ${point.y})`);
		};
		const run = () => {
			cancelAnimationFrame(frame);
			clearTimeout(timer);
			dot.style.opacity = '0';
			if (!isFull()) return;
			timer = setTimeout(() => {
				const began = performance.now();
				dot.style.opacity = '1';
				const tick = (now: number) => {
					const progress = Math.min(1, (now - began) / duration);
					place(ease(progress));
					if (progress < 1) frame = requestAnimationFrame(tick);
				};
				frame = requestAnimationFrame(tick);
			}, start);
		};

		// Start when the group is revealed by the observer.
		const watcher = new MutationObserver(() => {
			if (group.hasAttribute('data-in') && group.getAttribute('data-in') !== 'instant') {
				watcher.disconnect();
				run();
			}
		});
		watcher.observe(group, { attributes: true, attributeFilter: ['data-in'] });

		let playing = false;
		let unlock: ReturnType<typeof setTimeout> | undefined;
		const replay = () => {
			if (!isFull() || playing || !group.hasAttribute('data-in')) return;
			playing = true;
			replayGroup(group);
			run();
			unlock = setTimeout(() => (playing = false), start + duration);
		};
		const host = figure.closest('figure') ?? figure;
		host.addEventListener('mouseenter', replay, { signal });
		host.addEventListener('focusin', replay, { signal });

		signal.addEventListener('abort', () => {
			watcher.disconnect();
			cancelAnimationFrame(frame);
			clearTimeout(timer);
			clearTimeout(unlock);
		});
	});
}
