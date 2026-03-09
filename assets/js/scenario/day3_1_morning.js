/**
 * Day 3-1: Morning - 균열
 * 위화감 20%→40%. 우유 위치 바뀜, 세아 안 기다림, 긁힌 사물함,
 * 사진 조각, 설화 목격, 교실 분위기 변화, 필통 위치 바뀜.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    // ── 자취방: 기상 ──
    "day3_morning_start": {
        background: "room_morning",
        bgm: "morning_uneasy.mp3",
        character: null,
        next: "day3_morning_2"
    },
    "day3_morning_2": {
        next: "day3_morning_3"
    },
    "day3_morning_3": {
        next: "day3_morning_4"
    },
    "day3_morning_4": {
        next: "day3_morning_5"
    },
    "day3_morning_5": {
        next: "day3_morning_milk"
    },
    // 냉장고 우유 위치 바뀜
    "day3_morning_milk": {
        next: "day3_morning_milk_2"
    },
    "day3_morning_milk_2": {
        next: "day3_morning_gate"
    },

    // ── 교문: 세아 안 기다림 ──
    "day3_morning_gate": {
        background: "school_gate",
        next: "day3_morning_gate_2"
    },
    "day3_morning_gate_2": {
        next: "day3_morning_gate_3"
    },
    "day3_morning_gate_3": {
        next: "day3_morning_hallway"
    },

    // ── 복도: 긁힌 사물함 ──
    "day3_morning_hallway": {
        background: "hallway",
        next: "day3_morning_locker"
    },
    "day3_morning_locker": {
        next: "day3_morning_locker_2",
        setFlags: ["found_scratched_locker"]
    },
    "day3_morning_locker_2": {
        next: "day3_morning_locker_3"
    },
    "day3_morning_locker_3": {
        next: "day3_morning_locker_4"
    },
    "day3_morning_locker_4": {
        next: "day3_morning_photo",
        setFlags: ["found_photo_fragment"]
    },
    // 사진 조각 발견
    "day3_morning_photo": {
        next: "day3_morning_photo_2"
    },
    "day3_morning_photo_2": {
        next: "day3_morning_seolhwa"
    },

    // ── 복도: 설화 목격 ──
    "day3_morning_seolhwa": {
        background: "corridor",
        next: "day3_morning_seolhwa_2"
    },
    "day3_morning_seolhwa_2": {
        next: "day3_morning_seolhwa_3"
    },
    "day3_morning_seolhwa_3": {
        next: "day3_morning_seolhwa_4"
    },
    "day3_morning_seolhwa_4": {
        next: "day3_morning_seolhwa_5"
    },
    "day3_morning_seolhwa_5": {
        character: "seolhwa_ghost",
        next: "day3_morning_seolhwa_voice"
    },
    "day3_morning_seolhwa_voice": {
        typingSpeed: 120,
        next: "day3_morning_seolhwa_voice_2"
    },
    "day3_morning_seolhwa_voice_2": {
        next: "day3_morning_seolhwa_gone"
    },
    "day3_morning_seolhwa_gone": {
        character: null,
        next: "day3_morning_seolhwa_gone_2"
    },
    "day3_morning_seolhwa_gone_2": {
        next: "day3_morning_seolhwa_gone_3"
    },
    "day3_morning_seolhwa_gone_3": {
        next: "day3_morning_cherry"
    },
    // 벚꽃잎
    "day3_morning_cherry": {
        next: "day3_morning_cherry_2",
        setFlags: ["found_cherry_blossom"]
    },
    "day3_morning_cherry_2": {
        next: "day3_morning_classroom"
    },

    // ── 교실: 분위기 변화 ──
    "day3_morning_classroom": {
        background: "classroom",
        character: null,
        next: "day3_morning_class_2"
    },
    "day3_morning_class_2": {
        next: "day3_morning_class_3"
    },
    "day3_morning_class_3": {
        next: "day3_morning_class_4"
    },
    "day3_morning_class_4": {
        next: "day3_morning_class_sea"
    },
    // 세아 가짜 미소
    "day3_morning_class_sea": {
        character: "sea_smile",
        next: "day3_morning_class_sea_2"
    },
    "day3_morning_class_sea_2": {
        next: "day3_morning_class_sea_3"
    },
    "day3_morning_class_sea_3": {
        next: "day3_morning_class_reply"
    },
    "day3_morning_class_reply": {
        character: null,
        next: "day3_morning_class_sea_sleep"
    },
    "day3_morning_class_sea_sleep": {
        character: "sea_smile",
        next: "day3_morning_class_sea_sleep_2"
    },
    "day3_morning_class_sea_sleep_2": {
        next: "day3_morning_class_eunsu"
    },
    // 은수 "어젯밤 잘 잤어?"
    "day3_morning_class_eunsu": {
        character: "eunsu_smile",
        next: "day3_morning_class_eunsu_2"
    },
    "day3_morning_class_eunsu_2": {
        character: null,
        next: "day3_morning_class_eunsu_reply"
    },
    "day3_morning_class_eunsu_reply": {
        next: "day3_morning_class_eunsu_3"
    },
    "day3_morning_class_eunsu_3": {
        character: "eunsu_smile",
        next: "day3_morning_class_eunsu_4"
    },
    "day3_morning_class_eunsu_4": {
        character: null,
        next: "day3_morning_pencil",
        stats: { eunsu: { danger: 5 } }
    },
    // 필통 위치 바뀜
    "day3_morning_pencil": {
        next: "day3_morning_pencil_2"
    },
    "day3_morning_pencil_2": {
        next: "day3_morning_pencil_3"
    },
    "day3_morning_pencil_3": {
        next: "day3_morning_end"
    },

    // ── Day 3 아침 종료 ──
    "day3_morning_end": {
        changeSlot: "lunch",
        next: "day3_lunch_start"
    }
});
