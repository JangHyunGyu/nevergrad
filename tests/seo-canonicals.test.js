'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const site = 'https://nevergrad.archerlab.dev';
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

function pageFor(url) {
    const pathname = new URL(url).pathname;
    return path.join(root, pathname.endsWith('/') ? `${pathname}index.html` : `${pathname}.html`);
}

test('sitemap URLs resolve to documents that identify the same canonical address', () => {
    assert.ok(urls.length > 0);
    assert.equal(new Set(urls).size, urls.length, 'No duplicate sitemap entries');
    for (const url of urls) {
        assert.equal(new URL(url).origin, site, url);
        assert.ok(!new URL(url).pathname.endsWith('.html'), `Redirect alias in sitemap: ${url}`);
        const html = fs.readFileSync(pageFor(url), 'utf8');
        const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
        assert.equal(canonicals.length, 1, `Exactly one canonical: ${url}`);
        assert.equal(canonicals[0][1], url, `Self-referencing canonical: ${url}`);
    }
});

test('every internal SEO link points directly to an indexable canonical document', () => {
    const indexable = new Set(urls);
    const pages = fs.readdirSync(path.join(root, 'seo')).filter(file => file.endsWith('.html'));
    for (const file of pages) {
        const html = fs.readFileSync(path.join(root, 'seo', file), 'utf8');
        const current = `${site}/seo/${file.replace(/\.html$/, '')}`;
        for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
            const target = new URL(match[1], current);
            if (target.origin !== site || !target.pathname.startsWith('/seo/')) continue;
            assert.ok(indexable.has(`${target.origin}${target.pathname}`),
                `${file} links to an alias or missing SEO page: ${target.pathname}`);
        }
    }
});
