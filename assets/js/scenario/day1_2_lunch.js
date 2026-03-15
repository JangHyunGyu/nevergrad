/**
 * Day 1-2: Lunch - 달콤한 만남들
 * 세아 도시락 + 이어폰 씬, 유나 도서관 첫 만남 + 벚꽃 연작, 리인 보건실 첫 만남, 옥상 혼자
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 점심 시작 =====
    "day1_lunch_start": {
        background: "classroom",
        bgm: "daily_bright.mp3",
        character: null,
        next: "day1_lunch_choice"
    },
    "day1_lunch_choice": {
        character: null,
        choices: [
            { next: "day1_lunch_sea_1", setFlags: ["lunch_with_sea"] },
            { next: "day1_lunch_yuna_1", setFlags: ["met_yuna"] },
            { next: "day1_lunch_riin_1", setFlags: ["met_riin"] },
            { next: "day1_lunch_alone_1" }
        ]
    },

    // ===== 루트 A: 세아와 점심 (sea_1 ~ sea_29) =====
    // 도시락 씬
    "day1_lunch_sea_1": {
        character: null,
        next: "day1_lunch_sea_2"
    },
    "day1_lunch_sea_2": {
        character: null,
        next: "day1_lunch_sea_3"
    },
    "day1_lunch_sea_3": {
        character: null,
        next: "day1_lunch_sea_4"
    },
    "day1_lunch_sea_4": {
        character: "sea_smile",
        next: "day1_lunch_sea_5"
    },
    "day1_lunch_sea_5": {
        character: null,
        next: "day1_lunch_sea_6"
    },
    "day1_lunch_sea_6": {
        character: null,
        next: "day1_lunch_sea_7"
    },
    "day1_lunch_sea_7": {
        character: "sea_smile",
        next: "day1_lunch_sea_8"
    },
    "day1_lunch_sea_8": {
        character: null,
        next: "day1_lunch_sea_9"
    },
    "day1_lunch_sea_9": {
        character: "sea_smile",
        next: "day1_lunch_sea_10"
    },
    "day1_lunch_sea_10": {
        character: null,
        next: "day1_lunch_sea_11"
    },
    "day1_lunch_sea_11": {
        character: null,
        next: "day1_lunch_sea_12"
    },
    "day1_lunch_sea_12": {
        character: "sea_smile",
        next: "day1_lunch_sea_13"
    },
    "day1_lunch_sea_13": {
        character: null,
        next: "day1_lunch_sea_14",
        glitch: "loop_truth"
    },
    // 수다 이어짐
    "day1_lunch_sea_14": {
        character: null,
        next: "day1_lunch_sea_15"
    },
    "day1_lunch_sea_15": {
        character: null,
        next: "day1_lunch_sea_16"
    },
    "day1_lunch_sea_16": {
        character: "sea_smile",
        next: "day1_lunch_sea_17"
    },
    "day1_lunch_sea_17": {
        character: null,
        next: "day1_lunch_sea_18"
    },
    "day1_lunch_sea_18": {
        character: "sea_normal",
        next: "day1_lunch_sea_19"
    },
    "day1_lunch_sea_19": {
        character: null,
        next: "day1_lunch_sea_20"
    },
    "day1_lunch_sea_20": {
        character: "sea_smile",
        next: "day1_lunch_sea_21",
        glitch: "loop_truth"
    },
    // 이어폰 음악 공유 씬
    "day1_lunch_sea_21": {
        character: null,
        next: "day1_lunch_sea_22"
    },
    "day1_lunch_sea_22": {
        character: "sea_smile",
        next: "day1_lunch_sea_23"
    },
    "day1_lunch_sea_23": {
        character: null,
        next: "day1_lunch_sea_24"
    },
    "day1_lunch_sea_24": {
        character: null,
        next: "day1_lunch_sea_25"
    },
    "day1_lunch_sea_25": {
        character: "sea_smile",
        next: "day1_lunch_sea_26"
    },
    "day1_lunch_sea_26": {
        character: null,
        next: "day1_lunch_sea_27"
    },
    "day1_lunch_sea_27": {
        character: null,
        next: "day1_lunch_sea_28"
    },
    "day1_lunch_sea_28": {
        character: "sea_smile",
        next: "day1_lunch_sea_29"
    },
    "day1_lunch_sea_29": {
        character: null,
        next: "day1_lunch_end",
        stats: { sea: { affinity: 5, danger: 2 } },
        glitch: "loop_truth"
    },

    // ===== 루트 B: 도서관 — 유나 첫 만남 (yuna_1 ~ yuna_16) =====
    "day1_lunch_yuna_1": {
        background: "library",
        character: null,
        next: "day1_lunch_yuna_2"
    },
    "day1_lunch_yuna_2": {
        character: null,
        next: "day1_lunch_yuna_3"
    },
    "day1_lunch_yuna_3": {
        character: null,
        next: "day1_lunch_yuna_4"
    },
    "day1_lunch_yuna_4": {
        character: null,
        next: "day1_lunch_yuna_5"
    },
    "day1_lunch_yuna_5": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_6"
    },
    "day1_lunch_yuna_6": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_7"
    },
    "day1_lunch_yuna_7": {
        character: null,
        next: "day1_lunch_yuna_8"
    },
    "day1_lunch_yuna_8": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_9"
    },
    "day1_lunch_yuna_9": {
        character: null,
        next: "day1_lunch_yuna_10"
    },
    "day1_lunch_yuna_10": {
        character: null,
        next: "day1_lunch_yuna_11"
    },
    "day1_lunch_yuna_11": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_12"
    },
    // 사진 보여주기 + 벚꽃 연작
    "day1_lunch_yuna_12": {
        character: null,
        next: "day1_lunch_yuna_13"
    },
    "day1_lunch_yuna_13": {
        character: null,
        next: "day1_lunch_yuna_14"
    },
    "day1_lunch_yuna_14": {
        character: null,
        next: "day1_lunch_yuna_15"
    },
    "day1_lunch_yuna_15": {
        character: "yuna_normal",
        next: "day1_lunch_yuna_16"
    },
    "day1_lunch_yuna_16": {
        character: null,
        next: "day1_lunch_end",
        stats: { yuna: { affinity: 5, trust: 3 } },
        glitch: "loop_truth"
    },

    // ===== 루트 C: 보건실 — 리인 첫 만남 (riin_1 ~ riin_12) =====
    "day1_lunch_riin_1": {
        background: "nurse_office",
        character: null,
        next: "day1_lunch_riin_2"
    },
    "day1_lunch_riin_2": {
        character: null,
        next: "day1_lunch_riin_3"
    },
    "day1_lunch_riin_3": {
        character: "riin_gentle",
        next: "day1_lunch_riin_4"
    },
    "day1_lunch_riin_4": {
        character: null,
        next: "day1_lunch_riin_5"
    },
    "day1_lunch_riin_5": {
        character: "riin_normal",
        next: "day1_lunch_riin_6"
    },
    "day1_lunch_riin_6": {
        character: null,
        next: "day1_lunch_riin_7"
    },
    "day1_lunch_riin_7": {
        character: "riin_gentle",
        next: "day1_lunch_riin_8"
    },
    "day1_lunch_riin_8": {
        character: null,
        next: "day1_lunch_riin_9"
    },
    "day1_lunch_riin_9": {
        character: "riin_gentle",
        next: "day1_lunch_riin_10"
    },
    "day1_lunch_riin_10": {
        character: null,
        next: "day1_lunch_riin_11"
    },
    "day1_lunch_riin_11": {
        character: "riin_gentle",
        next: "day1_lunch_riin_12"
    },
    "day1_lunch_riin_12": {
        character: null,
        next: "day1_lunch_riin_13"
    },
    // 보건실에서 잠깐 잠들기
    "day1_lunch_riin_13": {
        character: null,
        next: "day1_lunch_riin_14"
    },
    "day1_lunch_riin_14": {
        character: null,
        next: "day1_lunch_riin_15"
    },
    "day1_lunch_riin_15": {
        character: "riin_gentle",
        next: "day1_lunch_riin_16"
    },
    "day1_lunch_riin_16": {
        character: null,
        next: "day1_lunch_riin_17"
    },
    "day1_lunch_riin_17": {
        character: "riin_gentle",
        next: "day1_lunch_riin_18"
    },
    "day1_lunch_riin_18": {
        character: null,
        next: "day1_lunch_end",
        stats: { riin: { affinity: 5, danger: 5 } },
        glitch: "loop_truth"
    },

    // ===== 루트 D: 옥상에서 혼자 (alone_1 ~ alone_5) =====
    "day1_lunch_alone_1": {
        background: "rooftop",
        character: null,
        next: "day1_lunch_alone_2"
    },
    "day1_lunch_alone_2": {
        character: null,
        next: "day1_lunch_alone_3"
    },
    "day1_lunch_alone_3": {
        character: null,
        next: "day1_lunch_alone_4"
    },
    "day1_lunch_alone_4": {
        character: null,
        next: "day1_lunch_alone_5"
    },
    "day1_lunch_alone_5": {
        character: null,
        next: "day1_lunch_end",
        glitch: "loop_truth"
    },

    // ===== 점심 종료 =====
    "day1_lunch_end": {
        background: "classroom",
        character: null,
        changeSlot: "afterschool",
        next: "day1_after_start"
    }
});
