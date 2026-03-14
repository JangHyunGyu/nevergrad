/**
 * ============================================================================
 * Day 1-3: Afterschool - 방과후 선택의 시간
 * ============================================================================
 * 각 캐릭터와 1:1 시간.
 * - 세아: 학생회실, 캔 음료, "내일도 올래?"
 * - 유나: 도서관, 카메라 사진, 고양이 치즈, "꼭 오세요"
 * - 리인: 보건실, 허브차, "이상한 꿈 꾸는 애들"
 * - 은수: 교무실, 커피, "전학 사유가 좀 특이해서"
 * - 귀가: 교문, 3층 창가 실루엣 (설화)
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 방과후 시작 =====
    "day1_after_start": {
        bgm: "sunset_warm.mp3",
        character: null,
        next: "day1_after_choice"
    },
    "day1_after_choice": {
        choices: [
            { next: "day1_after_sea_1" },
            { next: "day1_after_yuna_1", condition: "met_yuna" },
            { next: "day1_after_riin_1", condition: "met_riin" },
            { next: "day1_after_eunsu_1" },
            { next: "day1_after_home_1" }
        ]
    },

    // ===== 세아 — 학생회실 (lines 527-563) =====
    "day1_after_sea_1": {
        background: "student_council",
        character: null,
        next: "day1_after_sea_2"
    },
    "day1_after_sea_2": {
        character: "sea_smile",
        next: "day1_after_sea_3"
    },
    "day1_after_sea_3": {
        character: null,
        next: "day1_after_sea_4"
    },
    "day1_after_sea_4": {
        character: "sea_smile",
        next: "day1_after_sea_5"
    },
    "day1_after_sea_5": {
        next: "day1_after_sea_6"
    },
    "day1_after_sea_6": {
        character: "sea_normal",
        next: "day1_after_sea_7"
    },
    "day1_after_sea_7": {
        character: null,
        next: "day1_after_sea_8"
    },
    "day1_after_sea_8": {
        character: "sea_smile",
        next: "day1_after_sea_9",
        stats: { sea: { affinity: 3 } }
    },
    "day1_after_sea_9": {
        character: null,
        next: "day1_after_sea_10"
    },
    "day1_after_sea_10": {
        character: "sea_vulnerable",
        next: "day1_after_sea_11"
    },
    "day1_after_sea_11": {
        next: "day1_after_sea_12"
    },
    "day1_after_sea_12": {
        next: "day1_after_sea_13"
    },
    "day1_after_sea_13": {
        next: "day1_after_sea_14"
    },
    "day1_after_sea_14": {
        next: "day1_after_sea_15"
    },
    "day1_after_sea_15": {
        character: "sea_smile",
        next: "day1_after_sea_16",
        stats: { sea: { affinity: 3 } }
    },
    "day1_after_sea_16": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 유나 — 도서관 (lines 565-587) =====
    "day1_after_yuna_1": {
        background: "library",
        character: null,
        next: "day1_after_yuna_2"
    },
    "day1_after_yuna_2": {
        character: "yuna_shy",
        next: "day1_after_yuna_3"
    },
    "day1_after_yuna_3": {
        character: null,
        next: "day1_after_yuna_4"
    },
    "day1_after_yuna_4": {
        character: "yuna_shy",
        next: "day1_after_yuna_5"
    },
    "day1_after_yuna_5": {
        character: null,
        next: "day1_after_yuna_6",
        stats: { yuna: { affinity: 3 } }
    },
    "day1_after_yuna_6": {
        character: "yuna_normal",
        next: "day1_after_yuna_7"
    },
    "day1_after_yuna_7": {
        next: "day1_after_yuna_8"
    },
    "day1_after_yuna_8": {
        character: "yuna_shy",
        next: "day1_after_yuna_9",
        stats: { yuna: { trust: 3 } }
    },
    "day1_after_yuna_9": {
        character: null,
        next: "day1_after_yuna_10"
    },
    // 폴라로이드 선물
    "day1_after_yuna_10": {
        next: "day1_after_yuna_11"
    },
    "day1_after_yuna_11": {
        character: "yuna_shy",
        next: "day1_after_yuna_12"
    },
    "day1_after_yuna_12": {
        character: null,
        next: "day1_after_yuna_13"
    },
    "day1_after_yuna_13": {
        character: "yuna_normal",
        next: "day1_after_yuna_14",
        stats: { yuna: { affinity: 3 } }
    },
    "day1_after_yuna_14": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 리인 — 보건실 (lines 589-603) =====
    "day1_after_riin_1": {
        background: "nurse_office",
        character: null,
        next: "day1_after_riin_2"
    },
    "day1_after_riin_2": {
        character: "riin_gentle",
        next: "day1_after_riin_3",
        stats: { riin: { affinity: 3 } }
    },
    "day1_after_riin_3": {
        next: "day1_after_riin_4"
    },
    "day1_after_riin_4": {
        next: "day1_after_riin_5"
    },
    "day1_after_riin_5": {
        character: null,
        next: "day1_after_riin_6"
    },
    // 허브티 선물 + 음악
    "day1_after_riin_6": {
        character: "riin_gentle",
        next: "day1_after_riin_7"
    },
    "day1_after_riin_7": {
        character: null,
        next: "day1_after_riin_8"
    },
    "day1_after_riin_8": {
        character: "riin_gentle",
        next: "day1_after_riin_9"
    },
    "day1_after_riin_9": {
        character: null,
        next: "day1_after_riin_10"
    },
    "day1_after_riin_10": {
        next: "day1_after_riin_11"
    },
    "day1_after_riin_11": {
        character: "riin_gentle",
        next: "day1_after_riin_12",
        stats: { riin: { affinity: 3 } }
    },
    "day1_after_riin_12": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 은수 — 교무실 (lines 605-621) =====
    "day1_after_eunsu_1": {
        background: "teacher_office",
        character: "eunsu_warm",
        next: "day1_after_eunsu_2"
    },
    "day1_after_eunsu_2": {
        character: null,
        next: "day1_after_eunsu_3",
        stats: { eunsu: { affinity: 3 } }
    },
    "day1_after_eunsu_3": {
        character: "eunsu_normal",
        next: "day1_after_eunsu_4"
    },
    "day1_after_eunsu_4": {
        next: "day1_after_eunsu_5"
    },
    "day1_after_eunsu_5": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_6"
    },
    "day1_after_eunsu_6": {
        character: null,
        next: "day1_after_eunsu_7"
    },
    // 따뜻한 마무리
    "day1_after_eunsu_7": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_8"
    },
    "day1_after_eunsu_8": {
        next: "day1_after_eunsu_9"
    },
    "day1_after_eunsu_9": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_10",
        stats: { eunsu: { affinity: 3 } }
    },
    "day1_after_eunsu_10": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 귀가 (lines 623-637) =====
    "day1_after_home_1": {
        background: "school_gate_evening",
        bgm_fade: { from: "sunset_warm.mp3", to: "night_calm.mp3" },
        character: null,
        next: "day1_after_home_2"
    },
    "day1_after_home_2": {
        next: "day1_after_home_3"
    },
    "day1_after_home_3": {
        next: "day1_after_home_4"
    },
    "day1_after_home_4": {
        next: "day1_after_home_5"
    },
    "day1_after_home_5": {
        next: "day1_after_home_6"
    },
    "day1_after_home_6": {
        next: "day1_after_end"
    },

    // ===== 공통 종료 =====
    "day1_after_end": {
        character: null,
        changeSlot: "night",
        next: "day1_night_start"
    }
});
