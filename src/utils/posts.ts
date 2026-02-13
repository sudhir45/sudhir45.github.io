import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;
export type PostFrontmatter = PostEntry['data'];

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
	data: entry.data
});

export const getAllPosts = async () => {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	return posts.map(toSitePost).sort(sortPostsByDate);
};

export const getPostBySlug = async (slug: string) => {
	const posts = await getAllPosts();
	return posts.find((post) => post.slug === slug);
};

export const getPostsByTag = async (tag: string) => {
	const posts = await getAllPosts();
	return posts.filter((post) => post.data.tags.includes(tag));
};

export const getTagCounts = async () => {
	const posts = await getAllPosts();
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return Object.fromEntries(
		[...counts.entries()].sort(([, countA], [, countB]) => countB - countA)
	);
};
