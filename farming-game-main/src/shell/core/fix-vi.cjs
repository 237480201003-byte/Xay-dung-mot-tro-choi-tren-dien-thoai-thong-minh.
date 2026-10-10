// Fix duplicate content in vi arrays (both single-line and multi-line).
// Strategy:
//   For each vi: [...] block, count quoted items.
//   If exactly 5 items: OK.
//   If > 5 items (multi-line, due to bracket walk going too far):
//     Stop at first 5.
//   If single-line vi has 5 items but followed by 5 orphan items + `],`:
//     Detect orphan and remove.

const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'strings.ts');
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

const out = [];
let i = 0;
let fixed = 0;

function isQuotedItem(line) {
  return /^\s*'(.*)',?\s*$/.test(line);
}
function isClosingBracket(line) {
  return /^\s*\]\s*,?\s*$/.test(line);
}

while (i < lines.length) {
  const ln = lines[i];
  out.push(ln);
  // Single-line: vi: [...],
  const singleMatch = ln.match(/^(\s*)vi:\s*\[(.+)\]\s*,\s*$/);
  if (singleMatch) {
    // Count items
    const inner = singleMatch[2];
    const items = [];
    const re = /'((?:\\'|[^'])*)'/g;
    let m;
    while ((m = re.exec(inner)) !== null) items.push(m[1]);
    if (items.length === 5) {
      // Check for orphan after
      let k = i + 1;
      while (k < lines.length && lines[k].trim() === '') k += 1;
      const quoted = [];
      while (k < lines.length && isQuotedItem(lines[k])) {
        quoted.push(lines[k]);
        k += 1;
      }
      if (quoted.length === 5 && k < lines.length && isClosingBracket(lines[k])) {
        fixed += 1;
        console.log(`Line ${i+1}: single-line vi with orphan; skipping ${quoted.length + 1} lines`);
        i = k + 1;
        continue;
      }
    }
    i += 1;
    continue;
  }
  // Multi-line: vi: [
  const viMatch = ln.match(/^(\s*)vi:\s*\[\s*$/);
  if (!viMatch) { i += 1; continue; }
  let depth = 1;
  let j = i + 1;
  while (j < lines.length && depth > 0) {
    const l = lines[j];
    depth += (l.match(/\[/g) || []).length;
    depth -= (l.match(/\]/g) || []).length;
    if (depth <= 0) break;
    j += 1;
  }
  out.push(lines[j]); // emit closing ]
  j += 1;
  // Check for orphan: 5 quoted lines + `],`
  let k = j;
  while (k < lines.length && lines[k].trim() === '') k += 1;
  const quotedLines = [];
  let m = k;
  while (m < lines.length && isQuotedItem(lines[m])) {
    quotedLines.push(lines[m]);
    m += 1;
  }
  if (quotedLines.length === 5 && m < lines.length && isClosingBracket(lines[m])) {
    j = m + 1;
    fixed += 1;
    console.log(`Line ${i+1}: multi-line vi with orphan; removed ${quotedLines.length + 1} lines`);
  }
  i = j;
}

fs.writeFileSync(file, out.join('\n'));
console.log(`Total fixed: ${fixed}`);