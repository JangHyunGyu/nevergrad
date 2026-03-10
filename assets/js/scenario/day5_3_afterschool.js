/**
 * Day 5-3: Afterschool - 클라이맥스. 탈출 성공/붙잡힘/잔류 분기.
 * BGM: climax.mp3 / horror_ambient.mp3 / ending_dark.mp3
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    "day5_after_start": {
        background: "black",
        bgm: "climax.mp3",
        character: null,
        next: "day5_after_branch"
    },

    // ── 메인 분기: 탈출 성공 vs 붙잡힘 vs 잔류 ──
    "day5_after_branch": {
        branches: [
            { condition: "broke_through_eunsu", next: "day5_after_escaped" },
            { condition: "caught_by_sea", next: "day5_after_captured" },
            { condition: "caught_by_riin", next: "day5_after_captured" },
            { condition: "stayed_with_eunsu", next: "day5_after_stayed" }
        ],
        next: "day5_after_captured"
    },

    // ══════════════════════════════════════
    // A) 탈출 성공 루트
    // ══════════════════════════════════════
    "day5_after_escaped": {
        background: "exit_door",
        character: null,
        rain: true,
        next: "day5_after_escaped_2"
    },
    "day5_after_escaped_2": {
        next: "day5_after_escaped_3"
    },
    "day5_after_escaped_3": {
        next: "day5_after_escaped_4"
    },
    "day5_after_escaped_4": {
        next: "day5_after_escaped_5"
    },
    "day5_after_escaped_5": {
        next: "day5_after_escaped_6"
    },
    "day5_after_escaped_6": {
        next: "day5_after_escaped_7"
    },
    "day5_after_escaped_7": {
        next: "day5_after_escaped_8"
    },
    "day5_after_escaped_8": {
        next: "day5_after_escaped_yuna_branch"
    },

    // ── 유나 동행 여부 분기 ──
    "day5_after_escaped_yuna_branch": {
        branches: [
            { condition: "escape_with_yuna", next: "day5_after_escaped_yuna" }
        ],
        next: "day5_after_escaped_solo"
    },
    "day5_after_escaped_yuna": {
        character: "yuna_determined",
        next: "day5_after_escaped_yuna_2"
    },
    "day5_after_escaped_yuna_2": {
        next: "day5_after_escaped_yuna_3"
    },
    "day5_after_escaped_yuna_3": {
        next: "day5_after_escaped_yuna_4"
    },
    "day5_after_escaped_yuna_4": {
        next: "day5_after_escaped_yuna_5"
    },
    "day5_after_escaped_yuna_5": {
        next: "day5_after_escaped_choice"
    },
    "day5_after_escaped_solo": {
        character: null,
        next: "day5_after_escaped_solo_2"
    },
    "day5_after_escaped_solo_2": {
        next: "day5_after_escaped_choice"
    },

    // ── 증거 공개 방법 선택 ──
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
        glitch: { noise: true },
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // B) 붙잡힌 루트
    // ══════════════════════════════════════
    "day5_after_captured": {
        background: "old_building",
        bgm: "horror_ambient.mp3",
        character: null,
        glitch: { heavyGlitch: true },
        next: "day5_after_captured_2"
    },
    "day5_after_captured_2": {
        next: "day5_after_captured_3"
    },
    "day5_after_captured_3": {
        next: "day5_after_captured_4"
    },
    "day5_after_captured_4": {
        next: "day5_after_captured_5"
    },
    "day5_after_captured_5": {
        character: "eunsu_obsessed",
        next: "day5_after_captured_6"
    },
    "day5_after_captured_6": {
        next: "day5_after_captured_7"
    },
    "day5_after_captured_7": {
        character: "riin_dark",
        next: "day5_after_captured_8"
    },
    "day5_after_captured_8": {
        next: "day5_after_captured_9"
    },
    "day5_after_captured_9": {
        next: "day5_after_captured_10"
    },
    "day5_after_captured_10": {
        next: "day5_after_captured_choice"
    },
    "day5_after_captured_choice": {
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

    // ── 저항 → 설화 개입 ──
    "day5_after_captured_resist": {
        glitch: { heavyGlitch: true },
        unskippable: true,
        next: "day5_after_captured_resist_2"
    },
    "day5_after_captured_resist_2": {
        next: "day5_after_captured_resist_3"
    },
    "day5_after_captured_resist_3": {
        next: "day5_after_captured_resist_4"
    },
    "day5_after_captured_resist_4": {
        glitch: { heavy: true },
        unskippable: true,
        next: "day5_after_captured_resist_5"
    },
    "day5_after_captured_resist_5": {
        next: "day5_after_captured_resist_6"
    },
    "day5_after_captured_resist_6": {
        next: "day5_after_captured_resist_7"
    },
    "day5_after_captured_resist_7": {
        character: "seolhwa_fading",
        glitch: { silence: true, silenceDuration: 3000 },
        unskippable: true,
        next: "day5_after_captured_resist_8"
    },
    "day5_after_captured_resist_8": {
        next: "day5_after_captured_resist_9"
    },
    "day5_after_captured_resist_9": {
        character: null,
        next: "day5_after_end",
        setFlags: ["seolhwa_intervention"]
    },

    // ── 받아들임 → 약물 투여 ──
    "day5_after_captured_submit": {
        character: "riin_smile",
        next: "day5_after_captured_submit_2"
    },
    "day5_after_captured_submit_2": {
        next: "day5_after_captured_submit_3"
    },
    "day5_after_captured_submit_3": {
        unskippable: true,
        next: "day5_after_captured_submit_4"
    },
    "day5_after_captured_submit_4": {
        glitch: { heavyGlitch: true, drugBlur: true },
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // C) 은수와 남은 루트
    // ══════════════════════════════════════
    "day5_after_stayed": {
        background: "classroom",
        bgm: "ending_dark.mp3",
        character: "eunsu_gentle",
        next: "day5_after_stayed_2"
    },
    "day5_after_stayed_2": {
        next: "day5_after_stayed_3"
    },
    "day5_after_stayed_3": {
        next: "day5_after_stayed_4"
    },
    "day5_after_stayed_4": {
        next: "day5_after_stayed_5"
    },
    "day5_after_stayed_5": {
        next: "day5_after_stayed_6"
    },
    "day5_after_stayed_6": {
        next: "day5_after_stayed_7"
    },
    "day5_after_stayed_7": {
        character: "eunsu_obsessed",
        typingSpeed: 100,
        unskippable: true,
        next: "day5_after_stayed_8"
    },
    "day5_after_stayed_8": {
        next: "day5_after_stayed_9"
    },
    "day5_after_stayed_9": {
        next: "day5_after_stayed_10"
    },
    "day5_after_stayed_10": {
        next: "day5_after_end"
    },

    "day5_after_end": {
        character: null,
        changeSlot: "night",
        next: "day5_night_start"
    }
});
