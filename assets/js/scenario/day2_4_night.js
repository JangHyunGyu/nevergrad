/**
 * Day 2-4: Night - 이상한 꿈, 전 학교 연락 두절 확인
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    "day2_night_start": {
        background: "home",
        bgm: "night_calm.mp3",
        character: null,
        night: true,
        next: "day2_night_2"
    },
    "day2_night_2": {
        night: true,
        next: "day2_night_3"
    },
    "day2_night_3": {
        night: true,
        next: "day2_night_4"
    },
    "day2_night_4": {
        night: true,
        next: "day2_night_dream"
    },
    // 꿈 시퀀스
    "day2_night_dream": {
        background: "black",
        bgm: null,
        glitch: { noise: true, noiseDuration: 200 },
        next: "day2_night_dream_2"
    },
    "day2_night_dream_2": {
        background: "hallway",
        night: true,
        next: "day2_night_dream_3"
    },
    "day2_night_dream_3": {
        character: "seolhwa_fade",
        next: "day2_night_dream_4"
    },
    "day2_night_dream_4": {
        background: "black",
        character: null,
        next: "day2_night_wake"
    },
    "day2_night_wake": {
        background: "home",
        next: "day2_night_end"
    },
    "day2_night_end": {
        background: "black",
        next: null // → day3
    }
});
