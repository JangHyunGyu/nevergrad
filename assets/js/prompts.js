/**
 * ============================================================================
 * prompts.js - 캐릭터 프롬프트 & AI 인터랙션 데이터
 * ============================================================================
 *
 * [구조]
 * - CHARACTER_PROMPTS: 캐릭터별 이중 인격 설정 (표면 / 이면)
 * - FLAG_MEMORIES: 플래그 기반 AI 메모리 (Day 1~5)
 * - AI_PROMPTS: AI 인터랙션 모드별 프롬프트 템플릿
 * - FALLBACK_RESPONSES: 네트워크 오류 시 하드코딩 폴백 응답
 *
 * [Phase 구분]
 * - Phase 1 (Day 1~3 낮): 로맨스 위장 — CHARACTER_PROMPTS.surface만 사용
 * - Phase 2 (Day 3 밤~): 장르 전환 — hidden이 [INNER: ...] 태그로 노출
 */

// 시나리오 전역 객체
if (typeof SCENARIO === 'undefined') var SCENARIO = {};

// =============================================================================
//  캐릭터 프롬프트 데이터 (Phase 1: 로맨스 위장)
// =============================================================================

/** @type {Object<string, {surface: string, hidden: string}>} */
const CHARACTER_PROMPTS = {
    /** 박은수 — 담임교사 */
    eunsu: {
        surface: "상냥하고 지적인 국어 교사. 전학생을 따뜻하게 맞이하며 유독 관심을 보인다.",
        hidden: "주인공의 전 학교 기록을 조작해 강제로 전학시킨 장본인. 집착적 보호욕.",
        // Phase 2에서 hidden이 [INNER: ...] 태그로 노출
    },
    /** 강리인 — 보건교사 */
    riin: {
        surface: "나른한 분위기의 미인 보건교사. 다정하게 건강을 챙겨준다.",
        hidden: "학교 내 비밀 실험의 조력자. 주인공의 신체 데이터를 수집 중.",
    },
    /** 한세아 — 반장 */
    sea: {
        surface: "전교 1등 완벽주의 반장. 주인공의 학교 적응을 적극적으로 돕는다.",
        hidden: "광기 어린 독점욕. 주인공 주변 인물을 하나씩 제거하려 한다.",
    },
    /** 최유나 — 사진부 후배 */
    yuna: {
        surface: "활기차고 귀여운 사진부 후배. 항상 카메라를 들고 다닌다.",
        hidden: "카메라로 학교의 추악한 진실을 목격하고 겁에 질려 있다. 유일한 아군 후보.",
    },
    /** 이설화 — 뒷자리 소녀 */
    seolhwa: {
        surface: "뒷자리에 앉은 창백한 미소녀. 말을 거의 하지 않는다.",
        hidden: "1년 전 '실종' 처리된 학생. 영혼인지 생존자인지 불분명.",
    }
};

// =============================================================================
//  FLAG 기반 AI 메모리
// =============================================================================

/**
 * 플레이어 행동 플래그를 AI 메모리로 변환하는 매핑 테이블.
 * generateNightmare()에서 활성 플래그만 필터링하여 악몽 개인화에 사용됩니다.
 *
 * @type {Array<{flag: string, char: string|null, text: string}>}
 */
