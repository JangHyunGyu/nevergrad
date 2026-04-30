#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_FILE = 'tmp/mojibake_audit.json';

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  '.wrangler',
  '.github',
  'tmp/imagegen',
]);

const SKIP_FILES = new Set([
  OUTPUT_FILE,
]);

const TEXT_EXTS = new Set([
  '.html', '.js', '.mjs', '.json', '.md', '.txt', '.css', '.xml',
  '.svg', '.py', '.sh', '.yml', '.yaml', '.toml', '.env',
]);

const BINARY_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp3', '.ogg', '.wav',
  '.ico', '.zip', '.gz', '.pdf',
]);

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

function shouldSkipDir(dir) {
  const r = rel(dir);
  return [...SKIP_DIRS].some((skip) => r === skip || r.startsWith(`${skip}/`));
}

function walk(dir, files = []) {
  if (shouldSkipDir(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function isTextFile(file) {
  const fileRel = rel(file);
  if (SKIP_FILES.has(fileRel)) return false;

  const ext = path.extname(file).toLowerCase();
  if (BINARY_EXTS.has(ext)) return false;
  if (TEXT_EXTS.has(ext)) return true;

  const base = path.basename(file);
  return base === '.env' || base === '.gitignore' || base === 'robots.txt';
}

function isLocalizedSurface(fileRel) {
  return /^(de|en|es|fr|ja|pt)\//.test(fileRel) ||
    /^assets\/js\/i18n\/(de|en|es|fr|ja|pt)\//.test(fileRel);
}

function context(line, index) {
  const start = Math.max(0, index - 45);
  const end = Math.min(line.length, index + 80);
  return line.slice(start, end);
}

const PATTERNS = [
  { id: 'replacement-char', re: /\uFFFD/g, severity: 'high' },
  { id: 'latin1-utf8-mojibake', re: /(?:\u00C3[\u0080-\u00BF]|\u00C2[\u0080-\u00BF]|\u00E2[\u0080-\u00BF][\u0080-\u00BF]?)/g, severity: 'high' },
  { id: 'letter-question-letter', re: /[A-Za-z\u00C0-\u017F]\?[A-Za-z\u00C0-\u017F]/g, severity: 'high' },
  { id: 'double-question', re: /\?\?/g, severity: 'medium' },
  { id: 'unexpected-hangul-in-localized-surface', re: /[\uAC00-\uD7A3]/g, severity: 'info' },
];

function allowHit(fileRel, line, patternId) {
  if (patternId === 'double-question') {
    if (/\?\?=/.test(line)) return true;
    if (/\s\?\?\s/.test(line)) return true;
    if (line.includes('???')) return true;
    if (line.includes('?????')) return true;
    if (line.includes('includes(`??')) return true;
  }

  if (patternId === 'letter-question-letter') {
    if (line.includes('\x3f\x3f') || line.includes('\x3f.')) return true;
    if (/https?:\/\/\S+\?/.test(line)) return true;
  }

  if (patternId === 'unexpected-hangul-in-localized-surface') {
    if (!isLocalizedSurface(fileRel)) return true;
    if (line.includes('"alternateName": ["졸업하지 못한 교실", "네버그라드"')) return true;
    if (line.includes('<option value="/">한국어</option>')) return true;
  }

  return false;
}

function readUtf8(file) {
  const bytes = fs.readFileSync(file);
  const nulCount = bytes.reduce((count, byte) => count + (byte === 0 ? 1 : 0), 0);
  return {
    text: bytes.toString('utf8'),
    nulCount,
    size: bytes.length,
  };
}

const files = walk(ROOT).filter(isTextFile);
const hits = [];

for (const file of files) {
  const fileRel = rel(file);
  let read;
  try {
    read = readUtf8(file);
  } catch {
    continue;
  }

  if (read.size > 0 && read.nulCount / read.size > 0.05) {
    hits.push({
      severity: 'high',
      id: 'nul-bytes-in-text-file',
      file: fileRel,
      line: 1,
      text: `NUL byte ratio ${read.nulCount}/${read.size}`,
    });
    continue;
  }

  const lines = read.text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { id, re, severity } of PATTERNS) {
      re.lastIndex = 0;

      if (id === 'unexpected-hangul-in-localized-surface' && !isLocalizedSurface(fileRel)) {
        continue;
      }

      let m;
      while ((m = re.exec(line))) {
        if (allowHit(fileRel, line, id)) continue;
        hits.push({
          severity,
          id,
          file: fileRel,
          line: i + 1,
          text: context(line, m.index),
        });
        break;
      }
    }
  });
}

hits.sort((a, b) =>
  a.severity.localeCompare(b.severity) ||
  a.file.localeCompare(b.file) ||
  a.line - b.line ||
  a.id.localeCompare(b.id)
);

const byFile = new Map();
for (const hit of hits) {
  if (!byFile.has(hit.file)) byFile.set(hit.file, []);
  byFile.get(hit.file).push(hit);
}

const report = {
  scannedFiles: files.length,
  hitCount: hits.length,
  bySeverity: hits.reduce((acc, hit) => {
    acc[hit.severity] = (acc[hit.severity] || 0) + 1;
    return acc;
  }, {}),
  byId: hits.reduce((acc, hit) => {
    acc[hit.id] = (acc[hit.id] || 0) + 1;
    return acc;
  }, {}),
  files: [...byFile.entries()].map(([file, entries]) => ({
    file,
    count: entries.length,
    entries,
  })),
};

fs.writeFileSync(path.join(ROOT, OUTPUT_FILE), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
