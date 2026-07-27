import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'assets/js/i18n');
const SOURCE_LANG = 'ko';
const SOURCE_DIR = path.join(ROOT, SOURCE_LANG);
const TARGET_LANGS = ['en', 'ja', 'es', 'fr', 'de', 'pt'];
const DEFAULT_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';

const LANG_CONFIG = {
  en: {
    label: 'English',
    style:
      'native English visual-novel prose. Keep the Korean source tone: concise, tense, and not overexplained. Dialogue should sound natural in an English localization of a Korean school mystery.',
    glossary:
      'Use Sea, Eunsu, Riin, Yuna, Seolhwa, and Minsu for names. Translate 선배 as sunbae when Yuna directly addresses the protagonist, and as senior only for a generic upperclassman. Use Ms. Eunsu/Ms. Riin naturally for teachers. Keep Nevergrad, Project Nevergrad, S-13, M-13, Trial #13, and Cycle #13 recognizable.',
  },
  ja: {
    label: 'Japanese',
    style:
      'native Japanese visual-novel prose. Keep the Korean source tone: concise, tense, and not overexplained. Dialogue should sound natural for a Japanese localization of a Korean school mystery.',
    glossary:
      'Use セア, ウンス, リイン, ユナ, ソルファ, and ミンス for names unless a full Korean name is required. Translate 선배 as 先輩. Use 先生 naturally for teachers. Keep Nevergrad, Project Nevergrad, S-13, M-13, Trial #13, and Cycle #13 recognizable.',
  },
  es: {
    label: 'Spanish',
    style:
      'native neutral Latin American Spanish for a visual novel. Avoid Spain-only words such as fiambrera, ordenador, coche, and vale. Keep the Korean source tone concise and avoid overexplaining.',
    glossary:
      'Use Sea, Eunsu, Riin, Yuna, Seolhwa, and Minsu for names. Keep 선배 as sunbae. Prefer lonchera, celular, computadora, auto, and está bien when those concepts appear. Use profesora/tutora naturally for Eunsu. Keep Nevergrad, Project Nevergrad, S-13, M-13, Trial #13, and Cycle #13 unchanged or clearly recognizable.',
  },
  fr: {
    label: 'French',
    style:
      'native French visual-novel prose. Avoid stiff literal translation, keep suspenseful rhythm, and avoid gendering the protagonist where a natural neutral phrasing is possible. Keep the Korean source tone concise.',
    glossary:
      'Use Sea, Eunsu, Riin, Yuna, Seolhwa, and Minsu for names. Keep 선배 as sunbae. Use professeure/principale naturally for Eunsu. Keep Nevergrad, Project Nevergrad, S-13, M-13, Trial #13, and Cycle #13 unchanged or clearly recognizable.',
  },
  de: {
    label: 'German',
    style:
      'native German visual-novel prose. Use natural, tense suspense prose and avoid calques. Keep the protagonist gender-neutral where practical. Keep the Korean source tone concise.',
    glossary:
      'Use Sea, Eunsu, Riin, Yuna, Seolhwa, and Minsu for names. Keep 선배 as Sunbae. Use Lehrerin/Klassenlehrerin naturally for Eunsu. Keep Nevergrad, Project Nevergrad, S-13, M-13, Trial #13, and Cycle #13 unchanged or clearly recognizable.',
  },
  pt: {
    label: 'Brazilian Portuguese',
    style:
      'native Brazilian Portuguese for a visual novel. Avoid Portugal phrasing and literal translation. Keep the protagonist gender-neutral where possible, and keep the Korean source tone concise.',
    glossary:
      'Use Sea, Eunsu, Riin, Yuna, Seolhwa, and Minsu for names. Keep 선배 as sunbae. Use professora/professora titular naturally for Eunsu. Keep Nevergrad, Project Nevergrad, S-13, M-13, Trial #13, and Cycle #13 unchanged or clearly recognizable.',
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
    else if (arg === '--model') process.env.DEEPSEEK_MODEL = args[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isInteger(parsed.retries) || parsed.retries < 1) {
    throw new Error('--retries must be a positive integer');
  }

  return parsed;
}

async function readApiKey() {
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY;
  const envPath = path.resolve(process.cwd(), '.env');
  const envText = await fs.readFile(envPath, 'utf8').catch(() => '');
  const match = envText.match(/^DEEPSEEK_API_KEY=(.+)$/m);
  if (!match) throw new Error('DEEPSEEK_API_KEY is missing from environment and .env');
  return match[1].trim().replace(/^["']|["']$/g, '');
}

async function listSourceFiles(filesArg) {
  if (filesArg) return filesArg.map((file) => (file.endsWith('.json') ? file : `${file}.json`));
  const entries = await fs.readdir(SOURCE_DIR);
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

  return `You are localizing a Korean school mystery visual novel from Korean into ${config.label}.

The Korean source JSON is canonical. Ignore any existing target translation.

Target style: ${config.style}
Glossary and constraints: ${config.glossary}

Rules:
- Output only a single valid JSON object. No Markdown, no comments.
- Preserve every top-level key exactly.
- Preserve every entry shape: "text", and "choices" only when choices exist in the source.
- Translate "text" and each item in "choices" into ${config.label}.
- Keep placeholders such as {name}, markdown markers like **...**, surrounding visual-novel italics *...*, escaped quotes, and line breaks.
- Keep empty strings empty.
- Do not add, remove, reorder, summarize, censor, soften, intensify, or explain story events.
- Make it read as native ${config.label}, not literal Korean.

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

function placeholders(text) {
  return text.match(/\{[A-Za-z0-9_]+\}/g) ?? [];
}

function assertStringPreserved(sourceText, translatedText, label) {
  if (sourceText === '' && translatedText !== '') throw new Error(`${label} should stay empty`);

  for (const placeholder of placeholders(sourceText)) {
    if (!translatedText.includes(placeholder)) {
      throw new Error(`${label} missing placeholder ${placeholder}`);
    }
  }

  const sourceBackticks = (sourceText.match(/`/g) ?? []).length;
  const translatedBackticks = (translatedText.match(/`/g) ?? []).length;
  if (sourceBackticks !== translatedBackticks) {
    throw new Error(`${label} backtick count mismatch`);
  }

  const wrapper = sourceText.match(/^(\*{1,3})[\s\S]*(\*{1,3})$/);
  if (wrapper && wrapper[1] === wrapper[2]) {
    const marker = wrapper[1];
    if (!translatedText.startsWith(marker) || !translatedText.endsWith(marker)) {
      throw new Error(`${label} markdown wrapper mismatch`);
    }
  }
}

function normalizeTranslated(lang, source, translated, file) {
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

    const sourceText = String(src.text ?? '');
    const out = { text: sourceText === '' ? '' : String(tr.text ?? '') };
    assertStringPreserved(sourceText, out.text, `${lang}/${file}:${key}.text`);

    if (Array.isArray(src.choices)) {
      if (!Array.isArray(tr.choices)) throw new Error(`entry ${key} choices missing`);
      if (tr.choices.length !== src.choices.length) throw new Error(`entry ${key} choices length mismatch`);
      out.choices = src.choices.map((choice, index) => {
        const sourceChoice = String(choice ?? '');
        const translatedChoice = sourceChoice === '' ? '' : String(tr.choices[index] ?? '');
        assertStringPreserved(sourceChoice, translatedChoice, `${lang}/${file}:${key}.choices[${index}]`);
        return translatedChoice;
      });
    }

    result[key] = out;
  }
  return result;
}

async function callDeepSeek(apiKey, prompt) {
  const model = process.env.DEEPSEEK_MODEL || DEFAULT_MODEL;
  const url = 'https://api.deepseek.com/chat/completions';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180000);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    signal: controller.signal,
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      thinking: { type: 'disabled' },
      temperature: 0.25,
      top_p: 0.9,
      response_format: { type: 'json_object' },
      max_tokens: 32768,
    }),
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 500)}`);
  }

  const json = await response.json();
  const text = json.choices?.[0]?.message?.content || '';
  if (!text.trim()) throw new Error(`DeepSeek returned no text: ${JSON.stringify(json).slice(0, 500)}`);
  return text;
}

async function translateFile(apiKey, lang, file, retries) {
  const sourcePath = path.join(SOURCE_DIR, file);
  const targetPath = path.join(ROOT, lang, file);
  const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
  const prompt = buildPrompt(lang, file, source);

  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const raw = await callDeepSeek(apiKey, prompt);
      const translated = extractJson(raw);
      const normalized = normalizeTranslated(lang, source, translated, file);
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, `${JSON.stringify(normalized, null, 4)}\n`, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      console.error(`[retry ${attempt}/${retries}] ${SOURCE_LANG}->${lang}/${file}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
    }
  }
  throw lastError;
}

async function main() {
  const args = parseArgs();
  const badLang = args.langs.find((lang) => !LANG_CONFIG[lang]);
  if (badLang) throw new Error(`Unsupported language: ${badLang}`);
  if (args.langs.includes(SOURCE_LANG)) throw new Error(`Target languages must not include source language: ${SOURCE_LANG}`);

  const apiKey = await readApiKey();
  const files = await listSourceFiles(args.files);
  console.log(`model=${process.env.DEEPSEEK_MODEL || DEFAULT_MODEL}`);
  console.log(`source=${SOURCE_LANG} langs=${args.langs.join(',')} files=${files.length}`);

  for (const lang of args.langs) {
    for (const file of files) {
      const started = Date.now();
      process.stdout.write(`[start] ${SOURCE_LANG}->${lang}/${file}\n`);
      await translateFile(apiKey, lang, file, args.retries);
      const seconds = ((Date.now() - started) / 1000).toFixed(1);
      process.stdout.write(`[done]  ${SOURCE_LANG}->${lang}/${file} ${seconds}s\n`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
