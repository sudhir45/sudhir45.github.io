import type { Element, ElementContent, Root, Text } from 'hast';

type AdmonitionType = 'note' | 'tip' | 'warning' | 'caution';

const MARKER = /^\[!(NOTE|TIP|WARNING|CAUTION)\]\s*/i;

const STYLES: Record<AdmonitionType, { label: string; container: string; icon: string }> = {
	note: {
		label: 'Note',
		container: 'border-faint bg-surface-2 text-fg',
		icon: 'text-muted'
	},
	tip: {
		label: 'Tip',
		container: 'border-green-500 bg-green-50/50 dark:bg-green-900/10 text-green-800 dark:text-green-200',
		icon: 'text-green-500'
	},
	warning: {
		label: 'Warning',
		container:
			'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200',
		icon: 'text-yellow-500'
	},
	caution: {
		label: 'Caution',
		container: 'border-red-500 bg-red-50/50 dark:bg-red-900/10 text-red-800 dark:text-red-200',
		icon: 'text-red-500'
	}
};

const ICON_PATHS: Record<AdmonitionType, ElementContent[]> = {
	note: [
		el('circle', { cx: '12', cy: '12', r: '10' }),
		el('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
		el('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
	],
	tip: [
		el('path', {
			d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'
		})
	],
	warning: [
		el('path', {
			d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'
		}),
		el('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
		el('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
	],
	caution: [
		el('path', {
			d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'
		}),
		el('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
		el('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
	]
};

function el(tagName: string, properties: Record<string, string>, children: ElementContent[] = []): Element {
	return { type: 'element', tagName, properties, children };
}

function icon(type: AdmonitionType): Element {
	return el(
		'svg',
		{
			viewBox: '0 0 24 24',
			fill: 'none',
			stroke: 'currentColor',
			'stroke-width': '2',
			class: `h-5 w-5 shrink-0 ${STYLES[type].icon}`,
			'aria-hidden': 'true'
		},
		ICON_PATHS[type]
	);
}

/** Returns the admonition type when the blockquote starts with a `[!TYPE]` marker. */
function detectType(blockquote: Element): AdmonitionType | null {
	const firstParagraph = blockquote.children.find(
		(child): child is Element => child.type === 'element' && child.tagName === 'p'
	);
	const firstText = firstParagraph?.children.find((child): child is Text => child.type === 'text');
	const match = firstText ? MARKER.exec(firstText.value) : null;
	return match ? (match[1]!.toLowerCase() as AdmonitionType) : null;
}

/** Strips the `[!TYPE]` marker (and a dangling line break) from the first paragraph. */
function stripMarker(blockquote: Element) {
	const firstParagraph = blockquote.children.find(
		(child): child is Element => child.type === 'element' && child.tagName === 'p'
	);
	if (!firstParagraph) return;

	const firstText = firstParagraph.children.find((child): child is Text => child.type === 'text');
	if (firstText) {
		firstText.value = firstText.value.replace(MARKER, '').replace(/^\n/, '');
		if (firstText.value === '') {
			firstParagraph.children.splice(firstParagraph.children.indexOf(firstText), 1);
		}
	}
	if (
		firstParagraph.children[0]?.type === 'element' &&
		(firstParagraph.children[0] as Element).tagName === 'br'
	) {
		firstParagraph.children.shift();
	}
	if (firstParagraph.children.length === 0) {
		blockquote.children.splice(blockquote.children.indexOf(firstParagraph), 1);
	}
}

/**
 * Transforms GitHub-style `> [!NOTE]` blockquotes into styled admonition asides
 * at build time (replaces the old client-side rewrite in the post layout).
 */
export function rehypeAdmonitions() {
	return (tree: Root) => {
		const walk = (node: Root | Element) => {
			for (const child of node.children) {
				if (child.type !== 'element') continue;

				if (child.tagName === 'blockquote') {
					const type = detectType(child);
					if (type) {
						stripMarker(child);
						const style = STYLES[type];
						const body = [...child.children];
						child.tagName = 'aside';
						child.properties = {
							class: `admonition not-prose my-6 rounded-r-lg border-l-4 px-4 py-3 ${style.container}`
						};
						child.children = [
							el('div', { class: 'mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide' }, [
								icon(type),
								{ type: 'text', value: style.label }
							]),
							el('div', { class: 'admonition-body text-[15px] opacity-90' }, body as ElementContent[])
						];
						continue;
					}
				}
				walk(child);
			}
		};
		walk(tree);
	};
}
