import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const srcDir = path.join(process.cwd(), 'src');
const publicDir = path.join(process.cwd(), 'public');

const astroFiles = globSync('**/*.astro', { cwd: srcDir, absolute: true });
const tsxFiles = globSync('**/*.tsx', { cwd: srcDir, absolute: true });
const mdFiles = globSync('**/*.md', { cwd: srcDir, absolute: true });

const allFiles = [...astroFiles, ...tsxFiles, ...mdFiles];

let brokenLinks = [];
let missingImages = [];
let missingAlts = [];

// Very basic regex for finding links and images
const hrefRegex = /href=['"]([^'"]+)['"]/g;
const srcRegex = /src=['"]([^'"]+)['"]/g;
const imgRegex = /<img[^>]+>/g;

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // Check hrefs
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const link = match[1];
    if (link.startsWith('/') && !link.startsWith('//')) {
      // It's an internal link
      // Let's just log them to see what we have
    }
  }

  // Check images for alt tags
  let imgMatch;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    const imgTag = imgMatch[0];
    if (!imgTag.includes('alt=')) {
      missingAlts.push({ file: path.basename(file), tag: imgTag });
    }
  }
});

console.log('--- QA REPORT ---');
console.log('Missing Alt Tags:', missingAlts.length);
if (missingAlts.length > 0) {
  console.log(missingAlts.slice(0, 5));
}
