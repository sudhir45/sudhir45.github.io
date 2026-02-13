import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		description: z.string(),
		author: z.string().default('Sudhir'),
		isPinned: z.boolean().default(false),
		minutesRead: z.string().optional(),
		excerpt: z.string(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		image: z
			.object({
				src: z.string(),
				alt: z.string().optional().default('')
			})
			.optional()
	})
});

export const collections = {
	posts
};
