# [작업 지시서] Nevergrad 2차 마감(Polishing) 및 S급 완성 (한국어 문구 100% 고정본)

> [!IMPORTANT]
> **절대 준수 규칙 (Repository & Quality Rules)**
> 1. **한국어 문구 임의 창작·변형 절대 금지**:
>    - 본 작업 지시서에 수록된 **모든 한국어 문구(갤러리 UI/CG/BGM/표정 라벨 및 시나리오 288개 노드의 대사·지문·선택지)**는 이미 `humanize-korean` 및 `im-not-ai` 검증을 마친 최종 확정본이다.
>    - 작업 AI는 **한국어 텍스트(`ko`)를 단 한 글자도 임의로 요약·윤문·생략·창작하지 말고 본 지시서에 적힌 문자열 그대로 복사하여 적용**해야 한다.
>    - 나머지 7개 언어(`en, ja, es, fr, de, pt, zh`)는 이 확정된 한국어 문구를 기준으로 의미·어조·선택지 배열 길이를 1:1로 번역·동기화한다.
> 2. **Git 브랜치**: 모든 작업·커밋·푸시는 반드시 `main` 브랜치에서만 수행한다 (`git branch --show-current`로 커밋/푸시 직전 재확인, 신규 브랜치 생성 금지).
> 3. **SEO 및 기존 UI 보존 (`AGENTS.md`)**: 타이틀 화면, 본편 대화창, 퀵메뉴 등 기존 유저 가시 UI의 레이아웃·타이포그래피·색상을 임의로 변경하지 않는다.
> 4. **한국어 코드 주석·로그 규칙 (`AGENTS.md`)**: 코드 주석과 로그는 짧은 명사형(`~함`, `~변환` 등)으로 작성하고 `~합니다/입니다`체와 문장 끝 마침표를 쓰지 않는다.
> 5. **검증 목표**: 작업 완료 시 `node validate.js` 결과 **`✅ ALL CHECKS PASSED - 0 errors, 0 warnings`** 및 `node scripts/i18n-check.js` **0 missing / 0 untranslated**를 달성해야 한다.

---

## 1. 작업 목표 요약 (Target Metrics)

