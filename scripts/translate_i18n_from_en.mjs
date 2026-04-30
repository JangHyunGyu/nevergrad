import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'assets/js/i18n');
const EN_DIR = path.join(ROOT, 'en');
const TARGET_LANGS = ['ko', 'ja', 'es', 'fr', 'de', 'pt'];
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const LANG_CONFIG = {
  ko: {
    label: 'Korean',
    style:
      'natural Korean visual-novel prose. Use concise first-person narration, keep the tense close to the English, and make dialogue sound like native Korean students/teachers.',
    glossary:
      'Translate Sunbae/sunbae as 선배. Translate homeroom teacher as 담임 선생님 when it appears in prose. Keep Nevergrad, Project Nevergrad, S-13, and Cycle #13 as recognizable project terms.',
  },
  ja: {
    label: 'Japanese',
    style:
      'native Japanese visual-novel prose. Use 僕 for the protagonist unless the English explicitly requires otherwise, and make dialogue natural for a Japanese localization of a Korean school mystery.',
    glossary:
      'Translate Sunbae/sunbae as 先輩. Keep Korean names in katakana as provided. Keep Nevergrad, Project Nevergrad, S-13, and Cycle #13 recognizable.',
  },
  es: {
    label: 'Spanish',
    style:
      'native neutral Latin American Spanish for a visual novel. Avoid Spain-only words such as fiambrera, ordenador, coche, and vale. Keep the protagonist gender-neutral where possible and use natural dialogue.',
    glossary:
      'Keep Sunbae/sunbae as sunbae. Prefer lonchera, celular, computadora, auto, and está bien when those concepts appear. Use profesora/tutora naturally for Eunsu when the English says teacher. Keep Nevergrad, Project Nevergrad, S-13, and Cycle #13 unchanged or clearly recognizable.',
  },
  fr: {
    label: 'French',
    style:
      'native French visual-novel prose. Avoid stiff literal translation, keep suspenseful rhythm, and avoid gendering the protagonist where a natural neutral phrasing is possible.',
    glossary:
      'Keep Sunbae/sunbae as sunbae. Use professeure/principale naturally for Eunsu when the English says teacher. Keep Nevergrad, Project Nevergrad, S-13, and Cycle #13 unchanged or clearly recognizable.',
  },
  de: {
    label: 'German',
    style:
      'native German visual-novel prose. Use natural, tense suspense prose and avoid calques. Keep the protagonist gender-neutral where practical.',
    glossary:
      'Keep Sunbae/sunbae as Sunbae. Use Lehrerin/Klassenlehrerin naturally for Eunsu when the English says teacher. Keep Nevergrad, Project Nevergrad, S-13, and Cycle #13 unchanged or clearly recognizable.',
  },
  pt: {
    label: 'Brazilian Portuguese',
    style:
      'native Brazilian Portuguese for a visual novel. Avoid Portugal phrasing and literal English. Keep the protagonist gender-neutral where possible and make dialogue idiomatic.',
    glossary:
      'Keep Sunbae/sunbae as sunbae. Use professora/professora titular naturally for Eunsu when the English says teacher. Keep Nevergrad, Project Nevergrad, S-13, and Cycle #13 unchanged or clearly recognizable.',
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { langs: TARGET_LANGS, files: null, force: false, retries: 3 };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--langs') parsed.langs = args[++i].split(',').map((x) => x.trim()).filter(Boolean);
    else if (arg === '--files') parsed.files = args[++i].split(',').map((x) => x.trim()).filter(Boolean);
    else if (arg === '--force') parsed.force = true;
    else if (arg === '--retries') parsed.retries = Number(args[++i]);
    else if (arg === '--model') process.env.GEMINI_MODEL = args[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return parsed;
}

async function readApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = path.resolve(process.cwd(), '.env');
  const envText = await fs.readFile(envPath, 'utf8').catch(() => '');
  const match = envText.match(/^GEMINI_API_KEY=(.+)$/m);
  if (!match) throw new Error('GEMINI_API_KEY is missing from environment and .env');
  return match[1].trim();
}

async function listEnglishFiles(filesArg) {
  if (filesArg) return filesArg.map((file) => (file.endsWith('.json') ? file : `${file}.json`));
  const entries = await fs.readdir(EN_DIR);
  return entries.filter((file) => /^day\d+_(morning|lunch|afterschool|night)\.json$/.test(file)).sort();
}

function buildPrompt(lang, file, source) {
  const config = LANG_CONFIG[lang];
  const sourceForModel = {};
  for (const [key, entry] of Object.entries(source)) {
    sourceForModel[key] = {};
    sourceForModel[key].text = entry.text ?? '';
    if (Array.isArray(entry.choices)) sourceForModel[key].choices = entry.choices;
  }

  return `You are localizing a Korean school mystery visual novel from English into ${config.label}.

Target style: ${config.style}
Glossary and constraints: ${config.glossary}

Rules:
- Output only a single valid JSON object. No Markdown, no comments.
- Preserve every top-level key exactly.
- Preserve every entry shape: "text", and "choices" only when choices exist in the source.
- Translate "text" and each item in "choices" into ${config.label}.
- Keep placeholders such as {name}, markdown markers like **...**, surrounding visual-novel italics *...*, escaped quotes, and line breaks.
- Keep empty strings empty.
- Do not add, remove, reorder, summarize, censor, soften, or intensify story events.
- Make it read as native ${config.label}, not literal English.

File: ${file}
Source JSON:
${JSON.stringify(sourceForModel)}`;
}

function extractJson(text) {
  let cleaned = text.trim();
  const fence = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) cleaned = fence[1].trim();
  return JSON.parse(cleaned);
}

