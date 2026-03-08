/**
 * Day 5-3: Afterschool - 클라이맥스. 각 캐릭터의 진실 대면.
 * 탈출 성공/실패 분기에 따른 다른 전개.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    "day5_after_start": {
        background: "classroom",
        bgm: "climax.mp3",
        character: null,
        next: "day5_after_branch"
    },

    // ── 메인 분기: 탈출 성공 vs 실패 vs 잔류 ──
    "day5_after_branch": {
        next: "day5_after_escaped",
        condition: "broke_through_eunsu"
    },
    "day5_after_branch_caught": {
        next: "day5_after_captured",
        condition: "caught_by_sea"
    },
    "day5_after_branch_caught_2": {
        next: "day5_after_captured",
        condition: "caught_by_riin"
    },
    "day5_after_branch_stayed": {
        next: "day5_after_stayed",
        condition: "stayed_with_eunsu"
    },

    // ══════════════════════════════════════
    // A) 탈출 성공 루트
    // ══════════════════════════════════════
    "day5_after_escaped": {
        background: "outside_school",
        character: null,
        next: "day5_after_escaped_2"
    },
    "day5_after_escaped_2": {
        next: "day5_after_escaped_3"
    },
    "day5_after_escaped_3": {
        next: "day5_after_escaped_branch",
        condition: "escape_with_yuna"
    },
    "day5_after_escaped_solo": {
        next: "day5_after_escaped_4"
    },
    "day5_after_escaped_branch": {
        character: "yuna_determined",
        next: "day5_after_escaped_yuna"
    },
    "day5_after_escaped_yuna": {
        next: "day5_after_escaped_4"
    },
    "day5_after_escaped_4": {
        next: "day5_after_escaped_choice"
    },
    "day5_after_escaped_choice": {
        choices: [
            {
                next: "day5_after_police",
                setFlags: ["called_police"]
            },
            {
                next: "day5_after_expose_online",
                setFlags: ["exposed_online"]
            }
        ]
    },
    "day5_after_police": {
        character: null,
        next: "day5_after_police_2"
    },
    "day5_after_police_2": {
        next: "day5_after_end"
    },
    "day5_after_expose_online": {
        character: null,
        next: "day5_after_expose_2"
    },
    "day5_after_expose_2": {
        glitch: { noise: true, noiseDuration: 300 },
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // B) 붙잡힌 루트
    // ══════════════════════════════════════
    "day5_after_captured": {
        background: "basement",
        bgm: "horror_ambient.mp3",
        character: null,
        glitch: { heavyGlitch: true, glitchDuration: 1000 },
        next: "day5_after_captured_2"
    },
    "day5_after_captured_2": {
        next: "day5_after_captured_3"
    },
    "day5_after_captured_3": {
        character: "eunsu_obsessed",
        next: "day5_after_captured_4"
    },
    "day5_after_captured_4": {
        character: "riin_dark",
        next: "day5_after_captured_5"
    },
    "day5_after_captured_5": {
        timedChoice: 5000,
        choices: [
            {
                next: "day5_after_captured_resist",
                setFlags: ["final_resistance"]
            },
            {
                next: "day5_after_captured_submit"
            }
        ],
        timeoutNext: "day5_after_captured_submit"
    },
    "day5_after_captured_resist": {
        glitch: { heavyGlitch: true, glitchDuration: 1500 },
        next: "day5_after_captured_resist_2"
    },
    "day5_after_captured_resist_2": {
        // 설화가 개입
        character: "seolhwa_ghost",
        glitch: { screenShake: true, shakeDuration: 1000 },
        next: "day5_after_captured_resist_3"
    },
    "day5_after_captured_resist_3": {
        character: null,
        next: "day5_after_end",
        setFlags: ["seolhwa_intervention"]
    },
    "day5_after_captured_submit": {
        character: "riin_smile",
        next: "day5_after_captured_submit_2"
    },
    "day5_after_captured_submit_2": {
        glitch: { heavyGlitch: true, glitchDuration: 2000 },
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // C) 은수와 남은 루트
    // ══════════════════════════════════════
    "day5_after_stayed": {
        background: "faculty_office",
        bgm: "eunsu_dark_theme.mp3",
        character: "eunsu_gentle",
        next: "day5_after_stayed_2"
    },
    "day5_after_stayed_2": {
        next: "day5_after_stayed_3"
    },
    "day5_after_stayed_3": {
        character: "eunsu_obsessed",
        next: "day5_after_stayed_4"
    },
    "day5_after_stayed_4": {
        character: "eunsu_gentle",
        next: "day5_after_end"
    },

    "day5_after_end": {
        character: null,
        changeSlot: "night",
        next: "day5_night_start"
    }
});
