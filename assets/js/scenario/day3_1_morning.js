/**
 * ============================================================================
 * Day 3-1: Morning - 균열
 * ============================================================================
 * 위화감 20%→60%. 거울 회피, 우유 위치 변경, 등교길 데자뷔,
 * 세아 안 기다림, 긁힌 사물함, 사진 조각, 사물함 내부 필체,
 * 설화의 접근(왼손잡이 질문), 교실 대화 멈춤, 세아의 확인하는 눈,
 * 필통 위치 바뀜.
 * ============================================================================
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    // ===== 자취방: 기상 =====
    "day3_morning_start": {
        background: "room_morning",
        bgm: "morning_uneasy.mp3",
        character: null,
        next: "day3_morning_wake_2"
    },
    "day3_morning_wake_2": {
        next: "day3_morning_wake_3"
    },

    // ===== 거울 회피 =====
    "day3_morning_wake_3": {
        next: "day3_morning_mirror_1"
    },
    "day3_morning_mirror_1": {
        next: "day3_morning_mirror_2"
    },
    "day3_morning_mirror_2": {
        next: "day3_morning_mirror_3",
        setFlags: ["mirror_avoidance_1"]
    },
    "day3_morning_mirror_3": {
        next: "day3_morning_milk_1"
    },

    // ===== 냉장고: 우유 위치 변경 =====
    "day3_morning_milk_1": {
        next: "day3_morning_milk_2"
    },
    "day3_morning_milk_2": {
        next: "day3_morning_commute_1"
    },

    // ===== 등교길: 데자뷔 =====
    "day3_morning_commute_1": {
        background: "street_morning",
        character: null,
        next: "day3_morning_commute_2"
    },
    "day3_morning_commute_2": {
        next: "day3_morning_commute_3"
    },
    "day3_morning_commute_3": {
        character: "classmate",
        next: "day3_morning_commute_4"
    },
    "day3_morning_commute_4": {
        next: "day3_morning_commute_5"
    },
    "day3_morning_commute_5": {
        character: null,
        next: "day3_morning_commute_6"
    },
    "day3_morning_commute_6": {
        next: "day3_morning_commute_7",
        stats: { dejavu: 1 },
        glitch: { type: "flicker", duration: 300 }
    },
    "day3_morning_commute_7": {
        next: "day3_morning_commute_8"
    },
    "day3_morning_commute_8": {
        next: "day3_morning_gate_1"
    },

    // ===== 교문: 세아 안 기다림 =====
    "day3_morning_gate_1": {
        background: "school_gate",
        character: null,
        next: "day3_morning_gate_2"
    },
    "day3_morning_gate_2": {
        next: "day3_morning_gate_3"
    },
    "day3_morning_gate_3": {
        next: "day3_morning_gate_4"
    },
    "day3_morning_gate_4": {
        next: "day3_morning_gate_5"
    },
    "day3_morning_gate_5": {
        next: "day3_morning_locker_1"
    },

    // ===== 복도: 긁힌 사물함 =====
    "day3_morning_locker_1": {
        background: "hallway",
        character: null,
        next: "day3_morning_locker_2"
    },
    "day3_morning_locker_2": {
        next: "day3_morning_locker_3",
        setFlags: ["found_scratched_locker"]
    },
    "day3_morning_locker_3": {
        next: "day3_morning_locker_4"
    },
    "day3_morning_locker_4": {
        next: "day3_morning_locker_5"
    },
    "day3_morning_locker_5": {
        next: "day3_morning_photo_1",
        setFlags: ["found_photo_fragment"]
    },

    // ===== 사진 조각 발견 =====
    "day3_morning_photo_1": {
        next: "day3_morning_photo_2"
    },
    "day3_morning_photo_2": {
        next: "day3_morning_inscription_1"
    },

    // ===== 사물함 내부 필체 =====
    "day3_morning_inscription_1": {
        next: "day3_morning_inscription_2"
    },
    "day3_morning_inscription_2": {
        next: "day3_morning_inscription_3",
        setFlags: ["found_locker_inscription"]
    },
    "day3_morning_inscription_3": {
        next: "day3_morning_seolhwa_1"
    },

    // ===== 설화의 접근 =====
    "day3_morning_seolhwa_1": {
        background: "corridor",
        character: null,
        next: "day3_morning_seolhwa_2"
    },
    "day3_morning_seolhwa_2": {
        next: "day3_morning_seolhwa_3"
    },
    "day3_morning_seolhwa_3": {
        character: "seolhwa_quiet",
        typingSpeed: 120,
        next: "day3_morning_seolhwa_4"
    },
    "day3_morning_seolhwa_4": {
        character: null,
        next: "day3_morning_seolhwa_5"
    },
    "day3_morning_seolhwa_5": {
        character: "seolhwa_quiet",
        next: "day3_morning_seolhwa_6"
    },
    "day3_morning_seolhwa_6": {
        character: null,
        next: "day3_morning_seolhwa_7"
    },
    "day3_morning_seolhwa_7": {
        character: "seolhwa_sad",
        typingSpeed: 120,
        next: "day3_morning_seolhwa_8"
    },
    "day3_morning_seolhwa_8": {
        character: null,
        next: "day3_morning_seolhwa_9"
    },
    "day3_morning_seolhwa_9": {
        next: "day3_morning_seolhwa_10"
    },
    "day3_morning_seolhwa_10": {
        next: "day3_morning_classroom_1"
    },

    // ===== 교실: 세아의 균열 =====
    "day3_morning_classroom_1": {
        background: "classroom",
        character: null,
        next: "day3_morning_classroom_2"
    },
    "day3_morning_classroom_2": {
        next: "day3_morning_classroom_3"
    },
    "day3_morning_classroom_3": {
        next: "day3_morning_classroom_4"
    },
    "day3_morning_classroom_4": {
        next: "day3_morning_classroom_5"
    },
    "day3_morning_classroom_5": {
        next: "day3_morning_sea_1"
    },

    // ===== 세아 가짜 미소 =====
    "day3_morning_sea_1": {
        character: "sea_smile",
        next: "day3_morning_sea_2"
    },
    "day3_morning_sea_2": {
        next: "day3_morning_sea_3"
    },
    "day3_morning_sea_3": {
        character: null,
        next: "day3_morning_sea_4"
    },
    "day3_morning_sea_4": {
        character: "sea_smile",
        next: "day3_morning_sea_5"
    },
    "day3_morning_sea_5": {
        character: null,
        next: "day3_morning_sea_6"
    },
    "day3_morning_sea_6": {
        next: "day3_morning_sea_7"
    },
    "day3_morning_sea_7": {
        character: null,
        next: "day3_morning_sea_8"
    },
    "day3_morning_sea_8": {
        character: "sea_cold",
        next: "day3_morning_sea_9",
        stats: { sea: { danger: 3 } }
    },
    "day3_morning_sea_9": {
        character: null,
        next: "day3_morning_pencil_1"
    },

    // ===== 필통 위치 바뀜 =====
    "day3_morning_pencil_1": {
        next: "day3_morning_pencil_2"
    },
    "day3_morning_pencil_2": {
        next: "day3_morning_pencil_3"
    },
    "day3_morning_pencil_3": {
        next: "day3_morning_end"
    },

    // ===== Day 3 아침 종료 =====
    "day3_morning_end": {
        changeSlot: "lunch",
        next: "day3_lunch_start"
    }
});
