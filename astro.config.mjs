import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/utils/readingTime';
import { rehypeImagePerformance } from './src/utils/rehypeImagePerformance';
import { rehypeAdmonitions } from './src/utils/rehypeAdmonitions';
import rehypePrettyCode from 'rehype-pretty-code';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
const options = {
	grid: true,
	onVisitLine(node) {
		// Prevent lines from collapsing in `display: grid` mode, and
		// allow empty lines to be copy/pasted
		if (node.children.length === 0) {
			node.children = [
				{
					type: 'text',
					value: ' '
				}
			];
		}
	},
	onVisitHighlightedLine(node) {
		node.properties.className = node.properties.className || [];
		node.properties.className.push('highlighted');
	},
	onVisitHighlightedChars(node) {
		node.properties.className = ['word'];
	}
};

// https://astro.build/config
export default defineConfig({
	site: 'https://sudhir.is-a.dev',
	compressHTML: true,

	markdown: {
		syntaxHighlight: false,
		// Disable syntax built-in syntax hightlighting from astro
		rehypePlugins: [[rehypePrettyCode, options], rehypeImagePerformance, rehypeAdmonitions],
		remarkPlugins: [remarkReadingTime]
	},

	integrations: [
		react(),
		mdx(),
		sitemap({
			filter: (page) => !page.endsWith('/search.json') && !page.includes('/og/') && !page.includes('/404')
		})
	],
	output: 'static',

	vite: {
		plugins: [tailwindcss()],
		build: {
			cssMinify: 'lightningcss',
			rollupOptions: {
				output: {
					manualChunks: {
						'vendor': ['react', 'react-dom']
					}
				}
			}
		}
	}
});
