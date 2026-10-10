// Diagnostic: walk every entry in strings.ts and report which entries
//   - are missing yue: [...]
//   - are missing vi: [...]
//   - have Cantonese characters in vi: (suggesting vi was filled from yue)
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'strings.ts');
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

const CANT_MARKERS = /[㩒嚟睇嘅喺畀嗰啲嘢冇啲閂]|唔|係|啦(?!nh|!)|咁|咩/;

let i = 0;
let total = 0;
const missingYue = [];
const missingVi = [];
const cantInVi = [];

function findEntryEnd(startLineIdx) {
  let depth = 1;
  let j = startLineIdx + 1;
  while (j < lines.length && depth > 0) {
    const opens = (lines[j].match(/\{/g) || []).length;
    const closes = (lines[j].match(/\}/g) || []).length;
    depth += opens - closes;
    if (depth <= 0) return j;
    j += 1;
  }
  return -1;
}

while (i < lines.length) {
  const ln = lines[i];
  const m = ln.match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!m) { i += 1; continue; }
  const endIdx = findEntryEnd(i);
  if (endIdx === -1) { i += 1; continue; }
  const block = lines.slice(i, endIdx + 1).join('\n');
  const key = m[1];
  total += 1;

  const hasEn = /^\s*en:\s*\[/m.test(block);
  const hasYue = /^\s*yue:\s*\[/m.test(block);
  const hasVi = /^\s*vi:\s*\[/m.test(block);

  if (hasEn && !hasYue) missingYue.push({ key, line: i + 1 });
  if (hasEn && !hasVi) missingVi.push({ key, line: i + 1 });

  if (hasVi) {
    const viMatch = block.match(/^\s*vi:\s*\[([\s\S]*?)\n\s*\],?/m);
    if (viMatch) {
      const viBody = viMatch[1];
      if (CANT_MARKERS.test(viBody)) {
        const yueMatch = block.match(/^\s*yue:\s*\[([\s\S]*?)\n\s*\],?/m);
        cantInVi.push({ key, line: i + 1, yuePresent: !!yueMatch, sample: viBody.split('\n')[0].trim().slice(0, 60) });
      }
    }
  }

  i = endIdx + 1;
}

console.log('Total entries:', total);
console.log('Missing yue:', missingYue.length);
missingYue.forEach(x => console.log('  L' + x.line, x.key));
console.log('Missing vi:', missingVi.length);
console.log('vi contains Cantonese markers:', cantInVi.length);
cantInVi.slice(0, 30).forEach(x => console.log('  L' + x.line, x.key, '| yue:', x.yuePresent, '|', x.sample));