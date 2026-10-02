'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'assets/js/i18n');
const languages = ['en', 'ja', 'es', 'fr', 'de', 'pt', 'zh'];
function readLanguage(lang) {
    return Object.assign({}, ...fs.readdirSync(path.join(root, lang))
        .filter(file => file.endsWith('.json'))
        .map(file => JSON.parse(fs.readFileSync(path.join(root, lang, file), 'utf8'))));
}
const source = readLanguage('ko');
const translations = Object.fromEntries(languages.map(lang => [lang, readLanguage(lang)]));
const placeholders = text => [...new Set(text.match(/\{[A-Za-z0-9_?]+\}/g) || [])].sort();

// A set taken across an entire entry misses a name moved from a choice into
// narration. Compare each visible field to its Korean counterpart separately.
for (const lang of languages) {
    test(`${lang}: story text keeps source placeholders and choice positions`, () => {
        for (const [id, src] of Object.entries(source)) {
            const entry = translations[lang][id];
            const label = `${lang}:${id}`;
            assert.ok(entry, label);
            assert.equal(typeof entry.text, 'string', `${label}.text`);
            assert.deepEqual(placeholders(entry.text), placeholders(src.text), `${label}.text`);
            if (src.text === '') assert.equal(entry.text, '', `${label}: empty routing text`);
            if (Array.isArray(src.choices)) {
                assert.ok(Array.isArray(entry.choices), `${label}.choices`);
                assert.equal(entry.choices.length, src.choices.length, `${label}.choices`);
                src.choices.forEach((choice, i) => {
                    assert.equal(typeof entry.choices[i], 'string', `${label}.choices[${i}]`);
                    assert.deepEqual(placeholders(entry.choices[i]), placeholders(choice), `${label}.choices[${i}]`);
                });
            } else {
                assert.equal(entry.choices, undefined, `${label}: unexpected choices`);
            }
        }
    });
}

test('Seojin remains the same person in the photo, slip of the tongue and experiment record', () => {
    const names = { en: 'Seojin', ja: 'ソジン', es: 'Seojin', fr: 'Seojin', de: 'Seojin', pt: 'Seojin', zh: '瑞镇' };
    const ids = ['day3_lunch_rooftop_8', 'day4_after_sea_12loop_3', 'day4_after_sea_12loop_7', 'day4_night_save_glitch_7', 'day4_night_mirror_hit2_5'];
    for (const lang of languages) {
        for (const id of ids) assert.ok(translations[lang][id].text.includes(names[lang]), `${lang}:${id}: character name`);
    }
});

test('the visible visitor and translated clue refer to the same teacher', () => {
    const names = /Eunsu|ウンス|恩秀/;
    assert.match(source.day4_lunch_yuna_17.text, /은수/);
    for (const lang of languages) assert.match(translations[lang].day4_lunch_yuna_17.text, names, lang);
});

test('Portuguese spelling and Korean surnames survive localization', () => {
    for (const [id, entry] of Object.entries(translations.pt)) {
        for (const text of [entry.text, ...(entry.choices || [])]) {
            assert.doesNotMatch(text, /\bprofessoraa\b|\bParque (?:Seojin|Jaewon)\b/, id);
        }
    }
});
