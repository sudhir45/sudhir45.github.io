import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(process.cwd(), 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const safeToKeep = (text) => {
  return text.includes('eslint-disable') || text.includes('@ts-') || text.includes('prettier-ignore') || text.includes('stylelint-disable');
};

walkDir(srcDir, (filePath) => {
  if (!filePath.match(/\.(astro|js|ts|css)$/)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove full-line // comments
  content = content.replace(/^[ \t]*\/\/.*\r?\n/gm, (match) => {
    return safeToKeep(match) ? match : '';
  });

  // Remove trailing // comments
  content = content.replace(/[ \t]+\/\/.*$/gm, (match) => {
    return safeToKeep(match) ? match : '';
  });

  // Remove full-line <!-- --> comments
  content = content.replace(/^[ \t]*<!--[\s\S]*?-->[ \t]*\r?\n/gm, '');

  /* Remove full-line /* */
  content = content.replace(/^[ \t]*\/\*[\s\S]*?\*\/[ \t]*\r?\n/gm, (match) => {
    return safeToKeep(match) ? match : '';
  });

  // Remove inline <!-- -->
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  if (content !== original) {
    // Remove multiple consecutive blank lines that might have been left over
    content = content.replace(/(?:\r?\n){3,}/g, '\r\n\r\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned: ${filePath}`);
  }
});
