/**
 * Day 4-4: Night - 탈출 계획
 * 세아 집착 메시지, 은수 메시지, 작전 수립 (3지선다)
 * 설화의 완전한 진실 (꿈 — 체험형 연출)
 * UI 이름 변경 글리치: 주인공 → 이설화
 * 위화감 90%. BREAKING glitch level.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    // ── 밤 — 자취방 ──
    "day4_night_start": {
        background: "home",
        bgm: "tension_night.mp3",
        character: null,
        next: "day4_night_start_2"
    },
    "day4_night_start_2": {
        next: "day4_night_start_3"
    },
    "day4_night_start_3": {
        next: "day4_night_phone"
    },

    // ── 세아의 집착 메시지 ──
    "day4_night_phone": {
        next: "day4_night_phone_2"
    },
    "day4_night_phone_2": {
        next: "day4_night_phone_3"
    },
    "day4_night_phone_3": {
        next: "day4_night_phone_4"
    },
    "day4_night_phone_4": {
        next: "day4_night_phone_5"
    },
    "day4_night_phone_5": {
        next: "day4_night_phone_6"
    },
    "day4_night_phone_6": {
        glitch: { noise: true },
        next: "day4_night_phone_7"
    },
    "day4_night_phone_7": {
        next: "day4_night_phone_8"
    },
    "day4_night_phone_8": {
        next: "day4_night_phone_9"
    },
    "day4_night_phone_9": {
        next: "day4_night_phone_10"
    },

    // ── 은수 메시지 ──
    "day4_night_phone_10": {
        next: "day4_night_phone_11"
    },
    "day4_night_phone_11": {
        next: "day4_night_phone_12"
    },
    "day4_night_phone_12": {
        next: "day4_night_plan"
    },

    // ── 작전 수립 ──
    "day4_night_plan": {
        next: "day4_night_plan_2"
    },
    "day4_night_plan_2": {
        next: "day4_night_plan_3"
    },
    "day4_night_plan_3": {
        next: "day4_night_plan_4"
    },
    "day4_night_plan_4": {
        next: "day4_night_plan_5"
    },
    "day4_night_plan_5": {
        next: "day4_night_plan_6"
    },
    "day4_night_plan_6": {
        next: "day4_night_plan_7"
    },
    "day4_night_plan_7": {
        next: "day4_night_plan_8"
    },
    "day4_night_plan_8": {
        next: "day4_night_plan_9"
    },
    "day4_night_plan_9": {
        next: "day4_night_plan_10"
    },
    "day4_night_plan_10": {
        next: "day4_night_plan_11"
    },
    "day4_night_plan_11": {
        next: "day4_night_plan_12"
    },
    "day4_night_plan_12": {
        next: "day4_night_plan_13"
    },
    "day4_night_plan_13": {
        next: "day4_night_plan_choice"
    },
    "day4_night_plan_choice": {
        choices: [
            {
                next: "day4_night_plan_escape",
                setFlags: ["plan_escape_school"]
            },
            {
                next: "day4_night_plan_expose",
                setFlags: ["plan_expose_truth"]
            },
            {
                next: "day4_night_plan_confront",
                setFlags: ["plan_confront_them"]
            }
        ]
    },
    "day4_night_plan_escape": {
        next: "day4_night_plan_escape_2"
    },
    "day4_night_plan_escape_2": {
        next: "day4_night_plan_escape_3"
    },
    "day4_night_plan_escape_3": {
        next: "day4_night_sleep"
    },
    "day4_night_plan_expose": {
        next: "day4_night_plan_expose_2"
    },
    "day4_night_plan_expose_2": {
        next: "day4_night_sleep"
    },
    "day4_night_plan_confront": {
        next: "day4_night_plan_confront_2"
    },
    "day4_night_plan_confront_2": {
        next: "day4_night_sleep"
    },

    // ── 잠들기 ──
    "day4_night_sleep": {
        next: "day4_night_sleep_2"
    },
    "day4_night_sleep_2": {
        next: "day4_night_sleep_3"
    },
    "day4_night_sleep_3": {
        next: "day4_night_seolhwa"
    },

    // ═══════════════════════════════════════
    // 설화의 완전한 진실 (꿈 — 체험형 연출)
    // ═══════════════════════════════════════
    "day4_night_seolhwa": {
        background: "corridor_dark",
        bgm: null,
        character: null,
        glitch: { noise: true },
        next: "day4_night_seolhwa_2"
    },
    "day4_night_seolhwa_2": {
        next: "day4_night_seolhwa_3"
    },
    // 글리치: UI 날짜 변경 + 주인공 이름 → '이설화'로 위장
    "day4_night_seolhwa_3": {
        glitch: { heavyGlitch: true, themeShift: true },
        next: "day4_night_seolhwa_4"
    },
    "day4_night_seolhwa_4": {
        next: "day4_night_seolhwa_5"
    },
    "day4_night_seolhwa_5": {
        next: "day4_night_seolhwa_6"
    },
    "day4_night_seolhwa_6": {
        next: "day4_night_seolhwa_7"
    },

    // 보건실 — 리인의 주사 (1년 전)
    "day4_night_seolhwa_7": {
        background: "nurse_office",
        character: "riin_smile",
        next: "day4_night_seolhwa_8"
    },
    "day4_night_seolhwa_8": {
        character: null,
        next: "day4_night_seolhwa_9"
    },
    "day4_night_seolhwa_9": {
        character: "riin_smile",
        next: "day4_night_seolhwa_10"
    },
    "day4_night_seolhwa_10": {
        character: null,
        next: "day4_night_seolhwa_11"
    },
    "day4_night_seolhwa_11": {
        next: "day4_night_seolhwa_12"
    },

    // 교무실 — 피험자 #7 보고서 발견
    "day4_night_seolhwa_12": {
        background: "classroom",
        character: null,
        next: "day4_night_seolhwa_13"
    },
    "day4_night_seolhwa_13": {
        next: "day4_night_seolhwa_14"
    },

    // 문서 표시 — 글리치로 텍스트 깨짐
    "day4_night_seolhwa_14": {
        glitch: { noise: true },
        next: "day4_night_seolhwa_15"
    },
    "day4_night_seolhwa_15": {
        next: "day4_night_seolhwa_16"
    },
    "day4_night_seolhwa_16": {
        next: "day4_night_seolhwa_17"
    },
    "day4_night_seolhwa_17": {
        next: "day4_night_seolhwa_18"
    },
    "day4_night_seolhwa_18": {
        character: null,
        next: "day4_night_seolhwa_19"
    },

    // 지하실 — 설화의 최종 처리 장면
    "day4_night_seolhwa_19": {
        background: "old_building",
        character: "eunsu_serious",
        next: "day4_night_seolhwa_20"
    },
    "day4_night_seolhwa_20": {
        next: "day4_night_seolhwa_21"
    },
    "day4_night_seolhwa_21": {
        character: null,
        next: "day4_night_seolhwa_22"
    },
    "day4_night_seolhwa_22": {
        character: "eunsu_serious",
        next: "day4_night_seolhwa_23"
    },
    "day4_night_seolhwa_23": {
        character: null,
        next: "day4_night_seolhwa_24"
    },
    "day4_night_seolhwa_24": {
        next: "day4_night_seolhwa_25"
    },

    // 암전 → 글리치 폭발
    "day4_night_seolhwa_25": {
        background: "black",
        glitch: { heavyGlitch: true },
        character: null,
        next: "day4_night_seolhwa_26"
    },

    // 현재 꿈속 — 설화와 대면
    "day4_night_seolhwa_26": {
        character: "seolhwa_normal",
        next: "day4_night_seolhwa_27"
    },
    "day4_night_seolhwa_27": {
        next: "day4_night_seolhwa_28"
    },
    "day4_night_seolhwa_28": {
        character: null,
        next: "day4_night_seolhwa_29"
    },
    "day4_night_seolhwa_29": {
        character: "seolhwa_normal",
        next: "day4_night_seolhwa_30"
    },
    "day4_night_seolhwa_30": {
        next: "day4_night_seolhwa_31"
    },
    "day4_night_seolhwa_31": {
        character: null,
        next: "day4_night_seolhwa_32"
    },
    "day4_night_seolhwa_32": {
        character: "seolhwa_normal",
        next: "day4_night_seolhwa_33",
        stats: { seolhwa: { trust: 20 } }
    },
    "day4_night_seolhwa_33": {
        next: "day4_night_seolhwa_34"
    },
    "day4_night_seolhwa_34": {
        character: "seolhwa_sad",
        next: "day4_night_seolhwa_35"
    },
    "day4_night_seolhwa_35": {
        character: null,
        next: "day4_night_seolhwa_36"
    },
    "day4_night_seolhwa_36": {
        character: "seolhwa_normal",
        next: "day4_night_seolhwa_37"
    },
    "day4_night_seolhwa_37": {
        next: "day4_night_seolhwa_38"
    },
    "day4_night_seolhwa_38": {
        character: null,
        next: "day4_night_seolhwa_39"
    },
    "day4_night_seolhwa_39": {
        character: "seolhwa_normal",
        next: "day4_night_seolhwa_40"
    },
    "day4_night_seolhwa_40": {
        character: null,
        glitch: { noise: true },
        next: "day4_night_seolhwa_41"
    },
    "day4_night_seolhwa_41": {
        character: "seolhwa_fading",
        next: "day4_night_seolhwa_42"
    },
    "day4_night_seolhwa_42": {
        character: null,
        next: "day4_night_seolhwa_43"
    },

    // ── 기상 ──
    "day4_night_seolhwa_43": {
        background: "home",
        glitch: { heavyGlitch: true },
        next: "day4_night_wake"
    },
    "day4_night_wake": {
        next: "day4_night_wake_2"
    },
    "day4_night_wake_2": {
        next: "day4_night_wake_3"
    },
    "day4_night_wake_3": {
        next: "day4_night_wake_4"
    },
    "day4_night_wake_4": {
        next: "day4_night_wake_5"
    },
    "day4_night_wake_5": {
        next: "day4_night_wake_6"
    },
    "day4_night_wake_6": {
        next: "day4_night_end"
    },

    // ── Day 4 종료 ──
    "day4_night_end": {
        background: "home",
        bgm: null,
        character: null,
        changeDay: 5,
        changeSlot: "morning",
        next: "day5_morning_start"
    }
});
