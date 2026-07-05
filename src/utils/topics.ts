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
}

export const TOPICS: Topic[] = [
	{
		name: 'Security architecture',
		slug: 'security-architecture',
		label: 'Architecture',
		description: 'Layering, blast radius, and designing for the exception.'
	},
	{
		name: 'Network security',
		slug: 'network-security',
		label: 'Network security',
		description: 'Firewall policy, segmentation, and hardening at scale.'
	},
	{
		name: 'Compliance',
		slug: 'compliance',
		label: 'Compliance',
		description: 'Controls people actually follow, and audits you can live with.'
	},
	{
		name: 'Vulnerability management',
		slug: 'vulnerability-management',
		label: 'Vulnerability mgmt',
		description: 'Triage, prioritisation, and reading a report like an attacker.'
	},
	{
		name: 'Offense',
		slug: 'offense',
		label: 'Offense',
		description: 'CTFs, red teaming, and offensive security.'
	},
	{
		name: 'AI security',
		slug: 'ai-security',
		label: 'AI security',
		description: 'Prompt injection, model risk, and securing LLM systems.'
	}
];

const bySlug = new Map(TOPICS.map((t) => [t.slug, t]));
const byName = new Map(TOPICS.map((t) => [t.name, t]));

export const getTopicBySlug = (slug: string): Topic | undefined => bySlug.get(slug);
export const getTopicByName = (name: string): Topic | undefined => byName.get(name);

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
