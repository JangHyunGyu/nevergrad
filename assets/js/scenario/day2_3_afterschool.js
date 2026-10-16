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
        character: "eunsu_warm",
        next: "day2_after_eunsu_1"
    },
    "day2_after_eunsu_1": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_2"
    },
    "day2_after_eunsu_2": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_checkin_1"
    },
    "day2_after_eunsu_3": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_4"
    },
    "day2_after_eunsu_4": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_5"
    },
    "day2_after_eunsu_5": {
        character: "eunsu_gentle",
        next: "day2_after_eunsu_6"
    },
    "day2_after_eunsu_6": {
        character: "eunsu_gentle",
        next: "day2_after_eunsu_7"
    },
    "day2_after_eunsu_7": {
        character: "eunsu_gentle",
        next: "day2_after_eunsu_8"
    },
    "day2_after_eunsu_8": {
        character: "eunsu_gentle",
        next: "day2_after_eunsu_choice"
    },

    // --- 권한 선택 ---
    "day2_after_eunsu_choice": {
        character: null,
        choices: [
            {
                next: "day2_after_allow_1",
                stats: { eunsu: { affinity: 5 } },
                setFlags: ["safety_app_installed", "app_all_permissions"]
            },
            {
                next: "day2_after_limit_1",
                stats: { eunsu: { affinity: -2 } },
                setFlags: ["safety_app_installed", "app_limited_permissions"]
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
        character: "eunsu_normal",
        next: "day2_after_limit_4"
    },
    "day2_after_limit_4": {
        character: "eunsu_gentle",
        next: "day2_after_limit_5"
    },
    "day2_after_limit_5": {
        character: "eunsu_gentle",
        next: "day2_after_sea_start"
    },

    // ===== 세아 — 학생회실 =====
    "day2_after_sea_start": {
        background: "student_council",
        character: null,
        setFlags: ["sea_student_council"],
        next: "day2_after_sea_1"
    },
    "day2_after_sea_1": {
        character: "sea_smile",
        next: "day2_after_sea_2"
    },
    "day2_after_sea_2": {
        character: "sea_smile",
        next: "day2_after_sea_3"
    },
    "day2_after_sea_3": {
        character: "sea_smile",
        next: "day2_after_sea_4"
    },
    "day2_after_sea_4": {
        character: "sea_smile",
        next: "day2_after_sea_5"
    },
    "day2_after_sea_5": {
        character: "sea_smile",
        next: "day2_after_sea_6"
    },
    "day2_after_sea_6": {
        character: "sea_normal",
        next: "day2_after_sea_7"
    },
    "day2_after_sea_7": {
        character: "sea_normal",
        next: "day2_after_sea_8"
    },
    "day2_after_sea_8": {
        character: "sea_smile",
        next: "day2_after_sea_9"
    },
    "day2_after_sea_9": {
        character: "sea_smile",
        next: "day2_after_sea_paper_1"
    },
    "day2_after_sea_10": {
        character: "sea_normal",
        next: "day2_after_sea_11"
    },
    "day2_after_sea_11": {
        character: "sea_normal",
        next: "day2_after_sea_12"
    },
    "day2_after_sea_12": {
        character: "sea_normal",
        next: "day2_after_sea_13"
    },
    "day2_after_sea_13": {
        character: "sea_normal",
        next: "day2_after_sea_14"
    },
    "day2_after_sea_14": {
        character: "sea_normal",
        next: "day2_after_sea_15"
    },
    "day2_after_sea_15": {
        character: "sea_normal",
        next: "day2_after_sea_16"
    },
    "day2_after_sea_16": {
        character: "sea_normal",
        next: "day2_after_sea_17"
    },
    "day2_after_sea_17": {
        character: "sea_normal",
        next: "day2_after_sea_18"
    },
    "day2_after_sea_18": {
        character: "sea_sad",
        next: "day2_after_sea_19"
    },
    "day2_after_sea_19": {
        character: "sea_sad",
        next: "day2_after_sea_20"
    },
    "day2_after_sea_20": {
        character: "sea_sad",
        next: "day2_after_sea_21"
    },
    "day2_after_sea_21": {
        character: "sea_sad",
        next: "day2_after_sea_22"
    },
    "day2_after_sea_22": {
        character: "sea_sad",
        next: "day2_after_sea_choice"
    },
    "day2_after_sea_choice": {
        character: null,
        choices: [
            {
                next: "day2_after_sea_23",
                stats: { sea: { affinity: 4 } }
            },
            {
                next: "day2_after_sea_invite_1",
                stats: { sea: { affinity: -2 } }
            },
            {
                next: "day2_after_sea_silent_1",
                stats: { sea: { affinity: 2 } }
            }
        ]
    },
    "day2_after_sea_23": {
        character: "sea_normal",
        next: "day2_after_sea_24"
    },
    "day2_after_sea_24": {
        character: "sea_smile",
        next: "day2_after_sea_25"
    },
    "day2_after_sea_25": {
        character: "sea_smile",
        next: "day2_after_sea_26"
    },
    "day2_after_sea_26": {
        character: "sea_smile",
        next: "day2_after_sea_27"
    },
    "day2_after_sea_27": {
        character: "sea_smile",
        next: "day2_after_sea_28"
    },
    "day2_after_sea_28": {
        character: "sea_smile",
        next: "day2_after_detour_choice"
    },
    "day2_after_sea_invite_1": {
        character: "sea_sad",
        next: "day2_after_sea_invite_2"
    },
    "day2_after_sea_invite_2": {
        character: "sea_stare",
        next: "day2_after_sea_invite_3"
    },
    "day2_after_sea_invite_3": {
        character: "sea_stare",
        next: "day2_after_sea_invite_4"
    },
    "day2_after_sea_invite_4": {
        character: "sea_sad",
        next: "day2_after_sea_26"
    },
    "day2_after_sea_silent_1": {
        character: "sea_sad",
        next: "day2_after_sea_silent_2"
    },
    "day2_after_sea_silent_2": {
        character: "sea_sad",
        next: "day2_after_sea_silent_3"
    },
    "day2_after_sea_silent_3": {
        character: "sea_smile",
        next: "day2_after_sea_26"
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
        charOpacity: 0.72,
        next: "day2_after_seolhwa_3"
    },
    "day2_after_seolhwa_3": {
        character: "seolhwa_sad",
        charOpacity: 0.72,
        next: "day2_after_seolhwa_4"
    },
    "day2_after_seolhwa_4": {
        character: "seolhwa_sad",
        charOpacity: 0.72,
        next: "day2_after_seolhwa_5"
    },
    "day2_after_seolhwa_5": {
        character: "seolhwa_sad",
        charOpacity: 0.72,
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
        next: "day2_after_seolhwa_trace_choice"
    },

    // ===== 방과후 종료 =====
    "day2_after_end": {
        background: "school_gate",
        character: null,
        changeSlot: "night",
        next: "day2_night_start"
    },
    "day2_after_sea_paper_1": {
        character: "sea_smile",
        next: "day2_after_sea_paper_2"
    },
    "day2_after_sea_paper_2": {
        character: "sea_smile",
        next: "day2_after_sea_paper_3"
    },
    "day2_after_sea_paper_3": {
        character: "sea_smile",
        next: "day2_after_sea_paper_4"
    },
    "day2_after_sea_paper_4": {
        character: "sea_smile",
        next: "day2_after_sea_10"
    },
    "day2_after_eunsu_checkin_1": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_checkin_2"
    },
    "day2_after_eunsu_checkin_2": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_checkin_3"
    },
    "day2_after_eunsu_checkin_3": {
        character: "eunsu_warm",
        next: "day2_after_eunsu_3"
    }
});

