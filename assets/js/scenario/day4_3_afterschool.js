/**
 * Day 4-3: Afterschool - 지하실 발견, 세아의 진실, 탈출 준비
 * 위화감 85%. 강제 선택지(forceChoice) 글리치. 서바이벌.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    "day4_after_start": {
        background: "classroom",
        bgm: "thriller_ambient.mp3",
        character: null,
        next: "day4_after_start_2"
    },
    "day4_after_start_2": {
        next: "day4_after_choice"
    },
    "day4_after_choice": {
        choices: [
            {
                next: "day4_after_basement",
                condition: "found_seolhwa_mark"
            },
            {
                next: "day4_after_sea_route"
            },
            {
                next: "day4_after_evidence"
            }
        ]
    },

    // ── 지하실 루트 ──
    "day4_after_basement": {
        background: "corridor_dark",
        character: null,
        next: "day4_after_basement_2"
    },
    "day4_after_basement_2": {
        next: "day4_after_basement_3"
    },
    "day4_after_basement_3": {
        background: "basement",
        bgm: "horror_ambient.mp3",
        glitch: { noise: true, noiseDuration: 500 },
        next: "day4_after_basement_4"
    },
    "day4_after_basement_4": {
        next: "day4_after_basement_5"
    },
    "day4_after_basement_5": {
        next: "day4_after_basement_6",
        setFlags: ["found_basement_lab"]
    },
    "day4_after_basement_6": {
        next: "day4_after_basement_7",
        setFlags: ["evidence_lab_documents"]
    },
    "day4_after_basement_7": {
        // 유나 발견
        next: "day4_after_basement_8"
    },
    "day4_after_basement_8": {
        character: "yuna_weak",
        next: "day4_after_basement_9"
    },
    "day4_after_basement_9": {
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
    "day4_after_basement_rescue": {
        next: "day4_after_basement_rescue_2",
        stats: { yuna: { trust: 15 } }
    },
    "day4_after_basement_rescue_2": {
        glitch: { screenShake: true, shakeDuration: 300 },
        next: "day4_after_basement_escape"
    },
    "day4_after_basement_hide": {
        character: null,
        next: "day4_after_basement_hide_2"
    },
    "day4_after_basement_hide_2": {
        next: "day4_after_basement_escape"
    },
    "day4_after_basement_escape": {
        character: null,
        glitch: { heavyGlitch: true, glitchDuration: 800 },
        next: "day4_after_end"
    },

    // ── 세아 루트 - 세아의 진실 ──
    "day4_after_sea_route": {
        background: "corridor",
        character: "sea_smile",
        next: "day4_after_sea_2"
    },
    "day4_after_sea_2": {
        next: "day4_after_sea_3"
    },
    "day4_after_sea_3": {
        background: "classroom_empty",
        character: "sea_serious",
        next: "day4_after_sea_4"
    },
    "day4_after_sea_4": {
        character: "sea_dark",
        next: "day4_after_sea_5"
    },
    "day4_after_sea_5": {
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
        character: "sea_yandere",
        next: "day4_after_sea_crack"
    },
    "day4_after_sea_crack": {
        // 세아가 잠깐 본심을 드러냄 — 피해자 복선
        character: "sea_sad",
        next: "day4_after_sea_crack_2"
    },
    "day4_after_sea_crack_2": {
        character: "sea_smile",
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_after_sea_accept_2"
    },
    "day4_after_sea_accept_2": {
        character: "sea_smile",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day4_after_end",
        setFlags: ["sea_confession_d4"]
    },

    // ── 증거 수집 루트 ──
    "day4_after_evidence": {
        background: "classroom",
        character: null,
        next: "day4_after_evidence_2"
    },
    "day4_after_evidence_2": {
        next: "day4_after_evidence_3"
    },
    "day4_after_evidence_3": {
        next: "day4_after_evidence_4",
        condition: "found_yuna_camera"
    },
    "day4_after_evidence_3_alt": {
        next: "day4_after_evidence_4"
    },
    "day4_after_evidence_4": {
        next: "day4_after_evidence_5",
        setFlags: ["evidence_compiled"]
    },
    "day4_after_evidence_5": {
        // 은수가 나타남
        character: "eunsu_cold",
        glitch: { screenShake: true, shakeDuration: 300 },
        next: "day4_after_evidence_6"
    },
    "day4_after_evidence_6": {
        timedChoice: 5000,
        choices: [
            {
                next: "day4_after_evidence_run",
                setFlags: ["ran_from_eunsu"]
            },
            {
                next: "day4_after_evidence_caught"
            }
        ],
        timeoutNext: "day4_after_evidence_caught"
    },
    "day4_after_evidence_run": {
        character: null,
        next: "day4_after_end"
    },
    "day4_after_evidence_caught": {
        character: "eunsu_obsessed",
        next: "day4_after_evidence_caught_2",
        stats: { eunsu: { danger: 15 } }
    },
    "day4_after_evidence_caught_2": {
        character: "eunsu_gentle",
        glitch: { heavyGlitch: true, glitchDuration: 500 },
        next: "day4_after_end",
        setFlags: ["caught_by_eunsu"]
    },

    "day4_after_end": {
        background: "school_gate_evening",
        bgm: "tension.mp3",
        character: null,
        changeSlot: "night",
        next: "day4_night_start"
    }
});
