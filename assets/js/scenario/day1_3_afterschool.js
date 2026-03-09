/**
 * ============================================================================
 * Day 1-3: Afterschool - 방과후 선택의 시간
 * ============================================================================
 * 각 캐릭터와 1:1 시간. 순수 미연시.
 * - 세아: 학생회실, 새끼손가락 약속
 * - 유나: 도서관, 카메라 사진, 어두운 복도 사진
 * - 리인: 보건실, 허브차
 * - 은수: 교무실, 커피, "전학 사유가 좀 특이해서"
 * - 귀가: 교문, 3층 창가 실루엣 (설화)
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 방과후 시작 =====
    "day1_after_start": {
        background: "classroom_empty",
        bgm: "sunset_warm.mp3",
        character: null,
        sunset: true,
        next: "day1_after_start_2"
    },
    "day1_after_start_2": {
        sunset: true,
        next: "day1_after_choice"
    },
    "day1_after_choice": {
        sunset: true,
        choices: [
            { next: "day1_after_sea" },
            { next: "day1_after_yuna", condition: "met_yuna" },
            { next: "day1_after_riin", condition: "met_riin" },
            { next: "day1_after_eunsu" },
            { next: "day1_after_home" }
        ]
    },

    // ===== 세아 — 학생회실 =====
    "day1_after_sea": {
        background: "classroom_empty",
        character: null,
        sunset: true,
        next: "day1_after_sea_2"
    },
    "day1_after_sea_2": {
        character: "sea_smile",
        next: "day1_after_sea_3"
    },
    "day1_after_sea_3": {
        next: "day1_after_sea_4"
    },
    "day1_after_sea_4": {
        next: "day1_after_sea_5"
    },
    "day1_after_sea_5": {
        next: "day1_after_sea_6"
    },
    "day1_after_sea_6": {
        next: "day1_after_sea_7"
    },
    "day1_after_sea_7": {
        next: "day1_after_sea_8"
    },
    "day1_after_sea_8": {
        character: "sea_shy",
        next: "day1_after_sea_9",
        stats: { sea: { affinity: 5 } }
    },
    "day1_after_sea_9": {
        next: "day1_after_sea_10"
    },
    "day1_after_sea_10": {
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
        character: "sea_sad",
        next: "day1_after_sea_16"
    },
    "day1_after_sea_16": {
        character: "sea_smile",
        next: "day1_after_sea_17"
    },
    "day1_after_sea_17": {
        next: "day1_after_sea_18"
    },
    "day1_after_sea_18": {
        next: "day1_after_sea_19"
    },
    "day1_after_sea_19": {
        next: "day1_after_sea_20"
    },
    "day1_after_sea_20": {
        character: "sea_smile",
        next: "day1_after_sea_21",
        stats: { sea: { affinity: 3 } }
    },
    "day1_after_sea_21": {
        next: "day1_after_sea_22"
    },
    "day1_after_sea_22": {
        character: null,
        next: "day1_after_end",
        setFlags: ["sea_pinky_promise"]
    },

    // ===== 유나 — 도서관 =====
    "day1_after_yuna": {
        background: "library",
        character: null,
        sunset: true,
        next: "day1_after_yuna_2"
    },
    "day1_after_yuna_2": {
        character: "yuna_smile",
        next: "day1_after_yuna_3"
    },
    "day1_after_yuna_3": {
        next: "day1_after_yuna_4"
    },
    "day1_after_yuna_4": {
        next: "day1_after_yuna_5"
    },
    "day1_after_yuna_5": {
        next: "day1_after_yuna_6",
        stats: { yuna: { affinity: 5 } }
    },
    "day1_after_yuna_6": {
        next: "day1_after_yuna_7"
    },
    "day1_after_yuna_7": {
        character: "yuna_smile",
        next: "day1_after_yuna_8"
    },
    "day1_after_yuna_8": {
        next: "day1_after_yuna_9"
    },
    "day1_after_yuna_9": {
        next: "day1_after_yuna_10"
    },
    "day1_after_yuna_10": {
        next: "day1_after_yuna_11"
    },
    "day1_after_yuna_11": {
        next: "day1_after_yuna_12"
    },
    "day1_after_yuna_12": {
        next: "day1_after_yuna_13",
        stats: { yuna: { trust: 3 } }
    },
    "day1_after_yuna_13": {
        character: "yuna_normal",
        next: "day1_after_yuna_14"
    },
    "day1_after_yuna_14": {
        next: "day1_after_yuna_15"
    },
    "day1_after_yuna_15": {
        next: "day1_after_yuna_16"
    },
    "day1_after_yuna_16": {
        character: "yuna_smile",
        next: "day1_after_yuna_17"
    },
    "day1_after_yuna_17": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 리인 — 보건실 =====
    "day1_after_riin": {
        background: "nurse_office",
        character: null,
        sunset: true,
        next: "day1_after_riin_2"
    },
    "day1_after_riin_2": {
        character: "riin_normal",
        next: "day1_after_riin_3"
    },
    "day1_after_riin_3": {
        next: "day1_after_riin_4",
        stats: { riin: { affinity: 5 } }
    },
    "day1_after_riin_4": {
        next: "day1_after_riin_5"
    },
    "day1_after_riin_5": {
        character: "riin_smile",
        next: "day1_after_riin_6"
    },
    "day1_after_riin_6": {
        next: "day1_after_riin_7"
    },
    "day1_after_riin_7": {
        next: "day1_after_riin_8"
    },
    "day1_after_riin_8": {
        next: "day1_after_riin_9"
    },
    "day1_after_riin_9": {
        next: "day1_after_riin_10"
    },
    "day1_after_riin_10": {
        next: "day1_after_riin_11"
    },
    "day1_after_riin_11": {
        next: "day1_after_riin_12"
    },
    "day1_after_riin_12": {
        next: "day1_after_riin_13"
    },
    "day1_after_riin_13": {
        next: "day1_after_riin_14"
    },
    "day1_after_riin_14": {
        next: "day1_after_riin_15"
    },
    "day1_after_riin_15": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 은수 — 교무실 =====
    "day1_after_eunsu": {
        background: "teacher_office",
        character: null,
        sunset: true,
        next: "day1_after_eunsu_2"
    },
    "day1_after_eunsu_2": {
        character: "eunsu_smile",
        next: "day1_after_eunsu_3"
    },
    "day1_after_eunsu_3": {
        next: "day1_after_eunsu_4",
        stats: { eunsu: { affinity: 5 } }
    },
    "day1_after_eunsu_4": {
        next: "day1_after_eunsu_5"
    },
    "day1_after_eunsu_5": {
        next: "day1_after_eunsu_6"
    },
    "day1_after_eunsu_6": {
        next: "day1_after_eunsu_7"
    },
    "day1_after_eunsu_7": {
        next: "day1_after_eunsu_8"
    },
    "day1_after_eunsu_8": {
        next: "day1_after_eunsu_9"
    },
    "day1_after_eunsu_9": {
        next: "day1_after_eunsu_10"
    },
    "day1_after_eunsu_10": {
        next: "day1_after_eunsu_11"
    },
    "day1_after_eunsu_11": {
        character: "eunsu_normal",
        next: "day1_after_eunsu_12",
        stats: { eunsu: { danger: 3 } }
    },
    "day1_after_eunsu_12": {
        next: "day1_after_eunsu_13"
    },
    "day1_after_eunsu_13": {
        character: "eunsu_smile",
        next: "day1_after_eunsu_14"
    },
    "day1_after_eunsu_14": {
        next: "day1_after_eunsu_15"
    },
    "day1_after_eunsu_15": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 귀가 =====
    "day1_after_home": {
        background: "school_gate_evening",
        character: null,
        sunset: true,
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
        next: "day1_after_home_7"
    },
    "day1_after_home_7": {
        next: "day1_after_home_8"
    },
    "day1_after_home_8": {
        next: "day1_after_end"
    },

    // ===== 공통 종료 =====
    "day1_after_end": {
        character: null,
        changeSlot: "night",
        next: "day1_night_start"
    }
});
