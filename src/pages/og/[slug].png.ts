import { Resvg } from '@resvg/resvg-js';
import { getAllPosts, getPostBySlug } from '@/utils/posts';

const escapeXml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

const truncate = (value: string, maxLength: number) =>
	value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;

const toTitleLines = (value: string) => {
	const maxLineLength = 30;
	const words = value.split(/\s+/);
	const lines: string[] = [];
	let currentLine = '';

	for (const word of words) {
		const candidate = currentLine ? `${currentLine} ${word}` : word;
		if (candidate.length <= maxLineLength || currentLine.length === 0) {
			currentLine = candidate;
			continue;
		}

		lines.push(currentLine);
		currentLine = word;

		if (lines.length === 2) {
			break;
		}
	}

	if (currentLine && lines.length < 2) {
		lines.push(currentLine);
	}

	if (lines.length === 2) {
		const secondLine = lines[1] ?? '';
		lines[1] = truncate(secondLine, maxLineLength);
	}

	return lines.slice(0, 2);
};

export async function GET({ params }: { params: { slug: string } }) {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		return new Response('Not Found', { status: 404 });
	}

	const { title, description, tags, pubDate } = post.data;
	const titleLines = toTitleLines(title).map(escapeXml);
	const safeDescription = escapeXml(truncate(description, 120));
	const safeDate = escapeXml(
		pubDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
	const tagLabels = (tags as string[])
		.slice(0, 3)
		.map((tag: string) => escapeXml(`#${truncate(tag, 20)}`));

	const titleMarkup = titleLines
		.map((line, index) => `<tspan x="60" dy="${index === 0 ? 0 : 76}">${line}</tspan>`)
		.join('');

	const tagMarkup = tagLabels
		.map((tag: string, index: number) => {
			const x = 60 + index * 220;
			return `
				<rect x="${x}" y="520" rx="22" ry="22" width="200" height="44" fill="#292524" stroke="#44403c" />
				<text x="${x + 20}" y="548" fill="#ea580c" font-size="24">${tag}</text>
			`;
		})
		.join('');

	const svg = `
		<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#1c1917" />
					<stop offset="100%" stop-color="#0c0a09" />
				</linearGradient>
				<linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="#ffffff" />
					<stop offset="100%" stop-color="#d6d3d1" />
				</linearGradient>
			</defs>
			<rect width="1200" height="630" fill="url(#bg)" />
			<text x="60" y="82" fill="#ea580c" font-size="36" font-weight="700">Fort</text>
			<text x="140" y="82" fill="#a8a29e" font-size="36" font-weight="700">Matrix Logs</text>
			<text x="60" y="190" fill="url(#title)" font-size="70" font-weight="700">
				${titleMarkup}
			</text>
			<text x="60" y="380" fill="#a8a29e" font-size="38">${safeDescription}</text>
			${tagMarkup}
			<text x="900" y="548" fill="#78716c" font-size="28">${safeDate}</text>
		</svg>
	`;

	const resvg = new Resvg(svg, {
		font: {
			defaultFontFamily: 'Arial'
		}
	});
	const pngData = resvg.render();

	return new Response(pngData.asPng() as any, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	return posts.map((post) => ({
		params: { slug: post.slug }
	}));
}
