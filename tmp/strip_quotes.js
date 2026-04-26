const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'assets', 'js', 'i18n');
const langs = ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt-BR'];

let totalStripped = 0;
const fileStats = {};

for (const lang of langs) {
  const langDir = path.join(i18nDir, lang);
  if (!fs.existsSync(langDir)) continue;
  const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(langDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    let stripped = 0;
    for (const node of Object.values(data)) {
      if (!node || typeof node !== 'object') continue;
      const text = node.text;
      if (typeof text !== 'string' || text.length < 2) continue;
      if (text.startsWith('"') && text.endsWith('"')) {
        node.text = text.slice(1, -1);
        stripped++;
      }
    }
    if (stripped > 0) {
      const out = JSON.stringify(data, null, 4) + '\n';
      fs.writeFileSync(filePath, out, 'utf8');
      fileStats[`${lang}/${file}`] = stripped;
      totalStripped += stripped;
    }
  }
}

console.log(`Total stripped: ${totalStripped}`);
console.log('\nBy file:');
for (const [k, v] of Object.entries(fileStats)) {
  console.log(`  ${k}: ${v}`);
}
