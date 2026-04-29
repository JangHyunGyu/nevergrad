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
        next: "day2_night_ft_messenger"
    },

    // ===== 민수에게 답장 (메신저 톤 — 일반 시퀀스로 교체) =====
    "day2_night_ft_messenger": {
        character: null,
        night: true,
        next: "day2_night_ft_messenger_2"
    },
    "day2_night_ft_messenger_2": {
        character: null,
        night: true,
        messengerDelay: 5000,
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
    },
    "day2_night_sea_9_alt": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_10"
    },
    "day2_night_sea_10": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        next: "day2_night_sea_11"
    },
    "day2_night_sea_11": {
        character: "sea_smile",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_12"
    },
    "day2_night_sea_12": {
        character: "sea_normal",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_sea_13"
    },
    "day2_night_sea_13": {
        character: "sea_smile",
        charOpacity: 0.7,
        night: true,
        next: "day2_night_sea_14"
    },

    // ===== 폰 내려놓기 — 은수 선생님 메시지 =====
    "day2_night_sea_14": {
        character: null,
        night: true,
        next: "day2_night_sea_14a"
    },
    "day2_night_sea_14a": {
        character: null,
        night: true,
        sfx: "sfx_phone_vibrate.mp3",
        vibrate: "notification",
        next: "day2_night_eunsu_1"
    },
    "day2_night_eunsu_1": {
        character: "eunsu_warm",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_eunsu_2"
    },
    "day2_night_eunsu_2": {
        character: "eunsu_warm",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 1200,
        next: "day2_night_eunsu_3"
    },
    "day2_night_eunsu_3": {
        character: "eunsu_warm",
        charOpacity: 0.7,
        night: true,
        next: "day2_night_eunsu_4"
    },
    "day2_night_eunsu_4": {
        character: "eunsu_warm",
        charOpacity: 0.7,
        night: true,
        messengerDelay: 800,
        next: "day2_night_eunsu_5"
    },
    "day2_night_eunsu_5": {
        character: "eunsu_warm",
        charOpacity: 0.7,
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
        background: "corridor_dark",
        character: null,
        night: true,
        sfx: "sfx_rain_loop.mp3",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day2_night_flash_3"
    },
    "day2_night_flash_3": {
        character: null,
        night: true,
        next: "day2_night_flash_4"
    },
    "day2_night_flash_4": {
        character: null,
        night: true,
        next: "day2_night_flash_5"
    },
    "day2_night_flash_5": {
        background: "room_night",
        character: null,
        night: true,
        sfx: "sfx_heartbeat_fast.mp3",
        stopSfx: "sfx_rain_loop.mp3",
        glitch: { noise: true, noiseDuration: 500 },
        unskippable: true,
        next: "day2_night_flash_6"
    },
    "day2_night_flash_6": {
        character: null,
        night: true,
        next: "day2_night_flash_7"
    },
    "day2_night_flash_7": {
        character: null,
        night: true,
        next: "day2_night_flash_8"
    },

    // ── 주인공 능동성: 데자뷔에 불안 → 스스로 학교 검색 ──
    "day2_night_flash_8": {
        character: null,
        night: true,
        next: "day2_night_search_1"
    },
    "day2_night_search_1": {
        character: null,
        night: true,
        stopSfx: "sfx_heartbeat_fast.mp3",
        next: "day2_night_search_2"
    },
    "day2_night_search_2": {
        character: null,
        night: true,
        next: "day2_night_search_3"
    },
    "day2_night_search_3": {
        character: null,
        night: true,
        next: "day2_night_search_4"
    },
    "day2_night_search_4": {
        character: null,
        night: true,
        next: "day2_night_search_5"
    },
    "day2_night_search_5": {
        character: null,
        night: true,
        next: "day2_night_dream_1"
    },

    // ===== 설화의 꿈 =====
    "day2_night_dream_1": {
        background: "black",
        bgm: null,
        sfx: "sfx_heartbeat.mp3",
        character: null,
        night: true,
        unskippable: true,
        next: "day2_night_dream_2"
    },
    "day2_night_dream_2": {
        character: null,
        background: "classroom",
        night: true,
        next: "day2_night_dream_3"
    },
    "day2_night_dream_3": {
        character: null,
        night: true,
        next: "day2_night_dream_4"
    },
    "day2_night_dream_4": {
        character: null,
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
        setFlags: ["dream_seolhwa_day2"],
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
        character: null,
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
        character: null,
        night: true,
        next: "day2_night_wake_3"
    },
    "day2_night_wake_3": {
        character: null,
        night: true,
        // SCENARIO.md 5424: Day 2 밤 핸드폰 알림 글리치 (0.3초 — 내부 시스템 노출)
        glitch: {
            phoneFlash: true,
            phoneFlashText: {
                ko: "[\ud55c\uc6b8 \uc548\uc804 \uc571] \ud53c\ud5d8\uc790 #13 \ubaa8\ub2c8\ud130\ub9c1 - \uc218\uba74 \uac10\uc9c0",
                en: "[Hanul Safety App] Subject #13 monitoring - sleep detected",
                ja: "[\u30cf\u30cc\u30eb\u5b89\u5168\u30a2\u30d7\u30ea] \u88ab\u9a13\u8005 #13 \u30e2\u30cb\u30bf\u30ea\u30f3\u30b0 - \u7761\u7720\u691c\u77e5",
                es: "[App de Seguridad Hanul] Monitoreo del sujeto #13 - sueno detectado",
                fr: "[App Securite Hanul] Surveillance du sujet #13 - sommeil detecte",
                de: "[Hanul Sicherheits-App] Subjekt #13 Uberwachung - Schlaf erkannt",
                pt: "[App de Seguranca Hanul] Monitoramento do sujeito #13 - sono detectado"
            },
            phoneFlashDuration: 300
        },
        next: "day2_night_end"
    },

    // ===== 2일차 종료 =====
    "day2_night_end": {
        background: "black",
        character: null,
        night: true,
        stopSfx: true,
        changeDay: 3,
        changeSlot: "morning",
        next: "day3_morning_start"
    }
});
