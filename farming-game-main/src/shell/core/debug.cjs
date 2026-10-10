// Debug: inspect the fields structure for the first few entries
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'strings.ts');
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

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

let i = 0;
let debugged = 0;
while (i < lines.length) {
  const ln = lines[i];
  const keyMatch = ln.match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!keyMatch) { i += 1; continue; }
  const endIdx = findEntryEnd(i);
  if (endIdx === -1) { i += 1; continue; }
  const inner = lines.slice(i + 1, endIdx);

  // Try to find first 'en:' and 'yue:' and 'vi:' opener lines
  let firstEn = -1, firstYue = -1, firstVi = -1;
  for (let k = 0; k < inner.length; k++) {
    if (firstEn === -1 && /^\s*en:\s*\[/.test(inner[k])) firstEn = k;
    if (firstYue === -1 && /^\s*yue:\s*\[/.test(inner[k])) firstYue = k;
    if (firstVi === -1 && /^\s*vi:\s*\[/.test(inner[k])) firstVi = k;
  }
  console.log(`Entry ${keyMatch[1]} (lines ${i+1}-${endIdx+1})`);
  console.log(' first en:', firstEn, 'yue:', firstYue, 'vi:', firstVi);
  if (firstEn !== -1) console.log('  en opener:', JSON.stringify(inner[firstEn]));
  if (firstYue !== -1) console.log('  yue opener:', JSON.stringify(inner[firstYue]));
  if (firstVi !== -1) console.log('  vi opener:', JSON.stringify(inner[firstVi]));

  debugged += 1;
  i = endIdx + 1;
  if (keyMatch[1] === 'tabs.reorder.hint') {
    console.log('--- DEBUG tabs.reorder.hint ---');
    console.log('Inner length:', inner.length);
    for (let k = 0; k < inner.length; k++) {
      console.log(k, '|', JSON.stringify(inner[k]));
    }
    break;
  }
}