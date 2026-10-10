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
// where each range covers from the opener line to the closing ] line.
function findFields(inner) {
  const out = {};
  let k = 0;
  while (k < inner.length) {
    const m = inner[k].match(/^(\s*)(en|yue|vi):\s*\[(\s*)$/);
    if (!m) { k += 1; continue; }
    const indent = m[1];
    const fieldName = m[2];
    // Walk until the array closes
    let depth = 1;
    let mIdx = k;
    while (mIdx < inner.length && depth > 0) {
      const sub = inner[mIdx];
      const opens = (sub.match(/\[/g) || []).length;
      const closes = (sub.match(/\]/g) || []).length;
      // Only count the first [ as opening (the field opener); later ones are inside the content
      // For a multi-line entry like "    en: [\n ... \n    ],", the first [ on the opener line
      // is already accounted for. So we walk depth, and the closing ] will bring depth to 0.
      depth += opens - closes;
      if (depth <= 0) break;
      mIdx += 1;
    }
    if (out[fieldName]) {
      // already exists; skip
      k = mIdx + 1;
      continue;
    }
    out[fieldName] = { start: k, end: mIdx, indent };
    k = mIdx + 1;
  }
  return out;
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
    const yueBody = inner.slice(fields.yue.start, fields.yue.end + 1).join('\n');
    const viBody = inner.slice(fields.vi.start, fields.vi.end + 1).join('\n');
    const norm = (s) => s.replace(/\s+/g, ' ').trim();
    if (norm(yueBody) === norm(viBody)) {
      // Replace vi block with a new vi block containing en's body
      const enBlock = inner.slice(fields.en.start, fields.en.end + 1);
      const indent = fields.vi.indent;
      // The en block looks like:
      //   "    en: ["
      //   "      'foo',"
      //   ...
      //   "    ],"
      // We want a vi block with the same shape, just renaming "en:" to "vi:"
      const newVi = enBlock.map((line, idx) => {
        if (idx === 0) return line.replace(/^(\s*)en:/, '$1vi:');
        return line;
      });
      // Insert new vi at the position of the old vi
      const newInner = inner.slice();
      newInner.splice(fields.vi.start, fields.vi.end - fields.vi.start + 1, ...newVi);
      // Push new inner + closing
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
console.log('First swapped keys:', swappedKeys.slice(0, 5).join(', '));