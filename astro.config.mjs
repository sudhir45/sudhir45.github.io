import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import imgAttr from 'satteri-imgattr';
import { satteriAdmonitions } from './src/utils/satteriAdmonitions';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: 'https://sudhir.is-a.dev',
	compressHTML: true,

	markdown: {
		processor: satteri({
			hastPlugins: [
				imgAttr({ defaults: { loading: 'lazy', decoding: 'async' } }),
				satteriAdmonitions
			]
		}),
		syntaxHighlight: 'shiki',
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark'
			},
			defaultColor: false,
			wrap: false
		}
	},

	integrations: [
		react(),
		mdx(),
		sitemap({
			filter: (page) =>
				!page.endsWith('/search.json') && !page.includes('/og/') && !page.includes('/404')
		})
	],
	output: 'static',

	vite: {
		plugins: [tailwindcss()],
		build: {
			cssMinify: 'lightningcss',
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) {
							return 'vendor';
						}
					}
				}
			}
		}
	}
});
