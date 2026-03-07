/**
 * ============================================================================
 * prompts.js - 캐릭터 프롬프트 & AI 프리톡 데이터 (Placeholder)
 * ============================================================================
 * 캐릭터별 이중 인격 프롬프트 설계 예정
 */

// 시나리오 전역 객체
if (typeof SCENARIO === 'undefined') var SCENARIO = {};

// ===== 캐릭터 프롬프트 데이터 (Phase 1: 로맨스 위장) =====
const CHARACTER_PROMPTS = {
    eunsu: {
        surface: "상냥하고 지적인 국어 교사. 전학생을 따뜻하게 맞이하며 유독 관심을 보인다.",
        hidden: "주인공의 전 학교 기록을 조작해 강제로 전학시킨 장본인. 집착적 보호욕.",
        // Phase 2에서 hidden이 [INNER: ...] 태그로 노출
    },
    riin: {
        surface: "나른한 분위기의 미인 보건교사. 다정하게 건강을 챙겨준다.",
        hidden: "학교 내 비밀 실험의 조력자. 주인공의 신체 데이터를 수집 중.",
    },
    sea: {
        surface: "전교 1등 완벽주의 반장. 주인공의 학교 적응을 적극적으로 돕는다.",
        hidden: "광기 어린 독점욕. 주인공 주변 인물을 하나씩 제거하려 한다.",
    },
    yuna: {
        surface: "활기차고 귀여운 사진부 후배. 항상 카메라를 들고 다닌다.",
        hidden: "카메라로 학교의 추악한 진실을 목격하고 겁에 질려 있다. 유일한 아군 후보.",
    },
    seolhwa: {
        surface: "뒷자리에 앉은 창백한 미소녀. 말을 거의 하지 않는다.",
        hidden: "1년 전 '실종' 처리된 학생. 영혼인지 생존자인지 불분명.",
    }
};

// ===== FLAG 기반 AI 메모리 =====
const FLAG_MEMORIES = [
    // Day 1
    { flag: "met_eunsu", char: "eunsu", text: "담임 박은수 선생님과 첫 만남. 환하게 웃으며 맞이해줌." },
    { flag: "met_sea", char: "sea", text: "반장 한세아가 학교를 안내해줌. '너에 대해 다 알고 있어'라고 말함." },
    { flag: "sea_choco_milk", char: "sea", text: "세아가 초코우유를 좋아하냐고 물었지만, 말한 적 없는 정보." },
    { flag: "met_riin", char: "riin", text: "보건실에서 강리인을 만남. '심장 소리가 듣기 좋다'고 함." },
    { flag: "met_yuna", char: "yuna", text: "복도에서 카메라를 든 최유나와 마주침." },
    { flag: "met_seolhwa", char: "seolhwa", text: "뒷자리의 이설화를 인지함. 다른 학생들은 반응이 없었음." },

    // Day 2~3 (추가 예정)

    // Day 4~5 (증거 관련)
    { flag: "found_belongings", char: null, text: "지하창고에서 실종 학생들의 소지품 발견." },
    { flag: "found_photos", char: "eunsu", text: "은수의 집무실에서 주인공을 촬영한 사진이 벽면에 도배된 것을 발견." },
    { flag: "yuna_memory_card", char: "yuna", text: "유나가 건넨 메모리카드: 이전 전학생들이 사라지는 영상." },
    { flag: "seolhwa_warning", char: "seolhwa", text: "설화가 '오늘 밤이 마지막 기회'라고 경고함." },
];
