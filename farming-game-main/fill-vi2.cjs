// Pass 2 v4: copy the yue block (multi-line) as vi after yue, for entries
// that have multi-line yue but no vi.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/shell/core/strings.ts');
let src = fs.readFileSync(file, 'utf8');

let addedCount = 0;

const lines = src.split('\n');
const out = [];
let i = 0;

while (i < lines.length) {
  const ln = lines[i];
  out.push(ln);
  if (/^\s*'[A-Za-z0-9_.]+':\s*\{\s*$/.test(ln)) {
    let depth = 1;
    let j = i + 1;
    const entryLines = [];
    while (j < lines.length && depth > 0) {
      entryLines.push(lines[j]);
      const openCount = (lines[j].match(/\{/g) || []).length;
      const closeCount = (lines[j].match(/\}/g) || []).length;
      depth += openCount - closeCount;
      j += 1;
    }
    // Find if any line already has vi: at any indent within entry.
    let hasAnyVi = false;
    for (const el of entryLines) {
      if (/^\s*vi:\s*\[/.test(el)) { hasAnyVi = true; break; }
    }
    if (!hasAnyVi) {
      // For each multi-line yue block, append a vi block with the same body.
      const rewritten = [];
      let k = 0;
      while (k < entryLines.length) {
        const el = entryLines[k];
        rewritten.push(el);
        const m = el.match(/^(\s*)yue:\s*\[\s*$/);
        if (m) {
          const indent = m[1];
          // Walk until depth closes back to 0
          let d = 1;
          let mIdx = k + 1;
          while (mIdx < entryLines.length && d > 0) {
            const sub = entryLines[mIdx];
            rewritten.push(sub);
            d += (sub.match(/\[/g) || []).length;
            d -= (sub.match(/\]/g) || []).length;
            if (d <= 0) break;
            mIdx += 1;
          }
          // entryLines[k..mIdx] is the yue block.
          const yueBlock = entryLines.slice(k, mIdx + 1);
          // Build vi block by replacing leading yue: with vi: on first line.
          for (let p = 0; p < yueBlock.length; p++) {
            const line = yueBlock[p];
            if (p === 0) {
              rewritten.push(line.replace(/^(\s*)yue:/, '$1vi:'));
            } else {
              rewritten.push(line);
            }
          }
          addedCount += 1;
          k = mIdx + 1;
          continue;
        }
        k += 1;
      }
      for (const el of rewritten) out.push(el);
    } else {
      for (const el of entryLines) out.push(el);
    }
    i = j;
    continue;
  }
  i += 1;
}

fs.writeFileSync(file, out.join('\n'));
console.log('Multi-line vi additions:', addedCount);