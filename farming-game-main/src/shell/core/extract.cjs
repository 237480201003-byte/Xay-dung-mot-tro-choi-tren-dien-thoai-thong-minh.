// Extract every entry's en array, write to a JSON template for translation
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'strings.ts');
const src = fs.readFileSync(file, 'utf8');

// Match each entry and its en field as a string.
// Entry:  '<key>': { ... },  (greedy match on first balanced braces)
// Inside entry, find  en: <array>  where array is balanced [ ... ].
//
// Simpler — process line-by-line with state.
const lines = src.split('\n');

let i = 0;
const out = {};
let count = 0;
while (i < lines.length) {
  const m = lines[i].match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!m) { i += 1; continue; }
  const key = m[1];
  // Find the matching `},` closing line.
  let depth = 1;
  let j = i + 1;
  while (j < lines.length && depth > 0) {
    const opens = (lines[j].match(/\{/g) || []).length;
    const closes = (lines[j].match(/\}/g) || []).length;
    depth += opens - closes;
    if (depth <= 0) break;
    j += 1;
  }
  const entryLines = lines.slice(i, j + 1);

  // Find the en field within entryLines.
  // Strategy: look for the first line that is `    en: <something>` (or with the field's
  // expected indent). Then walk forward until the array closes.
  // The key issue is the indent: it varies across the file (2, 4, or 6 spaces).
  // Detect indent: find the first field opener line in the entry and use its indent.
  let enIndent = null;
  for (let k = 1; k < entryLines.length - 1; k++) {
    const fm = entryLines[k].match(/^(\s*)en:\s*\[/);
    if (fm) { enIndent = fm[1]; break; }
  }
  if (enIndent === null) {
    console.error('No en field in', key);
    i = j + 1; continue;
  }

  // Find the en opener line
  let enLine = -1;
  for (let k = 1; k < entryLines.length - 1; k++) {
    if (entryLines[k].startsWith(enIndent + 'en:')) {
      enLine = k;
      break;
    }
  }
  if (enLine === -1) {
    console.error('No en opener in', key);
    i = j + 1; continue;
  }

  // Walk forward from enLine, tracking bracket depth
  let bracketDepth = 0;
  let startCounting = false;
  let closeLine = -1;
  for (let k = enLine; k < entryLines.length; k++) {
    const line = entryLines[k];
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '[') {
        bracketDepth += 1;
        startCounting = true;
      } else if (line[c] === ']') {
        bracketDepth -= 1;
        if (startCounting && bracketDepth === 0) {
          closeLine = k;
          break;
        }
      }
    }
    if (closeLine !== -1) break;
  }
  if (closeLine === -1) {
    console.error('en field not closed in', key);
    i = j + 1; continue;
  }

  // Extract content between [ and ]
  const openerLine = entryLines[enLine];
  const openIdx = openerLine.indexOf('[');
  // Collect everything between openIdx (exclusive) and the closing ] position
  let content = '';
  if (enLine === closeLine) {
    content = openerLine.slice(openIdx + 1, openerLine.lastIndexOf(']'));
  } else {
    content = openerLine.slice(openIdx + 1) + '\n';
    for (let k = enLine + 1; k < closeLine; k++) {
      content += entryLines[k] + '\n';
    }
    content += entryLines[closeLine].slice(0, entryLines[closeLine].lastIndexOf(']'));
  }

  // Parse content as 5 quoted strings (allowing multi-line)
  const items = [];
  let p = 0;
  let safety = 0;
  while (p < content.length && items.length < 10 && safety < 1000) {
    safety += 1;
    // Skip whitespace, commas, newlines
    while (p < content.length && /[\s,]/.test(content[p])) p += 1;
    if (p >= content.length) break;
    if (content[p] !== "'") { console.error('Parse error at', p, 'in', key, JSON.stringify(content.slice(Math.max(0, p - 5), p + 20))); break; }
    p += 1;
    let s = '';
    while (p < content.length && content[p] !== "'") {
      if (content[p] === '\\' && p + 1 < content.length) {
        s += content[p + 1];
        p += 2;
      } else {
        s += content[p];
        p += 1;
      }
    }
    if (content[p] !== "'") { console.error('Unclosed string in', key); break; }
    p += 1;
    items.push(s);
  }

  if (items.length === 5) {
    out[key] = items;
    count += 1;
  } else {
    console.error('Bad parse for', key, 'got', items.length, 'items');
  }

  i = j + 1;
}

const jsonFile = process.argv[2] || 'dict-template.json';
fs.writeFileSync(jsonFile, JSON.stringify(out, null, 2) + '\n');
console.log('Wrote', count, 'entries to', jsonFile);