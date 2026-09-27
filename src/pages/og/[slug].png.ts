import { Resvg } from '@resvg/resvg-js';
import { resolve } from 'node:path';
import { getAllPosts, getPostBySlug } from '@/utils/posts';
import { longDate } from '@/utils/editorial';

// OFL fonts for the card renderer only (resvg reads TTF, not woff2). Paths resolve from the project root.
const SERIF = resolve('src/og-fonts/SourceSerif4-VF.ttf');
const MONO = resolve('src/og-fonts/JetBrainsMono-VF.ttf');

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
	const titleLines = toLines(title, 28, 3).map(escapeXml);
	const descriptionLines = toLines(description, 62, 2).map(escapeXml);
	const safeDate = escapeXml(longDate(pubDate));
	const topic = escapeXml(truncate(((tags as string[])[0] ?? 'Essay').toUpperCase(), 32));

	// Folio paper palette (sRGB approximations of the light theme tokens).
	const paper = '#faf7f1';
	const ink = '#221e1a';
	const body = '#403a33';
	const muted = '#685f57';
	const line = '#cfc8bb';
	const amber = '#7f4c1b';

	const titleSize = titleLines.length > 2 ? 64 : 76;
	const titleLead = Math.round(titleSize * 1.04);
	const titleTop = 238;
	const titleMarkup = titleLines
		.map((text, index) => `<tspan x="72" dy="${index === 0 ? 0 : titleLead}">${text}</tspan>`)
		.join('');
	const descriptionTop = titleTop + titleLead * (titleLines.length - 1) + 78;
	const descriptionMarkup = descriptionLines
		.map((text, index) => `<tspan x="72" dy="${index === 0 ? 0 : 42}">${text}</tspan>`)
		.join('');

	const svg = `
		<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
			<rect width="1200" height="630" fill="${paper}" />
			<text x="72" y="92" fill="${ink}" font-family="Source Serif 4" font-size="44" font-weight="600">Sudhir<tspan fill="${amber}">.</tspan></text>
			<text x="1128" y="86" text-anchor="end" fill="${muted}" font-family="JetBrains Mono" font-size="20" letter-spacing="2">SUDHIR.IS-A.DEV</text>
			<rect x="72" y="118" width="1056" height="3" fill="${ink}" />
			<rect x="72" y="125" width="1056" height="1.5" fill="${ink}" />

			<text x="72" y="${titleTop}" fill="${ink}" font-family="Source Serif 4" font-size="${titleSize}" font-weight="420" letter-spacing="-1.5">${titleMarkup}</text>
			<text x="72" y="${descriptionTop}" fill="${body}" font-family="Source Serif 4" font-size="32">${descriptionMarkup}</text>

			<rect x="72" y="532" width="1056" height="1.5" fill="${line}" />
			<circle cx="78" cy="570" r="6" fill="${amber}" />
			<text x="96" y="577" fill="${amber}" font-family="JetBrains Mono" font-size="20" letter-spacing="2">${topic}</text>
			<text x="1128" y="577" text-anchor="end" fill="${muted}" font-family="JetBrains Mono" font-size="20">${safeDate}</text>
		</svg>
	`;

	const resvg = new Resvg(svg, {
		font: {
			fontFiles: [SERIF, MONO],
			loadSystemFonts: false,
			defaultFontFamily: 'Source Serif 4'
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
