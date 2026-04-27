const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'assets', 'js', 'i18n');
const langs = ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt'];

const stats = {
  totalText: 0,
  wrappedFully: 0,        // starts and ends with " AND only 2 quotes total
  multiQuoteCases: [],    // texts with more than 2 quotes
  oneSidedCases: [],      // starts OR ends with " but not both
};

for (const lang of langs) {
  const langDir = path.join(i18nDir, lang);
  if (!fs.existsSync(langDir)) continue;
  const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(langDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [key, node] of Object.entries(data)) {
      if (!node || typeof node !== 'object') continue;
      const text = node.text;
      if (typeof text !== 'string' || text.length === 0) continue;
      stats.totalText++;
      const startsQ = text.startsWith('"');
      const endsQ = text.endsWith('"');
      const quoteCount = (text.match(/"/g) || []).length;

      if (startsQ && endsQ && quoteCount === 2) {
        stats.wrappedFully++;
      } else if (quoteCount >= 2 && (startsQ || endsQ)) {
        stats.multiQuoteCases.push({ lang, file, key, text });
      } else if (startsQ !== endsQ) {
        stats.oneSidedCases.push({ lang, file, key, text });
      }
    }
  }
}

console.log('Total text fields:', stats.totalText);
console.log('Fully wrapped (safe to strip):', stats.wrappedFully);
console.log('Multi-quote cases (need review):', stats.multiQuoteCases.length);
console.log('One-sided quote cases (need review):', stats.oneSidedCases.length);

console.log('\n--- Multi-quote samples (first 10) ---');
stats.multiQuoteCases.slice(0, 10).forEach((c) => {
  console.log(`[${c.lang}/${c.file}] ${c.key}: ${c.text}`);
});

console.log('\n--- One-sided samples (first 10) ---');
stats.oneSidedCases.slice(0, 10).forEach((c) => {
  console.log(`[${c.lang}/${c.file}] ${c.key}: ${c.text}`);
});
