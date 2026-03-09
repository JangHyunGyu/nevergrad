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

    // ── 왼쪽 복도 (세아 조우) — 과거 선택 콜백 → 호감도 분기 ──
    "day5_lunch_escape_left": {
        character: "sea_yandere",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day5_lunch_sea_callback"
    },
    // ★ 과거 선택 콜백
    "day5_lunch_sea_callback": {
        character: "sea_yandere",
        // Past choice determines dialogue line
        branches: [
            { condition: "day2_sea_vulnerability", next: "day5_lunch_sea_cb_promise" },
            { condition: "day1_lunch_sea", next: "day5_lunch_sea_cb_lunch" },
            { condition: "day1_choco_accept", next: "day5_lunch_sea_cb_choco" }
        ],
        next: "day5_lunch_sea_cb_default"
    },
    "day5_lunch_sea_cb_choco": { next: "day5_lunch_sea_block_route" },
    "day5_lunch_sea_cb_lunch": { next: "day5_lunch_sea_block_route" },
    "day5_lunch_sea_cb_promise": { next: "day5_lunch_sea_block_route" },
    "day5_lunch_sea_cb_default": { next: "day5_lunch_sea_block_route" },
    // ★ 세아 호감도에 따라 난이도 변화
    "day5_lunch_sea_block_route": {
        affinityChar: "sea",
        affinityBranches: [
            { minAffinity: 60, next: "day5_lunch_sea_block_max" },
            { minAffinity: 40, next: "day5_lunch_sea_block_high" },
            { minAffinity: 20, next: "day5_lunch_sea_block" },
            { minAffinity: 0,  next: "day5_lunch_sea_pass" }
        ]
    },
    // LOW: 세아가 멍하니 서있음 → 바로 통과
    "day5_lunch_sea_pass": {
        character: "sea_sad",
        next: "day5_lunch_continue"
    },
    // MID: 기존 조우 (4초 타이머)
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
    // HIGH: 세아가 팔을 잡음 (3초 타이머)
    "day5_lunch_sea_block_high": {
        next: "day5_lunch_sea_block_high_2"
    },
    "day5_lunch_sea_block_high_2": {
        timedChoice: 3000,
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
    // MAX: 세아가 문을 잠금 + forceChoice (설득만 가능)
    "day5_lunch_sea_block_max": {
        glitch: { screenShake: true, shakeDuration: 300 },
        next: "day5_lunch_sea_block_max_2"
    },
    "day5_lunch_sea_block_max_2": {
        // 밀치기 선택지가 설득으로 강제 변환
        glitch: { forceChoice: 1 },
        choices: [
            {
                next: "day5_lunch_sea_talk",
                stats: { sea: { trust: 5 } }
            },
            {
                next: "day5_lunch_sea_talk",
                stats: { sea: { trust: 5 } }
            }
        ]
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

    // ── 오른쪽 복도 (리인 조우) — 과거 선택 콜백 ──
    "day5_lunch_escape_right": {
        character: "riin_dark",
        next: "day5_lunch_riin_callback"
    },
    // ★ 과거 선택 콜백
    "day5_lunch_riin_callback": {
        character: "riin_dark",
        branches: [
            { condition: "drank_riin_drink", next: "day5_lunch_riin_cb_drink" },
            { condition: "met_riin", next: "day5_lunch_riin_cb_met" }
        ],
        next: "day5_lunch_riin_cb_default"
    },
    "day5_lunch_riin_cb_drink": { next: "day5_lunch_riin_block" },
    "day5_lunch_riin_cb_met": { next: "day5_lunch_riin_block" },
    "day5_lunch_riin_cb_default": { next: "day5_lunch_riin_block" },
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
        // ★ 은수 호감도에 따라 난이도 변화
        character: "eunsu_obsessed",
        glitch: { screenShake: true, shakeDuration: 500, noise: true, noiseDuration: 500 },
        affinityChar: "eunsu",
        affinityBranches: [
            { minAffinity: 60, next: "day5_lunch_eunsu_final_max" },
            { minAffinity: 40, next: "day5_lunch_eunsu_final_high" },
            { minAffinity: 0,  next: "day5_lunch_eunsu_final" }
        ]
    },
    // LOW/MID: 기존 대면 — 과거 선택 콜백 → 5초 타이머
    "day5_lunch_eunsu_final": {
        next: "day5_lunch_eunsu_callback"
    },
    // ★ 과거 선택 콜백
    "day5_lunch_eunsu_callback": {
        branches: [
            { condition: "installed_safety_app", next: "day5_lunch_eunsu_cb_app" },
            { condition: "visited_eunsu_d1", next: "day5_lunch_eunsu_cb_visit" }
        ],
        next: "day5_lunch_eunsu_cb_default"
    },
    "day5_lunch_eunsu_cb_app": { next: "day5_lunch_eunsu_final_2" },
    "day5_lunch_eunsu_cb_visit": { next: "day5_lunch_eunsu_final_2" },
    "day5_lunch_eunsu_cb_default": { next: "day5_lunch_eunsu_final_2" },
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
    // HIGH: 추가 설득 — 과거 선택 콜백 → 짧은 타이머 (3초)
    "day5_lunch_eunsu_final_high": {
        next: "day5_lunch_eunsu_high_callback"
    },
    // ★ 과거 선택 콜백 (HIGH)
    "day5_lunch_eunsu_high_callback": {
        branches: [
            { condition: "installed_safety_app", next: "day5_lunch_eunsu_high_cb_app" },
            { condition: "visited_eunsu_d1", next: "day5_lunch_eunsu_high_cb_visit" }
        ],
        next: "day5_lunch_eunsu_high_cb_default"
    },
    "day5_lunch_eunsu_high_cb_app": { next: "day5_lunch_eunsu_final_high_2" },
    "day5_lunch_eunsu_high_cb_visit": { next: "day5_lunch_eunsu_final_high_2" },
    "day5_lunch_eunsu_high_cb_default": { next: "day5_lunch_eunsu_final_high_2" },
    "day5_lunch_eunsu_final_high_2": {
        timedChoice: 3000,
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
    // MAX: 비상구 잠김 → 유나 동행 시에만 돌파 가능
    "day5_lunch_eunsu_final_max": {
        glitch: { heavyGlitch: true, glitchDuration: 800 },
        typingSpeed: 100,
        next: "day5_lunch_eunsu_final_max_2"
    },
    "day5_lunch_eunsu_final_max_2": {
        typingSpeed: 150,
        unskippable: true,
        // 유나가 함께하면 교란으로 돌파, 아니면 잡힘
        branches: [
            { condition: "escape_with_yuna", next: "day5_lunch_eunsu_yuna_help" }
        ],
        next: "day5_lunch_eunsu_stay"
    },
    "day5_lunch_eunsu_yuna_help": {
        // 유나가 교란을 일으켜 은수의 주의를 끔
        character: null,
        next: "day5_lunch_eunsu_break",
        setFlags: ["broke_through_eunsu", "yuna_distraction"]
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
        changeSlot: "afterschool",
        next: "day5_after_start"
    }
});
