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
        sfx: "sfx_phone_vibrate.mp3",
        vibrate: "notification",
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
        "character": null,
        "night": true,
        "next": "day1_night_app_1"
    },

    // ===== 세아 메시지 =====
    "day1_night_phone_6": {
        character: null,
        night: true,
        next: "day1_night_sea_1"
    },
    "day1_night_sea_1": {
        character: "sea_smile",
        charOpacity: 0.7,
        night: true,
        next: "day1_night_sea_2"
    },
    "day1_night_sea_2": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        next: "day1_night_sea_3"
    },
    "day1_night_sea_3": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        next: "day1_night_sea_4"
    },
    "day1_night_sea_4": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        next: "day1_night_sea_reply"
    },

    // ===== 세아 답장 선택지 =====
    "day1_night_sea_reply": {
        character: null,
        night: true,
        choices: [
            { next: "day1_night_sea_reply_1", stats: { sea: { affinity: 4 } } },
            { next: "day1_night_sea_reply_2", stats: { sea: { affinity: 2 } } },
            { next: "day1_night_sea_reply_3", stats: { sea: { affinity: -2 } } }
        ]
    },
    "day1_night_sea_reply_1": {
        "character": "sea_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1200,
        "next": "day1_night_extra_msg_branch"
    },
    "day1_night_sea_reply_2": {
        "character": "sea_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1200,
        "next": "day1_night_extra_msg_branch"
    },
    "day1_night_sea_reply_3": {
        "character": null,
        "night": true,
        "setFlags": [
            "ignored_sea_msg"
        ],
        "next": "day1_night_extra_msg_branch"
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
        branches: [
            { condition: "received_sea_milk", next: "day1_night_sleep_milk" }
        ],
        next: "day1_night_sleep_gift"
    },
    "day1_night_sleep_milk": {
        character: null,
        night: true,
        next: "day1_night_sleep_gift"
    },
    "day1_night_sleep_gift": {
        character: null,
        night: true,
        branches: [
            { condition: "received_yuna_photo", next: "day1_night_sleep_photo" },
            { condition: "received_riin_tea", next: "day1_night_sleep_tea" }
        ],
        next: "day1_night_sleep_3"
    },
    "day1_night_sleep_photo": {
        character: null,
        night: true,
        next: "day1_night_sleep_3"
    },
    "day1_night_sleep_tea": {
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
        next: "day1_night_key_1"
    },

    // ── 미세 공포 핀: 새벽 열쇠 소리 (은수의 야간 점검 복선) ──
    "day1_night_key_1": {
        character: null,
        night: true,
        sfx: "sfx_key_turn.mp3",
        unskippable: true,
        next: "day1_night_key_2"
    },
    "day1_night_key_2": {
        character: null,
        night: true,
        next: "day1_night_key_3"
    },
    "day1_night_key_3": {
        character: null,
        night: true,
        next: "day1_night_key_4"
    },
    "day1_night_key_4": {
        character: null,
        night: true,
        next: "day1_night_end"
    },

    "day1_night_end": {
        character: null,
        background: "black",
        stopSfx: true,
        changeDay: 2,
        changeSlot: "morning",
        next: "day2_morning_start"
    }
});

