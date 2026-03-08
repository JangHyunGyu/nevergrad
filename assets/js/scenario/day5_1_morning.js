/**
 * Day 5-1: Morning - 최종일 아침. 학교 완전 봉쇄 상태.
 * 위화감 95%. NIGHTMARE 글리치 레벨. 감시 극대화.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    "day5_morning_start": {
        background: "room_morning",
        bgm: "nightmare.mp3",
        character: null,
        glitchLevel: 4, // NIGHTMARE
        next: "day5_morning_start_2"
    },
    "day5_morning_start_2": {
        next: "day5_morning_start_3"
    },
    "day5_morning_start_3": {
        next: "day5_morning_gate"
    },

    // ── 등교 - 완전 봉쇄 ──
    "day5_morning_gate": {
        background: "school_gate",
        character: null,
        glitch: { noise: true, noiseDuration: 300 },
        next: "day5_morning_gate_2"
    },
    "day5_morning_gate_2": {
        next: "day5_morning_gate_3"
    },
    "day5_morning_gate_3": {
        // 은수, 세아, 리인이 함께 기다림
        character: "eunsu_gentle",
        next: "day5_morning_welcome"
    },
    "day5_morning_welcome": {
        next: "day5_morning_welcome_2"
    },
    "day5_morning_welcome_2": {
        character: "sea_smile",
        next: "day5_morning_welcome_3"
    },
    "day5_morning_welcome_3": {
        character: "riin_smile",
        next: "day5_morning_welcome_4"
    },
    "day5_morning_welcome_4": {
        character: null,
        glitch: { expressionFlash: "eunsu_obsessed", flashDuration: 100 },
        next: "day5_morning_classroom"
    },

    // ── 교실 - 이상한 수업 ──
    "day5_morning_classroom": {
        background: "classroom",
        character: null,
        next: "day5_morning_classroom_2"
    },
    "day5_morning_classroom_2": {
        next: "day5_morning_classroom_3"
    },
    "day5_morning_classroom_3": {
        character: "eunsu_gentle",
        next: "day5_morning_class"
    },
    "day5_morning_class": {
        next: "day5_morning_class_2"
    },
    "day5_morning_class_2": {
        glitch: { corruptText: true, corruptIndices: [2, 5, 8, 11] },
        next: "day5_morning_class_3"
    },
    "day5_morning_class_3": {
        character: "eunsu_dark",
        glitch: { screenShake: true, shakeDuration: 300 },
        next: "day5_morning_class_4"
    },
    "day5_morning_class_4": {
        character: null,
        next: "day5_morning_note"
    },

    // ── 쪽지 ──
    "day5_morning_note": {
        next: "day5_morning_note_2",
        condition: "rescued_yuna"
    },
    "day5_morning_note_alt": {
        next: "day5_morning_end"
    },
    "day5_morning_note_2": {
        next: "day5_morning_end",
        setFlags: ["yuna_final_plan"]
    },

    "day5_morning_end": {
        character: null,
        changeSlot: "lunch",
        next: "day5_lunch_start"
    }
});
