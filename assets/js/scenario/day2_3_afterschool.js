/**
 * ============================================================================
 * Day 2-3: Afterschool - 위화감 상승
 * ============================================================================
 * - 은수의 학생 안전 앱 설치 (핵심 위화감 이벤트, 2 choices)
 * - 방과후 선택지 (세아/유나/리인/귀가)
 * - 세아 학생회실: 노을 속 취약성 장면 (핵심 캐릭터 씬)
 * - 유나 도서관: 뭔가 말하려다 멈춤
 * - 리인 보건실: 서류 목격
 * - 귀가: 설화 목격 (greeted_seolhwa 조건), BGM silence glitch
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    // ===== 은수의 학생 안전 앱 (핵심 위화감 이벤트) =====
    "day2_after_start": {
        background: "classroom",
        character: null,
        next: "day2_after_eunsu_1"
    },
    "day2_after_eunsu_1": {
        character: "eunsu_smile",
        next: "day2_after_eunsu_2"
    },
    "day2_after_eunsu_2": {
        next: "day2_after_eunsu_3"
    },
    "day2_after_eunsu_3": {
        next: "day2_after_eunsu_4"
    },
    "day2_after_eunsu_4": {
        next: "day2_after_eunsu_5"
    },
    "day2_after_eunsu_5": {
        next: "day2_after_eunsu_6"
    },
    "day2_after_eunsu_6": {
        next: "day2_after_eunsu_choice"
    },
    "day2_after_eunsu_choice": {
        choices: [
            {
                next: "day2_after_comply_1",
                stats: { eunsu: { affinity: 5, danger: 10 } },
                setFlags: ["gave_phone_eunsu", "installed_safety_app"]
            },
            {
                next: "day2_after_refuse_1",
                stats: { eunsu: { danger: 3 } },
                setFlags: ["refused_phone_eunsu"]
            }
        ]
    },

    // --- 선택 1: 폰을 건넨다 ---
    "day2_after_comply_1": {
        next: "day2_after_comply_2"
    },
    "day2_after_comply_2": {
        next: "day2_after_comply_3"
    },
    "day2_after_comply_3": {
        next: "day2_after_comply_4",
        setFlags: ["phone_checked"],
        glitch: { fakePermissionModal: true }
    },
    "day2_after_comply_4": {
        next: "day2_after_comply_5"
    },
    "day2_after_comply_5": {
        next: "day2_after_comply_6"
    },
    "day2_after_comply_6": {
        character: null,
        next: "day2_after_transition"
    },

    // --- 선택 2: 거절한다 ---
    "day2_after_refuse_1": {
        next: "day2_after_refuse_2"
    },
    "day2_after_refuse_2": {
        next: "day2_after_refuse_3"
    },
    "day2_after_refuse_3": {
        next: "day2_after_refuse_4"
    },
    "day2_after_refuse_4": {
        character: null,
        next: "day2_after_transition"
    },

    // ===== 방과후 선택지 =====
    "day2_after_transition": {
        bgm: "sunset_warm.mp3",
        next: "day2_after_choice"
    },
    "day2_after_choice": {
        choices: [
            { next: "day2_after_sea_1" },
            { next: "day2_after_yuna_1", condition: "met_yuna" },
            { next: "day2_after_riin_1", condition: "met_riin" },
            { next: "day2_after_home_1" }
        ]
    },

    // ===== 세아 -- 학생회실 (핵심 캐릭터 씬) =====
    "day2_after_sea_1": {
        background: "classroom",
        character: null,
        next: "day2_after_sea_2"
    },
    "day2_after_sea_2": {
        character: "sea_smile",
        next: "day2_after_sea_3"
    },
    "day2_after_sea_3": {
        next: "day2_after_sea_4"
    },
    "day2_after_sea_4": {
        next: "day2_after_sea_5"
    },
    "day2_after_sea_5": {
        next: "day2_after_sea_6"
    },
    "day2_after_sea_6": {
        next: "day2_after_sea_7"
    },
    "day2_after_sea_7": {
        next: "day2_after_sea_8"
    },
    "day2_after_sea_8": {
        next: "day2_after_sea_9"
    },
    "day2_after_sea_9": {
        next: "day2_after_sea_10"
    },
    "day2_after_sea_10": {
        next: "day2_after_sea_11"
    },
    "day2_after_sea_11": {
        character: "sea_sad",
        next: "day2_after_sea_12"
    },
    "day2_after_sea_12": {
        next: "day2_after_sea_13"
    },
    "day2_after_sea_13": {
        next: "day2_after_sea_14"
    },
    "day2_after_sea_14": {
        next: "day2_after_sea_15",
        stats: { sea: { affinity: 8 } }
    },
    "day2_after_sea_15": {
        character: "sea_cry",
        next: "day2_after_sea_16"
    },
    "day2_after_sea_16": {
        next: "day2_after_sea_17"
    },
    "day2_after_sea_17": {
        next: "day2_after_sea_18"
    },
    "day2_after_sea_18": {
        next: "day2_after_sea_19"
    },
    "day2_after_sea_19": {
        next: "day2_after_sea_20"
    },
    "day2_after_sea_20": {
        next: "day2_after_sea_21"
    },
    "day2_after_sea_21": {
        next: "day2_after_sea_22"
    },
    "day2_after_sea_22": {
        character: "sea_shy",
        next: "day2_after_sea_23"
    },
    "day2_after_sea_23": {
        next: "day2_after_sea_24"
    },
    "day2_after_sea_24": {
        next: "day2_after_sea_25"
    },
    "day2_after_sea_25": {
        next: "day2_after_sea_26"
    },
    "day2_after_sea_26": {
        next: "day2_after_sea_27"
    },
    "day2_after_sea_27": {
        next: "day2_after_sea_28"
    },
    "day2_after_sea_28": {
        character: "sea_smile",
        next: "day2_after_sea_29"
    },
    "day2_after_sea_29": {
        character: null,
        next: "day2_after_end"
    },

    // ===== 유나 -- 도서관 =====
    "day2_after_yuna_1": {
        background: "library",
        character: null,
        next: "day2_after_yuna_2"
    },
    "day2_after_yuna_2": {
        next: "day2_after_yuna_3"
    },
    "day2_after_yuna_3": {
        character: "yuna_normal",
        next: "day2_after_yuna_4"
    },
    "day2_after_yuna_4": {
        next: "day2_after_yuna_5"
    },
    "day2_after_yuna_5": {
        next: "day2_after_yuna_6"
    },
    "day2_after_yuna_6": {
        character: "yuna_scared",
        next: "day2_after_yuna_7",
        stats: { yuna: { trust: 5 } }
    },
    "day2_after_yuna_7": {
        next: "day2_after_yuna_8"
    },
    "day2_after_yuna_8": {
        next: "day2_after_yuna_9"
    },
    "day2_after_yuna_9": {
        next: "day2_after_yuna_10"
    },
    "day2_after_yuna_10": {
        next: "day2_after_yuna_11"
    },
    "day2_after_yuna_11": {
        next: "day2_after_yuna_12"
    },
    "day2_after_yuna_12": {
        next: "day2_after_yuna_13"
    },
    "day2_after_yuna_13": {
        next: "day2_after_yuna_14"
    },
    "day2_after_yuna_14": {
        next: "day2_after_yuna_15"
    },
    "day2_after_yuna_15": {
        next: "day2_after_yuna_16"
    },
    "day2_after_yuna_16": {
        next: "day2_after_yuna_17"
    },
    "day2_after_yuna_17": {
        next: "day2_after_yuna_18"
    },
    "day2_after_yuna_18": {
        character: null,
        next: "day2_after_end"
    },

    // ===== 리인 -- 보건실 =====
    "day2_after_riin_1": {
        background: "nurse_office",
        character: null,
        next: "day2_after_riin_2"
    },
    "day2_after_riin_2": {
        next: "day2_after_riin_3"
    },
    "day2_after_riin_3": {
        next: "day2_after_riin_4"
    },
    "day2_after_riin_4": {
        character: "riin_cold",
        next: "day2_after_riin_5"
    },
    "day2_after_riin_5": {
        next: "day2_after_riin_6"
    },
    "day2_after_riin_6": {
        next: "day2_after_riin_7"
    },
    "day2_after_riin_7": {
        next: "day2_after_riin_8"
    },
    "day2_after_riin_8": {
        character: "riin_smile",
        next: "day2_after_riin_9"
    },
    "day2_after_riin_9": {
        next: "day2_after_riin_10"
    },
    "day2_after_riin_10": {
        next: "day2_after_riin_11"
    },
    "day2_after_riin_11": {
        next: "day2_after_riin_12"
    },
    "day2_after_riin_12": {
        next: "day2_after_riin_13"
    },
    "day2_after_riin_13": {
        character: null,
        next: "day2_after_end"
    },

    // ===== 귀가 -- 설화 목격 (greeted_seolhwa 조건) =====
    "day2_after_home_1": {
        background: "school_gate",
        character: null,
        next: "day2_after_home_check"
    },
    "day2_after_home_check": {
        branches: [
            { condition: "greeted_seolhwa", next: "day2_after_home_2" }
        ],
        fallback: "day2_after_end"
    },
    "day2_after_home_2": {
        next: "day2_after_home_3"
    },
    "day2_after_home_3": {
        next: "day2_after_seolhwa_1"
    },
    "day2_after_seolhwa_1": {
        character: "seolhwa_fading",
        glitch: { silence: true, silenceDuration: 3000 },
        next: "day2_after_seolhwa_2"
    },
    "day2_after_seolhwa_2": {
        next: "day2_after_seolhwa_3"
    },
    "day2_after_seolhwa_3": {
        character: null,
        next: "day2_after_seolhwa_4"
    },
    "day2_after_seolhwa_4": {
        next: "day2_after_seolhwa_5"
    },
    "day2_after_seolhwa_5": {
        next: "day2_after_end"
    },

    // ===== 방과후 종료 =====
    "day2_after_end": {
        background: "school_gate",
        character: null,
        changeSlot: "night",
        next: "day2_night_start"
    }
});
