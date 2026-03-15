/**
 * ============================================================================
 * Day 2-2: Lunch - 점심시간의 네 갈래
 * ============================================================================
 * 4 route choices: 세아/유나/리인/옥상
 * - 세아: 도시락 (치킨가스, 꽃당근, 미니김밥), 주말 약속, 이어폰 공유
 * - 유나: 도서관 사진, 고양이 도토리, "이 학교에 전에 온 적 있어요?" 복선
 * - 리인: 건강검진, 꿈 질문, 카모마일 차, "사람이 너무 좋으면 불안" 고백
 * - 옥상: 은수 통화 목격 ("안정적입니다... 5일 안으로")
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    // ===== 점심 시작 & 선택지 =====
    "day2_lunch_start": {
        background: "classroom",
        character: null,
        next: "day2_lunch_choice"
    },
    "day2_lunch_choice": {
        character: null,
        choices: [
            { next: "day2_lunch_sea_1" },
            { next: "day2_lunch_yuna_1" },
            { next: "day2_lunch_riin_1" },
            { next: "day2_lunch_rooftop_1" }
        ]
    },

    // ===== Route A: 세아 — 도시락 (sea_1 ~ sea_25) =====
    "day2_lunch_sea_1": {
        background: "classroom",
        character: "sea_smile",
        next: "day2_lunch_sea_2"
    },
    "day2_lunch_sea_2": {
        character: null,
        next: "day2_lunch_sea_3"
    },
    "day2_lunch_sea_3": {
        character: null,
        next: "day2_lunch_sea_4",
        stats: { sea: { affinity: 3 } }
    },
    "day2_lunch_sea_4": {
        character: null,
        next: "day2_lunch_sea_5"
    },
    "day2_lunch_sea_5": {
        character: null,
        next: "day2_lunch_sea_6"
    },
    "day2_lunch_sea_6": {
        character: "sea_normal",
        next: "day2_lunch_sea_7"
    },
    "day2_lunch_sea_7": {
        character: null,
        next: "day2_lunch_sea_8"
    },
    "day2_lunch_sea_8": {
        character: "sea_smile",
        next: "day2_lunch_sea_9"
    },
    "day2_lunch_sea_9": {
        character: null,
        next: "day2_lunch_sea_10"
    },
    "day2_lunch_sea_10": {
        character: null,
        next: "day2_lunch_sea_11"
    },
    "day2_lunch_sea_11": {
        character: null,
        next: "day2_lunch_sea_12",
        stats: { sea: { affinity: 3 } }
    },
    "day2_lunch_sea_12": {
        character: null,
        next: "day2_lunch_sea_13"
    },
    "day2_lunch_sea_13": {
        character: null,
        next: "day2_lunch_sea_14"
    },
    "day2_lunch_sea_14": {
        character: "sea_normal",
        next: "day2_lunch_sea_15"
    },
    "day2_lunch_sea_15": {
        character: null,
        next: "day2_lunch_sea_16"
    },
    "day2_lunch_sea_16": {
        character: null,
        next: "day2_lunch_sea_17"
    },
    "day2_lunch_sea_17": {
        character: "sea_smile",
        next: "day2_lunch_sea_18"
    },
    "day2_lunch_sea_18": {
        character: null,
        next: "day2_lunch_sea_19"
    },
    "day2_lunch_sea_19": {
        character: null,
        next: "day2_lunch_sea_20"
    },
    "day2_lunch_sea_20": {
        character: null,
        next: "day2_lunch_sea_21"
    },
    "day2_lunch_sea_21": {
        character: null,
        next: "day2_lunch_sea_22"
    },
    "day2_lunch_sea_22": {
        character: null,
        next: "day2_lunch_sea_23"
    },
    "day2_lunch_sea_23": {
        character: null,
        next: "day2_lunch_sea_24"
    },
    "day2_lunch_sea_24": {
        character: null,
        next: "day2_lunch_sea_25"
    },
    "day2_lunch_sea_25": {
        character: null,
        next: "day2_lunch_end"
    },

    // ===== Route B: 유나 — 도서관 (yuna_1 ~ yuna_24) =====
    "day2_lunch_yuna_1": {
        background: "library",
        character: "yuna_shy",
        next: "day2_lunch_yuna_2"
    },
    "day2_lunch_yuna_2": {
        character: null,
        next: "day2_lunch_yuna_3"
    },
    "day2_lunch_yuna_3": {
        character: null,
        next: "day2_lunch_yuna_4"
    },
    "day2_lunch_yuna_4": {
        character: null,
        next: "day2_lunch_yuna_5",
        stats: { yuna: { affinity: 3 } }
    },
    "day2_lunch_yuna_5": {
        character: null,
        next: "day2_lunch_yuna_6"
    },
    "day2_lunch_yuna_6": {
        character: "yuna_normal",
        next: "day2_lunch_yuna_7"
    },
    "day2_lunch_yuna_7": {
        character: null,
        next: "day2_lunch_yuna_8"
    },
    "day2_lunch_yuna_8": {
        character: null,
        next: "day2_lunch_yuna_9"
    },
    "day2_lunch_yuna_9": {
        character: null,
        next: "day2_lunch_yuna_10"
    },
    "day2_lunch_yuna_10": {
        character: null,
        next: "day2_lunch_yuna_11"
    },
    "day2_lunch_yuna_11": {
        character: null,
        next: "day2_lunch_yuna_12"
    },
    "day2_lunch_yuna_12": {
        character: null,
        next: "day2_lunch_yuna_13"
    },
    "day2_lunch_yuna_13": {
        character: null,
        next: "day2_lunch_yuna_14"
    },
    "day2_lunch_yuna_14": {
        character: "yuna_shy",
        next: "day2_lunch_yuna_15"
    },
    "day2_lunch_yuna_15": {
        character: null,
        next: "day2_lunch_yuna_16"
    },
    "day2_lunch_yuna_16": {
        character: null,
        next: "day2_lunch_yuna_17"
    },
    "day2_lunch_yuna_17": {
        character: null,
        next: "day2_lunch_yuna_18"
    },
    "day2_lunch_yuna_18": {
        character: null,
        next: "day2_lunch_yuna_19"
    },
    "day2_lunch_yuna_19": {
        character: "yuna_normal",
        next: "day2_lunch_yuna_20"
    },
    "day2_lunch_yuna_20": {
        character: null,
        next: "day2_lunch_yuna_21",
        stats: { yuna: { trust: 3 } }
    },
    "day2_lunch_yuna_21": {
        character: null,
        next: "day2_lunch_yuna_22"
    },
    "day2_lunch_yuna_22": {
        character: null,
        next: "day2_lunch_yuna_23"
    },
    "day2_lunch_yuna_23": {
        character: null,
        next: "day2_lunch_yuna_24"
    },
    "day2_lunch_yuna_24": {
        character: null,
        next: "day2_lunch_end"
    },

    // ===== Route C: 리인 — 건강검진 (riin_1 ~ riin_29) =====
    "day2_lunch_riin_1": {
        background: "nurse_office",
        character: "riin_gentle",
        next: "day2_lunch_riin_2"
    },
    "day2_lunch_riin_2": {
        character: null,
        next: "day2_lunch_riin_3"
    },
    "day2_lunch_riin_3": {
        character: null,
        next: "day2_lunch_riin_4",
        stats: { riin: { affinity: 3 } }
    },
    "day2_lunch_riin_4": {
        character: null,
        next: "day2_lunch_riin_5"
    },
    "day2_lunch_riin_5": {
        character: "riin_normal",
        next: "day2_lunch_riin_6"
    },
    "day2_lunch_riin_6": {
        character: null,
        next: "day2_lunch_riin_7"
    },
    "day2_lunch_riin_7": {
        character: null,
        next: "day2_lunch_riin_8"
    },
    "day2_lunch_riin_8": {
        character: null,
        next: "day2_lunch_riin_9"
    },
    "day2_lunch_riin_9": {
        character: null,
        next: "day2_lunch_riin_10"
    },
    "day2_lunch_riin_10": {
        character: null,
        next: "day2_lunch_riin_11"
    },
    "day2_lunch_riin_11": {
        character: null,
        next: "day2_lunch_riin_12"
    },
    "day2_lunch_riin_12": {
        character: null,
        next: "day2_lunch_riin_13"
    },
    "day2_lunch_riin_13": {
        character: null,
        next: "day2_lunch_riin_14"
    },
    "day2_lunch_riin_14": {
        character: null,
        next: "day2_lunch_riin_15"
    },
    "day2_lunch_riin_15": {
        character: null,
        next: "day2_lunch_riin_16"
    },
    "day2_lunch_riin_16": {
        character: "riin_gentle",
        next: "day2_lunch_riin_17"
    },
    "day2_lunch_riin_17": {
        character: null,
        next: "day2_lunch_riin_18"
    },
    "day2_lunch_riin_18": {
        character: null,
        next: "day2_lunch_riin_19"
    },
    "day2_lunch_riin_19": {
        character: null,
        next: "day2_lunch_riin_20"
    },
    "day2_lunch_riin_20": {
        character: null,
        next: "day2_lunch_riin_21"
    },
    "day2_lunch_riin_21": {
        character: null,
        next: "day2_lunch_riin_22"
    },
    "day2_lunch_riin_22": {
        character: null,
        next: "day2_lunch_riin_23"
    },
    "day2_lunch_riin_23": {
        character: null,
        next: "day2_lunch_riin_24"
    },
    "day2_lunch_riin_24": {
        character: "riin_normal",
        next: "day2_lunch_riin_25"
    },
    "day2_lunch_riin_25": {
        character: null,
        next: "day2_lunch_riin_26"
    },
    "day2_lunch_riin_26": {
        character: null,
        next: "day2_lunch_riin_27"
    },
    "day2_lunch_riin_27": {
        character: null,
        next: "day2_lunch_riin_28"
    },
    "day2_lunch_riin_28": {
        character: "riin_gentle",
        next: "day2_lunch_riin_29"
    },
    "day2_lunch_riin_29": {
        character: null,
        next: "day2_lunch_end"
    },

    // ===== Route D: 옥상 — 은수의 통화 목격 (rooftop_1 ~ rooftop_11) =====
    "day2_lunch_rooftop_1": {
        background: "stairway",
        character: null,
        next: "day2_lunch_rooftop_2"
    },
    "day2_lunch_rooftop_2": {
        character: "eunsu_normal",
        next: "day2_lunch_rooftop_3",
        stats: { eunsu: { danger: 5 } }
    },
    "day2_lunch_rooftop_3": {
        character: null,
        next: "day2_lunch_rooftop_4"
    },
    "day2_lunch_rooftop_4": {
        character: "eunsu_warm",
        next: "day2_lunch_rooftop_5"
    },
    "day2_lunch_rooftop_5": {
        character: null,
        next: "day2_lunch_rooftop_6"
    },
    "day2_lunch_rooftop_6": {
        character: null,
        next: "day2_lunch_rooftop_7"
    },
    "day2_lunch_rooftop_7": {
        character: null,
        next: "day2_lunch_rooftop_8"
    },
    "day2_lunch_rooftop_8": {
        character: null,
        background: "rooftop",
        next: "day2_lunch_rooftop_9"
    },
    "day2_lunch_rooftop_9": {
        character: null,
        next: "day2_lunch_rooftop_9a"
    },
    "day2_lunch_rooftop_9a": {
        character: null,
        next: "day2_lunch_rooftop_10"
    },
    "day2_lunch_rooftop_10": {
        character: null,
        next: "day2_lunch_rooftop_11"
    },
    "day2_lunch_rooftop_11": {
        character: null,
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
