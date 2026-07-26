import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const publicHeaders = path.join(process.cwd(), 'public', '_headers');
const distHeaders = path.join(distDir, '_headers');

if (fs.existsSync(distDir) && fs.existsSync(publicHeaders)) {
  fs.copyFileSync(publicHeaders, distHeaders);
  console.log('✔ Security headers (_headers) generated in dist/');
}
