/**
 * Day 3-1: Morning - 불쾌한 골짜기 시작 (위화감 20%)
 * 빈 사물함, 이상한 교실 분위기
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    "day3_morning_start": {
        background: "home",
        bgm: "morning_uneasy.mp3",
        character: null,
        next: "day3_morning_2"
    },
    "day3_morning_2": {
        background: "school_gate",
        next: "day3_morning_hallway"
    },
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
        next: "day3_morning_classroom"
    },
    "day3_morning_classroom": {
        background: "classroom",
        character: null,
        next: "day3_morning_class_2"
    },
    "day3_morning_class_2": {
        next: "day3_morning_class_3"
    },
    "day3_morning_class_3": {
        character: "eunsu_smile",
        next: "day3_morning_class_4"
    },
    "day3_morning_class_4": {
        character: null,
        next: "day3_morning_end",
        stats: { eunsu: { danger: 5 } }
    },

    "day3_morning_end": {
        changeSlot: "lunch",
        next: "day3_lunch_start"
    }
});