| 항목 | 현재 상태 (1차 완료 후) | 2차 마감 목표 |
| :--- | :--- | :--- |
| **총 씬(Node) 수** | 3,050개 | **3,338개 (+288노드 정밀 확장)** |
| **갤러리 다국어 지원** | 신규 CG 4종만 다국어, 기존 CG 8종·BGM 30곡·표정 31종은 영어 하드코딩 | **CG 14종(클로즈업 2종 포함) + BGM 30곡 + 표정 31종 전 항목 8개 국어 로컬라이징** |
| **갤러리 회상(Replay)** | 정지 이미지/설명 모달만 표시 | **아카이브 프리퀄 2종(Cycle #07/#12) 및 해금 엔딩 7종 장면 회상(Replay) 버튼 연동** |
| **`node validate.js` 결과** | 0 Errors, **3 Warnings** | **0 Errors, 0 Warnings (`ALL CHECKS PASSED`)** |

---

## 2. Part A — `validate.js` 잔여 Warning 3건 완전 제거

1. **`[CSS_CLASS] GameEngine.js:359: class "cross-glitch" used in JS but not defined in CSS`**
   - [`assets/css/glitch.css`](file:///d:/workspace/nevergrad/assets/css/glitch.css) 하단에 아래 규칙을 정식 추가하고, [`assets/js/modules/GameEngine.js`](file:///d:/workspace/nevergrad/assets/js/modules/GameEngine.js#L349-L354)의 동적 `<style id="ng-cross-glitch-style">` 주입 블록을 제거한다:
   ```css
   #bg-layer.cross-glitch {
       animation: ng-cross-glitch 0.55s steps(2) 1;
   }
   @keyframes ng-cross-glitch {
       0% { filter: none; }
       25% { filter: brightness(0.3) saturate(0.3); }
       55% { filter: brightness(0.8) saturate(0.6); }
       100% { filter: none; }
   }
   ```
2. **`[CSS_CLASS] SceneRenderer.js:107: class "bg-crossfade-long" used in JS but not defined in CSS`**
   - [`assets/css/style.css`](file:///d:/workspace/nevergrad/assets/css/style.css)의 `.bg-layer.bg-crossfade::after` 정의 바로 아래에 아래 규칙을 정식 추가하고, [`assets/js/modules/SceneRenderer.js`](file:///d:/workspace/nevergrad/assets/js/modules/SceneRenderer.js#L98-L103)의 동적 `<style id="ng-long-fade">` 주입 블록을 제거한다:
   ```css
   .bg-layer.bg-crossfade-long::after {
       transition: opacity 1.8s ease-in-out;
       opacity: 1;
   }
   ```
3. **`[UI_ORPHAN_ID] 2 HTML ids with no JS reference: initial-page-background, riin-wake-boot`**
   - [`validate.js`](file:///d:/workspace/nevergrad/validate.js#L1324)의 `presentationalIds` 집합을 다음과 같이 수정한다:
   ```js
   const presentationalIds = new Set(['cherry-blossoms', 'hud', 'initial-page-background', 'riin-wake-boot']);
   ```

---

## 3. Part B — [`GallerySystem.js`](file:///d:/workspace/nevergrad/assets/js/modules/GallerySystem.js) 한국어 확정 문구 및 장면 회상(Replay)

### B-1. `GallerySystem.LABELS.ko` 확정 문구
[`GallerySystem.js`](file:///d:/workspace/nevergrad/assets/js/modules/GallerySystem.js#L97-L113)의 `LABELS.ko`에 아래 키를 그대로 반영한다 (타 언어 `en, ja, es, fr, de, pt, zh`에도 대응 키 추가):
```js
ko: {
    title: '갤러리',
    progress: '해금률',
    back: '돌아가기',
    tabs: { endings: '엔딩', cg: '이벤트 CG', music: '음악', characters: '캐릭터' },
    locked: '미해금',
    lockedEnding: '아직 도달하지 못한 결말',
    lockedCg: '게임에서 이 이벤트 CG를 보면 해금됩니다.',
    lockedMusic: '게임에서 이 BGM이 재생되면 해금됩니다.',
    lockedCharacter: '게임에서 이 인물을 만나면 해금됩니다.',
    lockedExpression: '게임에서 이 표정을 보면 해금됩니다.',
    play: '재생',
    stop: '정지',
    replay: '장면 회상',
    artist: 'Nevergrad OST',
    expressions: '표정',
    close: '닫기'
}
```

### B-2. 전체 CG 14종(기존 8종 + 신규 4종 + 클로즈업 증거물 2종) 한국어 확정 문구
[`GallerySystem.js`](file:///d:/workspace/nevergrad/assets/js/modules/GallerySystem.js#L268-L317)의 `EXPANSION_CG_LABELS.ko`를 아래 14종 전체로 교체하고, `_getCGItems()` 필터 조건을 `String(file).includes('/images/cg/') || ['closeup_m13_ampoule_tray', 'closeup_rooftop_etching'].includes(backgroundKey)`로 확장한다.
```js
ko: {
    cg_cycle07_seolhwa: ['제7차 주기: 왼손', '빗속의 비상구에서 끝내 놓지 못한 설화의 손'],
    cg_cycle12_yuna: ['제12차 주기: 암실', '다음 등교를 위해 현상액 속에 남긴 유나의 필름'],
    ending_cage_eunsu: ['CAGE END: 은수의 교실', '은색 밴드와 영구히 유예된 졸업'],
    ending_complicit_monitors: ['COMPLICIT END: 관제실', '다음 주기의 승인 서류에 남은 내 서명'],
    ending_true: ['TRUE END: 열세 번째 졸업', '왼손에 쥔 연필과 마침내 열린 교문 너머의 아침'],
    ending_escape: ['ESCAPE END: 빗속의 탈출로', '충분한 증거 없이 학교 담장을 넘어 빠져나온 새벽'],
    ending_cage: ['CAGE END: 영원한 교실', '절대 졸업하지 않는 교실에 남아 맞이하는 오후'],
    ending_ghost: ['GHOST END: 빈자리의 흔적', '학교를 빠져나온 뒤에도 창가 책상에 남은 기척'],
    ending_forget: ['FORGET END: 열네 번째 등교', '모든 기억을 지우고 처음처럼 다시 건너는 교문'],
    ending_resist: ['RESIST END: 비상구의 기록', '은수와 함께 들고 나온 열두 번의 실험 기록'],
    ending_complicit: ['COMPLICIT END: 서명된 각서', '시스템의 일부가 되기로 승인한 마지막 페이지'],
    ending_cage_sea: ['CAGE END: 세아의 학생회실', '같은 도시락과 같은 노래가 끝없이 이어지는 방과 후'],
    closeup_m13_ampoule_tray: ['단서: M-13 앰플 트레이', '1번부터 12번까지 비어 있고 13번 홈만 남은 금속 트레이'],
    closeup_rooftop_etching: ['단서: 옥상 난간의 칼자국', '회색 페인트 아래 일곱 번째마다 깊게 패인 열두 줄의 홈']
}
```

### B-3. `BGM_TITLES` 30곡 한국어 확정 문구 (`BGM_TITLES_KO`)
한국어(`this._lang() === 'ko'`)일 때 아래 한국어 곡명을 반환하도록 [`GallerySystem.js`](file:///d:/workspace/nevergrad/assets/js/modules/GallerySystem.js#L235-L266)를 확장한다:
```js
static BGM_TITLES_KO = {
    cycle07_elegy: '제7차 주기: 빗속의 엘레지',
    complicit_cold_pulse: '공범: 차가운 맥박',
    yuna_theme: '유나의 테마: 뷰파인더 너머',
    spring_bright: '봄날의 교정',
    daily_bright: '쉬는 시간의 햇살',
    sunset_warm: '방과 후의 노을',
    night_calm: '잠든 교실의 숨결',
    morning_bright: '첫 등교의 아침',
    morning_uneasy: '어긋난 조회 시간',
    daily_tense: '복도에 남은 시선',
    riin_theme: '리인의 테마: 캐모마일과 소독약',
    sea_theme: '세아의 테마: 이어폰 한쪽',
    eunsu_theme: '은수의 테마: 담임의 커피잔',
    tension: '좁혀오는 발소리',
    tension_low: '낮게 깔린 정적',
    wind_ambient: '옥상 철망의 바람',
    tension_night: '자정의 순찰등',
    sea_obsession: '잠긴 학생회실',
    heartbeat_loop: '열세 번째 맥박',
    silence_tension: '끊어진 방송',
    music_box_broken: '태엽이 나간 오르골',
    seolhwa_theme_broken: '설화의 테마: 지워진 출석부',
    confrontation: '대면: 열세 번의 기록',
    ending_dark: '결말: 닫힌 교문',
    ending_ghost: '결말: 창가의 잔상',
    ending_hope: '결말: 졸업식 아침',
    ending_melancholy: '결말: 젖은 아스팔트',
    ending_bittersweet: '결말: 남겨진 필름',
    morning_peaceful: '아무 일 없던 아침',
    chase: '비상계단 추격'
};
```

### B-4. `EXPRESSION_TITLES` 31종 한국어 확정 문구 (`EXPRESSION_TITLES_KO`)
한국어(`this._lang() === 'ko'`)일 때 아래 한국어 표정명을 반환하도록 [`GallerySystem.js`](file:///d:/workspace/nevergrad/assets/js/modules/GallerySystem.js#L319-L351)를 확장한다:
```js
static EXPRESSION_TITLES_KO = {
    normal: '평소',
    smile: '미소',
    gentle: '다정함',
    warm: '온화함',
    shy: '수줍음',
    serious: '진지함',
    angry: '분노',
    close: '다가섬',
    cold: '차가움',
    dark: '그늘짐',
    obsessed: '집착',
    shaking: '흔들림',
    crying: '눈물',
    seductive: '속삭임',
    pleased: '만족',
    neutral: '무표정',
    pain: '고통',
    relief: '안도',
    sad: '슬픔',
    hurt: '상처',
    cry: '오열',
    yandere: '광기',
    vulnerable: '위태로움',
    broken_smile: '부서진 미소',
    scared: '공포',
    desperate: '절박함',
    weak: '수척함',
    determined: '결의',
    fade: '흐려짐',
    ghost: '잔상',
    quiet: '침묵'
};
```

### B-5. 갤러리 장면 회상(Replay) 연동
- 해금된 엔딩 카드 또는 프리퀄 아카이브 CG(`cg_cycle07_seolhwa`, `cg_cycle12_yuna`) 모달에서 `장면 회상`(`labels.replay`) 버튼을 클릭하면 모달과 갤러리를 닫고 해당 시작 씬으로 진입한다:
  - `cg_cycle07_seolhwa` → `day5_archive_c07_1` (Day 5)
  - `cg_cycle12_yuna` → `day5_archive_c12_1` (Day 5)
  - `TRUE END` → `day5_ending_true_1`
  - `RESIST END` → `day5_ending_resist_1`
  - `FORGET END` → `day5_ending_forget_1`
  - `CAGE END` → `day5_ending_cage_1`
  - `GHOST END` → `day5_ending_ghost_1`
  - `ESCAPE END` → `day5_ending_escape_1`
  - `COMPLICIT END` → `day5_ending_complicit_1`
- 진입 시 `this.game.isGalleryReplay = true`를 설정하여 기존 세이브 데이터를 보호하고, 프리퀄 아카이브의 복귀 분기(`day5_archive_c07_20`, `day5_archive_c12_20`) 또는 엔딩 종료 시 `this.game.isGalleryReplay`가 켜져 있으면 플래그를 끄고 타이틀/갤러리 화면으로 복귀하도록 처리한다.

---

## 4. Part C — 시나리오 초중반 낮 파트 5개 챕터 정밀 확장 (+288노드, 한국어 원문 100% 고정)

아래 5개 챕터의 **연결 지점(Hook)**, **시나리오 노드 구조(`.js`)**, **한국어 텍스트(`.json`)**를 한 글자도 바꾸지 말고 그대로 반영한다.

### C-1. Day 1 Lunch ([`assets/js/scenario/day1_2_lunch.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day1_2_lunch.js) & [`assets/js/i18n/ko/day1_lunch.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day1_lunch.json)) — +64노드

#### 1) 기존 노드 연결(Hook) 변경 4곳
- `day1_lunch_sea_20.next`: 기존 `"day1_lunch_sea_21"` → **`"day1_lunch_sea_menu_choice"`** 로 변경
- `day1_lunch_yuna_16.next`: 기존 `"day1_lunch_end"` → **`"day1_lunch_yuna_lens_choice"`** 로 변경
- `day1_lunch_riin_18.next`: 기존 `"day1_lunch_end"` → **`"day1_lunch_riin_chart_choice"`** 로 변경
- `day1_lunch_alone_5.next`: 기존 `"day1_lunch_end"` → **`"day1_lunch_alone_rail_choice"`** 로 변경

#### 2) [`assets/js/scenario/day1_2_lunch.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day1_2_lunch.js)에 추가할 64개 씬 정의
```js
    "day1_lunch_sea_menu_choice": {
        character: "sea_smile",
        choices: [
            { next: "day1_lunch_sea_menu_1", stats: { sea: { affinity: 3 } } },
            { next: "day1_lunch_sea_menu_8", setFlags: ["noticed_sea_lunchbox_initials"], stats: { sea: { affinity: 1 }, seolhwa: { affinity: 2 } } }
        ]
    },
    "day1_lunch_sea_menu_1": { character: "sea_smile", next: "day1_lunch_sea_menu_2" },
    "day1_lunch_sea_menu_2": { character: "sea_smile", next: "day1_lunch_sea_menu_3" },
    "day1_lunch_sea_menu_3": { character: "sea_normal", next: "day1_lunch_sea_menu_4" },
    "day1_lunch_sea_menu_4": { character: "sea_smile", next: "day1_lunch_sea_menu_5" },
    "day1_lunch_sea_menu_5": { character: "sea_smile", next: "day1_lunch_sea_menu_6" },
    "day1_lunch_sea_menu_6": { character: "sea_smile", next: "day1_lunch_sea_menu_7" },
    "day1_lunch_sea_menu_7": { character: "sea_smile", next: "day1_lunch_sea_menu_13" },
    "day1_lunch_sea_menu_8": { character: "sea_normal", next: "day1_lunch_sea_menu_9" },
    "day1_lunch_sea_menu_9": { character: "sea_serious", next: "day1_lunch_sea_menu_10" },
    "day1_lunch_sea_menu_10": { character: "sea_normal", next: "day1_lunch_sea_menu_11" },
    "day1_lunch_sea_menu_11": { character: "sea_normal", next: "day1_lunch_sea_menu_12" },
    "day1_lunch_sea_menu_12": { character: "sea_smile", next: "day1_lunch_sea_menu_13" },
    "day1_lunch_sea_menu_13": { character: "sea_normal", next: "day1_lunch_sea_menu_14" },
    "day1_lunch_sea_menu_14": { character: "sea_smile", next: "day1_lunch_sea_21" },

    "day1_lunch_yuna_lens_choice": {
        character: "yuna_shy",
        choices: [
            { next: "day1_lunch_yuna_lens_1", setFlags: ["asked_yuna_hidden_gate_photo"], stats: { yuna: { affinity: 3 } } },
            { next: "day1_lunch_yuna_lens_8", stats: { yuna: { affinity: 2 }, seolhwa: { affinity: 2 } } }
        ]
    },
    "day1_lunch_yuna_lens_1": { character: "yuna_scared", next: "day1_lunch_yuna_lens_2" },
    "day1_lunch_yuna_lens_2": { character: "yuna_shy", next: "day1_lunch_yuna_lens_3" },
    "day1_lunch_yuna_lens_3": { character: "yuna_shy", next: "day1_lunch_yuna_lens_4" },
    "day1_lunch_yuna_lens_4": { character: "yuna_normal", next: "day1_lunch_yuna_lens_5" },
    "day1_lunch_yuna_lens_5": { character: "yuna_normal", next: "day1_lunch_yuna_lens_6" },
    "day1_lunch_yuna_lens_6": { character: "yuna_shy", next: "day1_lunch_yuna_lens_7" },
    "day1_lunch_yuna_lens_7": { character: "yuna_normal", next: "day1_lunch_yuna_lens_13" },
    "day1_lunch_yuna_lens_8": { character: "yuna_normal", next: "day1_lunch_yuna_lens_9" },
    "day1_lunch_yuna_lens_9": { character: "yuna_shy", next: "day1_lunch_yuna_lens_10" },
    "day1_lunch_yuna_lens_10": { character: "yuna_shy", next: "day1_lunch_yuna_lens_11" },
    "day1_lunch_yuna_lens_11": { character: "yuna_normal", next: "day1_lunch_yuna_lens_12" },
    "day1_lunch_yuna_lens_12": { character: "yuna_shy", next: "day1_lunch_yuna_lens_13" },
    "day1_lunch_yuna_lens_13": { character: "yuna_normal", next: "day1_lunch_yuna_lens_14" },
    "day1_lunch_yuna_lens_14": { character: "yuna_shy", next: "day1_lunch_yuna_lens_15" },
    "day1_lunch_yuna_lens_15": { character: "yuna_smile", next: "day1_lunch_yuna_lens_16" },
    "day1_lunch_yuna_lens_16": { character: "yuna_smile", next: "day1_lunch_end" },

    "day1_lunch_riin_chart_choice": {
        character: "riin_gentle",
        choices: [
            { next: "day1_lunch_riin_chart_1", setFlags: ["noticed_riin_wrist_mark"], stats: { riin: { affinity: 2 } } },
            { next: "day1_lunch_riin_chart_8", stats: { riin: { affinity: 3 } } }
        ]
    },
    "day1_lunch_riin_chart_1": { character: "riin_normal", next: "day1_lunch_riin_chart_2" },
    "day1_lunch_riin_chart_2": { character: "riin_gentle", next: "day1_lunch_riin_chart_3" },
    "day1_lunch_riin_chart_3": { character: "riin_normal", next: "day1_lunch_riin_chart_4" },
    "day1_lunch_riin_chart_4": { character: "riin_smile", next: "day1_lunch_riin_chart_5" },
    "day1_lunch_riin_chart_5": { character: "riin_gentle", next: "day1_lunch_riin_chart_6" },
    "day1_lunch_riin_chart_6": { character: "riin_smile", next: "day1_lunch_riin_chart_7" },
    "day1_lunch_riin_chart_7": { character: "riin_gentle", next: "day1_lunch_riin_chart_13" },
    "day1_lunch_riin_chart_8": { character: "riin_normal", next: "day1_lunch_riin_chart_9" },
    "day1_lunch_riin_chart_9": { character: "riin_gentle", next: "day1_lunch_riin_chart_10" },
    "day1_lunch_riin_chart_10": { character: "riin_smile", next: "day1_lunch_riin_chart_11" },
    "day1_lunch_riin_chart_11": { character: "riin_normal", next: "day1_lunch_riin_chart_12" },
    "day1_lunch_riin_chart_12": { character: "riin_gentle", next: "day1_lunch_riin_chart_13" },
    "day1_lunch_riin_chart_13": { character: "riin_gentle", next: "day1_lunch_riin_chart_14" },
    "day1_lunch_riin_chart_14": { character: "riin_smile", next: "day1_lunch_riin_chart_15" },
    "day1_lunch_riin_chart_15": { character: "riin_gentle", next: "day1_lunch_end" },

    "day1_lunch_alone_rail_choice": {
        character: null,
        choices: [
            { next: "day1_lunch_alone_rail_1", setFlags: ["rooftop_first_etching_seen"], stats: { seolhwa: { affinity: 3 } } },
            { next: "day1_lunch_alone_rail_5", stats: { yuna: { affinity: 2 } } }
        ]
    },
    "day1_lunch_alone_rail_1": { character: null, next: "day1_lunch_alone_rail_2" },
    "day1_lunch_alone_rail_2": { character: null, next: "day1_lunch_alone_rail_3" },
    "day1_lunch_alone_rail_3": { character: null, next: "day1_lunch_alone_rail_4" },
    "day1_lunch_alone_rail_4": { character: null, next: "day1_lunch_alone_rail_8" },
    "day1_lunch_alone_rail_5": { character: null, next: "day1_lunch_alone_rail_6" },
    "day1_lunch_alone_rail_6": { character: null, next: "day1_lunch_alone_rail_7" },
    "day1_lunch_alone_rail_7": { character: null, next: "day1_lunch_alone_rail_8" },
    "day1_lunch_alone_rail_8": { character: null, next: "day1_lunch_alone_rail_9" },
    "day1_lunch_alone_rail_9": { character: null, next: "day1_lunch_alone_rail_10" },
    "day1_lunch_alone_rail_10": { character: null, next: "day1_lunch_alone_rail_11" },
    "day1_lunch_alone_rail_11": { background: "stairway", character: null, next: "day1_lunch_alone_rail_12" },
    "day1_lunch_alone_rail_12": { character: null, next: "day1_lunch_alone_rail_13" },
    "day1_lunch_alone_rail_13": { character: null, next: "day1_lunch_alone_rail_14" },
    "day1_lunch_alone_rail_14": { background: "corridor", character: null, next: "day1_lunch_alone_rail_15" },
    "day1_lunch_alone_rail_15": { character: null, next: "day1_lunch_end" }
```

#### 3) [`assets/js/i18n/ko/day1_lunch.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day1_lunch.json)에 추가할 한국어 확정 문구 (64개 키)
```json
    "day1_lunch_sea_menu_choice": {
        "text": "*세아가 빈 반찬 칸을 젓가락 끝으로 톡 건드렸다.*",
        "choices": [
            "계란말이에 설탕을 얼마나 넣었는지 묻는다",
            "도시락통 바닥에 긁힌 영문 이니셜을 가리킨다"
        ]
    },
    "day1_lunch_sea_menu_1": {
        "text": "계란말이 말인데, 설탕 꽤 넣었지? 첫입부터 바로 달던데."
    },
    "day1_lunch_sea_menu_2": {
        "text": "티스푼으로 두 번. 덜 넣으면 오후에 당 떨어져서 하품하잖아."
    },
    "day1_lunch_sea_menu_3": {
        "text": "내가 오후에 하품하는지 어떻게 알아. 오늘 첫날인데."
    },
    "day1_lunch_sea_menu_4": {
        "text": "*세아가 물병 뚜껑을 돌리다 손가락에 힘을 줬다.*\n\n아침 조회 때 창문 쪽 보면서 두 번 했어. 반장은 그런 거 다 보여."
    },
    "day1_lunch_sea_menu_5": {
        "text": "관찰력이 좋은 건지, 나만 본 건지 모르겠네."
    },
    "day1_lunch_sea_menu_6": {
        "text": "전학생이니까 챙겨보는 거지. 내일 반찬은 덜 달게 해줄까?"
    },
    "day1_lunch_sea_menu_7": {
        "text": "아니, 오늘 거랑 똑같이 해줘. 맛있었어."
    },
    "day1_lunch_sea_menu_8": {
        "text": "저기 도시락통 모서리에 알파벳 두 글자 긁혀 있는데, 네 이니셜은 아니네."
    },
    "day1_lunch_sea_menu_9": {
        "text": "*세아가 반사적으로 도시락통 아래에 손바닥을 받쳐 가렸다.*"
    },
    "day1_lunch_sea_menu_10": {
        "text": "작년에 같이 쓰던 통이야. 설거지하다 수세미에 긁혔나 봐."
    },
    "day1_lunch_sea_menu_11": {
        "text": "수세미 자국치곤 획이 반듯하던데."
    },
    "day1_lunch_sea_menu_12": {
        "text": "기분 탓이야. 오래 쓴 물건은 원래 자국이 남잖아."
    },
    "day1_lunch_sea_menu_13": {
        "text": "*세아가 냅킨을 접어 도시락통 옆에 반듯하게 포갰다.*"
    },
    "day1_lunch_sea_menu_14": {
        "text": "다 먹었으면 뚜껑은 내가 닫을게. 네 손에 기름 묻어."
    },
    "day1_lunch_yuna_lens_choice": {
        "text": "*유나의 손가락이 카메라 방향키 위에서 작게 떨렸다.*",
        "choices": [
            "방금 급하게 넘긴 사진이 뭔지 묻는다",
            "벚나무 아래 빈 벤치 사진을 가리킨다"
        ]
    },
    "day1_lunch_yuna_lens_1": {
        "text": "방금 넘긴 건 왜 감춰? 흔들린 사진이야?"
    },
    "day1_lunch_yuna_lens_2": {
        "text": "노출이 잘못 맞아서요. 하얗게 날아간 건 보여드리기 부끄러워요."
    },
    "day1_lunch_yuna_lens_3": {
        "text": "*잠깐 스친 화면 귀퉁이에는 도서관 창문 대신 교문 명패가 찍혀 있었다.*"
    },
    "day1_lunch_yuna_lens_4": {
        "text": "교문 쪽에서 찍은 것 같던데. 아침에 등교하는 애들 찍은 거야?"
    },
    "day1_lunch_yuna_lens_5": {
        "text": "가끔요. 교문은 아침 8시 정각에 그림자가 제일 길거든요."
    },
    "day1_lunch_yuna_lens_6": {
        "text": "시간까지 외우고 찍네."
    },
    "day1_lunch_yuna_lens_7": {
        "text": "빛이 들어오는 각도는 매일 같으니까요. 사람만 바뀌죠."
    },
    "day1_lunch_yuna_lens_8": {
        "text": "저 벚나무 아래 벤치 사진은 왜 비어 있어? 누가 앉아 있던 자리 같아서."
    },
    "day1_lunch_yuna_lens_9": {
        "text": "*유나가 액정 화면을 엄지로 한 번 쓸었다.*"
    },
    "day1_lunch_yuna_lens_10": {
        "text": "일어나자마자 찍었거든요. 꽃잎이 수북이 깔려 있었는데 일어나니까 그 자리만 비어 있었어요."
    },
    "day1_lunch_yuna_lens_11": {
        "text": "누가 앉아 있었는데?"
    },
    "day1_lunch_yuna_lens_12": {
        "text": "모르겠어요. 뒤돌아봤을 땐 이미 계단 쪽으로 가버려서."
    },
    "day1_lunch_yuna_lens_13": {
        "text": "*유나가 렌즈 캡을 끼우자 '딸깍' 하고 마른 플라스틱 소리가 났다.*"
    },
    "day1_lunch_yuna_lens_14": {
        "text": "선배, 오후 수업 시작하기 전에 가보셔야죠. 1층 복도는 종 치기 직전에 붐벼요."
    },
    "day1_lunch_yuna_lens_15": {
        "text": "고마워. 사진 더 정리하면 다음에 또 보여줘."
    },
    "day1_lunch_yuna_lens_16": {
        "text": "네. 안 지우고 그대로 둘게요."
    },
    "day1_lunch_riin_chart_choice": {
        "text": "*침대에서 내려오자 슬리퍼 바닥이 리놀륨 타일에 차갑게 달라붙었다.*",
        "choices": [
            "손목 안쪽에 남은 체온계 자국을 묻는다",
            "책상 위 클립보드에 적힌 시간표를 본다"
        ]
    },
    "day1_lunch_riin_chart_1": {
        "text": "선생님, 자는 동안 열 다시 재셨어요? 손목에 자국이 남아서요."
    },
    "day1_lunch_riin_chart_2": {
        "text": "응. 이마 짚었을 때보다 맥이 조금 빨라 보이길래."
    },
    "day1_lunch_riin_chart_3": {
        "text": "맥박은 손목으로 재잖아요. 이건 금속이 눌린 자국 같은데요."
    },
    "day1_lunch_riin_chart_4": {
        "text": "*리인 선생님이 가운 주머니에 손을 넣으며 고개를 살짝 기울였다.*"
    },
    "day1_lunch_riin_chart_5": {
        "text": "시계 버클이 닿았나 보네. 자는 애 깨우면 미안해서 조심했는데."
    },
    "day1_lunch_riin_chart_6": {
        "text": "그랬군요. 덕분에 푹 잤어요."
    },
    "day1_lunch_riin_chart_7": {
        "text": "오후에 또 머리가 무거우면 참지 말고 내려와."
    },
    "day1_lunch_riin_chart_8": {
        "text": "저 클립보드에 적힌 건 오늘 보건실 방문자 명단이에요?"
    },
    "day1_lunch_riin_chart_9": {
        "text": "*리인 선생님이 볼펜으로 클립보드 윗부분을 가볍게 두드렸다.*"
    },
    "day1_lunch_riin_chart_10": {
        "text": "응. 점심시간엔 네가 첫 번째야."
    },
    "day1_lunch_riin_chart_11": {
        "text": "윗줄에 지우개로 지운 자국이 있던데요."
    },
    "day1_lunch_riin_chart_12": {
        "text": "아침에 잘못 적은 학번이야. 볼펜이 아니라 연필로 써서 다행이지."
    },
    "day1_lunch_riin_chart_13": {
        "text": "*종이 위에 남은 지우개 가루를 선생님이 손바닥으로 쓸어 휴지통에 털어 넣었다.*"
    },
    "day1_lunch_riin_chart_14": {
        "text": "빈속에 약 먹지 말고, 급식실 닫기 전에 우유라도 하나 챙겨 마셔."
    },
    "day1_lunch_riin_chart_15": {
        "text": "네, 그럴게요. 쉬게 해주셔서 감사합니다."
    },
    "day1_lunch_alone_rail_choice": {
        "text": "*옥상 난간 아래 페인트가 벗겨진 자리에 짧은 선 세 개가 나란히 패어 있다.*",
        "choices": [
            "손톱 끝으로 긁힌 홈의 깊이를 확인한다",
            "운동장 구석에서 반짝였던 렌즈 쪽을 다시 찾는다"
        ]
    },
    "day1_lunch_alone_rail_1": {
        "text": "*엄지 손톱을 홈에 대고 천천히 밀어봤다. 녹슨 철판 위로 덧칠한 회색 페인트 층만 깊게 파여 있었다.*"
    },
    "day1_lunch_alone_rail_2": {
        "text": "*세 줄 옆에 아주 얕게 넷째 줄을 그으려다 멈춘 흔적이 보였다.*"
    },
    "day1_lunch_alone_rail_3": {
        "text": "누가 옥상에서 날짜라도 센 건가."
    },
    "day1_lunch_alone_rail_4": {
        "text": "*손끝에 묻은 회색 가루를 바지에 문질러 털었다. 잘 털리지 않고 손금 사이에 남았다.*"
    },
    "day1_lunch_alone_rail_5": {
        "text": "*난간 너머로 고개를 내밀어 아까 빛이 반짝였던 체육관 옆 그늘을 내려다봤다.*"
    },
    "day1_lunch_alone_rail_6": {
        "text": "*플라타너스 가지 사이로 검은 카메라 스트랩 끝자락이 스치듯 사라졌다.*"
    },
    "day1_lunch_alone_rail_7": {
        "text": "사진부인가. 옥상까지 찍을 일은 없을 텐데."
    },
    "day1_lunch_alone_rail_8": {
        "text": "*주먹밥 비닐을 구겨 주머니에 넣었다. 옥상 문 쪽에서 철문이 바람에 울리는 소리가 났다.*"
    },
    "day1_lunch_alone_rail_9": {
        "text": "*문고리를 잡자 손잡이 안쪽에 미지근한 온기가 남아 있었다.*"
    },
    "day1_lunch_alone_rail_10": {
        "text": "방금 누가 올라왔었나?"
    },
    "day1_lunch_alone_rail_11": {
        "text": "*계단 아래를 내려다봤지만 4층 복도까지 인기척은 없었다.*"
    },
    "day1_lunch_alone_rail_12": {
        "text": "*층계참 창문 틈으로 운동장 함성이 멀게 올라왔다.*"
    },
    "day1_lunch_alone_rail_13": {
        "text": "*계단을 내려가며 손가락을 맞비볐다. 페인트 가루의 까슬한 감촉이 쉽게 가시지 않았다.*"
    },
    "day1_lunch_alone_rail_14": {
        "text": "*3층 복도로 접어들자 예비종이 울리기 시작했다.*"
    },
    "day1_lunch_alone_rail_15": {
        "text": "*교실 문을 열기 전, 내 자리 대각선 뒤쪽의 빈 책상이 먼저 눈에 들어왔다.*"
    }
```

---

### C-2. Day 1 Afterschool ([`assets/js/scenario/day1_3_afterschool.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day1_3_afterschool.js) & [`assets/js/i18n/ko/day1_afterschool.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day1_afterschool.json)) — +64노드

#### 1) 기존 노드 연결(Hook) 변경 4곳
- `day1_after_sea_16.next`: 기존 `"day1_after_sea_walk_1"` → **`"day1_after_sea_cabinet_choice"`** 로 변경
- `day1_after_yuna_14.next`: 기존 `"day1_after_home_1"` → **`"day1_after_yuna_back_choice"`** 로 변경
- `day1_after_riin_11.next`: 기존 `"day1_after_riin_12"` → **`"day1_after_riin_tea_choice"`** 로 변경
- `day1_after_eunsu_10.next`: 기존 `"day1_after_home_1"` → **`"day1_after_eunsu_file_choice"`** 로 변경

#### 2) [`assets/js/scenario/day1_3_afterschool.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day1_3_afterschool.js)에 추가할 64개 씬 정의
```js
    "day1_after_sea_cabinet_choice": {
        character: "sea_normal",
        choices: [
            { next: "day1_after_sea_cab_1", setFlags: ["saw_council_old_nametags"], stats: { sea: { affinity: 1 }, seolhwa: { affinity: 2 } } },
            { next: "day1_after_sea_cab_8", stats: { sea: { affinity: 3 } } }
        ]
    },
    "day1_after_sea_cab_1": { character: "sea_normal", next: "day1_after_sea_cab_2" },
    "day1_after_sea_cab_2": { character: "sea_serious", next: "day1_after_sea_cab_3" },
    "day1_after_sea_cab_3": { character: "sea_normal", next: "day1_after_sea_cab_4" },
    "day1_after_sea_cab_4": { character: "sea_normal", next: "day1_after_sea_cab_5" },
    "day1_after_sea_cab_5": { character: "sea_normal", next: "day1_after_sea_cab_6" },
    "day1_after_sea_cab_6": { character: "sea_sad", next: "day1_after_sea_cab_7" },
    "day1_after_sea_cab_7": { character: "sea_normal", next: "day1_after_sea_cab_13" },
    "day1_after_sea_cab_8": { character: "sea_normal", next: "day1_after_sea_cab_9" },
    "day1_after_sea_cab_9": { character: "sea_normal", next: "day1_after_sea_cab_10" },
    "day1_after_sea_cab_10": { character: "sea_smile", next: "day1_after_sea_cab_11" },
    "day1_after_sea_cab_11": { character: "sea_normal", next: "day1_after_sea_cab_12" },
    "day1_after_sea_cab_12": { character: "sea_smile", next: "day1_after_sea_cab_13" },
    "day1_after_sea_cab_13": { character: "sea_normal", next: "day1_after_sea_cab_14" },
    "day1_after_sea_cab_14": { character: "sea_smile", next: "day1_after_sea_cab_15" },
    "day1_after_sea_cab_15": { character: "sea_smile", next: "day1_after_sea_walk_1" },

    "day1_after_yuna_back_choice": {
        character: "yuna_normal",
        choices: [
            { next: "day1_after_yuna_back_1", setFlags: ["noticed_polaroid_13"], stats: { yuna: { affinity: 3 }, seolhwa: { affinity: 2 } } },
            { next: "day1_after_yuna_back_8", setFlags: ["heard_yuna_darkroom_keys"], stats: { yuna: { affinity: 3 } } }
        ]
    },
    "day1_after_yuna_back_1": { character: "yuna_scared", next: "day1_after_yuna_back_2" },
    "day1_after_yuna_back_2": { character: "yuna_shy", next: "day1_after_yuna_back_3" },
    "day1_after_yuna_back_3": { character: "yuna_shy", next: "day1_after_yuna_back_4" },
    "day1_after_yuna_back_4": { character: "yuna_normal", next: "day1_after_yuna_back_5" },
    "day1_after_yuna_back_5": { character: "yuna_normal", next: "day1_after_yuna_back_6" },
    "day1_after_yuna_back_6": { character: "yuna_smile", next: "day1_after_yuna_back_7" },
    "day1_after_yuna_back_7": { character: "yuna_smile", next: "day1_after_yuna_back_13" },
    "day1_after_yuna_back_8": { character: "yuna_shy", next: "day1_after_yuna_back_9" },
    "day1_after_yuna_back_9": { character: "yuna_shy", next: "day1_after_yuna_back_10" },
    "day1_after_yuna_back_10": { character: "yuna_normal", next: "day1_after_yuna_back_11" },
    "day1_after_yuna_back_11": { character: "yuna_normal", next: "day1_after_yuna_back_12" },
    "day1_after_yuna_back_12": { character: "yuna_serious", next: "day1_after_yuna_back_13" },
    "day1_after_yuna_back_13": { character: "yuna_normal", next: "day1_after_yuna_back_14" },
    "day1_after_yuna_back_14": { character: "yuna_shy", next: "day1_after_yuna_back_15" },
    "day1_after_yuna_back_15": { character: "yuna_smile", next: "day1_after_home_1" },

    "day1_after_riin_tea_choice": {
        character: "riin_gentle",
        choices: [
            { next: "day1_after_riin_tea_1", stats: { riin: { affinity: 2 } } },
            { next: "day1_after_riin_tea_8", stats: { riin: { affinity: 3 } } }
        ]
    },
    "day1_after_riin_tea_1": { character: "riin_normal", next: "day1_after_riin_tea_2" },
    "day1_after_riin_tea_2": { character: "riin_gentle", next: "day1_after_riin_tea_3" },
    "day1_after_riin_tea_3": { character: "riin_gentle", next: "day1_after_riin_tea_4" },
    "day1_after_riin_tea_4": { character: "riin_normal", next: "day1_after_riin_tea_5" },
    "day1_after_riin_tea_5": { character: "riin_normal", next: "day1_after_riin_tea_6" },
    "day1_after_riin_tea_6": { character: "riin_smile", next: "day1_after_riin_tea_7" },
    "day1_after_riin_tea_7": { character: "riin_gentle", next: "day1_after_riin_tea_13" },
    "day1_after_riin_tea_8": { character: "riin_normal", next: "day1_after_riin_tea_9" },
    "day1_after_riin_tea_9": { character: "riin_gentle", next: "day1_after_riin_tea_10" },
    "day1_after_riin_tea_10": { character: "riin_gentle", next: "day1_after_riin_tea_11" },
    "day1_after_riin_tea_11": { character: "riin_smile", next: "day1_after_riin_tea_12" },
    "day1_after_riin_tea_12": { character: "riin_smile", next: "day1_after_riin_tea_13" },
    "day1_after_riin_tea_13": { character: "riin_gentle", next: "day1_after_riin_tea_14" },
    "day1_after_riin_tea_14": { character: "riin_smile", next: "day1_after_riin_tea_15" },
    "day1_after_riin_tea_15": { character: "riin_gentle", next: "day1_after_riin_12" },

    "day1_after_eunsu_file_choice": {
        character: "eunsu_warm",
        choices: [
            { next: "day1_after_eunsu_file_1", setFlags: ["saw_eunsu_eraser_dust"], stats: { eunsu: { affinity: 2 } } },
            { next: "day1_after_eunsu_file_8", stats: { eunsu: { affinity: 3 } } }
        ]
    },
    "day1_after_eunsu_file_1": { character: "eunsu_normal", next: "day1_after_eunsu_file_2" },
    "day1_after_eunsu_file_2": { character: "eunsu_gentle", next: "day1_after_eunsu_file_3" },
    "day1_after_eunsu_file_3": { character: "eunsu_warm", next: "day1_after_eunsu_file_4" },
    "day1_after_eunsu_file_4": { character: "eunsu_warm", next: "day1_after_eunsu_file_5" },
    "day1_after_eunsu_file_5": { character: "eunsu_smile", next: "day1_after_eunsu_file_6" },
    "day1_after_eunsu_file_6": { character: "eunsu_normal", next: "day1_after_eunsu_file_7" },
    "day1_after_eunsu_file_7": { character: "eunsu_warm", next: "day1_after_eunsu_file_13" },
    "day1_after_eunsu_file_8": { character: "eunsu_normal", next: "day1_after_eunsu_file_9" },
    "day1_after_eunsu_file_9": { character: "eunsu_normal", next: "day1_after_eunsu_file_10" },
    "day1_after_eunsu_file_10": { character: "eunsu_gentle", next: "day1_after_eunsu_file_11" },
    "day1_after_eunsu_file_11": { character: "eunsu_warm", next: "day1_after_eunsu_file_12" },
    "day1_after_eunsu_file_12": { character: "eunsu_warm", next: "day1_after_eunsu_file_13" },
    "day1_after_eunsu_file_13": { character: "eunsu_normal", next: "day1_after_eunsu_file_14" },
    "day1_after_eunsu_file_14": { character: "eunsu_warm", next: "day1_after_eunsu_file_15" },
    "day1_after_eunsu_file_15": { character: "eunsu_warm", next: "day1_after_home_1" }
```

#### 3) [`assets/js/i18n/ko/day1_afterschool.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day1_afterschool.json)에 추가할 한국어 확정 문구 (64개 키)
```json
    "day1_after_sea_cabinet_choice": {
        "text": "*세아가 신청서 묶음을 철제 캐비닛에 넣으며 열쇠를 돌렸다.*",
        "choices": [
            "캐비닛 아래 칸에 쌓인 낡은 명찰 상자를 본다",
            "창가 화분에 꽂힌 플라스틱 이름표를 본다"
        ]
    },
    "day1_after_sea_cab_1": {
        "text": "아래 칸에 있는 플라스틱 상자는 뭐야? 명찰이 가득 들어 있네."
    },
    "day1_after_sea_cab_2": {
        "text": "*세아가 무릎을 굽혀 캐비닛 문을 반쯤 닫았다.*"
    },
    "day1_after_sea_cab_3": {
        "text": "체육대회 때 쓰는 임시 번호표랑 남는 명찰들이야. 매년 다시 걷어서 쓰거든."
    },
    "day1_after_sea_cab_4": {
        "text": "이름 적힌 것도 섞여 있던데."
    },
    "day1_after_sea_cab_5": {
        "text": "전학 간 애들 거나 잘못 인쇄된 거지. 정리할 시간이 없어서 한데 모아둔 거야."
    },
    "day1_after_sea_cab_6": {
        "text": "전학 간 애들이 꽤 되나 보네."
    },
    "day1_after_sea_cab_7": {
        "text": "글쎄, 내가 다 세어본 건 아니라서."
    },
    "day1_after_sea_cab_8": {
        "text": "저 창가 화분에는 왜 날짜만 적혀 있어? 식물 이름은 안 적고."
    },
    "day1_after_sea_cab_9": {
        "text": "*세아가 창가로 시선을 옮겼다. 화분 흙은 방금 물을 준 것처럼 검게 젖어 있었다.*"
    },
    "day1_after_sea_cab_10": {
        "text": "물 준 날을 적어두는 거야. 깜빡하면 금방 시들거든."
    },
    "day1_after_sea_cab_11": {
        "text": "어제 날짜 위로 지운 자국이 여러 줄이네. 매일 지우고 다시 쓰는 거야?"
    },
    "day1_after_sea_cab_12": {
        "text": "팻말이 하나뿐이니까. 새로 꽂을 필요 없잖아."
    },
    "day1_after_sea_cab_13": {
        "text": "*세아가 열쇠 꾸러미를 필통에 넣고 지퍼를 끝까지 당겼다.*"
    },
    "day1_after_sea_cab_14": {
        "text": "가자. 수위 아저씨가 본관 문 잠그기 전에 나가야 해."
    },
    "day1_after_sea_cab_15": {
        "text": "응. 가방 챙겼어."
    },
    "day1_after_yuna_back_choice": {
        "text": "*유나가 건넨 폴라로이드 사진을 손바닥 위에서 뒤집어 봤다.*",
        "choices": [
            "사진 뒷면 구석에 적힌 연필 숫자를 묻는다",
            "유나의 가방에서 나는 열쇠 소리를 묻는다"
        ]
    },
    "day1_after_yuna_back_1": {
        "text": "유나야, 사진 뒷면에 연필로 작게 '13'이라고 적힌 건 필름 번호야?"
    },
    "day1_after_yuna_back_2": {
        "text": "*유나의 발걸음이 반 박자 늦춰졌다.*"
    },
    "day1_after_yuna_back_3": {
        "text": "네. 한 팩에 열 장씩 들어가는데, 제가 몇 번째 팩인지 헷갈려서 적어둔 거예요."
    },
    "day1_after_yuna_back_4": {
        "text": "열세 번째 팩이면 사진 정말 많이 찍었네."
    },
    "day1_after_yuna_back_5": {
        "text": "남는 게 사진밖에 없으니까요. 기억은 생각보다 빨리 흐려지잖아요."
    },
    "day1_after_yuna_back_6": {
        "text": "그래도 도서관 창가 사진은 선명하게 잘 나왔다."
    },
    "day1_after_yuna_back_7": {
        "text": "책갈피로 쓰세요. 구겨지지 않게 두꺼운 책 사이에 끼워두면 오래 가요."
    },
    "day1_after_yuna_back_8": {
        "text": "가방에서 계속 금속 부딪히는 소리가 나네. 열쇠가 많아?"
    },
    "day1_after_yuna_back_9": {
        "text": "*유나가 가방 옆주머니를 손바닥으로 감싸 소리를 죽였다.*"
    },
    "day1_after_yuna_back_10": {
        "text": "구관 사진부실이랑 암실 열쇠예요. 부원이 저 혼자라 제가 다 들고 다녀요."
    },
    "day1_after_yuna_back_11": {
        "text": "암실도 따로 있어? 요즘은 다 디지털로 찍지 않아?"
    },
    "day1_after_yuna_back_12": {
        "text": "디지털은 누가 지우면 끝이잖아요. 현상해 둔 필름은 손으로 없애기 전엔 안 사라져요."
    },
    "day1_after_yuna_back_13": {
        "text": "*현관 신발장 앞에서 유나가 실내화 주머니를 고쳐 쥐었다.*"
    },
    "day1_after_yuna_back_14": {
        "text": "저는 구관 들렀다 갈게요. 선배는 해 지기 전에 정문으로 나가세요."
    },
    "day1_after_yuna_back_15": {
        "text": "응, 내일 도서관에서 보자."
    },
    "day1_after_riin_tea_choice": {
        "text": "*리인 선생님이 건넨 반투명 약봉투 속 티백 두 개가 포개져 있다.*",
        "choices": [
            "봉투 겉면에 찍힌 파란 도장 숫자를 묻는다",
            "스피커에서 흐르는 피아노곡 제목을 묻는다"
        ]
    },
    "day1_after_riin_tea_1": {
        "text": "선생님, 봉투 귀퉁이에 찍힌 날짜 도장은 제조일자예요?"
    },
    "day1_after_riin_tea_2": {
        "text": "*리인 선생님이 찻주전자 뚜껑을 덮으며 봉투를 흘끗 봤다.*"
    },
    "day1_after_riin_tea_3": {
        "text": "비품실에 들어온 날이야. 보건실 물품은 개봉 날짜를 다 찍어두게 되어 있거든."
    },
    "day1_after_riin_tea_4": {
        "text": "차 티백까지 그렇게 관리해요?"
    },
    "day1_after_riin_tea_5": {
        "text": "학생 입에 들어가는 거니까. 이 학교는 기록 남기는 걸 유난히 꼼꼼하게 봐."
    },
    "day1_after_riin_tea_6": {
        "text": "선생님 손이 많이 가겠네요."
    },
    "day1_after_riin_tea_7": {
        "text": "익숙해지면 손이 알아서 움직여요. 생각 안 하고 도장부터 찍게 되지."
    },
    "day1_after_riin_tea_8": {
        "text": "지금 나오는 피아노곡은 제목이 뭐예요? 아까부터 같은 구간이 반복되는 것 같아서요."
    },
    "day1_after_riin_tea_9": {
        "text": "*리인 선생님이 스피커 볼륨 노브에 손끝을 얹었다.*"
    },
    "day1_after_riin_tea_10": {
        "text": "수면 유도용 연주곡이라 마디가 계속 이어져요. 끝나는 부분이 따로 없어."
    },
    "day1_after_riin_tea_11": {
        "text": "계속 들으면 나른하긴 하네요."
    },
    "day1_after_riin_tea_12": {
        "text": "그치? 맥박이 빠를 때 틀어두면 호흡이 금방 고르게 바뀌거든."
    },
    "day1_after_riin_tea_13": {
        "text": "*선생님이 빈 종이컵을 겹쳐 싱크대 옆에 놓았다.*"
    },
    "day1_after_riin_tea_14": {
        "text": "오늘 밤에 잠 설쳐도 내일 아침엔 제시간에 눈 떠질 거예요. 걱정 말고 자요."
    },
    "day1_after_riin_tea_15": {
        "text": "네, 내일 뵐게요."
    },
    "day1_after_eunsu_file_choice": {
        "text": "*은수 선생님의 책상 위 서류철 옆에 흰 지우개 가루가 뭉쳐 있다.*",
        "choices": [
            "서류철 모서리의 지우개 가루를 가리킨다",
            "교무실 벽시계가 5분 빠른 이유를 묻는다"
        ]
    },
    "day1_after_eunsu_file_1": {
        "text": "선생님, 제 상담 기록부 연필로 적으세요? 지우개 가루가 꽤 남아서요."
    },
    "day1_after_eunsu_file_2": {
        "text": "*은수 선생님이 손등으로 책상 모서리를 가볍게 쓸어냈다.*"
    },
    "day1_after_eunsu_file_3": {
        "text": "초안은 연필로 먼저 적어. 첫날 인상이랑 일주일 뒤 모습이 달라지는 학생이 많거든."
    },
    "day1_after_eunsu_file_4": {
        "text": "제 칸에는 뭐라고 적으셨어요?"
    },
    "day1_after_eunsu_file_5": {
        "text": "비밀이야. 졸업할 때쯤 되면 보여줄게."
    },
    "day1_after_eunsu_file_6": {
        "text": "졸업하려면 아직 멀었는데요."
    },
    "day1_after_eunsu_file_7": {
        "text": "학교 시간은 생각보다 금방 가. 정신 차려보면 금요일 저녁일걸."
    },
    "day1_after_eunsu_file_8": {
        "text": "저 벽시계는 원래 5분 빠르게 맞춰 둔 거예요? 복도 시계랑 시간이 달라서요."
    },
    "day1_after_eunsu_file_9": {
        "text": "*은수 선생님이 고개를 들어 벽시계 초침을 바라봤다.*"
    },
    "day1_after_eunsu_file_10": {
        "text": "교무실 시계만 조금 빨라. 종 치기 전에 미리 움직여야 수업에 안 늦으니까."
    },
    "day1_after_eunsu_file_11": {
        "text": "선생님들도 지각 걱정을 하시네요."
    },
    "day1_after_eunsu_file_12": {
        "text": "담임이 늦으면 반 애들이 불안해하잖아. 정해진 시간에 정해진 자리에 있어야 안심하지."
    },
    "day1_after_eunsu_file_13": {
        "text": "*선생님이 식은 커피잔을 들어 싱크대 쪽으로 옮겼다.*"
    },
    "day1_after_eunsu_file_14": {
        "text": "오늘 첫날이라 피곤할 텐데 일찍 들어가서 쉬어. 내일 아침 조회 때 보자."
    },
    "day1_after_eunsu_file_15": {
        "text": "네, 안녕히 계세요."
    }
```

---

### C-3. Day 2 Lunch ([`assets/js/scenario/day2_2_lunch.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day2_2_lunch.js) & [`assets/js/i18n/ko/day2_lunch.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day2_lunch.json)) — +56노드

#### 1) 기존 노드 연결(Hook) 변경 4곳
- `day2_lunch_sea_25.next`: 기존 `"day2_lunch_end"` → **`"day2_lunch_sea_ticket_choice"`** 로 변경
- `day2_lunch_yuna_24.next`: 기존 `"day2_lunch_end"` → **`"day2_lunch_yuna_map_choice"`** 로 변경
- `day2_lunch_riin_29.next`: 기존 `"day2_lunch_end"` → **`"day2_lunch_riin_pulse_choice"`** 로 변경
- `day2_lunch_rooftop_11.next`: 기존 `"day2_lunch_end"` → **`"day2_lunch_rooftop_step_choice"`** 로 변경

#### 2) [`assets/js/scenario/day2_2_lunch.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day2_2_lunch.js)에 추가할 56개 씬 정의
```js
    "day2_lunch_sea_ticket_choice": {
        character: "sea_smile",
        choices: [
            { next: "day2_lunch_sea_tkt_1", stats: { sea: { affinity: 3 } } },
            { next: "day2_lunch_sea_tkt_8", setFlags: ["saw_sea_playlist_dates"], stats: { sea: { affinity: 1 }, seolhwa: { affinity: 2 } } }
        ]
    },
    "day2_lunch_sea_tkt_1": { character: "sea_normal", next: "day2_lunch_sea_tkt_2" },
    "day2_lunch_sea_tkt_2": { character: "sea_normal", next: "day2_lunch_sea_tkt_3" },
    "day2_lunch_sea_tkt_3": { character: "sea_smile", next: "day2_lunch_sea_tkt_4" },
    "day2_lunch_sea_tkt_4": { character: "sea_smile", next: "day2_lunch_sea_tkt_5" },
    "day2_lunch_sea_tkt_5": { character: "sea_smile", next: "day2_lunch_sea_tkt_6" },
    "day2_lunch_sea_tkt_6": { character: "sea_normal", next: "day2_lunch_sea_tkt_7" },
    "day2_lunch_sea_tkt_7": { character: "sea_smile", next: "day2_lunch_sea_tkt_13" },
    "day2_lunch_sea_tkt_8": { character: "sea_normal", next: "day2_lunch_sea_tkt_9" },
    "day2_lunch_sea_tkt_9": { character: "sea_serious", next: "day2_lunch_sea_tkt_10" },
    "day2_lunch_sea_tkt_10": { character: "sea_normal", next: "day2_lunch_sea_tkt_11" },
    "day2_lunch_sea_tkt_11": { character: "sea_normal", next: "day2_lunch_sea_tkt_12" },
    "day2_lunch_sea_tkt_12": { character: "sea_smile", next: "day2_lunch_sea_tkt_13" },
    "day2_lunch_sea_tkt_13": { character: "sea_smile", next: "day2_lunch_end" },

    "day2_lunch_yuna_map_choice": {
        character: "yuna_normal",
        choices: [
            { next: "day2_lunch_yuna_map_1", setFlags: ["saw_yuna_double_shadow"], stats: { yuna: { affinity: 2 }, seolhwa: { affinity: 2 } } },
            { next: "day2_lunch_yuna_map_8", setFlags: ["learned_old_building_darkroom"], stats: { yuna: { affinity: 4 } } }
        ]
    },
    "day2_lunch_yuna_map_1": { character: "yuna_scared", next: "day2_lunch_yuna_map_2" },
    "day2_lunch_yuna_map_2": { character: "yuna_shy", next: "day2_lunch_yuna_map_3" },
    "day2_lunch_yuna_map_3": { character: "yuna_normal", next: "day2_lunch_yuna_map_4" },
    "day2_lunch_yuna_map_4": { character: "yuna_scared", next: "day2_lunch_yuna_map_5" },
    "day2_lunch_yuna_map_5": { character: "yuna_shy", next: "day2_lunch_yuna_map_6" },
    "day2_lunch_yuna_map_6": { character: "yuna_normal", next: "day2_lunch_yuna_map_7" },
    "day2_lunch_yuna_map_7": { character: "yuna_shy", next: "day2_lunch_yuna_map_12" },
    "day2_lunch_yuna_map_8": { character: "yuna_normal", next: "day2_lunch_yuna_map_9" },
    "day2_lunch_yuna_map_9": { character: "yuna_normal", next: "day2_lunch_yuna_map_10" },
    "day2_lunch_yuna_map_10": { character: "yuna_shy", next: "day2_lunch_yuna_map_11" },
    "day2_lunch_yuna_map_11": { character: "yuna_serious", next: "day2_lunch_yuna_map_12" },
    "day2_lunch_yuna_map_12": { character: "yuna_normal", next: "day2_lunch_yuna_map_13" },
    "day2_lunch_yuna_map_13": { character: "yuna_smile", next: "day2_lunch_end" },

    "day2_lunch_riin_pulse_choice": {
        character: "riin_gentle",
        choices: [
            { next: "day2_lunch_riin_pls_1", setFlags: ["saw_duplicate_health_chart"], stats: { riin: { affinity: 1 }, seolhwa: { affinity: 2 } } },
            { next: "day2_lunch_riin_pls_8", stats: { riin: { affinity: 3 } } }
        ]
    },
    "day2_lunch_riin_pls_1": { character: "riin_normal", next: "day2_lunch_riin_pls_2" },
    "day2_lunch_riin_pls_2": { character: "riin_normal", next: "day2_lunch_riin_pls_3" },
    "day2_lunch_riin_pls_3": { character: "riin_gentle", next: "day2_lunch_riin_pls_4" },
    "day2_lunch_riin_pls_4": { character: "riin_gentle", next: "day2_lunch_riin_pls_5" },
    "day2_lunch_riin_pls_5": { character: "riin_normal", next: "day2_lunch_riin_pls_6" },
    "day2_lunch_riin_pls_6": { character: "riin_smile", next: "day2_lunch_riin_pls_7" },
    "day2_lunch_riin_pls_7": { character: "riin_gentle", next: "day2_lunch_riin_pls_13" },
    "day2_lunch_riin_pls_8": { character: "riin_normal", next: "day2_lunch_riin_pls_9" },
    "day2_lunch_riin_pls_9": { character: "riin_serious", next: "day2_lunch_riin_pls_10" },
    "day2_lunch_riin_pls_10": { character: "riin_serious", next: "day2_lunch_riin_pls_11" },
    "day2_lunch_riin_pls_11": { character: "riin_normal", next: "day2_lunch_riin_pls_12" },
    "day2_lunch_riin_pls_12": { character: "riin_gentle", next: "day2_lunch_riin_pls_13" },
    "day2_lunch_riin_pls_13": { character: "riin_gentle", next: "day2_lunch_end" },

    "day2_lunch_rooftop_step_choice": {
        character: null,
        choices: [
            { next: "day2_lunch_rooftop_stp_1", stats: { seolhwa: { affinity: 3 } } },
            { next: "day2_lunch_rooftop_stp_7", setFlags: ["found_cycle13_sticker"], stats: { eunsu: { affinity: 2 }, seolhwa: { affinity: 2 } } }
        ]
    },
    "day2_lunch_rooftop_stp_1": { character: null, next: "day2_lunch_rooftop_stp_2" },
    "day2_lunch_rooftop_stp_2": { character: null, next: "day2_lunch_rooftop_stp_3" },
    "day2_lunch_rooftop_stp_3": { character: null, next: "day2_lunch_rooftop_stp_4" },
    "day2_lunch_rooftop_stp_4": { character: null, next: "day2_lunch_rooftop_stp_5" },
    "day2_lunch_rooftop_stp_5": { character: null, next: "day2_lunch_rooftop_stp_6" },
    "day2_lunch_rooftop_stp_6": { character: null, next: "day2_lunch_rooftop_stp_13" },
    "day2_lunch_rooftop_stp_7": { background: "stairway", character: null, next: "day2_lunch_rooftop_stp_8" },
    "day2_lunch_rooftop_stp_8": { character: null, next: "day2_lunch_rooftop_stp_9" },
    "day2_lunch_rooftop_stp_9": { character: null, next: "day2_lunch_rooftop_stp_10" },
    "day2_lunch_rooftop_stp_10": { character: null, next: "day2_lunch_rooftop_stp_11" },
    "day2_lunch_rooftop_stp_11": { character: null, next: "day2_lunch_rooftop_stp_12" },
    "day2_lunch_rooftop_stp_12": { character: null, next: "day2_lunch_rooftop_stp_13" },
    "day2_lunch_rooftop_stp_13": { background: "corridor", character: null, next: "day2_lunch_end" }
```

#### 3) [`assets/js/i18n/ko/day2_lunch.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day2_lunch.json)에 추가할 한국어 확정 문구 (56개 키)
```json
    "day2_lunch_sea_ticket_choice": {
        "text": "*세아가 이어폰 케이스 뚜껑을 닫으며 나를 올려다봤다.*",
        "choices": [
            "토요일에 어디서 만날지 구체적으로 묻는다",
            "방금 뒤집어 놓은 휴대폰의 재생목록 이름을 묻는다"
        ]
    },
    "day2_lunch_sea_tkt_1": {
        "text": "토요일에 시내 간다고 했잖아. 몇 시에 어디서 볼까?"
    },
    "day2_lunch_sea_tkt_2": {
        "text": "*세아의 손끝이 이어폰 케이스 이음매 위에서 잠깐 멈췄다.*"
    },
    "day2_lunch_sea_tkt_3": {
        "text": "금요일 밤에 메시지로 정하자. 지금 시간까지 정해두면 숙제하는 기분이잖아."
    },
    "day2_lunch_sea_tkt_4": {
        "text": "네가 먼저 약속 잡자고 해놓고 미루네."
    },
    "day2_lunch_sea_tkt_5": {
        "text": "미루는 거 아니야. 금요일까지 네가 안 까먹나 보려는 거지."
    },
    "day2_lunch_sea_tkt_6": {
        "text": "이틀 뒤에 할 약속을 왜 까먹어."
    },
    "day2_lunch_sea_tkt_7": {
        "text": "안 까먹으면 됐어. 크로플 사줄 테니까 금요일 저녁에 딴소리하지 마."
    },
    "day2_lunch_sea_tkt_8": {
        "text": "아까 휴대폰 화면 뒤집을 때 봤는데, 재생목록 제목이 날짜로 되어 있던데?"
    },
    "day2_lunch_sea_tkt_9": {
        "text": "*세아가 휴대폰을 교복 주머니 안으로 깊숙이 밀어 넣었다.*"
    },
    "day2_lunch_sea_tkt_10": {
        "text": "계절 바뀔 때마다 목록을 새로 만들거든. 옛날 목록은 지우기 아까워서 그대로 두고."
    },
    "day2_lunch_sea_tkt_11": {
        "text": "곡은 다 비슷한 거 들어?"
    },
    "day2_lunch_sea_tkt_12": {
        "text": "응. 한 번 꽂힌 노래는 질릴 때까지 그것만 반복해서 들어. 종 치겠다, 책상 닦자."
    },
    "day2_lunch_sea_tkt_13": {
        "text": "*세아가 물티슈를 뽑아 내 책상 모서리부터 닦아냈다.*"
    },
    "day2_lunch_yuna_map_choice": {
        "text": "*유나가 카메라 전원을 끄려다 내 시선을 의식하고 멈칫했다.*",
        "choices": [
            "시간이 찍히지 않은 첫 사진의 그림자를 자세히 본다",
            "사진부실이 있다는 구관 위치를 물어본다"
        ]
    },
    "day2_lunch_yuna_map_1": {
        "text": "잠깐만, 끄지 마. 그 첫 번째 사진 오른쪽 아래에 길게 찍힌 건 사람 그림자 아니야?"
    },
    "day2_lunch_yuna_map_2": {
        "text": "*유나가 숨을 삼키며 화면 밝기를 한 단계 낮췄다.*"
    },
    "day2_lunch_yuna_map_3": {
        "text": "제 그림자예요. 역광에서 찍으면 발밑이 길게 늘어지거든요."
    },
    "day2_lunch_yuna_map_4": {
        "text": "네 그림자 옆에 하나 더 겹쳐 있잖아. 키가 나만 한데."
    },
    "day2_lunch_yuna_map_5": {
        "text": "가로등 기둥 그림자일 거예요. 오래된 렌즈라 가장자리가 좀 일그러져요."
    },
    "day2_lunch_yuna_map_6": {
        "text": "렌즈 탓으로 돌리기엔 어깨선이 뚜렷하던데."
    },
    "day2_lunch_yuna_map_7": {
        "text": "선배는 자꾸 사진 구석만 보시네요. 다음엔 배경 깨끗한 곳에서 찍어올게요."
    },
    "day2_lunch_yuna_map_8": {
        "text": "사진부실은 어디 있어? 본관 안내도에는 안 보이던데."
    },
    "day2_lunch_yuna_map_9": {
        "text": "구관 계단 아래 반지하 쪽이요. 창문이 작아서 암실로 쓰기엔 거기가 딱 좋거든요."
    },
    "day2_lunch_yuna_map_10": {
        "text": "혼자 거기 있으면 안 무서워?"
    },
    "day2_lunch_yuna_map_11": {
        "text": "바깥보다 안쪽이 더 안전해요. 문만 잠그면 아무도 안 내려오니까요."
    },
    "day2_lunch_yuna_map_12": {
        "text": "*유나가 과자 봉지를 접어 가방 앞주머니에 넣었다.*"
    },
    "day2_lunch_yuna_map_13": {
        "text": "내일 점심에는 제가 먼저 찾을지도 몰라요. 그땐 놀라지 마세요."
    },
    "day2_lunch_riin_pulse_choice": {
        "text": "*찻잔 받침에 남은 둥근 물기가 형광등 불빛을 받아 반짝였다.*",
        "choices": [
            "받침을 닦으며 기록지 아래 겹쳐진 이전 차트를 본다",
            "어제 꿨던 어두운 복도 꿈 이야기를 꺼낸다"
        ]
    },
    "day2_lunch_riin_pls_1": {
        "text": "*티슈를 뽑아 받침을 닦다가, 내 기록지 아래에 끼워진 같은 양식의 종이 모서리를 봤다.*"
    },
    "day2_lunch_riin_pls_2": {
        "text": "선생님, 제 기록지 아래 있는 것도 전학생 차트예요? 혈압 숫자가 저랑 똑같네요."
    },
    "day2_lunch_riin_pls_3": {
        "text": "*리인 선생님이 클립보드를 자연스럽게 당겨 서랍 안에 넣었다.*"
    },
    "day2_lunch_riin_pls_4": {
        "text": "작년 평균치 예시 양식이야. 숫자 적을 때 참고하려고 밑에 받쳐둔 거지."
    },
    "day2_lunch_riin_pls_5": {
        "text": "예시 양식인데 연필로 쓴 흔적이 있던데요."
    },
    "day2_lunch_riin_pls_6": {
        "text": "인쇄가 흐려서 덧쓴 거야. 눈이 참 빠르네, {name}."
    },
    "day2_lunch_riin_pls_7": {
        "text": "그냥 숫자가 같길래 신기해서요."
    },
    "day2_lunch_riin_pls_8": {
        "text": "사실 어제 꿈에서 학교 복도를 걸었거든요. 문마다 잠겨 있고 비상등만 켜져 있었어요."
    },
    "day2_lunch_riin_pls_9": {
        "text": "*리인 선생님이 찻잔을 싱크대에 내려놓다 동작을 멈췄다.*"
    },
    "day2_lunch_riin_pls_10": {
        "text": "복도 끝까지 가봤어?"
    },
    "day2_lunch_riin_pls_11": {
        "text": "아니요, 중간에 종소리가 나서 깼어요."
    },
    "day2_lunch_riin_pls_12": {
        "text": "잘했어. 꿈에서라도 어두운 복도 끝까지는 가지 마. 괜히 잠만 깊어져서 아침에 일어나기 힘들어."
    },
    "day2_lunch_riin_pls_13": {
        "text": "*선생님이 수돗물을 틀어 찻잔을 헹궜다. 물소리가 보건실 안을 채웠다.*"
    },
    "day2_lunch_rooftop_step_choice": {
        "text": "*옥상 바람이 잦아들자 철망 너머와 계단 아래쪽에서 서로 다른 기척이 느껴졌다.*",
        "choices": [
            "철망이 휜 자리 아래쪽 본관 뒤편 화단을 내려다본다",
            "비상계단 아래에서 들린 구두 소리를 따라 내려가 본다"
        ]
    },
    "day2_lunch_rooftop_stp_1": {
        "text": "*철망이 벌어진 틈으로 몸을 숙여 4층 아래 화단을 내려다봤다.*"
    },
    "day2_lunch_rooftop_stp_2": {
        "text": "*자갈이 깔린 배수로 옆에 하얀 실내화 한 짝이 흙먼지를 뒤집어쓴 채 뒤집혀 있었다.*"
    },
    "day2_lunch_rooftop_stp_3": {
        "text": "누가 창밖으로 떨어뜨린 건가."
    },
    "day2_lunch_rooftop_stp_4": {
        "text": "*실내화 앞코에 매직으로 쓴 이름 세 글자가 비에 번져 첫 자음만 남았다.*"
    },
    "day2_lunch_rooftop_stp_5": {
        "text": "*더 자세히 보려는데 3층 교무실 창문이 닫히며 유리창에 햇빛이 반사됐다.*"
    },
    "day2_lunch_rooftop_stp_6": {
        "text": "*눈을 비비고 다시 내려다봤을 땐 화단 그늘에 가려 실내화가 잘 보이지 않았다.*"
    },
    "day2_lunch_rooftop_stp_7": {
        "text": "*옥상 문을 열고 비상계단 난간 너머로 아래층을 내려다봤다.*"
    },
    "day2_lunch_rooftop_stp_8": {
        "text": "*일정한 간격으로 울리던 낮은 굽 소리가 3층 복도 문 앞에서 딱 멈췄다.*"
    },
    "day2_lunch_rooftop_stp_9": {
        "text": "*계단 한 칸을 밟자 콘크리트 먼지가 구두코 위로 내려앉았다.*"
    },
    "day2_lunch_rooftop_stp_10": {
        "text": "*3층 층계참 바닥에 은수 선생님이 들고 있던 결재 서류 표지 스티커가 떨어져 있었다.*"
    },
    "day2_lunch_rooftop_stp_11": {
        "text": "*주워 들자 스티커 모서리에 `제13차 교육과정 점검`이라는 인쇄 글자가 반쯤 찢겨 있었다.*"
    },
    "day2_lunch_rooftop_stp_12": {
        "text": "교육청 서류라더니, 학교 내부 양식이잖아."
    },
    "day2_lunch_rooftop_stp_13": {
        "text": "*종이 조각을 주머니에 넣고 교실 쪽 복도 문을 열었다.*"
    }
```

---

### C-4. Day 2 Afterschool ([`assets/js/scenario/day2_3_afterschool.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day2_3_afterschool.js) & [`assets/js/i18n/ko/day2_afterschool.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day2_afterschool.json)) — +56노드

#### 1) 기존 노드 연결(Hook) 변경 2곳
- `day2_after_sea_28.next`: 기존 `"day2_after_hallway_1"` → **`"day2_after_detour_choice"`** 로 변경
- `day2_after_seolhwa_8.next`: 기존 `"day2_after_end"` → **`"day2_after_seolhwa_trace_choice"`** 로 변경

#### 2) [`assets/js/scenario/day2_3_afterschool.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day2_3_afterschool.js)에 추가할 56개 씬 정의
```js
    "day2_after_detour_choice": {
        background: "corridor",
        character: null,
        choices: [
            { next: "day2_after_detour_hall_1", stats: { sea: { affinity: 2 } } },
            { next: "day2_after_detour_lib_1", setFlags: ["saw_board_window_photo"], stats: { yuna: { affinity: 3 }, seolhwa: { affinity: 2 } } },
            { next: "day2_after_detour_nur_1", setFlags: ["overheard_riin_day2_call"], stats: { riin: { affinity: 2 }, seolhwa: { affinity: 2 } } }
        ]
    },
    "day2_after_detour_hall_1": { character: null, next: "day2_after_detour_hall_2" },
    "day2_after_detour_hall_2": { character: null, next: "day2_after_detour_hall_3" },
    "day2_after_detour_hall_3": { character: null, next: "day2_after_detour_hall_4" },
    "day2_after_detour_hall_4": { character: null, next: "day2_after_detour_hall_5" },
    "day2_after_detour_hall_5": { character: null, next: "day2_after_detour_hall_6" },
    "day2_after_detour_hall_6": { character: null, next: "day2_after_detour_hall_7" },
    "day2_after_detour_hall_7": { character: null, next: "day2_after_detour_hall_8" },
    "day2_after_detour_hall_8": { character: null, next: "day2_after_detour_hall_9" },
    "day2_after_detour_hall_9": { character: null, next: "day2_after_detour_hall_10" },
    "day2_after_detour_hall_10": { character: null, next: "day2_after_detour_hall_11" },
    "day2_after_detour_hall_11": { character: null, next: "day2_after_detour_hall_12" },
    "day2_after_detour_hall_12": { character: null, next: "day2_after_hallway_1" },

    "day2_after_detour_lib_1": { background: "corridor", character: null, next: "day2_after_detour_lib_2" },
    "day2_after_detour_lib_2": { character: null, next: "day2_after_detour_lib_3" },
    "day2_after_detour_lib_3": { character: null, next: "day2_after_detour_lib_4" },
    "day2_after_detour_lib_4": { character: null, next: "day2_after_detour_lib_5" },
    "day2_after_detour_lib_5": { character: "yuna_shy", next: "day2_after_detour_lib_6" },
    "day2_after_detour_lib_6": { character: "yuna_normal", next: "day2_after_detour_lib_7" },
    "day2_after_detour_lib_7": { character: "yuna_normal", next: "day2_after_detour_lib_8" },
    "day2_after_detour_lib_8": { character: "yuna_scared", next: "day2_after_detour_lib_9" },
    "day2_after_detour_lib_9": { character: "yuna_shy", next: "day2_after_detour_lib_10" },
    "day2_after_detour_lib_10": { character: "yuna_normal", next: "day2_after_detour_lib_11" },
    "day2_after_detour_lib_11": { character: "yuna_shy", next: "day2_after_detour_lib_12" },
    "day2_after_detour_lib_12": { character: "yuna_serious", next: "day2_after_detour_lib_13" },
    "day2_after_detour_lib_13": { character: "yuna_serious", next: "day2_after_detour_lib_14" },
    "day2_after_detour_lib_14": { character: null, next: "day2_after_hallway_1" },

    "day2_after_detour_nur_1": { background: "corridor", character: null, next: "day2_after_detour_nur_2" },
    "day2_after_detour_nur_2": { character: null, next: "day2_after_detour_nur_3" },
    "day2_after_detour_nur_3": { character: null, next: "day2_after_detour_nur_4" },
    "day2_after_detour_nur_4": { character: null, next: "day2_after_detour_nur_5" },
    "day2_after_detour_nur_5": { character: "riin_normal", next: "day2_after_detour_nur_6" },
    "day2_after_detour_nur_6": { character: "riin_smile", next: "day2_after_detour_nur_7" },
    "day2_after_detour_nur_7": { character: "riin_normal", next: "day2_after_detour_nur_8" },
    "day2_after_detour_nur_8": { character: "riin_gentle", next: "day2_after_detour_nur_9" },
    "day2_after_detour_nur_9": { character: "riin_gentle", next: "day2_after_detour_nur_10" },
    "day2_after_detour_nur_10": { character: "riin_smile", next: "day2_after_detour_nur_11" },
    "day2_after_detour_nur_11": { character: "riin_gentle", next: "day2_after_detour_nur_12" },
    "day2_after_detour_nur_12": { character: "riin_smile", next: "day2_after_detour_nur_13" },
    "day2_after_detour_nur_13": { character: null, next: "day2_after_detour_nur_14" },
    "day2_after_detour_nur_14": { character: null, next: "day2_after_hallway_1" },

    "day2_after_seolhwa_trace_choice": {
        character: null,
        choices: [
            { next: "day2_after_seolhwa_trc_1", setFlags: ["found_seolhwa_gate_chalk"], stats: { seolhwa: { affinity: 4 } } },
            { next: "day2_after_seolhwa_trc_6", stats: { seolhwa: { affinity: 2 } } }
        ]
    },
    "day2_after_seolhwa_trc_1": { character: null, next: "day2_after_seolhwa_trc_2" },
    "day2_after_seolhwa_trc_2": { character: null, next: "day2_after_seolhwa_trc_3" },
    "day2_after_seolhwa_trc_3": { character: null, next: "day2_after_seolhwa_trc_4" },
    "day2_after_seolhwa_trc_4": { character: null, next: "day2_after_seolhwa_trc_5" },
    "day2_after_seolhwa_trc_5": { character: null, next: "day2_after_seolhwa_trc_9" },
    "day2_after_seolhwa_trc_6": { character: null, next: "day2_after_seolhwa_trc_7" },
    "day2_after_seolhwa_trc_7": { character: null, next: "day2_after_seolhwa_trc_8" },
    "day2_after_seolhwa_trc_8": { character: null, next: "day2_after_seolhwa_trc_9" },
    "day2_after_seolhwa_trc_9": { character: null, next: "day2_after_seolhwa_trc_10" },
    "day2_after_seolhwa_trc_10": { character: null, next: "day2_after_seolhwa_trc_11" },
    "day2_after_seolhwa_trc_11": { character: null, next: "day2_after_seolhwa_trc_12" },
    "day2_after_seolhwa_trc_12": { character: null, next: "day2_after_seolhwa_trc_13" },
    "day2_after_seolhwa_trc_13": { character: null, next: "day2_after_seolhwa_trc_14" },
    "day2_after_seolhwa_trc_14": { character: null, next: "day2_after_end" }
```

#### 3) [`assets/js/i18n/ko/day2_afterschool.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day2_afterschool.json)에 추가할 한국어 확정 문구 (56개 키)
```json
    "day2_after_detour_choice": {
        "text": "*학생회실 문을 나서자 노을이 길게 깔린 복도가 세 갈래로 이어졌다.*",
        "choices": [
            "자판기가 있는 중앙 복도로 바로 나간다",
            "구관으로 이어지는 도서관 앞 게시판을 들른다",
            "1층 보건실 앞 복도 창문을 확인하고 간다"
        ]
    },
    "day2_after_detour_hall_1": {
        "text": "*중앙 복도 바닥에 왁스 칠한 자국이 노을빛을 받아 길게 번들거렸다.*"
    },
    "day2_after_detour_hall_2": {
        "text": "*학생회실 문고리를 놓자 안에서 세아가 의자를 정리하는 소리가 작게 들렸다.*"
    },
    "day2_after_detour_hall_3": {
        "text": "*주머니 속 휴대폰이 한 번 짧게 진동했다.*"
    },
    "day2_after_detour_hall_4": {
        "text": "*꺼내 보니 방금 설치한 `한울 스마트 캠퍼스` 앱 상단에 `학생회실 체류 확인 완료`라는 배너가 떴다가 사라졌다.*"
    },
    "day2_after_detour_hall_5": {
        "text": "출입할 때 큐알 찍은 적도 없는데 방 위치까지 뜨네."
    },
    "day2_after_detour_hall_6": {
        "text": "*배터리 잔량이 아까보다 4퍼센트나 깎여 있었다.*"
    },
    "day2_after_detour_hall_7": {
        "text": "*앱 작업 관리자를 열어 강제 종료 버튼을 눌렀지만, 회색으로 비활성화되어 눌리지 않았다.*"
    },
    "day2_after_detour_hall_8": {
        "text": "*복도 모퉁이를 돌자 자판기 불빛 아래에 모여 선 같은 반 애들의 목소리가 들려왔다.*"
    },
    "day2_after_detour_hall_9": {
        "text": "*휴대폰 화면을 끄고 주머니에 넣었다.*"
    },
    "day2_after_detour_hall_10": {
        "text": "*자판기 위 환풍구에서 미지근한 바람이 웅웅거리며 불어 나왔다.*"
    },
    "day2_after_detour_hall_11": {
        "text": "*그중 한 명이 내 쪽을 보더니 반갑게 손을 들었다.*"
    },
    "day2_after_detour_hall_12": {
        "text": "*나도 표정을 풀고 자판기 쪽으로 걸어갔다.*"
    },
    "day2_after_detour_lib_1": {
        "text": "*도서관 앞 복도 게시판에는 이달의 추천 도서 목록과 사진부 전시 안내문이 압정으로 꽂혀 있었다.*"
    },
    "day2_after_detour_lib_2": {
        "text": "*전시 안내문 아래에 유나가 찍은 듯한 흑백 교정 사진 세 장이 나란히 붙어 있었다.*"
    },
    "day2_after_detour_lib_3": {
        "text": "*가운데 사진 속 3층 창가에 흐릿한 사람 실루엣이 서 있었다.*"
    },
    "day2_after_detour_lib_4": {
        "text": "어제 하교할 때 봤던 그 창문인데."
    },
    "day2_after_detour_lib_5": {
        "text": "*뒤쪽 도서관 문이 반쯤 열리며 유나가 고개를 내밀었다.*"
    },
    "day2_after_detour_lib_6": {
        "text": "선배? 아직 안 가셨네요."
    },
    "day2_after_detour_lib_7": {
        "text": "응, 세아 서류 정리 도와주고 나오는 길이야. 게시판 사진 이거 네가 찍은 거지?"
    },
    "day2_after_detour_lib_8": {
        "text": "*유나가 게시판 가운데 사진을 보더니 압정을 뽑아 사진 한 장을 떼어냈다.*"
    },
    "day2_after_detour_lib_9": {
        "text": "그건 지난주에 잘못 붙인 거예요. 인화할 때 얼룩이 묻어서 새로 뽑아야 해요."
    },
    "day2_after_detour_lib_10": {
        "text": "얼룩치곤 창문 안쪽에 서 있는 사람 형태던데."
    },
    "day2_after_detour_lib_11": {
        "text": "유리창에 비친 나뭇가지 그림자예요. 방과 후엔 3층 교실 다 비어 있거든요."
    },
    "day2_after_detour_lib_12": {
        "text": "*유나는 떼어낸 사진을 파일철 안쪽에 끼워 넣고 두 손으로 꼭 눌렀다.*"
    },
    "day2_after_detour_lib_13": {
        "text": "내일 점심에 꼭 시간 비워두세요. 보여드릴 게 있어요."
    },
    "day2_after_detour_lib_14": {
        "text": "*유나가 도서관 문을 닫고 들어가자 나는 중앙 복도 자판기 쪽으로 발길을 돌렸다.*"
    },
    "day2_after_detour_nur_1": {
        "text": "*1층 보건실 앞 복도를 지나가는데 반투명 유리창 너머로 형광등이 켜져 있었다.*"
    },
    "day2_after_detour_nur_2": {
        "text": "*문틈으로 소독용 알코올 냄새와 함께 낮은 통화 소리가 새어 나왔다.*"
    },
    "day2_after_detour_nur_3": {
        "text": "네, 내일 점심에 1차 확인 들어갑니다. 어지럼증 호소하면 바로 맞춰둘게요."
    },
    "day2_after_detour_nur_4": {
        "text": "*발소리를 죽이고 문 옆 벽에 붙어 섰다. 유리창에 비친 리인 선생님의 그림자가 캐비닛 자물쇠를 잠그고 있었다.*"
    },
    "day2_after_detour_nur_5": {
        "text": "*잠시 뒤 보건실 문이 열리고 가운을 벗어 팔에 걸친 리인 선생님이 나왔다.*"
    },
    "day2_after_detour_nur_6": {
        "text": "어라, {name}? 아직 집에 안 갔어?"
    },
    "day2_after_detour_nur_7": {
        "text": "학생회실 들렀다가 내려오는 길이에요. 방금 누구랑 통화하셨어요?"
    },
    "day2_after_detour_nur_8": {
        "text": "응, 약품 도매상. 봄철이라 빈혈이나 어지럼증 호소하는 애들이 늘어서 영양제 추가 주문했거든."
    },
    "day2_after_detour_nur_9": {
        "text": "*선생님의 설명은 매끄러웠지만 손에 든 휴대폰 화면에는 메모장만 떠 있었다.*"
    },
    "day2_after_detour_nur_10": {
        "text": "너도 내일 낮에 머리 무거우면 참지 말고 와. 미리 챙겨둘 테니까."
    },
    "day2_after_detour_nur_11": {
        "text": "네. 참고할게요."
    },
    "day2_after_detour_nur_12": {
        "text": "*리인 선생님이 현관 쪽으로 먼저 걸어가며 내 어깨를 가볍게 톡 두드렸다.*"
    },
    "day2_after_detour_nur_13": {
        "text": "*가운 자락에서 캐모마일 향 대신 싸늘한 알코올 냄새가 스쳤다.*"
    },
    "day2_after_detour_nur_14": {
        "text": "*발걸음을 돌려 자판기가 있는 복도 쪽으로 향했다.*"
    },
    "day2_after_seolhwa_trace_choice": {
        "text": "*설화가 사라진 교문 안쪽 길에 노을 그림자만 길게 남아 있다.*",
        "choices": [
            "설화가 서 있던 보도블록 위를 살펴본다",
            "설화가 걸어들어간 본관 3층 창문을 올려다본다"
        ]
    },
    "day2_after_seolhwa_trc_1": {
        "text": "*설화가 서 있던 은행나무 아래 보도블록으로 걸어가 바닥을 내려다봤다.*"
    },
    "day2_after_seolhwa_trc_2": {
        "text": "*마른 보도블록 틈새에 하얀 분필 조각 하나가 반쯤 부서진 채 놓여 있었다.*"
    },
    "day2_after_seolhwa_trc_3": {
        "text": "*집어 들자 손끝에 하얀 가루가 묻어났다. 교실 칠판 옆에 놓여 있던 것과 같은 분필이다.*"
    },
    "day2_after_seolhwa_trc_4": {
        "text": "방금 입 모양, 분명히 내 이름을 부른 것 같았는데."
    },
    "day2_after_seolhwa_trc_5": {
        "text": "*받침 없는 두 음절보다 끝소리가 길었다. '가지 마'였는지도 모른다.*"
    },
    "day2_after_seolhwa_trc_6": {
        "text": "*고개를 들어 본관 3층 왼쪽 끝 창문을 올려다봤다.*"
    },
    "day2_after_seolhwa_trc_7": {
        "text": "*어제 이 시간엔 분명 누군가 서 있었는데 오늘은 커튼이 반쯤 닫혀 있었다.*"
    },
    "day2_after_seolhwa_trc_8": {
        "text": "*바람이 불자 열린 창문 틈으로 흰 커튼 자락만 밖으로 부풀어 올랐다.*"
    },
    "day2_after_seolhwa_trc_9": {
        "text": "*교문을 지키는 수위실 창문 안쪽에서 초록색 모니터 불빛이 깜빡였다.*"
    },
    "day2_after_seolhwa_trc_10": {
        "text": "*주머니 속 휴대폰이 다시 짧게 울렸다. `하교 지점 통과 확인` 알림이었다.*"
    },
    "day2_after_seolhwa_trc_11": {
        "text": "정문 지날 때마다 기록이 남는 건가."
    },
    "day2_after_seolhwa_trc_12": {
        "text": "*분필 조각을 주머니 안쪽 깊숙이 넣고 교문 밖 내리막길을 걸었다.*"
    },
    "day2_after_seolhwa_trc_13": {
        "text": "*가로등이 하나씩 켜지며 내 그림자를 등 뒤로 길게 밀어냈다.*"
    },
    "day2_after_seolhwa_trc_14": {
        "text": "*내일 아침에는 누구보다 먼저 교실 뒷자리부터 확인해야겠다.*"
    }
```

---

### C-5. Day 3 Lunch ([`assets/js/scenario/day3_2_lunch.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day3_2_lunch.js) & [`assets/js/i18n/ko/day3_lunch.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day3_lunch.json)) — +48노드

#### 1) 기존 노드 연결(Hook) 변경 5곳
- `day3_lunch_door_open_12.next`: 기존 `"day3_lunch_end"` → **`"day3_lunch_yuna_pocket_choice"`** 로 변경
- `day3_lunch_sea_17.next`: 기존 `"day3_lunch_end"` → **`"day3_lunch_sea_tray_choice"`** 로 변경
- `day3_lunch_riin_drink_3.next`: 기존 `"day3_lunch_end"` → **`"day3_lunch_riin_sink_choice"`** 로 변경
- `day3_lunch_riin_refuse_2.next`: 기존 `"day3_lunch_end"` → **`"day3_lunch_riin_sink_choice"`** 로 변경
- `day3_lunch_alone_8.next`: 기존 `"day3_lunch_end"` → **`"day3_lunch_alone_chalk_choice"`** 로 변경

#### 2) [`assets/js/scenario/day3_2_lunch.js`](file:///d:/workspace/nevergrad/assets/js/scenario/day3_2_lunch.js)에 추가할 48개 씬 정의
```js
    "day3_lunch_yuna_pocket_choice": {
        character: null,
        choices: [
            { next: "day3_lunch_yuna_pkt_1", setFlags: ["checked_yuna_sd_mark"], stats: { yuna: { affinity: 3 } } },
            { next: "day3_lunch_yuna_pkt_5", stats: { seolhwa: { affinity: 2 } } }
        ]
    },
    "day3_lunch_yuna_pkt_1": { character: null, next: "day3_lunch_yuna_pkt_2" },
    "day3_lunch_yuna_pkt_2": { character: null, next: "day3_lunch_yuna_pkt_3" },
    "day3_lunch_yuna_pkt_3": { character: null, next: "day3_lunch_yuna_pkt_4" },
    "day3_lunch_yuna_pkt_4": { character: null, next: "day3_lunch_yuna_pkt_8" },
    "day3_lunch_yuna_pkt_5": { character: null, next: "day3_lunch_yuna_pkt_6" },
    "day3_lunch_yuna_pkt_6": { character: null, next: "day3_lunch_yuna_pkt_7" },
    "day3_lunch_yuna_pkt_7": { character: null, next: "day3_lunch_yuna_pkt_8" },
    "day3_lunch_yuna_pkt_8": { character: null, next: "day3_lunch_yuna_pkt_9" },
    "day3_lunch_yuna_pkt_9": { character: null, next: "day3_lunch_yuna_pkt_10" },
    "day3_lunch_yuna_pkt_10": { character: null, next: "day3_lunch_yuna_pkt_11" },
    "day3_lunch_yuna_pkt_11": { character: null, next: "day3_lunch_end" },

    "day3_lunch_sea_tray_choice": {
        character: "sea_smile",
        choices: [
            { next: "day3_lunch_sea_try_1", stats: { sea: { affinity: 2 } } },
            { next: "day3_lunch_sea_try_6", stats: { sea: { affinity: 3 } } }
        ]
    },
    "day3_lunch_sea_try_1": { character: "sea_normal", next: "day3_lunch_sea_try_2" },
    "day3_lunch_sea_try_2": { character: "sea_smile", next: "day3_lunch_sea_try_3" },
    "day3_lunch_sea_try_3": { character: "sea_smile", next: "day3_lunch_sea_try_4" },
    "day3_lunch_sea_try_4": { character: "sea_normal", next: "day3_lunch_sea_try_5" },
    "day3_lunch_sea_try_5": { character: "sea_serious", next: "day3_lunch_sea_try_11" },
    "day3_lunch_sea_try_6": { character: "sea_normal", next: "day3_lunch_sea_try_7" },
    "day3_lunch_sea_try_7": { character: "sea_normal", next: "day3_lunch_sea_try_8" },
    "day3_lunch_sea_try_8": { character: "sea_smile", next: "day3_lunch_sea_try_9" },
    "day3_lunch_sea_try_9": { character: "sea_normal", next: "day3_lunch_sea_try_10" },
    "day3_lunch_sea_try_10": { character: "sea_serious", next: "day3_lunch_sea_try_11" },
    "day3_lunch_sea_try_11": { character: null, next: "day3_lunch_end" },

    "day3_lunch_riin_sink_choice": {
        character: null,
        choices: [
            { next: "day3_lunch_riin_snk_1", stats: { seolhwa: { affinity: 2 } } },
            { next: "day3_lunch_riin_snk_4", setFlags: ["saw_riin_m_ampoule_cap"], stats: { seolhwa: { affinity: 3 } } }
        ]
    },
    "day3_lunch_riin_snk_1": { character: null, next: "day3_lunch_riin_snk_2" },
    "day3_lunch_riin_snk_2": { character: null, next: "day3_lunch_riin_snk_3" },
    "day3_lunch_riin_snk_3": { character: null, next: "day3_lunch_riin_snk_7" },
    "day3_lunch_riin_snk_4": { character: null, next: "day3_lunch_riin_snk_5" },
    "day3_lunch_riin_snk_5": { character: null, next: "day3_lunch_riin_snk_6" },
    "day3_lunch_riin_snk_6": { character: null, next: "day3_lunch_riin_snk_7" },
    "day3_lunch_riin_snk_7": { character: "riin_normal", next: "day3_lunch_riin_snk_8" },
    "day3_lunch_riin_snk_8": { character: "riin_gentle", next: "day3_lunch_riin_snk_9" },
    "day3_lunch_riin_snk_9": { character: "riin_gentle", next: "day3_lunch_riin_snk_10" },
    "day3_lunch_riin_snk_10": { character: "riin_smile", next: "day3_lunch_riin_snk_11" },
    "day3_lunch_riin_snk_11": { character: null, next: "day3_lunch_end" },

    "day3_lunch_alone_chalk_choice": {
        character: null,
        choices: [
            { next: "day3_lunch_alone_chk_1", setFlags: ["found_seolhwa_drawer_tally"], stats: { seolhwa: { affinity: 4 } } },
            { next: "day3_lunch_alone_chk_5", setFlags: ["saw_erased_rollbook_seolhwa"], stats: { seolhwa: { affinity: 3 } } }
        ]
    },
    "day3_lunch_alone_chk_1": { character: null, next: "day3_lunch_alone_chk_2" },
    "day3_lunch_alone_chk_2": { character: null, next: "day3_lunch_alone_chk_3" },
    "day3_lunch_alone_chk_3": { character: null, next: "day3_lunch_alone_chk_4" },
    "day3_lunch_alone_chk_4": { character: null, next: "day3_lunch_alone_chk_9" },
    "day3_lunch_alone_chk_5": { character: null, next: "day3_lunch_alone_chk_6" },
    "day3_lunch_alone_chk_6": { character: null, next: "day3_lunch_alone_chk_7" },
    "day3_lunch_alone_chk_7": { character: null, next: "day3_lunch_alone_chk_8" },
    "day3_lunch_alone_chk_8": { character: null, next: "day3_lunch_alone_chk_9" },
    "day3_lunch_alone_chk_9": { character: null, next: "day3_lunch_alone_chk_10" },
    "day3_lunch_alone_chk_10": { character: null, next: "day3_lunch_alone_chk_11" },
    "day3_lunch_alone_chk_11": { character: null, next: "day3_lunch_end" }
```

#### 3) [`assets/js/i18n/ko/day3_lunch.json`](file:///d:/workspace/nevergrad/assets/js/i18n/ko/day3_lunch.json)에 추가할 한국어 확정 문구 (48개 키)
```json
    "day3_lunch_yuna_pocket_choice": {
        "text": "*복도 모퉁이에 서서 가방 안쪽에 넣은 유나의 카메라를 손바닥으로 눌렀다.*",
        "choices": [
            "카메라 배터리 잔량과 메모리카드 슬롯을 확인한다",
            "복도 게시판에 붙은 학사일정표의 오늘 날짜를 본다"
        ]
    },
    "day3_lunch_yuna_pkt_1": {
        "text": "*가방 지퍼를 반쯤 열고 카메라 아래쪽 배터리 덮개를 손끝으로 만져봤다.*"
    },
    "day3_lunch_yuna_pkt_2": {
        "text": "*메모리카드 슬롯 옆에 유나가 손톱으로 그어둔 작은 표시가 있었다. 이미 복사본을 빼돌렸다는 신호였다.*"
    },
    "day3_lunch_yuna_pkt_3": {
        "text": "13장. 이름만 다르고 전부 내 얼굴이었어."
    },
    "day3_lunch_yuna_pkt_4": {
        "text": "*입속으로 중얼거리자 내 목소리인데도 남의 말을 따라 읽는 기분이 들었다.*"
    },
    "day3_lunch_yuna_pkt_5": {
        "text": "*복도 게시판 앞으로 다가가 유리창 너머 학사일정표를 들여다봤다.*"
    },
    "day3_lunch_yuna_pkt_6": {
        "text": "*수요일 칸에는 아무 행사도 적혀 있지 않았지만, 금요일 칸에는 빨간 사인펜으로 동그라미가 쳐져 있었다.*"
    },
    "day3_lunch_yuna_pkt_7": {
        "text": "길면 일주일이라고 했지. 어제 옥상 계단에서 은수 선생님이 한 말도 5일이었어."
    },
    "day3_lunch_yuna_pkt_8": {
        "text": "*이틀 남았다. 금요일이 지나면 열세 번째 사진도 이전 열두 장처럼 정리될 것이다.*"
    },
    "day3_lunch_yuna_pkt_9": {
        "text": "*복도 끝 교무실 문이 열리는 소리에 가방 지퍼를 끝까지 올렸다.*"
    },
    "day3_lunch_yuna_pkt_10": {
        "text": "*아무 일 없었던 사람처럼 걸음을 맞춰 교실 앞문으로 다가갔다.*"
    },
    "day3_lunch_yuna_pkt_11": {
        "text": "*문고리를 잡기 전, 손바닥의 땀을 바지 옆선에 한 번 닦아냈다.*"
    },
    "day3_lunch_sea_tray_choice": {
        "text": "*세아가 식판을 들고 일어나며 내 식판까지 자연스럽게 포개려 했다.*",
        "choices": [
            "내 식판은 직접 들겠다며 퇴식구까지 나란히 걷는다",
            "세아의 손목에 감긴 남색 머리끈을 가리킨다"
        ]
    },
    "day3_lunch_sea_try_1": {
        "text": "내 건 내가 들게. 반장한테 식판까지 맡기면 눈치 보여."
    },
    "day3_lunch_sea_try_2": {
        "text": "*세아가 손을 거두며 짧게 웃었다.*"
    },
    "day3_lunch_sea_try_3": {
        "text": "그래. 대신 퇴식구까지 같이 가. 혼자 가면 또 다른 데로 새잖아."
    },
    "day3_lunch_sea_try_4": {
        "text": "내가 어디로 샌다고 그래. 학교 안이 다 거기서 거긴데."
    },
    "day3_lunch_sea_try_5": {
        "text": "옥상이라든가, 구관이라든가. 안 가도 될 데가 생각보다 많거든."
    },
    "day3_lunch_sea_try_6": {
        "text": "그 손목에 감은 머리끈, 어제는 못 본 것 같은데 새로 산 거야?"
    },
    "day3_lunch_sea_try_7": {
        "text": "*세아가 빈 손으로 왼쪽 손목의 남색 고무줄을 한 번 만졌다.*"
    },
    "day3_lunch_sea_try_8": {
        "text": "체육 시간이나 서류 정리할 때 쓰려고 끼워둔 거야. 왜, 안 어울려?"
    },
    "day3_lunch_sea_try_9": {
        "text": "아니, 보풀이 일었길래 꽤 오래 쓴 건가 싶어서."
    },
    "day3_lunch_sea_try_10": {
        "text": "손에 익은 건 잘 안 바꿔. 끊어지기 전엔 계속 써."
    },
    "day3_lunch_sea_try_11": {
        "text": "*퇴식구 컨베이어 벨트 위로 식판 두 개가 맞부딪히며 금속 소리를 냈다.*"
    },
    "day3_lunch_riin_sink_choice": {
        "text": "*보건실 문을 나서기 직전, 리인 선생님의 등 뒤 싱크대와 휴지통이 눈에 들어왔다.*",
        "choices": [
            "싱크대 배수구 주변에 남은 옅은 보랏빛 물기를 본다",
            "페달형 휴지통 안쪽에 버려진 유리 앰플 마개를 본다"
        ]
    },
    "day3_lunch_riin_snk_1": {
        "text": "*싱크대 스테인리스 바닥 가장자리에 미처 씻기지 않은 연보라색 물방울 두 개가 맺혀 있었다.*"
    },
    "day3_lunch_riin_snk_2": {
        "text": "*수도꼭지에서 떨어진 물방울이 닿자마자 보랏빛이 투명하게 풀리며 배수구로 빨려 들어갔다.*"
    },
    "day3_lunch_riin_snk_3": {
        "text": "비타민 음료라기엔 물에 닿을 때 반응이 너무 빠르잖아."
    },
    "day3_lunch_riin_snk_4": {
        "text": "*시선을 조금 내려 싱크대 아래 흰색 페달 휴지통의 벌어진 틈을 들여다봤다.*"
    },
    "day3_lunch_riin_snk_5": {
        "text": "*알코올 솜 아래로 작은 갈색 유리 병목과 은색 라벨 조각이 반쯤 가려져 있었다.*"
    },
    "day3_lunch_riin_snk_6": {
        "text": "*라벨 끝에는 알파벳 `M`과 하이픈 하나만 남아 있었다.*"
    },
    "day3_lunch_riin_snk_7": {
        "text": "{name}, 아직 안 갔어? 어지러운 게 덜 가셨니?"
    },
    "day3_lunch_riin_snk_8": {
        "text": "*리인 선생님이 핸드타월로 손을 닦으며 돌아섰다. 안경알에 형광등이 하얗게 비쳤다.*"
    },
    "day3_lunch_riin_snk_9": {
        "text": "아니요, 이제 괜찮아요. 신발 끈이 느슨해서 잠깐 봤어요."
    },
    "day3_lunch_riin_snk_10": {
        "text": "그래. 오후 수업 듣다가 속 메스꺼우면 참지 말고 바로 내려와."
    },
    "day3_lunch_riin_snk_11": {
        "text": "*대답 대신 고개만 숙여 보이고 보건실 문을 닫았다.*"
    },
    "day3_lunch_alone_chalk_choice": {
        "text": "*설화의 책상 위에서 손을 떼자 교실 안의 정적이 귀를 눌렀다.*",
        "choices": [
            "설화의 책상 서랍 안쪽 천장을 손등으로 쓸어본다",
            "교탁 위 출석부에서 설화 이름 옆의 빈칸을 확인한다"
        ]
    },
    "day3_lunch_alone_chk_1": {
        "text": "*설화의 책상 서랍 안으로 손을 넣어 보이지 않는 위쪽 나무판 뒷면을 더듬었다.*"
    },
    "day3_lunch_alone_chk_2": {
        "text": "*손톱 끝에 거친 흠집들이 걸렸다. 상판과 똑같은 깊이로 그어진 짧은 작대기 열두 개였다.*"
    },
    "day3_lunch_alone_chk_3": {
        "text": "열두 번. 서랍 안쪽에도 세어놨어."
    },
    "day3_lunch_alone_chk_4": {
        "text": "*손을 빼자 손등에 오래된 나무 가루가 하얗게 묻어 나왔다.*"
    },
    "day3_lunch_alone_chk_5": {
        "text": "*앞쪽 교탁으로 걸어가 펼쳐진 출석부의 맨 마지막 줄을 짚었다.*"
    },
    "day3_lunch_alone_chk_6": {
        "text": "*'이설화' 세 글자 옆 출결 칸은 월요일부터 수요일까지 아무 기호도 없이 비어 있었다.*"
    },
    "day3_lunch_alone_chk_7": {
        "text": "*결석이나 조퇴 표시조차 없는 완전한 공란이었다. 종이를 빛에 비춰보자 연필로 적었다가 지운 자국만 겹겹이 패어 있었다.*"
    },
    "day3_lunch_alone_chk_8": {
        "text": "출석부에서조차 지워놓고 아무도 말을 안 한다고?"
    },
    "day3_lunch_alone_chk_9": {
        "text": "*복도 쪽 창문 너머로 점심시간을 마친 아이들의 발소리가 가까워졌다.*"
    },
    "day3_lunch_alone_chk_10": {
        "text": "*출석부를 원래 각도대로 덮어두고 내 자리로 돌아와 앉았다.*"
    },
    "day3_lunch_alone_chk_11": {
        "text": "*교실 문이 열리기 직전, 뒷자리 책상 위의 '여기서 나가'라는 글자를 가방으로 살짝 가렸다.*"
    }
```

---

## 5. `humanize-korean` (`im-not-ai`) 사전 검증 기록

`AGENTS.md`의 **Korean Dialogue and Narration** 규칙에 따라, 본 작업 지시서에 수록된 한국어 대사·지문 288개 노드(19,990자, 453문장)에 대해 `D:\workspace\im-not-ai` 파이프라인(`prepare_monolith_input.py` → `restore_modality.py` → `strip_injected_commas.py` → `verify_gates.py`) 점검 및 윤문을 완료했다.

- **초안(`01_input.txt`) 진단 결과**:
  - `risk_band: low`, `risk_score: 0`
  - 검출된 미세 패턴: `A-1`(`~에 대해` 1건), `C-8`(`~가 아니라 ~` 대구 5건), `D-14`(비유 표현 `방석처럼 깔려` 1건)
- **윤문 수정(`final.md`) 내역 (`C-8` 자연 구어 1건 유지, 지문 대구 4건·`A-1`·`D-14` 제거)**:
  1. `day1_lunch_yuna_lens_3`: `도서관 창문이 아니라 교문 명패가` → `도서관 창문 대신 교문 명패가` (`C-8` 해소)
  2. `day1_lunch_yuna_lens_10`: `꽃잎이 방석처럼 깔려 있었는데, 일어나니까` → `꽃잎이 수북이 깔려 있었는데 일어나니까` (`D-14` 및 `C-11` 해소)
  3. `day1_lunch_riin_chart_12`: 구어 대사 `"아침에 잘못 적은 학번이야. 볼펜이 아니라 연필로 써서 다행이지."` 유지 (`C-8` 과교정 방지 규칙 준수)
  4. `day1_lunch_alone_rail_1`: `녹슨 철판이 아니라 그 위에 덧칠한 회색 페인트만` → `녹슨 철판 위로 덧칠한 회색 페인트 층만` (`C-8` 해소)
  5. `day1_after_eunsu_file_choice`: `지우개 가루에 대해 묻는다` → `지우개 가루를 가리킨다` (`A-1` 해소)
  6. `day2_after_detour_lib_9~10`: `먼지가 아니라 창문 안쪽에 누가 서 있는 것 같던데` → `얼룩치곤 창문 안쪽에 서 있는 사람 형태던데` (`C-8` 해소)
  7. `day2_after_detour_nur_9`: `통화 목록이 아니라 메모장이었다` → `휴대폰 화면에는 메모장만 떠 있었다` (`C-8` 해소)
  8. `day3_lunch_alone_chk_7`: `결석도, 조퇴도, 병결도 아닌 완전한 공란이었다` → `결석이나 조퇴 표시조차 없는 완전한 공란이었다` (`C-8` 해소)
- **`verify_gates.py` 최종 통과 결과 (`exit code 0`)**:
  ```text
  [P0 문자율] 0.3% [전문] — OK (경고 30% / 중단 50%)
  [P1 목표달성] N/A — 구조 진단 (어휘 S1 앵커 없음)
  [P2 전멸] C-8 대구 5 → 1 — OK
  [P3 golden] PASS (수치 주입·각주·인용·register 이상 없음)
  [P4 터치율] 2.2% (10/453 문장) — 보고 전용
  [P5 서법] 소실 0문장 (참고 총수: 당위 2→2 / 완곡 2→2) — OK
  gate: OK — 수렴
  ```

---

## 6. 완료 후 필수 검증 체크리스트 (Definition of Done)

작업 AI는 위 변경 사항과 8개 국어 동기화 및 `SCENARIO.md` 동기화를 모두 마친 뒤 아래 명령어를 실행하여 무결성을 입증해야 한다.

```powershell
# 1. 전체 시나리오·UI·정적 분석 검증 (반드시 0 errors, 0 warnings 달성)
node validate.js

# 2. 8개 언어 번역 누락·미번역 전수 검사
node scripts/i18n-check.js

# 3. 브랜치 및 워킹 트리 상태 확인 (main 브랜치 유지)
git branch --show-current
git status --short
```

- **최종 통과 기준**:
  - `node validate.js` → **`✅ ALL CHECKS PASSED - 0 errors, 0 warnings`**
  - `Scenes:` **3338**, `Reachable: 3338 / 3338 (orphans: 0)`, `Endings: 7/7`
  - 한국어(`ko`) 파일의 모든 신규 문구가 본 지시서의 문구와 100% 일치할 것
