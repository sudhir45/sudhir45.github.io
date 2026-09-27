// Content checks with no dependencies: editorial slugs exist, post topics are canonical,
// and user-facing source has no em dashes. Run with `npm run check:content`.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const problems = [];
const read = (path) => readFileSync(join(root, path), 'utf8');
const walk = (dir, exts) =>
	readdirSync(join(root, dir)).flatMap((name) => {
		const path = join(dir, name);
		if (statSync(join(root, path)).isDirectory()) return walk(path, exts);
		return exts.some((ext) => name.endsWith(ext)) ? [path] : [];
	});

// Canonical topics from src/utils/topics.ts
const topics = [...read('src/utils/topics.ts').matchAll(/^\t\tname: '([^']+)'/gm)].map((m) => m[1]);
if (topics.length === 0) problems.push('No topics found in src/utils/topics.ts');

// Posts: slugs and frontmatter tags
const postFiles = walk('src/content/posts', ['.md', '.mdx']);
const slugs = new Set(postFiles.map((file) => file.split('/').pop().replace(/\.mdx?$/, '')));
for (const file of postFiles) {
	const frontmatter = read(file).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	const tags = frontmatter.match(/^tags:\s*\[(.*)\]/m)?.[1];
	for (const tag of tags ? [...tags.matchAll(/"([^"]+)"|'([^']+)'/g)].map((m) => m[1] ?? m[2]) : []) {
		if (!topics.includes(tag)) problems.push(`${file}: tag "${tag}" is not a canonical topic`);
	}
}

// Editorial selections in src/utils/editorial.ts
const editorial = read('src/utils/editorial.ts').match(/export const EDITORIAL = \{([\s\S]*?)\n\};/)?.[1] ?? '';
for (const [, slug] of editorial.matchAll(/'([a-z0-9-]+)'/g)) {
	if (!slugs.has(slug)) problems.push(`src/utils/editorial.ts: "${slug}" is not a post slug`);
}

// No em dashes in user-facing source (code comments are skipped)
const isComment = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);
const userFacing = [
	...walk('src/content', ['.md', '.mdx']),
	...walk('src/pages', ['.astro', '.ts', '.js']),
	...walk('src/components', ['.astro', '.tsx', '.ts']),
	...walk('src/layouts', ['.astro']),
	'src/utils/AppConfig.ts',
	'src/utils/topics.ts'
];
for (const file of userFacing) {
	read(file)
		.split('\n')
		.forEach((line, i) => {
			if (line.includes('\u2014') && !isComment(line)) problems.push(`${relative(root, join(root, file))}:${i + 1}: em dash`);
		});
}

if (problems.length) {
	console.error(`Content check failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
	process.exit(1);
}
console.log(`Content check passed: ${postFiles.length} posts, ${topics.length} topics, ${userFacing.length} files scanned.`);
