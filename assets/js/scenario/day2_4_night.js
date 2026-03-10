/**
 * ============================================================================
 * Day 2-4: Night - 이상한 꿈
 * ============================================================================
 * - 귀가 후 회상
 * - 연락 두절 (전 학교 그룹방, 전화 시도)
 * - 세아의 메시지
 * - 잠들기 전
 * - 꿈 시퀀스 (설화, 글리치)
 * - 기상 후 2일차 종료
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    // ===== 귀가 =====
    "day2_night_start": {
        background: "home",
        bgm: "night_calm.mp3",
        character: null,
        night: true,
        next: "day2_night_2"
    },
    "day2_night_2": {
        night: true,
        next: "day2_night_3"
    },
    "day2_night_3": {
        night: true,
        next: "day2_night_phone_1"
    },

    // ===== 연락 두절 =====
    "day2_night_phone_1": {
        night: true,
        next: "day2_night_phone_2"
    },
    "day2_night_phone_2": {
        night: true,
        next: "day2_night_phone_3"
    },
    "day2_night_phone_3": {
        night: true,
        next: "day2_night_phone_4"
    },
    "day2_night_phone_4": {
        night: true,
        next: "day2_night_phone_5"
    },
    "day2_night_phone_5": {
        night: true,
        next: "day2_night_phone_6"
    },
    "day2_night_phone_6": {
        night: true,
        next: "day2_night_phone_7"
    },
    "day2_night_phone_7": {
        night: true,
        next: "day2_night_phone_8"
    },
    "day2_night_phone_8": {
        night: true,
        next: "day2_night_phone_9"
    },
    "day2_night_phone_9": {
        night: true,
        next: "day2_night_phone_10"
    },
    "day2_night_phone_10": {
        night: true,
        next: "day2_night_phone_11"
    },
    "day2_night_phone_11": {
        night: true,
        next: "day2_night_phone_12"
    },
    "day2_night_phone_12": {
        night: true,
        next: "day2_night_msg_1"
    },

    // ===== 세아의 메시지 =====
    "day2_night_msg_1": {
        night: true,
        messengerDelay: 5000,
        next: "day2_night_msg_2"
    },
    "day2_night_msg_2": {
        night: true,
        messengerDelay: 1200,
        next: "day2_night_msg_3"
    },
    "day2_night_msg_3": {
        night: true,
        messengerDelay: 1200,
        next: "day2_night_msg_4"
    },
    "day2_night_msg_4": {
        night: true,
        messengerDelay: 1200,
        next: "day2_night_msg_5"
    },
    "day2_night_msg_5": {
        night: true,
        next: "day2_night_msg_6"
    },
    "day2_night_msg_6": {
        night: true,
        next: "day2_night_msg_7"
    },

    // ===== 잠들기 전 =====
    "day2_night_msg_7": {
        night: true,
        messengerDelay: 800,
        next: "day2_night_sleep_1"
    },
    "day2_night_sleep_1": {
        night: true,
        next: "day2_night_sleep_2"
    },
    "day2_night_sleep_2": {
        night: true,
        next: "day2_night_sleep_3"
    },

    // ===== 꿈 시퀀스 =====
    "day2_night_sleep_3": {
        background: "corridor_dark",
        bgm: null,
        night: true,
        glitch: { noise: true, noiseDuration: 300 },
        next: "day2_night_dream_1"
    },
    "day2_night_dream_1": {
        night: true,
        next: "day2_night_dream_2"
    },
    "day2_night_dream_2": {
        night: true,
        next: "day2_night_dream_3"
    },
    "day2_night_dream_3": {
        night: true,
        next: "day2_night_dream_4"
    },
    "day2_night_dream_4": {
        night: true,
        next: "day2_night_dream_5"
    },
    "day2_night_dream_5": {
        character: "seolhwa_ghost",
        night: true,
        glitch: { noise: true, noiseDuration: 500 },
        next: "day2_night_dream_6"
    },
    "day2_night_dream_6": {
        night: true,
        next: "day2_night_dream_7"
    },
    "day2_night_dream_7": {
        night: true,
        next: "day2_night_dream_8"
    },
    "day2_night_dream_8": {
        night: true,
        next: "day2_night_dream_9"
    },
    "day2_night_dream_9": {
        night: true,
        next: "day2_night_dream_10"
    },
    "day2_night_dream_10": {
        night: true,
        glitch: { noise: true, noiseDuration: 800 },
        next: "day2_night_dream_11"
    },
    "day2_night_dream_11": {
        background: "black",
        character: null,
        night: true,
        next: "day2_night_dream_12"
    },
    "day2_night_dream_12": {
        night: true,
        next: "day2_night_wake_1"
    },

    // ===== 기상 =====
    "day2_night_wake_1": {
        background: "home",
        night: true,
        next: "day2_night_wake_2"
    },
    "day2_night_wake_2": {
        night: true,
        next: "day2_night_wake_3"
    },
    "day2_night_wake_3": {
        night: true,
        next: "day2_night_wake_4"
    },
    "day2_night_wake_4": {
        night: true,
        next: "day2_night_wake_5"
    },
    "day2_night_wake_5": {
        night: true,
        next: "day2_night_end"
    },

    // ===== 2일차 종료 =====
    "day2_night_end": {
        background: "black",
        character: null,
        night: true,
        changeDay: 3,
        changeSlot: "morning",
        next: "day3_morning_start"
    }
});
