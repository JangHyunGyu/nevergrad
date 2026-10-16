const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const fixed = require('../docs/qa/phase2-fixed-copy-20261016.json');

test('phase 2 scenario keeps all 288 fixed Korean entries and 19 specified hooks', () => {
    const ctx = { SCENARIO: {} };
    for (const chapter of fixed.chapters) {
        vm.runInNewContext(fs.readFileSync('assets/js/scenario/' + chapter.scenarioFile, 'utf8'), ctx);
        const actual = JSON.parse(fs.readFileSync('assets/js/i18n/ko/' + chapter.jsonFile, 'utf8'));
        for (const [id, entry] of Object.entries(chapter.entries)) assert.deepEqual(actual[id], entry, id);
        for (const hook of chapter.hooks) assert.equal(ctx.SCENARIO[chapter.day][hook.id].next, hook.after, hook.id);
        for (const [id, scene] of Object.entries(chapter.scenes)) assert.deepEqual(JSON.parse(JSON.stringify(ctx.SCENARIO[chapter.day][id])), scene, id);
    }
    assert.equal(fixed.chapters.reduce((n,c) => n + Object.keys(c.entries).length, 0), 288);
});

test('gallery fixed copy covers 14 CGs, 30 tracks, 31 expressions in all eight languages', () => {
    const ctx = {};
    vm.runInNewContext(fs.readFileSync('assets/js/modules/GallerySystem.js', 'utf8') + '\nglobalThis.Gallery = GallerySystem;', ctx);
    const Gallery = ctx.Gallery;
    vm.runInNewContext(fs.readFileSync('assets/js/scenario/day5_4_night.js', 'utf8'), ctx);
    for (const [key, id] of Object.entries(Gallery.REPLAY_SCENES)) assert.ok(ctx.SCENARIO[5][id], key);
    const copy = value => JSON.parse(JSON.stringify(value));
    assert.deepEqual(copy(Gallery.LABELS.ko), fixed.korean.labels);
    assert.deepEqual(copy(Gallery.EXPANSION_CG_LABELS.ko), fixed.korean.cg);
    assert.deepEqual(copy(Gallery.BGM_TITLES_KO), fixed.korean.bgm);
    assert.deepEqual(copy(Gallery.EXPRESSION_TITLES_KO), fixed.korean.expressions);
    for (const lang of ['ko','en','ja','es','fr','de','pt','zh']) {
        for (const [actual, count] of [[Gallery.EXPANSION_CG_LABELS[lang],14],[Gallery.BGM_TITLES_LOCALIZED[lang],30],[Gallery.EXPRESSION_TITLES_LOCALIZED[lang],31]]) {
            assert.equal(Object.keys(actual).length, count, lang);
            assert.ok(Object.values(actual).flat().every(value => typeof value === 'string' && value.trim()), lang);
            if (lang !== 'ko') assert.doesNotMatch(Object.values(actual).flat().join(' '), /[가-힣]/, lang);
        }
    }
});
