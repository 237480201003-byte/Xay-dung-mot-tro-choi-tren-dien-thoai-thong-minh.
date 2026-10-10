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
    const m = inner[k].match(/^(\s*)(en|yue|vi):\s*\[(.*)$/);
    if (!m) { k += 1; continue; }
    const indent = m[1];
    const fieldName = m[2];
    if (out[fieldName]) { k += 1; continue; }
    const openerRest = m[3];
    console.log('  k=' + k + ' field=' + fieldName + ' openerRest=' + JSON.stringify(openerRest));
    const hasCloseOnSameLine = openerRest.indexOf(']') !== -1;
    console.log('    hasCloseOnSameLine=' + hasCloseOnSameLine);
    if (hasCloseOnSameLine) {
      let depth = (openerRest.match(/\[/g) || []).length - (openerRest.match(/\]/g) || []).length;
      console.log('    single-line depth=' + depth);
      if (depth === 0) {
        out[fieldName] = { start: k, end: k, indent };
        k += 1;
        continue;
      }
    }
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

// Find app.name
for (let i = 0; i < lines.length; i++) {
  if (/^\s*'app\.name':\s*\{\s*$/.test(lines[i])) {
    console.log('Found at line', i + 1);
    const endIdx = findEntryEnd(i);
    console.log('endIdx:', endIdx + 1);
    const inner = lines.slice(i + 1, endIdx);
    console.log('inner.length:', inner.length);
    for (let k = 0; k < inner.length; k++) {
      console.log(' inner[' + k + ']:', JSON.stringify(inner[k]));
    }
    const fields = findFields(inner);
    console.log('fields:', JSON.stringify(fields, null, 2));
    break;
  }
}