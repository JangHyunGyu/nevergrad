/**
 * Day 5-1: Morning - 새벽 출발, 유나 구출, 봉쇄, 졸업식, 은수의 제안.
 * NIGHTMARE 글리치 레벨 4. heartbeat_loop → silence_tension → music_box_broken.
 * 2-choice 분기 (ESCAPE/TRUE), 10초 타이머, 15초 최종 타이머.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    // ══════════════════════════════════════
    // Day 5 아침 진입점 (day4_night_end에서 연결)
    // ══════════════════════════════════════
    "day5_morning_start": {
        background: "room_dark",
        bgm: "heartbeat_loop.mp3",
        character: null,
        glitchLevel: 4,
        unskippable: true,
        next: "day5_morning_plan_branch"
    },
    "day5_morning_plan_branch": {
        character: null,
        branches: [
            { condition: "plan_escape_school", next: "day5_morning_plan_escape" },
            { condition: "plan_expose_truth", next: "day5_morning_plan_expose" },
            { condition: "plan_confront_them", next: "day5_morning_plan_confront" }
        ],
        next: "day5_morning_dawn_1"
    },
    "day5_morning_plan_escape": {
        character: null,
        next: "day5_morning_dawn_1"
    },
    "day5_morning_plan_expose": {
        character: null,
        next: "day5_morning_dawn_1"
    },
    "day5_morning_plan_confront": {
        character: null,
        next: "day5_morning_dawn_1"
    },

    // ══════════════════════════════════════
    // 새벽: 출발 — 자취방 4AM
    // ══════════════════════════════════════
    "day5_morning_dawn_1": {
        background: "room_dark",
        bgm: "heartbeat_loop.mp3",
        character: null,
        glitchLevel: 4,
        unskippable: true,
        next: "day5_morning_dawn_2"
    },
    "day5_morning_dawn_2": {
        character: null,
        next: "day5_morning_dawn_3"
    },
    "day5_morning_dawn_3": {
        character: null,
        next: "day5_morning_dawn_4"
    },
    "day5_morning_dawn_4": {
        character: null,
        next: "day5_morning_dawn_5"
    },
    "day5_morning_dawn_5": {
        character: null,
        next: "day5_morning_dawn_6"
    },
    "day5_morning_dawn_6": {
        character: null,
        next: "day5_morning_dawn_7"
    },
    "day5_morning_dawn_7": {
        character: null,
        next: "day5_morning_dawn_8"
    },
    "day5_morning_dawn_8": {
        background: "corridor_dark",
        character: null,
        sfx: "sfx_door_open.mp3",
        unskippable: true,
        next: "day5_morning_dawn_9"
    },
    "day5_morning_dawn_9": {
        character: null,
        next: "day5_morning_dawn_10"
    },
    "day5_morning_dawn_10": {
        background: "dawn_road",
        character: null,
        sfx: "sfx_footsteps.mp3",
        unskippable: true,
        next: "day5_morning_dawn_11"
    },
    "day5_morning_dawn_11": {
        character: null,
        next: "day5_morning_dawn_12"
    },

    // ══════════════════════════════════════
    // 새벽의 학교 — 정문, 구관, 지하실 하강
    // ══════════════════════════════════════
    "day5_morning_dawn_12": {
        background: "dawn_road",
        bgm: "silence_tension.mp3",
        character: null,
        glitch: { noise: true, noiseDuration: 300 },
        unskippable: true,
        stopSfx: true,
        next: "day5_morning_school_1"
    },
    "day5_morning_school_1": {
        background: "school_gate_dark",
        character: null,
        unskippable: true,
        next: "day5_morning_school_2"
    },
    "day5_morning_school_2": {
        character: null,
        next: "day5_morning_school_3"
    },
    "day5_morning_school_3": {
        character: null,
        next: "day5_morning_school_4"
    },
    "day5_morning_school_4": {
        character: null,
        next: "day5_morning_school_5"
    },
    "day5_morning_school_5": {
        character: null,
        next: "day5_morning_school_6"
    },
    "day5_morning_school_6": {
        character: null,
        next: "day5_morning_school_7"
    },
    "day5_morning_school_7": {
        character: null,
        next: "day5_morning_school_8"
    },
    "day5_morning_school_8": {
        character: null,
        background: "old_building",
        sfx: "sfx_thunder.mp3",
        unskippable: true,
        next: "day5_morning_school_9"
    },
    "day5_morning_school_9": {
        character: null,
        next: "day5_morning_school_10"
    },
    "day5_morning_school_10": {
        character: null,
        next: "day5_morning_school_11"
    },

    // ══════════════════════════════════════
    // 유나 구출 — 지하실
    // ══════════════════════════════════════
    "day5_morning_school_11": {
        background: "basement",
        character: null,
        unskippable: true,
        stopSfx: "sfx_thunder.mp3",
        next: "day5_morning_rescue_1"
    },
    "day5_morning_rescue_1": {
        character: null,
        unskippable: true,
        next: "day5_morning_rescue_2"
    },
    "day5_morning_rescue_2": {
        character: "yuna_weak",
        unskippable: true,
        branches: [
            { condition: "met_yuna", next: "day5_morning_rescue_3" }
        ],
        next: "day5_morning_rescue_2_unknown"
    },
    // ── met_yuna 미충족: 모르는 여학생 — 한 씬 후 합류 ──
    "day5_morning_rescue_2_unknown": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_3_unknown"
    },
    "day5_morning_rescue_3_unknown": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_4_unknown"
    },
    "day5_morning_rescue_4_unknown": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_5_unknown"
    },
    "day5_morning_rescue_5_unknown": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_5"
    },
    "day5_morning_rescue_3": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_4"
    },
    "day5_morning_rescue_4": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_5"
    },
    "day5_morning_rescue_5": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_5a"
    },
    "day5_morning_rescue_5a": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_6"
    },
    "day5_morning_rescue_6": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_7"
    },
    "day5_morning_rescue_7": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_8"
    },
    "day5_morning_rescue_8": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_9"
    },
    "day5_morning_rescue_9": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_10"
    },
    "day5_morning_rescue_10": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_11"
    },
    "day5_morning_rescue_11": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_12"
    },
    "day5_morning_rescue_12": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_13"
    },
    "day5_morning_rescue_13": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_14"
    },
    "day5_morning_rescue_14": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_15"
    },
    "day5_morning_rescue_15": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_16"
    },
    "day5_morning_rescue_16": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_17"
    },
    "day5_morning_rescue_17": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_18"
    },
    "day5_morning_rescue_18": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_19"
    },
    "day5_morning_rescue_19": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_20"
    },
    "day5_morning_rescue_20": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_21"
    },
    "day5_morning_rescue_21": {
        character: "yuna_weak",
        glitch: { ghostText: "day5_morning_ghost_record", ghostX: 50, ghostY: 50 },
        unskippable: true,
        setFlags: ["dejavu_pin_9"],
        next: "day5_morning_rescue_22"
    },
    "day5_morning_rescue_22": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_rescue_choice"
    },

    // ── 선택지: 탈출 / 증거 확보 ──
    "day5_morning_rescue_choice": {
        character: null,
        unskippable: true,
        choices: [
            { next: "day5_morning_escape_end", setFlags: ["route_escape"], stats: { yuna: { affinity: -5 }, eunsu: { affinity: -5 } } },
            { next: "day5_morning_true_1", setFlags: ["has_evidence"], stats: { yuna: { affinity: 10 }, seolhwa: { affinity: 8 }, eunsu: { affinity: 8 } } }
        ]
    },

    // ── ESCAPE 루트 종료 → 추격 스킵, 방과후로 직행 ──
    "day5_morning_escape_end": {
        character: null,
        setFlags: ["route_escape", "escape_with_yuna"],
        changeSlot: "afterschool",
        next: "day5_after_start"
    },

    // ══════════════════════════════════════
    // 아침: 봉쇄 (TRUE 루트)
    // ══════════════════════════════════════
    "day5_morning_true_1": {
        background: "lab_documents",
        character: null,
        unskippable: true,
        vibrate: "underground",
        next: "day5_morning_true_2"
    },
    "day5_morning_true_2": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_3"
    },
    "day5_morning_true_3": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_4"
    },
    "day5_morning_true_4": {
        characters: { left: "yuna_weak" },
        unskippable: true,
        next: "day5_morning_true_5"
    },
    "day5_morning_true_5": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_6"
    },
    "day5_morning_true_6": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_7"
    },
    "day5_morning_true_7": {
        characters: { left: "yuna_weak" },
        unskippable: true,
        next: "day5_morning_true_8"
    },
    "day5_morning_true_8": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_9"
    },
    "day5_morning_true_9": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_10"
    },
    "day5_morning_true_10": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_11"
    },
    "day5_morning_true_11": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_12"
    },
    "day5_morning_true_12": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_13"
    },
    "day5_morning_true_13": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_14"
    },
    "day5_morning_true_14": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_15"
    },
    "day5_morning_true_15": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_16"
    },
    "day5_morning_true_16": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_17"
    },
    "day5_morning_true_17": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_18"
    },
    "day5_morning_true_18": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_19"
    },
    "day5_morning_true_19": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_20"
    },
    "day5_morning_true_20": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_21"
    },
    "day5_morning_true_21": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_22"
    },
    "day5_morning_true_22": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_23"
    },
    "day5_morning_true_23": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_24"
    },
    "day5_morning_true_24": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_25"
    },
    "day5_morning_true_25": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_26"
    },
    "day5_morning_true_26": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_27"
    },
    "day5_morning_true_27": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_28"
    },
    "day5_morning_true_28": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_29"
    },
    "day5_morning_true_29": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_30"
    },
    "day5_morning_true_30": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_31"
    },
    "day5_morning_true_31": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_32"
    },
    "day5_morning_true_32": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_33"
    },
    "day5_morning_true_33": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_34"
    },
    "day5_morning_true_34": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_35"
    },
    "day5_morning_true_35": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_36"
    },
    "day5_morning_true_36": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_37"
    },
    "day5_morning_true_37": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_38"
    },
    "day5_morning_true_38": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_39"
    },
    "day5_morning_true_39": {
        character: null,
        unskippable: true,
        next: "day5_morning_true_timer_choice"
    },

    "day5_morning_true_timer_choice": {
        character: null,
        unskippable: true,
        choices: [
            { next: "day5_morning_true_run_1", stats: { yuna: { affinity: 4 } } },
            { next: "day5_morning_true_hide_1", stats: { eunsu: { affinity: 2 } } }
        ]
    },
    "day5_morning_true_run_1": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_exit_1"
    },
    "day5_morning_true_hide_1": {
        background: "basement_records_room",
        dark: true,
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_true_hide_2"
    },
    "day5_morning_true_hide_2": {
        dark: true,
        character: null,
        unskippable: true,
        next: "day5_morning_true_exit_1"
    },
    "day5_morning_true_exit_1": {
        background: "corridor_old",
        character: null,
        unskippable: true,
        next: "day5_morning_true_exit_2"
    },
    "day5_morning_true_exit_2": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_true_ft"
    },
    "day5_morning_true_ft": {
        character: "eunsu_gentle",
        type: "free_talk",
        freeTalkMode: "ai_chat",
        freeTalkChar: "eunsu",
        freeTalkMax: 2,
        freeTalkContext: {
            ko: "\uad6c\uad00 \uc9c0\ud558\uc2e4 \ucd9c\uad6c \uc55e. {name}\uc640 \ucd5c\uc720\ub098\ub294 \uc11c\ub958\uc640 \uce74\uba54\ub77c\ub97c \ub4e4\uace0 \uc788\ub2e4. \uc740\uc218\ub294 \uc2e4\ud5d8\uacfc \uc720\ub098 \uaca9\ub9ac\uc5d0 \ub300\ud55c \uc9c8\ubb38\uc744 \ubc1b\uc544\ub3c4 \ub2a5\uc219\ud558\uac8c \ud68c\ud53c\ud558\uba70 \uc2dc\uac04\uc744 \ub04c\ub2e4.",
            en: "In front of the old building basement exit. {name} and Choi Yuna are holding documents and a camera. Eunsu keeps buying time, smoothly deflecting questions about the experiment and Yuna's confinement.",
            ja: "\u65e7\u6821\u820e\u306e\u5730\u4e0b\u5ba4\u51fa\u53e3\u306e\u524d\u3002{name}\u3068\u30c1\u30a7\u30fb\u30e6\u30ca\u306f\u66f8\u985e\u3068\u30ab\u30e1\u30e9\u3092\u6301\u3063\u3066\u3044\u308b\u3002\u30a6\u30f3\u30b9\u306f\u5b9f\u9a13\u3068\u30e6\u30ca\u306e\u9694\u96e2\u306b\u95a2\u3059\u308b\u8cea\u554f\u3092\u5de7\u307f\u306b\u304b\u308f\u3057\u3001\u6642\u9593\u3092\u7a3c\u3050\u3002",
            es: "Frente a la salida del sotano del edificio antiguo. {name} y Choi Yuna sostienen documentos y una camara. Eunsu gana tiempo, esquivando con habilidad las preguntas sobre el experimento y el encierro de Yuna.",
            fr: "Devant la sortie du sous-sol de l'ancien batiment. {name} et Choi Yuna tiennent des documents et un appareil photo. Eunsu gagne du temps, evitant habilement les questions sur l'experience et l'isolement de Yuna.",
            de: "Vor dem Ausgang des Kellers im alten Gebaude. {name} und Choi Yuna halten Dokumente und eine Kamera. Eunsu schindet Zeit und weicht Fragen zum Experiment und zu Yunas Isolation geschickt aus.",
            pt: "Em frente a saida do porao do predio antigo. {name} e Choi Yuna seguram documentos e uma camera. Eunsu ganha tempo, desviando habilmente das perguntas sobre o experimento e o confinamento de Yuna."
        },
        unskippable: true,
        freeTalkNext: "day5_morning_true_post_ft_1"
    },
    "day5_morning_true_post_ft_1": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_true_post_ft_2"
    },
    "day5_morning_true_post_ft_2": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_true_post_ft_3"
    },
    "day5_morning_true_post_ft_3": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_blockade_1"
    },

    // ── 구관 1층 복도 — 봉쇄 ──
    "day5_morning_blockade_1": {
        background: "corridor_old",
        character: null,
        unskippable: true,
        next: "day5_morning_blockade_2"
    },
    "day5_morning_blockade_2": {
        character: null,
        next: "day5_morning_blockade_3"
    },
    "day5_morning_blockade_3": {
        character: null,
        glitch: { screenShake: true, shakeDuration: 200 },
        unskippable: true,
        next: "day5_morning_blockade_4"
    },
    "day5_morning_blockade_4": {
        character: null,
        next: "day5_morning_blockade_5"
    },

    // ── 교내 방송 — 은수 ──
    "day5_morning_blockade_5": {
        character: null,
        glitch: { noise: true, noiseDuration: 500 },
        bgm: "music_box_broken.mp3",
        unskippable: true,
        next: "day5_morning_broadcast_1"
    },
    "day5_morning_broadcast_1": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_broadcast_2"
    },
    "day5_morning_broadcast_2": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_broadcast_3"
    },
    "day5_morning_broadcast_3": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_broadcast_4"
    },
    "day5_morning_broadcast_4": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_broadcast_5"
    },
    "day5_morning_broadcast_5": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_broadcast_6"
    },
    "day5_morning_broadcast_6": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_broadcast_7"
    },
    "day5_morning_broadcast_7": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_broadcast_8"
    },
    "day5_morning_broadcast_8": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_9"
    },
    "day5_morning_broadcast_9": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_10"
    },
    "day5_morning_broadcast_10": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_11"
    },
    "day5_morning_broadcast_11": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_12"
    },
    "day5_morning_broadcast_12": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_13"
    },
    "day5_morning_broadcast_13": {
        character: "yuna_weak",
        glitch: { screenShake: true, shakeDuration: 300 },
        unskippable: true,
        next: "day5_morning_broadcast_14"
    },
    "day5_morning_broadcast_14": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_15"
    },
    "day5_morning_broadcast_15": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_16"
    },
    "day5_morning_broadcast_16": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_17"
    },
    "day5_morning_broadcast_17": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_broadcast_18"
    },

    // ══════════════════════════════════════
    // 졸업식 — 교실
    // ══════════════════════════════════════
    "day5_morning_broadcast_18": {
        background: "classroom",
        bgm: "music_box_broken.mp3",
        character: null,
        unskippable: true,
        next: "day5_morning_grad_1"
    },
    "day5_morning_grad_1": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_grad_2"
    },
    "day5_morning_grad_2": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_grad_3"
    },
    "day5_morning_grad_3": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_grad_4"
    },
    "day5_morning_grad_4": {
        character: "yuna_weak",
        unskippable: true,
        next: "day5_morning_grad_5"
    },
    "day5_morning_grad_5": {
        character: null,
        unskippable: true,
        next: "day5_morning_grad_6"
    },
    "day5_morning_grad_6": {
        character: null,
        unskippable: true,
        next: "day5_morning_grad_7"
    },
    "day5_morning_grad_7": {
        character: null,
        unskippable: true,
        next: "day5_morning_grad_8"
    },
    "day5_morning_grad_8": {
        character: null,
        unskippable: true,
        next: "day5_morning_grad_9"
    },
    "day5_morning_grad_9": {
        character: null,
        unskippable: true,
        next: "day5_morning_grad_10"
    },
    "day5_morning_grad_10": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_11"
    },
    "day5_morning_grad_11": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_12"
    },
    "day5_morning_grad_12": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_13"
    },
    "day5_morning_grad_13": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_14"
    },

    // ── 은수 독백: 과거 시행들 (감정적 핵심) ──
    "day5_morning_grad_14": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_15"
    },
    "day5_morning_grad_15": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_16"
    },
    "day5_morning_grad_16": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_17"
    },
    "day5_morning_grad_17": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_18"
    },
    "day5_morning_grad_18": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_19"
    },
    "day5_morning_grad_19": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_20"
    },
    "day5_morning_grad_20": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_21"
    },
    "day5_morning_grad_21": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_21a"
    },
    "day5_morning_grad_21a": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_22"
    },
    "day5_morning_grad_22": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_morning_grad_23"
    },
    "day5_morning_grad_23": {
        character: "eunsu_dark",
        glitch: { screenShake: true, shakeDuration: 300 },
        unskippable: true,
        next: "day5_morning_grad_24"
    },
    "day5_morning_grad_24": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_25"
    },
    "day5_morning_grad_25": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_26"
    },
    "day5_morning_grad_26": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_27"
    },
    "day5_morning_grad_27": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_28"
    },
    "day5_morning_grad_28": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_29"
    },
    "day5_morning_grad_29": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_29a"
    },
    "day5_morning_grad_29a": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_30"
    },
    "day5_morning_grad_30": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_timer"
    },

    // ── 타이머 선택지: 10초 ──
    "day5_morning_grad_timer": {
        character: null,
        timedChoice: 10000,
        unskippable: true,
        choices: [
            { next: "day5_morning_grad_reply_1", stats: { eunsu: { affinity: -8 }, seolhwa: { affinity: 5 } } },
            { next: "day5_morning_grad_reply_2", stats: { eunsu: { affinity: 8 }, seolhwa: { affinity: 3 } } },
            { next: "day5_morning_grad_reply_3", stats: { eunsu: { affinity: 5 } } }
        ],
        timeoutNext: "day5_morning_grad_reply_3"
    },

    // ── 선택 1: "그건 사랑이 아니에요." ──
    "day5_morning_grad_reply_1": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_reply_1b"
    },
    "day5_morning_grad_reply_1b": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_1"
    },

    // ── 선택 2: "왜 이런 짓을 한 거예요?" ──
    "day5_morning_grad_reply_2": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_reply_2b"
    },
    "day5_morning_grad_reply_2b": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_grad_reply_2c"
    },
    "day5_morning_grad_reply_2c": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_1"
    },

    // ── 선택 3: (침묵한다) ──
    "day5_morning_grad_reply_3": {
        character: null,
        unskippable: true,
        next: "day5_morning_grad_reply_3b"
    },
    "day5_morning_grad_reply_3b": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_1"
    },

    // ══════════════════════════════════════
    // 은수의 제안
    // ══════════════════════════════════════
    "day5_morning_proposal_1": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_2"
    },
    "day5_morning_proposal_2": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_3"
    },
    "day5_morning_proposal_3": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_4"
    },
    "day5_morning_proposal_4": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_5"
    },
    "day5_morning_proposal_5": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_6"
    },
    "day5_morning_proposal_6": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_7"
    },
    "day5_morning_proposal_7": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_8"
    },
    "day5_morning_proposal_8": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_9"
    },
    "day5_morning_proposal_9": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_10"
    },
    "day5_morning_proposal_10": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_11"
    },
    "day5_morning_proposal_11": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_12"
    },
    "day5_morning_proposal_12": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_13"
    },
    "day5_morning_proposal_13": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_14"
    },
    "day5_morning_proposal_14": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_15"
    },
    "day5_morning_proposal_15": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_16"
    },
    "day5_morning_proposal_16": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_17"
    },
    "day5_morning_proposal_17": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_18"
    },
    "day5_morning_proposal_18": {
        character: "eunsu_dark",
        unskippable: true,
        next: "day5_morning_proposal_timer"
    },

    // ── 최종 타이머 선택지: 15초 ──
    "day5_morning_proposal_timer": {
        character: null,
        timedChoice: 15000,
        unskippable: true,
        vibrate: "heartbeat",
        choices: [
            { next: "day5_morning_end_cage", setFlags: ["route_cage", "stayed_with_eunsu"], stats: { eunsu: { affinity: 10 } } },
            { next: "day5_morning_end_forget", setFlags: ["route_forget"], stats: { eunsu: { affinity: 8 } } },
            { next: "day5_morning_end_run", setFlags: ["route_chase"], stats: { eunsu: { affinity: -8 }, seolhwa: { affinity: 8 } } }
        ],
        timeoutNext: "day5_morning_end_run"
    },

    // ── CAGE 루트 종료 ──
    "day5_morning_end_cage": {
        character: null,
        setFlags: ["route_cage", "stayed_with_eunsu"],
        changeSlot: "afterschool",
        next: "day5_after_start"
    },

    // ── FORGET 루트 종료 ──
    "day5_morning_end_forget": {
        character: null,
        changeSlot: "afterschool",
        next: "day5_after_start"
    },

    // ── 추격전 진입 ──
    "day5_morning_end_run": {
        character: null,
        changeSlot: "lunch",
        next: "day5_lunch_start"
    }
});
