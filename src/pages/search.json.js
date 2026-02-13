import { getAllPosts } from '@/utils/posts';

export async function GET() {
    const allPosts = await getAllPosts();

    const posts = allPosts.map((post) => ({
        slug: post.url,
        title: post.data.title,
        description: post.data.description,
        tags: post.data.tags,
        pubDate: post.data.pubDate,
    }));

    return new Response(JSON.stringify(posts), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
