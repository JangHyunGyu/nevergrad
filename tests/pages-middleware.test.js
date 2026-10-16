'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// functions/_middleware.js is an ES module for Cloudflare Pages; load its pure helper here.
const src = fs.readFileSync(path.join(__dirname, '..', 'functions', '_middleware.js'), 'utf8')
    .replace('export async function onRequest', 'async function onRequest') + '\nmodule.exports = { isBlocked, onRequest };';
const mod = { exports: {} };
new Function('module', 'exports', src)(mod, mod.exports);
const { isBlocked, onRequest } = mod.exports;

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
        '/', '/ja/', '/zh/', '/zh/index.html', '/en/index.html', '/seo/free-browser-visual-novel', '/llms.txt', '/robots.txt',
        '/classified/', '/project-cupid/', '/assets/js/app.js', '/.well-known/security.txt', '/sitemap.xml',
    ]) assert.strictEqual(isBlocked(p), false, p);
});

function contextFor(pathname, body, method = 'GET', status = 200, type = 'text/html') {
    return {
        request: new Request(`https://nevergrad.archerlab.dev${pathname}`, { method }),
        next: async () => new Response(body, {
            status, headers: { 'content-type': type, 'x-existing-header': 'preserved' },
        }),
    };
}

test('missing paths keep the existing rendered body but return 404 for GET and HEAD', async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    for (const method of ['GET', 'HEAD']) {
        for (const pathname of ['/missing-page', '/seo/missing-page', '/en/missing-page', '/missing.json']) {
            const response = await onRequest(contextFor(pathname, html, method));
            assert.equal(response.status, 404, `${method} ${pathname}`);
            assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
            assert.equal(response.headers.get('cache-control'), 'no-store');
            assert.equal(response.headers.get('x-existing-header'), 'preserved');
            assert.equal(await response.text(), method === 'HEAD' ? '' : html);
        }
    }
});

test('all sitemap pages and HTML aliases keep their status and indexability', async () => {
    const sitemap = fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8');
    for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        const pathname = new URL(url).pathname;
        const filename = pathname.endsWith('/') ? `${pathname}index.html` : `${pathname}.html`;
        const html = fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
        for (const method of ['GET', 'HEAD']) {
            for (const route of new Set([pathname, filename])) {
                const response = await onRequest(contextFor(route, html, method));
                assert.equal(response.status, 200, `${method} ${route}`);
                assert.equal(response.headers.get('x-robots-tag'), null, route);
                assert.equal(await response.text(), method === 'HEAD' ? '' : html);
            }
        }
    }
});

test('redirects, original errors and non-HTML responses pass through', async () => {
    for (const [status, type] of [[301, 'text/html'], [404, 'text/html'], [200, 'application/json']]) {
        const response = await onRequest(contextFor('/example', 'body', 'GET', status, type));
        assert.equal(response.status, status);
        assert.equal(await response.text(), 'body');
    }
});
