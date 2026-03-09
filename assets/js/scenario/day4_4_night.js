/**
 * Day 4-4: Night - 탈출 계획 수립, 설화의 완전한 진실
 * 위화감 90%. 나이트메어 모드 전조. 내일의 탈출을 준비.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    "day4_night_start": {
        background: "room_night",
        bgm: "night_tension.mp3",
        character: null,
        next: "day4_night_start_2"
    },
    "day4_night_start_2": {
        next: "day4_night_start_3"
    },
    "day4_night_start_3": {
        next: "day4_night_phone"
    },

    // ── 전화 - 세아/은수의 감시 ──
    "day4_night_phone": {
        next: "day4_night_phone_2"
    },
    "day4_night_phone_2": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_night_phone_3"
    },
    "day4_night_phone_3": {
        next: "day4_night_eunsu_crack"
    },

    // ── ★ 은수 균열 장면 ──
    "day4_night_eunsu_crack": {
        character: null,
        next: "day4_night_eunsu_crack_2"
    },
    "day4_night_eunsu_crack_2": {
        typingSpeed: 80,
        next: "day4_night_eunsu_crack_3"
    },
    "day4_night_eunsu_crack_3": {
        typingSpeed: 120,
        next: "day4_night_eunsu_crack_4"
    },
    "day4_night_eunsu_crack_4": {
        next: "day4_night_eunsu_crack_5"
    },
    "day4_night_eunsu_crack_5": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_night_plan"
    },

    // ── 탈출 계획 ──
    "day4_night_plan": {
        next: "day4_night_plan_2"
    },
    "day4_night_plan_2": {
        next: "day4_night_plan_branch"
    },
    "day4_night_plan_branch": {
        // 증거량에 따른 분기
        next: "day4_night_plan_3",
        condition: "evidence_compiled"
    },
    "day4_night_plan_branch_alt": {
        next: "day4_night_plan_3"
    },
    "day4_night_plan_3": {
        next: "day4_night_plan_choice"
    },
    "day4_night_plan_choice": {
        choices: [
            {
                next: "day4_night_plan_escape",
                setFlags: ["plan_escape_school"]
            },
            {
                next: "day4_night_plan_expose",
                setFlags: ["plan_expose_truth"]
            },
            {
                next: "day4_night_plan_confront",
                setFlags: ["plan_confront_them"]
            }
        ]
    },
    "day4_night_plan_escape": {
        next: "day4_night_seolhwa"
    },
    "day4_night_plan_expose": {
        next: "day4_night_seolhwa"
    },
    "day4_night_plan_confront": {
        next: "day4_night_seolhwa"
    },

    // ── 설화의 완전한 진실 (꿈 — 체험형 연출) ──
    "day4_night_seolhwa": {
        background: "school_dark",
        bgm: null,
        character: null,
        glitch: { noise: true, noiseDuration: 500 },
        typingSpeed: 80,
        next: "day4_night_seolhwa_2"
    },
    // 글리치: UI 날짜 변경 + 주인공 이름 → '이설화'로 위장
    "day4_night_seolhwa_2": {
        glitch: { heavyGlitch: true, glitchDuration: 800 },
        typingSpeed: 80,
        next: "day4_night_seolhwa_3"
    },
    // 보건실 — 리인의 주사 (1년 전)
    "day4_night_seolhwa_3": {
        background: "nurse_office",
        character: "riin_smile",
        typingSpeed: 100,
        next: "day4_night_seolhwa_4"
    },
    // 교무실 — 피험자 #7 보고서 발견
    "day4_night_seolhwa_4": {
        background: "teacher_office",
        character: "eunsu_cold",
        typingSpeed: 100,
        next: "day4_night_seolhwa_5"
    },
    // 문서 표시 — 글리치로 텍스트 깨짐
    "day4_night_seolhwa_5": {
        character: null,
        glitch: { noise: true, noiseDuration: 400 },
        typingSpeed: 150,
        unskippable: true,
        next: "day4_night_seolhwa_6"
    },
    // 지하실 — 설화의 최종 처리 장면
    "day4_night_seolhwa_6": {
        background: "basement",
        character: "eunsu_dark",
        typingSpeed: 120,
        next: "day4_night_seolhwa_7"
    },
    // 암전 → 글리치 폭발
    "day4_night_seolhwa_7": {
        glitch: { heavyGlitch: true, glitchDuration: 1500 },
        character: null,
        next: "day4_night_seolhwa_8"
    },
    // 현재 꿈속 — 설화와 대면
    "day4_night_seolhwa_8": {
        background: "school_dark",
        character: "seolhwa_ghost",
        typingSpeed: 120,
        next: "day4_night_seolhwa_9"
    },
    "day4_night_seolhwa_9": {
        typingSpeed: 200,
        unskippable: true,
        next: "day4_night_seolhwa_10",
        stats: { seolhwa: { trust: 20 } }
    },
    // 설화 흩어짐 → 기상
    "day4_night_seolhwa_10": {
        glitch: { noise: true, noiseDuration: 300 },
        character: null,
        next: "day4_night_seolhwa_11"
    },
    "day4_night_seolhwa_11": {
        next: "day4_night_end"
    },

    "day4_night_end": {
        background: "room_night",
        bgm: null,
        character: null,
        changeDay: 5, changeSlot: "morning",
        next: "day5_morning_start"
    }
});
