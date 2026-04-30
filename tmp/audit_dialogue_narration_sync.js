const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const scenarioMdPath = path.join(root, 'SCENARIO.md');
const scenarioDir = path.join(root, 'assets', 'js', 'scenario');
const koDir = path.join(root, 'assets', 'js', 'i18n', 'ko');
const speakersPath = path.join(scenarioDir, 'speakers.js');
const outJsonPath = path.join(__dirname, 'dialogue_narration_scene_compare.json');
const outMdPath = path.join(__dirname, 'dialogue_narration_scene_compare.md');

const beginMarker = '<!-- BEGIN NEVERGRAD KO DISPLAY SYNC -->';
const endMarker = '<!-- END NEVERGRAD KO DISPLAY SYNC -->';

const slotNames = {
  morning: '아침',
  lunch: '점심',
  afterschool: '방과후',
  night: '밤',
};

const { koSpeakerNames, scenarioSpeakers } = loadSpeakerMetadata();

function parseScenarioFile(file) {
  const match = file.match(/^day(\d+)_(\d+)_(morning|lunch|afterschool|night)\.js$/);
  if (!match) return null;
  return {
    day: Number(match[1]),
    order: Number(match[2]),
    slot: match[3],
    koFile: `day${match[1]}_${match[3]}.json`,
  };
}

function sortScenarioFiles(a, b) {
  const pa = parseScenarioFile(a);
  const pb = parseScenarioFile(b);
  if (!pa || !pb) return a.localeCompare(b);
  return pa.day - pb.day || pa.order - pb.order || a.localeCompare(b);
}

function normalize(value) {
  return String(value ?? '').replace(/\r\n/g, '\n').trimEnd();
}

function loadSpeakerMetadata() {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(speakersPath, 'utf8'), sandbox, { filename: speakersPath });
  const speakerNames = sandbox.NEVERGRAD_SPEAKER_NAMES || {};
  return {
    koSpeakerNames: speakerNames.ko || speakerNames.en || {},
    scenarioSpeakers: sandbox.SCENARIO_SPEAKERS || {},
  };
}

function displaySpeaker(sceneId) {
  const speaker = normalize(scenarioSpeakers[sceneId]);
  if (speaker) return koSpeakerNames[speaker] || speaker;
  return '';
}

function countLeadingAsterisks(text) {
  let count = 0;
  while (text[count] === '*') count++;
  return count;
}

function countTrailingAsterisks(text) {
  let count = 0;
  while (text[text.length - 1 - count] === '*') count++;
  return count;
}

function isNarration(text) {
  const value = normalize(text);
  if (!value) return false;
  const lead = countLeadingAsterisks(value);
  const trail = countTrailingAsterisks(value);
  return lead > 0 && trail > 0 && lead % 2 === 1 && trail % 2 === 1;
}

function preview(text, limit = 64) {
  const value = normalize(text).replace(/\s+/g, ' ');
  return value.length > limit ? `${value.slice(0, limit - 1)}...` : value;
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\n/).length;
}

function escapeTable(value) {
  return String(value ?? '')
    .replace(/\r?\n/g, '<br>')
    .replace(/\|/g, '\\|');
}

function loadScenarioNodes(file) {
  const info = parseScenarioFile(file);
  const sandbox = { SCENARIO: {} };
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(scenarioDir, file), 'utf8'),
    sandbox,
    { filename: file },
  );
  const nodes = sandbox.SCENARIO[String(info.day)] || sandbox.SCENARIO[info.day];
  if (!nodes) throw new Error(`Missing SCENARIO[${info.day}] in ${file}`);
  return { ...info, file, nodes };
}

function loadKoEntries() {
  const entries = new Map();
  const duplicates = [];
  const files = fs.readdirSync(koDir).filter((file) => file.endsWith('.json')).sort();

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(koDir, file), 'utf8'));
    for (const [sceneId, entry] of Object.entries(data)) {
      if (entries.has(sceneId)) {
        duplicates.push({ sceneId, first: entries.get(sceneId).file, second: file });
      }
      entries.set(sceneId, { file, entry });
    }
  }

  return { entries, duplicates };
}

