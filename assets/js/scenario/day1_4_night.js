/**
 * ============================================================================
 * Day 1-4: Night - 달콤한 회상
 * ============================================================================
 * 집에서 하루를 돌아봄. 라면 먹고 폰 확인, 잠들기.
 * - 집에 돌아와서 라면, 하루 회상
 * - 폰 확인: 그룹방 읽음0, 민수 답 없음, 세아 메시지 3통 + 답장 선택지
 * - 잠들기 전: 데자뷔 핀 #3 (천장 얼룩)
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 밤: 집에 돌아옴 =====
    "day1_night_start": {
        background: "home",
        bgm: "night_calm.mp3",
        character: null,
        night: true,
        next: "day1_night_home_2"
    },
    "day1_night_home_2": {
        character: null,
        night: true,
        next: "day1_night_home_3"
    },
    "day1_night_home_3": {
        character: null,
        night: true,
        next: "day1_night_phone_1"
    },

    // ===== 폰 확인 =====
    "day1_night_phone_1": {
        character: null,
        night: true,
        next: "day1_night_phone_2"
    },
    "day1_night_phone_2": {
        character: null,
        night: true,
        next: "day1_night_phone_3"
    },
    "day1_night_phone_3": {
        character: null,
        night: true,
        next: "day1_night_phone_4"
    },
    "day1_night_phone_4": {
        character: null,
        night: true,
        next: "day1_night_phone_5"
    },
    "day1_night_phone_5": {
        character: null,
        night: true,
        next: "day1_night_phone_6"
    },

    // ===== 세아 메시지 =====
    "day1_night_phone_6": {
        character: null,
        night: true,
        next: "day1_night_sea_1"
    },
    "day1_night_sea_1": {
        character: "sea_smile",
        night: true,
        next: "day1_night_sea_2"
    },
    "day1_night_sea_2": {
        character: "sea_smile",
        night: true,
        next: "day1_night_sea_3"
    },
    "day1_night_sea_3": {
        character: "sea_smile",
        night: true,
        next: "day1_night_sea_4"
    },
    "day1_night_sea_4": {
        character: null,
        night: true,
        next: "day1_night_sea_reply"
    },

    // ===== 세아 답장 선택지 =====
    "day1_night_sea_reply": {
        character: null,
        night: true,
        choices: [
            { next: "day1_night_sea_reply_1", stats: { sea: { affinity: 3 } } },
            { next: "day1_night_sea_reply_2", stats: { sea: { affinity: 1 } } },
            { next: "day1_night_sea_reply_3", stats: { sea: { danger: 2 } } }
        ]
    },
    "day1_night_sea_reply_1": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day1_night_sleep_1"
    },
    "day1_night_sea_reply_2": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day1_night_sleep_1"
    },
    "day1_night_sea_reply_3": {
        character: null,
        night: true,
        setFlags: ["ignored_sea_msg"],
        next: "day1_night_sleep_1"
    },

    // ===== 잠들기 전 =====
    "day1_night_sleep_1": {
        character: null,
        night: true,
        next: "day1_night_sleep_2"
    },
    "day1_night_sleep_2": {
        character: null,
        night: true,
        next: "day1_night_sleep_3"
    },
    "day1_night_sleep_3": {
        character: null,
        night: true,
        next: "day1_night_sleep_4"
    },

    // ===== 데자뷔 핀 #3: 천장 얼룩 =====
    "day1_night_sleep_4": {
        character: null,
        night: true,
        dejavu: true,
        next: "day1_night_sleep_5"
    },
    "day1_night_sleep_5": {
        character: null,
        night: true,
        next: "day1_night_end"
    },
    "day1_night_end": {
        character: null,
        background: "black",
        changeDay: 2,
        changeSlot: "morning",
        next: "day2_morning_start"
    }
});
