/**
 * Day 4-3: Afterschool - 진실
 * 3 choices: 지하실 / 세아 / 증거 정리
 * 지하실: 실험실 발견, 유나 구출, 타이머 6초
 * 세아: 강제 선택지(forceChoice) 글리치, 세아의 고백(암시적)
 * 증거: 은수 서류 씬(가스라이팅), 타이머 5초
 * 위화감 85%. BREAKING glitch level.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    // ── 방과후 시작 ──
    "day4_after_start": {
        background: "classroom",
        bgm: "tension.mp3",
        character: null,
        next: "day4_after_start_2"
    },
    "day4_after_start_2": {
        character: "sea_smile",
        next: "day4_after_start_3"
    },
    "day4_after_start_3": {
        character: null,
        next: "day4_after_start_4"
    },
    "day4_after_start_4": {
        next: "day4_after_choice"
    },

    "day4_after_choice": {
        choices: [
            { next: "day4_after_basement" },
            { next: "day4_after_sea_route" },
            { next: "day4_after_evidence" }
        ]
    },

    // ═══════════════════════════════════════
    // 지하실 루트 — 실험실 발견
    // ═══════════════════════════════════════
    "day4_after_basement": {
        background: "corridor_dark",
        bgm: "horror_ambient.mp3",
        character: null,
        next: "day4_after_basement_2"
    },
    "day4_after_basement_2": {
        next: "day4_after_basement_3"
    },
    "day4_after_basement_3": {
        next: "day4_after_basement_4"
    },
    "day4_after_basement_4": {
        next: "day4_after_basement_5"
    },
    "day4_after_basement_5": {
        next: "day4_after_basement_6"
    },
    "day4_after_basement_6": {
        next: "day4_after_basement_7"
    },
    "day4_after_basement_7": {
        next: "day4_after_basement_8"
    },
    "day4_after_basement_8": {
        background: "old_building",
        glitch: { noise: true, screenShake: true },
        next: "day4_after_basement_9"
    },
    "day4_after_basement_9": {
        next: "day4_after_basement_10",
        setFlags: ["found_basement_lab"]
    },
    "day4_after_basement_10": {
        next: "day4_after_basement_11"
    },
    "day4_after_basement_11": {
        next: "day4_after_basement_12"
    },
    "day4_after_basement_12": {
        next: "day4_after_basement_13"
    },
    "day4_after_basement_13": {
        next: "day4_after_basement_14"
    },
    "day4_after_basement_14": {
        next: "day4_after_basement_15"
    },
    "day4_after_basement_15": {
        next: "day4_after_basement_16",
        setFlags: ["evidence_lab_documents"]
    },
    "day4_after_basement_16": {
        next: "day4_after_basement_17"
    },
    "day4_after_basement_17": {
        next: "day4_after_basement_18"
    },
    "day4_after_basement_18": {
        next: "day4_after_basement_19"
    },
    "day4_after_basement_19": {
        // 유나 발견
        next: "day4_after_basement_20"
    },
    "day4_after_basement_20": {
        character: "yuna_scared",
        next: "day4_after_basement_21"
    },
    "day4_after_basement_21": {
        next: "day4_after_basement_22"
    },
    "day4_after_basement_22": {
        character: null,
        next: "day4_after_basement_23"
    },
    "day4_after_basement_23": {
        next: "day4_after_basement_24"
    },
    "day4_after_basement_24": {
        character: "yuna_scared",
        next: "day4_after_basement_25"
    },
    "day4_after_basement_25": {
        character: null,
        next: "day4_after_basement_26"
    },
    "day4_after_basement_26": {
        character: "yuna_scared",
        next: "day4_after_basement_timer"
    },
    "day4_after_basement_timer": {
        // 타이머 선택지: 6초
        timedChoice: 6000,
        choices: [
            {
                next: "day4_after_basement_rescue",
                setFlags: ["rescued_yuna"]
            },
            {
                next: "day4_after_basement_hide"
            }
        ],
        timeoutNext: "day4_after_basement_hide"
    },

    // 선택1: 유나를 데리고 나간다
    "day4_after_basement_rescue": {
        character: null,
        next: "day4_after_basement_rescue_2",
        stats: { yuna: { trust: 15 } }
    },
    "day4_after_basement_rescue_2": {
        next: "day4_after_basement_rescue_3"
    },
    "day4_after_basement_rescue_3": {
        character: "yuna_scared",
        next: "day4_after_basement_rescue_4"
    },
    "day4_after_basement_rescue_4": {
        character: null,
        next: "day4_after_basement_rescue_5"
    },
    "day4_after_basement_rescue_5": {
        glitch: { screenShake: true },
        next: "day4_after_end"
    },

    // 선택2: 일단 숨는다
    "day4_after_basement_hide": {
        character: null,
        next: "day4_after_basement_hide_2"
    },
    "day4_after_basement_hide_2": {
        next: "day4_after_basement_hide_3"
    },
    "day4_after_basement_hide_3": {
        character: "riin_cold",
        next: "day4_after_basement_hide_4"
    },
    "day4_after_basement_hide_4": {
        character: null,
        next: "day4_after_basement_hide_5"
    },
    "day4_after_basement_hide_5": {
        next: "day4_after_end"
    },

    // ═══════════════════════════════════════
    // 세아 루트 — 강제 선택지 + 고백(암시적)
    // ═══════════════════════════════════════
    "day4_after_sea_route": {
        background: "classroom",
        bgm: "sea_obsession.mp3",
        character: null,
        next: "day4_after_sea_2"
    },
    "day4_after_sea_2": {
        next: "day4_after_sea_3"
    },
    "day4_after_sea_3": {
        character: "sea_smile",
        next: "day4_after_sea_4"
    },
    "day4_after_sea_4": {
        character: null,
        next: "day4_after_sea_5"
    },
    "day4_after_sea_5": {
        character: "sea_serious",
        next: "day4_after_sea_6"
    },
    "day4_after_sea_6": {
        next: "day4_after_sea_7"
    },
    "day4_after_sea_7": {
        character: null,
        next: "day4_after_sea_8"
    },
    "day4_after_sea_8": {
        character: "sea_serious",
        next: "day4_after_sea_force"
    },
    "day4_after_sea_force": {
        // ★ FORCE CHOICE: 두 번째 선택지가 첫 번째와 같은 텍스트로 바뀜
        glitch: { forceChoice: 0 },
        choices: [
            {
                next: "day4_after_sea_accept",
                stats: { sea: { affinity: 10, danger: 15 } }
            },
            {
                next: "day4_after_sea_accept",
                stats: { sea: { affinity: 10, danger: 15 } }
            }
        ]
    },
    "day4_after_sea_accept": {
        character: null,
        next: "day4_after_sea_accept_2"
    },
    "day4_after_sea_accept_2": {
        character: "sea_yandere",
        next: "day4_after_sea_accept_3"
    },
    "day4_after_sea_accept_3": {
        character: null,
        next: "day4_after_sea_accept_4"
    },
    "day4_after_sea_accept_4": {
        character: "sea_yandere",
        glitch: { noise: true },
        next: "day4_after_sea_crack"
    },

    // 세아의 균열 — 과거 고백 (암시적)
    "day4_after_sea_crack": {
        character: "sea_sad",
        next: "day4_after_sea_crack_2"
    },
    "day4_after_sea_crack_2": {
        next: "day4_after_sea_crack_3"
    },
    "day4_after_sea_crack_3": {
        next: "day4_after_sea_crack_4"
    },
    "day4_after_sea_crack_4": {
        next: "day4_after_sea_crack_5"
    },
    "day4_after_sea_crack_5": {
        next: "day4_after_sea_crack_6"
    },
    "day4_after_sea_crack_6": {
        next: "day4_after_sea_crack_7"
    },
    "day4_after_sea_crack_7": {
        next: "day4_after_sea_crack_8"
    },
    "day4_after_sea_crack_8": {
        next: "day4_after_sea_crack_9"
    },
    "day4_after_sea_crack_9": {
        character: null,
        next: "day4_after_sea_crack_10"
    },
    "day4_after_sea_crack_10": {
        character: "sea_sad",
        next: "day4_after_sea_crack_11"
    },
    "day4_after_sea_crack_11": {
        character: "sea_cry",
        next: "day4_after_sea_crack_12"
    },
    "day4_after_sea_crack_12": {
        next: "day4_after_sea_crack_13"
    },
    "day4_after_sea_crack_13": {
        character: null,
        next: "day4_after_sea_crack_14"
    },
    "day4_after_sea_crack_14": {
        next: "day4_after_sea_crack_15"
    },
    "day4_after_sea_crack_15": {
        character: "sea_smile",
        next: "day4_after_sea_crack_16"
    },
    "day4_after_sea_crack_16": {
        character: null,
        next: "day4_after_sea_crack_17"
    },
    "day4_after_sea_crack_17": {
        next: "day4_after_sea_crack_18"
    },
    "day4_after_sea_crack_18": {
        next: "day4_after_sea_crack_19"
    },
    "day4_after_sea_crack_19": {
        next: "day4_after_sea_crack_20"
    },
    "day4_after_sea_crack_20": {
        glitch: { noise: true },
        next: "day4_after_end",
        setFlags: ["sea_confession_d4"]
    },

    // ═══════════════════════════════════════
    // 증거 수집 루트 — 은수와의 조우 (가스라이팅)
    // ═══════════════════════════════════════
    "day4_after_evidence": {
        background: "classroom",
        bgm: "tension.mp3",
        character: null,
        next: "day4_after_evidence_2"
    },
    "day4_after_evidence_2": {
        next: "day4_after_evidence_3"
    },
    "day4_after_evidence_3": {
        next: "day4_after_evidence_4"
    },
    "day4_after_evidence_4": {
        next: "day4_after_evidence_5"
    },
    "day4_after_evidence_5": {
        next: "day4_after_evidence_6"
    },
    "day4_after_evidence_6": {
        next: "day4_after_evidence_7",
        setFlags: ["evidence_compiled"]
    },
    "day4_after_evidence_7": {
        // 은수가 나타남
        character: "eunsu_serious",
        glitch: { screenShake: true },
        next: "day4_after_evidence_8"
    },
    "day4_after_evidence_8": {
        character: null,
        next: "day4_after_evidence_9"
    },
    "day4_after_evidence_9": {
        next: "day4_after_evidence_timer"
    },
    "day4_after_evidence_timer": {
        // 타이머 선택지: 5초
        timedChoice: 5000,
        choices: [
            {
                next: "day4_after_evidence_run",
                setFlags: ["ran_from_eunsu"]
            },
            {
                next: "day4_after_evidence_stay"
            }
        ],
        timeoutNext: "day4_after_evidence_stay"
    },

    // 선택1: 도망친다
    "day4_after_evidence_run": {
        character: null,
        next: "day4_after_evidence_run_2"
    },
    "day4_after_evidence_run_2": {
        character: "eunsu_serious",
        next: "day4_after_evidence_run_3"
    },
    "day4_after_evidence_run_3": {
        character: null,
        next: "day4_after_evidence_run_4"
    },
    "day4_after_evidence_run_4": {
        character: "eunsu_serious",
        next: "day4_after_evidence_run_5"
    },
    "day4_after_evidence_run_5": {
        next: "day4_after_evidence_run_6"
    },
    "day4_after_evidence_run_6": {
        character: null,
        next: "day4_after_evidence_run_7"
    },
    "day4_after_evidence_run_7": {
        next: "day4_after_end"
    },

    // 선택2: 가만히 있는다 (은수 가스라이팅)
    "day4_after_evidence_stay": {
        character: null,
        next: "day4_after_evidence_stay_2"
    },
    "day4_after_evidence_stay_2": {
        character: "eunsu_serious",
        next: "day4_after_evidence_stay_3"
    },
    "day4_after_evidence_stay_3": {
        character: null,
        next: "day4_after_evidence_stay_4"
    },
    "day4_after_evidence_stay_4": {
        character: "eunsu_serious",
        next: "day4_after_evidence_stay_5"
    },
    "day4_after_evidence_stay_5": {
        character: null,
        next: "day4_after_evidence_stay_6"
    },
    "day4_after_evidence_stay_6": {
        character: "eunsu_gentle",
        next: "day4_after_evidence_stay_7"
    },
    "day4_after_evidence_stay_7": {
        character: null,
        next: "day4_after_evidence_stay_8"
    },
    "day4_after_evidence_stay_8": {
        character: "eunsu_gentle",
        glitch: { heavyGlitch: true },
        next: "day4_after_evidence_stay_9",
        stats: { eunsu: { danger: 15 } }
    },
    "day4_after_evidence_stay_9": {
        character: null,
        next: "day4_after_evidence_stay_10"
    },
    "day4_after_evidence_stay_10": {
        next: "day4_after_end",
        setFlags: ["caught_by_eunsu"]
    },

    // ── 방과후 종료 ──
    "day4_after_end": {
        background: "school_gate",
        character: null,
        changeSlot: "night",
        next: "day4_night_start"
    }
});