function normalizeTranslated(lang, source, translated) {
  const sourceKeys = Object.keys(source);
  const translatedKeys = Object.keys(translated);
  const missing = sourceKeys.filter((key) => !Object.prototype.hasOwnProperty.call(translated, key));
  const extra = translatedKeys.filter((key) => !Object.prototype.hasOwnProperty.call(source, key));
  if (missing.length || extra.length) {
    throw new Error(`key mismatch: missing=${missing.slice(0, 5).join(',')} extra=${extra.slice(0, 5).join(',')}`);
  }

  const result = {};
  for (const key of sourceKeys) {
    const src = source[key] ?? {};
    const tr = translated[key] ?? {};
    if (typeof tr !== 'object' || Array.isArray(tr)) throw new Error(`entry ${key} is not an object`);

    const out = {};
    out.text = src.text === '' ? '' : String(tr.text ?? '');

    if (Array.isArray(src.choices)) {
      if (!Array.isArray(tr.choices)) throw new Error(`entry ${key} choices missing`);
      if (tr.choices.length !== src.choices.length) throw new Error(`entry ${key} choices length mismatch`);
      out.choices = src.choices.map((choice, index) => (choice === '' ? '' : String(tr.choices[index] ?? '')));
    }

    result[key] = out;
  }
  return result;
}

async function callGemini(apiKey, prompt) {
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180000);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal: controller.signal,
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.25,
        topP: 0.9,
        responseMimeType: 'application/json',
        maxOutputTokens: 65536,
      },
    }),
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini HTTP ${response.status}: ${body.slice(0, 500)}`);
  }

  const json = await response.json();
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((part) => part.text ?? '').join('');
  if (!text.trim()) throw new Error(`Gemini returned no text: ${JSON.stringify(json).slice(0, 500)}`);
  return text;
}

async function translateFile(apiKey, lang, file, retries) {
  const sourcePath = path.join(EN_DIR, file);
  const targetPath = path.join(ROOT, lang, file);
  const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
  const prompt = buildPrompt(lang, file, source);

  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const raw = await callGemini(apiKey, prompt);
      const translated = extractJson(raw);
      const normalized = normalizeTranslated(lang, source, translated);
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, `${JSON.stringify(normalized, null, 4)}\n`, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      console.error(`[retry ${attempt}/${retries}] ${lang}/${file}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
    }
  }
  throw lastError;
}

async function main() {
  const args = parseArgs();
  const badLang = args.langs.find((lang) => !LANG_CONFIG[lang]);
  if (badLang) throw new Error(`Unsupported language: ${badLang}`);

  const apiKey = await readApiKey();
  const files = await listEnglishFiles(args.files);
  console.log(`model=${process.env.GEMINI_MODEL || DEFAULT_MODEL}`);
  console.log(`langs=${args.langs.join(',')} files=${files.length}`);

  for (const lang of args.langs) {
    for (const file of files) {
      const started = Date.now();
      process.stdout.write(`[start] ${lang}/${file}\n`);
      await translateFile(apiKey, lang, file, args.retries);
      const seconds = ((Date.now() - started) / 1000).toFixed(1);
      process.stdout.write(`[done]  ${lang}/${file} ${seconds}s\n`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
