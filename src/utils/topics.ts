import { getAllPosts, type SitePost } from './posts';

/**
 * Editorial topic taxonomy for the site. Post frontmatter `tags` use these
 * exact `name` values, so the Writing filter and Topics page stay clean —
 * a handful of considered threads instead of a granular tag cloud.
 */
export interface Topic {
	/** Canonical name — matches the value used in post frontmatter `tags`. */
	name: string;
	/** URL slug used by /tags/[tag]. */
	slug: string;
	/** Short label for the archive filter pills. */
	label: string;
	/** One-line description shown on the Topics page. */
	description: string;
	/**
	 * OKLCH hue angle for the topic's categorical color. The color itself is a
	 * rule, not a list: solid = oklch(52% 0.07 h), tint = oklch(96% 0.02 h)
	 * (see `.topic-colored` in global.css for the full set, incl. dark theme).
	 * Hues are spaced around the ring and skip amber's ~55°, so a new topic
	 * just takes a free angle and lands earthy by construction.
	 */
	hue: number;
}

export const TOPICS: Topic[] = [
	{
		name: 'Security architecture',
		slug: 'security-architecture',
		label: 'Architecture',
		description: 'Layering, blast radius, and designing for the exception.',
		hue: 155
	},
	{
		name: 'Network security',
		slug: 'network-security',
		label: 'Network security',
		description: 'Firewall policy, segmentation, and hardening at scale.',
		hue: 245
	},
	{
		name: 'Compliance',
		slug: 'compliance',
		label: 'Compliance',
		description: 'Controls people actually follow, and audits you can live with.',
		hue: 110
	},
	{
		name: 'Vulnerability management',
		slug: 'vulnerability-management',
		label: 'Vulnerability mgmt',
		description: 'Triage, prioritisation, and reading a report like an attacker.',
		hue: 40
	},
	{
		name: 'Offense',
		slug: 'offense',
		label: 'Offense',
		description: 'CTFs, red teaming, and offensive security.',
		hue: 350
	},
	{
		name: 'AI security',
		slug: 'ai-security',
		label: 'AI security',
		description: 'Prompt injection, model risk, and securing LLM systems.',
		hue: 300
	},
	{
		name: 'Certification',
		slug: 'certification',
		label: 'Certification',
		description: 'Exam preparation, study notes, and what the paper is worth.',
		hue: 200
	}
];

const bySlug = new Map(TOPICS.map((t) => [t.slug, t]));
const byName = new Map(TOPICS.map((t) => [t.name, t]));

export const getTopicBySlug = (slug: string): Topic | undefined => bySlug.get(slug);
export const getTopicByName = (name: string): Topic | undefined => byName.get(name);

/**
 * OKLCH hue angle for a topic name. Stray tags fall back to a hue derived
 * from the name, so even an unmapped tag gets a stable in-band color.
 */
export const topicHue = (name: string): number => {
	const known = byName.get(name)?.hue;
	if (known !== undefined) return known;
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360;
	return hash;
};

/** Slug for a topic name, falling back to a generic slugify for stray tags. */
export const topicSlug = (name: string): string =>
	byName.get(name)?.slug ??
	name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

export interface TopicWithCount extends Topic {
	count: number;
}

/**
 * Topics that have at least one post, ordered by post count (desc), then by
 * their order in TOPICS. The first entry is the "lead" thread (amber count).
 */
export const getTopicsWithCounts = async (): Promise<TopicWithCount[]> => {
	const posts = await getAllPosts();
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return TOPICS.map((topic) => ({ ...topic, count: counts.get(topic.name) ?? 0 }))
		.filter((topic) => topic.count > 0)
		.sort((a, b) => b.count - a.count);
};

export const getPostsForTopic = async (slug: string): Promise<SitePost[]> => {
	const topic = getTopicBySlug(slug);
	if (!topic) return [];
	const posts = await getAllPosts();
	return posts.filter((post) => post.data.tags.includes(topic.name));
};