function parseMdEntries() {
  const markdown = fs.readFileSync(scenarioMdPath, 'utf8');
  const begin = markdown.indexOf(beginMarker);
  const end = markdown.indexOf(endMarker);
  if (begin < 0 || end < 0 || end <= begin) {
    throw new Error('SCENARIO.md generated sync markers are missing or invalid.');
  }

  const section = markdown.slice(begin, end + endMarker.length);
  const sectionStartLine = lineOf(markdown, begin);
  const headingPattern = /^### `([^`]+)`$/gm;
  const headings = [];

  for (let match; (match = headingPattern.exec(section));) {
    headings.push({
      sceneId: match[1],
      index: match.index,
      line: sectionStartLine + lineOf(section, match.index) - 1,
    });
  }

  const entries = new Map();
  const duplicates = [];

  for (let index = 0; index < headings.length; index++) {
    const heading = headings[index];
    const block = section.slice(
      heading.index,
      index + 1 < headings.length ? headings[index + 1].index : section.length,
    );

    const source = (block.match(/^_source: `([^`]+)`_$/m) || [])[1] || '';
    const textMatch = block.match(/```text\n([\s\S]*?)\n```/);
    let speaker = '';
    let text = '';

    if (textMatch) {
      text = textMatch[1].replace(/\r\n/g, '\n');
      const beforeText = block.slice(0, textMatch.index).trimEnd().split(/\n/);
      const speakerLine = beforeText[beforeText.length - 1] || '';
      const speakerMatch = speakerLine.match(/^\*\*(.*)\*\*$/);
      speaker = speakerMatch ? speakerMatch[1] : '';
    }

    const blockWithoutText = block.replace(/```text\n[\s\S]*?\n```/g, '');
    const choices = [];
    const choicePattern = /^\d+\. (.*)$/gm;
    for (let match; (match = choicePattern.exec(blockWithoutText));) {
      choices.push(match[1].replace(/\r\n/g, '\n'));
    }

    if (entries.has(heading.sceneId)) {
      duplicates.push({
        sceneId: heading.sceneId,
        firstLine: entries.get(heading.sceneId).line,
        secondLine: heading.line,
      });
    }

    entries.set(heading.sceneId, {
      sceneId: heading.sceneId,
      source,
      speaker,
      text,
      choices,
      line: heading.line,
    });
  }

  return { entries, duplicates, lines: { begin: sectionStartLine, end: sectionStartLine + section.split(/\n/).length - 1 } };
}

function sameArray(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function compare() {
  const { entries: koEntries, duplicates: duplicateKoKeys } = loadKoEntries();
  const { entries: mdEntries, duplicates: duplicateMdEntries, lines: syncLines } = parseMdEntries();
  const scenarioFiles = fs.readdirSync(scenarioDir)
    .filter((file) => parseScenarioFile(file))
    .sort(sortScenarioFiles);

  const records = [];
  const consumed = new Set();
  const duplicateScenarioIds = [];
  const seenScenarioIds = new Set();
  let silentSceneCount = 0;

  for (const scenarioFile of scenarioFiles) {
    const info = loadScenarioNodes(scenarioFile);
    for (const [sceneId] of Object.entries(info.nodes)) {
      if (seenScenarioIds.has(sceneId)) duplicateScenarioIds.push({ sceneId, scenarioFile });
      seenScenarioIds.add(sceneId);

      const ko = koEntries.get(sceneId);
      if (!ko) {
        records.push({
          day: info.day,
          slot: info.slot,
          scenarioFile,
          koFile: info.koFile,
          sceneId,
          type: 'missing-ko',
          status: 'FAIL',
          mdLine: null,
          speakerStatus: 'N/A',
          textStatus: 'N/A',
          choicesStatus: 'N/A',
          expectedSpeaker: '',
          mdSpeaker: '',
          textPreview: '',
          choices: 0,
          notes: ['ko i18n entry is missing'],
        });
        continue;
      }

      consumed.add(sceneId);
      const expectedText = normalize(ko.entry.text);
      const expectedChoices = Array.isArray(ko.entry.choices) ? ko.entry.choices.map(normalize) : [];

      if (!expectedText && expectedChoices.length === 0) {
        silentSceneCount++;
        continue;
      }

      const md = mdEntries.get(sceneId);
      const expectedSource = `${scenarioFile} / ${ko.file}`;
      const expectedSpeaker = displaySpeaker(sceneId);
      const compareSpeaker = Boolean(expectedText && expectedSpeaker);
      const type = expectedText
        ? (isNarration(expectedText) || !expectedSpeaker ? '지문' : '대사')
        : '선택지';
      const notes = [];

      if (!md) {
        records.push({
          day: info.day,
          slot: info.slot,
          scenarioFile,
          koFile: ko.file,
          sceneId,
          type,
          status: 'FAIL',
          mdLine: null,
          speakerStatus: compareSpeaker ? 'FAIL' : 'N/A',
          textStatus: expectedText ? 'FAIL' : 'N/A',
          choicesStatus: expectedChoices.length ? 'FAIL' : 'N/A',
          expectedSpeaker,
          mdSpeaker: '',
          textPreview: preview(expectedText),
          choices: expectedChoices.length,
          notes: ['SCENARIO.md entry is missing'],
        });
        continue;
      }

      if (md.source !== expectedSource) notes.push(`source mismatch: ${md.source}`);
      const speakerOk = !compareSpeaker || md.speaker === expectedSpeaker;
      const textOk = md.text === expectedText;
      const choicesOk = sameArray(md.choices, expectedChoices);
      const sourceOk = md.source === expectedSource;
      const ok = sourceOk && speakerOk && textOk && choicesOk;

      records.push({
        day: info.day,
        slot: info.slot,
        scenarioFile,
        koFile: ko.file,
        sceneId,
        type,
        status: ok ? 'OK' : 'FAIL',
        mdLine: md.line,
        speakerStatus: compareSpeaker ? (speakerOk ? 'OK' : 'FAIL') : 'N/A',
        textStatus: expectedText ? (textOk ? 'OK' : 'FAIL') : 'N/A',
        choicesStatus: expectedChoices.length ? (choicesOk ? 'OK' : 'FAIL') : 'N/A',
        expectedSpeaker,
        mdSpeaker: md.speaker,
        textPreview: preview(expectedText),
        choices: expectedChoices.length,
        notes,
      });
    }
  }

  const i18nOnly = [...koEntries.entries()]
    .filter(([sceneId]) => !consumed.has(sceneId))
    .sort((a, b) => a[1].file.localeCompare(b[1].file) || a[0].localeCompare(b[0]));

  for (const [sceneId, ko] of i18nOnly) {
    const expectedText = normalize(ko.entry.text);
    const expectedChoices = Array.isArray(ko.entry.choices) ? ko.entry.choices.map(normalize) : [];
    if (!expectedText && expectedChoices.length === 0) continue;

    const md = mdEntries.get(sceneId);
    const expectedSpeaker = displaySpeaker(sceneId);
    const compareSpeaker = Boolean(expectedText && expectedSpeaker);
    const type = expectedText
      ? (isNarration(expectedText) || !expectedSpeaker ? '지문' : '대사')
      : '선택지';
    const speakerOk = !compareSpeaker || md?.speaker === expectedSpeaker;
    const textOk = md?.text === expectedText;
    const choicesOk = sameArray(md?.choices || [], expectedChoices);
    const sourceOk = md?.source === ko.file;
    const ok = Boolean(md) && sourceOk && speakerOk && textOk && choicesOk;

    records.push({
      day: null,
      slot: 'i18n-only',
      scenarioFile: '',
      koFile: ko.file,
      sceneId,
      type,
      status: ok ? 'OK' : 'FAIL',
      mdLine: md?.line ?? null,
      speakerStatus: compareSpeaker ? (speakerOk ? 'OK' : 'FAIL') : 'N/A',
      textStatus: expectedText ? (textOk ? 'OK' : 'FAIL') : 'N/A',
      choicesStatus: expectedChoices.length ? (choicesOk ? 'OK' : 'FAIL') : 'N/A',
      expectedSpeaker,
      mdSpeaker: md?.speaker ?? '',
      textPreview: preview(expectedText),
      choices: expectedChoices.length,
      notes: ['ko entry exists outside scenario JS node order'],
    });
  }

  const expectedSceneIds = new Set(records.map((record) => record.sceneId));
  const extraMdEntries = [...mdEntries.values()]
    .filter((entry) => !expectedSceneIds.has(entry.sceneId))
    .map((entry) => ({ sceneId: entry.sceneId, line: entry.line, source: entry.source }));

  const byDay = {};
  const bySlot = {};
  for (const record of records) {
    const dayKey = record.day == null ? 'i18n-only' : `day${record.day}`;
    byDay[dayKey] ||= {
      total: 0,
      ok: 0,
      fail: 0,
      dialogue: 0,
      narration: 0,
      choiceOnly: 0,
      choices: 0,
    };
    byDay[dayKey].total++;
    byDay[dayKey][record.status.toLowerCase()]++;
    if (record.type === '대사') byDay[dayKey].dialogue++;
    else if (record.type === '지문') byDay[dayKey].narration++;
    else byDay[dayKey].choiceOnly++;
    byDay[dayKey].choices += record.choices;

    const slotKey = record.day == null ? 'i18n-only' : `day${record.day}_${record.slot}`;
    bySlot[slotKey] ||= { total: 0, ok: 0, fail: 0, dialogue: 0, narration: 0, choiceOnly: 0, choices: 0 };
    bySlot[slotKey].total++;
    bySlot[slotKey][record.status.toLowerCase()]++;
    if (record.type === '대사') bySlot[slotKey].dialogue++;
    else if (record.type === '지문') bySlot[slotKey].narration++;
    else bySlot[slotKey].choiceOnly++;
    bySlot[slotKey].choices += record.choices;
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    syncLines,
    totals: {
      scenarioFiles: scenarioFiles.length,
      scenarioScenes: seenScenarioIds.size,
      koEntries: koEntries.size,
      comparedSceneEntries: records.length,
      ok: records.filter((record) => record.status === 'OK').length,
      fail: records.filter((record) => record.status !== 'OK').length,
      dialogue: records.filter((record) => record.type === '대사').length,
      narration: records.filter((record) => record.type === '지문').length,
      choiceOnly: records.filter((record) => record.type === '선택지').length,
      choices: records.reduce((sum, record) => sum + record.choices, 0),
      silentScenarioScenes: silentSceneCount,
      i18nOnlyDisplayedEntries: i18nOnly.filter(([, ko]) => normalize(ko.entry.text) || (Array.isArray(ko.entry.choices) && ko.entry.choices.length)).length,
      extraMdEntries: extraMdEntries.length,
      duplicateScenarioIds: duplicateScenarioIds.length,
      duplicateKoKeys: duplicateKoKeys.length,
      duplicateMdEntries: duplicateMdEntries.length,
    },
    byDay,
    bySlot,
    extraMdEntries,
    duplicateScenarioIds,
    duplicateKoKeys,
    duplicateMdEntries,
    failures: records.filter((record) => record.status !== 'OK'),
  };

  return { summary, records };
}

function writeReport(result) {
  fs.writeFileSync(outJsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  const lines = [];
  lines.push('# Nevergrad Dialogue/Narration Scene Sync Audit');
  lines.push('');
  lines.push(`- Generated: ${result.summary.generatedAt}`);
  lines.push(`- SCENARIO.md sync lines: ${result.summary.syncLines.begin}-${result.summary.syncLines.end}`);
  lines.push(`- Compared scene entries: ${result.summary.totals.comparedSceneEntries}`);
  lines.push(`- OK: ${result.summary.totals.ok}`);
  lines.push(`- FAIL: ${result.summary.totals.fail}`);
  lines.push(`- Dialogue: ${result.summary.totals.dialogue}`);
  lines.push(`- Narration: ${result.summary.totals.narration}`);
  lines.push(`- Choice-only: ${result.summary.totals.choiceOnly}`);
  lines.push(`- Choice labels: ${result.summary.totals.choices}`);
  lines.push(`- Silent scenario nodes skipped: ${result.summary.totals.silentScenarioScenes}`);
  lines.push('');
  lines.push('## Day Summary');
  lines.push('');
  lines.push('| Day | Entries | OK | FAIL | 대사 | 지문 | 선택지만 | 선택지 라벨 |');
  lines.push('|---|---:|---:|---:|---:|---:|---:|---:|');
  for (const [day, data] of Object.entries(result.summary.byDay)) {
    lines.push(`| ${day} | ${data.total} | ${data.ok} | ${data.fail} | ${data.dialogue} | ${data.narration} | ${data.choiceOnly} | ${data.choices} |`);
  }
  lines.push('');
  lines.push('## Scene-by-Scene');
  lines.push('');

  let currentGroup = '';
  for (const record of result.records) {
    const group = record.day == null
      ? '추가 i18n 표시 텍스트'
      : `Day ${record.day} - ${slotNames[record.slot] || record.slot} (${record.scenarioFile})`;
    if (group !== currentGroup) {
      currentGroup = group;
      lines.push(`### ${group}`);
      lines.push('');
      lines.push('| 상태 | 씬 | 구분 | 화자 | 본문 | 선택지 | MD 라인 | 미리보기 |');
      lines.push('|---|---|---|---|---|---|---:|---|');
    }
    lines.push(
      `| ${record.status} | \`${record.sceneId}\` | ${record.type} | ${record.speakerStatus} | ${record.textStatus} | ${record.choicesStatus}${record.choices ? ` (${record.choices})` : ''} | ${record.mdLine ?? ''} | ${escapeTable(record.textPreview)} |`,
    );
  }

  if (result.summary.failures.length) {
    lines.push('');
    lines.push('## Failures');
    lines.push('');
    for (const failure of result.summary.failures) {
      lines.push(`- ${failure.sceneId}: ${failure.notes.join('; ') || 'content mismatch'}`);
    }
  }

  fs.writeFileSync(outMdPath, `${lines.join('\n')}\n`, 'utf8');
}

const result = compare();
writeReport(result);

console.log(JSON.stringify({
  outJsonPath,
  outMdPath,
  totals: result.summary.totals,
  byDay: result.summary.byDay,
}, null, 2));

if (
  result.summary.totals.fail ||
  result.summary.totals.extraMdEntries ||
  result.summary.totals.duplicateScenarioIds ||
  result.summary.totals.duplicateKoKeys ||
  result.summary.totals.duplicateMdEntries
) {
  process.exit(1);
}
