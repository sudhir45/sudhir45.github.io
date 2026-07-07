import { getCollection, type CollectionEntry } from 'astro:content';
import getReadingTime from 'reading-time';

export type PostEntry = CollectionEntry<'posts'>;
export type PostFrontmatter = PostEntry['data'];

/** Reading time computed from the post body, e.g. "5 min read". */
export const computeReadingTime = (body: string): string => getReadingTime(body ?? '').text;

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
	slug: entry.id.replace(/\.mdx?$/, ''),
	url: `/posts/${entry.id.replace(/\.mdx?$/, '')}`,
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
