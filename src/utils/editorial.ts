import type { SitePost } from './posts';

/** Curated entry points. Archives, search, and feeds always include every published post. */
export const EDITORIAL = {
	home: [
		'good-enough-security',
		'prompt-injection-llm-security',
		'security-architecture-fundamentals'
	],
	about: ['good-enough-security', 'prompt-injection-llm-security', 'cissp-passing-journey'],
	recentLimit: 6
};
export const chronologicalPosts = (posts: SitePost[]) =>
	[...posts].sort(
		(a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.slug.localeCompare(b.slug)
	);
export function selectEditorialPosts(
	posts: SitePost[],
	slugs: string[],
	limit: number
): SitePost[] {
	const available = chronologicalPosts(posts.filter((post) => !post.data.draft));
	const seen = new Set<string>();
	return [...slugs.map((slug) => available.find((post) => post.slug === slug)), ...available]
		.filter((post): post is SitePost => {
			if (!post || seen.has(post.slug)) return false;
			seen.add(post.slug);
			return true;
		})
		.slice(0, Math.max(0, limit));
}
/**
 * The site's two date formats: long "21 June 2025" and short "Sep 2025" where space is tight.
 * Months come from fixed tables so no locale can print variants such as "Sept". Dates are UTC.
 */
export const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];
export const shortDate = (date: Date | string) => {
	const d = new Date(date);
	return `${MONTHS[d.getUTCMonth()]!.slice(0, 3)} ${d.getUTCFullYear()}`;
};
export const longDate = (date: Date | string) => {
	const d = new Date(date);
	return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/**
 * Split a title into two display lines for the magazine setting; the second line is set in italic.
 * Breaks after a colon when there is one, otherwise near 55% of the characters on a word boundary.
 * Short titles stay on one line.
 */
export function splitTitle(title: string): [string] | [string, string] {
	const colon = title.indexOf(': ');
	if (colon > 0 && colon < title.length - 4) return [title.slice(0, colon + 1), title.slice(colon + 2)];
	const words = title.split(' ');
	if (words.length < 4) return [title];
	let best = 1;
	let bestDelta = Infinity;
	for (let i = 1; i < words.length; i++) {
		const delta = Math.abs(words.slice(0, i).join(' ').length - title.length * 0.55);
		if (delta < bestDelta) {
			best = i;
			bestDelta = delta;
		}
	}
	return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

const stripInline = (text: string) =>
	text
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/(\*\*|__)(.+?)\1/g, '$2')
		.replace(/(\*|_)(.+?)\1/g, '$2')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();

/** The first plain prose paragraphs of a Markdown or MDX body, with inline syntax removed. */
export function leadParagraphs(body: string | undefined, count = 2): string[] {
	if (!body) return [];
	return body
		.split(/\n\s*\n/)
		.map((block) => block.trim())
		.filter((block) => block && !/^(import |export |#|<|!\[|[-*+>|]\s|\d+\.\s|```|\[!|:::)/.test(block))
		.slice(0, count)
		.map(stripInline);
}

/** Minutes as a number from a reading-time label such as "5 min read". */
export const minutesFrom = (label?: string) => Math.max(1, Number.parseInt(label ?? '', 10) || 1);
