'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'assets/js/modules/I18nManager.js');
const languages = ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh'];
const original = fs.readFileSync(file, 'utf8');
let source = original;

// Published HTML is the source for both crawler and runtime metadata.
for (const lang of languages) {
    const html = fs.readFileSync(path.join(root, lang === 'ko' ? 'index.html' : `${lang}/index.html`), 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1];
    if (!title || !description) throw new Error(`Missing home metadata: ${lang}`);
    const pattern = new RegExp(`(        ${lang}: \\{\\r?\\n[\\s\\S]*?            metaTitle: )[^\\r\\n]+(\\r?\\n            metaDesc: )[^\\r\\n]+`);
    if (!pattern.test(source)) throw new Error(`Missing runtime metadata: ${lang}`);
    source = source.replace(pattern, (_, start, middle) =>
        `${start}${JSON.stringify(title)},${middle}${JSON.stringify(description)},`);
}

if (source !== original) {
    if (process.argv.includes('--check')) {
        console.error('Home metadata differs between HTML and runtime; run npm run seo:sync');
        process.exitCode = 1;
    } else {
        fs.writeFileSync(file, source);
        console.log('Synchronized runtime metadata for eight home languages');
    }
} else {
    console.log('Home metadata synchronized for eight languages');
}
