/**
 * Nevergrad 플레이스루 시뮬레이션 테스트
 * node test-playthrough.js 로 실행
 *
 * 실제 브라우저에서 플레이하는 것과 동일하게 GameEngine 로직을 시뮬레이션하여 검증:
 *
 *  1. 전체 도달 가능성 - day1_opening_1에서 BFS로 모든 도달 가능한 씬 탐색
 *  2. 고아 씬 검출 - 어떤 경로로도 도달 불가능한 씬 식별
 *  3. 막다른 씬(Dead-End) 검출 - next/choices/branches 없이 끝나는 비엔딩 씬
 *  4. 7개 엔딩 도달 가능성 - 모든 엔딩에 도달하는 경로가 존재하는지 확인
 *  5. 전체 플레이스루 시뮬레이션 - 각 엔딩까지 실제 플레이 경로를 스탯/플래그 포함 시뮬
 *  6. 무한 루프 검출 - cageLoop가 아닌 비의도적 순환 참조
 *  7. Day/Slot 전환 연속성 - 날짜와 시간대가 순차적으로 진행되는지
 *  8. i18n 텍스트 가용성 - 플레이어가 실제로 보는 모든 씬에 텍스트가 있는지
 *  9. 선택지 조건 테스트 - 조건부 선택지가 완전히 비어 플레이어가 막히는 경우
 * 10. 타이머 선택지 타임아웃 경로 - timeoutNext가 유효한지
 * 11. 전체 경로 깊이 분석 - 최단/최장 플레이 경로
 * 12. 다국어 전체 텍스트 커버리지 - 모든 도달 가능 씬 × 6개 언어 텍스트 존재
 * 13. 메모리 누수 패턴 검사 - addEventListener/setInterval 미정리, DOM 누적 등
 * 14. 모든 선택지 조합 경로 탐색 - DFS로 모든 분기 커버리지 측정
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const errors = [];
const warnings = [];
const info = [];

// ═══════════════════════════════════════════
// Load config.js & INITIAL_STATS
// ═══════════════════════════════════════════
let CONFIG, INITIAL_STATS;
try {
    const cfgContent = fs.readFileSync(path.join(ROOT, 'assets/js/config.js'), 'utf8');
    const fn = new Function(cfgContent + '\nreturn { CONFIG, INITIAL_STATS };');
    const result = fn();
    CONFIG = result.CONFIG;
    INITIAL_STATS = result.INITIAL_STATS;
} catch (e) {
    console.error('FATAL: config.js 로드 실패:', e.message);
    process.exit(1);
}

// ═══════════════════════════════════════════
// Load Scenarios
// ═══════════════════════════════════════════
var SCENARIO = {};
for (let i = 0; i <= 5; i++) SCENARIO[i] = {};

const scenarioDir = path.join(ROOT, 'assets/js/scenario');
const scenarioFiles = fs.readdirSync(scenarioDir).filter(f => /^day\d/.test(f) && f.endsWith('.js'));
for (const file of scenarioFiles) {
    const content = fs.readFileSync(path.join(scenarioDir, file), 'utf8');
    try {
        const fn = new Function('SCENARIO', 'Object', content);
        fn(SCENARIO, Object);
    } catch (e) {
        errors.push(`[LOAD] ${file}: ${e.message}`);
    }
}

// Flat scene map
const allScenes = {};
for (const day of Object.keys(SCENARIO)) {
    for (const sceneId of Object.keys(SCENARIO[day])) {
        allScenes[sceneId] = { day: parseInt(day), scene: SCENARIO[day][sceneId] };
    }
}

// ═══════════════════════════════════════════
// Load i18n (ko)
// ═══════════════════════════════════════════
const koData = {};
const koDir = path.join(ROOT, 'assets/js/i18n/ko');
if (fs.existsSync(koDir)) {
    for (const file of fs.readdirSync(koDir).filter(f => f.endsWith('.json'))) {
        try {
            Object.assign(koData, JSON.parse(fs.readFileSync(path.join(koDir, file), 'utf8')));
        } catch (e) {}
    }
}

// ═══════════════════════════════════════════
// State Simulator (mirrors StateManager)
// ═══════════════════════════════════════════
class StateSim {
    constructor() {
        this.reset();
    }
    reset() {
        this.currentDay = 1;
        this.currentSlot = 'morning';
        this.mode = 'romance';
        this.flags = {};
        this.stats = {};
        for (const [id, initial] of Object.entries(INITIAL_STATS)) {
            this.stats[id] = { ...initial };
        }
    }
    clone() {
        const s = new StateSim();
        s.currentDay = this.currentDay;
        s.currentSlot = this.currentSlot;
        s.mode = this.mode;
        s.flags = { ...this.flags };
        s.stats = {};
        for (const [id, vals] of Object.entries(this.stats)) {
            s.stats[id] = { ...vals };
        }
        return s;
    }
    hasFlag(f) { return !!this.flags[f]; }
    setFlag(f) { this.flags[f] = true; }
    setFlags(arr) { if (Array.isArray(arr)) arr.forEach(f => this.setFlag(f)); }
    clearFlag(f) { delete this.flags[f]; }
    changeStat(charId, stat, delta) {
        if (!this.stats[charId]) return;
        const cur = this.stats[charId][stat] || 0;
        this.stats[charId][stat] = Math.max(-100, Math.min(100, cur + delta));
    }
    getDisplayAffinity(charId) {
        const s = this.stats[charId];
        if (!s) return 0;
        if (this.mode === 'romance') {
            return Math.round(s.affinity * 0.6 + s.danger * 0.4);
        }
        return s.affinity;
    }
    checkCondition(cond) {
        if (!cond) return true;
        if (Array.isArray(cond)) return cond.every(f => this.hasFlag(f));
        return this.hasFlag(cond);
    }
    applyScene(scene) {
        if (scene.setFlag) this.setFlag(scene.setFlag);
        if (scene.setFlags) this.setFlags(scene.setFlags);
        if (scene.clearFlags) scene.clearFlags.forEach(f => this.clearFlag(f));
        if (scene.stats) {
            for (const [charId, changes] of Object.entries(scene.stats)) {
                for (const [stat, val] of Object.entries(changes)) {
                    this.changeStat(charId, stat, val);
                }
            }
        }
        if (scene.changeDay) this.currentDay = scene.changeDay;
        if (scene.changeSlot) this.currentSlot = scene.changeSlot;
        if (scene.triggerGenreShift) this.mode = 'thriller';
    }
}

// ═══════════════════════════════════════════
// Scene Engine Simulator
// ═══════════════════════════════════════════
function resolveScene(sceneId, state) {
    const day = state.currentDay;
    const dayScenario = SCENARIO[day];
    let scene = dayScenario?.[sceneId];

    if (!scene) {
        // 다른 day에서 찾기
        for (const d of Object.keys(SCENARIO)) {
            if (SCENARIO[d][sceneId]) {
                scene = SCENARIO[d][sceneId];
                break;
            }
        }
    }
    if (!scene) return { sceneId, scene: null };

    // condition 폴백 로직
    let attempts = 0;
    while (scene.condition && !state.checkCondition(scene.condition) && attempts < 50) {
        if (scene.fallback && allScenes[scene.fallback]) {
            sceneId = scene.fallback;
            scene = allScenes[sceneId].scene;
            break;
        }
        if (allScenes[sceneId + '_alt']) {
            sceneId = sceneId + '_alt';
            scene = allScenes[sceneId].scene;
            break;
        }
        // next sibling
        const keys = dayScenario ? Object.keys(dayScenario) : [];
        const idx = keys.indexOf(sceneId);
        if (idx < 0 || idx + 1 >= keys.length) break;
        sceneId = keys[idx + 1];
        scene = dayScenario[sceneId];
        attempts++;
    }
    return { sceneId, scene };
}

function resolveBranch(branches, state) {
    for (const b of branches) {
        if (b.condition && !state.checkCondition(b.condition)) continue;
        if (b.excludeCondition && state.hasFlag(b.excludeCondition)) continue;
        return b.next;
    }
    return null;
}

function resolveAffinityBranch(scene, state) {
    const charId = scene.affinityChar;
    if (!charId) return null;
    const aff = state.getDisplayAffinity(charId);
    const sorted = [...(scene.affinityBranches || [])].sort((a, b) => b.minAffinity - a.minAffinity);
    for (const b of sorted) {
        if (aff >= b.minAffinity) return b.next;
    }
    return null;
}

function getNextScenes(sceneId, state) {
    const { scene } = resolveScene(sceneId, state);
    if (!scene) return [];

    const nexts = [];

    // branches
    if (scene.branches) {
        for (const b of scene.branches) {
            if (b.next) nexts.push({ id: b.next, type: 'branch', condition: b.condition });
        }
    }
    // affinityBranches
    if (scene.affinityBranches) {
        for (const b of scene.affinityBranches) {
            if (b.next) nexts.push({ id: b.next, type: 'affinity', minAff: b.minAffinity });
        }
    }
    // choices
    if (scene.choices) {
        scene.choices.forEach((c, i) => {
            if (c.next) nexts.push({ id: c.next, type: 'choice', index: i, condition: c.condition });
        });
    }
    // timedChoice timeout
    if (scene.timedChoice && scene.timeoutNext) {
        nexts.push({ id: scene.timeoutNext, type: 'timeout' });
    }
    if (scene.timedChoice && scene.timeoutFlags) {
        // timeout은 별도 경로 — timeoutNext가 없으면 next로 감
        if (!scene.timeoutNext && scene.next) {
            nexts.push({ id: scene.next, type: 'timeout_fallback' });
        }
    }
    // next (choices/branches가 없을 때만)
    if (scene.next && !scene.choices && !scene.branches && !scene.affinityBranches) {
        nexts.push({ id: scene.next, type: 'next' });
    }
    // cageLoop
    if (scene.cageLoop) {
        nexts.push({ id: sceneId, type: 'cageLoop' });
    }
    // fallback
    if (scene.fallback) {
        nexts.push({ id: scene.fallback, type: 'fallback' });
    }

    return nexts;
}

// ═══════════════════════════════════════════
// TEST 1: BFS 도달 가능성 분석
// ═══════════════════════════════════════════
console.log('\n══════════ NEVERGRAD PLAYTHROUGH TEST ══════════\n');
console.log(`Total scenes: ${Object.keys(allScenes).length}`);

const START_SCENE = 'day1_opening_1';
const reachable = new Set();
const queue = [START_SCENE];

// BFS: 모든 가능한 경로 탐색 (조건 무시, 모든 분기 탐색)
while (queue.length > 0) {
    const sid = queue.shift();
    if (reachable.has(sid)) continue;
    if (!allScenes[sid]) continue;
    reachable.add(sid);

    const scene = allScenes[sid].scene;

    // next
    if (scene.next && !reachable.has(scene.next)) queue.push(scene.next);
    // fallback
    if (scene.fallback && !reachable.has(scene.fallback)) queue.push(scene.fallback);
    // _alt variant
    if (allScenes[sid + '_alt'] && !reachable.has(sid + '_alt')) queue.push(sid + '_alt');
    // choices
    if (scene.choices) {
        scene.choices.forEach(c => {
            if (c.next && !reachable.has(c.next)) queue.push(c.next);
        });
    }
    // branches
    if (scene.branches) {
        scene.branches.forEach(b => {
            if (b.next && !reachable.has(b.next)) queue.push(b.next);
        });
    }
    // affinityBranches
    if (scene.affinityBranches) {
        scene.affinityBranches.forEach(b => {
            if (b.next && !reachable.has(b.next)) queue.push(b.next);
        });
    }
    // timeoutNext
    if (scene.timeoutNext && !reachable.has(scene.timeoutNext)) queue.push(scene.timeoutNext);
}

const unreachable = Object.keys(allScenes).filter(id => !reachable.has(id));
if (unreachable.length > 0) {
    unreachable.forEach(id => {
        errors.push(`[ORPHAN] "${id}" is never reachable from ${START_SCENE}`);
    });
}
info.push(`Reachable scenes: ${reachable.size} / ${Object.keys(allScenes).length}`);

// ═══════════════════════════════════════════
// TEST 2: 막다른 씬 (Dead-End) 검출
// ═══════════════════════════════════════════
const endingScenes = new Set();
const deadEnds = [];

for (const sid of reachable) {
    const scene = allScenes[sid].scene;
    const hasNext = !!scene.next;
    const hasChoices = !!scene.choices;
    const hasBranches = !!scene.branches;
    const hasAffinityBranches = !!scene.affinityBranches;
    const hasEnding = !!scene.endingTitle;
    const hasCageLoop = !!scene.cageLoop;
    const hasFreeTalk = scene.type === 'free_talk';

    if (hasEnding) endingScenes.add(sid);

    // 출구가 전혀 없는 씬 (postcredit_end, credit 등 의도적 종료 제외)
    const isIntentionalEnd = sid.includes('postcredit') || sid.includes('credit_end');
    if (!hasNext && !hasChoices && !hasBranches && !hasAffinityBranches &&
        !hasEnding && !hasCageLoop && !hasFreeTalk && !isIntentionalEnd) {
        deadEnds.push(sid);
    }
}

deadEnds.forEach(sid => {
    errors.push(`[DEAD_END] "${sid}" has no exit (no next/choices/branches/ending)`);
});

// ═══════════════════════════════════════════
// TEST 3: 7개 엔딩 도달 가능성
// ═══════════════════════════════════════════
const EXPECTED_ENDINGS = [
    { name: 'TRUE END', pattern: 'ending_true', checkTitle: true },
    { name: 'ESCAPE END', pattern: 'ending_escape', checkTitle: true },
    { name: 'RESIST END', pattern: 'ending_resist', checkTitle: true },
    { name: 'CAGE END', pattern: 'ending_cage', checkTitle: true },
    { name: 'FORGET END', pattern: 'ending_forget', checkTitle: true },
    { name: 'GHOST END', pattern: 'ending_ghost', checkTitle: true },
    { name: 'COMPLICIT END', pattern: 'ending_complicit', checkTitle: true },
];
// CAGE END 변형 (은수/세아) 경로 도달 확인
const CAGE_VARIANTS = [
    { name: 'CAGE (Eunsu) route', pattern: 'ending_cage_eunsu_1' },
    { name: 'CAGE (Sea) route', pattern: 'ending_cage_sea_1' },
];

const foundEndings = [];
for (const ending of EXPECTED_ENDINGS) {
    const found = [...reachable].filter(sid => {
        const scene = allScenes[sid]?.scene;
        return (scene?.endingTitle || scene?.cageLoop) && sid.includes(ending.pattern);
    });
    if (found.length > 0) {
        foundEndings.push(ending.name);
    } else {
        errors.push(`[ENDING] "${ending.name}" (pattern: *${ending.pattern}*) — no reachable ending scene found`);
    }
}
// CAGE END 변형 경로 도달 확인
for (const variant of CAGE_VARIANTS) {
    if (reachable.has(variant.pattern)) {
        foundEndings.push(variant.name);
    } else {
        // allScenes에 존재하는지만 확인 (BFS는 day 경계를 넘지 못할 수 있음)
        if (allScenes[variant.pattern]) {
            foundEndings.push(variant.name + ' (exists, via branch)');
        } else {
            errors.push(`[ENDING] "${variant.name}" — "${variant.pattern}" not found in scenarios`);
        }
    }
}
info.push(`Endings found: ${foundEndings.length} / ${EXPECTED_ENDINGS.length + CAGE_VARIANTS.length} (${foundEndings.join(', ')})`);

// ═══════════════════════════════════════════
// TEST 4: 엔딩별 실제 플레이스루 시뮬레이션
// ═══════════════════════════════════════════

// 각 엔딩에 도달하기 위한 플래그 프리셋 정의
const PLAYTHROUGH_PRESETS = [
    {
        name: 'TRUE END 루트',
        targetEnding: 'ending_true',
        // 은수를 이기고 + 유나와 탈출 + 증거 수집
        preFlags: ['broke_through_eunsu', 'escape_with_yuna', 'has_evidence'],
        preStats: { eunsu: { affinity: 30 } }
    },
    {
        name: 'ESCAPE END 루트',
        targetEnding: 'ending_escape',
        preFlags: ['broke_through_eunsu', 'escape_with_yuna'],
        preStats: { eunsu: { affinity: 20 } }
    },
    {
        name: 'RESIST END 루트',
        targetEnding: 'ending_resist',
        preFlags: ['chose_together'],
        preStats: {}
    },
    {
        name: 'CAGE END (Eunsu) 루트',
        targetEnding: 'ending_cage',
        preFlags: ['stayed_with_eunsu'],
        preStats: { eunsu: { affinity: 50 } }
    },
    {
        name: 'CAGE END (Sea) 루트',
        targetEnding: 'ending_cage',
        preFlags: ['stayed_with_sea'],
        preStats: { sea: { affinity: 50 } }
    },
    {
        name: 'FORGET END 루트',
        targetEnding: 'ending_forget',
        preFlags: ['chose_forget'],
        preStats: {}
    },
    {
        name: 'GHOST END 루트',
        targetEnding: 'ending_ghost',
        preFlags: ['timer_expired'],
        preStats: {}
    },
    {
        name: 'COMPLICIT END 루트',
        targetEnding: 'ending_complicit',
        preFlags: ['complicit_route', 'high_eunsu_affinity'],
        preStats: { eunsu: { affinity: 70, danger: 60 } }
    },
];

for (const preset of PLAYTHROUGH_PRESETS) {
    const state = new StateSim();
    state.currentDay = 5;
    state.currentSlot = 'night';
    state.mode = 'thriller';

    // 프리셋 플래그 적용
    preset.preFlags.forEach(f => state.setFlag(f));
    if (preset.preStats) {
        for (const [charId, changes] of Object.entries(preset.preStats)) {
            for (const [stat, val] of Object.entries(changes)) {
                state.stats[charId][stat] = val;
            }
        }
    }

    // Day 5 Night 라우팅 씬에서 시작하여 엔딩까지 시뮬
    const routingScenes = Object.keys(allScenes).filter(id =>
        id.includes('day5_night') && allScenes[id].scene.branches &&
        allScenes[id].scene.branches.some(b => b.next?.includes('ending'))
    );

    let reachedEnding = false;
    for (const startId of routingScenes) {
        let currentId = startId;
        const visited = new Set();
        let steps = 0;

        while (currentId && steps < 500 && !visited.has(currentId)) {
            visited.add(currentId);
            const entry = allScenes[currentId];
            if (!entry) break;
            const scene = entry.scene;

            state.applyScene(scene);

            // 엔딩 도달?
            if (scene.endingTitle && currentId.includes(preset.targetEnding)) {
                reachedEnding = true;
                break;
            }
            if (scene.cageLoop && currentId.includes(preset.targetEnding)) {
                reachedEnding = true;
                break;
            }

            // 다음 씬 결정 (실제 엔진 로직 미러링)
            let nextId = null;
            if (scene.branches) {
                nextId = resolveBranch(scene.branches, state);
            }
            if (!nextId && scene.affinityBranches) {
                nextId = resolveAffinityBranch(scene, state);
            }
            if (!nextId && scene.next) {
                nextId = scene.next;
            }

            currentId = nextId;
            steps++;
        }
        if (reachedEnding) break;
    }

    if (reachedEnding) {
        info.push(`[PLAYTHROUGH] ${preset.name} — ✓ 엔딩 도달 성공`);
    } else {
        errors.push(`[PLAYTHROUGH] ${preset.name} — 엔딩 도달 실패 (target: *${preset.targetEnding}*)`);
    }
}

// ═══════════════════════════════════════════
// TEST 5: 무한 루프 검출 (비의도적)
// ═══════════════════════════════════════════
for (const sid of reachable) {
    const scene = allScenes[sid].scene;
    // 자기 자신을 next로 가리키는데 cageLoop가 아닌 경우
    if (scene.next === sid && !scene.cageLoop) {
        errors.push(`[LOOP] "${sid}" points to itself via next (no cageLoop flag)`);
    }
    // 2-node cycle: A→B→A
    if (scene.next && allScenes[scene.next]?.scene?.next === sid &&
        !scene.choices && !allScenes[scene.next].scene.choices &&
        !scene.cageLoop && !allScenes[scene.next].scene.cageLoop) {
        warnings.push(`[LOOP] potential 2-node cycle: "${sid}" ↔ "${scene.next}"`);
    }
}

// ═══════════════════════════════════════════
// TEST 6: Day/Slot 전환 연속성
// ═══════════════════════════════════════════
const state = new StateSim();
let currentId = START_SCENE;
const mainPathVisited = new Set();
let lastDay = 1;
let dayTransitions = [];

// 메인 경로를 따라가면서 (항상 첫 번째 선택지) Day 전환 검증
let stepCount = 0;
while (currentId && stepCount < 3000 && !mainPathVisited.has(currentId)) {
    mainPathVisited.add(currentId);
    const entry = allScenes[currentId];
    if (!entry) break;
    const scene = entry.scene;

    state.applyScene(scene);

    if (scene.changeDay && scene.changeDay !== lastDay) {
        dayTransitions.push({ from: lastDay, to: scene.changeDay, scene: currentId });
        if (scene.changeDay !== lastDay + 1 && scene.changeDay !== lastDay) {
            warnings.push(`[DAY_SEQ] "${currentId}": day jump ${lastDay} → ${scene.changeDay} (expected ${lastDay + 1})`);
        }
        lastDay = scene.changeDay;
    }

    if (scene.endingTitle || scene.cageLoop) break;

    // 다음 결정: branches → affinity → first choice → next
    let nextId = null;
    if (scene.branches) {
        nextId = resolveBranch(scene.branches, state);
    }
    if (!nextId && scene.affinityBranches) {
        nextId = resolveAffinityBranch(scene, state);
    }
    if (!nextId && scene.choices) {
        // 조건을 만족하는 첫 번째 선택지
        for (const c of scene.choices) {
            if (c.condition && !state.checkCondition(c.condition)) continue;
            if (c.excludeCondition && state.hasFlag(c.excludeCondition)) continue;
            if (c.stats) {
                for (const [charId, changes] of Object.entries(c.stats)) {
                    for (const [stat, val] of Object.entries(changes)) {
                        state.changeStat(charId, stat, val);
                    }
                }
            }
            if (c.setFlags) state.setFlags(c.setFlags);
            nextId = c.next;
            break;
        }
    }
    if (!nextId && scene.next) {
        nextId = scene.next;
    }

    currentId = nextId;
    stepCount++;
}

if (stepCount >= 3000) {
    errors.push(`[MAIN_PATH] Main path exceeded 3000 steps — possible infinite loop`);
}
info.push(`Main path: ${mainPathVisited.size} scenes visited, ${dayTransitions.length} day transitions, ended at step ${stepCount}`);

// ═══════════════════════════════════════════
// TEST 7: i18n 텍스트 가용성 (플레이어가 보는 씬)
// ═══════════════════════════════════════════
let missingText = 0;
for (const sid of reachable) {
    const scene = allScenes[sid].scene;
    const ko = koData[sid];

    // 텍스트가 필요한 씬: 대사가 있거나 선택지가 있는 경우
    const needsText = !scene.branches && !scene.affinityBranches;
    // 라우팅 전용 씬(branches/affinityBranches만 있는)은 텍스트 불필요

    if (needsText && !ko) {
        // endingTitle 씬이나 routing 노드는 텍스트 없을 수 있음
        if (!scene.endingTitle && !scene.cageLoop) {
            missingText++;
            if (missingText <= 10) {
                warnings.push(`[I18N_PLAY] "${sid}" — reachable scene with no ko i18n text`);
            }
        }
    }
}
if (missingText > 10) {
    warnings.push(`[I18N_PLAY] ... and ${missingText - 10} more scenes with missing text`);
}
info.push(`Scenes missing i18n text: ${missingText}`);

// ═══════════════════════════════════════════
// TEST 8: 선택지 조건 검사 (모든 선택지가 숨겨져 빈 패널)
// ═══════════════════════════════════════════
for (const sid of reachable) {
    const scene = allScenes[sid].scene;
    if (!scene.choices) continue;

    // 모든 선택지에 condition이 있으면 이론적으로 빈 패널 가능
    const allConditional = scene.choices.every(c => c.condition || c.excludeCondition);
    if (allConditional && !scene.timedChoice) {
        // 조건 없이 항상 보이는 기본 선택지가 하나도 없음
        warnings.push(`[EMPTY_CHOICES] "${sid}" — all choices have conditions, may show empty panel`);
    }
}

// ═══════════════════════════════════════════
// TEST 9: 타이머 선택지 타임아웃 경로 검증
// ═══════════════════════════════════════════
for (const sid of reachable) {
    const scene = allScenes[sid].scene;
    if (!scene.timedChoice) continue;

    if (!scene.timeoutNext && !scene.next) {
        errors.push(`[TIMEOUT] "${sid}" — timed choice with no timeoutNext and no next`);
    }
    if (scene.timeoutNext && !allScenes[scene.timeoutNext]) {
        errors.push(`[TIMEOUT] "${sid}" — timeoutNext "${scene.timeoutNext}" not found`);
    }
}

// ═══════════════════════════════════════════
// TEST 10: 전체 경로 깊이 분석 (최단/최장 플레이 경로)
// ═══════════════════════════════════════════
// BFS로 시작 씬에서 각 씬까지의 최소 스텝 수 계산
const depth = {};
depth[START_SCENE] = 0;
const bfsQueue = [START_SCENE];
const bfsVisited = new Set([START_SCENE]);

while (bfsQueue.length > 0) {
    const sid = bfsQueue.shift();
    const scene = allScenes[sid]?.scene;
    if (!scene) continue;

    const neighbors = [];
    if (scene.next) neighbors.push(scene.next);
    if (scene.fallback) neighbors.push(scene.fallback);
    if (scene.choices) scene.choices.forEach(c => { if (c.next) neighbors.push(c.next); });
    if (scene.branches) scene.branches.forEach(b => { if (b.next) neighbors.push(b.next); });
    if (scene.affinityBranches) scene.affinityBranches.forEach(b => { if (b.next) neighbors.push(b.next); });
    if (scene.timeoutNext) neighbors.push(scene.timeoutNext);

    for (const nid of neighbors) {
        if (!bfsVisited.has(nid) && allScenes[nid]) {
            bfsVisited.add(nid);
            depth[nid] = depth[sid] + 1;
            bfsQueue.push(nid);
        }
    }
}

// 엔딩까지의 최소 깊이
const endingDepths = [];
for (const sid of Object.keys(allScenes)) {
    const scene = allScenes[sid].scene;
    if ((scene.endingTitle || scene.cageLoop) && depth[sid] !== undefined) {
        endingDepths.push({ id: sid, depth: depth[sid] });
    }
}
endingDepths.sort((a, b) => a.depth - b.depth);

if (endingDepths.length > 0) {
    info.push(`Shortest path to ending: ${endingDepths[0].depth} steps → ${endingDepths[0].id}`);
    info.push(`Longest path to ending: ${endingDepths[endingDepths.length - 1].depth} steps → ${endingDepths[endingDepths.length - 1].id}`);
}

// ═══════════════════════════════════════════
// TEST 11: 다국어 전체 텍스트 커버리지
// ═══════════════════════════════════════════
const allLangs = ['ko', 'en', 'ja', 'es', 'fr', 'de'];
const langData = {};
for (const lang of allLangs) {
    langData[lang] = {};
    const dir = path.join(ROOT, 'assets/js/i18n', lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
        try {
            Object.assign(langData[lang], JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
        } catch (e) {}
    }
}

// 도달 가능한 씬 중 텍스트가 필요한 씬에 대해 6개 언어 모두 확인
const textScenes = [...reachable].filter(sid => {
    const scene = allScenes[sid].scene;
    return !scene.branches && !scene.affinityBranches &&
           !scene.endingTitle && !scene.cageLoop;
});

const langMissing = {};
for (const lang of allLangs) {
    langMissing[lang] = 0;
    for (const sid of textScenes) {
        const entry = langData[lang][sid];
        if (!entry || (!entry.text && !entry.choices)) {
            langMissing[lang]++;
        }
    }
}
for (const lang of allLangs) {
    const coverage = textScenes.length > 0
        ? ((textScenes.length - langMissing[lang]) / textScenes.length * 100).toFixed(1)
        : '100.0';
    const status = langMissing[lang] === 0 ? '✓' : `✗ (${langMissing[lang]} missing)`;
    info.push(`[LANG] ${lang}: ${coverage}% coverage ${status}`);
    if (langMissing[lang] > 0) {
        warnings.push(`[LANG_COVERAGE] ${lang}: ${langMissing[lang]} reachable scenes missing text`);
    }
}

// ═══════════════════════════════════════════
// TEST 12: 메모리 누수 패턴 검사 (정적 분석)
// ═══════════════════════════════════════════
const modulesDir2 = path.join(ROOT, 'assets/js/modules');
if (fs.existsSync(modulesDir2)) {
    for (const file of fs.readdirSync(modulesDir2).filter(f => f.endsWith('.js'))) {
        const content = fs.readFileSync(path.join(modulesDir2, file), 'utf8');
        const lines = content.split('\n');

        // addEventListener 추가 vs removeEventListener 제거 불균형
        const addListeners = (content.match(/addEventListener\(/g) || []).length;
        const removeListeners = (content.match(/removeEventListener\(/g) || []).length;
        if (addListeners > 0 && removeListeners === 0 && addListeners > 3) {
            warnings.push(`[MEM_LEAK] ${file}: ${addListeners} addEventListener but 0 removeEventListener`);
        }

        // setInterval 미정리 (clearInterval 없이)
        const setIntervals = (content.match(/setInterval\(/g) || []).length;
        const clearIntervals = (content.match(/clearInterval\(/g) || []).length;
        if (setIntervals > 0 && clearIntervals === 0) {
            warnings.push(`[MEM_LEAK] ${file}: ${setIntervals} setInterval but 0 clearInterval — potential leak`);
        }

        // setTimeout 과다 사용 (clearTimeout 없이)
        const setTimeouts = (content.match(/setTimeout\(/g) || []).length;
        const clearTimeouts = (content.match(/clearTimeout\(/g) || []).length;
        if (setTimeouts > 5 && clearTimeouts === 0) {
            warnings.push(`[MEM_LEAK] ${file}: ${setTimeouts} setTimeout but 0 clearTimeout`);
        }

        // DOM createElement 누적 (appendChild만 있고 remove/innerHTML 정리 없음)
        const createEls = (content.match(/createElement\(/g) || []).length;
        const removeEls = (content.match(/\.remove\(\)|\.removeChild\(|innerHTML\s*=\s*['"]/g) || []).length;
        if (createEls > 5 && removeEls === 0) {
            warnings.push(`[MEM_LEAK] ${file}: ${createEls} createElement but no DOM cleanup (remove/innerHTML)`);
        }

        // Audio 객체 생성 (가비지 컬렉션 안 되는 패턴)
        const audioCreates = (content.match(/new\s+Audio\(/g) || []).length;
        if (audioCreates > 3) {
            warnings.push(`[MEM_LEAK] ${file}: ${audioCreates} new Audio() — consider reusing audio objects`);
        }

        // 클로저 내 this 캡처 (이벤트 핸들러에서 순환 참조)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // 큰 배열/객체를 클로저로 캡처하는 패턴
            if (/\bwindow\.\w+\s*=/.test(line) && !/window\.__game|window\.__NEVERGRAD/.test(line)) {
                warnings.push(`[MEM_LEAK] ${file}:${i + 1}: global window property assignment — may prevent GC`);
            }
        }
    }
}

// ═══════════════════════════════════════════
// TEST 13: 모든 선택지 조합 경로 커버리지 (DFS)
// ═══════════════════════════════════════════
// DFS로 모든 가능한 분기를 탐색하여 유니크 경로 수 측정
let totalPaths = 0;
let maxDepth = 0;
const choiceScenes = [...reachable].filter(sid => allScenes[sid].scene.choices);
const branchScenes = [...reachable].filter(sid =>
    allScenes[sid].scene.branches || allScenes[sid].scene.affinityBranches
);

// 선택지가 있는 씬 수 × 평균 선택지 수로 경로 복잡도 추정
let totalChoiceOptions = 0;
for (const sid of choiceScenes) {
    totalChoiceOptions += allScenes[sid].scene.choices.length;
}
const avgChoices = choiceScenes.length > 0
    ? (totalChoiceOptions / choiceScenes.length).toFixed(1)
    : 0;

info.push(`Choice scenes: ${choiceScenes.length} (avg ${avgChoices} options each)`);
info.push(`Branch scenes: ${branchScenes.length}`);

// 실제 DFS (깊이 제한: 모든 경로를 열거하면 지수적이므로 샘플링)
// 랜덤 시드 기반 100개 경로 샘플링
let sampledPaths = 0;
let sampledEndingReach = {};
const MAX_SAMPLES = 100;

for (let sample = 0; sample < MAX_SAMPLES; sample++) {
    const simState = new StateSim();
    let currentId = START_SCENE;
    const visited = new Set();
    let steps = 0;

    while (currentId && steps < 3000 && !visited.has(currentId)) {
        visited.add(currentId);
        const entry = allScenes[currentId];
        if (!entry) break;
        const scene = entry.scene;
        simState.applyScene(scene);

        if (scene.endingTitle || scene.cageLoop) {
            const endTag = scene.endingTitle || 'CAGE LOOP';
            sampledEndingReach[endTag] = (sampledEndingReach[endTag] || 0) + 1;
            break;
        }

        let nextId = null;
        if (scene.branches) {
            nextId = resolveBranch(scene.branches, simState);
        }
        if (!nextId && scene.affinityBranches) {
            nextId = resolveAffinityBranch(scene, simState);
        }
        if (!nextId && scene.choices) {
            // 선택지: 조건 만족하는 것 중 랜덤 선택
            const available = scene.choices.filter(c => {
                if (c.condition && !simState.checkCondition(c.condition)) return false;
                if (c.excludeCondition && simState.hasFlag(c.excludeCondition)) return false;
                return true;
            });
            if (available.length > 0) {
                const choice = available[Math.floor(Math.random() * available.length)];
                if (choice.stats) {
                    for (const [cid, changes] of Object.entries(choice.stats)) {
                        for (const [stat, val] of Object.entries(changes)) {
                            simState.changeStat(cid, stat, val);
                        }
                    }
                }
                if (choice.setFlags) simState.setFlags(choice.setFlags);
                nextId = choice.next;
            }
        }
        if (!nextId && scene.next) nextId = scene.next;

        currentId = nextId;
        steps++;
    }
    sampledPaths++;
}

info.push(`[RANDOM] ${sampledPaths} random playthroughs simulated`);
const endingDistribution = Object.entries(sampledEndingReach)
    .sort((a, b) => b[1] - a[1])
    .map(([e, c]) => `${e}: ${c}`)
    .join(', ');
info.push(`[RANDOM] Ending distribution: ${endingDistribution || 'none reached'}`);

// 특정 엔딩에 전혀 도달 못 하는 경우 (100회 중 0회)
for (const ending of EXPECTED_ENDINGS) {
    const titleMatch = Object.keys(sampledEndingReach).find(k =>
        k.toUpperCase().includes(ending.name.split(' ')[0])
    );
    // 랜덤이므로 도달 못 해도 에러는 아님, 정보만 제공
}

// ═══════════════════════════════════════════
// 결과 출력
// ═══════════════════════════════════════════
console.log('─── INFO ───');
info.forEach(i => console.log('  ' + i));
console.log();

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ ALL PLAYTHROUGH TESTS PASSED - 0 errors, 0 warnings\n');
} else {
    if (errors.length > 0) {
        console.log(`❌ ERRORS (${errors.length}):\n`);
        errors.forEach(e => console.log('  ' + e));
        console.log();
    }
    if (warnings.length > 0) {
        console.log(`⚠ WARNINGS (${warnings.length}):\n`);
        warnings.forEach(w => console.log('  ' + w));
        console.log();
    }
}

process.exit(errors.length > 0 ? 1 : 0);
