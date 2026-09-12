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
export const shortDate = (date: Date | string) =>
	new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export const longDate = (date: Date | string) =>
	new Date(date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
