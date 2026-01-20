import { getCollection } from 'astro:content';

export async function GET() {
    const allPosts = Object.values(
        import.meta.glob('./posts/*.md', { eager: true })
    );

    const posts = allPosts.map((post) => ({
        slug: post.url,
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        tags: post.frontmatter.tags,
        pubDate: post.frontmatter.pubDate,
    }));

    return new Response(JSON.stringify(posts), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
