/**
 * Nevergrad 종합 검증 스크립트
 * node validate.js 로 실행
 *
 * 검증 항목:
 *  1. 씬 참조 무결성 (next, choices, branches, affinityBranches, timeoutNext, fallback)
 *  2. 배경 이미지 파일 존재 (config BACKGROUNDS → 실제 파일)
 *  3. 캐릭터 표정 이미지 파일 존재 (config EXPRESSIONS → 실제 파일)
 *  4. 시나리오 character 키가 EXPRESSIONS에서 resolve 가능한지
 *  5. 시나리오 background 키가 BACKGROUNDS에 정의되어 있는지
 *  6. BGM 파일 존재
 *  7. i18n(ko) 키 ↔ 시나리오 scene ID 대응
 *  8. i18n choices 개수 일치
 *  9. 보조 텍스트 키 (endingSubtitle, flickerText, ghostText) i18n 존재
 * 10. 플래그 무결성 (condition에서 사용되지만 setFlags에서 설정 안 되는 것)
 * 11. HTML 스크립트 참조 파일 존재
 * 12. changeDay/changeSlot 일관성
 * 13. 다국어 빈 text 덮어쓰기 검사
 * 14. JSON 유효성
 * 15. 다국어 HTML 구조 동기화 (스크립트/링크 태그, DOM ID)
 * 16. JS 모듈 내 하드코딩 리소스 경로 검증
 * 17. JS 엔진 프로퍼티 참조 일관성 (app.js ↔ modules)
 * 18. HTML DOM ID ↔ JS getElementById 참조 일치
 * 19. CSS @keyframes 중복 정의 검사
 * 20. JS에서 사용하는 CSS 클래스 존재 여부
 * 21. i18n 플레이스홀더 검증 ({name}, {xxx} 패턴)
 * 22. 다국어 choices 배열 길이 일치 (ko 기준)
 * 23. i18n 텍스트 내 잔존 한국어 검사 (비ko 언어)
 *
 * ── 플레이스루 시뮬레이션 ──
 * 24. BFS 도달 가능성 + 고아 씬 검출
 * 25. Dead-End (막다른 씬) 검출
 * 26. 7개 엔딩 도달 + 플래그 기반 시뮬레이션
 * 27. 무한 루프 검출
 * 28. Day/Slot 전환 연속성
 * 29. 다국어 전체 텍스트 커버리지 (6개 언어 × 도달 가능 씬)
 * 30. 타이머 선택지 타임아웃 경로
 * 31. 빈 선택지 패널 검출
 * 32. 랜덤 플레이스루 100회 (엔딩 분포)
 *
 * ── 게임 UI / UX ──
 * 33. 게임 UI/UX 기능 완결성 (타이틀, 퀵메뉴, 대화, 선택지, 퍼즈, 백로그, 세이브/로드, 모바일)
 * 34. 메모리 누수 패턴 (addEventListener, setInterval, DOM, Audio, global)
 * 35. AI 프리토킹 시스템 (API 엔드포인트, 폴백, 에러 핸들링, 3모드 구현)
 *
 * ── 유저 엣지 케이스 ──
 * 36. localStorage 안전성 (JSON.parse try-catch, 용량 초과, 비활성화 대응)
 * 37. 이름 입력 보안 (maxlength, XSS via innerHTML, 빈 이름 처리)
 * 38. innerHTML XSS 위험 검사 (유저 입력이 innerHTML에 주입되는 경로)
 * 39. 오디오 autoplay 정책 대응 (AudioContext resume, 에러 핸들링)
 * 40. 이미지 로딩 실패 대응 (onerror 핸들러 존재)
 * 41. CSS z-index 스태킹 일관성 (오버레이 < 모달 < 최상위)
 * 42. 다국어 HTML maxlength/placeholder 동기화
 * 43. 중복 클릭 방지 (선택지/버튼 더블클릭 가드)
 * 44. JS 모듈 간 메서드 호출 정합성 (호출되는 메서드가 실제 존재하는지)
 * 45. getElementById 결과 null 가드 검사
 * 46. 브라우저 API 피쳐 디텍션 (vibrate, Battery, orientation 등)
 * 47. 세이브 역직렬화 스키마 안전성
 * 48. async/await 초기화 순서 검증
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SCENARIO_DIR = path.join(ROOT, 'assets/js/scenario');
const I18N_DIR = path.join(ROOT, 'assets/js/i18n');
const AUDIO_DIRS = [
    path.join(ROOT, 'assets/audio/bgm'),
    path.join(ROOT, 'assets/audio'),
    path.join(ROOT, 'assets/audio/sfx')
];

const errors = [];
const warnings = [];

// ═══════════════════════════════════════════
// Load config.js
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

const scenarioFiles = fs.readdirSync(SCENARIO_DIR).filter(f => /^day\d/.test(f) && f.endsWith('.js'));
for (const file of scenarioFiles) {
    const content = fs.readFileSync(path.join(SCENARIO_DIR, file), 'utf8');
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
const koDir = path.join(I18N_DIR, 'ko');
if (fs.existsSync(koDir)) {
    for (const file of fs.readdirSync(koDir).filter(f => f.endsWith('.json'))) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(koDir, file), 'utf8'));
            Object.assign(koData, data);
        } catch (e) {
            errors.push(`[I18N_LOAD] ko/${file}: ${e.message}`);
        }
    }
}

// ═══════════════════════════════════════════
// 1. 씬 참조 무결성
// ═══════════════════════════════════════════
function sceneExists(id) {
    return !id || id === null || allScenes[id] !== undefined;
}

for (const [sceneId, { day, scene }] of Object.entries(allScenes)) {
    // next
    if (scene.next && !sceneExists(scene.next)) {
        errors.push(`[SCENE_REF] ${sceneId}: next="${scene.next}" not found`);
    }
    // choices
    if (scene.choices) {
        scene.choices.forEach((c, i) => {
            if (c.next && !sceneExists(c.next)) {
                errors.push(`[SCENE_REF] ${sceneId} choices[${i}].next="${c.next}" not found`);
            }
        });
    }
    // branches
    if (scene.branches) {
        scene.branches.forEach((b, i) => {
            if (b.next && !sceneExists(b.next)) {
                errors.push(`[SCENE_REF] ${sceneId} branches[${i}].next="${b.next}" not found`);
            }
        });
    }
    // affinityBranches
    if (scene.affinityBranches) {
        scene.affinityBranches.forEach((b, i) => {
            if (b.next && !sceneExists(b.next)) {
                errors.push(`[SCENE_REF] ${sceneId} affinityBranches[${i}].next="${b.next}" not found`);
            }
        });
    }
    // timeoutNext
    if (scene.timeoutNext && !sceneExists(scene.timeoutNext)) {
        errors.push(`[SCENE_REF] ${sceneId}: timeoutNext="${scene.timeoutNext}" not found`);
    }
    // fallback
    if (scene.fallback && !sceneExists(scene.fallback)) {
        errors.push(`[SCENE_REF] ${sceneId}: fallback="${scene.fallback}" not found`);
    }
}

// ═══════════════════════════════════════════
// 2. 배경 이미지 파일 존재
// ═══════════════════════════════════════════
for (const [key, imgPath] of Object.entries(CONFIG.BACKGROUNDS)) {
    const full = path.join(ROOT, imgPath);
    if (!fs.existsSync(full)) {
        errors.push(`[BG_FILE] BACKGROUNDS.${key}: "${imgPath}" file not found`);
    }
}

// ═══════════════════════════════════════════
// 3. 캐릭터 표정 이미지 파일 존재
// ═══════════════════════════════════════════
for (const [charId, expressions] of Object.entries(CONFIG.EXPRESSIONS)) {
    for (const [expr, imgPath] of Object.entries(expressions)) {
        if (!imgPath) continue; // null은 의도적
        const full = path.join(ROOT, imgPath);
        if (!fs.existsSync(full)) {
            errors.push(`[CHAR_FILE] EXPRESSIONS.${charId}.${expr}: "${imgPath}" file not found`);
        }
    }
}

// ═══════════════════════════════════════════
// 4. 시나리오 character 키 → EXPRESSIONS resolve
// ═══════════════════════════════════════════
for (const [sceneId, { scene }] of Object.entries(allScenes)) {
    if (!scene.character || typeof scene.character !== 'string') continue;
    if (scene.character.includes('/')) continue; // 이미 경로면 skip

    const parts = scene.character.split('_');
    const charId = parts[0];
    const expression = parts.slice(1).join('_');

    if (!CONFIG.EXPRESSIONS[charId]) {
        errors.push(`[CHAR_KEY] ${sceneId}: character="${scene.character}" → charId "${charId}" not in EXPRESSIONS`);
    } else if (!CONFIG.EXPRESSIONS[charId][expression]) {
        errors.push(`[CHAR_KEY] ${sceneId}: character="${scene.character}" → expression "${expression}" not in EXPRESSIONS.${charId}`);
    }
}

// ═══════════════════════════════════════════
// 5. 시나리오 background 키 → BACKGROUNDS
// ═══════════════════════════════════════════
for (const [sceneId, { scene }] of Object.entries(allScenes)) {
    if (!scene.background || typeof scene.background !== 'string') continue;
    if (scene.background.includes('/') || scene.background.includes('.')) continue; // 이미 경로
    if (!CONFIG.BACKGROUNDS[scene.background]) {
        errors.push(`[BG_KEY] ${sceneId}: background="${scene.background}" not in CONFIG.BACKGROUNDS`);
    }
}

// ═══════════════════════════════════════════
// 6. BGM 파일 존재
// ═══════════════════════════════════════════
const bgmUsed = new Set();
for (const [, { scene }] of Object.entries(allScenes)) {
    if (scene.bgm && typeof scene.bgm === 'string') {
        bgmUsed.add(scene.bgm);
    }
}
for (const bgm of bgmUsed) {
    const found = AUDIO_DIRS.some(d => fs.existsSync(path.join(d, bgm)));
    if (!found) {
        errors.push(`[BGM_FILE] "${bgm}" not found in audio directories`);
    }
}

// ═══════════════════════════════════════════
// 7. i18n(ko) ↔ scene ID 대응
// ═══════════════════════════════════════════
const koKeys = new Set(Object.keys(koData));
const sceneIds = new Set(Object.keys(allScenes));

for (const sid of sceneIds) {
    if (!koKeys.has(sid)) {
        // 텍스트 불필요한 라우팅 노드는 warning으로
        warnings.push(`[I18N_MISS] scene "${sid}" has no ko i18n entry`);
    }
}

// ko에만 있는 키 (보조 텍스트는 정상)
const auxiliaryPrefixes = ['ending_', 'ghost_', 'flicker'];
for (const key of koKeys) {
    if (!sceneIds.has(key)) {
        const isAux = auxiliaryPrefixes.some(p => key.includes(p)) ||
                       key.includes('subtitle') || key.includes('ghost') || key.includes('flicker');
        if (!isAux) {
            warnings.push(`[I18N_EXTRA] ko key "${key}" has no matching scene ID`);
        }
    }
}

// ═══════════════════════════════════════════
// 8. i18n choices 개수 일치
// ═══════════════════════════════════════════
for (const [sceneId, { scene }] of Object.entries(allScenes)) {
    if (!scene.choices) continue;
    const i18n = koData[sceneId];
    if (!i18n || !i18n.choices) continue;
    if (scene.choices.length !== i18n.choices.length) {
        errors.push(`[CHOICES] ${sceneId}: JS=${scene.choices.length} i18n=${i18n.choices.length}`);
    }
}

// ═══════════════════════════════════════════
// 9. 보조 텍스트 키 존재
// ═══════════════════════════════════════════
for (const [sceneId, { scene }] of Object.entries(allScenes)) {
    if (scene.endingSubtitle && !koKeys.has(scene.endingSubtitle)) {
        errors.push(`[AUX_KEY] ${sceneId}: endingSubtitle="${scene.endingSubtitle}" not in ko i18n`);
    }
    if (scene.glitch) {
        if (scene.glitch.flickerText && !koKeys.has(scene.glitch.flickerText)) {
            errors.push(`[AUX_KEY] ${sceneId}: flickerText="${scene.glitch.flickerText}" not in ko i18n`);
        }
        if (scene.glitch.ghostText && typeof scene.glitch.ghostText === 'string' && !koKeys.has(scene.glitch.ghostText)) {
            errors.push(`[AUX_KEY] ${sceneId}: ghostText="${scene.glitch.ghostText}" not in ko i18n`);
        }
    }
}

// ═══════════════════════════════════════════
// 10. 플래그 무결성
// ═══════════════════════════════════════════
const flagsSet = new Set();
const flagsChecked = new Set();

for (const [, { scene }] of Object.entries(allScenes)) {
    // flags set
    if (scene.setFlag) flagsSet.add(scene.setFlag);
    if (scene.setFlags) scene.setFlags.forEach(f => flagsSet.add(f));
    if (scene.timeoutFlags) scene.timeoutFlags.forEach(f => flagsSet.add(f));
    if (scene.choices) scene.choices.forEach(c => {
        if (c.setFlag) flagsSet.add(c.setFlag);
        if (c.setFlags) c.setFlags.forEach(f => flagsSet.add(f));
    });

    // flags checked
    const addChecked = (c) => {
        if (!c) return;
        if (Array.isArray(c)) c.forEach(f => flagsChecked.add(f));
        else if (typeof c === 'string') flagsChecked.add(c);
    };
    if (scene.condition) addChecked(scene.condition);
    if (scene.branches) scene.branches.forEach(b => {
        addChecked(b.condition);
        if (b.excludeCondition) flagsChecked.add(b.excludeCondition);
    });
    if (scene.choices) scene.choices.forEach(c => {
        addChecked(c.condition);
        if (c.excludeCondition) flagsChecked.add(c.excludeCondition);
    });
}

for (const f of flagsChecked) {
    if (!flagsSet.has(f)) {
        errors.push(`[FLAG] "${f}" checked in condition but never set via setFlags`);
    }
}

// ═══════════════════════════════════════════
// 11. HTML 스크립트/CSS 참조 파일 존재
// ═══════════════════════════════════════════
const htmlPath = path.join(ROOT, 'index.html');
if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const srcRefs = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
    const hrefRefs = [...html.matchAll(/href="([^"]+\.css)"/g)].map(m => m[1]);

    for (const ref of [...srcRefs, ...hrefRefs]) {
        if (ref.startsWith('http')) continue;
        const full = path.join(ROOT, ref);
        if (!fs.existsSync(full)) {
            errors.push(`[HTML_REF] "${ref}" referenced in index.html but file not found`);
        }
    }
}

// ═══════════════════════════════════════════
// 12. changeDay/changeSlot 일관성
// ═══════════════════════════════════════════
const validSlots = ['morning', 'lunch', 'afterschool', 'night'];
for (const [sceneId, { scene }] of Object.entries(allScenes)) {
    if (scene.changeSlot && !validSlots.includes(scene.changeSlot)) {
        errors.push(`[SLOT] ${sceneId}: changeSlot="${scene.changeSlot}" is not a valid slot`);
    }
    if (scene.changeDay && scene.next) {
        const targetDay = scene.changeDay;
        if (!SCENARIO[targetDay] || !SCENARIO[targetDay][scene.next]) {
            // next 씬이 changeDay의 SCENARIO에 없으면 다른 day에서 찾기
            if (!allScenes[scene.next]) {
                errors.push(`[DAY_CHANGE] ${sceneId}: changeDay=${targetDay} next="${scene.next}" not found`);
            }
        }
    }
}

// ═══════════════════════════════════════════
// 13. 다국어 빈 text 덮어쓰기 검사
// ═══════════════════════════════════════════
const langs = ['en', 'ja', 'es', 'fr', 'de'];
for (const lang of langs) {
    const langDir = path.join(I18N_DIR, lang);
    if (!fs.existsSync(langDir)) continue;

    const langData = {};
    for (const file of fs.readdirSync(langDir).filter(f => f.endsWith('.json'))) {
        try {
            Object.assign(langData, JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf8')));
        } catch (e) {
            errors.push(`[I18N_JSON] ${lang}/${file}: ${e.message}`);
        }
    }

    // 빈 text가 ko의 비어있지 않은 text를 덮어쓰는지 확인
    for (const [key, val] of Object.entries(langData)) {
        const koVal = koData[key];
        if (!koVal) continue;
        if (val.text === '' && koVal.text && koVal.text !== '') {
            errors.push(`[I18N_EMPTY] ${lang}: "${key}" has empty text overwriting ko fallback`);
        }
    }
}

// ═══════════════════════════════════════════
// 14. JSON 유효성
// ═══════════════════════════════════════════
for (const lang of ['ko', ...langs]) {
    const langDir = path.join(I18N_DIR, lang);
    if (!fs.existsSync(langDir)) continue;
    for (const file of fs.readdirSync(langDir).filter(f => f.endsWith('.json'))) {
        try {
            JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf8'));
        } catch (e) {
            errors.push(`[JSON] ${lang}/${file}: ${e.message}`);
        }
    }
}

// ═══════════════════════════════════════════
// CSS 이미지 참조 검증
// ═══════════════════════════════════════════
const cssFiles = ['assets/css/style.css', 'assets/css/dialogue.css', 'assets/css/glitch.css'];
for (const cssFile of cssFiles) {
    const cssPath = path.join(ROOT, cssFile);
    if (!fs.existsSync(cssPath)) continue;
    const css = fs.readFileSync(cssPath, 'utf8');
    for (const m of css.matchAll(/url\(["']?([^)"']+\.(?:png|jpg|webp))["']?\)/g)) {
        const imgRef = m[1];
        const full = path.normalize(path.join(path.dirname(cssPath), imgRef));
        if (!fs.existsSync(full)) {
            errors.push(`[CSS_IMG] ${cssFile}: url("${imgRef}") → file not found`);
        }
    }
}

// ═══════════════════════════════════════════
// 15. 다국어 HTML 구조 동기화
// ═══════════════════════════════════════════
const koHtmlPath = path.join(ROOT, 'index.html');
if (fs.existsSync(koHtmlPath)) {
    const koHtml = fs.readFileSync(koHtmlPath, 'utf8');
    // ko HTML에서 스크립트/CSS 참조 추출 (파일명만)
    const koScripts = [...koHtml.matchAll(/src="([^"]+\.js)"/g)].map(m => path.basename(m[1]));
    const koStyles = [...koHtml.matchAll(/href="([^"]+\.css)"/g)].map(m => path.basename(m[1]));
    // ko HTML에서 DOM ID 추출
    const koIds = [...koHtml.matchAll(/id="([^"]+)"/g)].map(m => m[1]);

    for (const lang of langs) {
        const langHtml = path.join(ROOT, lang, 'index.html');
        if (!fs.existsSync(langHtml)) {
            errors.push(`[HTML_SYNC] ${lang}/index.html not found`);
            continue;
        }
        const html = fs.readFileSync(langHtml, 'utf8');
        const langScripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map(m => path.basename(m[1]));
        const langStyles = [...html.matchAll(/href="([^"]+\.css)"/g)].map(m => path.basename(m[1]));
        const langIds = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);

        // 스크립트 파일 비교
        for (const s of koScripts) {
            if (!langScripts.includes(s)) {
                errors.push(`[HTML_SYNC] ${lang}/index.html: missing script "${s}" (exists in ko)`);
            }
        }
        for (const s of langScripts) {
            if (!koScripts.includes(s)) {
                warnings.push(`[HTML_SYNC] ${lang}/index.html: extra script "${s}" (not in ko)`);
            }
        }
        // CSS 파일 비교
        for (const s of koStyles) {
            if (!langStyles.includes(s)) {
                errors.push(`[HTML_SYNC] ${lang}/index.html: missing CSS "${s}" (exists in ko)`);
            }
        }
        // DOM ID 비교
        for (const id of koIds) {
            if (!langIds.includes(id)) {
                errors.push(`[HTML_SYNC] ${lang}/index.html: missing DOM id="${id}" (exists in ko)`);
            }
        }
        // 다국어 HTML 리소스 참조 파일 존재
        const langSrcRefs = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
        const langHrefRefs = [...html.matchAll(/href="([^"]+\.css)"/g)].map(m => m[1]);
        for (const ref of [...langSrcRefs, ...langHrefRefs]) {
            if (ref.startsWith('http')) continue;
            const full = path.join(ROOT, lang, ref);
            if (!fs.existsSync(full)) {
                errors.push(`[HTML_REF] ${lang}/index.html: "${ref}" file not found`);
            }
        }
    }
}

// ═══════════════════════════════════════════
// 16. JS 모듈 내 하드코딩 리소스 경로 검증
// ═══════════════════════════════════════════
const JS_DIRS = [
    path.join(ROOT, 'assets/js/modules'),
    path.join(ROOT, 'assets/js')
];
const jsResourcePatterns = [
    // fetch('path'), fetch(`path`)
    /fetch\(\s*['"`]([^'"`$][^'"`]*\.(?:json|png|jpg|mp3|ogg|wav|webp|css|js))['"`]\s*\)/g,
    // .src = 'path'
    /\.src\s*=\s*['"]([^'"$][^'"]*\.(?:png|jpg|mp3|ogg|wav|webp))['"];?/g,
    // new Audio('path')
    /new\s+Audio\(\s*['"]([^'"]+\.(?:mp3|ogg|wav))['"]\s*\)/g,
];
for (const dir of JS_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const jsFiles = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    for (const file of jsFiles) {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        for (const pattern of jsResourcePatterns) {
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const ref = match[1];
                if (ref.includes('${') || ref.includes('$I18n')) continue; // 템플릿 리터럴 skip
                const full = path.join(ROOT, ref);
                if (!fs.existsSync(full)) {
                    const lineNum = content.substring(0, match.index).split('\n').length;
                    errors.push(`[JS_RES] ${file}:${lineNum}: "${ref}" file not found`);
                }
            }
        }
    }
}

// ═══════════════════════════════════════════
// 17. JS 엔진 프로퍼티 참조 일관성
// ═══════════════════════════════════════════
const appJsPath = path.join(ROOT, 'assets/js/app.js');
if (fs.existsSync(appJsPath)) {
    const appContent = fs.readFileSync(appJsPath, 'utf8');
    // app.js에서 game.xxx = new Xxx 패턴 추출
    const registeredProps = new Map();
    for (const m of appContent.matchAll(/game\.(\w+)\s*=\s*new\s+(\w+)/g)) {
        registeredProps.set(m[2], m[1]); // ClassName → propertyName
    }

    // modules에서 this.engine.xxx 참조 수집
    const modulesDir = path.join(ROOT, 'assets/js/modules');
    if (fs.existsSync(modulesDir)) {
        for (const file of fs.readdirSync(modulesDir).filter(f => f.endsWith('.js'))) {
            const content = fs.readFileSync(path.join(modulesDir, file), 'utf8');
            for (const m of content.matchAll(/this\.engine\.(\w+)/g)) {
                const propRef = m[1];
                // 기본 엔진 프로퍼티는 skip (state, i18n, dialogue, choice, etc.)
                const builtinProps = ['state', 'i18n', 'dialogue', 'choice', 'choiceAdv',
                    'scene', 'glitch', 'glitchAdv', 'audio', 'save', 'freeTalk',
                    '_loadScene', 'currentScene'];
                if (builtinProps.includes(propRef)) continue;
                // app.js에서 등록된 프로퍼티에 존재하는지 확인
                const registeredNames = [...registeredProps.values()];
                if (!registeredNames.includes(propRef) && !builtinProps.includes(propRef)) {
                    const lineNum = content.substring(0, m.index).split('\n').length;
                    warnings.push(`[PROP_REF] ${file}:${lineNum}: this.engine.${propRef} — not registered in app.js`);
                }
            }
        }
    }
}

// ═══════════════════════════════════════════
// 18. HTML DOM ID ↔ JS getElementById 참조 일치
// ═══════════════════════════════════════════
if (fs.existsSync(koHtmlPath)) {
    const koHtml = fs.readFileSync(koHtmlPath, 'utf8');
    const htmlIds = new Set([...koHtml.matchAll(/id="([^"]+)"/g)].map(m => m[1]));

    // JS에서 getElementById로 참조하는 ID 수집
    const modulesDir = path.join(ROOT, 'assets/js/modules');
    if (fs.existsSync(modulesDir)) {
        for (const file of fs.readdirSync(modulesDir).filter(f => f.endsWith('.js'))) {
            const content = fs.readFileSync(path.join(modulesDir, file), 'utf8');
            for (const m of content.matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)) {
                const id = m[1];
                if (!htmlIds.has(id)) {
                    // 동적으로 생성되는 ID는 warning
                    const lineNum = content.substring(0, m.index).split('\n').length;
                    warnings.push(`[DOM_ID] ${file}:${lineNum}: getElementById("${id}") — id not found in index.html`);
                }
            }
        }
    }
}

// ═══════════════════════════════════════════
// 19. CSS @keyframes 중복 정의 검사
// ═══════════════════════════════════════════
const keyframeMap = {}; // name → [file, ...]
for (const cssFile of cssFiles) {
    const cssPath = path.join(ROOT, cssFile);
    if (!fs.existsSync(cssPath)) continue;
    const css = fs.readFileSync(cssPath, 'utf8');
    for (const m of css.matchAll(/@keyframes\s+([\w-]+)/g)) {
        const name = m[1];
        if (!keyframeMap[name]) keyframeMap[name] = [];
        keyframeMap[name].push(cssFile);
    }
}
for (const [name, files] of Object.entries(keyframeMap)) {
    if (files.length > 1) {
        warnings.push(`[CSS_DUP_KF] @keyframes "${name}" defined in multiple files: ${files.join(', ')}`);
    }
}

// ═══════════════════════════════════════════
// 20. JS에서 사용하는 CSS 클래스 존재 여부
// ═══════════════════════════════════════════
// CSS에서 정의된 클래스 수집
const allCssClasses = new Set();
for (const cssFile of cssFiles) {
    const cssPath = path.join(ROOT, cssFile);
    if (!fs.existsSync(cssPath)) continue;
    const css = fs.readFileSync(cssPath, 'utf8');
    for (const m of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
        allCssClasses.add(m[1]);
    }
}
// HTML에서 정의된 클래스도 추가 (인라인)
if (fs.existsSync(koHtmlPath)) {
    const koHtml = fs.readFileSync(koHtmlPath, 'utf8');
    for (const m of koHtml.matchAll(/class="([^"]+)"/g)) {
        m[1].split(/\s+/).forEach(c => allCssClasses.add(c));
    }
}
// JS에서 className = 'xxx' 또는 classList.add('xxx') 패턴 수집
const jsClassPatterns = [
    /className\s*=\s*'([^']+)'/g,
    /className\s*=\s*"([^"]+)"/g,
    /classList\.add\(\s*'([^']+)'\s*\)/g,
    /classList\.add\(\s*"([^"]+)"\s*\)/g,
];
const knownDynamicClasses = new Set(['hidden', 'active', 'no-image', 'paused', 'disabled']);
{
    const modulesDir = path.join(ROOT, 'assets/js/modules');
    if (fs.existsSync(modulesDir)) {
        for (const file of fs.readdirSync(modulesDir).filter(f => f.endsWith('.js'))) {
            const content = fs.readFileSync(path.join(modulesDir, file), 'utf8');
            for (const pattern of jsClassPatterns) {
                pattern.lastIndex = 0;
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    const classes = match[1].split(/\s+/);
                    for (const cls of classes) {
                        if (knownDynamicClasses.has(cls)) continue;
                        if (!allCssClasses.has(cls)) {
                            const lineNum = content.substring(0, match.index).split('\n').length;
                            warnings.push(`[CSS_CLASS] ${file}:${lineNum}: class "${cls}" used in JS but not defined in CSS`);
                        }
                    }
                }
            }
        }
    }
}

// ═══════════════════════════════════════════
// 21. i18n 플레이스홀더 검증
// ═══════════════════════════════════════════
const validPlaceholders = new Set(['name', 'name?', '14th_name', 'new_name']);
for (const [key, val] of Object.entries(koData)) {
    if (!val.text) continue;
    for (const m of val.text.matchAll(/\{(\w+[?]?)\}/g)) {
        if (!validPlaceholders.has(m[1])) {
            warnings.push(`[PLACEHOLDER] ko "${key}": unknown placeholder {${m[1]}}`);
        }
    }
    // choices 내 플레이스홀더도 검사
    if (val.choices && Array.isArray(val.choices)) {
        val.choices.forEach((c, i) => {
            if (typeof c !== 'string') return;
            for (const m of c.matchAll(/\{(\w+[?]?)\}/g)) {
                if (!validPlaceholders.has(m[1])) {
                    warnings.push(`[PLACEHOLDER] ko "${key}" choices[${i}]: unknown placeholder {${m[1]}}`);
                }
            }
        });
    }
}

// ═══════════════════════════════════════════
// 22. 다국어 choices 배열 길이 일치 (ko 기준)
// ═══════════════════════════════════════════
for (const lang of langs) {
    const langDir = path.join(I18N_DIR, lang);
    if (!fs.existsSync(langDir)) continue;
    for (const file of fs.readdirSync(langDir).filter(f => f.endsWith('.json'))) {
        let langFileData;
        try {
            langFileData = JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf8'));
        } catch (e) { continue; }

        const koFilePath = path.join(koDir, file);
        if (!fs.existsSync(koFilePath)) continue;
        let koFileData;
        try {
            koFileData = JSON.parse(fs.readFileSync(koFilePath, 'utf8'));
        } catch (e) { continue; }

        for (const [key, koVal] of Object.entries(koFileData)) {
            if (!koVal.choices || !Array.isArray(koVal.choices)) continue;
            const langVal = langFileData[key];
            if (!langVal || !langVal.choices || !Array.isArray(langVal.choices)) continue;
            if (koVal.choices.length !== langVal.choices.length) {
                errors.push(`[I18N_CHOICES] ${lang}/${file} "${key}": ko=${koVal.choices.length} ${lang}=${langVal.choices.length}`);
            }
        }
    }
}

// ═══════════════════════════════════════════
// 23. i18n 텍스트 내 잔존 한국어 검사 (비ko 언어)
// ═══════════════════════════════════════════
const koreanRange = /[\uAC00-\uD7AF]/;
for (const lang of langs) {
    const langDir = path.join(I18N_DIR, lang);
    if (!fs.existsSync(langDir)) continue;
    for (const file of fs.readdirSync(langDir).filter(f => f.endsWith('.json'))) {
        let langFileData;
        try {
            langFileData = JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf8'));
        } catch (e) { continue; }

        for (const [key, val] of Object.entries(langFileData)) {
            if (!val.text || val.text === '') continue;
            if (koreanRange.test(val.text)) {
                // name 필드가 아닌 text 필드에 한국어가 있는 경우
                errors.push(`[I18N_KO_TEXT] ${lang}/${file} "${key}": text contains Korean characters`);
            }
            // choices 내 한국어 검사
            if (val.choices && Array.isArray(val.choices)) {
                val.choices.forEach((c, i) => {
                    if (typeof c === 'string' && koreanRange.test(c)) {
                        errors.push(`[I18N_KO_TEXT] ${lang}/${file} "${key}" choices[${i}]: contains Korean characters`);
                    }
                });
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
//
//  ▼▼▼ 플레이스루 시뮬레이션 + 게임 UI + 메모리 누수 검증 ▼▼▼
//
// ═══════════════════════════════════════════════════════════════════

const playInfo = [];

// ── State Simulator (mirrors StateManager) ──
class StateSim {
    constructor() { this.reset(); }
    reset() {
        this.currentDay = 1; this.currentSlot = 'morning'; this.mode = 'romance';
        this.flags = {}; this.stats = {};
        for (const [id, init] of Object.entries(INITIAL_STATS)) this.stats[id] = { ...init };
    }
    hasFlag(f) { return !!this.flags[f]; }
    setFlag(f) { this.flags[f] = true; }
    setFlags(arr) { if (Array.isArray(arr)) arr.forEach(f => this.setFlag(f)); }
    clearFlag(f) { delete this.flags[f]; }
    changeStat(cid, stat, d) {
        if (!this.stats[cid]) return;
        this.stats[cid][stat] = Math.max(-100, Math.min(100, (this.stats[cid][stat]||0) + d));
    }
    getDisplayAffinity(cid) {
        const s = this.stats[cid]; if (!s) return 0;
        return this.mode === 'romance' ? Math.round(s.affinity*0.6 + s.danger*0.4) : s.affinity;
    }
    checkCondition(c) {
        if (!c) return true;
        return Array.isArray(c) ? c.every(f => this.hasFlag(f)) : this.hasFlag(c);
    }
    applyScene(scene) {
        if (scene.setFlag) this.setFlag(scene.setFlag);
        if (scene.setFlags) this.setFlags(scene.setFlags);
        if (scene.clearFlags) scene.clearFlags.forEach(f => this.clearFlag(f));
        if (scene.stats) {
            for (const [cid, ch] of Object.entries(scene.stats))
                for (const [st, v] of Object.entries(ch)) this.changeStat(cid, st, v);
        }
        if (scene.changeDay) this.currentDay = scene.changeDay;
        if (scene.changeSlot) this.currentSlot = scene.changeSlot;
        if (scene.triggerGenreShift) this.mode = 'thriller';
    }
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
    const cid = scene.affinityChar; if (!cid) return null;
    const aff = state.getDisplayAffinity(cid);
    const sorted = [...(scene.affinityBranches||[])].sort((a,b) => b.minAffinity - a.minAffinity);
    for (const b of sorted) { if (aff >= b.minAffinity) return b.next; }
    return null;
}

// ═══════════════════════════════════════════
// 24. BFS 도달 가능성 + 고아 씬
// ═══════════════════════════════════════════
const START_SCENE = 'day1_opening_1';
const reachable = new Set();
const bfsQ = [START_SCENE];
while (bfsQ.length > 0) {
    const sid = bfsQ.shift();
    if (reachable.has(sid) || !allScenes[sid]) continue;
    reachable.add(sid);
    const sc = allScenes[sid].scene;
    [sc.next, sc.fallback, sc.timeoutNext].forEach(n => { if (n && !reachable.has(n)) bfsQ.push(n); });
    if (allScenes[sid+'_alt'] && !reachable.has(sid+'_alt')) bfsQ.push(sid+'_alt');
    (sc.choices||[]).forEach(c => { if (c.next && !reachable.has(c.next)) bfsQ.push(c.next); });
    (sc.branches||[]).forEach(b => { if (b.next && !reachable.has(b.next)) bfsQ.push(b.next); });
    (sc.affinityBranches||[]).forEach(b => { if (b.next && !reachable.has(b.next)) bfsQ.push(b.next); });
}
const orphans = Object.keys(allScenes).filter(id => !reachable.has(id));
orphans.forEach(id => errors.push(`[ORPHAN] "${id}" unreachable from ${START_SCENE}`));
playInfo.push(`Reachable: ${reachable.size} / ${Object.keys(allScenes).length} (orphans: ${orphans.length})`);

// ═══════════════════════════════════════════
// 25. Dead-End 검출
// ═══════════════════════════════════════════
for (const sid of reachable) {
    const sc = allScenes[sid].scene;
    const hasExit = sc.next || sc.choices || sc.branches || sc.affinityBranches ||
                    sc.endingTitle || sc.cageLoop || sc.type === 'free_talk' ||
                    sid.includes('postcredit') || sid.includes('credit_end');
    if (!hasExit) errors.push(`[DEAD_END] "${sid}" has no exit`);
}

// ═══════════════════════════════════════════
// 26. 엔딩 도달 가능성 + 플레이스루 시뮬레이션
// ═══════════════════════════════════════════
const ENDINGS = [
    { name: 'TRUE END', pattern: 'ending_true' },
    { name: 'ESCAPE END', pattern: 'ending_escape' },
    { name: 'RESIST END', pattern: 'ending_resist' },
    { name: 'CAGE END', pattern: 'ending_cage' },
    { name: 'FORGET END', pattern: 'ending_forget' },
    { name: 'GHOST END', pattern: 'ending_ghost' },
    { name: 'COMPLICIT END', pattern: 'ending_complicit' },
];
const foundEndings = [];
for (const e of ENDINGS) {
    const found = [...reachable].some(sid => {
        const sc = allScenes[sid]?.scene;
        return (sc?.endingTitle || sc?.cageLoop) && sid.includes(e.pattern);
    });
    if (found) foundEndings.push(e.name);
    else errors.push(`[ENDING] "${e.name}" — not reachable`);
}
playInfo.push(`Endings: ${foundEndings.length}/${ENDINGS.length}`);

// 엔딩별 시뮬레이션
const PRESETS = [
    { name: 'TRUE', flags: ['broke_through_eunsu','escape_with_yuna','has_evidence'], target: 'ending_true' },
    { name: 'ESCAPE', flags: ['broke_through_eunsu','escape_with_yuna'], target: 'ending_escape' },
    { name: 'RESIST', flags: ['chose_together'], target: 'ending_resist' },
    { name: 'CAGE(E)', flags: ['stayed_with_eunsu'], target: 'ending_cage' },
    { name: 'CAGE(S)', flags: ['stayed_with_sea'], target: 'ending_cage' },
    { name: 'FORGET', flags: ['chose_forget'], target: 'ending_forget' },
    { name: 'GHOST', flags: ['timer_expired'], target: 'ending_ghost' },
    { name: 'COMPLICIT', flags: ['complicit_route','high_eunsu_affinity'], target: 'ending_complicit',
      stats: { eunsu: { affinity: 70, danger: 60 } } },
];

const routingScenes = Object.keys(allScenes).filter(id =>
    id.includes('day5_night') && allScenes[id].scene.branches &&
    allScenes[id].scene.branches.some(b => b.next?.includes('ending'))
);

for (const p of PRESETS) {
    const st = new StateSim();
    st.currentDay = 5; st.currentSlot = 'night'; st.mode = 'thriller';
    p.flags.forEach(f => st.setFlag(f));
    if (p.stats) for (const [c, ch] of Object.entries(p.stats))
        for (const [s, v] of Object.entries(ch)) st.stats[c][s] = v;

    let reached = false;
    for (const rid of routingScenes) {
        let cur = rid; const vis = new Set(); let steps = 0;
        while (cur && steps < 500 && !vis.has(cur)) {
            vis.add(cur);
            const entry = allScenes[cur]; if (!entry) break;
            const sc = entry.scene; st.applyScene(sc);
            if ((sc.endingTitle || sc.cageLoop) && cur.includes(p.target)) { reached = true; break; }
            let nx = null;
            if (sc.branches) nx = resolveBranch(sc.branches, st);
            if (!nx && sc.affinityBranches) nx = resolveAffinityBranch(sc, st);
            if (!nx && sc.next) nx = sc.next;
            cur = nx; steps++;
        }
        if (reached) break;
    }
    if (!reached) errors.push(`[PLAYTHROUGH] ${p.name} — ending unreachable`);
}

// ═══════════════════════════════════════════
// 27. 무한 루프 검출
// ═══════════════════════════════════════════
for (const sid of reachable) {
    const sc = allScenes[sid].scene;
    if (sc.next === sid && !sc.cageLoop) errors.push(`[LOOP] "${sid}" self-loop without cageLoop`);
    if (sc.next && allScenes[sc.next]?.scene?.next === sid &&
        !sc.choices && !allScenes[sc.next].scene.choices && !sc.cageLoop)
        warnings.push(`[LOOP] 2-node cycle: "${sid}" ↔ "${sc.next}"`);
}

// ═══════════════════════════════════════════
// 28. Day/Slot 전환 연속성
// ═══════════════════════════════════════════
{
    const st = new StateSim();
    let cur = START_SCENE; const vis = new Set(); let lastDay = 1; let steps = 0;
    while (cur && steps < 3000 && !vis.has(cur)) {
        vis.add(cur);
        const entry = allScenes[cur]; if (!entry) break;
        const sc = entry.scene; st.applyScene(sc);
        if (sc.changeDay && sc.changeDay !== lastDay) {
            if (sc.changeDay !== lastDay + 1)
                warnings.push(`[DAY_SEQ] "${cur}": day jump ${lastDay}→${sc.changeDay}`);
            lastDay = sc.changeDay;
        }
        if (sc.endingTitle || sc.cageLoop) break;
        let nx = null;
        if (sc.branches) nx = resolveBranch(sc.branches, st);
        if (!nx && sc.affinityBranches) nx = resolveAffinityBranch(sc, st);
        if (!nx && sc.choices) {
            for (const c of sc.choices) {
                if (c.condition && !st.checkCondition(c.condition)) continue;
                if (c.excludeCondition && st.hasFlag(c.excludeCondition)) continue;
                if (c.stats) for (const [cid,ch] of Object.entries(c.stats))
                    for (const [s,v] of Object.entries(ch)) st.changeStat(cid,s,v);
                if (c.setFlags) st.setFlags(c.setFlags);
                nx = c.next; break;
            }
        }
        if (!nx && sc.next) nx = sc.next;
        cur = nx; steps++;
    }
    if (steps >= 3000) errors.push(`[MAIN_PATH] exceeded 3000 steps — infinite loop?`);
    playInfo.push(`Main path: ${vis.size} scenes, ${steps} steps`);
}

// ═══════════════════════════════════════════
// 29. 다국어 전체 텍스트 커버리지
// ═══════════════════════════════════════════
const allLangs = ['ko', ...langs];
const langAllData = {};
for (const lang of allLangs) {
    langAllData[lang] = {};
    const dir = path.join(I18N_DIR, lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
        try { Object.assign(langAllData[lang], JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))); }
        catch(e) {}
    }
}
const textScenes = [...reachable].filter(sid => {
    const sc = allScenes[sid].scene;
    return !sc.branches && !sc.affinityBranches && !sc.endingTitle && !sc.cageLoop;
});
for (const lang of allLangs) {
    let missing = 0;
    for (const sid of textScenes) {
        const e = langAllData[lang][sid];
        if (!e || (!e.text && !e.choices)) missing++;
    }
    if (missing > 0) warnings.push(`[LANG] ${lang}: ${missing} reachable scenes missing text (${((textScenes.length-missing)/textScenes.length*100).toFixed(1)}% coverage)`);
}

// ═══════════════════════════════════════════
// 30. 타이머 선택지 타임아웃 경로
// ═══════════════════════════════════════════
for (const sid of reachable) {
    const sc = allScenes[sid].scene;
    if (!sc.timedChoice) continue;
    if (!sc.timeoutNext && !sc.next)
        errors.push(`[TIMEOUT] "${sid}" timed choice with no timeoutNext/next`);
    if (sc.timeoutNext && !allScenes[sc.timeoutNext])
        errors.push(`[TIMEOUT] "${sid}" timeoutNext "${sc.timeoutNext}" not found`);
}

// ═══════════════════════════════════════════
// 31. 빈 선택지 패널 검출
// ═══════════════════════════════════════════
for (const sid of reachable) {
    const sc = allScenes[sid].scene;
    if (!sc.choices) continue;
    if (sc.choices.every(c => c.condition || c.excludeCondition) && !sc.timedChoice)
        warnings.push(`[EMPTY_CHOICES] "${sid}" all choices conditional — may show empty panel`);
}

// ═══════════════════════════════════════════
// 32. 랜덤 플레이스루 100회 (엔딩 분포)
// ═══════════════════════════════════════════
{
    const endingDist = {};
    for (let i = 0; i < 100; i++) {
        const st = new StateSim();
        let cur = START_SCENE; const vis = new Set(); let steps = 0;
        while (cur && steps < 3000 && !vis.has(cur)) {
            vis.add(cur);
            const entry = allScenes[cur]; if (!entry) break;
            const sc = entry.scene; st.applyScene(sc);
            if (sc.endingTitle || sc.cageLoop) {
                const tag = sc.endingTitle || 'CAGE LOOP';
                endingDist[tag] = (endingDist[tag]||0) + 1; break;
            }
            let nx = null;
            if (sc.branches) nx = resolveBranch(sc.branches, st);
            if (!nx && sc.affinityBranches) nx = resolveAffinityBranch(sc, st);
            if (!nx && sc.choices) {
                const avail = sc.choices.filter(c => {
                    if (c.condition && !st.checkCondition(c.condition)) return false;
                    if (c.excludeCondition && st.hasFlag(c.excludeCondition)) return false;
                    return true;
                });
                if (avail.length) {
                    const c = avail[Math.floor(Math.random()*avail.length)];
                    if (c.stats) for (const [cid,ch] of Object.entries(c.stats))
                        for (const [s,v] of Object.entries(ch)) st.changeStat(cid,s,v);
                    if (c.setFlags) st.setFlags(c.setFlags);
                    nx = c.next;
                }
            }
            if (!nx && sc.next) nx = sc.next;
            cur = nx; steps++;
        }
    }
    const dist = Object.entries(endingDist).sort((a,b)=>b[1]-a[1]).map(([e,c])=>`${e}:${c}`).join(' ');
    playInfo.push(`Random 100 runs: ${dist || 'none reached'}`);
}

// ═══════════════════════════════════════════
// 33. 게임 UI / UX 기능 완결성 검사
// ═══════════════════════════════════════════
const koHtmlContent = fs.existsSync(path.join(ROOT, 'index.html'))
    ? fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8') : '';
const geContent = fs.existsSync(path.join(ROOT, 'assets/js/modules/GameEngine.js'))
    ? fs.readFileSync(path.join(ROOT, 'assets/js/modules/GameEngine.js'), 'utf8') : '';
const allJsContent = {};
if (fs.existsSync(path.join(ROOT, 'assets/js/modules'))) {
    for (const f of fs.readdirSync(path.join(ROOT, 'assets/js/modules')).filter(f => f.endsWith('.js'))) {
        allJsContent[f] = fs.readFileSync(path.join(ROOT, 'assets/js/modules', f), 'utf8');
    }
}
const appContent = fs.existsSync(path.join(ROOT, 'assets/js/app.js'))
    ? fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8') : '';
const allJsCombined = Object.values(allJsContent).join('\n') + '\n' + appContent;

// ── 타이틀 화면 ──
const titleButtons = ['btn-new-game','btn-start','btn-continue','btn-gallery'];
for (const btn of titleButtons) {
    if (koHtmlContent.includes(`id="${btn}"`) && !allJsCombined.includes(btn))
        warnings.push(`[UI_TITLE] ${btn}: button has no event listener`);
}
// 이름 입력
if (koHtmlContent.includes('id="player-name-input"') && !allJsCombined.includes('player-name-input'))
    errors.push(`[UI_TITLE] player-name-input: no JS reference`);

// ── 인게임 퀵 메뉴 ──
const qmButtons = ['qm-auto','qm-skip','qm-log','qm-save','qm-load','qm-menu'];
for (const btn of qmButtons) {
    if (koHtmlContent.includes(`id="${btn}"`) && !allJsCombined.includes(btn))
        errors.push(`[UI_QM] ${btn}: quick menu button has no event listener`);
}

// ── 대화 클릭 진행 ──
if (koHtmlContent.includes('id="dialogue-box"') && !allJsCombined.includes('dialogue-box'))
    errors.push(`[UI_DIAL] dialogue-box: no click handler for advancing text`);

// ── 선택지 패널 ──
if (koHtmlContent.includes('id="choice-panel"') && !allJsCombined.includes('choice-panel'))
    errors.push(`[UI_CHOICE] choice-panel: no JS reference`);

// ── 퍼즈 메뉴 ──
const pauseButtons = ['btn-save','btn-load','btn-settings','btn-title','btn-resume'];
for (const btn of pauseButtons) {
    if (koHtmlContent.includes(`id="${btn}"`) && !allJsCombined.includes(btn))
        warnings.push(`[UI_PAUSE] ${btn}: pause menu button has no event listener`);
}

// ── 백로그 ──
if (koHtmlContent.includes('id="backlog-panel"') && !allJsCombined.includes('backlog-panel'))
    warnings.push(`[UI_LOG] backlog-panel: no JS reference`);
if (koHtmlContent.includes('id="backlog-close"') && !allJsCombined.includes('backlog-close'))
    warnings.push(`[UI_LOG] backlog-close: no event listener`);

// ── 세이브 슬롯 UI ──
if (koHtmlContent.includes('id="save-slot-overlay"')) {
    if (!allJsCombined.includes('save-slot-overlay'))
        warnings.push(`[UI_SAVE] save-slot-overlay: no JS reference`);
}
if (koHtmlContent.includes('id="save-slot-list"') && !allJsCombined.includes('save-slot-list'))
    warnings.push(`[UI_SAVE] save-slot-list: no JS reference`);

// ── 모바일 회전 프롬프트 ──
if (koHtmlContent.includes('id="rotate-prompt"') && !allJsCombined.includes('rotate-prompt'))
    warnings.push(`[UI_MOBILE] rotate-prompt: no JS reference`);

// ── 배경/캐릭터 레이어 ──
const renderElements = ['bg-layer','bg-overlay','char-left','char-center','char-right','glitch-overlay'];
for (const el of renderElements) {
    if (koHtmlContent.includes(`id="${el}"`) && !allJsCombined.includes(el))
        errors.push(`[UI_RENDER] ${el}: render element has no JS reference`);
}

// ── 스탯 표시 ──
if (koHtmlContent.includes('id="stat-display"') && !allJsCombined.includes('stat-display'))
    warnings.push(`[UI_STAT] stat-display: no JS reference`);
if (koHtmlContent.includes('id="day-display"') && !allJsCombined.includes('day-display'))
    warnings.push(`[UI_STAT] day-display: no JS reference`);

// ── 모든 HTML id에 대해 JS 참조 존재 확인 ──
const htmlIds = [...koHtmlContent.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
const unreferencedIds = htmlIds.filter(id => !allJsCombined.includes(id));
if (unreferencedIds.length > 0) {
    warnings.push(`[UI_ORPHAN_ID] ${unreferencedIds.length} HTML ids with no JS reference: ${unreferencedIds.slice(0,5).join(', ')}${unreferencedIds.length > 5 ? '...' : ''}`);
}

// ═══════════════════════════════════════════
// 35. AI 프리토킹 시스템 검증
// ═══════════════════════════════════════════
const ftsPath = path.join(ROOT, 'assets/js/modules/FreeTalkSystem.js');
if (fs.existsSync(ftsPath)) {
    const ftsContent = fs.readFileSync(ftsPath, 'utf8');

    // API 엔드포인트가 config에 정의되어 있는지
    if (!CONFIG.API_ENDPOINT) {
        errors.push(`[FREETALK] CONFIG.API_ENDPOINT not defined`);
    }
    if (!CONFIG.APP_TYPE) {
        errors.push(`[FREETALK] CONFIG.APP_TYPE not defined`);
    }

    // 폴백 응답 존재 여부 (네트워크 오류 시 하드코딩 텍스트)
    if (!ftsContent.includes('FALLBACK_RESPONSES') && !ftsContent.includes('fallback')) {
        errors.push(`[FREETALK] No FALLBACK_RESPONSES — network error will crash`);
    }

    // API 오류 핸들링 (try-catch)
    const apiCalls = (ftsContent.match(/fetch\(/g) || []).length;
    const tryCatches = (ftsContent.match(/try\s*\{/g) || []).length;
    if (apiCalls > 0 && tryCatches === 0) {
        errors.push(`[FREETALK] ${apiCalls} fetch calls but no try-catch error handling`);
    }

    // 3가지 모드 구현 확인 (interrogation, messenger, nightmare)
    const modes = ['interrogation', 'messenger', 'nightmare'];
    for (const mode of modes) {
        if (!ftsContent.includes(mode)) {
            warnings.push(`[FREETALK] mode "${mode}" not found in FreeTalkSystem.js`);
        }
    }

    // GameEngine에서 _startFreeTalk가 실제 FreeTalkSystem 호출하는지
    if (geContent.includes('_startFreeTalk') && !geContent.includes('freeTalk.')) {
        warnings.push(`[FREETALK] _startFreeTalk exists but does not call freeTalk system`);
    }

    // 프리토킹 씬이 시나리오에 있는지
    const ftScenes = Object.values(allScenes).filter(({scene}) => scene.type === 'free_talk');
    playInfo.push(`FreeTalk scenes: ${ftScenes.length}`);
    if (ftScenes.length === 0) {
        warnings.push(`[FREETALK] No scenes with type="free_talk" in scenarios`);
    }

    // 입력 UI 요소 존재 확인
    if (ftsContent.includes('freetalk-input') && !koHtmlContent.includes('freetalk-input')) {
        // 동적 생성이면 OK — CSS에 스타일이 있는지만 체크
        const allCss = cssFiles.map(f => {
            const p = path.join(ROOT, f);
            return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
        }).join('\n');
        if (!allCss.includes('freetalk-input')) {
            warnings.push(`[FREETALK] freetalk-input class used but no CSS style defined`);
        }
    }

    // 타임아웃/레이트 리밋 처리
    if (ftsContent.includes('fetch(') && !ftsContent.includes('timeout') && !ftsContent.includes('AbortController')) {
        warnings.push(`[FREETALK] API fetch has no timeout — may hang indefinitely`);
    }
} else {
    errors.push(`[FREETALK] FreeTalkSystem.js not found`);
}

// ═══════════════════════════════════════════
// 34. 메모리 누수 패턴 검사
// ═══════════════════════════════════════════
const modulesPath = path.join(ROOT, 'assets/js/modules');
if (fs.existsSync(modulesPath)) {
    for (const file of fs.readdirSync(modulesPath).filter(f => f.endsWith('.js'))) {
        const content = fs.readFileSync(path.join(modulesPath, file), 'utf8');

        const addEL = (content.match(/addEventListener\(/g)||[]).length;
        const rmEL = (content.match(/removeEventListener\(/g)||[]).length;
        if (addEL > 3 && rmEL === 0)
            warnings.push(`[MEM] ${file}: ${addEL} addEventListener, 0 removeEventListener`);

        const setI = (content.match(/setInterval\(/g)||[]).length;
        const clearI = (content.match(/clearInterval\(/g)||[]).length;
        if (setI > 0 && clearI === 0)
            warnings.push(`[MEM] ${file}: ${setI} setInterval, 0 clearInterval`);

        const setT = (content.match(/setTimeout\(/g)||[]).length;
        const clearT = (content.match(/clearTimeout\(/g)||[]).length;
        if (setT > 5 && clearT === 0)
            warnings.push(`[MEM] ${file}: ${setT} setTimeout, 0 clearTimeout`);

        const createEl = (content.match(/createElement\(/g)||[]).length;
        const removeEl = (content.match(/\.remove\(\)|\.removeChild\(|innerHTML\s*=\s*['"]/g)||[]).length;
        if (createEl > 5 && removeEl === 0)
            warnings.push(`[MEM] ${file}: ${createEl} createElement, no DOM cleanup`);

        for (const m of content.matchAll(/\bwindow\.(\w+)\s*=/g)) {
            if (!['__game','__NEVERGRAD_LANG__','__NEVERGRAD_BASE__'].includes(`__${m[1]}`) &&
                !m[1].startsWith('__'))
                warnings.push(`[MEM] ${file}: window.${m[1]} global — may prevent GC`);
        }
    }
}

// ═══════════════════════════════════════════
// 36. localStorage 안전성
// ═══════════════════════════════════════════
{
    const smPath = path.join(ROOT, 'assets/js/modules/SaveManager.js');
    if (fs.existsSync(smPath)) {
        const sm = fs.readFileSync(smPath, 'utf8');
        // JSON.parse가 try-catch 안에 있는지 확인
        const parseCount = (sm.match(/JSON\.parse/g) || []).length;
        const tryCount = (sm.match(/try\s*\{/g) || []).length;
        if (parseCount > tryCount) {
            errors.push(`[STORAGE] SaveManager.js: ${parseCount} JSON.parse but only ${tryCount} try blocks — crash on corrupted data`);
        }
        // localStorage.setItem에 대한 try-catch (용량 초과 대비)
        const setItemCount = (sm.match(/localStorage\.setItem/g) || []).length;
        if (setItemCount > 0 && !sm.includes('QuotaExceededError') && tryCount < setItemCount) {
            warnings.push(`[STORAGE] SaveManager.js: ${setItemCount} setItem calls — no QuotaExceededError handling`);
        }
    }
}

// ═══════════════════════════════════════════
// 37. 이름 입력 안전성
// ═══════════════════════════════════════════
{
    // HTML에 maxlength가 있는지
    if (koHtmlContent.includes('player-name-input') && !koHtmlContent.includes('maxlength')) {
        errors.push(`[INPUT] player-name-input: no maxlength attribute — allows infinite input`);
    }
    // 빈 이름 제출 가드
    if (geContent.includes('player-name-input') &&
        !geContent.includes('.trim()') && !geContent.includes('length')) {
        warnings.push(`[INPUT] player-name-input: no empty name validation`);
    }
    // 이름이 textContent로 삽입되는지 (innerHTML이면 XSS 위험)
    if (geContent.includes('playerName') && geContent.includes('innerHTML')) {
        // playerName이 innerHTML 근처에 쓰이는지 체크
        const lines = geContent.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('innerHTML') && lines[i].includes('playerName')) {
                errors.push(`[XSS] GameEngine.js:${i+1}: playerName injected via innerHTML`);
            }
        }
    }
}

// ═══════════════════════════════════════════
// 38. innerHTML XSS 위험 검사
// ═══════════════════════════════════════════
{
    // i18n 텍스트가 innerHTML로 주입되는 경우 체크
    // i18n 텍스트는 JSON에서 오므로 상대적으로 안전하지만, 유저 입력({name})이 포함됨
    for (const [file, content] of Object.entries(allJsContent)) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // innerHTML에 변수를 직접 삽입하는 패턴 (템플릿 리터럴)
            if (line.includes('innerHTML') && line.includes('${') &&
                (line.includes('playerName') || line.includes('state.') || line.includes('input'))) {
                warnings.push(`[XSS] ${file}:${i+1}: dynamic content in innerHTML via template literal`);
            }
        }
    }
}

// ═══════════════════════════════════════════
// 39. 오디오 autoplay 정책 대응
// ═══════════════════════════════════════════
{
    const amPath = path.join(ROOT, 'assets/js/modules/AudioManager.js');
    if (fs.existsSync(amPath)) {
        const am = fs.readFileSync(amPath, 'utf8');
        // AudioContext resume 존재 확인
        if (!am.includes('.resume()')) {
            errors.push(`[AUDIO] AudioManager.js: no AudioContext.resume() — audio will not play on mobile`);
        }
        // 사용자 인터랙션에서 unlock 처리
        if (!am.includes('click') && !am.includes('touchstart') && !am.includes('interaction')) {
            warnings.push(`[AUDIO] AudioManager.js: no user interaction listener for audio unlock`);
        }
        // 오디오 로딩 에러 핸들링
        if (am.includes('fetch(') && !am.includes('.catch') && !am.includes('try')) {
            warnings.push(`[AUDIO] AudioManager.js: audio fetch without error handling`);
        }
    }
}

// ═══════════════════════════════════════════
// 40. 이미지 로딩 실패 대응
// ═══════════════════════════════════════════
{
    const srPath = path.join(ROOT, 'assets/js/modules/SceneRenderer.js');
    if (fs.existsSync(srPath)) {
        const sr = fs.readFileSync(srPath, 'utf8');
        if (sr.includes('.src =') && !sr.includes('onerror') && !sr.includes('.catch')) {
            warnings.push(`[IMG] SceneRenderer.js: image .src assignment without onerror handler — broken images shown`);
        }
    }
}

// ═══════════════════════════════════════════
// 41. CSS z-index 스태킹 일관성
// ═══════════════════════════════════════════
{
    const zIndexMap = {};
    for (const cssFile of cssFiles) {
        const cssPath2 = path.join(ROOT, cssFile);
        if (!fs.existsSync(cssPath2)) continue;
        const css = fs.readFileSync(cssPath2, 'utf8');
        for (const m of css.matchAll(/([.#][\w-]+)\s*\{[^}]*z-index:\s*(\d+)/g)) {
            const selector = m[1];
            const zIndex = parseInt(m[2]);
            zIndexMap[selector] = { zIndex, file: cssFile };
        }
    }
    // 오버레이 계층 검사: overlay는 game-screen보다 높아야 함
    const overlayZ = Object.entries(zIndexMap).filter(([sel]) =>
        (sel.includes('overlay') || sel.includes('modal') || sel.includes('pause')) &&
        !sel.includes('bg-overlay') // bg-overlay는 배경이므로 dialogue보다 낮은 게 정상
    );
    const baseZ = zIndexMap['.dialogue-box']?.zIndex || 10;
    for (const [sel, { zIndex }] of overlayZ) {
        if (zIndex <= baseZ) {
            warnings.push(`[ZINDEX] ${sel} (z-index:${zIndex}) ≤ .dialogue-box (z-index:${baseZ}) — overlay hidden behind dialogue`);
        }
    }
}

// ═══════════════════════════════════════════
// 42. 다국어 HTML input maxlength/placeholder 동기화
// ═══════════════════════════════════════════
{
    const koInputs = [...koHtmlContent.matchAll(/<input[^>]+id="([^"]+)"[^>]*>/g)];
    for (const koInput of koInputs) {
        const inputId = koInput[1];
        const koMaxLen = koInput[0].match(/maxlength="(\d+)"/)?.[1];

        for (const lang of langs) {
            const langHtmlPath = path.join(ROOT, lang, 'index.html');
            if (!fs.existsSync(langHtmlPath)) continue;
            const langHtml = fs.readFileSync(langHtmlPath, 'utf8');
            const langInput = langHtml.match(new RegExp(`<input[^>]+id="${inputId}"[^>]*>`));
            if (!langInput) {
                errors.push(`[HTML_INPUT] ${lang}: input#${inputId} missing`);
                continue;
            }
            const langMaxLen = langInput[0].match(/maxlength="(\d+)"/)?.[1];
            if (koMaxLen && langMaxLen !== koMaxLen) {
                errors.push(`[HTML_INPUT] ${lang}: input#${inputId} maxlength="${langMaxLen}" ≠ ko "${koMaxLen}"`);
            }
        }
    }
}

// ═══════════════════════════════════════════
// 43. 중복 클릭 방지 (선택지/버튼 더블클릭)
// ═══════════════════════════════════════════
{
    // 선택지 버튼 클릭 후 패널 숨김이 즉시 일어나는지 (더블클릭 방지)
    const csPath = path.join(ROOT, 'assets/js/modules/ChoiceSystem.js');
    if (fs.existsSync(csPath)) {
        const cs = fs.readFileSync(csPath, 'utf8');
        // click 핸들러 내에서 패널을 숨기거나 disabled 처리하는지
        if (cs.includes('addEventListener') && !cs.includes('hidden') && !cs.includes('disabled') && !cs.includes('pointer-events')) {
            warnings.push(`[DBLCLICK] ChoiceSystem.js: choice buttons may not prevent double-click`);
        }
    }
    // 타이틀 시작 버튼 더블클릭 방지
    if (geContent.includes('btn-start') && !geContent.includes('disabled') &&
        !geContent.match(/btn.start.*disabled|startClicked|isStarting/)) {
        warnings.push(`[DBLCLICK] GameEngine.js: btn-start may not prevent double-click → duplicate game init`);
    }
}

// ═══════════════════════════════════════════
// 44. JS 모듈 간 메서드 호출 정합성
// ═══════════════════════════════════════════
{
    // 각 모듈 파일에서 클래스 메서드 목록 추출
    const classMethods = {}; // { ClassName: Set(['method1','method2',...]) }
    for (const [file, content] of Object.entries(allJsContent)) {
        const className = file.replace('.js', '');
        classMethods[className] = new Set();
        // 메서드 패턴: methodName( 또는 async methodName(
        for (const m of content.matchAll(/^\s+(?:async\s+)?(\w+)\s*\(/gm)) {
            if (!['if', 'for', 'while', 'switch', 'catch', 'constructor', 'return', 'new', 'function'].includes(m[1])) {
                classMethods[className].add(m[1]);
            }
        }
    }

    // this.engine.X.method() 패턴에서 method가 X 클래스에 존재하는지
    const engineSubsystems = {
        'glitch': 'GlitchSystem',
        'glitchAdv': 'GlitchSystemAdvanced',
        'dialogue': 'DialogueSystem',
        'choice': 'ChoiceSystem',
        'choiceAdv': 'ChoiceSystemAdvanced',
        'audio': 'AudioManager',
        'save': 'SaveManager',
        'i18n': 'I18nManager',
        'freeTalk': 'FreeTalkSystem',
        'deviceGimmick': 'DeviceGimmickSystem',
        'metaHorror': 'MetaHorrorSystem',
        'renderer': 'SceneRenderer',
        'scene': 'SceneRenderer',
    };

    for (const [file, content] of Object.entries(allJsContent)) {
        for (const m of content.matchAll(/this\.engine\.(\w+)\.(\w+)\s*\(/g)) {
            const subsys = m[1];
            const method = m[2];
            const targetClass = engineSubsystems[subsys];
            if (targetClass && classMethods[targetClass] && !classMethods[targetClass].has(method)) {
                const lineNum = content.substring(0, m.index).split('\n').length;
                errors.push(`[METHOD] ${file}:${lineNum}: this.engine.${subsys}.${method}() — "${method}" not found in ${targetClass}`);
            }
        }
        // this.glitch.method(), this.audio.method() 등 (GameEngine 내부)
        if (file === 'GameEngine.js') {
            for (const m of content.matchAll(/this\.(glitch|audio|dialogue|choice|save|i18n|renderer|metaHorror|deviceGimmick)\.(\w+)\s*\(/g)) {
                const subsys = m[1];
                const method = m[2];
                const targetClass = engineSubsystems[subsys];
                if (targetClass && classMethods[targetClass] && !classMethods[targetClass].has(method)) {
                    const lineNum = content.substring(0, m.index).split('\n').length;
                    warnings.push(`[METHOD] GameEngine.js:${lineNum}: this.${subsys}.${method}() — "${method}" not found in ${targetClass}`);
                }
            }
        }
    }
}

// ═══════════════════════════════════════════
// 45. getElementById 결과 null 가드 검사
// ═══════════════════════════════════════════
{
    for (const [file, content] of Object.entries(allJsContent)) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // getElementById 결과를 바로 .xxx 체이닝하는 패턴 (null 크래시)
            const match = line.match(/getElementById\(\s*['"]([^'"]+)['"]\s*\)\s*\./);
            if (match) {
                // ?. 사용 여부 확인
                if (!line.includes('?.') && !line.includes('getElementById') && false) {
                    // skip — 이 패턴은 너무 많아서 optional chaining 미사용만 체크
                }
                // 직접 .addEventListener, .style, .textContent 등 호출하는데 ?. 없는 경우
                const dangerPattern = line.match(/getElementById\([^)]+\)\s*\.(?![\s\S]*\?\.)(\w+)/);
                if (dangerPattern && !lines.slice(Math.max(0,i-2), i).some(l => l.includes('if') && l.includes(match[1]))) {
                    // 앞 2줄에 if guard가 없으면 경고
                    warnings.push(`[NULL_EL] ${file}:${i+1}: getElementById("${match[1]}").${dangerPattern[1]} without null check`);
                }
            }
        }
    }
}

// ═══════════════════════════════════════════
// 46. 브라우저 API 피쳐 디텍션
// ═══════════════════════════════════════════
{
    const browserAPIs = [
        { api: 'navigator.vibrate', detection: 'vibrate', name: 'Vibration API' },
        { api: 'navigator.getBattery', detection: 'getBattery', name: 'Battery API' },
        { api: 'screen.orientation', detection: 'orientation', name: 'Screen Orientation API' },
        { api: 'Notification.requestPermission', detection: 'Notification', name: 'Notification API' },
    ];
    for (const [file, content] of Object.entries(allJsContent)) {
        for (const { api, detection, name } of browserAPIs) {
            // API를 사용하지만 피쳐 디텍션이 없는 경우
            const apiParts = api.split('.');
            const usagePattern = new RegExp(apiParts[apiParts.length - 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(', 'g');
            const uses = (content.match(usagePattern) || []).length;
            if (uses > 0) {
                const hasDetection = content.includes(`'${detection}' in`) ||
                    content.includes(`"${detection}" in`) ||
                    content.includes(`${detection}Supported`) ||
                    content.includes(`typeof ${apiParts[0]}`) ||
                    content.includes(`window.${apiParts[0]}`);
                if (!hasDetection) {
                    warnings.push(`[FEATURE] ${file}: uses ${name} (${api}) without feature detection`);
                }
            }
        }
    }
}

// ═══════════════════════════════════════════
// 47. 세이브 역직렬화 스키마 안전성
// ═══════════════════════════════════════════
{
    const smPath2 = path.join(ROOT, 'assets/js/modules/SaveManager.js');
    const stPath = path.join(ROOT, 'assets/js/modules/StateManager.js');
    if (fs.existsSync(smPath2) && fs.existsSync(stPath)) {
        const stContent = fs.readFileSync(stPath, 'utf8');
        // deserialize에서 필수 필드에 기본값이 있는지
        const deserializeMatch = stContent.match(/deserialize\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}/);
        if (deserializeMatch) {
            const body = deserializeMatch[1];
            const requiredFields = ['currentDay', 'currentSlot', 'currentScene', 'stats', 'flags'];
            for (const field of requiredFields) {
                if (!body.includes(field)) {
                    errors.push(`[SAVE] StateManager.deserialize: missing "${field}" — crash on old save format`);
                } else if (!body.includes(`|| `) && !body.includes(`?? `)) {
                    // 기본값 없이 직접 할당하면 위험
                }
            }
            // stats가 빈 객체일 때 changeStat 크래시 방지
            if (!body.includes('stats') || !stContent.includes('if (!this.stats[charId])')) {
                // changeStat에 가드가 있는지 확인
                if (stContent.includes('changeStat') && !stContent.match(/if\s*\(!this\.stats\[/)) {
                    warnings.push(`[SAVE] StateManager.changeStat: no guard for missing charId — crash if save has partial stats`);
                }
            }
        }
    }
}

// ═══════════════════════════════════════════
// 48. async/await 초기화 순서 검증
// ═══════════════════════════════════════════
{
    if (appContent) {
        // app.js에서 game.init()가 await되는지
        if (appContent.includes('game.init()') && !appContent.includes('await game.init()')) {
            errors.push(`[ASYNC] app.js: game.init() not awaited — i18n may not be loaded when game starts`);
        }
        // deviceGimmick.init()가 await되는지
        if (appContent.includes('.init()') && appContent.includes('DeviceGimmickSystem')) {
            const initCalls = appContent.match(/await\s+\w+\.\w+\.init\(\)/g) || [];
            if (initCalls.length === 0 && appContent.includes('.init()')) {
                // init이 있는데 await가 없으면
                if (!appContent.includes('await game.deviceGimmick.init()') &&
                    !appContent.includes('await game.device.init()')) {
                    warnings.push(`[ASYNC] app.js: DeviceGimmickSystem.init() may not be awaited`);
                }
            }
        }
        // DOMContentLoaded 안에서 실행되는지
        if (!appContent.includes('DOMContentLoaded')) {
            errors.push(`[ASYNC] app.js: no DOMContentLoaded listener — DOM elements may not exist`);
        }
    }
}

// ═══════════════════════════════════════════
// 결과 출력
// ═══════════════════════════════════════════
console.log('\n══════════ NEVERGRAD VALIDATION ══════════\n');
console.log(`Scenes: ${Object.keys(allScenes).length}`);
console.log(`i18n(ko) keys: ${koKeys.size}`);
console.log(`Flags: ${flagsSet.size} set, ${flagsChecked.size} checked`);
console.log(`BGM: ${bgmUsed.size} referenced`);
console.log(`BG keys: ${Object.keys(CONFIG.BACKGROUNDS).length}`);
console.log(`Expression keys: ${Object.values(CONFIG.EXPRESSIONS).reduce((s, e) => s + Object.keys(e).length, 0)}`);
if (playInfo.length > 0) {
    console.log();
    playInfo.forEach(i => console.log('  ' + i));
}
console.log();

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ ALL CHECKS PASSED - 0 errors, 0 warnings');
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
