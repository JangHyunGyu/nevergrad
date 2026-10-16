/**
 * =========================================================================
 * Day 1-3: Afterschool - 방과후 선택의 시간
 * =========================================================================
 * 각 캐릭터와 1:1 시간.
 * - 세아: 학생회실, 캔 음료, "내일도 올래?"
 * - 유나: 도서관, 카메라 사진, 고양이 치즈, "꼭 오세요"
 * - 리인: 보건실, 허브차, "이상한 꿈 꾸는 애들"
 * - 은수: 교무실, 커피, "전학 사유가 좀 특이해서"
 * - 귀가: 교문, 3층 창가 실루엣 (설화)
 * =========================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 방과후 시작 =====
    "day1_after_start": {
        bgm: "sunset_warm.mp3",
        character: null,
        next: "day1_after_choice"
    },
    "day1_after_choice": {
        character: null,
        choices: [
            { next: "day1_after_sea_1", stats: { sea: { affinity: 4 } } },
            { next: "day1_after_yuna_1", condition: "met_yuna", setFlags: ["yuna_route_started"], stats: { yuna: { affinity: 4 } } },
            { next: "day1_after_riin_1", condition: "met_riin", stats: { riin: { affinity: 4 } } },
            { next: "day1_after_eunsu_1", stats: { eunsu: { affinity: 4 } } },
            { next: "day1_after_home_1", stats: { sea: { affinity: -2 }, eunsu: { affinity: -1 } } }
        ]
    },

    // ===== 세아 — 학생회실 (lines 527-563) =====
    "day1_after_sea_1": {
        background: "student_council",
        character: null,
        next: "day1_after_sea_2"
    },
    "day1_after_sea_2": {
        character: "sea_smile",
        next: "day1_after_sea_3"
    },
    "day1_after_sea_3": {
        character: "sea_smile",
        next: "day1_after_sea_4"
    },
    "day1_after_sea_4": {
        character: "sea_normal",
        next: "day1_after_sea_5"
    },
    "day1_after_sea_5": {
        character: "sea_normal",
        next: "day1_after_sea_6"
    },
    "day1_after_sea_6": {
        character: "sea_normal",
        next: "day1_after_sea_7"
    },
    "day1_after_sea_7": {
        character: "sea_smile",
        next: "day1_after_sea_8"
    },
    "day1_after_sea_8": {
        character: "sea_normal",
        next: "day1_after_sea_9"
    },
    "day1_after_sea_9": {
        character: "sea_normal",
        next: "day1_after_sea_10"
    },
    "day1_after_sea_10": {
        character: "sea_sad",
        next: "day1_after_sea_11"
    },
    "day1_after_sea_11": {
        character: "sea_sad",
        next: "day1_after_sea_12"
    },
    "day1_after_sea_12": {
        character: "sea_normal",
        next: "day1_after_sea_13"
    },
    "day1_after_sea_13": {
        character: "sea_normal",
        next: "day1_after_sea_14"
    },
    "day1_after_sea_14": {
        character: "sea_normal",
        next: "day1_after_sea_15"
    },
    "day1_after_sea_15": {
        character: "sea_smile",
        next: "day1_after_sea_16"
    },
    "day1_after_sea_16": {
        character: "sea_smile",
        next: "day1_after_sea_cabinet_choice"
    },

    // ===== 유나 — 도서관 (lines 565-587) =====
    "day1_after_yuna_1": {
        background: "library",
        character: "yuna_shy",
        next: "day1_after_yuna_2"
    },
    "day1_after_yuna_2": {
        character: "yuna_shy",
        next: "day1_after_yuna_3"
    },
    "day1_after_yuna_3": {
        character: "yuna_shy",
        next: "day1_after_yuna_4"
    },
    "day1_after_yuna_4": {
        character: "yuna_shy",
        next: "day1_after_yuna_cat_1"
    },
    "day1_after_yuna_5": {
        character: "yuna_shy",
        next: "day1_after_yuna_6"
    },
    "day1_after_yuna_6": {
        character: "yuna_normal",
        next: "day1_after_yuna_7"
    },
    "day1_after_yuna_7": {
        character: "yuna_normal",
        next: "day1_after_yuna_8"
    },
    "day1_after_yuna_8": {
        character: "yuna_shy",
        next: "day1_after_yuna_9"
    },
    "day1_after_yuna_9": {
        character: "yuna_shy",
        next: "day1_after_yuna_10"
    },
    // 폴라로이드 선물
    "day1_after_yuna_10": {
        background: "corridor",
        character: "yuna_shy",
        next: "day1_after_yuna_11"
    },
    "day1_after_yuna_11": {
        character: "yuna_shy",
        next: "day1_after_yuna_12"
    },
    "day1_after_yuna_12": {
        character: "yuna_shy",
        next: "day1_after_yuna_13"
    },
    "day1_after_yuna_13": {
        character: "yuna_normal",
        next: "day1_after_yuna_14"
    },
    "day1_after_yuna_14": {
        character: "yuna_normal",
        setFlags: ["received_yuna_photo"],
        next: "day1_after_yuna_back_choice"
    },

    // ===== 리인 — 보건실 (lines 589-603) =====
    "day1_after_riin_1": {
        background: "nurse_office",
        character: "riin_gentle",
        next: "day1_after_riin_2"
    },
    "day1_after_riin_2": {
        character: "riin_gentle",
        next: "day1_after_riin_3"
    },
    "day1_after_riin_3": {
        character: "riin_gentle",
        next: "day1_after_riin_4"
    },
    "day1_after_riin_4": {
        character: "riin_smile",
        next: "day1_after_riin_5"
    },
    "day1_after_riin_5": {
        character: "riin_smile",
        next: "day1_after_riin_6"
    },
    // 허브티 선물 + 음악
    "day1_after_riin_6": {
        character: "riin_gentle",
        next: "day1_after_riin_7"
    },
    "day1_after_riin_7": {
        character: "riin_gentle",
        setFlags: ["received_riin_tea"],
        next: "day1_after_riin_8"
    },
    "day1_after_riin_8": {
        character: "riin_gentle",
        next: "day1_after_riin_9"
    },
    "day1_after_riin_9": {
        character: "riin_gentle",
        next: "day1_after_riin_10"
    },
    "day1_after_riin_10": {
        character: "riin_gentle",
        next: "day1_after_riin_11"
    },
    "day1_after_riin_11": {
        character: "riin_gentle",
        next: "day1_after_riin_tea_choice"
    },
    "day1_after_riin_12": {
        character: "riin_gentle",
        background: "corridor",
        next: "day1_after_home_1"
    },

    // ===== 은수 — 교무실 (lines 605-621) =====
    "day1_after_eunsu_1": {
        background: "teacher_office",
        character: "eunsu_warm",
        next: "day1_after_eunsu_2"
    },
    "day1_after_eunsu_2": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_3"
    },
    "day1_after_eunsu_3": {
        character: "eunsu_normal",
        next: "day1_after_eunsu_4"
    },
    "day1_after_eunsu_4": {
        character: "eunsu_normal",
        next: "day1_after_eunsu_5"
    },
    "day1_after_eunsu_5": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_6"
    },
    "day1_after_eunsu_6": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_7"
    },
    // 따뜻한 마무리
    "day1_after_eunsu_7": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_8"
    },
    "day1_after_eunsu_8": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_counsel_1"
    },
    "day1_after_eunsu_9": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_10"
    },
    "day1_after_eunsu_10": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_file_choice"
    },

    // ===== 귀가 (lines 623-637) =====
    "day1_after_home_1": {
        background: "school_gate_evening",
        bgm_fade: { from: "sunset_warm.mp3", to: "night_calm.mp3" },
        character: null,
        next: "day1_after_home_2"
    },
    "day1_after_home_2": {
        character: null,
        next: "day1_after_home_3"
    },
    "day1_after_home_3": {
        character: null,
        next: "day1_after_home_4"
    },
    "day1_after_home_4": {
        character: null,
        next: "day1_after_home_5"
    },
    "day1_after_home_5": {
        character: null,
        next: "day1_after_home_6"
    },
    "day1_after_home_6": {
        character: null,
        next: "day1_after_end"
    },

    // ===== 공통 종료 =====
    "day1_after_end": {
        character: null,
        changeSlot: "night",
        next: "day1_night_start"
    },
    "day1_after_sea_walk_1": {
        background: "corridor",
        character: "sea_smile",
        next: "day1_after_sea_walk_2"
    },
    "day1_after_sea_walk_2": {
        character: "sea_smile",
        next: "day1_after_sea_walk_3"
    },
    "day1_after_sea_walk_3": {
        character: "sea_smile",
        next: "day1_after_sea_walk_4"
    },
    "day1_after_sea_walk_4": {
        character: "sea_smile",
        next: "day1_after_home_1"
    },
    "day1_after_eunsu_counsel_1": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_counsel_2"
    },
    "day1_after_eunsu_counsel_2": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_counsel_3"
    },
    "day1_after_eunsu_counsel_3": {
        character: "eunsu_warm",
        next: "day1_after_eunsu_9"
    },
    "day1_after_yuna_cat_1": {
        character: "yuna_shy",
        next: "day1_after_yuna_cat_2"
    },
    "day1_after_yuna_cat_2": {
        character: "yuna_shy",
        next: "day1_after_yuna_cat_3"
    },
    "day1_after_yuna_cat_3": {
        character: "yuna_shy",
        next: "day1_after_yuna_5"
    }
});

Object.assign(SCENARIO[1], {
"day1_after_sea_cabinet_choice": {
        character: "sea_normal",
        choices: [
            { next: "day1_after_sea_cab_1", setFlags: ["saw_council_old_nametags"], stats: { sea: { affinity: 1 }, seolhwa: { affinity: 2 } } },
            { next: "day1_after_sea_cab_8", stats: { sea: { affinity: 3 } } }
        ]
    },
    "day1_after_sea_cab_1": { character: "sea_normal", next: "day1_after_sea_cab_2" },
    "day1_after_sea_cab_2": { character: "sea_serious", next: "day1_after_sea_cab_3" },
    "day1_after_sea_cab_3": { character: "sea_normal", next: "day1_after_sea_cab_4" },
    "day1_after_sea_cab_4": { character: "sea_normal", next: "day1_after_sea_cab_5" },
    "day1_after_sea_cab_5": { character: "sea_normal", next: "day1_after_sea_cab_6" },
    "day1_after_sea_cab_6": { character: "sea_sad", next: "day1_after_sea_cab_7" },
    "day1_after_sea_cab_7": { character: "sea_normal", next: "day1_after_sea_cab_13" },
    "day1_after_sea_cab_8": { character: "sea_normal", next: "day1_after_sea_cab_9" },
    "day1_after_sea_cab_9": { character: "sea_normal", next: "day1_after_sea_cab_10" },
    "day1_after_sea_cab_10": { character: "sea_smile", next: "day1_after_sea_cab_11" },
    "day1_after_sea_cab_11": { character: "sea_normal", next: "day1_after_sea_cab_12" },
    "day1_after_sea_cab_12": { character: "sea_smile", next: "day1_after_sea_cab_13" },
    "day1_after_sea_cab_13": { character: "sea_normal", next: "day1_after_sea_cab_14" },
    "day1_after_sea_cab_14": { character: "sea_smile", next: "day1_after_sea_cab_15" },
    "day1_after_sea_cab_15": { character: "sea_smile", next: "day1_after_sea_walk_1" },

    "day1_after_yuna_back_choice": {
        character: "yuna_normal",
        choices: [
            { next: "day1_after_yuna_back_1", setFlags: ["noticed_polaroid_13"], stats: { yuna: { affinity: 3 }, seolhwa: { affinity: 2 } } },
            { next: "day1_after_yuna_back_8", setFlags: ["heard_yuna_darkroom_keys"], stats: { yuna: { affinity: 3 } } }
        ]
    },
    "day1_after_yuna_back_1": { character: "yuna_scared", next: "day1_after_yuna_back_2" },
    "day1_after_yuna_back_2": { character: "yuna_shy", next: "day1_after_yuna_back_3" },
    "day1_after_yuna_back_3": { character: "yuna_shy", next: "day1_after_yuna_back_4" },
    "day1_after_yuna_back_4": { character: "yuna_normal", next: "day1_after_yuna_back_5" },
    "day1_after_yuna_back_5": { character: "yuna_normal", next: "day1_after_yuna_back_6" },
    "day1_after_yuna_back_6": { character: "yuna_smile", next: "day1_after_yuna_back_7" },
    "day1_after_yuna_back_7": { character: "yuna_smile", next: "day1_after_yuna_back_13" },
    "day1_after_yuna_back_8": { character: "yuna_shy", next: "day1_after_yuna_back_9" },
    "day1_after_yuna_back_9": { character: "yuna_shy", next: "day1_after_yuna_back_10" },
    "day1_after_yuna_back_10": { character: "yuna_normal", next: "day1_after_yuna_back_11" },
    "day1_after_yuna_back_11": { character: "yuna_normal", next: "day1_after_yuna_back_12" },
    "day1_after_yuna_back_12": { character: "yuna_serious", next: "day1_after_yuna_back_13" },
    "day1_after_yuna_back_13": { character: "yuna_normal", next: "day1_after_yuna_back_14" },
    "day1_after_yuna_back_14": { character: "yuna_shy", next: "day1_after_yuna_back_15" },
    "day1_after_yuna_back_15": { character: "yuna_smile", next: "day1_after_home_1" },

    "day1_after_riin_tea_choice": {
        character: "riin_gentle",
        choices: [
            { next: "day1_after_riin_tea_1", stats: { riin: { affinity: 2 } } },
            { next: "day1_after_riin_tea_8", stats: { riin: { affinity: 3 } } }
        ]
    },
    "day1_after_riin_tea_1": { character: "riin_normal", next: "day1_after_riin_tea_2" },
    "day1_after_riin_tea_2": { character: "riin_gentle", next: "day1_after_riin_tea_3" },
    "day1_after_riin_tea_3": { character: "riin_gentle", next: "day1_after_riin_tea_4" },
    "day1_after_riin_tea_4": { character: "riin_normal", next: "day1_after_riin_tea_5" },
    "day1_after_riin_tea_5": { character: "riin_normal", next: "day1_after_riin_tea_6" },
    "day1_after_riin_tea_6": { character: "riin_smile", next: "day1_after_riin_tea_7" },
    "day1_after_riin_tea_7": { character: "riin_gentle", next: "day1_after_riin_tea_13" },
    "day1_after_riin_tea_8": { character: "riin_normal", next: "day1_after_riin_tea_9" },
    "day1_after_riin_tea_9": { character: "riin_gentle", next: "day1_after_riin_tea_10" },
    "day1_after_riin_tea_10": { character: "riin_gentle", next: "day1_after_riin_tea_11" },
    "day1_after_riin_tea_11": { character: "riin_smile", next: "day1_after_riin_tea_12" },
    "day1_after_riin_tea_12": { character: "riin_smile", next: "day1_after_riin_tea_13" },
    "day1_after_riin_tea_13": { character: "riin_gentle", next: "day1_after_riin_tea_14" },
    "day1_after_riin_tea_14": { character: "riin_smile", next: "day1_after_riin_tea_15" },
    "day1_after_riin_tea_15": { character: "riin_gentle", next: "day1_after_riin_12" },

    "day1_after_eunsu_file_choice": {
        character: "eunsu_warm",
        choices: [
            { next: "day1_after_eunsu_file_1", setFlags: ["saw_eunsu_eraser_dust"], stats: { eunsu: { affinity: 2 } } },
            { next: "day1_after_eunsu_file_8", stats: { eunsu: { affinity: 3 } } }
        ]
    },
    "day1_after_eunsu_file_1": { character: "eunsu_normal", next: "day1_after_eunsu_file_2" },
    "day1_after_eunsu_file_2": { character: "eunsu_gentle", next: "day1_after_eunsu_file_3" },
    "day1_after_eunsu_file_3": { character: "eunsu_warm", next: "day1_after_eunsu_file_4" },
    "day1_after_eunsu_file_4": { character: "eunsu_warm", next: "day1_after_eunsu_file_5" },
    "day1_after_eunsu_file_5": { character: "eunsu_smile", next: "day1_after_eunsu_file_6" },
    "day1_after_eunsu_file_6": { character: "eunsu_normal", next: "day1_after_eunsu_file_7" },
    "day1_after_eunsu_file_7": { character: "eunsu_warm", next: "day1_after_eunsu_file_13" },
    "day1_after_eunsu_file_8": { character: "eunsu_normal", next: "day1_after_eunsu_file_9" },
    "day1_after_eunsu_file_9": { character: "eunsu_normal", next: "day1_after_eunsu_file_10" },
    "day1_after_eunsu_file_10": { character: "eunsu_gentle", next: "day1_after_eunsu_file_11" },
    "day1_after_eunsu_file_11": { character: "eunsu_warm", next: "day1_after_eunsu_file_12" },
    "day1_after_eunsu_file_12": { character: "eunsu_warm", next: "day1_after_eunsu_file_13" },
    "day1_after_eunsu_file_13": { character: "eunsu_normal", next: "day1_after_eunsu_file_14" },
    "day1_after_eunsu_file_14": { character: "eunsu_warm", next: "day1_after_eunsu_file_15" },
    "day1_after_eunsu_file_15": { character: "eunsu_warm", next: "day1_after_home_1" }
});
