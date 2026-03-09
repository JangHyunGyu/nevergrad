/**
 * Day 4-2: Lunch - 수색
 * 3 choices: 유나 찾기 / 보건실 / 옥상
 * 유나: 사진부 교실, 사물함 이중바닥 카메라, "여기 아래 — 유"
 * 보건실: 리인 주사기 목격, 타이머 6초
 * 옥상: 설화 메시지, 벚꽃잎, 유령 텍스트
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    // ── 점심시간 시작 ──
    "day4_lunch_start": {
        background: "classroom",
        bgm: "tension.mp3",
        character: null,
        next: "day4_lunch_start_2"
    },
    "day4_lunch_start_2": {
        next: "day4_lunch_start_3"
    },
    "day4_lunch_start_3": {
        next: "day4_lunch_start_4"
    },
    "day4_lunch_start_4": {
        next: "day4_lunch_start_5"
    },
    "day4_lunch_start_5": {
        next: "day4_lunch_choice"
    },

    "day4_lunch_choice": {
        choices: [
            { next: "day4_lunch_search_yuna" },
            { next: "day4_lunch_nurse" },
            { next: "day4_lunch_rooftop" }
        ]
    },

    // ═══════════════════════════════════════
    // 유나 수색 루트 — 카메라 발견
    // ═══════════════════════════════════════
    "day4_lunch_search_yuna": {
        background: "corridor",
        bgm: "tension_low.mp3",
        character: null,
        next: "day4_lunch_search_2"
    },
    "day4_lunch_search_2": {
        next: "day4_lunch_search_3"
    },
    "day4_lunch_search_3": {
        next: "day4_lunch_search_4"
    },
    "day4_lunch_search_4": {
        next: "day4_lunch_search_5"
    },
    "day4_lunch_search_5": {
        background: "old_building",
        next: "day4_lunch_search_6"
    },
    "day4_lunch_search_6": {
        next: "day4_lunch_search_7"
    },
    "day4_lunch_search_7": {
        next: "day4_lunch_search_8"
    },
    "day4_lunch_search_8": {
        next: "day4_lunch_search_9"
    },
    "day4_lunch_search_9": {
        next: "day4_lunch_search_10"
    },
    "day4_lunch_search_10": {
        // 이중 바닥 발견
        next: "day4_lunch_search_11"
    },
    "day4_lunch_search_11": {
        // 카메라 발견
        next: "day4_lunch_search_12",
        setFlags: ["found_yuna_camera"]
    },
    "day4_lunch_search_12": {
        next: "day4_lunch_search_13"
    },
    "day4_lunch_search_13": {
        // 마지막 사진: 지하 계단
        glitch: { noise: true },
        next: "day4_lunch_search_14"
    },
    "day4_lunch_search_14": {
        // "여기 아래 — 유"
        next: "day4_lunch_search_15"
    },
    "day4_lunch_search_15": {
        next: "day4_lunch_search_16"
    },
    "day4_lunch_search_16": {
        next: "day4_lunch_search_17"
    },
    "day4_lunch_search_17": {
        next: "day4_lunch_end"
    },

    // ═══════════════════════════════════════
    // 보건실 루트 — 리인의 본색
    // ═══════════════════════════════════════
    "day4_lunch_nurse": {
        background: "nurse_office",
        bgm: "tension_low.mp3",
        character: null,
        next: "day4_lunch_nurse_2"
    },
    "day4_lunch_nurse_2": {
        next: "day4_lunch_nurse_3"
    },
    "day4_lunch_nurse_3": {
        next: "day4_lunch_nurse_4"
    },
    "day4_lunch_nurse_4": {
        character: "riin_smile",
        next: "day4_lunch_nurse_5"
    },
    "day4_lunch_nurse_5": {
        next: "day4_lunch_nurse_6"
    },
    "day4_lunch_nurse_6": {
        character: "riin_cold",
        next: "day4_lunch_nurse_7"
    },
    "day4_lunch_nurse_7": {
        character: "riin_smile",
        next: "day4_lunch_nurse_8"
    },
    "day4_lunch_nurse_8": {
        next: "day4_lunch_nurse_9"
    },
    "day4_lunch_nurse_9": {
        next: "day4_lunch_nurse_10"
    },
    "day4_lunch_nurse_10": {
        character: "riin_smile",
        next: "day4_lunch_nurse_11"
    },
    "day4_lunch_nurse_11": {
        next: "day4_lunch_nurse_timer"
    },
    "day4_lunch_nurse_timer": {
        // 타이머 선택지: 6초
        timedChoice: 6000,
        choices: [
            {
                next: "day4_lunch_nurse_ask",
                stats: { riin: { danger: 10 } }
            },
            {
                next: "day4_lunch_nurse_silent"
            }
        ],
        timeoutNext: "day4_lunch_nurse_silent"
    },

    // 선택1: 유나에 대해 묻는다
    "day4_lunch_nurse_ask": {
        character: null,
        next: "day4_lunch_nurse_ask_2"
    },
    "day4_lunch_nurse_ask_2": {
        next: "day4_lunch_nurse_ask_3"
    },
    "day4_lunch_nurse_ask_3": {
        character: "riin_smile",
        next: "day4_lunch_nurse_ask_4"
    },
    "day4_lunch_nurse_ask_4": {
        next: "day4_lunch_nurse_ask_5"
    },
    "day4_lunch_nurse_ask_5": {
        next: "day4_lunch_nurse_ask_6"
    },
    "day4_lunch_nurse_ask_6": {
        character: "riin_cold",
        next: "day4_lunch_nurse_ask_7",
        setFlags: ["confronted_riin"]
    },
    "day4_lunch_nurse_ask_7": {
        next: "day4_lunch_nurse_ask_8"
    },
    "day4_lunch_nurse_ask_8": {
        character: "riin_smile",
        next: "day4_lunch_nurse_ask_9"
    },
    "day4_lunch_nurse_ask_9": {
        character: null,
        next: "day4_lunch_nurse_ask_10"
    },
    "day4_lunch_nurse_ask_10": {
        glitch: { noise: true },
        next: "day4_lunch_end"
    },

    // 선택2: 아무 말 하지 않는다
    "day4_lunch_nurse_silent": {
        character: null,
        next: "day4_lunch_nurse_silent_2"
    },
    "day4_lunch_nurse_silent_2": {
        character: "riin_smile",
        next: "day4_lunch_nurse_silent_3"
    },
    "day4_lunch_nurse_silent_3": {
        character: null,
        next: "day4_lunch_nurse_silent_4"
    },
    "day4_lunch_nurse_silent_4": {
        next: "day4_lunch_nurse_silent_5"
    },
    "day4_lunch_nurse_silent_5": {
        character: "riin_smile",
        next: "day4_lunch_nurse_silent_6"
    },
    "day4_lunch_nurse_silent_6": {
        character: null,
        next: "day4_lunch_end"
    },

    // ═══════════════════════════════════════
    // 옥상 루트 — 설화의 단서
    // ═══════════════════════════════════════
    "day4_lunch_rooftop": {
        background: "rooftop",
        bgm: "wind_ambient.mp3",
        character: null,
        next: "day4_lunch_rooftop_2"
    },
    "day4_lunch_rooftop_2": {
        next: "day4_lunch_rooftop_3"
    },
    "day4_lunch_rooftop_3": {
        next: "day4_lunch_rooftop_4"
    },
    "day4_lunch_rooftop_4": {
        next: "day4_lunch_rooftop_5"
    },
    "day4_lunch_rooftop_5": {
        next: "day4_lunch_rooftop_6"
    },
    "day4_lunch_rooftop_6": {
        // "여기서 나가는 방법은 하나. — 이설화"
        next: "day4_lunch_rooftop_7",
        setFlags: ["found_seolhwa_mark"]
    },
    "day4_lunch_rooftop_7": {
        next: "day4_lunch_rooftop_8"
    },
    "day4_lunch_rooftop_8": {
        // "지하에 답이 있어"
        next: "day4_lunch_rooftop_9"
    },
    "day4_lunch_rooftop_9": {
        next: "day4_lunch_rooftop_10"
    },
    "day4_lunch_rooftop_10": {
        // 벚꽃잎
        next: "day4_lunch_rooftop_11"
    },
    "day4_lunch_rooftop_11": {
        next: "day4_lunch_rooftop_12"
    },
    "day4_lunch_rooftop_12": {
        glitch: { ghostText: true },
        next: "day4_lunch_rooftop_13"
    },
    "day4_lunch_rooftop_13": {
        next: "day4_lunch_end"
    },

    // ── ghost text ──
    "day4_lunch_ghost": {
        next: null
    },

    "day4_lunch_end": {
        background: "classroom",
        character: null,
        changeSlot: "afterschool",
        next: "day4_after_start"
    }
});
