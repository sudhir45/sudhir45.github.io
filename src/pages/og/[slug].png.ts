import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

// Get fonts for Satori
const fontExperiment = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff').then(
    (res) => res.arrayBuffer()
);

export async function GET({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Find the post
    const allPosts = Object.values(import.meta.glob('../posts/*.md', { eager: true }));
    const post = allPosts.find((p: any) => p.url?.endsWith(slug) || p.file?.endsWith(slug + '.md')) as any;

    if (!post) {
        return new Response('Not Found', { status: 404 });
    }

    const { title, description, tags, pubDate } = post.frontmatter;

    // Render the image component using satori-html
    const markup = html`
    <div
      style="
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #1c1917;
        color: white;
        padding: 60px;
        font-family: 'Inter';
      "
    >
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <span style="font-size: 24px; color: #ea580c; font-weight: bold; margin-right: 10px;">Fort</span>
                <span style="font-size: 24px; color: #a8a29e; font-weight: bold;">Matrix Logs</span>
            </div>
            <div style="font-size: 64px; font-weight: bold; line-height: 1.1; margin-bottom: 20px; background-image: linear-gradient(to right, #ffffff, #d6d3d1); background-clip: text; color: transparent;">
                ${title}
            </div>
            <div style="font-size: 30px; color: #a8a29e; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${description || ''}
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="display: flex; gap: 15px;">
                ${tags.slice(0, 3).map((tag: string) => `
                    <div style="background-color: #292524; padding: 5px 20px; border-radius: 99px; font-size: 20px; color: #ea580c; border: 1px solid #44403c;">
                        #${tag}
                    </div>
                `).join('')}
            </div>
            <div style="font-size: 24px; color: #78716c;">
                ${new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
    </div>
  `;

    const svg = await satori(markup as any, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: 'Inter',
                data: fontExperiment,
                style: 'normal',
            },
        ],
    });

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer as any, {
        headers: {
            'Content-Type': 'image/png',
        },
    });
}

export async function getStaticPaths() {
    const allPosts = Object.values(import.meta.glob('../posts/*.md', { eager: true }));
    return allPosts.map((post: any) => {
        // Extract slug from URL or filename
        // URL format: /posts/slug
        const slug = post.url?.split('/').pop() || '';
        return {
            params: { slug },
        };
    });
}
