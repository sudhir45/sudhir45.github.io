/**
 * Motion runtime: boots on astro:page-load, tears down on astro:before-swap,
 * one AbortController per page. Imported once from Base.astro.
 */
import { applyLevel, motionLevel, resolveLevel, setLevel, type MotionLevel } from './level';
import { setupReveal } from './reveal';
import { setupFigures } from './figure';
import { setupContents } from './contents';
import { onPage } from './lifecycle';

declare global {
	interface Window {
		__folioMotion?: boolean;
	}
}

function setupControl(signal: AbortSignal) {
	document.querySelectorAll<HTMLSelectElement>('[data-motion-control]').forEach((select) => {
		let stored: string | null = null;
		try {
			stored = localStorage.getItem('motion');
		} catch {
			/* Falls back to the OS preference. */
		}
		select.value = stored ?? 'auto';
		select.addEventListener(
			'change',
			() => setLevel(select.value as MotionLevel | 'auto'),
			{ signal }
		);
	});
}

function boot(signal: AbortSignal) {
	applyLevel(resolveLevel());
	setupControl(signal);
	setupFigures(signal);
	setupContents(signal);
	setupReveal(signal);
}

// Tells the head script's safety net that motion code has loaded.
window.__folioMotion = true;
onPage(boot);
document.addEventListener('astro:before-swap', (event) => {
	const next = (event as Event & { newDocument: Document }).newDocument;
	applyLevel(motionLevel(), next.documentElement);
	// Titles that carry over from the clicked row must be visible in the incoming snapshot.
	next.querySelectorAll('[data-carry]').forEach((el) => el.setAttribute('data-in', 'instant'));
});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () =>
	applyLevel(resolveLevel())
);
