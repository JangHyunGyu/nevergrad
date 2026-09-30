#!/usr/bin/env node
/**
 * i18n sync checker
 * Compares ko (source) keys against en/ja/es/fr/de/pt translations.
 * Reports missing keys, extra keys, and type mismatches.
 *
 * Usage: node scripts/i18n-check.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const I18N_DIR = path.join(__dirname, '..', 'assets', 'js', 'i18n');
const SOURCE_LANG = 'ko';
const TARGET_LANGS = ['en', 'ja', 'es', 'fr', 'de', 'pt'];

function getJsonFiles(langDir) {
    if (!fs.existsSync(langDir)) return [];
    return fs.readdirSync(langDir).filter(f => f.endsWith('.json')).sort();
}

function loadJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        return null;
    }
}

const ROOT = path.join(__dirname, '..');
const SCENARIO_DIR = path.join(ROOT, 'assets', 'js', 'scenario');

// Runtime i18n PACK (scenario/causality_i18n_overlays.js) injects text for scenes
// that only exist in overlays. Parse it so overlay-only scenes are checked too.
function loadRuntimePack() {
    const file = path.join(SCENARIO_DIR, 'causality_i18n_overlays.js');
    if (!fs.existsSync(file)) return {};
    const m = fs.readFileSync(file, 'utf-8').match(/var PACK = (\{.*\});\s*\n/);
    if (!m) return {};
    try { return JSON.parse(m[1]); } catch (e) { return {}; }
}

// Scene ids defined by base scenario files + scenario overlays.
function loadScenarioSceneIds() {
    const SCENARIO = {};
    for (let i = 0; i <= 5; i++) SCENARIO[i] = {};
    const files = fs.readdirSync(SCENARIO_DIR)
        .filter(f => /^day\d/.test(f) && f.endsWith('.js')).sort();
    const overlays = ['causality_overlays.js'];
    for (const file of files.concat(overlays)) {
        const fp = path.join(SCENARIO_DIR, file);
        if (!fs.existsSync(fp)) continue;
        try {
            const sandbox = { SCENARIO, Object, console, window: {}, document: {} };
            vm.runInNewContext(fs.readFileSync(fp, 'utf-8'), sandbox, { filename: file });
        } catch (e) {
            // base files are validated by validate.js; here we only need best-effort ids
        }
    }
    const ids = new Set();
    for (const day of Object.keys(SCENARIO)) {
        for (const id of Object.keys(SCENARIO[day])) ids.add(id);
    }
    return ids;
}

// Mojibake / lost-character heuristics.
function mojibakeProblems(lang, text) {
    const out = [];
    if (typeof text !== 'string') return out;
    if (/\uFFFD/.test(text)) out.push('U+FFFD replacement character');
    if (/\?{3,}/.test(text)) out.push('run of "?" (lost non-ASCII text)');
    // a "?" glued between letters ("Wie? hei?t", "C?mo") is a lost accent, not punctuation
    if (/[A-Za-z\u00C0-\u024F]\?[A-Za-z\u00C0-\u024F]/.test(text)) out.push('"?" inside a word (lost accent)');
    if (lang === 'ja' && /\?/.test(text) && !/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)) {
        out.push('ja text with "?" and no Japanese characters');
    }
    return out;
}

function placeholderSet(text) {
    const set = new Set();
    const walk = (v) => {
        if (typeof v === 'string') {
            for (const m of v.matchAll(/\{[A-Za-z0-9_?]+\}/g)) set.add(m[0]);
        } else if (Array.isArray(v)) v.forEach(walk);
        else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(text);
    return set;
}

function checkSync() {
    const sourceDir = path.join(I18N_DIR, SOURCE_LANG);
    const sourceFiles = getJsonFiles(sourceDir);

    let totalMissing = 0;
    let totalExtra = 0;
    let totalTypeMismatch = 0;
    let totalFileMissing = 0;
    const issues = [];

    for (const file of sourceFiles) {
        const sourceData = loadJson(path.join(sourceDir, file));
        if (!sourceData) {
            issues.push(`  [ERROR] ${SOURCE_LANG}/${file} - invalid JSON`);
            continue;
        }
        const sourceKeys = Object.keys(sourceData);

        for (const lang of TARGET_LANGS) {
            const targetPath = path.join(I18N_DIR, lang, file);

            if (!fs.existsSync(targetPath)) {
                issues.push(`  [FILE MISSING] ${lang}/${file}`);
                totalFileMissing++;
                continue;
            }

            const targetData = loadJson(targetPath);
            if (!targetData) {
                issues.push(`  [ERROR] ${lang}/${file} - invalid JSON`);
                continue;
            }

            const targetKeys = Object.keys(targetData);
            const missingKeys = sourceKeys.filter(k => !(k in targetData));
            const extraKeys = targetKeys.filter(k => !(k in sourceData));

            // Check type mismatches (string vs object vs boolean)
            const typeMismatches = sourceKeys.filter(k => {
                if (!(k in targetData)) return false;
                const sType = typeof sourceData[k];
                const tType = typeof targetData[k];
                return sType !== tType;
            });

            if (missingKeys.length > 0) {
                issues.push(`  [MISSING] ${lang}/${file}: ${missingKeys.join(', ')}`);
                totalMissing += missingKeys.length;
            }
            if (extraKeys.length > 0) {
                issues.push(`  [EXTRA]   ${lang}/${file}: ${extraKeys.join(', ')}`);
                totalExtra += extraKeys.length;
            }
            if (typeMismatches.length > 0) {
                for (const k of typeMismatches) {
                    issues.push(`  [TYPE]    ${lang}/${file}: ${k} (${SOURCE_LANG}=${typeof sourceData[k]}, ${lang}=${typeof targetData[k]})`);
                }
                totalTypeMismatch += typeMismatches.length;
            }
        }
    }

    // ---- Overlay scene coverage + mojibake + placeholder checks ----
    const pack = loadRuntimePack();
    const sceneIds = loadScenarioSceneIds();
    const sourceIdSet = new Set();
    const langData = {};
    for (const lang of [SOURCE_LANG].concat(TARGET_LANGS)) {
        langData[lang] = {};
        for (const file of getJsonFiles(path.join(I18N_DIR, lang))) {
            const data = loadJson(path.join(I18N_DIR, lang, file));
            if (data) Object.assign(langData[lang], data);
        }
    }
    Object.keys(langData[SOURCE_LANG]).forEach(k => sourceIdSet.add(k));
    const packHas = (lang, id) => Object.values(pack[lang] || {}).some(day => day && day[id]);
    let totalOverlayMissing = 0;
    let totalMojibake = 0;
    let totalPlaceholderWarn = 0;
    const warnings = [];

    // Scenes that exist in the scenario graph must have text in EVERY language,
    // either in i18n JSON or in the runtime PACK (overlay-only scenes).
    for (const id of sceneIds) {
        if (!/^day\d/.test(id)) continue;
        for (const lang of [SOURCE_LANG].concat(TARGET_LANGS)) {
            if (id in langData[lang] || packHas(lang, id)) continue;
            // day*_night_end style boundary ids are resolved via changeDay and have no text
            if (!sourceIdSet.has(id) && !Object.keys(pack).some(l => packHas(l, id))) continue;
            issues.push(`  [OVERLAY MISSING] ${lang}: scene "${id}" has no text (i18n JSON or PACK)`);
            totalOverlayMissing++;
        }
    }

    for (const lang of [SOURCE_LANG].concat(TARGET_LANGS)) {
        const entries = Object.entries(langData[lang]);
        for (const [id, entry] of entries) {
            const texts = [entry && entry.text].concat((entry && entry.choices) || []);
            for (const t of texts) {
                for (const why of mojibakeProblems(lang, t)) {
                    issues.push(`  [MOJIBAKE] ${lang}: ${id} - ${why}: ${String(t).slice(0, 60)}`);
                    totalMojibake++;
                }
            }
        }
        for (const dayKey of Object.keys(pack[lang] || {})) {
            for (const [id, entry] of Object.entries(pack[lang][dayKey])) {
                const texts = [entry && entry.text].concat((entry && entry.choices) || []);
                for (const t of texts) {
                    for (const why of mojibakeProblems(lang, t)) {
                        issues.push(`  [MOJIBAKE] ${lang}: PACK ${id} - ${why}: ${String(t).slice(0, 60)}`);
                        totalMojibake++;
                    }
                }
            }
        }
    }

    // Placeholder parity vs ko is reported as a warning (translation may legitimately add {name}).
    for (const lang of TARGET_LANGS) {
        for (const [id, entry] of Object.entries(langData[lang])) {
            const src = langData[SOURCE_LANG][id];
            if (!src) continue;
            const a = placeholderSet(src);
            const b = placeholderSet(entry);
            const diff = [...b].filter(x => !a.has(x)).concat([...a].filter(x => !b.has(x)));
            if (diff.length) {
                warnings.push(`  [PLACEHOLDER] ${lang}: ${id} differs from ko: ${diff.join(', ')}`);
                totalPlaceholderWarn++;
            }
        }
    }

    // Summary
    console.log(`\ni18n Sync Check (source: ${SOURCE_LANG})`);
    console.log(`${'='.repeat(50)}`);
    console.log(`Source files: ${sourceFiles.length}`);
    console.log(`Target languages: ${TARGET_LANGS.join(', ')}`);
    console.log(`${'='.repeat(50)}`);

    if (issues.length === 0) {
        console.log('\n  All translations are in sync!\n');
    } else {
        console.log('');
        for (const issue of issues) {
            console.log(issue);
        }
        console.log('');
    }

    if (warnings.length && process.argv.includes('--warnings')) {
        for (const w of warnings) console.log(w);
        console.log('');
    }

    console.log(`Summary: ${totalMissing} missing, ${totalExtra} extra, ${totalTypeMismatch} type mismatches, ${totalFileMissing} files missing, ${totalOverlayMissing} overlay scenes missing, ${totalMojibake} mojibake, ${totalPlaceholderWarn} placeholder warnings (use --warnings to list)`);

    if (totalMissing > 0 || totalFileMissing > 0 || totalTypeMismatch > 0 || totalOverlayMissing > 0 || totalMojibake > 0) {
        process.exit(1);
    }
}

checkSync();
