// Debug: print the exact yueBody and viBody for tabs.reorder.hint
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

function findFields(inner) {
  const out = {};
  let k = 0;
  while (k < inner.length) {
    const m = inner[k].match(/^(\s*)(en|yue|vi):\s*\[(\s*)$/);
    if (!m) { k += 1; continue; }
    const indent = m[1];
    const fieldName = m[2];
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
while (i < lines.length) {
  const ln = lines[i];
  const keyMatch = ln.match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!keyMatch) { i += 1; continue; }
  const endIdx = findEntryEnd(i);
  if (endIdx === -1) { i += 1; continue; }
  if (keyMatch[1] !== 'tabs.reorder.hint') { i = endIdx + 1; continue; }

  const inner = lines.slice(i + 1, endIdx);
  const fields = findFields(inner);
  console.log('fields:', JSON.stringify(fields, null, 2));
  console.log('yue range:', fields.yue.start, '-', fields.yue.end);
  console.log('vi range:', fields.vi.start, '-', fields.vi.end);
  console.log('en range:', fields.en.start, '-', fields.en.end);

  const yueBody = inner.slice(fields.yue.start, fields.yue.end + 1).join('\n');
  const viBody = inner.slice(fields.vi.start, fields.vi.end + 1).join('\n');
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  console.log('yueNorm:', JSON.stringify(norm(yueBody)));
  console.log('viNorm:', JSON.stringify(norm(viBody)));
  console.log('Match:', norm(yueBody) === norm(viBody));
  break;
}