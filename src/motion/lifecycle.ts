/**
 * Page lifecycle for Astro view transitions: runs `setup` on every astro:page-load with a fresh
 * AbortSignal and aborts it on astro:before-swap. Pass the signal to addEventListener and
 * observers, or listen for its 'abort' event to undo global state.
 */
export function onPage(setup: (signal: AbortSignal) => void) {
	let controller: AbortController | undefined;
	document.addEventListener('astro:page-load', () => {
		controller?.abort();
		controller = new AbortController();
		setup(controller.signal);
	});
	document.addEventListener('astro:before-swap', () => controller?.abort());
}
