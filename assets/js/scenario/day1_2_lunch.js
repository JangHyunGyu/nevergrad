/**
 * Day 1-2: Lunch - 달콤한 만남들
 * 세아 도시락 + 이어폰 씬, 유나 도서관 첫 만남 + 벚꽃 연작, 리인 보건실 첫 만남, 옥상 혼자
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 점심 시작 =====
    "day1_lunch_start": {
        background: "classroom",
        bgm: "daily_bright.mp3",
        sfx: "sfx_school_bell.mp3",
        character: null,
        next: "day1_lunch_choice"
    },
    "day1_lunch_choice": {
        character: null,
        stopSfx: "sfx_school_bell.mp3",
        choices: [
            { next: "day1_lunch_sea_1", setFlags: ["lunch_with_sea"], stats: { sea: { affinity: 4 } } },
            { next: "day1_lunch_yuna_1", setFlags: ["met_yuna", "yuna_route_started"], stats: { yuna: { affinity: 4 } } },
            { next: "day1_lunch_riin_1", setFlags: ["met_riin"], stats: { riin: { affinity: 4 } } },
            { next: "day1_lunch_alone_1", stats: { sea: { affinity: -1 }, eunsu: { affinity: -1 } } }
        ]
    },

    // ===== 루트 A: 세아와 점심 (sea_1 ~ sea_29) =====
    // 도시락 씬
    "day1_lunch_sea_1": {
        character: "sea_normal",
        next: "day1_lunch_sea_2"
    },
    "day1_lunch_sea_2": {
        character: "sea_normal",
        next: "day1_lunch_sea_3"
    },
    "day1_lunch_sea_3": {
        character: "sea_normal",
        next: "day1_lunch_sea_4"
    },
    "day1_lunch_sea_4": {
        character: "sea_normal",
        next: "day1_lunch_sea_5"
    },
    "day1_lunch_sea_5": {
        character: "sea_normal",
        next: "day1_lunch_sea_6"
    },
    "day1_lunch_sea_6": {
        character: "sea_normal",
        next: "day1_lunch_sea_7"
    },
    "day1_lunch_sea_7": {
        character: "sea_normal",
        next: "day1_lunch_sea_8"
    },
    "day1_lunch_sea_8": {
        character: "sea_normal",
        next: "day1_lunch_sea_9"
    },
    "day1_lunch_sea_9": {
        character: "sea_normal",
        next: "day1_lunch_sea_10"
    },
    "day1_lunch_sea_10": {
        character: "sea_normal",
        next: "day1_lunch_sea_11"
    },
    "day1_lunch_sea_11": {
        character: "sea_normal",
        next: "day1_lunch_sea_12"
    },
    "day1_lunch_sea_12": {
        character: "sea_smile",
        next: "day1_lunch_sea_share_1"
    },
    "day1_lunch_sea_13": {
        character: "sea_smile",
        next: "day1_lunch_sea_14",
        glitch: "loop_truth"
    },
    // 수다 이어짐
    "day1_lunch_sea_14": {
        character: "sea_smile",
        next: "day1_lunch_sea_15"
    },
    "day1_lunch_sea_15": {
        character: "sea_smile",
        next: "day1_lunch_sea_16"
    },
    "day1_lunch_sea_16": {
        character: "sea_normal",
        next: "day1_lunch_sea_17"
    },
    "day1_lunch_sea_17": {
        character: "sea_normal",
        next: "day1_lunch_sea_18"
    },
    "day1_lunch_sea_18": {
        character: "sea_normal",
        next: "day1_lunch_sea_19"
    },
    "day1_lunch_sea_19": {
        character: "sea_smile",
        next: "day1_lunch_sea_20"
    },
    "day1_lunch_sea_20": {
        character: "sea_smile",
        next: "day1_lunch_sea_menu_choice",
        glitch: "loop_truth"
    },
    // 이어폰 음악 공유 씬
    "day1_lunch_sea_21": {
        character: "sea_smile",
        next: "day1_lunch_sea_22"
    },
    "day1_lunch_sea_22": {
        character: "sea_normal",
        next: "day1_lunch_sea_23"
    },
    "day1_lunch_sea_23": {
        character: "sea_normal",
        next: "day1_lunch_sea_24"
    },
    "day1_lunch_sea_24": {
        character: "sea_normal",
        next: "day1_lunch_sea_25"
    },
    "day1_lunch_sea_25": {
        character: "sea_normal",
        next: "day1_lunch_sea_26"
    },
    "day1_lunch_sea_26": {
        character: "sea_normal",
        next: "day1_lunch_sea_27"
    },
    "day1_lunch_sea_27": {
        character: "sea_normal",
        next: "day1_lunch_sea_28"
    },
    "day1_lunch_sea_28": {
        character: "sea_normal",
        next: "day1_lunch_sea_29"
    },
    "day1_lunch_sea_29": {
        character: "sea_normal",
        next: "day1_lunch_end",
        glitch: "loop_truth"
    },

    // ===== 루트 B: 도서관 — 유나 첫 만남 (yuna_1 ~ yuna_16) =====
    "day1_lunch_yuna_1": {
        background: "library",
        character: null,
        next: "day1_lunch_yuna_2"
    },
    "day1_lunch_yuna_2": {
        character: null,
        next: "day1_lunch_yuna_3"
    },
    "day1_lunch_yuna_3": {
        character: "yuna_scared",
        next: "day1_lunch_yuna_4"
    },
    "day1_lunch_yuna_4": {
        character: "yuna_scared",
        next: "day1_lunch_yuna_5"
    },
    "day1_lunch_yuna_5": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_6"
    },
    "day1_lunch_yuna_6": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_7"
    },
    "day1_lunch_yuna_7": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_8"
    },
    "day1_lunch_yuna_8": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_9"
    },
    "day1_lunch_yuna_9": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_10"
    },
    "day1_lunch_yuna_10": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_11"
    },
    "day1_lunch_yuna_11": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_12"
    },
    // 사진 보여주기 + 벚꽃 연작
    "day1_lunch_yuna_12": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_13"
    },
    "day1_lunch_yuna_13": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_14"
    },
    "day1_lunch_yuna_14": {
        character: "yuna_shy",
        next: "day1_lunch_yuna_15"
    },
    "day1_lunch_yuna_15": {
        character: "yuna_normal",
        next: "day1_lunch_yuna_16"
    },
    "day1_lunch_yuna_16": {
        character: "yuna_normal",
        next: "day1_lunch_yuna_lens_choice",
        glitch: "loop_truth"
    },

    // ===== 루트 C: 보건실 — 리인 첫 만남 (riin_1 ~ riin_12) =====
    "day1_lunch_riin_1": {
        background: "nurse_office",
        character: "riin_gentle",
        sfx: "sfx_door_open.mp3",
        next: "day1_lunch_riin_2"
    },
    "day1_lunch_riin_2": {
        character: "riin_gentle",
        next: "day1_lunch_riin_3"
    },
    "day1_lunch_riin_3": {
        character: "riin_gentle",
        next: "day1_lunch_riin_4"
    },
    "day1_lunch_riin_4": {
        character: "riin_gentle",
        next: "day1_lunch_riin_5"
    },
    "day1_lunch_riin_5": {
        character: "riin_normal",
        next: "day1_lunch_riin_6"
    },
    "day1_lunch_riin_6": {
        character: "riin_normal",
        next: "day1_lunch_riin_7"
    },
    "day1_lunch_riin_7": {
        character: "riin_gentle",
        next: "day1_lunch_riin_8"
    },
    "day1_lunch_riin_8": {
        character: "riin_gentle",
        next: "day1_lunch_riin_9"
    },
    "day1_lunch_riin_9": {
        character: "riin_gentle",
        next: "day1_lunch_riin_10"
    },
    "day1_lunch_riin_10": {
        character: "riin_gentle",
        next: "day1_lunch_riin_11"
    },
    "day1_lunch_riin_11": {
        character: "riin_gentle",
        next: "day1_lunch_riin_12"
    },
    "day1_lunch_riin_12": {
        character: "riin_gentle",
        next: "day1_lunch_riin_13"
    },
    // 보건실에서 잠깐 잠들기
    "day1_lunch_riin_13": {
        character: "riin_gentle",
        next: "day1_lunch_riin_14"
    },
    "day1_lunch_riin_14": {
        character: "riin_gentle",
        next: "day1_lunch_riin_15"
    },
    "day1_lunch_riin_15": {
        character: "riin_gentle",
        next: "day1_lunch_riin_16"
    },
    "day1_lunch_riin_16": {
        character: "riin_gentle",
        next: "day1_lunch_riin_17"
    },
    "day1_lunch_riin_17": {
        character: "riin_gentle",
        next: "day1_lunch_riin_rest_1"
    },
    "day1_lunch_riin_18": {
        character: "riin_gentle",
        next: "day1_lunch_riin_chart_choice",
        glitch: "loop_truth"
    },

    // ===== 루트 D: 옥상에서 혼자 (alone_1 ~ alone_5) =====
    "day1_lunch_alone_1": {
        background: "rooftop",
        character: null,
        sfx: "sfx_wind.mp3",
        next: "day1_lunch_alone_2"
    },
    "day1_lunch_alone_2": {
        character: null,
        next: "day1_lunch_alone_3"
    },
    "day1_lunch_alone_3": {
        character: null,
        next: "day1_lunch_alone_4"
    },
    "day1_lunch_alone_4": {
        character: null,
        next: "day1_lunch_alone_5"
    },
    "day1_lunch_alone_5": {
        character: null,
        next: "day1_lunch_alone_rail_choice",
        glitch: "loop_truth"
    },

    // ===== 점심 종료 =====
    "day1_lunch_end": {
        background: "classroom",
        character: null,
        stopSfx: "sfx_wind.mp3",
        changeSlot: "afterschool",
        next: "day1_after_start"
    },
    "day1_lunch_sea_share_1": {
        character: "sea_smile",
        next: "day1_lunch_sea_share_2"
    },
    "day1_lunch_sea_share_2": {
        character: "sea_smile",
        next: "day1_lunch_sea_share_3"
    },
    "day1_lunch_sea_share_3": {
        character: "sea_smile",
        next: "day1_lunch_sea_share_4"
    },
    "day1_lunch_sea_share_4": {
        character: "sea_smile",
        next: "day1_lunch_sea_13"
    },
    "day1_lunch_riin_rest_1": {
        character: "riin_gentle",
        next: "day1_lunch_riin_rest_2"
    },
    "day1_lunch_riin_rest_2": {
        character: "riin_gentle",
        next: "day1_lunch_riin_rest_3"
    },
    "day1_lunch_riin_rest_3": {
        character: "riin_gentle",
        next: "day1_lunch_riin_18"
    }
});

Object.assign(SCENARIO[1], {
"day1_lunch_sea_menu_choice": {
        character: "sea_smile",
        choices: [
            { next: "day1_lunch_sea_menu_1", stats: { sea: { affinity: 3 } } },
            { next: "day1_lunch_sea_menu_8", setFlags: ["noticed_sea_lunchbox_initials"], stats: { sea: { affinity: 1 }, seolhwa: { affinity: 2 } } }
        ]
    },
    "day1_lunch_sea_menu_1": { character: "sea_smile", next: "day1_lunch_sea_menu_2" },
    "day1_lunch_sea_menu_2": { character: "sea_smile", next: "day1_lunch_sea_menu_3" },
    "day1_lunch_sea_menu_3": { character: "sea_normal", next: "day1_lunch_sea_menu_4" },
    "day1_lunch_sea_menu_4": { character: "sea_smile", next: "day1_lunch_sea_menu_5" },
    "day1_lunch_sea_menu_5": { character: "sea_smile", next: "day1_lunch_sea_menu_6" },
    "day1_lunch_sea_menu_6": { character: "sea_smile", next: "day1_lunch_sea_menu_7" },
    "day1_lunch_sea_menu_7": { character: "sea_smile", next: "day1_lunch_sea_menu_13" },
    "day1_lunch_sea_menu_8": { character: "sea_normal", next: "day1_lunch_sea_menu_9" },
    "day1_lunch_sea_menu_9": { character: "sea_serious", next: "day1_lunch_sea_menu_10" },
    "day1_lunch_sea_menu_10": { character: "sea_normal", next: "day1_lunch_sea_menu_11" },
    "day1_lunch_sea_menu_11": { character: "sea_normal", next: "day1_lunch_sea_menu_12" },
    "day1_lunch_sea_menu_12": { character: "sea_smile", next: "day1_lunch_sea_menu_13" },
    "day1_lunch_sea_menu_13": { character: "sea_normal", next: "day1_lunch_sea_menu_14" },
    "day1_lunch_sea_menu_14": { character: "sea_smile", next: "day1_lunch_sea_21" },

    "day1_lunch_yuna_lens_choice": {
        character: "yuna_shy",
        choices: [
            { next: "day1_lunch_yuna_lens_1", setFlags: ["asked_yuna_hidden_gate_photo"], stats: { yuna: { affinity: 3 } } },
            { next: "day1_lunch_yuna_lens_8", stats: { yuna: { affinity: 2 }, seolhwa: { affinity: 2 } } }
        ]
    },
    "day1_lunch_yuna_lens_1": { character: "yuna_scared", next: "day1_lunch_yuna_lens_2" },
    "day1_lunch_yuna_lens_2": { character: "yuna_shy", next: "day1_lunch_yuna_lens_3" },
    "day1_lunch_yuna_lens_3": { character: "yuna_shy", next: "day1_lunch_yuna_lens_4" },
    "day1_lunch_yuna_lens_4": { character: "yuna_normal", next: "day1_lunch_yuna_lens_5" },
    "day1_lunch_yuna_lens_5": { character: "yuna_normal", next: "day1_lunch_yuna_lens_6" },
    "day1_lunch_yuna_lens_6": { character: "yuna_shy", next: "day1_lunch_yuna_lens_7" },
    "day1_lunch_yuna_lens_7": { character: "yuna_normal", next: "day1_lunch_yuna_lens_13" },
    "day1_lunch_yuna_lens_8": { character: "yuna_normal", next: "day1_lunch_yuna_lens_9" },
    "day1_lunch_yuna_lens_9": { character: "yuna_shy", next: "day1_lunch_yuna_lens_10" },
    "day1_lunch_yuna_lens_10": { character: "yuna_shy", next: "day1_lunch_yuna_lens_11" },
    "day1_lunch_yuna_lens_11": { character: "yuna_normal", next: "day1_lunch_yuna_lens_12" },
    "day1_lunch_yuna_lens_12": { character: "yuna_shy", next: "day1_lunch_yuna_lens_13" },
    "day1_lunch_yuna_lens_13": { character: "yuna_normal", next: "day1_lunch_yuna_lens_14" },
    "day1_lunch_yuna_lens_14": { character: "yuna_shy", next: "day1_lunch_yuna_lens_15" },
    "day1_lunch_yuna_lens_15": { character: "yuna_smile", next: "day1_lunch_yuna_lens_16" },
    "day1_lunch_yuna_lens_16": { character: "yuna_smile", next: "day1_lunch_end" },

    "day1_lunch_riin_chart_choice": {
        character: "riin_gentle",
        choices: [
            { next: "day1_lunch_riin_chart_1", setFlags: ["noticed_riin_wrist_mark"], stats: { riin: { affinity: 2 } } },
            { next: "day1_lunch_riin_chart_8", stats: { riin: { affinity: 3 } } }
        ]
    },
    "day1_lunch_riin_chart_1": { character: "riin_normal", next: "day1_lunch_riin_chart_2" },
    "day1_lunch_riin_chart_2": { character: "riin_gentle", next: "day1_lunch_riin_chart_3" },
    "day1_lunch_riin_chart_3": { character: "riin_normal", next: "day1_lunch_riin_chart_4" },
    "day1_lunch_riin_chart_4": { character: "riin_smile", next: "day1_lunch_riin_chart_5" },
    "day1_lunch_riin_chart_5": { character: "riin_gentle", next: "day1_lunch_riin_chart_6" },
    "day1_lunch_riin_chart_6": { character: "riin_smile", next: "day1_lunch_riin_chart_7" },
    "day1_lunch_riin_chart_7": { character: "riin_gentle", next: "day1_lunch_riin_chart_13" },
    "day1_lunch_riin_chart_8": { character: "riin_normal", next: "day1_lunch_riin_chart_9" },
    "day1_lunch_riin_chart_9": { character: "riin_gentle", next: "day1_lunch_riin_chart_10" },
    "day1_lunch_riin_chart_10": { character: "riin_smile", next: "day1_lunch_riin_chart_11" },
    "day1_lunch_riin_chart_11": { character: "riin_normal", next: "day1_lunch_riin_chart_12" },
    "day1_lunch_riin_chart_12": { character: "riin_gentle", next: "day1_lunch_riin_chart_13" },
    "day1_lunch_riin_chart_13": { character: "riin_gentle", next: "day1_lunch_riin_chart_14" },
    "day1_lunch_riin_chart_14": { character: "riin_smile", next: "day1_lunch_riin_chart_15" },
    "day1_lunch_riin_chart_15": { character: "riin_gentle", next: "day1_lunch_end" },

    "day1_lunch_alone_rail_choice": {
        character: null,
        choices: [
            { next: "day1_lunch_alone_rail_1", setFlags: ["rooftop_first_etching_seen"], stats: { seolhwa: { affinity: 3 } } },
            { next: "day1_lunch_alone_rail_5", stats: { yuna: { affinity: 2 } } }
        ]
    },
    "day1_lunch_alone_rail_1": { character: null, next: "day1_lunch_alone_rail_2" },
    "day1_lunch_alone_rail_2": { character: null, next: "day1_lunch_alone_rail_3" },
    "day1_lunch_alone_rail_3": { character: null, next: "day1_lunch_alone_rail_4" },
    "day1_lunch_alone_rail_4": { character: null, next: "day1_lunch_alone_rail_8" },
    "day1_lunch_alone_rail_5": { character: null, next: "day1_lunch_alone_rail_6" },
    "day1_lunch_alone_rail_6": { character: null, next: "day1_lunch_alone_rail_7" },
    "day1_lunch_alone_rail_7": { character: null, next: "day1_lunch_alone_rail_8" },
    "day1_lunch_alone_rail_8": { character: null, next: "day1_lunch_alone_rail_9" },
    "day1_lunch_alone_rail_9": { character: null, next: "day1_lunch_alone_rail_10" },
    "day1_lunch_alone_rail_10": { character: null, next: "day1_lunch_alone_rail_11" },
    "day1_lunch_alone_rail_11": { background: "stairway", character: null, next: "day1_lunch_alone_rail_12" },
    "day1_lunch_alone_rail_12": { character: null, next: "day1_lunch_alone_rail_13" },
    "day1_lunch_alone_rail_13": { character: null, next: "day1_lunch_alone_rail_14" },
    "day1_lunch_alone_rail_14": { background: "corridor", character: null, next: "day1_lunch_alone_rail_15" },
    "day1_lunch_alone_rail_15": { character: null, next: "day1_lunch_end" }
});
