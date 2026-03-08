/**
 * Day 4-4: Night - 탈출 계획 수립, 설화의 완전한 진실
 * 위화감 90%. 나이트메어 모드 전조. 내일의 탈출을 준비.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    "day4_night_start": {
        background: "room_night",
        bgm: "night_tension.mp3",
        character: null,
        next: "day4_night_start_2"
    },
    "day4_night_start_2": {
        next: "day4_night_start_3"
    },
    "day4_night_start_3": {
        next: "day4_night_phone"
    },

    // ── 전화 - 세아/은수의 감시 ──
    "day4_night_phone": {
        next: "day4_night_phone_2"
    },
    "day4_night_phone_2": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_night_phone_3"
    },
    "day4_night_phone_3": {
        next: "day4_night_eunsu_crack"
    },

    // ── ★ 은수 균열 장면 ──
    "day4_night_eunsu_crack": {
        character: null,
        next: "day4_night_eunsu_crack_2"
    },
    "day4_night_eunsu_crack_2": {
        typingSpeed: 80,
        next: "day4_night_eunsu_crack_3"
    },
    "day4_night_eunsu_crack_3": {
        typingSpeed: 120,
        next: "day4_night_eunsu_crack_4"
    },
    "day4_night_eunsu_crack_4": {
        next: "day4_night_eunsu_crack_5"
    },
    "day4_night_eunsu_crack_5": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_night_plan"
    },

    // ── 탈출 계획 ──
    "day4_night_plan": {
        next: "day4_night_plan_2"
    },
    "day4_night_plan_2": {
        next: "day4_night_plan_branch"
    },
    "day4_night_plan_branch": {
        // 증거량에 따른 분기
        next: "day4_night_plan_3",
        condition: "evidence_compiled"
    },
    "day4_night_plan_branch_alt": {
        next: "day4_night_plan_3"
    },
    "day4_night_plan_3": {
        next: "day4_night_plan_choice"
    },
    "day4_night_plan_choice": {
        choices: [
            {
                next: "day4_night_plan_escape",
                setFlags: ["plan_escape_school"]
            },
            {
                next: "day4_night_plan_expose",
                setFlags: ["plan_expose_truth"]
            },
            {
                next: "day4_night_plan_confront",
                setFlags: ["plan_confront_them"]
            }
        ]
    },
    "day4_night_plan_escape": {
        next: "day4_night_seolhwa"
    },
    "day4_night_plan_expose": {
        next: "day4_night_seolhwa"
    },
    "day4_night_plan_confront": {
        next: "day4_night_seolhwa"
    },

    // ── 설화의 완전한 진실 (꿈) — 느린 타이핑 ──
    "day4_night_seolhwa": {
        background: "school_dark",
        bgm: null,
        character: "seolhwa_ghost",
        glitch: { noise: true, noiseDuration: 300 },
        typingSpeed: 100,
        next: "day4_night_seolhwa_2"
    },
    "day4_night_seolhwa_2": {
        typingSpeed: 120,
        next: "day4_night_seolhwa_3"
    },
    "day4_night_seolhwa_3": {
        typingSpeed: 120,
        next: "day4_night_seolhwa_4"
    },
    "day4_night_seolhwa_4": {
        typingSpeed: 100,
        next: "day4_night_seolhwa_5"
    },
    "day4_night_seolhwa_5": {
        typingSpeed: 200,
        unskippable: true,
        next: "day4_night_seolhwa_6",
        stats: { seolhwa: { trust: 20 } }
    },
    "day4_night_seolhwa_6": {
        glitch: { heavyGlitch: true, glitchDuration: 1000 },
        character: null,
        next: "day4_night_seolhwa_7"
    },
    "day4_night_seolhwa_7": {
        next: "day4_night_end"
    },

    "day4_night_end": {
        background: "room_night",
        bgm: null,
        character: null,
        changeDay: 5, changeSlot: "morning",
        next: "day5_morning_start"
    }
});