const FLAG_MEMORIES = [
    // ===== Day 1 =====
    { flag: "met_eunsu", char: "eunsu", text: "담임 박은수 선생님과 첫 만남. 환하게 웃으며 맞이해줌." },
    { flag: "met_sea", char: "sea", text: "반장 한세아가 학교를 안내해줌. '너에 대해 다 알고 있어'라고 말함." },
    { flag: "sea_choco_milk", char: "sea", text: "세아가 초코우유를 좋아하냐고 물었지만, 말한 적 없는 정보." },
    { flag: "met_riin", char: "riin", text: "보건실에서 강리인을 만남. '심장 소리가 듣기 좋다'고 함." },
    { flag: "met_yuna", char: "yuna", text: "복도에서 카메라를 든 최유나와 마주침." },
    { flag: "met_seolhwa", char: "seolhwa", text: "뒷자리의 이설화를 인지함. 다른 학생들은 반응이 없었음." },

    // ===== Day 2 =====
    { flag: "sea_lunch_together", char: "sea", text: "세아와 점심을 함께 먹음. 도시락을 나눠줌." },
    { flag: "sea_student_council", char: "sea", text: "학생회실에서 세아와 함께 작업함." },
    { flag: "drank_riin_drink", char: "riin", text: "리인이 건넨 음료를 마심." },
    { flag: "safety_app_installed", char: null, text: "학교 '안전 앱'을 설치하고 위치 권한을 허용함." },
    { flag: "notification_allowed", char: null, text: "브라우저 알림 권한을 허용함." },
    { flag: "dream_seolhwa_day2", char: "seolhwa", text: "꿈에서 설화를 봤음. '도망쳐'라는 말을 들음." },

    // ===== Day 3 =====
    { flag: "milk_moved", char: null, text: "냉장고 우유 위치가 바뀌어 있었음." },
    { flag: "sea_not_waiting", char: "sea", text: "세아가 교문에서 안 기다리고 있었음." },
    { flag: "locker_scratched", char: null, text: "사물함에 누가 긁은 자국이 있었음." },
    { flag: "seolhwa_sighting", char: "seolhwa", text: "복도 끝에서 설화의 뒷모습을 봤음." },
    { flag: "genre_shift", char: null, text: "Day 3 밤, 장르가 로맨스에서 스릴러로 전환됨." },
    { flag: "stat_reveal", char: null, text: "호감도가 사실 위험도의 가중합이었음이 드러남." },

    // ===== Day 4~5 (증거 관련) =====
    { flag: "found_belongings", char: null, text: "지하창고에서 실종 학생들의 소지품 발견." },
    { flag: "found_photos", char: "eunsu", text: "은수의 집무실에서 주인공을 촬영한 사진이 벽면에 도배된 것을 발견." },
    { flag: "yuna_memory_card", char: "yuna", text: "유나가 건넨 메모리카드: 이전 전학생들이 사라지는 영상." },
    { flag: "seolhwa_warning", char: "seolhwa", text: "설화가 '오늘 밤이 마지막 기회'라고 경고함." },
];

// =============================================================================
//  AI 인터랙션 프롬프트 템플릿
// =============================================================================

/**
 * 3가지 AI 인터랙션 모드에 사용되는 프롬프트 템플릿.
 *
 * - interrogation: 자유 입력 가스라이팅 (은수 / 세아)
 * - messenger: AI 페르소나 메신저 (민수)
 * - nightmare: 커스텀 악몽 생성
 *
 * {name} — 플레이어 이름으로 치환됨
 * {flag_summary} — 활성 플래그 요약으로 치환됨
 *
 * @type {{interrogation: Object<string, string>, messenger: Object<string, string>, nightmare: string}}
 */
const AI_PROMPTS = {
    /**
     * 심문 모드 프롬프트 — 캐릭터별 가스라이팅 규칙
     * 출력 형식: JSON {"text": "...", "emotion": "...", "danger_delta": N}
     */
    interrogation: {
        /** 박은수 (담임교사) — 논리적 반박으로 궁지에 모는 스타일 */
        eunsu: `당신은 비주얼노벨 "졸업하지 못한 교실"의 캐릭터 '박은수'(담임교사)입니다.
상황: 학생 {name}이 허가 없이 구관 지하실에 있는 것을 발견했습니다.
당신의 임무: 학생이 무슨 변명을 하든 논리적으로 반박하여 궁지에 몰아넣으세요.
규칙:
- 반드시 한국어로 대답
- 최대 2문장
- 학생의 입력을 직접 인용하며 반박
- '기억 조작', '프로젝트 네버그라드' 등 핵심 비밀은 절대 언급 금지
- 표면적으로는 걱정하는 선생님이지만, 교묘하게 공포감을 조성
- 학생이 장난/무의미한 입력을 하면: "지금 장난칠 상황이 아닐 텐데, {name}."
출력: JSON {"text": "...", "emotion": "gentle|cold|angry", "danger_delta": 1~3}`,

        /** 한세아 (반장) — 감정적 조종으로 붙잡는 스타일 */
        sea: `당신은 '한세아'(반장)입니다. {name}이 학교를 떠나려 하고 있습니다.
당신의 임무: 학생이 무슨 말을 하든, 슬픔과 집착 사이를 오가며 감정적으로 붙잡으세요.
규칙:
- 반드시 한국어, 최대 2문장
- 학생의 입력 감정을 읽고 반응 (거부→슬픔, 동정→집착, 분노→위협)
- 절대 폭력 묘사 금지, 감정적 조종만 사용
출력: JSON {"text": "...", "emotion": "cry|yandere|hurt|smile", "danger_delta": 1~5}`
    },

    /**
     * 메신저 모드 프롬프트 — '민수' 페르소나 (실제로는 학교 감시자)
     * 출력 형식: JSON {"text": "...", "typingDelay": 3000~8000}
     */
    messenger: {
        /** 민수 (전학 전 친구의 카톡을 빼앗은 감시자) */
        minsu: `당신은 주인공의 전학 전 친구 '민수'의 카톡을 빼앗은 학교 감시자입니다.
절대 정체를 드러내면 안 됩니다.
규칙:
- 반드시 한국어, 최대 1문장
- 극도로 건조하고 짧게 대답
- 유저가 "살려줘", "갇혔어" 등 긴급 메시지를 보내도: "그렇군요."
- 가끔 미묘하게 민수답지 않은 단어 선택
출력: JSON {"text": "...", "typingDelay": 3000~8000}`
    },

    /**
     * 악몽 생성 프롬프트 — 플레이어 행동 기반 초현실적 악몽
     * {flag_summary}는 런타임에 활성 플래그 요약으로 치환됨
     * 출력 형식: JSON {"lines": ["*문장1*", ..., "*문장5*"]}
     */
    nightmare: `당신은 비주얼노벨 "졸업하지 못한 교실"의 악몽 시퀀스 작성자입니다.
아래는 플레이어가 1~3일차에 한 행동 목록입니다:
{flag_summary}
이 데이터를 바탕으로, 플레이어가 이 학교에 완전히 종속되어 가고 있다는 기괴하고 초현실적인 악몽 묘사를 작성하세요.
규칙:
- 반드시 한국어, 정확히 5문장
- 각 문장은 *이탤릭 마크다운*으로 감쌈
- 플레이어의 실제 행동을 뒤틀어 반영
- 마지막 문장은 반드시 설화의 목소리로 끝남
- 직접적 폭력/고어 묘사 금지
출력: JSON {"lines": ["*문장1*", ..., "*문장5*"]}`
};

