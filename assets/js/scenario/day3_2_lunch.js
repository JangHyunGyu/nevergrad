/**
 * Day 3-2: Lunch - 유나의 폭로
 * 위화감 30%. 유나 쪽지→옥상, 메모리카드, 잠긴 문, 선택지 2개.
 * 대안: 세아와 점심(질투), 리인 보건실(음료), 혼자 교실(설화 책상 글씨).
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    // ── 점심 시작: 쪽지 발견 & 루트 선택 ──
    "day3_lunch_start": {
        background: "classroom",
        bgm: "daily_tense.mp3",
        character: null,
        next: "day3_lunch_note"
    },
    "day3_lunch_note": {
        next: "day3_lunch_note_2"
    },
    "day3_lunch_note_2": {
        next: "day3_lunch_choice"
    },
    "day3_lunch_choice": {
        choices: [
            { next: "day3_lunch_rooftop" },
            { next: "day3_lunch_sea" },
            { next: "day3_lunch_riin" },
            { next: "day3_lunch_alone" }
        ]
    },

    // ══════════════════════════════════════
    //  옥상 루트: 유나의 메모리카드
    // ══════════════════════════════════════
    "day3_lunch_rooftop": {
        background: "rooftop",
        character: "yuna_scared",
        next: "day3_lunch_rooftop_2"
    },
    "day3_lunch_rooftop_2": {
        next: "day3_lunch_rooftop_3"
    },
    "day3_lunch_rooftop_3": {
        next: "day3_lunch_rooftop_4",
        setFlags: ["yuna_memory_card"],
        stats: { yuna: { trust: 10 } }
    },
    "day3_lunch_rooftop_4": {
        next: "day3_lunch_rooftop_5"
    },
    "day3_lunch_rooftop_5": {
        character: null,
        next: "day3_lunch_rooftop_6"
    },

    // 잠긴 문 [글리치: 노이즈]
    "day3_lunch_rooftop_6": {
        glitch: { noise: true, noiseDuration: 300 },
        next: "day3_lunch_door_locked"
    },
    "day3_lunch_door_locked": {
        next: "day3_lunch_door_locked_2"
    },
    "day3_lunch_door_locked_2": {
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
        character: null,
        next: "day3_lunch_door_open"
    },
    "day3_lunch_door_wait": {
        character: null,
        next: "day3_lunch_door_open"
    },
    "day3_lunch_door_open": {
        next: "day3_lunch_end"
    },

    // ══════════════════════════════════════
    //  세아 루트: 세아와 점심 (유나 질투)
    // ══════════════════════════════════════
    "day3_lunch_sea": {
        background: "classroom",
        character: "sea_smile",
        next: "day3_lunch_sea_2",
        stats: { sea: { affinity: 5 } }
    },
    "day3_lunch_sea_2": {
        next: "day3_lunch_sea_3"
    },
    "day3_lunch_sea_3": {
        character: "sea_serious",
        next: "day3_lunch_sea_4"
    },
    "day3_lunch_sea_4": {
        next: "day3_lunch_sea_5"
    },
    "day3_lunch_sea_5": {
        next: "day3_lunch_sea_6"
    },
    "day3_lunch_sea_6": {
        character: "sea_smile",
        next: "day3_lunch_sea_7",
        stats: { sea: { danger: 5 } }
    },
    "day3_lunch_sea_7": {
        next: "day3_lunch_sea_8"
    },
    "day3_lunch_sea_8": {
        character: null,
        next: "day3_lunch_end"
    },

    // ══════════════════════════════════════
    //  리인 루트: 보건실 건강 음료
    // ══════════════════════════════════════
    "day3_lunch_riin": {
        background: "nurse_office",
        character: "riin_smile",
        next: "day3_lunch_riin_2"
    },
    "day3_lunch_riin_2": {
        next: "day3_lunch_riin_3"
    },
    "day3_lunch_riin_3": {
        character: "riin_seductive",
        next: "day3_lunch_riin_4"
    },
    "day3_lunch_riin_4": {
        next: "day3_lunch_riin_choice"
    },
    "day3_lunch_riin_choice": {
        choices: [
            {
                next: "day3_lunch_riin_drink",
                setFlags: ["drank_riin_drink_early"],
                stats: { riin: { affinity: 5, danger: 10 } }
            },
            {
                next: "day3_lunch_riin_refuse"
            }
        ]
    },
    "day3_lunch_riin_drink": {
        character: "riin_smile",
        next: "day3_lunch_riin_drink_2"
    },
    "day3_lunch_riin_drink_2": {
        character: null,
        next: "day3_lunch_end"
    },
    "day3_lunch_riin_refuse": {
        character: "riin_cold",
        next: "day3_lunch_riin_refuse_2"
    },
    "day3_lunch_riin_refuse_2": {
        character: null,
        next: "day3_lunch_end"
    },

    // ══════════════════════════════════════
    //  혼자 루트: 교실에서 설화 책상 글씨
    // ══════════════════════════════════════
    "day3_lunch_alone": {
        background: "classroom_empty",
        character: null,
        next: "day3_lunch_alone_2"
    },
    "day3_lunch_alone_2": {
        next: "day3_lunch_alone_3"
    },
    "day3_lunch_alone_3": {
        next: "day3_lunch_alone_4",
        setFlags: ["saw_seolhwa_desk_msg"]
    },
    "day3_lunch_alone_4": {
        next: "day3_lunch_end"
    },

    // ── Day 3 점심 종료 ──
    "day3_lunch_end": {
        background: "classroom",
        character: null,
        changeSlot: "afterschool",
        next: "day3_after_start"
    }
});
