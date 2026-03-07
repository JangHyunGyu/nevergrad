/**
 * Day 3-2: Lunch - 옥상에서 유나의 메모리카드, 문이 잠김
 * 위화감 30%. 핵심 이벤트 씬.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    "day3_lunch_start": {
        background: "classroom",
        bgm: "daily_tense.mp3",
        character: null,
        next: "day3_lunch_yuna_note"
    },
    // 유나가 쪽지를 슬쩍 전달
    "day3_lunch_yuna_note": {
        next: "day3_lunch_yuna_note_2"
    },
    "day3_lunch_yuna_note_2": {
        next: "day3_lunch_rooftop"
    },

    // 옥상 - 유나의 고백 + 메모리카드
    "day3_lunch_rooftop": {
        background: "rooftop",
        character: "yuna_scared",
        next: "day3_lunch_rooftop_2"
    },
    "day3_lunch_rooftop_2": {
        character: "yuna_desperate",
        next: "day3_lunch_rooftop_3"
    },
    "day3_lunch_rooftop_3": {
        next: "day3_lunch_rooftop_4",
        stats: { yuna: { trust: 10 } },
        setFlags: ["yuna_memory_card"]
    },
    "day3_lunch_rooftop_4": {
        character: "yuna_cry",
        next: "day3_lunch_rooftop_5"
    },
    "day3_lunch_rooftop_5": {
        next: "day3_lunch_door_locked"
    },

    // 옥상 문이 잠김
    "day3_lunch_door_locked": {
        character: null,
        glitch: { noise: true, noiseDuration: 300 },
        next: "day3_lunch_door_locked_2"
    },
    "day3_lunch_door_locked_2": {
        next: "day3_lunch_door_locked_3"
    },
    "day3_lunch_door_locked_3": {
        character: "yuna_scared",
        next: "day3_lunch_door_choice"
    },
    "day3_lunch_door_choice": {
        choices: [
            {
                next: "day3_lunch_door_bang",
                setFlags: ["door_made_noise"]
            },
            {
                next: "day3_lunch_door_wait",
                stats: { yuna: { trust: 5 } }
            }
        ]
    },
    "day3_lunch_door_bang": {
        next: "day3_lunch_door_open"
    },
    "day3_lunch_door_wait": {
        next: "day3_lunch_door_open"
    },
    "day3_lunch_door_open": {
        character: null,
        next: "day3_lunch_end"
    },

    "day3_lunch_end": {
        background: "classroom",
        next: null
    }
});
