const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const scenarioDir = path.join(root, 'assets/js/scenario');
const koDir = path.join(root, 'assets/js/i18n/ko');

const cfgSrc = fs.readFileSync(path.join(root, 'assets/js/config.js'), 'utf8');
const CONFIG = new Function(`${cfgSrc}\nreturn CONFIG;`)();

const scenarioFiles = fs.readdirSync(scenarioDir)
  .filter((file) => /^day\d+_\d+_(morning|lunch|afterschool|night)\.js$/.test(file))
  .sort((a, b) => {
    const pa = a.match(/^day(\d+)_(\d+)_/);
    const pb = b.match(/^day(\d+)_(\d+)_/);
    return Number(pa[1]) - Number(pb[1]) || Number(pa[2]) - Number(pb[2]) || a.localeCompare(b);
  });

const sandbox = { SCENARIO: {} };
vm.createContext(sandbox);
const sceneFile = new Map();

for (const file of scenarioFiles) {
  const before = new Set(
    Object.values(sandbox.SCENARIO).flatMap((day) => Object.keys(day || {})),
  );
  vm.runInContext(
    fs.readFileSync(path.join(scenarioDir, file), 'utf8'),
    sandbox,
    { filename: file },
  );
  for (const day of Object.keys(sandbox.SCENARIO)) {
    for (const sceneId of Object.keys(sandbox.SCENARIO[day])) {
      if (!before.has(sceneId) && !sceneFile.has(sceneId)) sceneFile.set(sceneId, file);
    }
  }
}

const allScenes = {};
for (const day of Object.keys(sandbox.SCENARIO)) {
  for (const [sceneId, scene] of Object.entries(sandbox.SCENARIO[day])) {
    allScenes[sceneId] = { day: Number(day), scene };
  }
}

const ko = {};
const koFile = new Map();
for (const file of fs.readdirSync(koDir).filter((name) => name.endsWith('.json')).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(koDir, file), 'utf8'));
  for (const [sceneId, entry] of Object.entries(data)) {
    ko[sceneId] = entry;
    koFile.set(sceneId, file);
  }
}

