import { promises as fs } from 'node:fs';
import path from 'node:path';

const sourceDir = path.resolve('src/pages/posts');
const targetDir = path.resolve('src/content/posts');
const markdownExtensionPattern = /\.md$/;

const stripLayoutFrontmatter = (content) =>
	content.replace(/^layout:\s.*\r?\n/m, '');

async function syncPostContent() {
	await fs.mkdir(targetDir, { recursive: true });

	const sourceFiles = (await fs.readdir(sourceDir)).filter((file) =>
		markdownExtensionPattern.test(file)
	);
	const sourceSet = new Set(sourceFiles);

	for (const fileName of sourceFiles) {
		const sourcePath = path.join(sourceDir, fileName);
		const targetPath = path.join(targetDir, fileName);

		const sourceContent = await fs.readFile(sourcePath, 'utf8');
		const normalizedContent = stripLayoutFrontmatter(sourceContent);
		await fs.writeFile(targetPath, normalizedContent, 'utf8');
	}

	const targetFiles = (await fs.readdir(targetDir)).filter((file) =>
		markdownExtensionPattern.test(file)
	);

	for (const fileName of targetFiles) {
		if (!sourceSet.has(fileName)) {
			await fs.unlink(path.join(targetDir, fileName));
		}
	}

	console.log(`Synced ${sourceFiles.length} post file(s) to src/content/posts`);
}

await syncPostContent();
