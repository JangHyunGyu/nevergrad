/**
 * Day 5-1: Morning - 새벽 출발, 유나 구출, 봉쇄, 졸업식, 은수의 제안.
 * NIGHTMARE 글리치 레벨 4. heartbeat_loop → silence_tension → music_box_broken.
 * 2-choice 분기 (ESCAPE/TRUE), 10초 타이머, 15초 최종 타이머.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    // ══════════════════════════════════════
    // Day 5 아침 진입점 (day4_night_end에서 연결)
    // ══════════════════════════════════════
    "day5_morning_start": {
        background: "room_dark",
        bgm: "heartbeat_loop.mp3",
        character: null,
        glitchLevel: 4,
        next: "day5_morning_dawn_1"
    },

    // ══════════════════════════════════════
    // 새벽: 출발 — 자취방 4AM
    // ══════════════════════════════════════
    "day5_morning_dawn_1": {
        background: "room_dark",
        bgm: "heartbeat_loop.mp3",
        character: null,
        glitchLevel: 4,
        unskippable: true,
        next: "day5_morning_dawn_2"
    },
    "day5_morning_dawn_2": {
        character: null,
        next: "day5_morning_dawn_3"
    },
    "day5_morning_dawn_3": {
        character: null,
        next: "day5_morning_dawn_4"
    },
    "day5_morning_dawn_4": {
        character: null,
        next: "day5_morning_dawn_5"
    },
    "day5_morning_dawn_5": {
        character: null,
        next: "day5_morning_dawn_6"
    },
    "day5_morning_dawn_6": {
        character: null,
        next: "day5_morning_dawn_7"
    },
    "day5_morning_dawn_7": {
        character: null,
        next: "day5_morning_dawn_8"
    },
    "day5_morning_dawn_8": {
        character: null,
        next: "day5_morning_dawn_9"
    },
    "day5_morning_dawn_9": {
        character: null,
        next: "day5_morning_dawn_10"
    },
    "day5_morning_dawn_10": {
        character: null,
        next: "day5_morning_dawn_11"
    },
    "day5_morning_dawn_11": {
        character: null,
        next: "day5_morning_dawn_12"
    },

    // ══════════════════════════════════════
    // 새벽의 학교 — 정문, 구관, 지하실 하강
    // ══════════════════════════════════════
    "day5_morning_dawn_12": {
        background: "school_gate_dark",
        bgm: "silence_tension.mp3",
        character: null,
        glitch: { noise: true, noiseDuration: 300 },
        unskippable: true,
        next: "day5_morning_school_1"
    },
    "day5_morning_school_1": {
        character: null,
        next: "day5_morning_school_2"
    },
    "day5_morning_school_2": {
        character: null,
        next: "day5_morning_school_3"
    },
    "day5_morning_school_3": {
        character: null,
        next: "day5_morning_school_4"
    },
    "day5_morning_school_4": {
        character: null,
        next: "day5_morning_school_5"
    },
    "day5_morning_school_5": {
        character: null,
        next: "day5_morning_school_6"
    },
    "day5_morning_school_6": {
        character: null,
        next: "day5_morning_school_7"
    },
    "day5_morning_school_7": {
        character: null,
        next: "day5_morning_school_8"
    },
    "day5_morning_school_8": {
        character: null,
        background: "old_building",
        next: "day5_morning_school_9"
    },
    "day5_morning_school_9": {
        character: null,
        next: "day5_morning_school_10"
    },
    "day5_morning_school_10": {
        character: null,
        next: "day5_morning_school_11"
    },

    // ══════════════════════════════════════
    // 유나 구출 — 지하실
    // ══════════════════════════════════════
    "day5_morning_school_11": {
        background: "basement",
        character: null,
        unskippable: true,
        next: "day5_morning_rescue_1"
    },
    "day5_morning_rescue_1": {
        character: null,
        next: "day5_morning_rescue_2"
    },
    "day5_morning_rescue_2": {
        character: "yuna_weak",
        next: "day5_morning_rescue_3"
    },
    "day5_morning_rescue_3": {
        character: "yuna_weak",
        next: "day5_morning_rescue_4"
    },
    "day5_morning_rescue_4": {
        character: null,
        next: "day5_morning_rescue_5"
    },
    "day5_morning_rescue_5": {
        character: "yuna_weak",
        next: "day5_morning_rescue_6"
    },
    "day5_morning_rescue_6": {
        character: null,
        next: "day5_morning_rescue_7"
    },
    "day5_morning_rescue_7": {
        character: null,
        next: "day5_morning_rescue_8"
    },
    "day5_morning_rescue_8": {
        character: "yuna_weak",
        next: "day5_morning_rescue_9"
    },
    "day5_morning_rescue_9": {
        character: "yuna_weak",
        next: "day5_morning_rescue_10"
    },
    "day5_morning_rescue_10": {
        character: "yuna_weak",
        next: "day5_morning_rescue_11"
    },
    "day5_morning_rescue_11": {
        character: "yuna_weak",
        next: "day5_morning_rescue_12"
    },
    "day5_morning_rescue_12": {
        character: "yuna_weak",
        next: "day5_morning_rescue_13"
    },
    "day5_morning_rescue_13": {
        character: "yuna_weak",
        next: "day5_morning_rescue_14"
    },
    "day5_morning_rescue_14": {
        character: null,
        next: "day5_morning_rescue_15"
    },
    "day5_morning_rescue_15": {
        character: "yuna_normal",
        next: "day5_morning_rescue_16"
    },
    "day5_morning_rescue_16": {
        character: "yuna_normal",
        next: "day5_morning_rescue_17"
    },
    "day5_morning_rescue_17": {
        character: "yuna_normal",
        next: "day5_morning_rescue_18"
    },
    "day5_morning_rescue_18": {
        character: "yuna_normal",
        next: "day5_morning_rescue_19"
    },
    "day5_morning_rescue_19": {
        character: null,
        next: "day5_morning_rescue_20"
    },
    "day5_morning_rescue_20": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_21"
    },
    "day5_morning_rescue_21": {
        character: null,
        glitch: { ghostText: "기록해줘", ghostX: 50, ghostY: 50 },
        setFlags: ["dejavu_pin_9"],
        next: "day5_morning_rescue_22"
    },
    "day5_morning_rescue_22": {
        character: null,
        next: "day5_morning_rescue_choice"
    },

    // ── 선택지: 탈출 / 증거 확보 ──
    "day5_morning_rescue_choice": {
        character: null,
        unskippable: true,
        choices: [
            { next: "day5_morning_escape_end", setFlags: ["route_escape"] },
            { next: "day5_morning_true_1", setFlags: ["route_true", "has_evidence"] }
        ]
    },

    // ── ESCAPE 루트 종료 → 추격 스킵, 방과후로 직행 ──
    "day5_morning_escape_end": {
        character: null,
        setFlags: ["route_escape"],
        changeSlot: "afterschool",
        next: "day5_after_start"
    },

    // ══════════════════════════════════════
    // 아침: 봉쇄 (TRUE 루트)
    // ══════════════════════════════════════
    "day5_morning_true_1": {
        background: "basement",
        character: null,
        unskippable: true,
        next: "day5_morning_true_2"
    },
    "day5_morning_true_2": {
        character: null,
        next: "day5_morning_true_3"
    },
    "day5_morning_true_3": {
        character: null,
        next: "day5_morning_true_4"
    },
    "day5_morning_true_4": {
        character: null,
        next: "day5_morning_true_5"
    },
    "day5_morning_true_5": {
        character: null,
        next: "day5_morning_true_6"
    },
    "day5_morning_true_6": {
        character: null,
        next: "day5_morning_true_7"
    },
    "day5_morning_true_7": {
        character: null,
        next: "day5_morning_true_8"
    },
    "day5_morning_true_8": {
        character: null,
        next: "day5_morning_true_9"
    },
    "day5_morning_true_9": {
        character: null,
        next: "day5_morning_true_10"
    },
    "day5_morning_true_10": {
        character: null,
        next: "day5_morning_true_11"
    },
    "day5_morning_true_11": {
        character: null,
        next: "day5_morning_true_12"
    },
    "day5_morning_true_12": {
        character: null,
        next: "day5_morning_true_13"
    },
    "day5_morning_true_13": {
        character: null,
        next: "day5_morning_true_14"
    },
    "day5_morning_true_14": {
        character: "yuna_weak",
        next: "day5_morning_true_15"
    },
    "day5_morning_true_15": {
        character: null,
        next: "day5_morning_true_16"
    },
    "day5_morning_true_16": {
        character: null,
        next: "day5_morning_blockade_1"
    },

    // ── 구관 1층 복도 — 봉쇄 ──
    "day5_morning_blockade_1": {
        background: "corridor_old",
        character: null,
        unskippable: true,
        next: "day5_morning_blockade_2"
    },
    "day5_morning_blockade_2": {
        character: null,
        next: "day5_morning_blockade_3"
    },
    "day5_morning_blockade_3": {
        character: null,
        glitch: { screenShake: true, shakeDuration: 200 },
        unskippable: true,
        next: "day5_morning_blockade_4"
    },
    "day5_morning_blockade_4": {
        character: null,
        next: "day5_morning_blockade_5"
    },

    // ── 교내 방송 — 은수 ──
    "day5_morning_blockade_5": {
        character: null,
        glitch: { noise: true, noiseDuration: 500 },
        bgm: "music_box_broken.mp3",
        unskippable: true,
        next: "day5_morning_broadcast_1"
    },
    "day5_morning_broadcast_1": {
        character: "eunsu_gentle",
        next: "day5_morning_broadcast_2"
    },
    "day5_morning_broadcast_2": {
        character: "eunsu_gentle",
        next: "day5_morning_broadcast_3"
    },
    "day5_morning_broadcast_3": {
        character: "eunsu_gentle",
        next: "day5_morning_broadcast_4"
    },
    "day5_morning_broadcast_4": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_broadcast_5"
    },
    "day5_morning_broadcast_5": {
        character: "eunsu_gentle",
        next: "day5_morning_broadcast_6"
    },
    "day5_morning_broadcast_6": {
        character: "eunsu_gentle",
        next: "day5_morning_broadcast_7"
    },
    "day5_morning_broadcast_7": {
        character: null,
        next: "day5_morning_broadcast_8"
    },
    "day5_morning_broadcast_8": {
        character: "yuna_weak",
        next: "day5_morning_broadcast_9"
    },
    "day5_morning_broadcast_9": {
        character: null,
        next: "day5_morning_broadcast_10"
    },
    "day5_morning_broadcast_10": {
        character: null,
        next: "day5_morning_broadcast_11"
    },
    "day5_morning_broadcast_11": {
        character: "yuna_weak",
        next: "day5_morning_broadcast_12"
    },
    "day5_morning_broadcast_12": {
        character: null,
        next: "day5_morning_broadcast_13"
    },
    "day5_morning_broadcast_13": {
        character: null,
        glitch: { screenShake: true, shakeDuration: 300 },
        unskippable: true,
        next: "day5_morning_broadcast_14"
    },
    "day5_morning_broadcast_14": {
        character: "yuna_normal",
        next: "day5_morning_broadcast_15"
    },
    "day5_morning_broadcast_15": {
        character: "yuna_weak",
        next: "day5_morning_broadcast_16"
    },
    "day5_morning_broadcast_16": {
        character: null,
        next: "day5_morning_broadcast_17"
    },
    "day5_morning_broadcast_17": {
        character: null,
        next: "day5_morning_broadcast_18"
    },

    // ══════════════════════════════════════
    // 졸업식 — 교실
    // ══════════════════════════════════════
    "day5_morning_broadcast_18": {
        background: "classroom",
        bgm: "music_box_broken.mp3",
        character: null,
        unskippable: true,
        next: "day5_morning_grad_1"
    },
    "day5_morning_grad_1": {
        character: "yuna_weak",
        next: "day5_morning_grad_2"
    },
    "day5_morning_grad_2": {
        character: null,
        next: "day5_morning_grad_3"
    },
    "day5_morning_grad_3": {
        character: "yuna_weak",
        next: "day5_morning_grad_4"
    },
    "day5_morning_grad_4": {
        character: null,
        next: "day5_morning_grad_5"
    },
    "day5_morning_grad_5": {
        character: null,
        next: "day5_morning_grad_6"
    },
    "day5_morning_grad_6": {
        character: null,
        unskippable: true,
        next: "day5_morning_grad_7"
    },
    "day5_morning_grad_7": {
        character: null,
        next: "day5_morning_grad_8"
    },
    "day5_morning_grad_8": {
        character: null,
        next: "day5_morning_grad_9"
    },
    "day5_morning_grad_9": {
        character: null,
        next: "day5_morning_grad_10"
    },
    "day5_morning_grad_10": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_11"
    },
    "day5_morning_grad_11": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_12"
    },
    "day5_morning_grad_12": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_13"
    },
    "day5_morning_grad_13": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_14"
    },

    // ── 은수 독백: 과거 시행들 (감정적 핵심) ──
    "day5_morning_grad_14": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_15"
    },
    "day5_morning_grad_15": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_16"
    },
    "day5_morning_grad_16": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_17"
    },
    "day5_morning_grad_17": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_18"
    },
    "day5_morning_grad_18": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_19"
    },
    "day5_morning_grad_19": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_20"
    },
    "day5_morning_grad_20": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_21"
    },
    "day5_morning_grad_21": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_21a"
    },
    "day5_morning_grad_21a": {
        character: "eunsu_gentle",
        next: "day5_morning_grad_22"
    },
    "day5_morning_grad_22": {
        character: null,
        next: "day5_morning_grad_23"
    },
    "day5_morning_grad_23": {
        character: "eunsu_dark",
        glitch: { screenShake: true, shakeDuration: 300 },
        unskippable: true,
        next: "day5_morning_grad_24"
    },
    "day5_morning_grad_24": {
        character: "eunsu_dark",
        next: "day5_morning_grad_25"
    },
    "day5_morning_grad_25": {
        character: "eunsu_dark",
        next: "day5_morning_grad_26"
    },
    "day5_morning_grad_26": {
        character: "eunsu_dark",
        next: "day5_morning_grad_27"
    },
    "day5_morning_grad_27": {
        character: "eunsu_dark",
        next: "day5_morning_grad_28"
    },
    "day5_morning_grad_28": {
        character: "eunsu_dark",
        next: "day5_morning_grad_29"
    },
    "day5_morning_grad_29": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_29a"
    },
    "day5_morning_grad_29a": {
        character: null,
        next: "day5_morning_grad_30"
    },
    "day5_morning_grad_30": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_timer"
    },

    // ── 타이머 선택지: 10초 ──
    "day5_morning_grad_timer": {
        character: null,
        timedChoice: 10000,
        unskippable: true,
        choices: [
            { next: "day5_morning_grad_reply_1" },
            { next: "day5_morning_grad_reply_2" },
            { next: "day5_morning_grad_reply_3" }
        ],
        timeoutNext: "day5_morning_grad_reply_3"
    },

    // ── 선택 1: "그건 사랑이 아니에요." ──
    "day5_morning_grad_reply_1": {
        character: "eunsu_dark",
        next: "day5_morning_grad_reply_1b"
    },
    "day5_morning_grad_reply_1b": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_1"
    },

    // ── 선택 2: "왜 이런 짓을 한 거예요?" ──
    "day5_morning_grad_reply_2": {
        character: "eunsu_dark",
        next: "day5_morning_grad_reply_2b"
    },
    "day5_morning_grad_reply_2b": {
        character: "eunsu_dark",
        next: "day5_morning_grad_reply_2c"
    },
    "day5_morning_grad_reply_2c": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_1"
    },

    // ── 선택 3: (침묵한다) ──
    "day5_morning_grad_reply_3": {
        character: null,
        next: "day5_morning_grad_reply_3b"
    },
    "day5_morning_grad_reply_3b": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_1"
    },

    // ══════════════════════════════════════
    // 은수의 제안
    // ══════════════════════════════════════
    "day5_morning_proposal_1": {
        character: null,
        unskippable: true,
        next: "day5_morning_proposal_2"
    },
    "day5_morning_proposal_2": {
        character: null,
        next: "day5_morning_proposal_3"
    },
    "day5_morning_proposal_3": {
        character: null,
        next: "day5_morning_proposal_4"
    },
    "day5_morning_proposal_4": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_5"
    },
    "day5_morning_proposal_5": {
        character: null,
        next: "day5_morning_proposal_6"
    },
    "day5_morning_proposal_6": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_7"
    },
    "day5_morning_proposal_7": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_8"
    },
    "day5_morning_proposal_8": {
        character: null,
        next: "day5_morning_proposal_9"
    },
    "day5_morning_proposal_9": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_10"
    },
    "day5_morning_proposal_10": {
        character: null,
        next: "day5_morning_proposal_11"
    },
    "day5_morning_proposal_11": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_12"
    },
    "day5_morning_proposal_12": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_13"
    },
    "day5_morning_proposal_13": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_14"
    },
    "day5_morning_proposal_14": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_15"
    },
    "day5_morning_proposal_15": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_16"
    },
    "day5_morning_proposal_16": {
        character: null,
        next: "day5_morning_proposal_17"
    },
    "day5_morning_proposal_17": {
        character: "eunsu_dark",
        next: "day5_morning_proposal_18"
    },
    "day5_morning_proposal_18": {
        character: null,
        next: "day5_morning_proposal_timer"
    },

    // ── 최종 타이머 선택지: 15초 ──
    "day5_morning_proposal_timer": {
        character: null,
        timedChoice: 15000,
        unskippable: true,
        choices: [
            { next: "day5_morning_end_cage", setFlags: ["route_cage", "stayed_with_eunsu"] },
            { next: "day5_morning_end_forget", setFlags: ["route_forget"] },
            { next: "day5_morning_end_run", setFlags: ["route_chase"] }
        ],
        timeoutNext: "day5_morning_end_run"
    },

    // ── CAGE 루트 종료 ──
    "day5_morning_end_cage": {
        character: null,
        setFlags: ["route_cage", "stayed_with_eunsu"],
        changeSlot: "afterschool",
        next: "day5_after_start"
    },

    // ── FORGET 루트 종료 ──
    "day5_morning_end_forget": {
        character: null,
        changeSlot: "afterschool",
        next: "day5_after_start"
    },

    // ── 추격전 진입 ──
    "day5_morning_end_run": {
        character: null,
        changeSlot: "lunch",
        next: "day5_lunch_start"
    }
});
