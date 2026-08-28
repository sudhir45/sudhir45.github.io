import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			description: z.string(),
			author: z.string().default('Sudhir'),
			isPinned: z.boolean().default(false),
			minutesRead: z.string().optional(),
			excerpt: z.string(),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			image: z
				.object({
					src: image(),
					alt: z.string().optional().default('')
				})
				.optional()
		})
});

export const collections = {
	posts
};
