import { defineHastPlugin } from 'satteri';
import type { Element, ElementContent, Properties, Text } from 'hast';

type AdmonitionType = 'note' | 'tip' | 'warning' | 'caution';

const MARKER = /^\[!(NOTE|TIP|WARNING|CAUTION)\]\s*/i;

const LABELS: Record<AdmonitionType, string> = {
	note: 'Note',
	tip: 'Tip',
	warning: 'Warning',
	caution: 'Caution'
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
	warning: warningIcon(),
	caution: warningIcon()
};

function el(
	tagName: string,
	properties: Properties = {},
	children: ElementContent[] = []
): Element {
	return { type: 'element', tagName, properties, children };
}

function warningIcon(): ElementContent[] {
	return [
		el('path', {
			d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'
		}),
		el('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
		el('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
	];
}

function icon(type: AdmonitionType): Element {
	return el(
		'svg',
		{
			viewBox: '0 0 24 24',
			fill: 'none',
			stroke: 'currentColor',
			strokeWidth: '2',
			className: ['admonition-icon'],
			ariaHidden: 'true'
		},
		ICON_PATHS[type]
	);
}

function transform(blockquote: Readonly<Element>): Element | undefined {
	const body = [...blockquote.children];
	const paragraphIndex = body.findIndex(
		(child): child is Element => child.type === 'element' && child.tagName === 'p'
	);
	if (paragraphIndex === -1) return;

	const paragraph = body[paragraphIndex] as Element;
	const paragraphChildren = [...paragraph.children];
	const textIndex = paragraphChildren.findIndex((child): child is Text => child.type === 'text');
	if (textIndex === -1) return;

	const firstText = paragraphChildren[textIndex] as Text;
	const match = MARKER.exec(firstText.value);
	if (!match) return;

	const type = match[1]!.toLowerCase() as AdmonitionType;
	const value = firstText.value.replace(MARKER, '').replace(/^\n/, '');
	if (value) paragraphChildren[textIndex] = { ...firstText, value };
	else paragraphChildren.splice(textIndex, 1);

	if (
		paragraphChildren[0]?.type === 'element' &&
		(paragraphChildren[0] as Element).tagName === 'br'
	) {
		paragraphChildren.shift();
	}

	if (paragraphChildren.length === 0) body.splice(paragraphIndex, 1);
	else body[paragraphIndex] = { ...paragraph, children: paragraphChildren };

	return el(
		'aside',
		{
			className: ['admonition', `admonition-${type}`, 'not-prose'],
			dataAdmonition: type
		},
		[
			el('div', { className: ['admonition-label'] }, [
				icon(type),
				{ type: 'text', value: LABELS[type] }
			]),
			el('div', { className: ['admonition-body'] }, body)
		]
	);
}

export const satteriAdmonitions = defineHastPlugin({
	name: 'sudhir-admonitions',
	element: {
		filter: ['blockquote'],
		visit(node) {
			return transform(node);
		}
	}
});
