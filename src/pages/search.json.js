import { getAllPosts } from '@/utils/posts';

export async function GET() {
	const allPosts = await getAllPosts();

	const posts = allPosts.map((post) => ({
		slug: post.url,
		url: post.url,
		title: post.data.title,
		description: post.data.description,
		tags: post.data.tags,
		primaryTopic: post.data.tags[0] ?? '',
		pubDate: post.data.pubDate,
		minutesRead: post.data.minutesRead
	}));

	return new Response(JSON.stringify(posts), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