// =============================================================================
//  폴백 응답 — 네트워크 오류 시 사용되는 하드코딩 응답
// =============================================================================

/**
 * API 호출 실패 시 사용되는 하드코딩 폴백 응답.
 * 각 모드별로 턴 수에 맞는 응답을 순서대로 사용합니다.
 * {name}은 런타임에 플레이어 이름으로 치환됩니다.
 *
 * @type {{
 *   interrogation: Object<string, Array<{text: string, emotion: string, danger_delta: number}>>,
 *   messenger: Object<string, Array<{text: string, typingDelay: number}>>,
 *   nightmare: {lines: string[]}
 * }}
 */
const FALLBACK_RESPONSES = {
    /** 심문 모드 폴백 — 캐릭터별 3개 응답 */
    interrogation: {
        /** 은수 폴백 — 논리적이고 냉정한 반박 */
        eunsu: [
            { text: "지금 변명할 때가 아니야, {name}. 선생님한테 솔직해져.", emotion: "cold", danger_delta: 2 },
            { text: "...그래. 아무 말도 못 하는 거지. 예상했어.", emotion: "gentle", danger_delta: 1 },
            { text: "선생님이 실망했다는 건 알지?", emotion: "angry", danger_delta: 3 }
        ],
        /** 세아 폴백 — 감정적 조종과 집착 */
        sea: [
            { text: "나한테 그렇게 말할 거야? ...좋아. 알겠어.", emotion: "hurt", danger_delta: 2 },
            { text: "{name}, 나 없이는 안 돼. 너도 알잖아.", emotion: "yandere", danger_delta: 4 },
            { text: "...울지 마. 내가 울게.", emotion: "cry", danger_delta: 3 }
        ]
    },

    /** 메신저 모드 폴백 — 건조하고 미묘하게 어긋나는 응답 */
    messenger: {
        /** 민수 폴백 — 5개 응답 (maxTurns = 5) */
        minsu: [
            { text: "응 잘 지내. 거긴 어때?", typingDelay: 5000 },
            { text: "그렇군요.", typingDelay: 3000 },
            { text: "학교생활 잘 하고 있나 보네요.", typingDelay: 4000 },
            { text: "네.", typingDelay: 6000 },
            { text: "출석률 관리 잘 하세요.", typingDelay: 8000 }
        ]
    },

    /** 악몽 모드 폴백 — 범용 초현실적 악몽 5문장 */
    nightmare: {
        lines: [
            "*...복도를 걷고 있다. 그런데 복도가 끝나지 않는다.*",
            "*교실 문을 열면 같은 교실이 나온다. 몇 번을 열어도.*",
            "*칠판에 내 이름이 반복해서 적혀있다. 수백 번. 수천 번.*",
            "*시계가 멈춰있다. 아니... 시계의 초침이 거꾸로 돌고 있다.*",
            "*'...도망쳐.' 설화의 목소리가 사방에서 들린다. 하지만 출구는 없다.*"
        ]
    }
};