// Expansion work order 2026-10-16
Object.assign(SCENARIO[1], {
    "day1_night_app_1": {
        "character": null,
        "night": true,
        "next": "day1_night_app_2"
    },
    "day1_night_app_2": {
        "character": null,
        "night": true,
        "next": "day1_night_app_3"
    },
    "day1_night_app_3": {
        "character": null,
        "night": true,
        "next": "day1_night_app_4"
    },
    "day1_night_app_4": {
        "character": null,
        "night": true,
        "next": "day1_night_app_5"
    },
    "day1_night_app_5": {
        "character": null,
        "night": true,
        "next": "day1_night_app_6",
        "branches": [
            {
                "condition": "received_riin_tea",
                "next": "day1_history_callback_1"
            }
        ]
    },
    "day1_night_app_6": {
        "character": null,
        "night": true,
        "next": "day1_night_app_7"
    },
    "day1_night_app_7": {
        "character": null,
        "night": true,
        "next": "day1_night_app_8",
        "branches": [
            {
                "condition": "received_sea_milk",
                "next": "day1_history_callback_2"
            }
        ]
    },
    "day1_night_app_8": {
        "character": null,
        "night": true,
        "next": "day1_night_app_9"
    },
    "day1_night_app_9": {
        "character": null,
        "night": true,
        "next": "day1_night_app_10"
    },
    "day1_night_app_10": {
        "character": null,
        "night": true,
        "next": "day1_night_app_11"
    },
    "day1_night_app_11": {
        "character": null,
        "night": true,
        "next": "day1_night_app_12",
        "branches": [
            {
                "condition": "met_yuna",
                "next": "day1_history_callback_3"
            }
        ]
    },
    "day1_night_app_12": {
        "character": null,
        "night": true,
        "choices": [
            {
                "next": "day1_expansion_action_1_a"
            },
            {
                "next": "day1_expansion_action_1_b"
            },
            {
                "next": "day1_night_app_13"
            }
        ]
    },
    "day1_night_app_13": {
        "character": null,
        "night": true,
        "next": "day1_night_app_14"
    },
    "day1_night_app_14": {
        "character": null,
        "night": true,
        "next": "day1_night_app_choice"
    },
    "day1_night_app_choice": {
        "night": true,
        "character": null,
        "choices": [
            {
                "next": "day1_night_app_kill_1",
                "setFlags": [
                    "tried_kill_safety_app"
                ],
                "stats": {
                    "eunsu": {
                        "affinity": -1
                    },
                    "seolhwa": {
                        "affinity": 1
                    }
                }
            },
            {
                "next": "day1_night_app_minsu_1",
                "setFlags": [
                    "checked_minsu_chat_day1"
                ],
                "stats": {
                    "yuna": {
                        "affinity": 1
                    }
                }
            },
            {
                "next": "day1_night_app_dim_1",
                "stats": {
                    "sea": {
                        "affinity": 1
                    },
                    "eunsu": {
                        "affinity": 1
                    }
                }
            }
        ]
    },
    "day1_night_app_kill_1": {
        "night": true,
        "character": null,
        "next": "day1_night_app_kill_2"
    },
    "day1_night_app_kill_2": {
        "night": true,
        "character": null,
        "next": "day1_night_app_kill_3",
        "glitch": {
            "phoneFlash": true,
            "phoneFlashText": "day1_night_app_flash_aux",
            "phoneFlashDuration": 280
        }
    },
    "day1_night_app_kill_3": {
        "night": true,
        "character": null,
        "next": "day1_night_app_kill_4"
    },
    "day1_night_app_kill_4": {
        "night": true,
        "character": null,
        "next": "day1_night_app_kill_5"
    },
    "day1_night_app_kill_5": {
        "night": true,
        "character": null,
        "next": "day1_night_phone_6"
    },
    "day1_night_app_minsu_1": {
        "night": true,
        "character": null,
        "next": "day1_night_app_minsu_2"
    },
    "day1_night_app_minsu_2": {
        "night": true,
        "character": null,
        "next": "day1_night_app_minsu_3"
    },
    "day1_night_app_minsu_3": {
        "night": true,
        "character": null,
        "next": "day1_night_app_minsu_4"
    },
    "day1_night_app_minsu_4": {
        "night": true,
        "character": null,
        "next": "day1_night_app_minsu_5"
    },
    "day1_night_app_minsu_5": {
        "night": true,
        "character": null,
        "next": "day1_night_app_minsu_6"
    },
    "day1_night_app_minsu_6": {
        "night": true,
        "character": null,
        "next": "day1_night_phone_6"
    },
    "day1_night_app_dim_1": {
        "night": true,
        "character": null,
        "next": "day1_night_app_dim_2"
    },
    "day1_night_app_dim_2": {
        "night": true,
        "character": null,
        "next": "day1_night_app_dim_3"
    },
    "day1_night_app_dim_3": {
        "night": true,
        "character": null,
        "next": "day1_night_phone_6"
    },
    "day1_night_extra_msg_branch": {
        "character": null,
        "night": true,
        "branches": [
            {
                "condition": "received_riin_tea",
                "next": "day1_night_riin_msg_1"
            },
            {
                "condition": "met_yuna",
                "next": "day1_night_yuna_msg_1"
            }
        ],
        "next": "day1_night_eunsu_msg_1"
    },
    "day1_night_riin_msg_1": {
        "character": "riin_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1000,
        "next": "day1_night_riin_msg_2"
    },
    "day1_night_riin_msg_2": {
        "character": "riin_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1000,
        "next": "day1_night_riin_msg_3"
    },
    "day1_night_riin_msg_3": {
        "character": "riin_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1000,
        "next": "day1_night_riin_msg_4"
    },
    "day1_night_riin_msg_4": {
        "character": "riin_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1000,
        "next": "day1_night_riin_msg_5"
    },
    "day1_night_riin_msg_5": {
        "character": "riin_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1000,
        "next": "day1_night_riin_msg_6"
    },
    "day1_night_riin_msg_6": {
        "character": "riin_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1000,
        "next": "day1_night_riin_msg_7"
    },
    "day1_night_riin_msg_7": {
        "character": "riin_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1000,
        "next": "day1_night_riin_msg_8"
    },
    "day1_night_riin_msg_8": {
        "character": "riin_smile",
        "charOpacity": 0.7,
        "night": true,
        "messengerDelay": 1000,
        "next": "day1_night_riin_msg_choice"
    },
    "day1_night_riin_msg_choice": {
        "night": true,
        "choices": [
            {
                "next": "day1_night_riin_msg_thanks_1",
                "stats": {
                    "riin": {
                        "affinity": 2
                    }
                }
            },
            {
                "next": "day1_night_riin_msg_pick_1",
                "stats": {
                    "riin": {
                        "affinity": 1
                    }
                }
            },
            {
                "next": "day1_night_riin_msg_sleep_1"
            }
        ]
    },
    "day1_night_riin_msg_thanks_1": {
        "night": true,
        "messengerDelay": 1100,
        "next": "day1_night_sleep_1"
    },
    "day1_night_riin_msg_pick_1": {
        "night": true,
        "messengerDelay": 1100,
        "next": "day1_night_sleep_1"
    },
    "day1_night_riin_msg_sleep_1": {
        "night": true,
        "next": "day1_night_sleep_1"
    },
    "day1_night_yuna_msg_1": {
        "night": true,
        "character": "yuna_normal",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_yuna_msg_2"
    },
    "day1_night_yuna_msg_2": {
        "night": true,
        "character": "yuna_normal",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_yuna_msg_3"
    },
    "day1_night_yuna_msg_3": {
        "night": true,
        "character": "yuna_normal",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_yuna_msg_4"
    },
    "day1_night_yuna_msg_4": {
        "night": true,
        "character": "yuna_normal",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_yuna_msg_5"
    },
    "day1_night_yuna_msg_5": {
        "night": true,
        "character": "yuna_normal",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_yuna_msg_6"
    },
    "day1_night_yuna_msg_6": {
        "night": true,
        "character": "yuna_normal",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_yuna_msg_7"
    },
    "day1_night_yuna_msg_7": {
        "night": true,
        "character": "yuna_normal",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_yuna_msg_8"
    },
    "day1_night_yuna_msg_8": {
        "night": true,
        "character": "yuna_normal",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_yuna_msg_choice"
    },
    "day1_night_yuna_msg_choice": {
        "night": true,
        "choices": [
            {
                "next": "day1_night_yuna_msg_ask_1",
                "stats": {
                    "yuna": {
                        "affinity": 2
                    }
                }
            },
            {
                "next": "day1_night_yuna_msg_time_1",
                "stats": {
                    "seolhwa": {
                        "affinity": 1
                    }
                }
            },
            {
                "next": "day1_night_yuna_msg_bye_1",
                "stats": {
                    "yuna": {
                        "affinity": 1
                    }
                }
            }
        ]
    },
    "day1_night_yuna_msg_ask_1": {
        "night": true,
        "messengerDelay": 1100,
        "next": "day1_night_sleep_1"
    },
    "day1_night_yuna_msg_time_1": {
        "night": true,
        "messengerDelay": 1100,
        "next": "day1_night_sleep_1"
    },
    "day1_night_yuna_msg_bye_1": {
        "night": true,
        "messengerDelay": 1100,
        "next": "day1_night_sleep_1"
    },
    "day1_night_eunsu_msg_1": {
        "night": true,
        "character": "eunsu_gentle",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_eunsu_msg_2"
    },
    "day1_night_eunsu_msg_2": {
        "night": true,
        "character": "eunsu_gentle",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_eunsu_msg_3"
    },
    "day1_night_eunsu_msg_3": {
        "night": true,
        "character": "eunsu_gentle",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_eunsu_msg_4"
    },
    "day1_night_eunsu_msg_4": {
        "night": true,
        "character": "eunsu_gentle",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_eunsu_msg_5"
    },
    "day1_night_eunsu_msg_5": {
        "night": true,
        "character": "eunsu_gentle",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_eunsu_msg_6"
    },
    "day1_night_eunsu_msg_6": {
        "night": true,
        "character": "eunsu_gentle",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_eunsu_msg_7",
        "branches": [
            {
                "condition": "asked_safety_app_day1",
                "next": "day1_history_callback_4"
            }
        ]
    },
    "day1_night_eunsu_msg_7": {
        "night": true,
        "character": "eunsu_gentle",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_eunsu_msg_8"
    },
    "day1_night_eunsu_msg_8": {
        "night": true,
        "character": "eunsu_gentle",
        "charOpacity": 0.7,
        "messengerDelay": 1100,
        "next": "day1_night_eunsu_msg_choice"
    },
    "day1_night_eunsu_msg_choice": {
        "night": true,
        "choices": [
            {
                "next": "day1_night_eunsu_msg_kind_1",
                "stats": {
                    "eunsu": {
                        "affinity": 2
                    }
                }
            },
            {
                "next": "day1_night_eunsu_msg_app_1",
                "setFlags": [
                    "asked_safety_app_day1"
                ]
            },
            {
                "next": "day1_night_eunsu_msg_rest_1",
                "stats": {
                    "eunsu": {
                        "affinity": 1
                    }
                }
            }
        ]
    },
    "day1_night_eunsu_msg_kind_1": {
        "night": true,
        "messengerDelay": 1100,
        "next": "day1_night_sleep_1"
    },
    "day1_night_eunsu_msg_app_1": {
        "night": true,
        "messengerDelay": 1100,
        "next": "day1_night_sleep_1"
    },
    "day1_night_eunsu_msg_rest_1": {
        "night": true,
        "messengerDelay": 1100,
        "next": "day1_night_sleep_1"
    },
    "day1_history_callback_1": {
        "character": null,
        "next": "day1_night_app_6"
    },
    "day1_history_callback_2": {
        "character": null,
        "next": "day1_night_app_8"
    },
    "day1_history_callback_3": {
        "character": null,
        "next": "day1_night_app_12"
    },
    "day1_history_callback_4": {
        "character": "eunsu_gentle",
        "next": "day1_night_eunsu_msg_7"
    },
    "day1_expansion_action_1_a": {
        "character": null,
        "next": "day1_night_app_13"
    },
    "day1_expansion_action_1_b": {
        "character": null,
        "next": "day1_night_app_13"
    }
});
