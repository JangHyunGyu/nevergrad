/**
 * Day 2-1: Morning - 달콤한 감시의 시작
 * 로맨스 90%, 위화감 10%. 세아의 밀착, 은수의 관심 강화.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    "day2_morning_start": {
        background: "home",
        bgm: "morning_bright.mp3",
        character: null,
        next: "day2_morning_2"
    },
    "day2_morning_2": {
        next: "day2_morning_3"
    },
    "day2_morning_3": {
        background: "school_gate",
        next: "day2_morning_sea_wait"
    },
    "day2_morning_sea_wait": {
        character: "sea_smile",
        next: "day2_morning_sea_2"
    },
    "day2_morning_sea_2": {
        next: "day2_morning_sea_3",
        stats: { sea: { affinity: 3, danger: 5 } }
    },
    "day2_morning_sea_3": {
        character: null,
        next: "day2_morning_classroom"
    },
    "day2_morning_classroom": {
        background: "classroom",
        character: "eunsu_smile",
        next: "day2_morning_eunsu_1"
    },
    "day2_morning_eunsu_1": {
        next: "day2_morning_eunsu_2"
    },
    "day2_morning_eunsu_2": {
        character: null,
        next: "day2_morning_eunsu_3"
    },
    "day2_morning_eunsu_3": {
        next: "day2_morning_seolhwa_check",
        stats: { eunsu: { danger: 3 } }
    },

    // 설화 확인 (인사했었다면)
    "day2_morning_seolhwa_check": {
        branches: [
            { condition: "greeted_seolhwa", next: "day2_morning_seolhwa" },
            { next: "day2_morning_seolhwa_skip" }
        ]
    },
    "day2_morning_seolhwa": {
        character: null,
        next: "day2_morning_seolhwa_2"
    },
    "day2_morning_seolhwa_2": {
        next: "day2_morning_seolhwa_3"
    },
    "day2_morning_seolhwa_3": {
        next: "day2_morning_end"
    },
    "day2_morning_seolhwa_skip": {
        next: "day2_morning_end"
    },

    "day2_morning_end": {
        background: "classroom",
        character: null,
        next: null // → day2_2_lunch
    }
});
