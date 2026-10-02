'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../assets/js/i18n');
const languages = ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh'];
const data = Object.fromEntries(languages.map(lang => [lang, Object.assign({},
    ...fs.readdirSync(path.join(root, lang)).filter(file => file.endsWith('.json'))
        .map(file => JSON.parse(fs.readFileSync(path.join(root, lang, file), 'utf8'))))]));

test('the memory-erasing dose is an injection in every translation', () => {
    const terms = { ko: /한 대/, en: /shot/, ja: /一本打/, es: /inyección/, fr: /injection/, de: /Injektion/, pt: /injeção/, zh: /一针/ };
    for (const lang of languages) {
        const text = data[lang].day5_after_confront_17.text;
        assert.match(text, terms[lang], lang);
        assert.doesNotMatch(text, /disparo|Un seul tir|Ein Schuss|Um tiro|Uma foto/, lang);
    }
});

test('the ghost responds to the protagonist calling her name', () => {
    assert.match(data.en.day5_ending_true_16.text, /first time you.ve called me/);
    assert.doesNotMatch(data.en.day5_ending_true_16.text, /first time I.ve called you/);
    assert.match(data.en.day5_ending_true_14.text, /Lee Seolhwa/);
});

test('ordinary speech and fully marked narration retain Korean emphasis boundaries', () => {
    const marker = text => {
        const first = text.match(/^\*+/)?.[0] || '';
        const last = text.match(/\*+$/)?.[0] || '';
        return first && first === last && first.length <= 3 ? first : '';
    };
    for (const [id, source] of Object.entries(data.ko)) {
        const expected = marker(source.text);
        if (!expected && source.text.includes('*')) continue;
        for (const lang of languages.slice(1)) assert.equal(marker(data[lang][id].text), expected, `${lang}:${id}`);
    }
});
