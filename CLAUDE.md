# Nevergrad 프로젝트 규칙

## 코드 수정 후 필수 작업 (매번 반드시 실행)
- **어떤 파일이든 수정이 발생하면** 반드시 `node validate.js`를 실행하여 검증할 것
- 에러가 0건이 될 때까지 수정을 반복할 것 — **기존 에러도 "기존 이슈"로 넘기지 말고 즉시 수정**
- validate.js는 35개 검증 항목을 포함 (정적 분석 + 플레이스루 시뮬 + UI + 메모리 + AI 프리토킹)
- warning은 참고사항, error는 반드시 수정

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
- i18n 키 추가/삭제 → 6개 언어 모두 동기화
- 캐릭터/배경 이미지 추가/변경 → config.js 업데이트
- HTML 구조 변경 → 6개 언어 HTML 모두 동기화
- **위 모든 작업 후 `node validate.js` 실행하여 에러 0건 확인**

## 이미지 생성 모델 우선순위
- **배경 이미지**: Imagen 4 Ultra (1순위) → Imagen 4 (2순위)
- **캐릭터 레퍼런스(_normal)**: Imagen 4 Ultra (1순위) → Imagen 4 (2순위)
- **캐릭터 표정/행동 변형**: 레퍼런스 이미지 + Gemini 3.1 Flash Image (편집)
- imagen fast, 2.5 flash image 모델은 사용 금지
- 프롬프트에 "DDLC" 포함 금지 (워터마크 생성됨), "anime visual novel style" 사용
- 모든 이미지에 텍스트 금지 지시 필수 포함
- API 키는 `.env` 파일에서 로드 (하드코딩 금지, `.gitignore`에 등록됨)

## 이미지 에셋 현황 (2026-03-18)
- 배경 이미지: 24/28 생성 완료 (Imagen 4), 4개 미완 (school_night, school_dark, school_dawn, sunset_outside)
- 캐릭터 이미지: 미생성
- 생성용 프롬프트: `PROMPTS_READY.md` 참조 (캐릭터 43장 + 배경 28장 + BGM/SFX)
- 생성 순서: 캐릭터는 시나리오 등장순(은수→세아→리인→유나→설화), 배경은 Day 1→5 순
- config.js의 EXPRESSIONS/BACKGROUNDS alias는 이미지 미존재 시 실제 파일로 fallback

## 사운드(SFX) 규칙
- Web Audio API로 합성 — 외부 파일 불필요
- **고퀄리티 필수**: 여러 레이어(오실레이터, 노이즈, 필터, 엔벨로프)를 조합하여 풍부한 사운드 생성
- Tone.js 스타일의 멀티레이어 합성 지향
- 버튼 클릭/터치 시 UI 효과음 포함
- 시나리오 사운드 프롬프트는 PROMPTS_READY.md 참조

## 반응형 UI 필수 검증
- UI/CSS 수정 시 `npx serve -l 3001 -s .`로 로컬 서버를 띄워 실시간 확인 (배포 전 반드시 로컬에서 검증)
- 반드시 아래 5가지 뷰포트에서 레이아웃 깨짐·겹침·잘림 확인:
  - PC (1280px+)
  - 태블릿 가로 (1024px)
  - 태블릿 세로 (768px)
  - 모바일 세로 (375px)
  - 모바일 가로 (667px × 375px)
- fixed/absolute 요소는 모든 뷰포트에서 다른 요소와 겹치지 않는지 확인
- 기존 UI 요소와 중복되는 요소가 없는지 확인 (같은 기능의 버튼이 2개 이상 존재 금지)

## 기술 환경
- 웹 브라우저 기반 게임 — localStorage, URL, HTML/CSS/JS만 사용
- exe, 설치 폴더, 파일 시스템 접근 절대 불가
- Cloudflare Pages로 배포 (https://nevergrad.archerlab.dev)
- **Cloudflare API 토큰**: GitHub Secrets `CLOUDFLARE_API_TOKEN`에 저장 (DNS/Zone 편집 권한, 모든 레포 공통)
