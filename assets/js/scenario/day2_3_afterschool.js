/**
 * ============================================================================
 * Day 2-3: Afterschool - 방과후
 * ============================================================================
 * - 은수의 학생 안전 앱 설치 (권한 선택지 2개)
 * - 세아 학생회실: 체육대회 서류, 음악, 외로움 고백, "변하지 마" / "기억할게"
 * - 복도 급우들과 짧은 수다 (자판기 앞)
 * - 귀가: 설화 목격 (교문, 자연스러운 차단)
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    // ===== 은수의 학생 안전 앱 =====
    "day2_after_start": {
        background: "classroom",
        character: null,
        next: "day2_after_eunsu_1"
    },
    "day2_after_eunsu_1": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_2"
    },
    "day2_after_eunsu_2": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_3"
    },
    "day2_after_eunsu_3": {
        character: null,
        next: "day2_after_eunsu_4"
    },
    "day2_after_eunsu_4": {
        character: null,
        next: "day2_after_eunsu_5"
    },
    "day2_after_eunsu_5": {
        character: "eunsu_gentle",
        next: "day2_after_eunsu_6"
    },
    "day2_after_eunsu_6": {
        character: null,
        next: "day2_after_eunsu_7"
    },
    "day2_after_eunsu_7": {
        character: null,
        next: "day2_after_eunsu_8"
    },
    "day2_after_eunsu_8": {
        character: null,
        next: "day2_after_eunsu_choice"
    },

    // --- 권한 선택 ---
    "day2_after_eunsu_choice": {
        character: null,
        choices: [
            {
                next: "day2_after_allow_1",
                stats: { eunsu: { affinity: 5, danger: 10 } },
                setFlags: ["app_all_permissions"]
            },
            {
                next: "day2_after_limit_1",
                stats: { eunsu: { danger: 3 } },
                setFlags: ["app_limited_permissions"]
            }
        ]
    },

    // --- 선택 1: 전부 허용한다 ---
    "day2_after_allow_1": {
        character: null,
        next: "day2_after_allow_2"
    },
    "day2_after_allow_2": {
        character: null,
        next: "day2_after_sea_start"
    },

    // --- 선택 2: 위치 권한만 제한 ---
    "day2_after_limit_1": {
        character: null,
        next: "day2_after_limit_2"
    },
    "day2_after_limit_2": {
        character: "eunsu_normal",
        next: "day2_after_limit_3"
    },
    "day2_after_limit_3": {
        character: null,
        next: "day2_after_limit_4"
    },
    "day2_after_limit_4": {
        character: "eunsu_gentle",
        next: "day2_after_limit_5"
    },
    "day2_after_limit_5": {
        character: null,
        next: "day2_after_sea_start"
    },

    // ===== 세아 — 학생회실 =====
    "day2_after_sea_start": {
        background: "student_council",
        character: null,
        next: "day2_after_sea_1"
    },
    "day2_after_sea_1": {
        character: "sea_smile",
        next: "day2_after_sea_2"
    },
    "day2_after_sea_2": {
        character: null,
        next: "day2_after_sea_3"
    },
    "day2_after_sea_3": {
        character: "sea_smile",
        next: "day2_after_sea_4"
    },
    "day2_after_sea_4": {
        character: null,
        next: "day2_after_sea_5"
    },
    "day2_after_sea_5": {
        character: null,
        next: "day2_after_sea_6"
    },
    "day2_after_sea_6": {
        character: "sea_smile",
        next: "day2_after_sea_7"
    },
    "day2_after_sea_7": {
        character: null,
        next: "day2_after_sea_8"
    },
    "day2_after_sea_8": {
        character: "sea_smile",
        next: "day2_after_sea_9"
    },
    "day2_after_sea_9": {
        character: null,
        next: "day2_after_sea_10"
    },
    "day2_after_sea_10": {
        character: "sea_smile",
        next: "day2_after_sea_11"
    },
    "day2_after_sea_11": {
        character: null,
        next: "day2_after_sea_12"
    },
    "day2_after_sea_12": {
        character: "sea_smile",
        next: "day2_after_sea_13"
    },
    "day2_after_sea_13": {
        character: null,
        next: "day2_after_sea_14"
    },
    "day2_after_sea_14": {
        character: "sea_smile",
        next: "day2_after_sea_15"
    },
    "day2_after_sea_15": {
        character: null,
        next: "day2_after_sea_16"
    },
    "day2_after_sea_16": {
        character: "sea_normal",
        next: "day2_after_sea_17"
    },
    "day2_after_sea_17": {
        character: null,
        next: "day2_after_sea_18"
    },
    "day2_after_sea_18": {
        character: "sea_vulnerable",
        next: "day2_after_sea_19"
    },
    "day2_after_sea_19": {
        character: "sea_vulnerable",
        next: "day2_after_sea_20"
    },
    "day2_after_sea_20": {
        character: null,
        next: "day2_after_sea_21"
    },
    "day2_after_sea_21": {
        character: "sea_smile",
        next: "day2_after_sea_22",
        stats: { sea: { affinity: 8 } }
    },
    "day2_after_sea_22": {
        character: null,
        next: "day2_after_sea_23"
    },
    "day2_after_sea_23": {
        character: null,
        next: "day2_after_sea_24"
    },
    "day2_after_sea_24": {
        character: "sea_smile",
        next: "day2_after_sea_25"
    },
    "day2_after_sea_25": {
        character: null,
        next: "day2_after_sea_26"
    },
    "day2_after_sea_26": {
        character: null,
        next: "day2_after_sea_27"
    },
    "day2_after_sea_27": {
        character: "sea_smile",
        next: "day2_after_sea_28"
    },
    "day2_after_sea_28": {
        character: null,
        next: "day2_after_hallway_1"
    },

    // ===== 복도 — 급우들과 짧은 수다 =====
    "day2_after_hallway_1": {
        background: "hallway",
        character: null,
        next: "day2_after_hallway_2"
    },
    "day2_after_hallway_2": {
        character: null,
        next: "day2_after_hallway_3"
    },
    "day2_after_hallway_3": {
        character: null,
        next: "day2_after_hallway_4"
    },
    "day2_after_hallway_4": {
        character: null,
        next: "day2_after_hallway_5"
    },
    "day2_after_hallway_5": {
        character: null,
        next: "day2_after_hallway_6"
    },
    "day2_after_hallway_6": {
        character: null,
        next: "day2_after_hallway_7"
    },
    "day2_after_hallway_7": {
        character: null,
        next: "day2_after_hallway_8"
    },
    "day2_after_hallway_8": {
        character: null,
        next: "day2_after_hallway_9"
    },
    "day2_after_hallway_9": {
        character: null,
        next: "day2_after_hallway_10"
    },
    "day2_after_hallway_10": {
        character: null,
        next: "day2_after_hallway_11"
    },
    "day2_after_hallway_11": {
        character: null,
        next: "day2_after_seolhwa_start"
    },

    // ===== 귀가 — 설화 목격 =====
    "day2_after_seolhwa_start": {
        background: "school_gate",
        character: null,
        next: "day2_after_seolhwa_1"
    },
    "day2_after_seolhwa_1": {
        character: null,
        next: "day2_after_seolhwa_2"
    },
    "day2_after_seolhwa_2": {
        character: "seolhwa_sad",
        next: "day2_after_seolhwa_3"
    },
    "day2_after_seolhwa_3": {
        character: null,
        next: "day2_after_seolhwa_4"
    },
    "day2_after_seolhwa_4": {
        character: null,
        next: "day2_after_seolhwa_5"
    },
    "day2_after_seolhwa_5": {
        character: null,
        next: "day2_after_seolhwa_6"
    },
    "day2_after_seolhwa_6": {
        character: null,
        next: "day2_after_seolhwa_7"
    },
    "day2_after_seolhwa_7": {
        character: null,
        next: "day2_after_seolhwa_8"
    },
    "day2_after_seolhwa_8": {
        character: null,
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
