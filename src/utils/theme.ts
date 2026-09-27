/** Shared theme state, including article art direction and persisted reader preference. */
const preference = () => {
	try {
		return localStorage.getItem('theme');
	} catch {
		return null;
	}
};
// Dark is the default for every visitor; a saved light choice from the toggle wins.
const currentTheme = () => preference() !== 'light';
// Browser bar colours, the sRGB equivalents of --bg in each theme.
const THEME_COLOR = { dark: '#1f1b17', light: '#faf7f1' };
function applyTheme(dark: boolean, root = document.documentElement) {
	root.classList.toggle('dark', dark);
	const doc = root.ownerDocument;
	doc.querySelectorAll<HTMLSourceElement>('source[data-dark-source]').forEach((source) => {
		source.media = dark ? 'all' : 'not all';
	});
	doc
		.querySelector<HTMLMetaElement>('meta[data-theme-color]')
		?.setAttribute('content', dark ? THEME_COLOR.dark : THEME_COLOR.light);
	doc.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
		button.setAttribute('aria-pressed', String(dark));
		button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
		button.title = `Switch to ${dark ? 'light' : 'dark'} theme`;
	});
	if (doc === document) document.dispatchEvent(new CustomEvent('sudhir:theme-change'));
}
let controls: AbortController | undefined;
function setup() {
	controls?.abort();
	controls = new AbortController();
	applyTheme(currentTheme());
	document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
		button.addEventListener(
			'click',
			() => {
				const root = document.documentElement;
				const dark = !root.classList.contains('dark');
				try {
					localStorage.setItem('theme', dark ? 'dark' : 'light');
				} catch {
					/* Theme remains usable without storage. */
				}
				if (root.dataset.motion !== 'full' || !document.startViewTransition) {
					applyTheme(dark);
					return;
				}
				// Page turn: the new theme slides in from the right edge behind a thin amber line.
				const edge = document.createElement('div');
				edge.className = 'theme-edge';
				root.classList.add('theme-turning');
				const turn = document.startViewTransition(() => {
					applyTheme(dark);
					document.body.append(edge);
				});
				turn.finished.finally(() => {
					root.classList.remove('theme-turning');
					edge.remove();
				});
			},
			{ signal: controls!.signal }
		);
	});
}
document.addEventListener('astro:page-load', setup);
document.addEventListener('astro:before-swap', (event) => {
	controls?.abort();
	const next = (event as Event & { newDocument: Document }).newDocument;
	applyTheme(document.documentElement.classList.contains('dark'), next.documentElement);
});
window.addEventListener('storage', (event) => {
	if (event.key === 'theme') applyTheme(currentTheme());
});
