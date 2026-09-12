import entries from '../data/presentations.json' with { type: 'json' };

export interface Presentation {
	slug: string;
	title: string;
	slideCount: number;
	description?: string;
	date?: string;
	venue?: string;
	thumbnail?: string;
	coverImage?: string;
}

export function sortPresentations(talks: readonly Presentation[]): Presentation[] {
	const timestamp = (date?: string) => (date ? Date.parse(date) || 0 : 0);
	return [...talks].sort(
		(a, b) => timestamp(b.date) - timestamp(a.date) || a.slug.localeCompare(b.slug)
	);
}

export const getPresentations = () => sortPresentations(entries);
