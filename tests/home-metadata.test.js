'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/modules/I18nManager.js'), 'utf8');
const config = fs.readFileSync(path.join(root, 'assets/js/config.js'), 'utf8');
const Manager = vm.runInNewContext(`${config}\n${source}\nI18nManager`, { window: {} });

test('every supported locale uses the published search title and description', () => {
    for (const lang of Object.keys(Manager.LANGUAGES)) {
        const html = fs.readFileSync(path.join(root, lang === 'ko' ? 'index.html' : `${lang}/index.html`), 'utf8');
        assert.equal(Manager.UI[lang].metaTitle, html.match(/<title>([^<]+)<\/title>/)[1], lang);
        assert.equal(Manager.UI[lang].metaDesc, html.match(/<meta\s+name="description"\s+content="([^"]+)"/)[1], lang);
        assert.ok(Manager.UI[lang].metaTitle.includes('Nevergrad'), lang);
        assert.match(html, /I18nManager\.js\?v=20261017-name-rules/);
    }
});
