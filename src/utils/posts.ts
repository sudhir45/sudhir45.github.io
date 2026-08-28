import { getCollection, type CollectionEntry } from 'astro:content';
import getReadingTime from 'reading-time';

export type PostEntry = CollectionEntry<'posts'>;
export type PostFrontmatter = PostEntry['data'];

/** Reading time computed from the post body, e.g. "5 min read". */
export const computeReadingTime = (body: string | undefined): string =>
	getReadingTime(body ?? '').text;

export interface SitePost {
	slug: string;
	url: string;
	data: PostFrontmatter;
}

export const sortPostsByDate = (a: SitePost, b: SitePost) => {
	const isPinnedA = a.data.isPinned === true;
	const isPinnedB = b.data.isPinned === true;

	if (isPinnedA && !isPinnedB) {
		return -1;
	}
	if (!isPinnedA && isPinnedB) {
		return 1;
	}

	return b.data.pubDate.getTime() - a.data.pubDate.getTime();
};

const toSitePost = (entry: PostEntry): SitePost => ({
	slug: entry.id,
	url: `/posts/${entry.id}`,
	data: {
		...entry.data,
		minutesRead: entry.data.minutesRead ?? computeReadingTime(entry.body)
	}
});

export const getAllPosts = async () => {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	return posts.map(toSitePost).sort(sortPostsByDate);
};

export const getPostBySlug = async (slug: string) => {
	const posts = await getAllPosts();
	return posts.find((post) => post.slug === slug);
};

const sharedTopicCount = (current: SitePost, candidate: SitePost): number => {
	const currentTopics = new Set(current.data.tags);
	return candidate.data.tags.reduce(
		(count, topic) => count + (currentTopics.has(topic) ? 1 : 0),
		0
	);
};

/**
 * Rank onward-reading choices by topic overlap, then publication-date proximity.
 * Slug is the final tie-breaker so static builds remain deterministic.
 */
export const rankRelatedPosts = (current: SitePost, posts: SitePost[], limit = 3): SitePost[] =>
	posts
		.filter(
			(post, index, candidates) =>
				post.slug !== current.slug &&
				!post.data.draft &&
				candidates.findIndex((candidate) => candidate.slug === post.slug) === index
		)
		.sort((a, b) => {
			const topicDelta = sharedTopicCount(current, b) - sharedTopicCount(current, a);
			if (topicDelta !== 0) return topicDelta;

			const currentTime = current.data.pubDate.getTime();
			const proximityDelta =
				Math.abs(a.data.pubDate.getTime() - currentTime) -
				Math.abs(b.data.pubDate.getTime() - currentTime);
			if (proximityDelta !== 0) return proximityDelta;

			return a.slug.localeCompare(b.slug);
		})
		.slice(0, Math.max(0, limit));

export const getRelatedPosts = async (slug: string, limit = 3): Promise<SitePost[]> => {
	const posts = await getAllPosts();
	const current = posts.find((post) => post.slug === slug);
	return current ? rankRelatedPosts(current, posts, limit) : [];
};

/** Chronological neighbors of a post (by publish date, newest first). */
export const getPostNeighbors = async (slug: string) => {
	const posts = (await getAllPosts())
		.slice()
		.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
	const index = posts.findIndex((post) => post.slug === slug);
	if (index === -1) {
		return { newer: undefined, older: undefined };
	}
	return { newer: posts[index - 1], older: posts[index + 1] };
};
