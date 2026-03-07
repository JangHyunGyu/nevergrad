/**
 * Day 5-2: Lunch - 탈출 시도, 추격, 선택의 갈림길
 * 위화감 100%. 풀 나이트메어 모드. 타이머 선택지 다수.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    "day5_lunch_start": {
        background: "classroom",
        bgm: "chase.mp3",
        character: null,
        next: "day5_lunch_start_2"
    },
    "day5_lunch_start_2": {
        next: "day5_lunch_branch"
    },

    // ── 유나 합류 or 단독 행동 ──
    "day5_lunch_branch": {
        next: "day5_lunch_yuna_meet",
        condition: "yuna_final_plan"
    },
    "day5_lunch_branch_alt": {
        next: "day5_lunch_solo"
    },

    // ── 유나와 합류 ──
    "day5_lunch_yuna_meet": {
        background: "old_building",
        character: "yuna_determined",
        next: "day5_lunch_yuna_2"
    },
    "day5_lunch_yuna_2": {
        next: "day5_lunch_yuna_3"
    },
    "day5_lunch_yuna_3": {
        next: "day5_lunch_yuna_4"
    },
    "day5_lunch_yuna_4": {
        next: "day5_lunch_escape_start",
        setFlags: ["escape_with_yuna"]
    },

    // ── 단독 행동 ──
    "day5_lunch_solo": {
        background: "corridor",
        character: null,
        next: "day5_lunch_solo_2"
    },
    "day5_lunch_solo_2": {
        next: "day5_lunch_escape_start"
    },

    // ── 탈출 시퀀스 ──
    "day5_lunch_escape_start": {
        background: "corridor_dark",
        bgm: "chase_intense.mp3",
        character: null,
        next: "day5_lunch_escape_2"
    },
    "day5_lunch_escape_2": {
        timedChoice: 5000,
        glitch: { screenShake: true, shakeDuration: 200 },
        choices: [
            {
                next: "day5_lunch_escape_left"
            },
            {
                next: "day5_lunch_escape_right"
            }
        ],
        timeoutNext: "day5_lunch_escape_caught_sea"
    },

    // ── 왼쪽 복도 (세아 조우) ──
    "day5_lunch_escape_left": {
        character: "sea_yandere",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day5_lunch_sea_block"
    },
    "day5_lunch_sea_block": {
        next: "day5_lunch_sea_block_2"
    },
    "day5_lunch_sea_block_2": {
        timedChoice: 4000,
        choices: [
            {
                next: "day5_lunch_sea_push",
                stats: { sea: { danger: 10 } }
            },
            {
                next: "day5_lunch_sea_talk",
                stats: { sea: { trust: 5 } }
            }
        ],
        timeoutNext: "day5_lunch_escape_caught_sea"
    },
    "day5_lunch_sea_push": {
        next: "day5_lunch_continue",
        setFlags: ["pushed_sea"]
    },
    "day5_lunch_sea_talk": {
        character: "sea_cry",
        next: "day5_lunch_sea_talk_2"
    },
    "day5_lunch_sea_talk_2": {
        next: "day5_lunch_continue",
        setFlags: ["sea_let_go"]
    },

    // ── 오른쪽 복도 (리인 조우) ──
    "day5_lunch_escape_right": {
        character: "riin_dark",
        next: "day5_lunch_riin_block"
    },
    "day5_lunch_riin_block": {
        next: "day5_lunch_riin_block_2"
    },
    "day5_lunch_riin_block_2": {
        timedChoice: 4000,
        choices: [
            {
                next: "day5_lunch_riin_dodge"
            },
            {
                next: "day5_lunch_riin_confront"
            }
        ],
        timeoutNext: "day5_lunch_escape_caught_riin"
    },
    "day5_lunch_riin_dodge": {
        next: "day5_lunch_continue"
    },
    "day5_lunch_riin_confront": {
        character: "riin_cold",
        next: "day5_lunch_riin_confront_2"
    },
    "day5_lunch_riin_confront_2": {
        next: "day5_lunch_continue",
        setFlags: ["riin_hesitated"]
    },

    // ── 붙잡힘 분기 ──
    "day5_lunch_escape_caught_sea": {
        character: "sea_yandere",
        glitch: { heavyGlitch: true, glitchDuration: 800 },
        next: "day5_lunch_caught",
        setFlags: ["caught_by_sea"]
    },
    "day5_lunch_escape_caught_riin": {
        character: "riin_dark",
        glitch: { heavyGlitch: true, glitchDuration: 800 },
        next: "day5_lunch_caught",
        setFlags: ["caught_by_riin"]
    },
    "day5_lunch_caught": {
        character: null,
        next: "day5_lunch_end"
    },

    // ── 계속 진행 ──
    "day5_lunch_continue": {
        background: "stairway",
        character: null,
        next: "day5_lunch_continue_2"
    },
    "day5_lunch_continue_2": {
        // 은수 최종 대면
        character: "eunsu_obsessed",
        glitch: { screenShake: true, shakeDuration: 500, noise: true, noiseDuration: 500 },
        next: "day5_lunch_eunsu_final"
    },
    "day5_lunch_eunsu_final": {
        next: "day5_lunch_eunsu_final_2"
    },
    "day5_lunch_eunsu_final_2": {
        timedChoice: 5000,
        choices: [
            {
                next: "day5_lunch_eunsu_break",
                setFlags: ["broke_through_eunsu"]
            },
            {
                next: "day5_lunch_eunsu_stay"
            }
        ],
        timeoutNext: "day5_lunch_eunsu_stay"
    },
    "day5_lunch_eunsu_break": {
        character: null,
        next: "day5_lunch_breakthrough",
        glitch: { heavyGlitch: true, glitchDuration: 500 }
    },
    "day5_lunch_eunsu_stay": {
        character: "eunsu_gentle",
        next: "day5_lunch_eunsu_stay_2"
    },
    "day5_lunch_eunsu_stay_2": {
        next: "day5_lunch_end",
        setFlags: ["stayed_with_eunsu"]
    },

    "day5_lunch_breakthrough": {
        background: "exit_door",
        character: null,
        next: "day5_lunch_end"
    },

    "day5_lunch_end": {
        character: null,
        next: null
    }
});
