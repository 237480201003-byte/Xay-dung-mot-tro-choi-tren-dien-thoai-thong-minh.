// Apply a Vietnamese translation dictionary to strings.ts.
// Usage: node translate.cjs <translations.json>
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'strings.ts');
const src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');

const jsonFile = process.argv[2];
if (!jsonFile) {
  console.error('Usage: node translate.cjs <translations.json>');
  process.exit(1);
}
const dict = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

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

// Walk the entry line by line, tracking the current field (if any) and bracket depth.
// When depth returns to 0 inside a field, that field's range ends at this line.
function findFields(inner) {
  const out = {};
  let currentField = null;
  let currentStart = -1;
  let bracketDepth = 0;
  for (let k = 0; k < inner.length; k++) {
    const line = inner[k];
    // Detect field opener: starts with optional whitespace then (en|yue|vi):
    const fm = line.match(/^(\s*)(en|yue|vi):\s*\[(.*)$/);
    if (fm && currentField === null) {
      // Start a new field
      const fieldName = fm[2];
      const indent = fm[1];
      const rest = fm[3];
      currentField = fieldName;
      currentStart = k;
      // Count brackets in openerRest (after the field's `[`)
      const extraOpens = (rest.match(/\[/g) || []).length;
      const extraCloses = (rest.match(/\]/g) || []).length;
      bracketDepth = 1 + extraOpens - extraCloses;
      if (bracketDepth === 0) {
        // Single-line array; field ends on this same line
        out[fieldName] = { start: k, end: k, indent };
        currentField = null;
        currentStart = -1;
      }
      continue;
    }
    if (currentField !== null) {
      // We're inside an array; count brackets on this line
      const opens = (line.match(/\[/g) || []).length;
      const closes = (line.match(/\]/g) || []).length;
      bracketDepth += opens - closes;
      if (bracketDepth === 0) {
        out[currentField] = { start: currentStart, end: k, indent: out[currentField]?.indent ?? '' };
        currentField = null;
        currentStart = -1;
      }
    }
  }
  return out;
}

const out = [];
let i = 0;
let applied = 0;
let skipped = 0;

while (i < lines.length) {
  const ln = lines[i];
  out.push(ln);
  const keyMatch = ln.match(/^\s*'([^']+)':\s*\{\s*$/);
  if (!keyMatch) { i += 1; continue; }
  const endIdx = findEntryEnd(i);
  if (endIdx === -1) { i += 1; continue; }

  const key = keyMatch[1];
  const inner = lines.slice(i + 1, endIdx);
  const fields = findFields(inner);

  let newInner = inner;
  if (fields.vi && dict[key]) {
    const vi = dict[key];
    if (!Array.isArray(vi) || vi.length !== 5) {
      console.error(`Bad entry for ${key}: not a 5-element array`);
      process.exit(1);
    }
    const indent = fields.vi.indent;
    const enRange = fields.en;
    const isMultiLine = enRange && (enRange.end > enRange.start);
    let newVi;
    if (isMultiLine) {
      newVi = [`${indent}vi: [`];
      for (const item of vi) {
        newVi.push(`${indent}  '${item.replace(/'/g, "\\'")}',`);
      }
      newVi.push(`${indent}],`);
    } else {
      const escaped = vi.map((s) => `'${s.replace(/'/g, "\\'")}'`).join(', ');
      newVi = [`${indent}vi: [${escaped}],`];
    }
    newInner = inner.slice();
    newInner.splice(fields.vi.start, fields.vi.end - fields.vi.start + 1, ...newVi);
    applied += 1;
  } else if (fields.vi && !dict[key]) {
    skipped += 1;
  }

  for (const l of newInner) out.push(l);
  out.push(lines[endIdx]);
  i = endIdx + 1;
}

fs.writeFileSync(file, out.join('\n'));
console.log(`Applied ${applied} translations, skipped ${skipped}`);