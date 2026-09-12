/** Shared theme state, including article art direction and persisted reader preference. */
const preference = () => {
	try {
		return localStorage.getItem('theme');
	} catch {
		return null;
	}
};
const system = matchMedia('(prefers-color-scheme: dark)');
const currentTheme = () => preference() === 'dark' || (preference() !== 'light' && system.matches);
function applyTheme(dark: boolean, root = document.documentElement) {
	root.classList.toggle('dark', dark);
	const doc = root.ownerDocument;
	doc.querySelectorAll<HTMLSourceElement>('source[data-dark-source]').forEach((source) => {
		source.media = dark ? 'all' : 'not all';
	});
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
				const dark = !document.documentElement.classList.contains('dark');
				try {
					localStorage.setItem('theme', dark ? 'dark' : 'light');
				} catch {
					/* Theme remains usable without storage. */
				}
				applyTheme(dark);
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
system.addEventListener('change', () => {
	if (!['light', 'dark'].includes(preference() || '')) applyTheme(system.matches);
});
window.addEventListener('storage', (event) => {
	if (event.key === 'theme') applyTheme(currentTheme());
});
