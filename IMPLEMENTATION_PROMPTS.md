# Nevergrad — 잔여 미구현 항목 구현 프롬프트

> 앞선 세션에서 6종 인터랙티브 글리치(`mirrorWipe`, `mirrorReflection`, `photoOverlay`, `adminPanel`, `peelStatLabel`, `temperatureDrop`)를 구현하고 Playwright로 31/31 테스트 통과했음. 아래는 그 세션에서 **시간 관계상 미룬 나머지 dead-data 항목들**의 구현 프롬프트.
>
> **공통 규칙** (이 문서의 모든 프롬프트에 적용):
> - `C:\workspace\nevergrad\CLAUDE.md`의 코드 작성 원칙 준수 (추측 금지, 끝까지 추적 후 답변)
> - 모든 수정 후 `node validate.js` 실행하여 에러 0건 확인
> - UI 변경 시 `python -m http.server 3099` 후 브라우저에서 실제 동작 확인
> - Playwright 검증 참고: [`test-glitch-ui.mjs`](test-glitch-ui.mjs)
> - 시나리오 로직 파일 수정 시 SCENARIO.md 동기화 체크 ([feedback_scenario_md_sync.md](../MEMORY.md))

---

## 📋 전체 미구현 목록 (우선순위 순)

### 🔴 Priority 1 — 데이터 선언만 있고 엔진이 아예 무시하는 항목
1. **바이노럴 오디오 / 이어폰 감지 연결** (SCENARIO.md 5616~5630)
2. **실시간 시계 연동** (SCENARIO.md 5652~5663)

### 🟡 Priority 2 — 구조는 있지만 실제 사용처가 없는 항목
3. **`getTimeDialogue()` / `playSFXPanned()` dead-code 연결**
4. **Timer bar CSS 누락** (`.timer-bar-wrapper`, `.timer-bar-fill`)

### 🟢 Priority 3 — 이전 세션 테스트가 검증 못 한 구멍
5. **peelStatLabel 실제 가시성** (`_updateHUD`가 `stat-hidden`으로 가릴 수 있음)
6. **캐릭터가 실존하는 상태에서 `mirrorReflection`** 검증
7. **모바일 터치 이벤트** 경로 검증
8. **scene.vibrate 실제 재생** 검증 (scenario 데이터 → `navigator.vibrate()` 도달 여부)

---

## 🔴 프롬프트 1 — 바이노럴 오디오 / 이어폰 감지 연결

### 맥락
`AudioManager.enableBinauralMode()`, `AudioManager.playSFXPanned()`는 이미 [assets/js/modules/AudioManager.js:650, 666](assets/js/modules/AudioManager.js)에 구현되어 있고 `app.js:128`에서 초기에 이어폰이 있으면 `enableBinauralMode()`가 호출된다. **그러나 이 모드가 실제 연출로 이어지는 곳이 아무 데도 없다** — 시나리오에 바이노럴을 트리거하는 키가 없고, 설화 목소리/SFX를 왼쪽 채널로 보내는 호출이 없다.

SCENARIO.md 5616~5630 요구사항:
> 이어폰/헤드폰을 꽂으면 설화의 목소리가 **왼쪽 귀에서만** 들린다. 이어폰 없을 때는 중앙 모노.
> Day 3 밤 "기억해. 왼손." 대사, Day 4 밤 거울 장면의 설화 속삭임에 적용.

### 프롬프트 (다른 세션에 붙여넣기)

