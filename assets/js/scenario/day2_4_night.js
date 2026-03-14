/**
 * ============================================================================
 * Day 2-4: Night - 연락 두절, 메시지, 데자뷔
 * ============================================================================
 * - 연락 두절 (전 학교 그룹방 '읽음 3', 민수 개인 메시지)
 * - 세아와의 카톡
 * - 은수 선생님 메시지
 * - 잠들기 전 — 데자뷔 플래시 (MEMORY LEAK)
 * - 설화의 꿈
 * - 기상 후 2일차 종료
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    // ===== 연락 두절 =====
    "day2_night_start": {
        background: "home",
        bgm: "night_calm.mp3",
        character: null,
        night: true,
        next: "day2_night_phone_1"
    },
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
        messengerDelay: 5000,
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
        next: "day2_night_phone_13"
    },
    "day2_night_phone_13": {
        night: true,
        next: "day2_night_sea_1"
    },

    // ===== 세아와의 카톡 =====
    "day2_night_sea_1": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_2"
    },
    "day2_night_sea_2": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_3"
    },
    "day2_night_sea_3": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_4"
    },
    "day2_night_sea_4": {
        character: null,
        night: true,
        next: "day2_night_sea_5"
    },
    "day2_night_sea_5": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_6"
    },
    "day2_night_sea_6": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_7"
    },
    "day2_night_sea_7": {
        character: null,
        night: true,
        next: "day2_night_sea_8"
    },
    "day2_night_sea_8": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_9"
    },
    "day2_night_sea_9": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_10"
    },
    "day2_night_sea_10": {
        character: null,
        night: true,
        next: "day2_night_sea_11"
    },
    "day2_night_sea_11": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_12"
    },
    "day2_night_sea_12": {
        character: "sea_smile",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_13"
    },
    "day2_night_sea_13": {
        character: null,
        night: true,
        next: "day2_night_sea_14"
    },

    // ===== 은수 선생님 메시지 =====
    "day2_night_sea_14": {
        character: null,
        night: true,
        next: "day2_night_eunsu_1"
    },
    "day2_night_eunsu_1": {
        character: "eunsu_warm",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_eunsu_2"
    },
    "day2_night_eunsu_2": {
        character: "eunsu_warm",
        night: true,
        messengerDelay: 1200,
        next: "day2_night_eunsu_3"
    },
    "day2_night_eunsu_3": {
        character: null,
        night: true,
        next: "day2_night_eunsu_4"
    },
    "day2_night_eunsu_4": {
        character: "eunsu_warm",
        night: true,
        messengerDelay: 800,
        next: "day2_night_eunsu_5"
    },
    "day2_night_eunsu_5": {
        character: null,
        night: true,
        next: "day2_night_flash_1"
    },

    // ===== 잠들기 전 — 데자뷔 플래시 (MEMORY LEAK) =====
    "day2_night_flash_1": {
        character: null,
        night: true,
        next: "day2_night_flash_2"
    },
    "day2_night_flash_2": {
        night: true,
        glitch: { noise: true, noiseDuration: 300 },
        next: "day2_night_flash_3"
    },
    "day2_night_flash_3": {
        night: true,
        next: "day2_night_flash_4"
    },
    "day2_night_flash_4": {
        night: true,
        next: "day2_night_flash_5"
    },
    "day2_night_flash_5": {
        night: true,
        glitch: { noise: true, noiseDuration: 500 },
        next: "day2_night_flash_6"
    },
    "day2_night_flash_6": {
        night: true,
        next: "day2_night_flash_7"
    },
    "day2_night_flash_7": {
        night: true,
        next: "day2_night_flash_8"
    },

    // ===== 설화의 꿈 =====
    "day2_night_flash_8": {
        night: true,
        next: "day2_night_dream_1"
    },
    "day2_night_dream_1": {
        background: "black",
        bgm: null,
        character: null,
        night: true,
        next: "day2_night_dream_2"
    },
    "day2_night_dream_2": {
        background: "classroom",
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
        character: null,
        night: true,
        next: "day2_night_dream_6"
    },
    "day2_night_dream_6": {
        character: "seolhwa_smile",
        night: true,
        next: "day2_night_dream_7"
    },
    "day2_night_dream_7": {
        character: "seolhwa_smile",
        night: true,
        next: "day2_night_dream_7a"
    },
    "day2_night_dream_7a": {
        character: "seolhwa_smile",
        night: true,
        glitch: { noise: true, noiseDuration: 500 },
        next: "day2_night_dream_8"
    },
    "day2_night_dream_8": {
        night: true,
        glitch: { noise: true, noiseDuration: 800 },
        next: "day2_night_dream_9"
    },
    "day2_night_dream_9": {
        background: "black",
        character: null,
        night: true,
        next: "day2_night_wake_1"
    },

    // ===== 기상 =====
    "day2_night_wake_1": {
        background: "home",
        character: null,
        night: true,
        next: "day2_night_wake_2"
    },
    "day2_night_wake_2": {
        night: true,
        next: "day2_night_wake_3"
    },
    "day2_night_wake_3": {
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
