#!/usr/bin/env node
/**
 * i18n sync checker
 * Compares ko (source) keys against en/ja/es/fr translations.
 * Reports missing keys, extra keys, and type mismatches.
 *
 * Usage: node scripts/i18n-check.js
 */

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '..', 'assets', 'js', 'i18n');
const SOURCE_LANG = 'ko';
const TARGET_LANGS = ['en', 'ja', 'es', 'fr', 'de'];

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

    console.log(`Summary: ${totalMissing} missing, ${totalExtra} extra, ${totalTypeMismatch} type mismatches, ${totalFileMissing} files missing`);

    if (totalMissing > 0 || totalFileMissing > 0 || totalTypeMismatch > 0) {
        process.exit(1);
    }
}

checkSync();
