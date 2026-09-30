// Cloudflare Pages deploys the whole repository root, so repo-only files (docs,
// tooling, CI config, caches) would otherwise be downloadable. Static rules in
// _redirects/_headers match the raw path and can be bypassed with percent
// encoding (e.g. /%2Ewrangler/..., /SCENARIO%2Emd), so the check below runs on
// the fully decoded, normalized path instead.
//
// _routes.json keeps /assets/* (images, audio, JS, CSS, i18n) off this Function.

const BLOCKED_DIRS = [
  '.git', '.github', '.wrangler', 'docs', 'model_adapters', 'scripts', 'tests',
  'tmp', 'node_modules', 'test-results', 'playwright-report', 'functions',
];

const BLOCKED_FILES = new Set([
  'package.json', 'package-lock.json', 'playwright.config.cjs', 'validate.js',
  'evaluate-scenario.js', 'generate-images.js', 'remove-bg.js', '.gitignore',
  'seo/_generate.js', 'seo/_sitemap_fragment.xml', '_headers', '_redirects',
  '_routes.json', '_worker.js',
]);

const BLOCKED_EXTENSIONS = ['.md', '.cjs', '.mjs', '.py', '.sh', '.log', '.bak', '.map', '.env', '.yml', '.yaml'];

function normalize(pathname) {
  let p = pathname;
  // Decode repeatedly so double-encoded variants (%252E) are also caught.
  for (let i = 0; i < 4; i += 1) {
    let next;
    try { next = decodeURIComponent(p); } catch (e) { return null; }
    if (next === p) break;
    p = next;
  }
  p = p.replace(/\\/g, '/');
  const out = [];
  for (const seg of p.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') { out.pop(); continue; }
    out.push(seg.replace(/[\u0000-\u001f]/g, ''));
  }
  return out.join('/').toLowerCase();
}

function isBlocked(pathname) {
  const p = normalize(pathname);
  if (p === null) return true;
  if (p === '') return false;
  const segments = p.split('/');
  if (segments[0] === 'assets') return false;
  if (BLOCKED_DIRS.includes(segments[0])) return true;
  if (BLOCKED_FILES.has(p)) return true;
  // dotfiles/dot-directories anywhere (".wrangler", ".env", ...) except /.well-known/
  if (segments.some((s) => s.startsWith('.') && s !== '.well-known')) return true;
  const last = segments[segments.length - 1];
  return BLOCKED_EXTENSIONS.some((ext) => last.endsWith(ext)) && p !== 'llms.txt';
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (isBlocked(url.pathname)) {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  }
  return context.next();
}
