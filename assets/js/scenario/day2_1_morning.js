/**
 * ============================================================================
 * Day 2-1: Morning - 달콤한 감시의 시작
 * ============================================================================
 * 로맨스 90%, 위화감 10%. 세아의 밀착, 은수의 관심 강화.
 * - 전학교 연락 없음, 세아 새벽 1시 메시지
 * - 교문: 세아가 기다리고 있음
 * - 교실: 은수 출석, "이전 학교 쪽에서 연락 온 건 없죠?"
 * - 수업: 세아 시험정보, 설화 관찰 (greeted_seolhwa 조건부)
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    // ===== 자취방: 기상 =====
    "day2_morning_start": {
        background: "room_morning",
        bgm: "morning_bright.mp3",
        character: null,
        next: "day2_morning_2"
    },
    "day2_morning_2": {
        next: "day2_morning_3"
    },
    "day2_morning_3": {
        next: "day2_morning_4"
    },
    "day2_morning_4": {
        next: "day2_morning_5"
    },
    "day2_morning_5": {
        next: "day2_morning_6"
    },
    "day2_morning_6": {
        next: "day2_morning_7"
    },
    "day2_morning_7": {
        next: "day2_morning_8"
    },
    "day2_morning_8": {
        next: "day2_morning_9"
    },

    // ===== 교문: 세아가 기다리고 있음 =====
    "day2_morning_9": {
        background: "school_gate",
        character: "sea_smile",
        next: "day2_morning_sea_1"
    },
    "day2_morning_sea_1": {
        next: "day2_morning_sea_2"
    },
    "day2_morning_sea_2": {
        next: "day2_morning_sea_3"
    },
    "day2_morning_sea_3": {
        next: "day2_morning_sea_4"
    },
    "day2_morning_sea_4": {
        next: "day2_morning_sea_5"
    },
    "day2_morning_sea_5": {
        next: "day2_morning_sea_6"
    },
    "day2_morning_sea_6": {
        next: "day2_morning_sea_7"
    },
    "day2_morning_sea_7": {
        next: "day2_morning_sea_8"
    },
    "day2_morning_sea_8": {
        next: "day2_morning_sea_9",
        stats: { sea: { affinity: 3 } }
    },
    "day2_morning_sea_9": {
        next: "day2_morning_sea_10"
    },
    "day2_morning_sea_10": {
        next: "day2_morning_sea_11",
        stats: { sea: { danger: 3 } }
    },

    // ===== 교실: 은수 출석 =====
    "day2_morning_sea_11": {
        background: "classroom",
        character: null,
        next: "day2_morning_class_1"
    },
    "day2_morning_class_1": {
        next: "day2_morning_class_2"
    },
    "day2_morning_class_2": {
        next: "day2_morning_class_3"
    },
    "day2_morning_class_3": {
        character: "eunsu_smile",
        next: "day2_morning_eunsu_1"
    },
    "day2_morning_eunsu_1": {
        next: "day2_morning_eunsu_2"
    },
    "day2_morning_eunsu_2": {
        next: "day2_morning_eunsu_3"
    },
    "day2_morning_eunsu_3": {
        next: "day2_morning_eunsu_4"
    },
    "day2_morning_eunsu_4": {
        next: "day2_morning_eunsu_5",
        stats: { eunsu: { danger: 3 } }
    },
    "day2_morning_eunsu_5": {
        next: "day2_morning_eunsu_6"
    },
    "day2_morning_eunsu_6": {
        character: null,
        next: "day2_morning_lesson_1"
    },

    // ===== 오전 수업: 세아 시험정보 =====
    "day2_morning_lesson_1": {
        next: "day2_morning_lesson_2"
    },
    "day2_morning_lesson_2": {
        character: "sea_smile",
        next: "day2_morning_lesson_3"
    },
    "day2_morning_lesson_3": {
        next: "day2_morning_lesson_4"
    },
    "day2_morning_lesson_4": {
        character: null,
        next: "day2_morning_seolhwa_check",
        stats: { sea: { affinity: 2 } }
    },

    // ===== 설화 관찰 (greeted_seolhwa 조건부) =====
    "day2_morning_seolhwa_check": {
        branches: [
            { condition: "greeted_seolhwa", next: "day2_morning_seolhwa_1" },
            { next: "day2_morning_end" }
        ]
    },
    "day2_morning_seolhwa_1": {
        next: "day2_morning_seolhwa_2"
    },
    "day2_morning_seolhwa_2": {
        next: "day2_morning_seolhwa_3"
    },
    "day2_morning_seolhwa_3": {
        next: "day2_morning_seolhwa_4"
    },
    "day2_morning_seolhwa_4": {
        next: "day2_morning_seolhwa_5"
    },
    "day2_morning_seolhwa_5": {
        next: "day2_morning_seolhwa_6"
    },
    "day2_morning_seolhwa_6": {
        next: "day2_morning_seolhwa_7"
    },
    "day2_morning_seolhwa_7": {
        next: "day2_morning_end",
        glitch: { silence: true, silenceDuration: 2000 }
    },

    // ===== 아침 종료 =====
    "day2_morning_end": {
        background: "classroom",
        character: null,
        changeSlot: "lunch",
        next: "day2_lunch_start"
    }
});