```
nevergrad 프로젝트(c:/workspace/nevergrad/)에서 바이노럴 오디오 연출을 완성해줘.

현재 상태:
- AudioManager.js:650 enableBinauralMode() 존재하지만 StereoPanner를 만들기만 하고 오디오 체인에 삽입 안 함
- AudioManager.js:666 playSFXPanned(filename, pan) 존재하지만 호출처 제로
- app.js:128 이어폰 감지 시 enableBinauralMode() 호출하지만 효과 없음

구현 목표 (SCENARIO.md 5616~5630):
1. 이어폰 연결 상태를 실시간 감지 (연결/해제 이벤트 감청)
   - Web Audio에는 직접 이벤트 없으므로 navigator.mediaDevices.addEventListener('devicechange')로 폴링
   - 연결 시: game.audio.enableBinauralMode() 재호출
   - 해제 시: game.audio.disableBinauralMode() 호출

2. 시나리오에 새 키 추가 (설계):
   - scene.panSFX: "sfx_whisper.mp3" — 해당 SFX를 왼쪽 채널로만 재생 (pan=-1)
   - scene.panCharacter: "seolhwa" — 해당 캐릭터 대화 시작 시 전용 속삭임 SFX를 왼쪽에 자동 재생

3. GameEngine.js _loadScene에 핸들러 추가:
   - scene.panSFX가 있고 isBinauralActive()면 playSFXPanned(file, -1) 호출
   - scene.panCharacter가 설화면 assets/audio/sfx/에 있는 seolhwa_whisper SFX를 왼쪽으로

4. 적용 지점 (시나리오 JS 수정):
   - day3_4_night.js 설화 경고 씬들 (day3_night_seolhwa_5, _7, _8, _12) — "5일이야", "기억해. 왼손" 등
   - day4_4_night.js 거울 반전 중 설화 등장 씬 (day4_night_mirror_hit1_14 "미안해" 등)
   - panSFX: "sfx_whisper_seolhwa.mp3" 추가
   - 필요하면 AudioManager의 _synthRegistry에 sfx_whisper_seolhwa 합성기 추가 (실제 파일 없을 때 폴백)

5. UI 표시:
   - 이어폰 연결 시 "🎧 바이노럴 모드 활성" 토스트 3초 표시 (한 번만)
   - i18n: 6개 언어 all

6. 검증:
   - Playwright로 이어폰 감지 시뮬레이션은 어려우므로, 수동 QA 절차 문서화 (README.md에 섹션 추가)
   - 다만 playSFXPanned 호출 경로는 test에 추가 가능 — scene.panSFX가 있는 씬 로드 후 모킹된 audio.playSFXPanned 호출 여부 확인

SCENARIO.md 5616~5630를 읽고, 해당 장면의 한/영/일/스/프/독 i18n도 필요 시 업데이트. 
validate.js 통과 필수.
```

---

## 🔴 프롬프트 2 — 실시간 시계 연동

