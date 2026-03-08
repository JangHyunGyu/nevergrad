/**
 * Day 1-3: Afterschool - 방과후 선택
 * 각 캐릭터와 1:1 시간. 여전히 순수 미연시.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    "day1_after_start": {
        background: "classroom",
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

    // ===== 세아 - 학생회실 =====
    "day1_after_sea": {
        background: "classroom",
        character: "sea_smile",
        sunset: true,
        next: "day1_after_sea_2",
        stats: { sea: { affinity: 5 } }
    },
    "day1_after_sea_2": {
        character: "sea_shy",
        next: "day1_after_sea_3"
    },
    "day1_after_sea_3": {
        next: "day1_after_sea_4"
    },
    "day1_after_sea_4": {
        character: "sea_smile",
        next: "day1_after_sea_5",
        stats: { sea: { affinity: 3, danger: 3 } }
    },
    "day1_after_sea_5": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 유나 - 도서관 =====
    "day1_after_yuna": {
        background: "library",
        character: "yuna_normal",
        sunset: true,
        next: "day1_after_yuna_2"
    },
    "day1_after_yuna_2": {
        character: "yuna_smile",
        next: "day1_after_yuna_3",
        stats: { yuna: { affinity: 5, trust: 3 } }
    },
    "day1_after_yuna_3": {
        character: "yuna_normal",
        next: "day1_after_yuna_4"
    },
    "day1_after_yuna_4": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 리인 - 보건실 =====
    "day1_after_riin": {
        background: "nurse_office",
        character: "riin_smile",
        sunset: true,
        next: "day1_after_riin_2"
    },
    "day1_after_riin_2": {
        character: "riin_seductive",
        next: "day1_after_riin_3",
        stats: { riin: { affinity: 5, danger: 3 } }
    },
    "day1_after_riin_3": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 은수 - 교무실 =====
    "day1_after_eunsu": {
        background: "teacher_office",
        character: "eunsu_smile",
        sunset: true,
        next: "day1_after_eunsu_2"
    },
    "day1_after_eunsu_2": {
        next: "day1_after_eunsu_3",
        stats: { eunsu: { affinity: 5 } }
    },
    "day1_after_eunsu_3": {
        character: "eunsu_shy",
        next: "day1_after_eunsu_4",
        stats: { eunsu: { danger: 3 } }
    },
    "day1_after_eunsu_4": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 바로 귀가 =====
    "day1_after_home": {
        background: "school_gate",
        character: null,
        sunset: true,
        next: "day1_after_home_2"
    },
    "day1_after_home_2": {
        next: "day1_after_end"
    },

    "day1_after_end": {
        background: "street",
        character: null,
        sunset: true,
        changeSlot: "night",
        next: "day1_night_start"
    }
});
