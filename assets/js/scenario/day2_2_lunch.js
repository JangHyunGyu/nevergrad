/**
 * Day 2-2: Lunch - 다가오는 여자들, 이상한 장면 하나
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    "day2_lunch_start": {
        background: "classroom",
        bgm: "daily_bright.mp3",
        character: null,
        next: "day2_lunch_choice"
    },
    "day2_lunch_choice": {
        choices: [
            { next: "day2_lunch_sea" },
            { next: "day2_lunch_yuna", condition: "met_yuna" },
            { next: "day2_lunch_riin", condition: "met_riin" },
            { next: "day2_lunch_rooftop" }
        ]
    },

    // 세아 점심 — "너는 내 거야" 핀
    "day2_lunch_sea": {
        background: "classroom",
        character: "sea_smile",
        next: "day2_lunch_sea_2",
        stats: { sea: { affinity: 5 } }
    },
    "day2_lunch_sea_2": {
        character: "sea_shy",
        next: "day2_lunch_sea_3"
    },
    "day2_lunch_sea_3": {
        next: "day2_lunch_sea_4",
        stats: { sea: { danger: 5 } }
    },
    "day2_lunch_sea_4": {
        character: null,
        next: "day2_lunch_end"
    },

    // 유나 — 사진 한 장 더
    "day2_lunch_yuna": {
        background: "library",
        character: "yuna_smile",
        next: "day2_lunch_yuna_2",
        stats: { yuna: { affinity: 5, trust: 5 } }
    },
    "day2_lunch_yuna_2": {
        character: "yuna_scared",
        next: "day2_lunch_yuna_3"
    },
    "day2_lunch_yuna_3": {
        character: "yuna_smile",
        next: "day2_lunch_end"
    },

    // 리인 — 건강검진 명목의 접근
    "day2_lunch_riin": {
        background: "nurse_office",
        character: "riin_smile",
        next: "day2_lunch_riin_2"
    },
    "day2_lunch_riin_2": {
        character: "riin_seductive",
        next: "day2_lunch_riin_3",
        stats: { riin: { affinity: 3, danger: 5 } }
    },
    "day2_lunch_riin_3": {
        character: null,
        next: "day2_lunch_end"
    },

    // 옥상 혼자 — 복도에서 이상한 장면 목격
    "day2_lunch_rooftop": {
        background: "hallway",
        character: null,
        next: "day2_lunch_rooftop_2"
    },
    "day2_lunch_rooftop_2": {
        next: "day2_lunch_rooftop_3"
    },
    "day2_lunch_rooftop_3": {
        background: "rooftop",
        next: "day2_lunch_end"
    },

    "day2_lunch_end": {
        background: "classroom",
        character: null,
        next: null
    }
});
