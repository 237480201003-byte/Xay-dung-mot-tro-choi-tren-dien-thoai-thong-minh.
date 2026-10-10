// Add vi: [ ... ] for multi-line entries that have yue: [ ... ] but no vi.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/shell/core/strings.ts');
let src = fs.readFileSync(file, 'utf8');

let added = 0;

// Walk entries by tracking braces. For each entry that contains
//   yue: [\n ... \n ],
// but no <blockquote>vi:</blockquote>, append a <blockquote>vi:</blockquote> block
// immediately after the yue block, with the same body.
//
// Strategy: split into lines, walk, track brace depth, track entry id.
// When an entry closes, decide whether to inject.

const lines = src.split('\n');

function findEntryEnd(startLineIdx) {
  let depth = 1;
  let j = startLineIdx + 1;
  while (j < lines.length && depth > 0) {
    depth += (lines[j].match(/\{/g) || []).length;
    depth -= (lines[j].match(/\}/g) || []).length;
    if (depth <= 0) return j;
    j += 1;
  }
  return -1;
}

const out = [];
let i = 0;
while (i < lines.length) {
  const ln = lines[i];
  out.push(ln);
  if (/^\s*'[A-Za-z0-9_.]+':\s*\{\s*$/.test(ln)) {
    const endIdx = findEntryEnd(i);
    if (endIdx === -1) {
      // malformed; push rest and break
      for (let p = i + 1; p < lines.length; p++) out.push(lines[p]);
      break;
    }
    const inner = lines.slice(i + 1, endIdx);
    // Decide if a vi line at indent 4 (or matching any other indent) exists.
    const hasViLine = inner.some((l) => /^\s*vi:\s*\[/.test(l));
    if (hasViLine) {
      // Push inner as-is
      for (const el of inner) out.push(el);
      // Push closing line
      out.push(lines[endIdx]);
      i = endIdx + 1;
      continue;
    }
    // Walk inner, for each yue multi-line opener, push yue block, then push vi block.
    let k = 0;
    while (k < inner.length) {
      const el = inner[k];
      out.push(el);
      const m = el.match(/^(\s*)yue:\s*\[\s*$/);
      if (m) {
        const indent = m[1];
        // Walk forward until ] closes
        let d = 1;
        let mIdx = k + 1;
        while (mIdx < inner.length && d > 0) {
          const sub = inner[mIdx];
          out.push(sub);
          d += (sub.match(/\[/g) || []).length;
          d -= (sub.match(/\]/g) || []).length;
          if (d <= 0) break;
          mIdx += 1;
        }
        // inner[k..mIdx] is yue block
        const yueBlock = inner.slice(k, mIdx + 1);
        // Push vi block (same body, leading yue -> vi).
        for (let p = 0; p < yueBlock.length; p++) {
          const line = yueBlock[p];
          if (p === 0) {
            out.push(line.replace(/^(\s*)yue:/, '$1vi:'));
          } else {
            out.push(line);
          }
        }
        added += 1;
        k = mIdx + 1;
        continue;
      }
      k += 1;
    }
    // Push closing line of entry
    out.push(lines[endIdx]);
    i = endIdx + 1;
    continue;
  }
  i += 1;
}

fs.writeFileSync(file, out.join('\n'));
console.log('Multi-line vi added:', added);