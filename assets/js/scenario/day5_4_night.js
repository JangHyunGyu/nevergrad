/**
 * Day 5-4: Night - ★ ENDINGS ★
 *
 * 엔딩 분류:
 * A. TRUE END   - 탈출 + 유나 동행 + 증거 공개 → 학교 폐쇄
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
        background: "corridor",
        bgm: "ending_hope.mp3",
        character: null,
        next: "day5_ending_true_2"
    },
    "day5_ending_true_2": {
        next: "day5_ending_true_3"
    },
    "day5_ending_true_3": {
        next: "day5_ending_true_4"
    },
    "day5_ending_true_4": {
        next: "day5_ending_true_5"
    },
    "day5_ending_true_5": {
        next: "day5_ending_true_6"
    },
    "day5_ending_true_6": {
        next: "day5_ending_true_7"
    },
    "day5_ending_true_7": {
        next: "day5_ending_true_8"
    },
    "day5_ending_true_8": {
        next: "day5_ending_true_9"
    },
    "day5_ending_true_9": {
        background: "cherry_blossom",
        next: "day5_ending_true_10"
    },
    "day5_ending_true_10": {
        character: "yuna_normal",
        next: "day5_ending_true_11"
    },
    "day5_ending_true_11": {
        next: "day5_ending_true_12"
    },
    "day5_ending_true_12": {
        character: null,
        next: "day5_ending_true_13"
    },
    "day5_ending_true_13": {
        next: "day5_ending_true_14"
    },
    "day5_ending_true_14": {
        next: "day5_ending_true_15"
    },
    "day5_ending_true_15": {
        next: "day5_ending_true_16"
    },
    "day5_ending_true_16": {
        next: "day5_ending_true_17"
    },
    "day5_ending_true_17": {
        character: "seolhwa_fading",
        next: "day5_ending_true_18"
    },
    "day5_ending_true_18": {
        next: "day5_ending_true_19"
    },
    "day5_ending_true_19": {
        character: null,
        next: "day5_ending_true_20"
    },
    "day5_ending_true_20": {
        next: "day5_ending_true_21"
    },
    "day5_ending_true_21": {
        character: "yuna_normal",
        next: "day5_ending_true_22"
    },
    "day5_ending_true_22": {
        next: "day5_ending_true_23"
    },
    "day5_ending_true_23": {
        character: null,
        next: "day5_ending_true_24"
    },
    "day5_ending_true_24": {
        next: "day5_ending_true_25"
    },
    "day5_ending_true_25": {
        next: "day5_ending_true_title"
    },
    "day5_ending_true_title": {
        endingTitle: "TRUE END",
        endingSubtitle: "day5_ending_true_subtitle",
        unskippable: true,
        next: "day5_postcredit_1"
    },

    // ── 크레딧 후 쿠키신 ──
    "day5_postcredit_1": {
        background: "black",
        bgm: null,
        character: null,
        glitch: { noise: true },
        typingSpeed: 80,
        next: "day5_postcredit_2"
    },
    "day5_postcredit_2": {
        next: "day5_postcredit_3"
    },
    "day5_postcredit_3": {
        typingSpeed: 60,
        next: "day5_postcredit_4"
    },
    "day5_postcredit_4": {
        next: "day5_postcredit_5"
    },
    "day5_postcredit_5": {
        next: "day5_postcredit_6"
    },
    "day5_postcredit_6": {
        next: "day5_postcredit_7"
    },
    "day5_postcredit_7": {
        glitch: { heavyGlitch: true },
        typingSpeed: 100,
        next: "day5_postcredit_8"
    },
    "day5_postcredit_8": {
        next: "day5_postcredit_end"
    },
    "day5_postcredit_end": {
        next: null
    },

    // ══════════════════════════════════════════
    // B. ESCAPE END - "생존자"
    // ══════════════════════════════════════════
    "day5_ending_escape": {
        background: "corridor_dark",
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
        next: "day5_ending_escape_5"
    },
    "day5_ending_escape_5": {
        next: "day5_ending_escape_6"
    },
    "day5_ending_escape_6": {
        next: "day5_ending_escape_7"
    },
    "day5_ending_escape_7": {
        next: "day5_ending_escape_8"
    },
    "day5_ending_escape_8": {
        next: "day5_ending_escape_9"
    },
    "day5_ending_escape_9": {
        next: "day5_ending_escape_10"
    },
    "day5_ending_escape_10": {
        glitch: { noise: true },
        next: "day5_ending_escape_11"
    },
    "day5_ending_escape_11": {
        glitch: { ghostText: "day5_ending_escape_ghost", ghostDuration: 3000 },
        next: "day5_ending_escape_title"
    },
    "day5_ending_escape_title": {
        endingTitle: "ESCAPE END",
        endingSubtitle: "day5_ending_escape_subtitle",
        unskippable: true,
        next: null
    },

    // ══════════════════════════════════════════
    // C. RESIST END - "미완의 탈출"
    // ══════════════════════════════════════════
    "day5_ending_resist": {
        background: "garden",
        bgm: "ending_bittersweet.mp3",
        character: null,
        next: "day5_ending_resist_2"
    },
    "day5_ending_resist_2": {
        next: "day5_ending_resist_3"
    },
    "day5_ending_resist_3": {
        next: "day5_ending_resist_4"
    },
    "day5_ending_resist_4": {
        next: "day5_ending_resist_5"
    },
    "day5_ending_resist_5": {
        next: "day5_ending_resist_6"
    },
    "day5_ending_resist_6": {
        character: "seolhwa_fading",
        next: "day5_ending_resist_7"
    },
    "day5_ending_resist_7": {
        next: "day5_ending_resist_8"
    },
    "day5_ending_resist_8": {
        next: "day5_ending_resist_9"
    },
    "day5_ending_resist_9": {
        character: null,
        next: "day5_ending_resist_10"
    },
    "day5_ending_resist_10": {
        character: "seolhwa_fading",
        next: "day5_ending_resist_11"
    },
    "day5_ending_resist_11": {
        next: "day5_ending_resist_12"
    },
    "day5_ending_resist_12": {
        next: "day5_ending_resist_title"
    },
    "day5_ending_resist_title": {
        endingTitle: "RESIST END",
        endingSubtitle: "day5_ending_resist_subtitle",
        unskippable: true,
        next: null
    },

    // ══════════════════════════════════════════
    // D. CAGE END - "새장"
    // ══════════════════════════════════════════
    "day5_ending_cage": {
        background: "classroom",
        bgm: "ending_dark.mp3",
        character: null,
        next: "day5_ending_cage_2"
    },
    "day5_ending_cage_2": {
        next: "day5_ending_cage_3"
    },
    "day5_ending_cage_3": {
        character: "eunsu_smile",
        next: "day5_ending_cage_4"
    },
    "day5_ending_cage_4": {
        character: null,
        next: "day5_ending_cage_5"
    },
    "day5_ending_cage_5": {
        next: "day5_ending_cage_6"
    },
    "day5_ending_cage_6": {
        next: "day5_ending_cage_7"
    },
    "day5_ending_cage_7": {
        next: "day5_ending_cage_8"
    },
    "day5_ending_cage_8": {
        next: "day5_ending_cage_9"
    },
    "day5_ending_cage_9": {
        character: "sea_smile",
        next: "day5_ending_cage_10"
    },
    "day5_ending_cage_10": {
        character: null,
        next: "day5_ending_cage_11"
    },
    "day5_ending_cage_11": {
        next: "day5_ending_cage_12"
    },
    "day5_ending_cage_12": {
        character: "eunsu_smile",
        next: "day5_ending_cage_13"
    },
    "day5_ending_cage_13": {
        character: null,
        next: "day5_ending_cage_14"
    },
    "day5_ending_cage_14": {
        next: "day5_ending_cage_15"
    },
    "day5_ending_cage_15": {
        next: "day5_ending_cage_16"
    },
    "day5_ending_cage_16": {
        glitch: { heavyGlitch: true },
        next: "day5_ending_cage_title"
    },
    "day5_ending_cage_title": {
        endingTitle: "CAGE END",
        endingSubtitle: "day5_ending_cage_subtitle",
        unskippable: true,
        next: "day5_cage_loop"
    },

    // CAGE END 무한 루프 — 평화로운 일상이 영원히 반복되는 새장
    "day5_cage_loop": {
        background: "classroom",
        bgm: "spring_bright.mp3",
        character: null,
        cageLoop: true
    },

    // ══════════════════════════════════════════
    // E. FORGET END - "리셋"
    // ══════════════════════════════════════════
    "day5_ending_forget": {
        background: "black",
        bgm: null,
        character: null,
        glitch: { heavyGlitch: true },
        next: "day5_ending_forget_2"
    },
    "day5_ending_forget_2": {
        next: "day5_ending_forget_3"
    },
    "day5_ending_forget_3": {
        next: "day5_ending_forget_4"
    },
    "day5_ending_forget_4": {
        background: "home",
        bgm: "morning_peaceful.mp3",
        next: "day5_ending_forget_5"
    },
    "day5_ending_forget_5": {
        next: "day5_ending_forget_6"
    },
    "day5_ending_forget_6": {
        next: "day5_ending_forget_7"
    },
    "day5_ending_forget_7": {
        next: "day5_ending_forget_8"
    },
    "day5_ending_forget_8": {
        next: "day5_ending_forget_9"
    },
    "day5_ending_forget_9": {
        next: "day5_ending_forget_10"
    },
    "day5_ending_forget_10": {
        next: "day5_ending_forget_11"
    },
    "day5_ending_forget_11": {
        next: "day5_ending_forget_12"
    },
    "day5_ending_forget_12": {
        next: "day5_ending_forget_13"
    },
    "day5_ending_forget_13": {
        next: "day5_ending_forget_14"
    },
    "day5_ending_forget_14": {
        next: "day5_ending_forget_15"
    },
    "day5_ending_forget_15": {
        glitch: { ghostText: "day5_ending_forget_ghost", ghostDuration: 3000 },
        next: "day5_ending_forget_16"
    },
    "day5_ending_forget_16": {
        next: "day5_ending_forget_sea_branch"
    },

    // ── 세아 호감도 MAX 추가 장면 ──
    "day5_ending_forget_sea_branch": {
        affinityChar: "sea",
        affinityBranches: [
            { minAffinity: 60, next: "day5_ending_forget_sea_max" },
            { minAffinity: 0, next: "day5_ending_forget_title" }
        ]
    },
    "day5_ending_forget_sea_max": {
        background: "school_gate",
        character: "sea_smile",
        next: "day5_ending_forget_sea_max_2"
    },
    "day5_ending_forget_sea_max_2": {
        next: "day5_ending_forget_sea_max_3"
    },
    "day5_ending_forget_sea_max_3": {
        next: "day5_ending_forget_sea_max_4"
    },
    "day5_ending_forget_sea_max_4": {
        next: "day5_ending_forget_title"
    },
    "day5_ending_forget_title": {
        endingTitle: "FORGET END",
        endingSubtitle: "day5_ending_forget_subtitle",
        unskippable: true,
        next: null
    },

    // ══════════════════════════════════════════
    // F. GHOST END - "잔향"
    // ══════════════════════════════════════════
    "day5_ending_ghost": {
        background: "corridor_dark",
        bgm: "ending_ghost.mp3",
        character: null,
        glitch: { heavyGlitch: true },
        next: "day5_ending_ghost_2"
    },
    "day5_ending_ghost_2": {
        next: "day5_ending_ghost_3"
    },
    "day5_ending_ghost_3": {
        next: "day5_ending_ghost_4"
    },
    "day5_ending_ghost_4": {
        next: "day5_ending_ghost_5"
    },
    "day5_ending_ghost_5": {
        next: "day5_ending_ghost_6"
    },
    "day5_ending_ghost_6": {
        next: "day5_ending_ghost_7"
    },
    "day5_ending_ghost_7": {
        next: "day5_ending_ghost_8"
    },
    "day5_ending_ghost_8": {
        next: "day5_ending_ghost_9"
    },
    "day5_ending_ghost_9": {
        next: "day5_ending_ghost_10"
    },
    "day5_ending_ghost_10": {
        background: "classroom",
        bgm: "morning_peaceful.mp3",
        next: "day5_ending_ghost_11"
    },
    "day5_ending_ghost_11": {
        next: "day5_ending_ghost_12"
    },
    "day5_ending_ghost_12": {
        next: "day5_ending_ghost_13"
    },
    "day5_ending_ghost_13": {
        next: "day5_ending_ghost_14"
    },
    "day5_ending_ghost_14": {
        next: "day5_ending_ghost_15"
    },
    "day5_ending_ghost_15": {
        glitch: { ghostText: "day5_ending_ghost_whisper", ghostDuration: 3000 },
        next: "day5_ending_ghost_16"
    },
    "day5_ending_ghost_16": {
        next: "day5_ending_ghost_17"
    },
    "day5_ending_ghost_17": {
        next: "day5_ending_ghost_18"
    },
    "day5_ending_ghost_18": {
        next: "day5_ending_ghost_title"
    },
    "day5_ending_ghost_title": {
        endingTitle: "GHOST END",
        endingSubtitle: "day5_ending_ghost_subtitle",
        unskippable: true,
        next: null
    }
});
