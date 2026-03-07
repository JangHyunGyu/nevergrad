/**
 * Day 1-4: Night - 달콤한 회상, 미세한 불안
 * 집에서 하루를 돌아봄. 100% 미연시 톤.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    "day1_night_start": {
        background: "home",
        bgm: "night_calm.mp3",
        character: null,
        night: true,
        next: "day1_night_2"
    },
    "day1_night_2": {
        night: true,
        next: "day1_night_3"
    },
    "day1_night_3": {
        night: true,
        next: "day1_night_phone"
    },
    "day1_night_phone": {
        night: true,
        next: "day1_night_phone_2"
    },
    "day1_night_phone_2": {
        night: true,
        next: "day1_night_sleep"
    },
    "day1_night_sleep": {
        night: true,
        next: "day1_night_sleep_2"
    },
    "day1_night_sleep_2": {
        background: "black",
        next: "day1_night_end"
    },
    "day1_night_end": {
        background: "black",
        next: null // → day2_1_morning
    }
});
