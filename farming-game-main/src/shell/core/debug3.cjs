// Debug: print the vi field range for common.ok
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'strings.ts');
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

const dict = JSON.parse(fs.readFileSync('dict-common.json', 'utf8'));

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

function findFields(inner) {
  const out = {};
  let k = 0;
  while (k < inner.length) {
    const m = inner[k].match(/^(\s*)(en|yue|vi):\s*\[(\s*)$/);
    if (!m) { k += 1; continue; }
    const indent = m[1];
    const fieldName = m[2];
    if (out[fieldName]) { k += 1; continue; }
    let depth = 1;
    let mIdx = k + 1;
    while (mIdx < inner.length) {
      const sub = inner[mIdx];
      const opens = (sub.match(/\[/g) || []).length;
      const closes = (sub.match(/\]/g) || []).length;
      depth += opens - closes;
      if (depth <= 0) break;
      mIdx += 1;
    }
    out[fieldName] = { start: k, end: mIdx, indent };
    k = mIdx + 1;
  }
  return out;
}

let i = 0;
let first = true;
while (i < lines.length) {
  const ln = lines[i];
  const keyMatch = ln.match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!keyMatch) { i += 1; continue; }
  const endIdx = findEntryEnd(i);
  if (endIdx === -1) { i += 1; continue; }
  const key = keyMatch[1];
  if (!first || key !== 'common.ok') { i = endIdx + 1; continue; }
  first = false;

  const inner = lines.slice(i + 1, endIdx);
  const fields = findFields(inner);
  console.log('Key:', key);
  console.log('In dict:', key in dict);
  console.log('vi field:', JSON.stringify(fields.vi));
  console.log('en field:', JSON.stringify(fields.en));
  break;
}