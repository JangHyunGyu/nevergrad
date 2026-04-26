const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'SCENARIO.md');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

let inBlock = false;
let stripped = 0;
let multiQuoteSkipped = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('```text')) { inBlock = true; continue; }
  if (line.startsWith('```') && inBlock) { inBlock = false; continue; }
  if (!inBlock) continue;
  // Preserve leading/trailing whitespace; only strip wrapping quotes from the trimmed core
  const match = line.match(/^(\s*)(.*?)(\s*)$/);
  const [, leading, core, trailing] = match;
  if (core.length >= 2 && core.startsWith('"') && core.endsWith('"')) {
    lines[i] = leading + core.slice(1, -1) + trailing;
    stripped++;
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log(`SCENARIO.md: stripped ${stripped} lines`);
