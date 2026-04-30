#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const I18N_DIR = path.join(ROOT, 'assets', 'js', 'i18n');
const OUTPUT = path.join(ROOT, 'tmp', 'i18n_text_integrity_audit.json');
const LANGS = ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt'];

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

function walkJson(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(full, files);
    else if (ent.name.endsWith('.json')) files.push(full);
  }
  return files;
}

function preview(value) {
  const oneLine = String(value).replace(/\s+/g, ' ').trim();
  return oneLine.length > 180 ? `${oneLine.slice(0, 177)}...` : oneLine;
}

function pushHit(hits, hit) {
  hits.push({
    severity: hit.severity,
    id: hit.id,
    file: rel(hit.file),
    key: hit.key || null,
    field: hit.field || null,
    value: preview(hit.value || ''),
  });
}

function collectStrings(value, pathParts = [], out = []) {
  if (typeof value === 'string') {
    out.push({ field: pathParts.join('.'), value });
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => collectStrings(item, [...pathParts, `[${i}]`], out));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, [...pathParts, key], out));
  }
  return out;
}

const checks = [
  {
    id: 'replacement-char',
    severity: 'high',
    test: (value) => /\uFFFD/.test(value),
  },
  {
    id: 'unresolved-protection-token',
    severity: 'high',
    test: (value) => /XPTOKEN\d+X/.test(value),
  },
  {
    id: 'latin1-utf8-mojibake',
    severity: 'high',
    test: (value) => /(?:Ã[\u0080-\u00BF\u00C0-\u00FF]|Â[\u0080-\u00BF\u00A0-\u00BF]|â[€™€œ€œ–—])/.test(value),
  },
  {
    id: 'cjk-mojibake-in-korean',
    severity: 'high',
    test: (value, lang) => lang === 'ko' && /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/.test(value),
  },
  {
    id: 'unexpected-east-asian-script-in-latin-language',
    severity: 'high',
    test: (value, lang) => ['en', 'es', 'fr', 'de', 'pt'].includes(lang) &&
      /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7A3\uF900-\uFAFF]/.test(value),
  },
  {
    id: 'unexpected-hangul-in-japanese',
    severity: 'high',
    test: (value, lang) => lang === 'ja' && /[\uAC00-\uD7A3]/.test(value),
  },
  {
    id: 'control-char',
    severity: 'high',
    test: (value) => /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value),
  },
];

const files = LANGS.flatMap((lang) => {
  const dir = path.join(I18N_DIR, lang);
  return fs.existsSync(dir) ? walkJson(dir) : [];
}).sort();

const hits = [];
const parseErrors = [];
const byLang = {};

for (const file of files) {
  const lang = path.basename(path.dirname(file));
  byLang[lang] = (byLang[lang] || 0) + 1;

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    parseErrors.push({ file: rel(file), error: err.message });
    pushHit(hits, {
      severity: 'high',
      id: 'json-parse-error',
      file,
      value: err.message,
    });
    continue;
  }

  for (const [key, entry] of Object.entries(parsed)) {
    for (const { field, value } of collectStrings(entry)) {
      for (const check of checks) {
        if (check.test(value, lang)) {
          pushHit(hits, { severity: check.severity, id: check.id, file, key, field, value });
        }
      }
    }
  }
}

hits.sort((a, b) =>
  a.severity.localeCompare(b.severity) ||
  a.id.localeCompare(b.id) ||
  a.file.localeCompare(b.file) ||
  String(a.key).localeCompare(String(b.key)) ||
  String(a.field).localeCompare(String(b.field))
);

const byId = hits.reduce((acc, hit) => {
  acc[hit.id] = (acc[hit.id] || 0) + 1;
  return acc;
}, {});

const byFile = hits.reduce((acc, hit) => {
  acc[hit.file] = (acc[hit.file] || 0) + 1;
  return acc;
}, {});

const report = {
  scope: 'assets/js/i18n/{ko,en,ja,es,fr,de,pt}/*.json',
  scannedFiles: files.length,
  byLang,
  parseErrorCount: parseErrors.length,
  hitCount: hits.length,
  byId,
  byFile,
  hits,
};

fs.writeFileSync(OUTPUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  output: rel(OUTPUT),
  scannedFiles: report.scannedFiles,
  parseErrorCount: report.parseErrorCount,
  hitCount: report.hitCount,
  byId: report.byId,
  byFile: report.byFile,
}, null, 2));
