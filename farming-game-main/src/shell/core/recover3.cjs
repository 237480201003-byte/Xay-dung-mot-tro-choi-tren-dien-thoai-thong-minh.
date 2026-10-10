// Restore vi: [...] for entries where it currently duplicates yue: [...],
// replacing with the en: [...] body.
//
// This is the minimum fix needed so every vi: contains the English baseline
// before we begin translating into Vietnamese.
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

// Find each entry, identify its en/yue/vi block ranges
const out = [];
let i = 0;
let swaps = 0;
while (i < lines.length) {
  const ln = lines[i];
  out.push(ln);
  const keyMatch = ln.match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!keyMatch) { i += 1; continue; }
  const entryStart = i;
  const endIdx = findEntryEnd(i);
  if (endIdx === -1) { i += 1; continue; }

  // Walk inner lines, tracking field ranges
  const inner = lines.slice(i + 1, endIdx);
  const fields = {}; // field -> { startIdx (relative to inner), endIdx (relative to inner, inclusive) }

  let k = 0;
  while (k < inner.length) {
    const fm = inner[k].match(/^(\s*)(en|yue|vi):\s*\[(\s*)$/);
    if (fm) {
      const indent = fm[1];
      const fieldName = fm[2];
      // Walk until array closes
      let depth = 1;
      let m = k;
      while (m < inner.length && depth > 0) {
        const sub = inner[m];
        depth += (sub.match(/\[/g) || []).length;
        depth -= (sub.match(/\]/g) || []).length;
        if (depth <= 0) break;
        m += 1;
      }
      fields[fieldName] = { start: k, end: m, indent };
      k = m + 1;
    } else {
      k += 1;
    }
  }

  // Compare yue and vi
  if (fields.yue && fields.vi && fields.en) {
    const yueBody = inner.slice(fields.yue.start, fields.yue.end + 1).join('\n');
    const viBody = inner.slice(fields.vi.start, fields.vi.end + 1).join('\n');
    const normYue = yueBody.replace(/\s+/g, ' ').trim();
    const normVi = viBody.replace(/\s+/g, ' ').trim();
    if (normYue === normVi) {
      // vi was clobbered from yue. Replace vi block with en block.
      const enBody = inner.slice(fields.en.start, fields.en.end + 1);
      // Build new vi block at the same indent
      const indent = fields.vi.indent;
      const newVi = [`${indent}vi: [`].concat(enBody.slice(1, -1)).concat([`${indent}],`]);
      // Insert new vi at the same position as old vi
      const newInner = inner.slice();
      newInner.splice(fields.vi.start, fields.vi.end - fields.vi.start + 1, ...newVi);
      // Push everything
      for (const l of newInner) out.push(l);
      out.push(lines[endIdx]);
      swaps += 1;
      i = endIdx + 1;
      continue;
    }
  }

  // Default: push inner as-is
  for (const l of inner) out.push(l);
  out.push(lines[endIdx]);
  i = endIdx + 1;
}

fs.writeFileSync(file, out.join('\n'));
console.log('Swapped vi->en for', swaps, 'entries');