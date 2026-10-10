// Recovery: pass 1 mistakenly erased yue from single-line entries, replacing
// them with vi copies. Restore:
//   1. Move vi -> yue (preserving the original Cantonese content)
//   2. Copy en -> vi (so the catalogue compiles)
//
// Run from repo root: node recover.cjs
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/shell/core/strings.ts');
let src = fs.readFileSync(file, 'utf8');

let swapped = 0;

// Pass A: handle single-line entries that lost yue.
// Match: en: [...],\n    vi: [...],\n
// Result: en: [...],\n    yue: [...],\n    vi: [en-copied],\n
src = src.replace(
  /(\s+)en:\s*(\[[^\]\n]*\],?)(\s*\n\s+)vi:\s*(\[[^\]\n]*\],?)(\s*\n)/g,
  (m, indent1, enArr, mid, viArr, eol) => {
    swapped += 1;
    return `${indent1}en: ${enArr}${mid}yue: ${viArr}${mid}vi: ${enArr}${eol}`;
  },
);

fs.writeFileSync(file, src);
console.log('Single-line recoveries:', swapped);