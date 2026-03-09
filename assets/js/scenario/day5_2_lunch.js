/**
 * Day 5-2: Lunch - 추격. 탈출 시도, T자 분기점, 세아/리인/은수 조우.
 * BGM: chase.mp3 -> chase_intense.mp3
 * 타이머 선택지 다수. 과거 선택 콜백 + 호감도 분기.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    // ══════════════════════════════════════
    // 점심 시작 - 탈출 개시
    // ══════════════════════════════════════
    "day5_lunch_start": {
        background: "classroom",
        bgm: "chase.mp3",
        character: null,
        glitch: { noise: true },
        next: "day5_lunch_start_2"
    },
    "day5_lunch_start_2": {
        next: "day5_lunch_start_3"
    },
    "day5_lunch_start_3": {
        next: "day5_lunch_start_4"
    },
    "day5_lunch_start_4": {
        background: "corridor",
        next: "day5_lunch_start_5"
    },
    "day5_lunch_start_5": {
        next: "day5_lunch_start_6"
    },
    "day5_lunch_start_6": {
        next: "day5_lunch_start_7"
    },
    "day5_lunch_start_7": {
        next: "day5_lunch_start_8"
    },
    "day5_lunch_start_8": {
        next: "day5_lunch_branch"
    },

    // ── 유나 합류 or 단독 행동 ──
    "day5_lunch_branch": {
        condition: "yuna_final_plan",
        next: "day5_lunch_yuna_meet",
        fallback: "day5_lunch_solo"
    },

    // ══════════════════════════════════════
    // 유나와 합류 (구관 1층)
    // ══════════════════════════════════════
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
        next: "day5_lunch_yuna_5"
    },
    "day5_lunch_yuna_5": {
        next: "day5_lunch_yuna_6"
    },
    "day5_lunch_yuna_6": {
        next: "day5_lunch_yuna_7"
    },
    "day5_lunch_yuna_7": {
        next: "day5_lunch_yuna_8"
    },
    "day5_lunch_yuna_8": {
        next: "day5_lunch_yuna_9"
    },
    "day5_lunch_yuna_9": {
        next: "day5_lunch_yuna_10"
    },
    "day5_lunch_yuna_10": {
        next: "day5_lunch_yuna_11"
    },
    "day5_lunch_yuna_11": {
        next: "day5_lunch_yuna_12"
    },
    "day5_lunch_yuna_12": {
        next: "day5_lunch_escape_start",
        setFlags: ["escape_with_yuna"]
    },

    // ══════════════════════════════════════
    // 단독 행동
    // ══════════════════════════════════════
    "day5_lunch_solo": {
        background: "old_building",
        character: null,
        next: "day5_lunch_solo_2"
    },
    "day5_lunch_solo_2": {
        next: "day5_lunch_escape_start"
    },

    // ══════════════════════════════════════
    // 탈출 시퀀스 - 3층 복도, T자 분기점
    // ══════════════════════════════════════
    "day5_lunch_escape_start": {
        background: "corridor_dark",
        bgm: "chase_intense.mp3",
        character: null,
        next: "day5_lunch_escape_2"
    },
    "day5_lunch_escape_2": {
        next: "day5_lunch_escape_3"
    },
    "day5_lunch_escape_3": {
        next: "day5_lunch_escape_4"
    },
    "day5_lunch_escape_4": {
        next: "day5_lunch_escape_5"
    },
    "day5_lunch_escape_5": {
        next: "day5_lunch_escape_6"
    },
    "day5_lunch_escape_6": {
        glitch: { screenShake: true },
        timedChoice: 5000,
        choices: [
            { next: "day5_lunch_escape_left" },
            { next: "day5_lunch_escape_right" }
        ],
        timeoutNext: "day5_lunch_escape_caught_sea"
    },

    // ══════════════════════════════════════
    // 왼쪽 복도 → 세아 조우
    // ══════════════════════════════════════
    "day5_lunch_escape_left": {
        character: "sea_yandere",
        glitch: { noise: true },
        next: "day5_lunch_left_2"
    },
    "day5_lunch_left_2": {
        next: "day5_lunch_left_3"
    },
    "day5_lunch_left_3": {
        next: "day5_lunch_sea_talk_1"
    },
    "day5_lunch_sea_talk_1": {
        next: "day5_lunch_sea_talk_1b"
    },
    "day5_lunch_sea_talk_1b": {
        character: "sea_cry",
        next: "day5_lunch_sea_talk_1c"
    },
    "day5_lunch_sea_talk_1c": {
        next: "day5_lunch_sea_callback"
    },

    // ★ 과거 선택 콜백 — 4변형
    "day5_lunch_sea_callback": {
        character: "sea_cry",
        branches: [
            { condition: "sea_pinky_promise", next: "day5_lunch_sea_cb_vulnerability" },
            { condition: "lunch_with_sea", next: "day5_lunch_sea_cb_lunch" },
            { condition: "accepted_choco", next: "day5_lunch_sea_cb_choco" }
        ],
        next: "day5_lunch_sea_cb_default"
    },
    "day5_lunch_sea_cb_choco": {
        next: "day5_lunch_sea_cb_choco_2"
    },
    "day5_lunch_sea_cb_choco_2": {
        next: "day5_lunch_sea_tears"
    },
    "day5_lunch_sea_cb_lunch": {
        next: "day5_lunch_sea_cb_lunch_2"
    },
    "day5_lunch_sea_cb_lunch_2": {
        next: "day5_lunch_sea_tears"
    },
    "day5_lunch_sea_cb_vulnerability": {
        next: "day5_lunch_sea_cb_vulnerability_2"
    },
    "day5_lunch_sea_cb_vulnerability_2": {
        next: "day5_lunch_sea_tears"
    },
    "day5_lunch_sea_cb_default": {
        next: "day5_lunch_sea_cb_default_2"
    },
    "day5_lunch_sea_cb_default_2": {
        next: "day5_lunch_sea_tears"
    },

    // ── 세아 눈물 + 내면 독백 ──
    "day5_lunch_sea_tears": {
        character: "sea_cry",
        next: "day5_lunch_sea_tears_2"
    },
    "day5_lunch_sea_tears_2": {
        next: "day5_lunch_sea_tears_3"
    },
    "day5_lunch_sea_tears_3": {
        next: "day5_lunch_sea_block_route"
    },

    // ★ 세아 호감도 분기 (0/20/40/60+)
    "day5_lunch_sea_block_route": {
        affinityChar: "sea",
        affinityBranches: [
            { minAffinity: 60, next: "day5_lunch_sea_block_max" },
            { minAffinity: 40, next: "day5_lunch_sea_block_high" },
            { minAffinity: 20, next: "day5_lunch_sea_block_mid" },
            { minAffinity: 0,  next: "day5_lunch_sea_pass" }
        ]
    },

    // LOW (0): 세아가 멍하니 서있음 → 바로 통과
    "day5_lunch_sea_pass": {
        character: "sea_sad",
        next: "day5_lunch_continue"
    },

    // MID (20): 기존 조우 — 타이머 4초
    "day5_lunch_sea_block_mid": {
        next: "day5_lunch_sea_block_mid_2"
    },
    "day5_lunch_sea_block_mid_2": {
        timedChoice: 4000,
        choices: [
            {
                next: "day5_lunch_sea_push",
                stats: { sea: { danger: 10 } }
            },
            {
                next: "day5_lunch_sea_persuade",
                stats: { sea: { trust: 5 } }
            }
        ],
        timeoutNext: "day5_lunch_escape_caught_sea"
    },

    // HIGH (40): 세아가 팔을 잡음 — 타이머 3초
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
                next: "day5_lunch_sea_persuade",
                stats: { sea: { trust: 5 } }
            }
        ],
        timeoutNext: "day5_lunch_escape_caught_sea"
    },

    // MAX (60+): 세아가 문을 잠금 + forceChoice(설득만 가능)
    "day5_lunch_sea_block_max": {
        glitch: { screenShake: true },
        next: "day5_lunch_sea_block_max_2"
    },
    "day5_lunch_sea_block_max_2": {
        glitch: { forceChoice: 1 },
        choices: [
            {
                next: "day5_lunch_sea_persuade",
                stats: { sea: { trust: 5 } }
            },
            {
                next: "day5_lunch_sea_persuade",
                stats: { sea: { trust: 5 } }
            }
        ]
    },

    // ── 선택 1: 밀치고 지나간다 ──
    "day5_lunch_sea_push": {
        next: "day5_lunch_sea_push_2",
        setFlags: ["pushed_sea"]
    },
    "day5_lunch_sea_push_2": {
        next: "day5_lunch_continue"
    },

    // ── 선택 2: 세아를 설득한다 ──
    "day5_lunch_sea_persuade": {
        character: "sea_cry",
        next: "day5_lunch_sea_persuade_2"
    },
    "day5_lunch_sea_persuade_2": {
        next: "day5_lunch_sea_persuade_3"
    },
    "day5_lunch_sea_persuade_3": {
        next: "day5_lunch_sea_persuade_4"
    },
    "day5_lunch_sea_persuade_4": {
        next: "day5_lunch_sea_persuade_5"
    },
    "day5_lunch_sea_persuade_5": {
        next: "day5_lunch_sea_persuade_6"
    },
    "day5_lunch_sea_persuade_6": {
        next: "day5_lunch_sea_persuade_7"
    },
    "day5_lunch_sea_persuade_7": {
        next: "day5_lunch_sea_persuade_8"
    },
    "day5_lunch_sea_persuade_8": {
        next: "day5_lunch_sea_persuade_9"
    },
    "day5_lunch_sea_persuade_9": {
        next: "day5_lunch_continue",
        setFlags: ["sea_let_go"]
    },

    // ══════════════════════════════════════
    // 오른쪽 복도 → 리인 조우
    // ══════════════════════════════════════
    "day5_lunch_escape_right": {
        character: "riin_dark",
        next: "day5_lunch_right_2"
    },
    "day5_lunch_right_2": {
        next: "day5_lunch_right_3"
    },
    "day5_lunch_right_3": {
        next: "day5_lunch_riin_talk_1"
    },
    "day5_lunch_riin_talk_1": {
        next: "day5_lunch_riin_talk_1b"
    },
    "day5_lunch_riin_talk_1b": {
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
    "day5_lunch_riin_cb_drink": {
        next: "day5_lunch_riin_cb_drink_2"
    },
    "day5_lunch_riin_cb_drink_2": {
        next: "day5_lunch_riin_cb_drink_3"
    },
    "day5_lunch_riin_cb_drink_3": {
        next: "day5_lunch_riin_block"
    },
    "day5_lunch_riin_cb_met": {
        next: "day5_lunch_riin_cb_met_2"
    },
    "day5_lunch_riin_cb_met_2": {
        next: "day5_lunch_riin_block"
    },
    "day5_lunch_riin_cb_default": {
        next: "day5_lunch_riin_cb_default_2"
    },
    "day5_lunch_riin_cb_default_2": {
        next: "day5_lunch_riin_block"
    },

    // ── 리인 주사기 대치 — 타이머 4초 ──
    "day5_lunch_riin_block": {
        next: "day5_lunch_riin_block_2"
    },
    "day5_lunch_riin_block_2": {
        timedChoice: 4000,
        choices: [
            { next: "day5_lunch_riin_dodge" },
            { next: "day5_lunch_riin_confront" }
        ],
        timeoutNext: "day5_lunch_escape_caught_riin"
    },

    // ── 선택 1: 피해서 지나간다 ──
    "day5_lunch_riin_dodge": {
        next: "day5_lunch_riin_dodge_2"
    },
    "day5_lunch_riin_dodge_2": {
        next: "day5_lunch_riin_dodge_3"
    },
    "day5_lunch_riin_dodge_3": {
        next: "day5_lunch_continue"
    },

    // ── 선택 2: 리인과 대화한다 ──
    "day5_lunch_riin_confront": {
        character: "riin_cold",
        next: "day5_lunch_riin_confront_2"
    },
    "day5_lunch_riin_confront_2": {
        next: "day5_lunch_riin_confront_3"
    },
    "day5_lunch_riin_confront_3": {
        next: "day5_lunch_riin_confront_4"
    },
    "day5_lunch_riin_confront_4": {
        next: "day5_lunch_riin_confront_5"
    },
    "day5_lunch_riin_confront_5": {
        next: "day5_lunch_riin_confront_6"
    },
    "day5_lunch_riin_confront_6": {
        next: "day5_lunch_riin_confront_7"
    },
    "day5_lunch_riin_confront_7": {
        next: "day5_lunch_continue",
        setFlags: ["riin_hesitated"]
    },

    // ── 붙잡힘 분기 ──
    "day5_lunch_escape_caught_sea": {
        character: "sea_yandere",
        glitch: { heavyGlitch: true },
        next: "day5_lunch_caught",
        setFlags: ["caught_by_sea"]
    },
    "day5_lunch_escape_caught_riin": {
        character: "riin_dark",
        glitch: { heavyGlitch: true },
        next: "day5_lunch_caught",
        setFlags: ["caught_by_riin"]
    },
    "day5_lunch_caught": {
        character: null,
        next: "day5_lunch_end"
    },

    // ══════════════════════════════════════
    // 은수 최종 대면 (비상구 앞)
    // ══════════════════════════════════════
    "day5_lunch_continue": {
        background: "stairway",
        character: null,
        next: "day5_lunch_continue_2"
    },
    "day5_lunch_continue_2": {
        next: "day5_lunch_continue_3"
    },
    "day5_lunch_continue_3": {
        next: "day5_lunch_continue_4"
    },
    "day5_lunch_continue_4": {
        character: "eunsu_obsessed",
        glitch: { screenShake: true, noise: true },
        next: "day5_lunch_eunsu_face"
    },
    "day5_lunch_eunsu_face": {
        next: "day5_lunch_eunsu_face_2"
    },
    "day5_lunch_eunsu_face_2": {
        next: "day5_lunch_eunsu_face_3"
    },
    "day5_lunch_eunsu_face_3": {
        next: "day5_lunch_eunsu_callback"
    },

    // ★ 과거 선택 콜백 — 3변형
    "day5_lunch_eunsu_callback": {
        branches: [
            { condition: "installed_safety_app", next: "day5_lunch_eunsu_cb_app" },
            { condition: "met_eunsu", next: "day5_lunch_eunsu_cb_visit" }
        ],
        next: "day5_lunch_eunsu_cb_default"
    },
    "day5_lunch_eunsu_cb_app": {
        next: "day5_lunch_eunsu_cb_app_2"
    },
    "day5_lunch_eunsu_cb_app_2": {
        next: "day5_lunch_eunsu_plea"
    },
    "day5_lunch_eunsu_cb_visit": {
        next: "day5_lunch_eunsu_cb_visit_2"
    },
    "day5_lunch_eunsu_cb_visit_2": {
        next: "day5_lunch_eunsu_plea"
    },
    "day5_lunch_eunsu_cb_default": {
        next: "day5_lunch_eunsu_cb_default_2"
    },
    "day5_lunch_eunsu_cb_default_2": {
        next: "day5_lunch_eunsu_plea"
    },

    // ── 은수 호감도 분기 ──
    "day5_lunch_eunsu_plea": {
        next: "day5_lunch_eunsu_plea_2"
    },
    "day5_lunch_eunsu_plea_2": {
        next: "day5_lunch_eunsu_plea_3"
    },
    "day5_lunch_eunsu_plea_3": {
        next: "day5_lunch_eunsu_plea_4"
    },
    "day5_lunch_eunsu_plea_4": {
        next: "day5_lunch_eunsu_plea_5"
    },
    "day5_lunch_eunsu_plea_5": {
        next: "day5_lunch_eunsu_affinity_route"
    },

    "day5_lunch_eunsu_affinity_route": {
        affinityChar: "eunsu",
        affinityBranches: [
            { minAffinity: 60, next: "day5_lunch_eunsu_final_max" },
            { minAffinity: 40, next: "day5_lunch_eunsu_final_high" },
            { minAffinity: 0,  next: "day5_lunch_eunsu_final" }
        ]
    },

    // LOW/MID: 5초 타이머
    "day5_lunch_eunsu_final": {
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

    // HIGH: 추가 설득 — 3초 타이머
    "day5_lunch_eunsu_final_high": {
        next: "day5_lunch_eunsu_final_high_2"
    },
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
        glitch: { heavyGlitch: true },
        typingSpeed: 100,
        next: "day5_lunch_eunsu_final_max_2"
    },
    "day5_lunch_eunsu_final_max_2": {
        typingSpeed: 150,
        unskippable: true,
        branches: [
            { condition: "escape_with_yuna", next: "day5_lunch_eunsu_yuna_help" }
        ],
        next: "day5_lunch_eunsu_stay"
    },
    "day5_lunch_eunsu_yuna_help": {
        character: null,
        next: "day5_lunch_eunsu_break",
        setFlags: ["broke_through_eunsu", "yuna_distraction"]
    },

    // ── 선택 1: 밀치고 나간다 ──
    "day5_lunch_eunsu_break": {
        character: null,
        glitch: { heavyGlitch: true },
        next: "day5_lunch_eunsu_break_2"
    },
    "day5_lunch_eunsu_break_2": {
        next: "day5_lunch_eunsu_break_3"
    },
    "day5_lunch_eunsu_break_3": {
        next: "day5_lunch_eunsu_break_4"
    },
    "day5_lunch_eunsu_break_4": {
        next: "day5_lunch_eunsu_break_5"
    },
    "day5_lunch_eunsu_break_5": {
        next: "day5_lunch_eunsu_break_6"
    },
    "day5_lunch_eunsu_break_6": {
        next: "day5_lunch_eunsu_break_7"
    },
    "day5_lunch_eunsu_break_7": {
        next: "day5_lunch_breakthrough"
    },

    // ── 선택 2: 은수와 함께 남는다 ──
    "day5_lunch_eunsu_stay": {
        character: "eunsu_gentle",
        next: "day5_lunch_eunsu_stay_2"
    },
    "day5_lunch_eunsu_stay_2": {
        next: "day5_lunch_eunsu_stay_3"
    },
    "day5_lunch_eunsu_stay_3": {
        next: "day5_lunch_eunsu_stay_4"
    },
    "day5_lunch_eunsu_stay_4": {
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
