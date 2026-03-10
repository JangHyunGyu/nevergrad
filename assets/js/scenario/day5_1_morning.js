/**
 * Day 5-1: Morning - 봉쇄. 최종일 아침.
 * NIGHTMARE 글리치 레벨 4. 쇠사슬/철조망 봉쇄.
 * 세 사람 동시 등장. 졸업식='완성'. 유나 쪽지 (rescued_yuna).
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    // ══════════════════════════════════════
    // 자취방 - 마지막 날 기상
    // ══════════════════════════════════════
    "day5_morning_start": {
        background: "room_morning",
        bgm: "nightmare.mp3",
        character: null,
        glitchLevel: 4,
        unskippable: true,
        next: "day5_morning_start_2"
    },
    "day5_morning_start_2": {
        next: "day5_morning_start_3"
    },
    "day5_morning_start_3": {
        next: "day5_morning_start_4"
    },
    "day5_morning_start_4": {
        next: "day5_morning_start_5"
    },
    "day5_morning_start_5": {
        next: "day5_morning_start_6"
    },
    "day5_morning_start_6": {
        next: "day5_morning_start_7"
    },
    "day5_morning_start_7": {
        next: "day5_morning_start_8"
    },
    "day5_morning_start_8": {
        next: "day5_morning_start_9"
    },
    "day5_morning_start_9": {
        next: "day5_morning_start_10"
    },
    "day5_morning_start_10": {
        next: "day5_morning_start_11"
    },
    "day5_morning_start_11": {
        next: "day5_morning_gate"
    },

    // ══════════════════════════════════════
    // 통학로 → 학교 정문 - 봉쇄
    // ══════════════════════════════════════
    "day5_morning_gate": {
        background: "school_gate",
        character: null,
        glitch: { noise: true, noiseDuration: 300 },
        unskippable: true,
        next: "day5_morning_gate_2"
    },
    "day5_morning_gate_2": {
        next: "day5_morning_gate_3"
    },
    "day5_morning_gate_3": {
        next: "day5_morning_gate_4"
    },
    "day5_morning_gate_4": {
        next: "day5_morning_gate_5"
    },
    "day5_morning_gate_5": {
        next: "day5_morning_gate_6"
    },
    "day5_morning_gate_6": {
        next: "day5_morning_gate_choice"
    },

    // ── 피할까? 선택지 (어떤 선택이든 돌아올 수 없다) ──
    "day5_morning_gate_choice": {
        unskippable: true,
        choices: [
            { next: "day5_morning_gate_dodge_fail" },
            { next: "day5_morning_paralysis_1" }
        ]
    },
    "day5_morning_gate_dodge_fail": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day5_morning_paralysis_1"
    },

    // ── 마비 시퀀스 ──
    "day5_morning_paralysis_1": {
        unskippable: true,
        next: "day5_morning_paralysis_2"
    },
    "day5_morning_paralysis_2": {
        unskippable: true,
        next: "day5_morning_paralysis_3"
    },
    "day5_morning_paralysis_3": {
        unskippable: true,
        next: "day5_morning_paralysis_4"
    },
    "day5_morning_paralysis_4": {
        unskippable: true,
        next: "day5_morning_paralysis_5"
    },
    "day5_morning_paralysis_5": {
        unskippable: true,
        next: "day5_morning_paralysis_6"
    },
    "day5_morning_paralysis_6": {
        unskippable: true,
        next: "day5_morning_watchers_1"
    },

    // ── 관찰자들 ──
    "day5_morning_watchers_1": {
        unskippable: true,
        next: "day5_morning_watchers_2"
    },
    "day5_morning_watchers_2": {
        unskippable: true,
        next: "day5_morning_watchers_3"
    },
    "day5_morning_watchers_3": {
        unskippable: true,
        next: "day5_morning_watchers_4"
    },
    "day5_morning_watchers_4": {
        unskippable: true,
        next: "day5_morning_welcome"
    },

    // ── 세 사람 등장 ──
    "day5_morning_welcome": {
        character: "eunsu_gentle",
        next: "day5_morning_welcome_2"
    },
    "day5_morning_welcome_2": {
        next: "day5_morning_welcome_3"
    },
    "day5_morning_welcome_3": {
        next: "day5_morning_welcome_4"
    },
    "day5_morning_welcome_4": {
        character: "sea_smile",
        unskippable: true,
        next: "day5_morning_welcome_5"
    },
    "day5_morning_welcome_5": {
        next: "day5_morning_welcome_6"
    },
    "day5_morning_welcome_6": {
        next: "day5_morning_welcome_7"
    },
    "day5_morning_welcome_7": {
        character: "riin_smile",
        next: "day5_morning_welcome_8"
    },
    "day5_morning_welcome_8": {
        next: "day5_morning_welcome_9"
    },
    "day5_morning_welcome_9": {
        next: "day5_morning_welcome_10"
    },
    "day5_morning_welcome_10": {
        next: "day5_morning_welcome_11"
    },
    "day5_morning_welcome_11": {
        character: null,
        glitch: { expressionFlash: "eunsu_obsessed", flashDuration: 100 },
        unskippable: true,
        next: "day5_morning_welcome_12"
    },
    "day5_morning_welcome_12": {
        next: "day5_morning_welcome_13"
    },
    "day5_morning_welcome_13": {
        next: "day5_morning_welcome_14"
    },
    "day5_morning_welcome_14": {
        next: "day5_morning_classroom"
    },

    // ══════════════════════════════════════
    // 교실 - 졸업식 = '완성'
    // ══════════════════════════════════════
    "day5_morning_classroom": {
        background: "classroom",
        character: null,
        unskippable: true,
        next: "day5_morning_classroom_2"
    },
    "day5_morning_classroom_2": {
        next: "day5_morning_classroom_3"
    },
    "day5_morning_classroom_3": {
        next: "day5_morning_classroom_4"
    },
    "day5_morning_classroom_4": {
        next: "day5_morning_classroom_5"
    },
    "day5_morning_classroom_5": {
        next: "day5_morning_classroom_6"
    },
    "day5_morning_classroom_6": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_class"
    },
    "day5_morning_class": {
        next: "day5_morning_class_2"
    },
    "day5_morning_class_2": {
        next: "day5_morning_class_3"
    },
    "day5_morning_class_3": {
        next: "day5_morning_class_4"
    },
    "day5_morning_class_4": {
        next: "day5_morning_class_5"
    },
    "day5_morning_class_5": {
        next: "day5_morning_class_6"
    },
    "day5_morning_class_6": {
        next: "day5_morning_class_7"
    },
    "day5_morning_class_7": {
        next: "day5_morning_class_8"
    },
    "day5_morning_class_8": {
        next: "day5_morning_class_9"
    },
    "day5_morning_class_9": {
        character: null,
        next: "day5_morning_class_10"
    },
    "day5_morning_class_10": {
        character: "eunsu_dark",
        glitch: { screenShake: true, shakeDuration: 300 },
        unskippable: true,
        next: "day5_morning_class_11"
    },
    "day5_morning_class_11": {
        next: "day5_morning_class_12"
    },
    "day5_morning_class_12": {
        character: null,
        next: "day5_morning_class_13"
    },
    "day5_morning_class_13": {
        next: "day5_morning_class_14"
    },
    "day5_morning_class_14": {
        next: "day5_morning_class_15"
    },
    "day5_morning_class_15": {
        next: "day5_morning_class_16"
    },

    // ══════════════════════════════════════
    // 유나의 쪽지 (rescued_yuna condition)
    // ══════════════════════════════════════
    "day5_morning_class_16": {
        // rescued_yuna 이면 쪽지 발견, 아니면 no_note로
        condition: "rescued_yuna",
        next: "day5_morning_note",
        fallback: "day5_morning_no_note"
    },

    "day5_morning_note": {
        glitch: { ghostText: "...희망", ghostX: 50, ghostY: 50 },
        next: "day5_morning_note_2"
    },
    "day5_morning_note_2": {
        next: "day5_morning_note_3"
    },
    "day5_morning_note_3": {
        next: "day5_morning_note_4"
    },
    "day5_morning_note_4": {
        next: "day5_morning_note_5"
    },
    "day5_morning_note_5": {
        next: "day5_morning_note_6"
    },
    "day5_morning_note_6": {
        next: "day5_morning_note_7",
        setFlags: ["yuna_final_plan"]
    },
    "day5_morning_note_7": {
        next: "day5_morning_end"
    },

    "day5_morning_no_note": {
        next: "day5_morning_end"
    },

    "day5_morning_end": {
        character: null,
        changeSlot: "lunch",
        next: "day5_lunch_start"
    }
});
