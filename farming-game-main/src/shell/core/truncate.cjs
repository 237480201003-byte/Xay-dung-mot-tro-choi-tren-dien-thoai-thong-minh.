// Recovery: truncate the file to end after the first valid STRINGS export.
// The previous fill-vi scripts appended junk content. This removes it.
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'strings.ts');
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

// Find the first occurrence of "export type StringKey = keyof typeof STRINGS"
let cutLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === 'export type StringKey = keyof typeof STRINGS') {
    cutLine = i + 1; // 1-indexed end
    break;
  }
}
if (cutLine === -1) {
  console.error('Could not find export type StringKey line');
  process.exit(1);
}

console.log('Truncating at line', cutLine);
const kept = lines.slice(0, cutLine);
fs.writeFileSync(file, kept.join('\n') + '\n');
console.log('Wrote', kept.length, 'lines');