Object.assign(SCENARIO[2], {
"day2_after_detour_choice": {
        background: "corridor",
        character: null,
        choices: [
            { next: "day2_after_detour_hall_1", stats: { sea: { affinity: 2 } } },
            { next: "day2_after_detour_lib_1", setFlags: ["saw_board_window_photo"], stats: { yuna: { affinity: 3 }, seolhwa: { affinity: 2 } } },
            { next: "day2_after_detour_nur_1", setFlags: ["overheard_riin_day2_call"], stats: { riin: { affinity: 2 }, seolhwa: { affinity: 2 } } }
        ]
    },
    "day2_after_detour_hall_1": { character: null, next: "day2_after_detour_hall_2" },
    "day2_after_detour_hall_2": { character: null, next: "day2_after_detour_hall_3" },
    "day2_after_detour_hall_3": { character: null, next: "day2_after_detour_hall_4" },
    "day2_after_detour_hall_4": { character: null, next: "day2_after_detour_hall_5" },
    "day2_after_detour_hall_5": { character: null, next: "day2_after_detour_hall_6" },
    "day2_after_detour_hall_6": { character: null, next: "day2_after_detour_hall_7" },
    "day2_after_detour_hall_7": { character: null, next: "day2_after_detour_hall_8" },
    "day2_after_detour_hall_8": { character: null, next: "day2_after_detour_hall_9" },
    "day2_after_detour_hall_9": { character: null, next: "day2_after_detour_hall_10" },
    "day2_after_detour_hall_10": { character: null, next: "day2_after_detour_hall_11" },
    "day2_after_detour_hall_11": { character: null, next: "day2_after_detour_hall_12" },
    "day2_after_detour_hall_12": { character: null, next: "day2_after_hallway_1" },

    "day2_after_detour_lib_1": { background: "corridor", character: null, next: "day2_after_detour_lib_2" },
    "day2_after_detour_lib_2": { character: null, next: "day2_after_detour_lib_3" },
    "day2_after_detour_lib_3": { character: null, next: "day2_after_detour_lib_4" },
    "day2_after_detour_lib_4": { character: null, next: "day2_after_detour_lib_5" },
    "day2_after_detour_lib_5": { character: "yuna_shy", next: "day2_after_detour_lib_6" },
    "day2_after_detour_lib_6": { character: "yuna_normal", next: "day2_after_detour_lib_7" },
    "day2_after_detour_lib_7": { character: "yuna_normal", next: "day2_after_detour_lib_8" },
    "day2_after_detour_lib_8": { character: "yuna_scared", next: "day2_after_detour_lib_9" },
    "day2_after_detour_lib_9": { character: "yuna_shy", next: "day2_after_detour_lib_10" },
    "day2_after_detour_lib_10": { character: "yuna_normal", next: "day2_after_detour_lib_11" },
    "day2_after_detour_lib_11": { character: "yuna_shy", next: "day2_after_detour_lib_12" },
    "day2_after_detour_lib_12": { character: "yuna_serious", next: "day2_after_detour_lib_13" },
    "day2_after_detour_lib_13": { character: "yuna_serious", next: "day2_after_detour_lib_14" },
    "day2_after_detour_lib_14": { character: null, next: "day2_after_hallway_1" },

    "day2_after_detour_nur_1": { background: "corridor", character: null, next: "day2_after_detour_nur_2" },
    "day2_after_detour_nur_2": { character: null, next: "day2_after_detour_nur_3" },
    "day2_after_detour_nur_3": { character: null, next: "day2_after_detour_nur_4" },
    "day2_after_detour_nur_4": { character: null, next: "day2_after_detour_nur_5" },
    "day2_after_detour_nur_5": { character: "riin_normal", next: "day2_after_detour_nur_6" },
    "day2_after_detour_nur_6": { character: "riin_smile", next: "day2_after_detour_nur_7" },
    "day2_after_detour_nur_7": { character: "riin_normal", next: "day2_after_detour_nur_8" },
    "day2_after_detour_nur_8": { character: "riin_gentle", next: "day2_after_detour_nur_9" },
    "day2_after_detour_nur_9": { character: "riin_gentle", next: "day2_after_detour_nur_10" },
    "day2_after_detour_nur_10": { character: "riin_smile", next: "day2_after_detour_nur_11" },
    "day2_after_detour_nur_11": { character: "riin_gentle", next: "day2_after_detour_nur_12" },
    "day2_after_detour_nur_12": { character: "riin_smile", next: "day2_after_detour_nur_13" },
    "day2_after_detour_nur_13": { character: null, next: "day2_after_detour_nur_14" },
    "day2_after_detour_nur_14": { character: null, next: "day2_after_hallway_1" },

    "day2_after_seolhwa_trace_choice": {
        character: null,
        choices: [
            { next: "day2_after_seolhwa_trc_1", setFlags: ["found_seolhwa_gate_chalk"], stats: { seolhwa: { affinity: 4 } } },
            { next: "day2_after_seolhwa_trc_6", stats: { seolhwa: { affinity: 2 } } }
        ]
    },
    "day2_after_seolhwa_trc_1": { character: null, next: "day2_after_seolhwa_trc_2" },
    "day2_after_seolhwa_trc_2": { character: null, next: "day2_after_seolhwa_trc_3" },
    "day2_after_seolhwa_trc_3": { character: null, next: "day2_after_seolhwa_trc_4" },
    "day2_after_seolhwa_trc_4": { character: null, next: "day2_after_seolhwa_trc_5" },
    "day2_after_seolhwa_trc_5": { character: null, next: "day2_after_seolhwa_trc_9" },
    "day2_after_seolhwa_trc_6": { character: null, next: "day2_after_seolhwa_trc_7" },
    "day2_after_seolhwa_trc_7": { character: null, next: "day2_after_seolhwa_trc_8" },
    "day2_after_seolhwa_trc_8": { character: null, next: "day2_after_seolhwa_trc_9" },
    "day2_after_seolhwa_trc_9": { character: null, next: "day2_after_seolhwa_trc_10" },
    "day2_after_seolhwa_trc_10": { character: null, next: "day2_after_seolhwa_trc_11" },
    "day2_after_seolhwa_trc_11": { character: null, next: "day2_after_seolhwa_trc_12" },
    "day2_after_seolhwa_trc_12": { character: null, next: "day2_after_seolhwa_trc_13" },
    "day2_after_seolhwa_trc_13": { character: null, next: "day2_after_seolhwa_trc_14" },
    "day2_after_seolhwa_trc_14": { character: null, next: "day2_after_end" }
});
