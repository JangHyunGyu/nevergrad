/**
 * Day 1-2: Lunch - 점심시간의 달콤한 만남들
 * 세아 도시락, 유나 도서관 첫 만남, 리인 보건실 첫 만남, 옥상 혼자
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 점심 시작 =====
    "day1_lunch_start": {
        background: "classroom",
        bgm: "daily_bright.mp3",
        character: null,
        next: "day1_lunch_start_2"
    },
    "day1_lunch_start_2": {
        next: "day1_lunch_choice"
    },
    "day1_lunch_choice": {
        choices: [
            { next: "day1_lunch_sea_1", setFlags: ["lunch_with_sea"] },
            { next: "day1_lunch_yuna_1" },
            { next: "day1_lunch_riin_1" },
            { next: "day1_lunch_alone_1" }
        ]
    },

    // ===== 루트 A: 세아와 점심 (sea_1 ~ sea_45) =====
    "day1_lunch_sea_1": {
        character: "sea_smile",
        next: "day1_lunch_sea_2"
    },
    "day1_lunch_sea_2": {
        next: "day1_lunch_sea_3"
    },
    "day1_lunch_sea_3": {
        next: "day1_lunch_sea_4"
    },
    "day1_lunch_sea_4": {
        next: "day1_lunch_sea_5"
    },
    "day1_lunch_sea_5": {
        next: "day1_lunch_sea_6"
    },
    "day1_lunch_sea_6": {
        next: "day1_lunch_sea_7"
    },
    "day1_lunch_sea_7": {
        next: "day1_lunch_sea_8"
    },
    "day1_lunch_sea_8": {
        next: "day1_lunch_sea_9"
    },
    "day1_lunch_sea_9": {
        next: "day1_lunch_sea_10"
    },
    "day1_lunch_sea_10": {
        next: "day1_lunch_sea_11"
    },
    "day1_lunch_sea_11": {
        next: "day1_lunch_sea_12"
    },
    "day1_lunch_sea_12": {
        next: "day1_lunch_sea_13"
    },
    "day1_lunch_sea_13": {
        character: "sea_shy",
        next: "day1_lunch_sea_14"
    },
    "day1_lunch_sea_14": {
        next: "day1_lunch_sea_15"
    },
    "day1_lunch_sea_15": {
        character: "sea_smile",
        next: "day1_lunch_sea_16"
    },
    "day1_lunch_sea_16": {
        next: "day1_lunch_sea_17"
    },
    "day1_lunch_sea_17": {
        next: "day1_lunch_sea_18"
    },
    "day1_lunch_sea_18": {
        next: "day1_lunch_sea_19"
    },
    "day1_lunch_sea_19": {
        character: "sea_shy",
        next: "day1_lunch_sea_20"
    },
    "day1_lunch_sea_20": {
        next: "day1_lunch_sea_21"
    },
    "day1_lunch_sea_21": {
        next: "day1_lunch_sea_22"
    },
    "day1_lunch_sea_22": {
        character: "sea_smile",
        next: "day1_lunch_sea_23"
    },
    "day1_lunch_sea_23": {
        next: "day1_lunch_sea_24"
    },
    "day1_lunch_sea_24": {
        next: "day1_lunch_sea_25"
    },
    "day1_lunch_sea_25": {
        next: "day1_lunch_sea_26"
    },
    "day1_lunch_sea_26": {
        next: "day1_lunch_sea_27"
    },
    "day1_lunch_sea_27": {
        next: "day1_lunch_sea_28"
    },
    "day1_lunch_sea_28": {
        character: "sea_shy",
        next: "day1_lunch_sea_29"
    },
    "day1_lunch_sea_29": {
        next: "day1_lunch_sea_30"
    },
    "day1_lunch_sea_30": {
        character: "sea_smile",
        next: "day1_lunch_sea_31"
    },
    "day1_lunch_sea_31": {
        next: "day1_lunch_sea_32"
    },
    "day1_lunch_sea_32": {
        next: "day1_lunch_sea_33"
    },
    "day1_lunch_sea_33": {
        next: "day1_lunch_sea_34"
    },
    "day1_lunch_sea_34": {
        next: "day1_lunch_sea_35"
    },
    "day1_lunch_sea_35": {
        character: "sea_shy",
        next: "day1_lunch_sea_36"
    },
    "day1_lunch_sea_36": {
        next: "day1_lunch_sea_37"
    },
    "day1_lunch_sea_37": {
        character: "sea_smile",
        next: "day1_lunch_sea_38"
    },
    "day1_lunch_sea_38": {
        next: "day1_lunch_sea_39"
    },
    "day1_lunch_sea_39": {
        next: "day1_lunch_sea_40"
    },
    "day1_lunch_sea_40": {
        next: "day1_lunch_sea_41"
    },
    "day1_lunch_sea_41": {
        next: "day1_lunch_sea_42"
    },
    "day1_lunch_sea_42": {
        next: "day1_lunch_sea_43",
        stats: { sea: { affinity: 5, danger: 2 } }
    },
    "day1_lunch_sea_43": {
        character: null,
        next: "day1_lunch_sea_44"
    },
    "day1_lunch_sea_44": {
        next: "day1_lunch_sea_45"
    },
    "day1_lunch_sea_45": {
        next: "day1_lunch_end"
    },

    // ===== 루트 B: 도서관 — 유나 첫 만남 (yuna_1 ~ yuna_30) =====
    "day1_lunch_yuna_1": {
        background: "library",
        character: null,
        next: "day1_lunch_yuna_2"
    },
    "day1_lunch_yuna_2": {
        next: "day1_lunch_yuna_3"
    },
    "day1_lunch_yuna_3": {
        next: "day1_lunch_yuna_4"
    },
    "day1_lunch_yuna_4": {
        next: "day1_lunch_yuna_5"
    },
    "day1_lunch_yuna_5": {
        character: "yuna_scared",
        next: "day1_lunch_yuna_6"
    },
    "day1_lunch_yuna_6": {
        next: "day1_lunch_yuna_7"
    },
    "day1_lunch_yuna_7": {
        next: "day1_lunch_yuna_8"
    },
    "day1_lunch_yuna_8": {
        next: "day1_lunch_yuna_9"
    },
    "day1_lunch_yuna_9": {
        next: "day1_lunch_yuna_10"
    },
    "day1_lunch_yuna_10": {
        next: "day1_lunch_yuna_11",
        setFlags: ["met_yuna"]
    },
    "day1_lunch_yuna_11": {
        character: "yuna_smile",
        next: "day1_lunch_yuna_12"
    },
    "day1_lunch_yuna_12": {
        next: "day1_lunch_yuna_13"
    },
    "day1_lunch_yuna_13": {
        next: "day1_lunch_yuna_14"
    },
    "day1_lunch_yuna_14": {
        next: "day1_lunch_yuna_15"
    },
    "day1_lunch_yuna_15": {
        next: "day1_lunch_yuna_16"
    },
    "day1_lunch_yuna_16": {
        next: "day1_lunch_yuna_17"
    },
    "day1_lunch_yuna_17": {
        next: "day1_lunch_yuna_18"
    },
    "day1_lunch_yuna_18": {
        next: "day1_lunch_yuna_19"
    },
    "day1_lunch_yuna_19": {
        next: "day1_lunch_yuna_20"
    },
    "day1_lunch_yuna_20": {
        next: "day1_lunch_yuna_21"
    },
    "day1_lunch_yuna_21": {
        next: "day1_lunch_yuna_22"
    },
    "day1_lunch_yuna_22": {
        next: "day1_lunch_yuna_23"
    },
    "day1_lunch_yuna_23": {
        next: "day1_lunch_yuna_24"
    },
    "day1_lunch_yuna_24": {
        next: "day1_lunch_yuna_25"
    },
    "day1_lunch_yuna_25": {
        next: "day1_lunch_yuna_26"
    },
    "day1_lunch_yuna_26": {
        next: "day1_lunch_yuna_27"
    },
    "day1_lunch_yuna_27": {
        next: "day1_lunch_yuna_28"
    },
    "day1_lunch_yuna_28": {
        next: "day1_lunch_yuna_29"
    },
    "day1_lunch_yuna_29": {
        next: "day1_lunch_yuna_30",
        stats: { yuna: { affinity: 5, trust: 3 } }
    },
    "day1_lunch_yuna_30": {
        character: null,
        next: "day1_lunch_end"
    },

    // ===== 루트 C: 보건실 — 리인 첫 만남 (riin_1 ~ riin_27) =====
    "day1_lunch_riin_1": {
        background: "nurse_office",
        character: null,
        next: "day1_lunch_riin_2"
    },
    "day1_lunch_riin_2": {
        next: "day1_lunch_riin_3"
    },
    "day1_lunch_riin_3": {
        next: "day1_lunch_riin_4"
    },
    "day1_lunch_riin_4": {
        character: "riin_smile",
        next: "day1_lunch_riin_5",
        setFlags: ["met_riin"]
    },
    "day1_lunch_riin_5": {
        next: "day1_lunch_riin_6"
    },
    "day1_lunch_riin_6": {
        next: "day1_lunch_riin_7"
    },
    "day1_lunch_riin_7": {
        next: "day1_lunch_riin_8"
    },
    "day1_lunch_riin_8": {
        next: "day1_lunch_riin_9"
    },
    "day1_lunch_riin_9": {
        next: "day1_lunch_riin_10"
    },
    "day1_lunch_riin_10": {
        next: "day1_lunch_riin_11"
    },
    "day1_lunch_riin_11": {
        next: "day1_lunch_riin_12"
    },
    "day1_lunch_riin_12": {
        next: "day1_lunch_riin_13"
    },
    "day1_lunch_riin_13": {
        next: "day1_lunch_riin_14"
    },
    "day1_lunch_riin_14": {
        next: "day1_lunch_riin_15"
    },
    "day1_lunch_riin_15": {
        next: "day1_lunch_riin_16"
    },
    "day1_lunch_riin_16": {
        next: "day1_lunch_riin_17"
    },
    "day1_lunch_riin_17": {
        next: "day1_lunch_riin_18"
    },
    "day1_lunch_riin_18": {
        next: "day1_lunch_riin_19"
    },
    "day1_lunch_riin_19": {
        next: "day1_lunch_riin_20"
    },
    "day1_lunch_riin_20": {
        next: "day1_lunch_riin_21"
    },
    "day1_lunch_riin_21": {
        next: "day1_lunch_riin_22"
    },
    "day1_lunch_riin_22": {
        next: "day1_lunch_riin_23"
    },
    "day1_lunch_riin_23": {
        next: "day1_lunch_riin_24"
    },
    "day1_lunch_riin_24": {
        next: "day1_lunch_riin_25"
    },
    "day1_lunch_riin_25": {
        next: "day1_lunch_riin_26"
    },
    "day1_lunch_riin_26": {
        next: "day1_lunch_riin_27",
        stats: { riin: { affinity: 5, danger: 5 } }
    },
    "day1_lunch_riin_27": {
        character: null,
        next: "day1_lunch_end"
    },

    // ===== 루트 D: 옥상에서 혼자 (alone_1 ~ alone_13) =====
    "day1_lunch_alone_1": {
        background: "rooftop",
        character: null,
        next: "day1_lunch_alone_2"
    },
    "day1_lunch_alone_2": {
        next: "day1_lunch_alone_3"
    },
    "day1_lunch_alone_3": {
        next: "day1_lunch_alone_4"
    },
    "day1_lunch_alone_4": {
        next: "day1_lunch_alone_5"
    },
    "day1_lunch_alone_5": {
        next: "day1_lunch_alone_6"
    },
    "day1_lunch_alone_6": {
        next: "day1_lunch_alone_7"
    },
    "day1_lunch_alone_7": {
        next: "day1_lunch_alone_8"
    },
    "day1_lunch_alone_8": {
        next: "day1_lunch_alone_9"
    },
    "day1_lunch_alone_9": {
        next: "day1_lunch_alone_10"
    },
    "day1_lunch_alone_10": {
        next: "day1_lunch_alone_11"
    },
    "day1_lunch_alone_11": {
        next: "day1_lunch_alone_12"
    },
    "day1_lunch_alone_12": {
        next: "day1_lunch_alone_13"
    },
    "day1_lunch_alone_13": {
        next: "day1_lunch_end"
    },

    // ===== 점심 종료 =====
    "day1_lunch_end": {
        background: "classroom",
        character: null,
        changeSlot: "afterschool",
        next: "day1_after_start"
    }
});
