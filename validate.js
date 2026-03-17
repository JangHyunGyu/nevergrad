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
