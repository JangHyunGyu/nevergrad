'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// functions/_middleware.js is an ES module for Cloudflare Pages; load its pure helper here.
const src = fs.readFileSync(path.join(__dirname, '..', 'functions', '_middleware.js'), 'utf8')
    .replace('export async function onRequest', 'async function onRequest') + '\nmodule.exports = { isBlocked };';
const mod = { exports: {} };
new Function('module', 'exports', src)(mod, mod.exports);
const { isBlocked } = mod.exports;

test('repo-only files are blocked, including percent-encoded variants', () => {
    for (const p of [
        '/SCENARIO.md', '/%53CENARIO.md', '/SCENARIO%2Emd', '/SCENARIO%252Emd', '/AGENTS.md',
        '/deepseek_api.cjs', '/deepseek%5Fapi.cjs', '/deep-runtime.log', '/validate.js', '/%76alidate.js',
        '/.wrangler/cache/wrangler-account.json', '/%2Ewrangler/cache/wrangler-account.json',
        '/%2Egithub/workflows/quality.yml', '/package.json', '/%73cripts/i18n-check.js',
        '/seo/_generate.js', '/docs/qa/x.md', '/model_adapters/index.cjs', '/tmp/SCENARIO.md.bak',
    ]) assert.strictEqual(isBlocked(p), true, p);
});

test('game, SEO and static pages stay reachable', () => {
    for (const p of [
        '/', '/ja/', '/en/index.html', '/seo/free-browser-visual-novel', '/llms.txt', '/robots.txt',
        '/classified/', '/project-cupid/', '/assets/js/app.js', '/.well-known/security.txt', '/sitemap.xml',
    ]) assert.strictEqual(isBlocked(p), false, p);
});
