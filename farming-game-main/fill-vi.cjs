// One-shot: auto-fill Vietnamese voices in strings.ts by copying the English
// ones so the catalogue compiles. Real translations are filled in by hand.
//
// Run from repo root: node fill-vi.cjs
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/shell/core/strings.ts');
let src = fs.readFileSync(file, 'utf8');

// We look for entries that have a yue: [...] block but no vi: [...] block.
// Each entry looks like one of these shapes (in a multi-line string template):
//
//   'foo.bar': {
//     en: ['a', 'b', 'c', 'd', 'e'],
//     yue: ['x', 'y', 'z', 'w', 'v'],
//   },
//
// or with multi-line arrays:
//
//   'foo.bar': {
//     en: [
//       'a',
//       'b',
//       'c',
//       'd',
//       'e',
//     ],
//     yue: [
//       'x',
//       'y',
//       'z',
//       'w',
//       'v',
//     ],
//   },
//
// Plan:
//   1. Find every 'key': { ... }, block that has both en and yue but no vi.
//   2. For each, parse out the yue block contents (the 5 items between [ and ]).
//   3. Insert vi with the same items right after the yue block.

let addedCount = 0;

// First pass: handle multi-line arrays (yue: [ ... ] across multiple lines).
src = src.replace(
  /(\s+)(yue:\s*\[\s*\n)([\s\S]*?)(\n\s*\],?\s*\n)/g,
  (m, indent, yueOpen, yueBody, yueClose) => {
    // Find the surrounding entry; check if a vi block already exists in that entry.
    // Heuristic: check that the next field after yue is not vi by looking at the
    // 200 chars after the yue close.
    // Easier: only insert vi if the entry has no existing vi line anywhere before
    // the next '},\n  // or '\n} as const'. That's hard to do inside a regex
    // callback. Instead, we mark inserted entries in a set.
    return m;
  },
);

// Second pass: handle single-line `yue: [...],` blocks.
src = src.replace(
  /(\s+)yue:\s*(\[[^\]\n]*\],?)(\s*\n)/g,
  (m, indent, yueArray, eol) => {
    addedCount += 1;
    return `${indent}yue: ${yueArray}${indent}vi: ${yueArray}${eol}`;
  },
);

fs.writeFileSync(file, src);
console.log('Single-line additions:', addedCount);