### 맥락
`DeviceGimmickSystem.getTimeDialogue()` ([DeviceGimmickSystem.js:550](assets/js/modules/DeviceGimmickSystem.js#L550))는 이미 실제 시각을 읽어 시간대별 대사를 반환하지만 **아무도 호출하지 않음**. SCENARIO.md 5652~5663 명세:

> 실제 시각 새벽 3시 ± 15분에 Day 5 진입 시 특수 연출:
> - 화면 우측 상단에 실제 디지털 시계 표시 (03:XX)
> - 설화가 "너도 3시에 깬 거야?" 대사
> - CAGE END 진입 시 플레이어 로컬 시간이 실제 자정 넘으면 "이미 내일이야" 대사 오버라이드

### 프롬프트

```
nevergrad 프로젝트(c:/workspace/nevergrad/)에서 실시간 시계 연동 연출을 구현해줘.

SCENARIO.md 5652~5663 요구사항:
- 실시간 특정 시간대 접속 시 대사/연출 분기
- 자정, 새벽 3시 등 특정 hour에 고유 씬/대사

현재 상태:
- DeviceGimmickSystem.js:550 getTimeDialogue() 존재하지만 호출처 제로
- 시나리오에 시간 기반 조건 분기 없음

구현 목표:
1. 시나리오 condition 시스템 확장 (GameEngine.js _checkCondition):
   - "time:3am" — 로컬 시간 2:45~3:15
   - "time:midnight" — 23:45~0:15
   - "time:late_night" — 22:00~4:00
   - "time:morning", "time:afternoon", "time:evening"
   조건 문자열이 "time:"로 시작하면 Date()로 현재 시각 확인

2. 시나리오 branches에 적용 (day5_1_morning.js, day3_4_night.js):
   예시:
   day3_night_wall: {
     branches: [
       { condition: "time:3am", next: "day3_night_wall_real3am" },
       { next: "day3_night_wall_normal" }
     ]
   }
   
   day3_night_wall_real3am 씬을 새로 작성 — SCENARIO.md 지시대로 "너도 3시에 깬 거야?" 설화 대사

3. HUD에 실제 시계 토글:
   - scene.showRealClock: true 인 경우 우측 상단에 00:00 형식 실시간 시계 표시
   - 매 1초 업데이트 (setInterval)
   - Day 5 새벽 씬부터 등장, 엔딩 이후 제거

4. i18n:
   - 새 씬에 대한 6개 언어 대사 추가 (ko 마스터 → en/ja/es/fr/de)
   - time-aware 대사는 {hour}, {minute} 플레이스홀더 지원

5. 엔딩 오버라이드 (CAGE END):
   - cage_end_pool.js에 시간 기반 변형 추가
   - 자정 넘었으면 특정 풀에서 "...이미 내일이야" 문장 우선 픽

6. 검증:
   - Playwright로 Date를 모킹해서 test. 예: await page.clock.setFixedTime(new Date('2026-01-01T03:00:00'));
   - "time:3am" 조건이 true로 평가되어 _real3am 분기 진입 확인
   - HUD 시계가 "03:00" 표시 확인

SCENARIO.md 5652~5663, 5264~5372(엔딩 조건) 꼼꼼히 읽고 구현.
validate.js 통과 필수.
```

---

## 🟡 프롬프트 3 — `getTimeDialogue()` 자연스러운 활용처

### 맥락
프롬프트 2와 별개로, `getTimeDialogue()`는 **FreeTalk (AI 프리토킹)**에서 "지금 몇 시야?" 같은 질문에 대한 답으로 쓰기에 적합하다. 현재는 완전히 unused code.

### 프롬프트

```
nevergrad 프로젝트의 DeviceGimmickSystem.js:550 getTimeDialogue()를 FreeTalkSystem에서 활용해줘.

구현 목표:
- FreeTalkSystem.js에서 유저 입력에 "시간", "몇 시", "time", "clock" 등 키워드 감지 시
- AI 호출 전 game.deviceGimmick.getTimeDialogue()를 응답으로 우선 반환 (또는 시스템 프롬프트에 inject)
- 실시간 시각 기반 자연스러운 대답으로 몰입감 증대

FreeTalkSystem.js의 기존 응답 처리 로직 확인 후 적절한 훅 지점에 삽입.
다국어 처리 — 현재 getTimeDialogue는 ko만. en/ja/es/fr/de 버전 추가 필요.
```

---

## 🟡 프롬프트 4 — Timer Bar CSS 누락

### 맥락
`node validate.js` 실행 시 경고:
```
[CSS_CLASS] ChoiceSystemAdvanced.js:528: class "timer-bar-wrapper" used in JS but not defined in CSS
[CSS_CLASS] ChoiceSystemAdvanced.js:539: class "timer-bar-fill" used in JS but not defined in CSS
```

JS는 타이머 선택지용 progress bar를 만들어 `.timer-bar-wrapper` > `.timer-bar-fill`를 삽입하지만 CSS가 없어 **화면에 안 보임**.

### 프롬프트

```
nevergrad 프로젝트(c:/workspace/nevergrad/)의 타이머 선택지 UI가 화면에 안 보이는 버그 고쳐줘.

원인:
- ChoiceSystemAdvanced.js:528, 539에서 .timer-bar-wrapper / .timer-bar-fill 클래스로 DOM 생성
- assets/css/dialogue.css 또는 glitch.css에 해당 클래스 정의 없음 → width/height/background 없어서 0x0 렌더링

작업:
1. ChoiceSystemAdvanced.js의 타이머 바 생성 부분(showTimerChoice 등) 읽고 DOM 구조 파악
2. dialogue.css 하단에 .timer-bar-wrapper + .timer-bar-fill CSS 추가:
   - wrapper: 선택지 패널 상단에 가로 full-width, 높이 4px, 배경 rgba(0,0,0,0.3)
   - fill: transition width linear, 배경 색상은 타이머 상태별 (여유: #ff9a9e, 임박 30%: #ff4444)
   - .timer-critical-style 클래스도 이미 validator에 DOM_ID 경고 → 크리티컬 상태 스타일 정의
3. Playwright로 day5_lunch의 타이머 선택지(예: day5_lunch_right 중 타이머 있는 씬) 진입해서 바 렌더링 확인
4. validate.js 실행 → timer-bar 관련 경고 0건 확인
```

---

## 🟢 프롬프트 5 — peelStatLabel 실제 가시성 검증

### 맥락
앞선 세션에서 `peelStatLabel` 구현 + 테스트 통과했지만, `_loadScene`의 실행 순서가 다음과 같다:

```js
Line 370: _handleGlitch(scene.glitch)  // peelStatLabel 시작 (async)
Line 423: _updateHUD()  // _updateStatDisplay → character:null이면 stat-hidden 추가 (opacity:0)
```

async peelStatLabel이 완료되면 `.stat-revealed`가 붙지만 `.stat-hidden`은 그대로라서 **opacity:0으로 실제로 안 보일 가능성** 있음.

### 프롬프트

```
nevergrad 프로젝트의 peelStatLabel 연출이 화면에 실제로 보이는지 검증하고, 안 보이면 고쳐줘.

의심:
- GameEngine.js:423 _updateHUD() → _updateStatDisplay()가 character:null 씬에서 stat-display에 stat-hidden 클래스 추가 (style.css:662에서 opacity:0 설정)
- 내 GlitchSystemAdvanced.js peelStatLabel은 stat-hidden을 처음에 한 번 제거하지만, 직후 _updateStatDisplay가 다시 붙임
- 결과: stat-revealed 클래스는 있지만 opacity:0이라 안 보일 수 있음

작업:
1. Playwright로 day3_night_stat_crack_4 로드 후 getComputedStyle(#stat-display).opacity 값 확인
2. 0이면 두 가지 옵션 중 선택:
   A. peelStatLabel을 동기적으로 완료 → _updateStatDisplay가 덮어쓰지 못하게
   B. _updateStatDisplay에 "stat-revealed가 있으면 stat-hidden 추가하지 마라" 가드 추가
3. Day 3 밤 장르 전환 이후로는 스탯 UI가 "위험도"로 영구 고정되어야 하므로 옵션 B 권장
4. 기존 test-glitch-ui.mjs의 peelStatLabel 테스트에 opacity 검증 추가:
   log(opacity > 0.5, 'peelStatLabel: 실제 가시성 (opacity > 0.5)')

GameEngine.js:1006 _updateHUD, :1022 _updateStatDisplay 읽고 구현.
validate.js + test-glitch-ui.mjs 모두 통과 필수.
```

---

## 🟢 프롬프트 6 — mirrorReflection 실제 캐릭터 반사 검증

### 맥락
앞선 Playwright 테스트가 `#mirror-reflection` 엘리먼트 생성과 `scaleX(-1)` transform만 확인했고, **실제로 char-left/center/right의 이미지가 복제돼 반사상에 들어갔는지**, 그리고 **`characterAbsentInMirror: "seolhwa"`가 설화만 빼고 다른 캐릭터는 반사하는지**는 검증 안 됨. 테스트 씬에 캐릭터가 없었기 때문.

### 프롬프트

```
nevergrad 프로젝트의 mirrorReflection이 '설화만 빼고' 다른 캐릭터를 정확히 반사하는지 실증해줘.

작업:
1. test-glitch-ui.mjs에 새 테스트 시나리오 추가:
   - day4_night_mirror_hit1 로드 전, 명시적으로 char-center에 설화, char-left에 세아 세팅
     await page.evaluate(() => {
       document.getElementById('char-center').src = '/assets/images/character/seolhwa/seolhwa_sad.png';
       document.getElementById('char-left').src = '/assets/images/character/sea/sea_smile.png';
     });
   - 씬 로드 후 .mirror-reflection-sprite 개수 확인 → 세아만 1개 있어야 함 (설화 제외)
   - src URL이 /sea/를 포함하는지 확인, /seolhwa/를 포함하지 않는지 확인

2. GlitchSystemAdvanced.js:1440 showMirrorReflection 다시 읽고 버그 확인:
   - charId 추출 정규식이 올바른지 (url.match(/\/([a-z]+)\/[^/]+$/i))
   - src.style.display === 'none' 체크가 실제 숨김 상태 감지하는지

3. 이미지 실파일 없는 상태(현재 프로젝트는 대부분 미존재 - CLAUDE.md 참조)에서도 테스트 가능하도록 dummy URL 사용

4. 테스트 실패 시 정규식/로직 수정

SCENARIO.md의 Day 4 밤 거울 반전 시나리오(라인 3294~3433) 숙지 후 작업.
```

---

## 🟢 프롬프트 7 — 모바일 터치 이벤트 검증

### 프롬프트

```
nevergrad 프로젝트의 mirrorWipe 인터랙션을 모바일 터치 경로에서도 검증해줘.

작업:
1. test-glitch-ui.mjs에 모바일 컨텍스트 추가:
   const mobile = await browser.newContext({
     viewport: { width: 390, height: 844 },
     hasTouch: true,
     isMobile: true,
     userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...'
   });

2. page.touchscreen.tap(), page.touchscreen.swipe()로 거울 닦기 시뮬
   - 기존 mouse.move/down/up 대신 touchscreen 사용
   - 여러 번의 긴 스와이프로 threshold 35% 달성

3. requireSwipe 락이 해제되는지 확인

4. showMirrorSwipe의 touchstart/touchmove/touchend 핸들러가 실제로 동작 — 
   GlitchSystemAdvanced.js:1225~1237의 preventDefault가 iOS Safari에서 스크롤 막는지까지 확인

5. 추가로 모바일 viewport에서 adminPanel이 inset: 4% 4% 22% 4%로 올바르게 줄어드는지 스크린샷 검증
```

---

## 🟢 프롬프트 8 — scene.vibrate 실제 재생 검증

### 맥락
[DeviceGimmickSystem.js:175](assets/js/modules/DeviceGimmickSystem.js#L175)의 `vibrate(pattern)`이 `navigator.vibrate()`를 호출하지만, 실제 시나리오의 `vibrate: "heartbeat"` 같은 키가 이 함수까지 도달하는지, 그리고 패턴이 정의되어 있는지 미검증.

### 프롬프트

```
nevergrad 프로젝트의 scene.vibrate 데이터가 실제 navigator.vibrate() 호출로 이어지는지 검증하고, 
정의 안 된 패턴 이름이 있으면 추가해줘.

작업:
1. grep scenario 디렉토리에서 모든 vibrate: 값 수집:
   grep -rh "vibrate:" assets/js/scenario/ | sort -u
   (예상: "heartbeat", "pulse", "impact", "message_buzz" 등)

2. DeviceGimmickSystem.js의 _vibratePatterns 객체 확인 (라인 100 근처):
   - 수집한 모든 키가 패턴 배열로 정의되어 있는지 체크
   - 누락된 것 있으면 SCENARIO.md 5599~5615 참고해서 추가

3. GameEngine.js:374 확인:
   if (scene.vibrate) this.deviceGimmick.vibrate(scene.vibrate);
   — 이 라인이 실제로 실행되는지 Playwright에서:
   - navigator.vibrate를 sinon/mock으로 교체
   - vibrate: "heartbeat"인 씬 로드 (예: day4_night_mirror_hit1_12)
   - navigator.vibrate가 [100, 800, 100, ...] 배열로 호출됐는지 확인

4. PC(터치 불가) 환경 폴백: _vibrateVisual()이 있는지 확인, 없으면 화면 쉐이크 같은 시각 대체 연출 추가

SCENARIO.md 5599~5615(햅틱/진동 패턴 섹션) 숙지 후 작업.
```

---

## 📌 작업 순서 권장

1. **프롬프트 5** (peelStatLabel 가시성) — 이미 구현한 것의 완성도 검증이므로 먼저
2. **프롬프트 6** (mirrorReflection 캐릭터 검증) — 동일
3. **프롬프트 8** (vibrate 검증) — 쉬움, 기존 코드 활용
4. **프롬프트 4** (Timer Bar CSS) — 쉬움, 격리된 작업
5. **프롬프트 2** (실시간 시계) — 신규 기능, 시나리오 수정 필요
6. **프롬프트 1** (바이노럴) — 신규 기능, 새 시나리오 키 + 오디오 엔진 배관
7. **프롬프트 7** (모바일 터치) — 검증 위주
8. **프롬프트 3** (FreeTalk 시간 대사) — nice-to-have

---

## 🔧 세션 시작 시 컨텍스트 전달용 요약

```
이전 세션 요약:
- Nevergrad 프로젝트 (c:/workspace/nevergrad/)의 SCENARIO.md 5739줄 중 
  시나리오 JS에 glitch: { mirrorWipe, adminPanel, peelStatLabel, temperatureDrop, 
  mirrorReflection, photoOverlay } 등이 데이터로만 선언되어 있고 엔진에서 미구현이었음.
- GameEngine.js _handleGlitch + GlitchSystemAdvanced.js에 6개 핸들러 추가, 
  glitch.css + 씬 경계 자동 정리 추가. Playwright로 31/31 통과.
- app.js:141에 window.game = game 노출 (테스트용).
- test-glitch-ui.mjs 존재 (Playwright, chromium headless).
- 로컬 서버: python -m http.server 3099
- 잔여 미구현은 IMPLEMENTATION_PROMPTS.md 참조.
```
