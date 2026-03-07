/**
 * Day 1-2: Lunch - 점심시간의 달콤한 만남들
 * 순수 미연시 톤 유지. 유나 첫 만남, 리인 보건실.
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
            { next: "day1_lunch_sea", setFlags: ["lunch_with_sea"] },
            { next: "day1_lunch_yuna_start" },
            { next: "day1_lunch_nurse_start" },
            { next: "day1_lunch_alone" }
        ]
    },

    // ===== 세아와 점심 =====
    "day1_lunch_sea": {
        background: "classroom",
        character: "sea_smile",
        next: "day1_lunch_sea_2",
        stats: { sea: { affinity: 5 } }
    },
    "day1_lunch_sea_2": {
        next: "day1_lunch_sea_3"
    },
    "day1_lunch_sea_3": {
        character: "sea_shy",
        next: "day1_lunch_sea_4"
    },
    "day1_lunch_sea_4": {
        next: "day1_lunch_sea_5"
    },
    "day1_lunch_sea_5": {
        character: "sea_smile",
        next: "day1_lunch_sea_6",
        stats: { sea: { affinity: 3, danger: 2 } }
    },
    "day1_lunch_sea_6": {
        character: null,
        next: "day1_lunch_end"
    },

    // ===== 도서관 - 유나 첫 만남 =====
    "day1_lunch_yuna_start": {
        background: "library",
        character: null,
        next: "day1_lunch_yuna_1"
    },
    "day1_lunch_yuna_1": {
        next: "day1_lunch_yuna_2"
    },
    "day1_lunch_yuna_2": {
        character: "yuna_scared",
        next: "day1_lunch_yuna_3",
        setFlags: ["met_yuna"]
    },
    "day1_lunch_yuna_3": {
        character: null,
        next: "day1_lunch_yuna_4"
    },
    "day1_lunch_yuna_4": {
        next: "day1_lunch_yuna_5"
    },
    "day1_lunch_yuna_5": {
        character: "yuna_smile",
        next: "day1_lunch_yuna_6",
        stats: { yuna: { affinity: 5, trust: 3 } }
    },
    "day1_lunch_yuna_6": {
        character: null,
        next: "day1_lunch_end"
    },

    // ===== 보건실 - 리인 첫 만남 =====
    "day1_lunch_nurse_start": {
        background: "nurse_office",
        character: null,
        next: "day1_lunch_riin_1"
    },
    "day1_lunch_riin_1": {
        character: "riin_smile",
        next: "day1_lunch_riin_2",
        setFlags: ["met_riin"]
    },
    "day1_lunch_riin_2": {
        next: "day1_lunch_riin_3"
    },
    "day1_lunch_riin_3": {
        character: "riin_seductive",
        next: "day1_lunch_riin_4",
        // "심장 소리가 듣기 좋다" — 표면상 장난, 내면은 데이터 수집
        stats: { riin: { affinity: 5, danger: 5 } }
    },
    "day1_lunch_riin_4": {
        character: null,
        next: "day1_lunch_riin_5"
    },
    "day1_lunch_riin_5": {
        character: "riin_smile",
        next: "day1_lunch_end",
        stats: { riin: { affinity: 3 } }
    },

    // ===== 혼자 점심 =====
    "day1_lunch_alone": {
        background: "rooftop",
        character: null,
        next: "day1_lunch_alone_2"
    },
    "day1_lunch_alone_2": {
        next: "day1_lunch_alone_3"
    },
    "day1_lunch_alone_3": {
        // 옥상에서 혼자 있는데, 아래 운동장에서 누군가 카메라를 들고 이쪽을 찍고 있다
        next: "day1_lunch_end"
    },

    // ===== 점심 종료 =====
    "day1_lunch_end": {
        background: "classroom",
        character: null,
        next: null // → day1_3_afterschool
    }
});
