/**
 * Post contents: the current section's link turns ink and the 12px amber marker slides to it.
 * The phone dropdown shows the current section title in its summary.
 */
export function setupContents(signal: AbortSignal) {
	const navs = [...document.querySelectorAll<HTMLElement>('[data-contents]')];
	if (!navs.length) return;
	const links = navs.map((nav) => [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]);
	const headings = (links[0] ?? [])
		.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
		.filter((heading): heading is HTMLElement => Boolean(heading));
	if (!headings.length) return;

	let current = -1;
	let frame = 0;
	const update = () => {
		frame = 0;
		const line = window.innerHeight * 0.3;
		let index = -1;
		headings.forEach((heading, i) => {
			if (heading.getBoundingClientRect().top <= line) index = i;
		});
		if (index === current) return;
		current = index;
		navs.forEach((nav, n) => {
			const navLinks = links[n] ?? [];
			navLinks.forEach((link, i) => {
				if (i === index) link.setAttribute('aria-current', 'location');
				else link.removeAttribute('aria-current');
			});
			const marker = nav.querySelector<HTMLElement>('[data-contents-marker]');
			const active = navLinks[index];
			if (marker) {
				marker.style.opacity = active ? '1' : '0';
				if (active) marker.style.transform = `translateY(${active.offsetTop + active.offsetHeight / 2}px)`;
			}
			const label = nav.querySelector<HTMLElement>('[data-contents-current]');
			if (label) label.textContent = active?.textContent ?? label.dataset.default ?? '';
		});
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	update();
	window.addEventListener('scroll', schedule, { passive: true, signal });
	window.addEventListener('resize', schedule, { passive: true, signal });

	// Close the phone dropdown after choosing a section.
	document.querySelectorAll<HTMLDetailsElement>('details[data-contents]').forEach((details) => {
		details.addEventListener(
			'click',
			(event) => {
				if ((event.target as Element).closest('a')) details.open = false;
			},
			{ signal }
		);
	});
	signal.addEventListener('abort', () => cancelAnimationFrame(frame));
}
