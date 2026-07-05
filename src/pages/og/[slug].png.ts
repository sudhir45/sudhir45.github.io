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

const toLines = (value: string, maxLineLength: number, maxLines: number) => {
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

		if (lines.length === maxLines) {
			break;
		}
	}

	if (currentLine && lines.length < maxLines) {
		lines.push(currentLine);
	}

	if (lines.length === maxLines) {
		const lastLine = lines[maxLines - 1] ?? '';
		lines[maxLines - 1] = truncate(lastLine, maxLineLength);
	}

	return lines.slice(0, maxLines);
};

export async function GET({ params }: { params: { slug: string } }) {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		return new Response('Not Found', { status: 404 });
	}

	const { title, description, tags, pubDate } = post.data;
	const titleLines = toLines(title, 30, 2).map(escapeXml);
	const descriptionLines = toLines(description, 60, 2).map(escapeXml);
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

	const descriptionMarkup = descriptionLines
		.map((line, index) => `<tspan x="60" dy="${index === 0 ? 0 : 46}">${line}</tspan>`)
		.join('');

	let tagX = 60;
	const tagMarkup = tagLabels
		.map((tag: string) => {
			const width = Math.round(tag.length * 13 + 36);
			const markup = `
				<rect x="${tagX}" y="516" rx="22" ry="22" width="${width}" height="44" fill="#18181b" stroke="#3f3f46" />
				<text x="${tagX + 18}" y="545" fill="#fbbf24" font-size="24" font-family="monospace">${tag}</text>
			`;
			tagX += width + 16;
			return markup;
		})
		.join('');

	const svg = `
		<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#18181b" />
					<stop offset="100%" stop-color="#09090b" />
				</linearGradient>
				<linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="#ffffff" />
					<stop offset="100%" stop-color="#d4d4d8" />
				</linearGradient>
				<pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
					<circle cx="1.5" cy="1.5" r="1.3" fill="#27272a" />
				</pattern>
			</defs>
			<rect width="1200" height="630" fill="url(#bg)" />
			<rect width="1200" height="630" fill="url(#dots)" />
			<rect x="0" y="0" width="8" height="630" fill="#f59e0b" />

			<rect x="60" y="50" width="10" height="34" rx="1" fill="#f59e0b" />
			<text x="86" y="78" fill="#fafafa" font-size="36" font-weight="700">Sudhir</text>
			<text x="1140" y="78" text-anchor="end" fill="#71717a" font-size="24" font-family="monospace">sudhir.is-a.dev</text>

			<text x="60" y="220" fill="url(#title)" font-size="70" font-weight="700">
				${titleMarkup}
			</text>
			<text x="60" y="386" fill="#a1a1aa" font-size="34">${descriptionMarkup}</text>

			<line x1="60" y1="470" x2="1140" y2="470" stroke="#27272a" stroke-width="2" />
			${tagMarkup}
			<text x="1140" y="545" text-anchor="end" fill="#71717a" font-size="26" font-family="monospace">${safeDate}</text>
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