function sceneEdges(scene) {
  const edges = [];
  if (scene.next) edges.push({ sceneId: scene.next, mode: 'post' });
  if (scene.freeTalkNext) edges.push({ sceneId: scene.freeTalkNext, mode: 'post' });
  if (scene.interaction?.next) edges.push({ sceneId: scene.interaction.next, mode: 'post' });
  for (const key of ['choices', 'branches', 'affinityBranches']) {
    if (!Array.isArray(scene[key])) continue;
    for (const item of scene[key]) if (item.next) edges.push({ sceneId: item.next, mode: 'post' });
  }
  if (scene.timeoutNext) edges.push({ sceneId: scene.timeoutNext, mode: 'post' });
  if (scene.fallback) edges.push({ sceneId: scene.fallback, mode: scene.condition ? 'pre' : 'post' });

  const seen = new Set();
  return edges.filter((edge) => {
    if (!allScenes[edge.sceneId]) return false;
    const key = `${edge.mode}:${edge.sceneId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function applyState(state, scene) {
  const next = {
    bg: state.bg || null,
    chars: { ...state.chars },
  };

  if (scene.background) next.bg = scene.background;

  if ('character' in scene || 'characters' in scene) {
    if (scene.character === null && !scene.characters) {
      next.chars = {};
    } else {
      if (scene.character) next.chars.center = scene.character;
      if (scene.characters) {
        for (const [position, key] of Object.entries(scene.characters)) {
          if (key) next.chars[position] = key;
          else delete next.chars[position];
        }
      }
    }
  }

  return next;
}

function signature(state) {
  return `${state.bg || ''}|${['left', 'center', 'right'].map((pos) => state.chars[pos] || '').join(',')}`;
}

function propagateDisplayStates() {
  const displayStates = new Map();
  const seenPreStates = new Map();
  const queue = [{ sceneId: 'day1_opening_1', state: { bg: null, chars: {} } }];

  while (queue.length) {
    const { sceneId, state } = queue.shift();
    const seen = seenPreStates.get(sceneId) || new Set();
    const preSig = signature(state);
    if (seen.has(preSig)) continue;
    if (seen.size > 40) continue;

    seen.add(preSig);
    seenPreStates.set(sceneId, seen);

    const displayState = applyState(state, allScenes[sceneId].scene);
    const stateMap = displayStates.get(sceneId) || new Map();
    stateMap.set(signature(displayState), displayState);
    displayStates.set(sceneId, stateMap);

    for (const edge of sceneEdges(allScenes[sceneId].scene)) {
      queue.push({ sceneId: edge.sceneId, state: edge.mode === 'pre' ? state : displayState });
    }
  }

  return displayStates;
}

const displayStates = propagateDisplayStates();

function charPrefix(key) {
  return key && typeof key === 'string' ? key.split('_')[0] : null;
}

function visiblePrefixes(state) {
  return new Set(Object.values(state.chars || {}).map(charPrefix).filter(Boolean));
}

function statesFor(sceneId) {
  return [...(displayStates.get(sceneId)?.values() || [])];
}

function sampleStates(sceneId) {
  return statesFor(sceneId)
    .slice(0, 3)
    .map((state) => {
      const chars = Object.entries(state.chars)
        .map(([position, key]) => `${position}:${key}`)
        .join(' ');
      return `${state.bg || '-'} / ${chars || '-'}`;
    })
    .join(' || ');
}

function textOf(sceneId) {
  return String(ko[sceneId]?.text || '').replace(/\s+/g, ' ').trim();
}

function speakerExpected(name) {
  const speaker = String(name || '').trim();
  if (/^(박은수|은수|담임교사)$/.test(speaker)) return 'eunsu';
  if (/^(강리인|리인|보건교사)$/.test(speaker)) return 'riin';
  if (/^한세아$/.test(speaker)) return 'sea';
  if (/^최유나$/.test(speaker)) return 'yuna';
  if (/^(이설화|설화)$/.test(speaker)) return 'seolhwa';
  return null;
}

function isLikelyOffscreen(sceneId, scene, text, speaker) {
  if (/^\[.*방송.*\]$/.test(speaker)) return true;
  if (scene.character && /_pa$/.test(scene.character)) return true;
  if (/방송|스피커|전화|휴대폰|문자|메시지|채팅|노크|문 너머|문밖|멀리서|어디선가|목소리만|소리만|등 뒤|뒤에서|귓가|이어폰/.test(text)) {
    return true;
  }
  if (scene.type === 'free_talk') return true;
  return false;
}

const bgCategories = {
  classroom: new Set(['classroom', 'classroom_empty', 'classroom_afternoon', 'new_classroom', 'ending_cage', 'ending_forget', 'ending_ghost']),
  hall: new Set(['hallway', 'corridor', 'corridor_dark', 'corridor_main', 'corridor_old', 'corridor_emergency', 'old_building', 'old_building_corridor', 'old_corridor_dark']),
  gate: new Set(['school_gate', 'school_gate_morning', 'school_gate_evening', 'school_gate_dark', 'school_fence_dawn', 'school_back', 'outside_school', 'cherry_blossom']),
  nurse: new Set(['nurse_office', 'old_infirmary']),
  office: new Set(['teacher_office', 'faculty_office', 'office', 'student_council']),
  rooftop: new Set(['rooftop']),
  library: new Set(['library']),
  gym: new Set(['gym']),
  playground: new Set(['playground']),
  cafeteria: new Set(['cafeteria']),
  stair: new Set(['stairway', 'old_stairway']),
  home: new Set(['home', 'room_morning', 'room_night', 'room_dark']),
  bathroom: new Set(['bathroom', 'bathroom_night']),
  street: new Set(['street', 'street_morning', 'night_rain', 'dawn_road', 'sunset_outside', 'outside_school', 'school_back', 'new_place']),
  basement: new Set(['basement', 'underground_lab', 'lab_documents']),
};

const locationRules = [
  ['nurse', /보건실|침대가 두 개|약품장|체온계|알코올 냄새/],
  ['library', /도서관|서가|책장|책 냄새|대출/],
  ['gym', /체육관|농구공|코트|골대/],
  ['rooftop', /옥상|난간|출입문 위|하늘이 가까/],
  ['cafeteria', /급식실|식당|식판|배식/],
  ['bathroom', /화장실|세면대|거울 앞|칫솔|수건/],
  ['basement', /지하|실험실|연구실|철제 침대|모니터가 줄지어|약물|재단 문서|서류철/],
  ['stair', /계단|층계|계단참/],
  ['office', /교무실|교사실|상담실|선생님 책상|교무/],
  ['gate', /교문|정문|후문|담장|울타리|학교 앞/],
  ['classroom', /교실|칠판|교탁|책상들이|내 자리|창가 자리|반 아이/],
  ['hall', /복도|현관|로비|본관|별관 복도|구관 복도/],
  ['home', /자취방|내 방|방 안|침대 옆|책상 위|현관문을 잠갔다|집에/],
  ['street', /골목|거리|통학로|집으로 가|가로등|버스 정류장|비가 내리|도로|학교 밖/],
  ['playground', /운동장|트랙|축구 골대/],
];

function stateMatchesCategory(state, category) {
  return Boolean(bgCategories[category]?.has(state.bg));
}

function shouldIgnoreLocationMention(text, category) {
  if (category === 'classroom' && /교실로 (가야|돌아|향해|가고|가는)|교실에 가|교실 문 앞|교실 쪽|교실까지/.test(text)) return true;
  if (category === 'hall' && /복도로 (나가|나왔다|나간)|복도를 지나|복도 쪽|복도 끝/.test(text)) return true;
  if (category === 'nurse' && /보건실로|보건실까지|보건실에 가/.test(text)) return true;
  if (category === 'street' && /거리로|밖으로|학교 밖으로|집으로/.test(text) && !/(섰다|나왔다|걷는다|있다|도착)/.test(text)) return true;
  return false;
}

function isStrongCurrentLocation(text) {
  return /(섰다|들어섰|들어왔다|있다|걷는다|앉|앞에|위에|안은|도착|보인다|열었다|닫혔다|나왔다|지나간다|울린다|냄새가)/.test(text);
}

const explicitAssetIssues = [];
const speakerMismatches = [];
const locationMismatches = [];
const silentSceneChecks = [];

for (const [sceneId, { scene }] of Object.entries(allScenes)) {
  if (scene.background && typeof scene.background === 'string' && !scene.background.includes('/') && !scene.background.includes('.') && !CONFIG.BACKGROUNDS[scene.background]) {
    explicitAssetIssues.push({ sceneId, type: 'background', key: scene.background, file: sceneFile.get(sceneId) });
  }

  const charKeys = [];
  if (scene.character && typeof scene.character === 'string' && !scene.character.includes('/')) charKeys.push(scene.character);
  if (scene.characters) {
    for (const key of Object.values(scene.characters)) {
      if (key && typeof key === 'string' && !key.includes('/')) charKeys.push(key);
    }
  }
  for (const key of charKeys) {
    const [charId, ...exprParts] = key.split('_');
    const expression = exprParts.join('_');
    if (!CONFIG.EXPRESSIONS[charId]?.[expression]) {
      explicitAssetIssues.push({ sceneId, type: 'character', key, file: sceneFile.get(sceneId) });
    }
  }

  const entry = ko[sceneId];
  const states = statesFor(sceneId);
  const text = textOf(sceneId);

  if (entry && states.length) {
    const expected = speakerExpected(entry.name);
    if (expected && !isLikelyOffscreen(sceneId, scene, text, entry.name)) {
      const okAny = states.some((state) => visiblePrefixes(state).has(expected));
      if (!okAny) {
        speakerMismatches.push({
          sceneId,
          file: sceneFile.get(sceneId),
          speaker: entry.name,
          expected,
          display: sampleStates(sceneId),
          text: text.slice(0, 140),
        });
      }
    }

    for (const [category, pattern] of locationRules) {
      if (!pattern.test(text)) continue;
      if (shouldIgnoreLocationMention(text, category)) continue;
      if (!isStrongCurrentLocation(text)) continue;

      const okAny = states.some((state) => stateMatchesCategory(state, category));
      if (!okAny) {
        locationMismatches.push({
          sceneId,
          file: sceneFile.get(sceneId),
          expectedCategory: category,
          display: sampleStates(sceneId),
          text: text.slice(0, 170),
        });
      }
      break;
    }
  }

  const hasText = Boolean(String(entry?.text || '').trim());
  const hasChoices = Array.isArray(entry?.choices) && entry.choices.length > 0;
  if (
    !hasText &&
    !hasChoices &&
    !scene.autoAdvance &&
    !scene.changeDay &&
    !scene.changeSlot &&
    !scene.affinityBranches &&
    !scene.branches &&
    !scene.cageLoop
  ) {
    silentSceneChecks.push({
      sceneId,
      file: sceneFile.get(sceneId),
      display: sampleStates(sceneId),
    });
  }
}

const summary = {
  counts: {
    scenarioScenes: Object.keys(allScenes).length,
    reachableScenesByDisplayPropagation: displayStates.size,
    koKeys: Object.keys(ko).length,
    koTextEntries: Object.values(ko).filter((entry) => String(entry.text || '').trim()).length,
    koChoiceEntries: Object.values(ko).filter((entry) => Array.isArray(entry.choices) && entry.choices.length > 0).length,
  },
  explicitAssetIssues,
  speakerMismatchCount: speakerMismatches.length,
  speakerMismatches,
  locationMismatchCount: locationMismatches.length,
  locationMismatches,
  silentSceneCheckCount: silentSceneChecks.length,
  silentSceneChecks,
};

console.log(JSON.stringify(summary, null, 2));
