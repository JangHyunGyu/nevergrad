/**
 * ============================================================================
 * Day 2-2: Lunch - 다가오는 여자들, 이상한 장면 하나
 * ============================================================================
 * 4 route choices: 세아/유나/리인/옥상
 * - 세아: "너는 내 거야" 핀, 손등 잡기
 * - 유나: 수상한 사진 (dark photos), "꼭 오세요"
 * - 리인: 건강검진, 과도한 질문 (수면패턴, 진정제 알레르기)
 * - 옥상: 은수의 통화 목격 ("예정대로 진행해도...")
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    "day2_lunch_start": {
        background: "classroom",
        character: null,
        next: "day2_lunch_choice"
    },
    "day2_lunch_choice": {
        choices: [
            { next: "day2_lunch_sea_1" },
            { next: "day2_lunch_yuna_1", condition: "met_yuna" },
            { next: "day2_lunch_riin_1", condition: "met_riin" },
            { next: "day2_lunch_rooftop_1" }
        ]
    },

    // ===== 세아 — "너는 내 거야" 핀 =====
    "day2_lunch_sea_1": {
        character: "sea_smile",
        next: "day2_lunch_sea_2",
        stats: { sea: { affinity: 5 } }
    },
    "day2_lunch_sea_2": {
        next: "day2_lunch_sea_3"
    },
    "day2_lunch_sea_3": {
        next: "day2_lunch_sea_4"
    },
    "day2_lunch_sea_4": {
        next: "day2_lunch_sea_5"
    },
    "day2_lunch_sea_5": {
        next: "day2_lunch_sea_6"
    },
    "day2_lunch_sea_6": {
        next: "day2_lunch_sea_7"
    },
    "day2_lunch_sea_7": {
        next: "day2_lunch_sea_8"
    },
    "day2_lunch_sea_8": {
        next: "day2_lunch_sea_9"
    },
    "day2_lunch_sea_9": {
        next: "day2_lunch_sea_10"
    },
    "day2_lunch_sea_10": {
        next: "day2_lunch_sea_11"
    },
    "day2_lunch_sea_11": {
        next: "day2_lunch_sea_12"
    },
    "day2_lunch_sea_12": {
        next: "day2_lunch_sea_13"
    },
    "day2_lunch_sea_13": {
        character: "sea_shy",
        next: "day2_lunch_sea_14"
    },
    "day2_lunch_sea_14": {
        next: "day2_lunch_sea_15"
    },
    "day2_lunch_sea_15": {
        next: "day2_lunch_sea_16"
    },
    "day2_lunch_sea_16": {
        next: "day2_lunch_sea_17",
        stats: { sea: { danger: 5 } }
    },
    "day2_lunch_sea_17": {
        next: "day2_lunch_sea_18"
    },
    "day2_lunch_sea_18": {
        character: "sea_smile",
        next: "day2_lunch_sea_19"
    },
    "day2_lunch_sea_19": {
        character: null,
        next: "day2_lunch_end"
    },

    // ===== 유나 — 수상한 사진 =====
    "day2_lunch_yuna_1": {
        background: "library",
        character: "yuna_smile",
        next: "day2_lunch_yuna_2"
    },
    "day2_lunch_yuna_2": {
        next: "day2_lunch_yuna_3"
    },
    "day2_lunch_yuna_3": {
        next: "day2_lunch_yuna_4"
    },
    "day2_lunch_yuna_4": {
        next: "day2_lunch_yuna_5",
        stats: { yuna: { affinity: 3 } }
    },
    "day2_lunch_yuna_5": {
        next: "day2_lunch_yuna_6"
    },
    "day2_lunch_yuna_6": {
        next: "day2_lunch_yuna_7"
    },
    "day2_lunch_yuna_7": {
        next: "day2_lunch_yuna_8"
    },
    "day2_lunch_yuna_8": {
        next: "day2_lunch_yuna_9"
    },
    "day2_lunch_yuna_9": {
        character: "yuna_scared",
        next: "day2_lunch_yuna_10"
    },
    "day2_lunch_yuna_10": {
        next: "day2_lunch_yuna_11"
    },
    "day2_lunch_yuna_11": {
        next: "day2_lunch_yuna_12"
    },
    "day2_lunch_yuna_12": {
        character: "yuna_smile",
        next: "day2_lunch_yuna_13",
        stats: { yuna: { trust: 3 } }
    },
    "day2_lunch_yuna_13": {
        next: "day2_lunch_yuna_14"
    },
    "day2_lunch_yuna_14": {
        character: null,
        next: "day2_lunch_end"
    },

    // ===== 리인 — 건강검진 명목의 접근 =====
    "day2_lunch_riin_1": {
        background: "nurse_office",
        character: "riin_smile",
        next: "day2_lunch_riin_2"
    },
    "day2_lunch_riin_2": {
        next: "day2_lunch_riin_3"
    },
    "day2_lunch_riin_3": {
        next: "day2_lunch_riin_4"
    },
    "day2_lunch_riin_4": {
        next: "day2_lunch_riin_5",
        stats: { riin: { affinity: 3 } }
    },
    "day2_lunch_riin_5": {
        next: "day2_lunch_riin_6"
    },
    "day2_lunch_riin_6": {
        next: "day2_lunch_riin_7"
    },
    "day2_lunch_riin_7": {
        character: "riin_seductive",
        next: "day2_lunch_riin_8"
    },
    "day2_lunch_riin_8": {
        next: "day2_lunch_riin_9"
    },
    "day2_lunch_riin_9": {
        next: "day2_lunch_riin_10",
        stats: { riin: { danger: 8 } }
    },
    "day2_lunch_riin_10": {
        next: "day2_lunch_riin_11"
    },
    "day2_lunch_riin_11": {
        next: "day2_lunch_riin_12"
    },
    "day2_lunch_riin_12": {
        character: "riin_smile",
        next: "day2_lunch_riin_13"
    },
    "day2_lunch_riin_13": {
        next: "day2_lunch_riin_14"
    },
    "day2_lunch_riin_14": {
        character: null,
        next: "day2_lunch_end"
    },

    // ===== 옥상 — 은수의 통화 목격 =====
    "day2_lunch_rooftop_1": {
        background: "rooftop",
        character: null,
        next: "day2_lunch_rooftop_2"
    },
    "day2_lunch_rooftop_2": {
        next: "day2_lunch_rooftop_3"
    },
    "day2_lunch_rooftop_3": {
        character: "eunsu_normal",
        next: "day2_lunch_rooftop_4",
        stats: { eunsu: { danger: 5 } }
    },
    "day2_lunch_rooftop_4": {
        next: "day2_lunch_rooftop_5"
    },
    "day2_lunch_rooftop_5": {
        character: null,
        next: "day2_lunch_rooftop_6"
    },
    "day2_lunch_rooftop_6": {
        character: "eunsu_smile",
        next: "day2_lunch_rooftop_7"
    },
    "day2_lunch_rooftop_7": {
        next: "day2_lunch_rooftop_8"
    },
    "day2_lunch_rooftop_8": {
        character: null,
        next: "day2_lunch_rooftop_9"
    },
    "day2_lunch_rooftop_9": {
        background: "rooftop",
        next: "day2_lunch_rooftop_10"
    },
    "day2_lunch_rooftop_10": {
        next: "day2_lunch_end"
    },

    // ===== 점심 종료 =====
    "day2_lunch_end": {
        background: "classroom",
        character: null,
        changeSlot: "afterschool",
        next: "day2_after_start"
    }
});
