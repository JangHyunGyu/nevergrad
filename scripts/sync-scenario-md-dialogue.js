#!/usr/bin/env node
/**
 * Synchronize SCENARIO.md's player-visible Korean dialogue/narration block
 * with the actual game source of truth:
 *   - assets/js/i18n/ko/*.json for text and choices
 *   - assets/js/scenario/speakers.js for scene speaker ids and labels
 *   - assets/js/scenario/*.js for scene ordering and structural metadata
 *
 * Usage:
 *   node scripts/sync-scenario-md-dialogue.js
 *   node scripts/sync-scenario-md-dialogue.js --check
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SCENARIO_MD = path.join(ROOT, 'SCENARIO.md');
const SCENARIO_DIR = path.join(ROOT, 'assets', 'js', 'scenario');
const KO_DIR = path.join(ROOT, 'assets', 'js', 'i18n', 'ko');
const SPEAKERS_FILE = path.join(SCENARIO_DIR, 'speakers.js');
const CONFIG_FILE = path.join(ROOT, 'assets', 'js', 'config.js');
const { speakerNames, scenarioSpeakers } = loadSpeakerMetadata();
const KO_SPEAKER_NAMES = speakerNames.ko || speakerNames.en || {};

const BEGIN_MARKER = '<!-- BEGIN NEVERGRAD KO DISPLAY SYNC -->';
const END_MARKER = '<!-- END NEVERGRAD KO DISPLAY SYNC -->';

const SLOT_LABELS = {
    morning: '아침',
    lunch: '점심',
    afterschool: '방과후',
    night: '밤'
};

function parseScenarioFileName(file) {
    const match = file.match(/^day(\d+)_(\d+)_(morning|lunch|afterschool|night)\.js$/);
    if (!match) return null;
    return {
        day: Number(match[1]),
        order: Number(match[2]),
        slot: match[3],
        json: `day${match[1]}_${match[3]}.json`
    };
}

function sortScenarioFiles(a, b) {
    const pa = parseScenarioFileName(a);
    const pb = parseScenarioFileName(b);
    if (!pa || !pb) return a.localeCompare(b);
    return pa.day - pb.day || pa.order - pb.order || a.localeCompare(b);
}

function loadScenarioFile(file) {
    const info = parseScenarioFileName(file);
    if (!info) throw new Error(`Unexpected scenario filename: ${file}`);

    const content = fs.readFileSync(path.join(SCENARIO_DIR, file), 'utf8');
    const sandbox = { SCENARIO: {} };
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox, { filename: file });

    const nodes = sandbox.SCENARIO[String(info.day)] || sandbox.SCENARIO[info.day];
    if (!nodes) throw new Error(`No SCENARIO[${info.day}] object loaded from ${file}`);
    return { ...info, file, nodes };
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function normalizeText(value) {
    return String(value ?? '').replace(/\r\n/g, '\n').trimEnd();
}

function normalizeLineEndings(value) {
    return String(value ?? '').replace(/\r\n?/g, '\n');
}

function hasContentDifference(current, next) {
    return normalizeLineEndings(current) !== normalizeLineEndings(next);
}

function quoteBlock(text) {
    return ['```text', normalizeText(text), '```'].join('\n');
}

function loadSpeakerMetadata() {
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(CONFIG_FILE, 'utf8'), sandbox, { filename: CONFIG_FILE });
    vm.runInContext(fs.readFileSync(SPEAKERS_FILE, 'utf8'), sandbox, { filename: SPEAKERS_FILE });
    return {
        speakerNames: sandbox.NEVERGRAD_SPEAKER_NAMES || {},
        scenarioSpeakers: sandbox.SCENARIO_SPEAKERS || {}
    };
}

function displaySpeaker(sceneId) {
    const speaker = normalizeText(scenarioSpeakers[sceneId]);
    if (speaker) return KO_SPEAKER_NAMES[speaker] || speaker;
    return '지문';
}

function formatMeta(scene) {
    const meta = [];
    if (scene.background) meta.push(`배경: \`${scene.background}\``);
    if (scene.bgm) meta.push(`BGM: \`${scene.bgm}\``);
    if (scene.character !== undefined && scene.character !== null) meta.push(`캐릭터: \`${scene.character}\``);
    return meta.length ? `_${meta.join(' / ')}_` : '';
}

function formatEntry(sceneId, scene, entry, sourceLabel) {
    const lines = [];
    const hasText = normalizeText(entry.text).length > 0;
    const choices = Array.isArray(entry.choices) ? entry.choices : [];

    if (!hasText && choices.length === 0) return '';

    lines.push(`### \`${sceneId}\``);
    lines.push('');
    lines.push(`_source: \`${sourceLabel}\`_`);

    const meta = formatMeta(scene || {});
    if (meta) lines.push(meta);
    lines.push('');

    if (hasText) {
        const speaker = displaySpeaker(sceneId);
        lines.push(`**${speaker}**`);
        lines.push(quoteBlock(entry.text));
        lines.push('');
    }

    if (choices.length > 0) {
        lines.push('**선택지**');
        choices.forEach((choice, index) => {
            lines.push(`${index + 1}. ${normalizeText(choice)}`);
        });
        lines.push('');
    }

    return lines.join('\n');
}

function collectI18nEntries() {
    const entries = new Map();
    const files = fs.readdirSync(KO_DIR).filter(file => file.endsWith('.json')).sort();

    for (const file of files) {
        const json = readJson(path.join(KO_DIR, file));
        for (const [sceneId, entry] of Object.entries(json)) {
            entries.set(sceneId, { file, entry });
        }
    }

    return entries;
}

function generateSection() {
    const scenarioFiles = fs.readdirSync(SCENARIO_DIR)
        .filter(file => parseScenarioFileName(file))
        .sort(sortScenarioFiles);
    const i18nEntries = collectI18nEntries();
    const consumed = new Set();
    const lines = [];
    const stats = {
        sceneFiles: scenarioFiles.length,
        scenarioScenes: 0,
        i18nEntries: i18nEntries.size,
        displayedText: 0,
        choices: 0,
        i18nOnly: 0
    };

    lines.push(BEGIN_MARKER);
    lines.push('');
    lines.push('> [!NOTE]');
    lines.push('> 이 구간은 `node scripts/sync-scenario-md-dialogue.js`로 자동 생성된다.');
    lines.push('> 기준 데이터는 `assets/js/scenario/speakers.js`의 화자 정보, `assets/js/i18n/ko/*.json`의 `text`, `choices`, `assets/js/scenario/*.js`의 씬 순서다.');
    lines.push('> 플레이어에게 실제로 표시되는 한국어 대사/지문/선택지만 이 구간의 동기화 대상이다.');
    lines.push('');

    let currentDay = null;
    for (const scenarioFile of scenarioFiles) {
        const data = loadScenarioFile(scenarioFile);
        if (currentDay !== data.day) {
            currentDay = data.day;
            lines.push(`# DAY ${data.day} — 실제 게임 대사/지문`);
            lines.push('');
        }

        lines.push(`## Day ${data.day} - ${SLOT_LABELS[data.slot]} (\`${scenarioFile}\`)`);
        lines.push('');

        for (const [sceneId, scene] of Object.entries(data.nodes)) {
            stats.scenarioScenes++;
            const found = i18nEntries.get(sceneId);
            if (!found) throw new Error(`ko i18n missing entry for scenario scene: ${sceneId} (${scenarioFile})`);
            const { file: koFile, entry } = found;

            consumed.add(sceneId);
            if (normalizeText(entry.text).length > 0) stats.displayedText++;
            if (Array.isArray(entry.choices)) stats.choices += entry.choices.length;

            const block = formatEntry(sceneId, scene, entry, `${scenarioFile} / ${koFile}`);
            if (block) {
                lines.push(block);
            }
        }
    }

    const i18nOnly = [...i18nEntries.entries()]
        .filter(([sceneId]) => !consumed.has(sceneId))
        .sort((a, b) => a[1].file.localeCompare(b[1].file) || a[0].localeCompare(b[0]));

    if (i18nOnly.length > 0) {
        stats.i18nOnly = i18nOnly.length;
        lines.push('# 추가 i18n 표시 텍스트');
        lines.push('');
        lines.push('아래 항목은 시나리오 JS 노드는 아니지만 한국어 i18n에 존재하는 보조 표시 텍스트다.');
        lines.push('');

        for (const [sceneId, { file, entry }] of i18nOnly) {
            if (normalizeText(entry.text).length > 0) stats.displayedText++;
            if (Array.isArray(entry.choices)) stats.choices += entry.choices.length;
            const block = formatEntry(sceneId, null, entry, file);
            if (block) {
                lines.push(block);
            }
        }
    }

    lines.push('<!--');
    lines.push(`sync-stats: ${JSON.stringify(stats)}`);
    lines.push('-->');
    lines.push('');
    lines.push(END_MARKER);

    return {
        section: lines.join('\n') + '\n',
        stats
    };
}

function replaceOrInsertSection(markdown, section) {
    const begin = markdown.indexOf(BEGIN_MARKER);
    const end = markdown.indexOf(END_MARKER);

    if (begin !== -1 || end !== -1) {
        if (begin === -1 || end === -1 || end < begin) {
            throw new Error('SCENARIO.md has an incomplete generated sync marker pair.');
        }
        return markdown.slice(0, begin) + section + markdown.slice(end + END_MARKER.length).replace(/^\r?\n/, '');
    }

    const dayStart = markdown.search(/^# DAY 1\b/m);
    const analysisStart = markdown.search(/^# SYSTEM ANALYSIS\b/m);
    if (dayStart === -1 || analysisStart === -1 || analysisStart <= dayStart) {
        throw new Error('Could not find the original DAY 1 to SYSTEM ANALYSIS range in SCENARIO.md.');
    }

    return markdown.slice(0, dayStart) + section + '\n' + markdown.slice(analysisStart);
}

function main() {
    const checkOnly = process.argv.includes('--check');
    const current = fs.readFileSync(SCENARIO_MD, 'utf8');
    const { section, stats } = generateSection();
    const next = replaceOrInsertSection(current, section);

    if (checkOnly) {
        if (hasContentDifference(current, next)) {
            console.error('SCENARIO.md dialogue/narration block is out of sync.');
            console.error('Run: node scripts/sync-scenario-md-dialogue.js');
            process.exit(1);
        }
        console.log(`SCENARIO.md dialogue/narration sync OK (${stats.displayedText} text entries, ${stats.choices} choices).`);
        return;
    }

    if (hasContentDifference(current, next)) {
        fs.writeFileSync(SCENARIO_MD, next, 'utf8');
        console.log(`SCENARIO.md synchronized (${stats.displayedText} text entries, ${stats.choices} choices).`);
    } else {
        console.log(`SCENARIO.md already synchronized (${stats.displayedText} text entries, ${stats.choices} choices).`);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    hasContentDifference,
    normalizeLineEndings
};
