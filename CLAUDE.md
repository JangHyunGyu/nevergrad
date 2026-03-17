# Nevergrad 프로젝트 규칙

## 코드 수정 후 필수 작업
- JS/HTML/CSS 코드를 수정한 후에는 반드시 `node validate.js`를 실행하여 검증할 것
- 에러가 0건이 될 때까지 수정을 반복할 것
- `node scripts/i18n-check.js`로 다국어 동기화도 확인할 것
- index.html(KO) 수정 시 en/ja/es/fr/de/index.html에도 동일하게 반영할 것

## 프로젝트 구조
- `assets/js/scenario/` — 시나리오 로직 (분기, 배경, 스탯만, 텍스트 없음)
- `assets/js/i18n/{ko,en,ja,es,fr,de}/` — 다국어 텍스트 JSON (scene ID = 텍스트 키)
- `assets/js/modules/` — 엔진 모듈 (GameEngine, DialogueSystem, I18nManager 등)
- `assets/js/config.js` — 전역 설정 (배경, 캐릭터 표정, BGM 등)
- `assets/js/app.js` — 앱 진입점
- `en/`, `ja/`, `es/`, `fr/`, `de/` — 다국어 HTML (스크립트 경로 `../assets/...`)

## 코드 패턴 규칙
- 시나리오 character 키: `{charId}_{expression}` 형식 (예: `sea_broken_smile`)
  - `_resolveCharImage`가 첫 번째 `_` 기준으로 분리하므로 charId에는 언더스코어 불가
- I18n fetch 경로: 반드시 `I18nManager.BASE` prefix 사용 (다국어 하위 디렉토리 대응)
- app.js에서 시스템 등록 시 프로퍼티명을 모듈 참조와 일치시킬 것
  - `game.deviceGimmick` (not `game.device`), `game.metaHorror` (not `game.meta`)
- CSS 애니메이션에서 `transform` 사용 시 기존 transform 값 보존 (CSS 변수 활용)

## i18n 규칙
- ko가 마스터 — ko 키 기준으로 5개 언어 동기화
- choices 배열 길이는 반드시 ko와 일치
- `"name"` 필드: ko는 한글, en/es/fr/de는 영문, ja는 카타카나
- 빈 text("")는 의도적 라우팅 노드이므로 번역하지 말 것
- 플레이스홀더: `{name}`, `{name?}`, `{14th_name}`, `{new_name}` 등 — 그대로 유지

## 시나리오 작성 규칙

### 대사 스타일
- 유치/오글/올드/중2병/일본식 번역체 절대 금지
- 감정은 직접 서술하지 말고 행동/디테일로 보여줄 것
- 2020년대 트렌디한 한국 드라마 감성: 짧고 위트 있고 여백이 있는 스타일
- "심장이 미친 듯이 뛴다", "운명인 것 같아" 같은 진부한 표현 금지
- 일본식 번역체 금지 (ex: "~인 걸", "~란 말이야?!", "바, 바보!")
- 번역은 원어민 수준. 직역 금지, 각 언어의 자연스러운 표현으로

### 캐릭터/이미지 규칙
- 존재하지 않는 이미지 경로 사용 금지 — 반드시 config.js EXPRESSIONS/BACKGROUNDS 확인 후 사용
- 대화 시퀀스 중간 나레이션에는 대화 상대 캐릭터 유지 (깜빡임 방지). 진짜 혼자인 상황만 null

### 동기화 체크리스트
- 시나리오 JS 수정 → i18n 6개 언어 확인 → SCENARIO.md 반영
- i18n 키 추가/삭제 → 6개 언어 모두 동기화 → `node scripts/i18n-check.js` 확인
- 캐릭터/배경 이미지 추가/변경 → config.js 업데이트 → `node validate.js` 확인
- HTML 구조 변경 → 6개 언어 HTML 모두 동기화

## 기술 환경
- 웹 브라우저 기반 게임 — localStorage, URL, HTML/CSS/JS만 사용
- exe, 설치 폴더, 파일 시스템 접근 절대 불가
- Cloudflare Pages로 배포
