/**
 * Day 2-4: Night - part A
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {
// ===== 연락 두절 =====
    "day2_night_start": {
        background: "room_night",
        bgm: "night_calm.mp3",
        character: null,
        night: true,
        next: "day2_night_phone_1"
    },
    "day2_night_phone_1": {
        character: null,
        night: true,
        sfx: "sfx_phone_vibrate.mp3",
        vibrate: "notification",
        next: "day2_night_phone_2"
    },
    "day2_night_phone_2": {
        character: null,
        night: true,
        next: "day2_night_phone_3"
    },
    "day2_night_phone_3": {
        character: null,
        night: true,
        next: "day2_night_phone_4"
    },
    "day2_night_phone_4": {
        character: null,
        night: true,
        messengerDelay: 5000,
        next: "day2_night_phone_5"
    },
    "day2_night_phone_5": {
        character: null,
        night: true,
        next: "day2_night_phone_6"
    },
    "day2_night_phone_6": {
        character: null,
        night: true,
        next: "day2_night_phone_7"
    },
    "day2_night_phone_7": {
        character: null,
        night: true,
        next: "day2_night_phone_8"
    },
    "day2_night_phone_8": {
        character: null,
        night: true,
        next: "day2_night_phone_9"
    },
    "day2_night_phone_9": {
        character: null,
        night: true,
        next: "day2_night_phone_10"
    },
    "day2_night_phone_10": {
        character: null,
        night: true,
        next: "day2_night_phone_11"
    },
    "day2_night_phone_11": {
        character: null,
        night: true,
        next: "day2_night_phone_12"
    },
    "day2_night_phone_12": {
        character: null,
        night: true,
        next: "day2_night_phone_13"
    },
    "day2_night_phone_13": {
        character: null,
        night: true,
        choices: [
            { next: "day2_night_ft_messenger", stats: { sea: { affinity: 1 } } },
            { next: "day2_night_ft_groupchat", stats: { eunsu: { affinity: -1 } } },
            { next: "day2_night_ft_putdown", stats: { seolhwa: { affinity: 1 } } }
        ]
    },

    // ===== 민수에게 한 번 더 메시지 =====
    "day2_night_ft_messenger": {
        character: null,
        night: true,
        next: "day2_night_ft_messenger_2"
    },
    // 예전 단톡방 확인 → 읽음 수만 그대로, 그제야 민수에게 다시 보냄
    "day2_night_ft_groupchat": {
        character: null,
        night: true,
        next: "day2_night_ft_groupchat_2"
    },
    "day2_night_ft_groupchat_2": {
        character: null,
        night: true,
        next: "day2_night_ft_messenger"
    },
    // 휴대폰을 내려놓음 → 답장 없이 생각만 하고 세아 카톡으로
    "day2_night_ft_putdown": {
        character: null,
        night: true,
        next: "day2_night_ft_putdown_2"
    },
    "day2_night_ft_putdown_2": {
        character: null,
        night: true,
        next: "day2_night_sea_1"
    },
    "day2_night_ft_messenger_2": {
        character: null,
        night: true,
        messengerDelay: 2200,
        next: "day2_night_ft_messenger_3"
    },
    "day2_night_ft_messenger_3": {
        character: null,
        night: true,
        next: "day2_night_ft_messenger_4"
    },
    "day2_night_ft_messenger_4": {
        character: null,
        night: true,
        next: "day2_night_ft_messenger_5"
    },
    "day2_night_ft_messenger_5": {
        character: null,
        night: true,
        next: "day2_night_sea_1"
    },

    // ===== 세아와의 카톡 =====
    "day2_night_sea_1": {
        character: "sea_smile",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_2"
    },
    "day2_night_sea_2": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_3"
    },
    "day2_night_sea_3": {
        character: "sea_smile",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_4"
    },
    "day2_night_sea_4": {
        character: "sea_smile",
        charOpacity: 0.7,
        night: true,
        next: "day2_night_sea_5"
    },
    "day2_night_sea_5": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_6"
    },
    "day2_night_sea_6": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_7"
    },
    "day2_night_sea_7": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        next: "day2_night_sea_8"
    },
    "day2_night_sea_8": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_promise_branch"
    },
    "day2_night_sea_promise_branch": {
        character: null,
        night: true,
        branches: [
            { condition: "day2_lunch_with_sea", next: "day2_night_sea_9" }
        ],
        next: "day2_night_sea_9_alt"
    },
    "day2_night_sea_9": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_10"
    }
});
