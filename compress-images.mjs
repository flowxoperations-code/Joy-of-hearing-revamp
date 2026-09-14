import sharp from 'sharp';
import { readdirSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

const dir = './public/images';
const files = readdirSync(dir).filter(f => extname(f) === '.png' && f !== 'logo-live.svg');

let savedTotal = 0;

for (const file of files) {
  const input = join(dir, file);
  const outName = basename(file, '.png') + '.webp';
  const output = join(dir, outName);

  const meta = await sharp(input).metadata();
  const { size: before } = await import('fs').then(m => m.promises.stat(input));

  await sharp(input)
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  const { size: after } = await import('fs').then(m => m.promises.stat(output));
  const saved = before - after;
  savedTotal += saved;
  console.log(`${file}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (saved ${(saved/1024).toFixed(0)}KB)`);

  unlinkSync(input); // remove original PNG
}

console.log(`\nTotal saved: ${(savedTotal/1024/1024).toFixed(1)}MB`);
