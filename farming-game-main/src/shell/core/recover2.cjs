// Recovery pass:
// 1. Fix `common.apply` (missing yue + syntax error in vi)
// 2. Fix `app.tagline` (missing yue + Cantonese content in vi)
// 3. For each multi-line entry where vi === yue, replace vi with en content
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

function extractArray(block, field) {
  // Capture content of `field: [ ... ]` (single or multi-line), trimmed
  const m = block.match(new RegExp('^\\s*' + field + ':\\s*\\[([\\s\\S]*?)\n\\s*\\],?', 'm'));
  return m ? m[1] : null;
}

// 1. Fix common.apply
let out = src;
out = out.replace(
  /('common\.apply':\s*\{\s*\n\s*en:\s*\[)([\s\S]*?)(\],\s*\n\s*vi:\s*\[)([\s\S]*?)(\),\s*\n\s*\},)/,
  (m, p1, enBody, p3, viBody, p5) => {
    // Add a yue line right before vi: with proper Cantonese
    const yueLine = `    yue: ['套用', '套用', '用咗佢', '咁就用啦', '依書直畫'],\n`;
    // Fix the vi line: ensure the array is closed correctly with ]
    const fixedVi = viBody.replace(/\),\s*$/, ']),');
    return `${p1}${enBody}${p3}${fixedVi}\n${yueLine}${p5}`;
  }
);

// 2. Fix app.tagline: missing yue, vi contains Cantonese content (should be en)
//    The current vi: block at L222-227 has the Cantonese content. We need to:
//    - Restore yue: with the Cantonese content
//    - Replace vi: with the English content
const taglineRe = /('app\.tagline':\s*\{\s*\n\s*en:\s*\[)([\s\S]*?)(\],\s*\n)\s*(vi:\s*\[)([\s\S]*?)(\],\s*\n\s*\},)/;
out = out.replace(taglineRe, (m, p1, enBody, p3, p4, viBody, p6) => {
  // The viBody currently contains Cantonese. Move it to yue, copy enBody to vi.
  const yueBlock = `    yue: [\n${viBody}    ],\n`;
  const viBlock = `${p4}${enBody}    ${p6}`;
  return `${p1}${enBody}${p3}${yueBlock}${viBlock}`;
});

fs.writeFileSync(file, out);
console.log('common.apply and app.tagline fixed.');

// Now: rebuild lines array and find any entries where vi === yue (Cantonese clobbered)
const newLines = out.split('\n');
let i = 0;
let swaps = 0;
const outLines = [];
while (i < newLines.length) {
  const ln = newLines[i];
  outLines.push(ln);
  const m = ln.match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!m) { i += 1; continue; }
  const endIdx = findEntryEnd(i);
  if (endIdx === -1) { i += 1; continue; }
  // Push inner + closing
  const inner = newLines.slice(i + 1, endIdx);
  const block = newLines.slice(i, endIdx + 1).join('\n');
  const yueBody = extractArray(block, 'yue');
  const viBody = extractArray(block, 'vi');
  const enBody = extractArray(block, 'en');
  let replacedInner = inner;
  if (yueBody !== null && viBody !== null && enBody !== null) {
    const yueNorm = yueBody.replace(/\s+/g, ' ').trim();
    const viNorm = viBody.replace(/\s+/g, ' ').trim();
    if (yueNorm === viNorm && yueNorm !== enNorm(enBody)) {
      // vi was clobbered from yue — replace vi array body with en body
      replacedInner = inner.map((line) => {
        if (/^\s*vi:\s*\[/.test(line)) {
          // First line of vi array
          const indent = line.match(/^\s*/)[0];
          return `${indent}vi: [\n${enBody}${indent}],`;
        }
        return line;
      });
      swaps += 1;
    }
  }
  for (const l of replacedInner) outLines.push(l);
  outLines.push(newLines[endIdx]);
  i = endIdx + 1;
}
fs.writeFileSync(file, outLines.join('\n'));
console.log('Entries with vi swapped to en:', swaps);

function enNorm(body) {
  return body.replace(/\s+/g, ' ').trim();
}