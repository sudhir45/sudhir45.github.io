import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/utils/readingTime';
import { rehypeImagePerformance } from './src/utils/rehypeImagePerformance';
import rehypePrettyCode from 'rehype-pretty-code';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
const options = {
	// Specify the theme to use or a custom theme json, in our case
	// it will be a moonlight-II theme from
	// https://github.com/atomiks/moonlight-vscode-theme/blob/master/src/moonlight-ii.json
	// Callbacks to customize the output of the nodes
	//theme: json,
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
		// Adding a class to the highlighted line
		node.properties.className = ['highlighted'];
	}
};

// https://astro.build/config
export default defineConfig({
	site: 'https://sudhir45.github.io',
	compressHTML: true,

	markdown: {
		syntaxHighlight: false,
		// Disable syntax built-in syntax hightlighting from astro
		rehypePlugins: [[rehypePrettyCode, options], rehypeImagePerformance],
		remarkPlugins: [remarkReadingTime]
	},

	integrations: [
		react(),
		sitemap({
			filter: (page) => !page.endsWith('/search.json') && !page.includes('/og/')
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
