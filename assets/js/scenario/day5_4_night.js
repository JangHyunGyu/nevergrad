/**
 * Day 5-4: Night - ★ ENDINGS ★
 *
 * 엔딩 분류:
 * A. TRUE END   - 탈출 + 유나 구출 + 증거 공개 → 학교 폐쇄
 * B. ESCAPE END - 탈출 성공 (유나 없이) → 홀로 증언
 * C. RESIST END - 붙잡혔으나 저항 + 설화 개입 → 불완전한 탈출
 * D. CAGE END   - 은수와 남음 → 영원한 학교
 * E. FORGET END - 약물 투여 → 기억 상실, 1일차로 회귀
 * F. GHOST END  - 설화처럼 됨 → 다음 전학생에게 경고
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    "day5_night_start": {
        background: "black",
        bgm: null,
        character: null,
        next: "day5_night_routing"
    },

    // ── 엔딩 라우터 ──
    "day5_night_routing": {
        // 엔진에서 플래그 기반으로 분기 처리
        branches: [
            { condition: ["broke_through_eunsu", "escape_with_yuna"], next: "day5_ending_true" },
            { condition: ["broke_through_eunsu"], next: "day5_ending_escape" },
            { condition: ["seolhwa_intervention"], next: "day5_ending_resist" },
            { condition: ["stayed_with_eunsu"], next: "day5_ending_cage" },
            { condition: ["final_resistance"], excludeCondition: ["seolhwa_intervention"], next: "day5_ending_ghost" },
            { condition: [], next: "day5_ending_forget" }
        ]
    },

    // ══════════════════════════════════════════
    // A. TRUE END - "졸업"
    // ══════════════════════════════════════════
    "day5_ending_true": {
        background: "sunset_outside",
        bgm: "ending_hope.mp3",
        character: null,
        next: "day5_ending_true_2"
    },
    "day5_ending_true_2": {
        next: "day5_ending_true_3"
    },
    "day5_ending_true_3": {
        character: "yuna_smile",
        next: "day5_ending_true_4"
    },
    "day5_ending_true_4": {
        next: "day5_ending_true_5"
    },
    "day5_ending_true_5": {
        character: null,
        next: "day5_ending_true_6"
    },
    "day5_ending_true_6": {
        next: "day5_ending_true_7"
    },
    "day5_ending_true_7": {
        // 설화의 마지막 메시지
        character: "seolhwa_smile",
        next: "day5_ending_true_8"
    },
    "day5_ending_true_8": {
        character: null,
        next: "day5_ending_true_title"
    },
    "day5_ending_true_title": {
        endingTitle: "TRUE END",
        endingSubtitle: "day5_ending_true_subtitle",
        next: null
    },

    // ══════════════════════════════════════════
    // B. ESCAPE END - "생존자"
    // ══════════════════════════════════════════
    "day5_ending_escape": {
        background: "night_rain",
        bgm: "ending_melancholy.mp3",
        character: null,
        next: "day5_ending_escape_2"
    },
    "day5_ending_escape_2": {
        next: "day5_ending_escape_3"
    },
    "day5_ending_escape_3": {
        next: "day5_ending_escape_4"
    },
    "day5_ending_escape_4": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day5_ending_escape_title"
    },
    "day5_ending_escape_title": {
        endingTitle: "ESCAPE END",
        endingSubtitle: "day5_ending_escape_subtitle",
        next: null
    },

    // ══════════════════════════════════════════
    // C. RESIST END - "미완의 탈출"
    // ══════════════════════════════════════════
    "day5_ending_resist": {
        background: "school_dawn",
        bgm: "ending_bittersweet.mp3",
        character: null,
        next: "day5_ending_resist_2"
    },
    "day5_ending_resist_2": {
        next: "day5_ending_resist_3"
    },
    "day5_ending_resist_3": {
        character: "seolhwa_ghost",
        next: "day5_ending_resist_4"
    },
    "day5_ending_resist_4": {
        character: null,
        next: "day5_ending_resist_title"
    },
    "day5_ending_resist_title": {
        endingTitle: "RESIST END",
        endingSubtitle: "day5_ending_resist_subtitle",
        next: null
    },

    // ══════════════════════════════════════════
    // D. CAGE END - "새장"
    // ══════════════════════════════════════════
    "day5_ending_cage": {
        background: "classroom",
        bgm: "ending_dark.mp3",
        character: "eunsu_gentle",
        next: "day5_ending_cage_2"
    },
    "day5_ending_cage_2": {
        next: "day5_ending_cage_3"
    },
    "day5_ending_cage_3": {
        next: "day5_ending_cage_4"
    },
    "day5_ending_cage_4": {
        glitch: { heavyGlitch: true, glitchDuration: 2000 },
        character: null,
        next: "day5_ending_cage_title"
    },
    "day5_ending_cage_title": {
        endingTitle: "CAGE END",
        endingSubtitle: "day5_ending_cage_subtitle",
        next: null
    },

    // ══════════════════════════════════════════
    // E. FORGET END - "리셋"
    // ══════════════════════════════════════════
    "day5_ending_forget": {
        background: "black",
        bgm: null,
        character: null,
        glitch: { heavyGlitch: true, glitchDuration: 3000 },
        next: "day5_ending_forget_2"
    },
    "day5_ending_forget_2": {
        next: "day5_ending_forget_3"
    },
    "day5_ending_forget_3": {
        // 1일차 아침으로 되돌아감
        background: "room_morning",
        bgm: "morning_peaceful.mp3",
        next: "day5_ending_forget_4"
    },
    "day5_ending_forget_4": {
        next: "day5_ending_forget_5"
    },
    "day5_ending_forget_5": {
        glitch: { ghostText: "day5_ending_forget_ghost", ghostDuration: 3000 },
        next: "day5_ending_forget_title"
    },
    "day5_ending_forget_title": {
        endingTitle: "FORGET END",
        endingSubtitle: "day5_ending_forget_subtitle",
        next: null
    },

    // ══════════════════════════════════════════
    // F. GHOST END - "잔향"
    // ══════════════════════════════════════════
    "day5_ending_ghost": {
        background: "school_dark",
        bgm: "ending_ghost.mp3",
        character: null,
        glitch: { heavyGlitch: true, glitchDuration: 2000 },
        next: "day5_ending_ghost_2"
    },
    "day5_ending_ghost_2": {
        next: "day5_ending_ghost_3"
    },
    "day5_ending_ghost_3": {
        next: "day5_ending_ghost_4"
    },
    "day5_ending_ghost_4": {
        // 새로운 전학생 시점
        background: "classroom",
        bgm: "morning_peaceful.mp3",
        next: "day5_ending_ghost_5"
    },
    "day5_ending_ghost_5": {
        glitch: { ghostText: "day5_ending_ghost_whisper", ghostDuration: 3000 },
        next: "day5_ending_ghost_title"
    },
    "day5_ending_ghost_title": {
        endingTitle: "GHOST END",
        endingSubtitle: "day5_ending_ghost_subtitle",
        next: null
    }
});
