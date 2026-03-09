/**
 * ============================================================================
 * Day 1-4: Night - 달콤한 회상
 * ============================================================================
 * 집에서 하루를 돌아봄. 100% 미연시 톤.
 * - 하루 회상 (세아, 은수, 리인, 유나)
 * - 폰 확인: 전학 SNS, 세아 메시지 3통 + 답장 선택지
 * - 설화 회상: greeted_seolhwa 플래그 분기
 * - 잠들기 전: 창밖 빛 반짝임
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
        next: "day1_night_2"
    },
    "day1_night_2": {
        night: true,
        next: "day1_night_3"
    },
    "day1_night_3": {
        night: true,
        next: "day1_night_4"
    },

    // ===== 하루 회상 =====
    "day1_night_4": {
        night: true,
        next: "day1_night_recall_sea"
    },
    "day1_night_recall_sea": {
        night: true,
        next: "day1_night_recall_eunsu"
    },
    "day1_night_recall_eunsu": {
        night: true,
        next: "day1_night_recall_riin"
    },
    "day1_night_recall_riin": {
        night: true,
        next: "day1_night_recall_yuna"
    },
    "day1_night_recall_yuna": {
        night: true,
        next: "day1_night_5"
    },
    "day1_night_5": {
        night: true,
        next: "day1_night_phone"
    },

    // ===== 폰 확인 =====
    "day1_night_phone": {
        night: true,
        next: "day1_night_phone_2"
    },
    "day1_night_phone_2": {
        night: true,
        next: "day1_night_phone_3"
    },
    "day1_night_phone_3": {
        night: true,
        next: "day1_night_phone_4"
    },
    "day1_night_phone_4": {
        night: true,
        next: "day1_night_phone_5"
    },

    // ===== 세아 메시지 =====
    "day1_night_phone_5": {
        night: true,
        next: "day1_night_phone_6"
    },
    "day1_night_phone_6": {
        night: true,
        next: "day1_night_phone_7"
    },
    "day1_night_phone_7": {
        night: true,
        next: "day1_night_sea_reply"
    },
    "day1_night_sea_reply": {
        night: true,
        choices: [
            { next: "day1_night_sea_reply_1", stats: { sea: { affinity: 3 } } },
            { next: "day1_night_sea_reply_2", stats: { sea: { affinity: 1 } } },
            { next: "day1_night_sea_reply_3", stats: { sea: { danger: 2 } } }
        ]
    },
    "day1_night_sea_reply_1": {
        night: true,
        messengerDelay: 1200,
        next: "day1_night_recall_seolhwa"
    },
    "day1_night_sea_reply_2": {
        night: true,
        messengerDelay: 1200,
        next: "day1_night_recall_seolhwa"
    },
    "day1_night_sea_reply_3": {
        night: true,
        next: "day1_night_recall_seolhwa",
        setFlags: ["ignored_sea_msg"]
    },

    // ===== 설화 회상 (분기) =====
    "day1_night_recall_seolhwa": {
        night: true,
        next: "day1_night_recall_seolhwa_yes",
        condition: "greeted_seolhwa",
        fallback: "day1_night_recall_seolhwa_no"
    },
    "day1_night_recall_seolhwa_yes": {
        night: true,
        next: "day1_night_recall_seolhwa_yes_2"
    },
    "day1_night_recall_seolhwa_yes_2": {
        night: true,
        next: "day1_night_sleep"
    },
    "day1_night_recall_seolhwa_no": {
        night: true,
        next: "day1_night_sleep"
    },

    // ===== 잠들기 전 =====
    "day1_night_sleep": {
        night: true,
        next: "day1_night_sleep_2"
    },
    "day1_night_sleep_2": {
        night: true,
        next: "day1_night_sleep_3"
    },
    "day1_night_sleep_3": {
        night: true,
        next: "day1_night_sleep_4"
    },
    "day1_night_sleep_4": {
        background: "black",
        next: "day1_night_end"
    },
    "day1_night_end": {
        background: "black",
        changeDay: 2,
        changeSlot: "morning",
        next: "day2_morning_start"
    }
});
