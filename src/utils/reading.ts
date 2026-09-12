import mediumZoom from 'medium-zoom';

// Keep one instance because medium-zoom's document listeners outlive detach().
const zoom = mediumZoom({ margin: 24 });
let zoomPhase: 'closed' | 'opening' | 'open' | 'closing' = 'closed';
zoom.on('open', () => {
	zoomPhase = 'opening';
});
zoom.on('opened', () => {
	zoomPhase = 'open';
});
zoom.on('close', () => {
	zoomPhase = 'closing';
});
zoom.on('closed', () => {
	zoomPhase = 'closed';
});

async function closeZoom() {
	const image = zoom.getZoomedImage();
	if (!image) return;
	if (zoomPhase === 'opening') {
		await new Promise<void>((resolve) =>
			image.addEventListener('medium-zoom:opened', () => resolve(), { once: true })
		);
	}
	if (zoomPhase === 'closing') {
		await new Promise<void>((resolve) =>
			image.addEventListener('medium-zoom:closed', () => resolve(), { once: true })
		);
	} else {
		await zoom.close();
	}
}

document.addEventListener('astro:before-preparation', (event) => {
	const load = event.loader;
	event.loader = async () => {
		await closeZoom();
		await load();
	};
});
let cleanup: (() => void) | undefined;
function setupReading() {
	cleanup?.();
	const article = document.querySelector<HTMLElement>('article.reading');
	if (!article) return;
	const abort = new AbortController();
	const timers = new Set<ReturnType<typeof setTimeout>>();
	const background = () =>
		getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
	zoom.update({ background: background() });
	const images = article.querySelectorAll<HTMLImageElement>('img:not(.no-zoom)');
	zoom.attach(images);
	images.forEach((image) => {
		image.tabIndex = 0;
		image.setAttribute('role', 'button');
		image.setAttribute('aria-label', `Enlarge image: ${image.alt || 'Article illustration'}`);
		image.addEventListener(
			'keydown',
			(event) => {
				if (event.key !== 'Enter' && event.key !== ' ') return;
				event.preventDefault();
				void zoom.open({ target: image });
			},
			{ signal: abort.signal }
		);
	});
	document.addEventListener(
		'keydown',
		(event) => {
			if (event.key === 'Escape') void closeZoom();
		},
		{ signal: abort.signal }
	);
	document.addEventListener(
		'sudhir:theme-change',
		() => zoom.update({ background: background() }),
		{ signal: abort.signal }
	);
	article.querySelectorAll('table').forEach((table) => {
		if (table.parentElement?.classList.contains('wide-content')) return;
		const wrapper = document.createElement('div');
		wrapper.className = 'wide-content';
		wrapper.tabIndex = 0;
		wrapper.setAttribute('role', 'region');
		wrapper.setAttribute('aria-label', 'Scrollable comparison table');
		table.before(wrapper);
		wrapper.append(table);
	});
	article.querySelectorAll('pre').forEach((block) => {
		block.tabIndex = 0;
		block.setAttribute('aria-label', 'Code example');
		if (block.querySelector('.copy-button')) return;
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'copy-button';
		button.textContent = 'Copy';
		button.setAttribute('aria-label', 'Copy code');
		block.append(button);
		button.addEventListener(
			'click',
			async () => {
				try {
					await navigator.clipboard.writeText(block.querySelector('code')?.textContent || '');
					button.textContent = 'Copied';
					button.setAttribute('aria-label', 'Code copied');
				} catch {
					button.textContent = 'Copy unavailable';
				}
				const timer = setTimeout(() => {
					button.textContent = 'Copy';
					button.setAttribute('aria-label', 'Copy code');
					timers.delete(timer);
				}, 2000);
				timers.add(timer);
			},
			{ signal: abort.signal }
		);
	});
	cleanup = () => {
		abort.abort();
		timers.forEach(clearTimeout);
		zoom.detach();
	};
}
document.addEventListener('astro:page-load', setupReading);
document.addEventListener('astro:before-swap', () => {
	cleanup?.();
	cleanup = undefined;
});
