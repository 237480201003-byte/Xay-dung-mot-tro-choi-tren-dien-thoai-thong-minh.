// Restore vi: [...] for entries where it currently duplicates yue: [...],
// replacing with the en: [...] body.
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

// Returns object: { fieldName: { startIdx, endIdx (inclusive), indent } }
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

// Normalize the body: strip field name, then collapse whitespace
function normalizeBody(block, fieldName) {
  // block is the array of lines for a field. Strip the opener line and the closing line.
  // Then collapse whitespace.
  const bodyLines = block.slice(1, -1); // skip opener `[` and closer `],`
  return bodyLines.join('\n').replace(/\s+/g, ' ').trim();
}

const out = [];
let i = 0;
let swaps = 0;
const swappedKeys = [];

while (i < lines.length) {
  const ln = lines[i];
  out.push(ln);
  const keyMatch = ln.match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!keyMatch) { i += 1; continue; }
  const endIdx = findEntryEnd(i);
  if (endIdx === -1) { i += 1; continue; }

  const inner = lines.slice(i + 1, endIdx);
  const fields = findFields(inner);

  let didSwap = false;
  if (fields.yue && fields.vi && fields.en) {
    const yueBlock = inner.slice(fields.yue.start, fields.yue.end + 1);
    const viBlock = inner.slice(fields.vi.start, fields.vi.end + 1);
    const yueNorm = normalizeBody(yueBlock, 'yue');
    const viNorm = normalizeBody(viBlock, 'vi');
    if (yueNorm === viNorm) {
      // Replace vi with en's content
      const enBlock = inner.slice(fields.en.start, fields.en.end + 1);
      const newVi = enBlock.map((line, idx) => {
        if (idx === 0) return line.replace(/^(\s*)en:/, '$1vi:');
        return line;
      });
      const newInner = inner.slice();
      newInner.splice(fields.vi.start, fields.vi.end - fields.vi.start + 1, ...newVi);
      for (const l of newInner) out.push(l);
      out.push(lines[endIdx]);
      didSwap = true;
      swaps += 1;
      swappedKeys.push(keyMatch[1]);
    }
  }

  if (!didSwap) {
    for (const l of inner) out.push(l);
    out.push(lines[endIdx]);
  }
  i = endIdx + 1;
}

fs.writeFileSync(file, out.join('\n'));
console.log('Swapped vi->en for', swaps, 'entries');
console.log('First swapped keys:', swappedKeys.slice(0, 10).join(', '));