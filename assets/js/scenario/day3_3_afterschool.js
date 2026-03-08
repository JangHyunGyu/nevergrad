/**
 * Day 3-3: Afterschool - 리인의 약, 세아의 감시, 은수의 야근
 * 위화감 40%. 선택지 플리커 글리치 등장.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    "day3_after_start": {
        background: "classroom",
        bgm: "daily_tense.mp3",
        character: null,
        next: "day3_after_choice"
    },
    "day3_after_choice": {
        choices: [
            {
                next: "day3_after_riin",
                condition: null
            },
            {
                next: "day3_after_sea",
                condition: null
            },
            {
                next: "day3_after_eunsu",
                condition: null
            },
            {
                next: "day3_after_alone",
                condition: null
            }
        ]
    },

    // ── 리인 루트: 보건실 약 ──
    "day3_after_riin": {
        background: "nurse_office",
        bgm: "riin_theme.mp3",
        character: "riin_smile",
        next: "day3_after_riin_2"
    },
    "day3_after_riin_2": {
        character: "riin_close",
        next: "day3_after_riin_3"
    },
    "day3_after_riin_3": {
        next: "day3_after_riin_name",
        stats: { riin: { affinity: 5 } }
    },
    "day3_after_riin_name": {
        character: "riin_smile",
        next: "day3_after_riin_name_2"
    },
    "day3_after_riin_name_2": {
        character: "riin_seductive",
        next: "day3_after_riin_choice",
        setFlags: ["knows_riin_name"]
    },
    "day3_after_riin_choice": {
        // ★ FLICKER GLITCH: 첫 번째 선택지가 0.1초간 "도망쳐" 로 깜빡임
        glitch: { flickerChoice: 0, flickerText: "day3_after_riin_flicker", flickerDuration: 100 },
        choices: [
            {
                next: "day3_after_riin_drink",
                stats: { riin: { affinity: 5, danger: 10 } }
            },
            {
                next: "day3_after_riin_refuse"
            }
        ]
    },
    "day3_after_riin_drink": {
        character: "riin_pleased",
        next: "day3_after_riin_drink_2"
    },
    "day3_after_riin_drink_2": {
        next: "day3_after_riin_drink_3",
        setFlags: ["drank_riin_drink"],
        stats: { riin: { danger: 5 } }
    },
    "day3_after_riin_drink_3": {
        character: null,
        glitch: { noise: true, noiseDuration: 200 },
        next: "day3_after_end"
    },
    "day3_after_riin_refuse": {
        character: "riin_cold",
        next: "day3_after_riin_refuse_2"
    },
    "day3_after_riin_refuse_2": {
        character: "riin_smile",
        next: "day3_after_end"
    },

    // ── 세아 루트: 세아의 감시 ──
    "day3_after_sea": {
        background: "corridor",
        bgm: "sea_theme.mp3",
        character: "sea_smile",
        next: "day3_after_sea_2"
    },
    "day3_after_sea_2": {
        next: "day3_after_sea_3"
    },
    "day3_after_sea_3": {
        character: "sea_serious",
        next: "day3_after_sea_4"
    },
    "day3_after_sea_4": {
        // 유나와 옥상에 간 사실을 세아가 알고 있음
        next: "day3_after_sea_choice",
        condition: "yuna_memory_card"
    },
    "day3_after_sea_4_alt": {
        next: "day3_after_sea_choice"
    },
    "day3_after_sea_choice": {
        choices: [
            {
                next: "day3_after_sea_truth",
                condition: "yuna_memory_card"
            },
            {
                next: "day3_after_sea_lie"
            }
        ]
    },
    "day3_after_sea_truth": {
        character: "sea_hurt",
        next: "day3_after_sea_truth_2",
        stats: { sea: { trust: 5, danger: 5 } }
    },
    "day3_after_sea_truth_2": {
        character: "sea_dark",
        glitch: { noise: true, noiseDuration: 150 },
        next: "day3_after_end"
    },
    "day3_after_sea_lie": {
        character: "sea_smile",
        next: "day3_after_sea_lie_2",
        stats: { sea: { affinity: 5 } }
    },
    "day3_after_sea_lie_2": {
        next: "day3_after_end"
    },

    // ── 은수 루트: 야근하는 은수 ──
    "day3_after_eunsu": {
        background: "faculty_office",
        bgm: "eunsu_theme.mp3",
        character: "eunsu_gentle",
        next: "day3_after_eunsu_2"
    },
    "day3_after_eunsu_2": {
        next: "day3_after_eunsu_3"
    },
    "day3_after_eunsu_3": {
        character: "eunsu_close",
        next: "day3_after_eunsu_name",
        stats: { eunsu: { affinity: 5 } }
    },
    "day3_after_eunsu_name": {
        character: "eunsu_shy",
        next: "day3_after_eunsu_name_2"
    },
    "day3_after_eunsu_name_2": {
        character: "eunsu_gentle",
        next: "day3_after_eunsu_4",
        setFlags: ["knows_eunsu_name"]
    },
    "day3_after_eunsu_4": {
        // 플레이어가 서류를 훔쳐봄
        next: "day3_after_eunsu_choice"
    },
    "day3_after_eunsu_choice": {
        choices: [
            {
                next: "day3_after_eunsu_peek",
                setFlags: ["saw_eunsu_documents"]
            },
            {
                next: "day3_after_eunsu_ignore"
            }
        ]
    },
    "day3_after_eunsu_peek": {
        character: null,
        next: "day3_after_eunsu_peek_2"
    },
    "day3_after_eunsu_peek_2": {
        next: "day3_after_eunsu_peek_3",
        setFlags: ["evidence_transfer_list"]
    },
    "day3_after_eunsu_peek_3": {
        character: "eunsu_cold",
        glitch: { noise: true, noiseDuration: 200 },
        next: "day3_after_end"
    },
    "day3_after_eunsu_ignore": {
        character: "eunsu_smile",
        next: "day3_after_eunsu_ignore_2",
        stats: { eunsu: { affinity: 5 } }
    },
    "day3_after_eunsu_ignore_2": {
        next: "day3_after_end"
    },

    // ── 혼자 루트: 메모리카드 확인 ──
    "day3_after_alone": {
        background: "classroom_evening",
        bgm: "tension.mp3",
        character: null,
        next: "day3_after_alone_2"
    },
    "day3_after_alone_2": {
        next: "day3_after_alone_branch",
        condition: "yuna_memory_card"
    },
    "day3_after_alone_no_card": {
        next: "day3_after_end"
    },
    "day3_after_alone_branch": {
        next: "day3_after_alone_3"
    },
    "day3_after_alone_3": {
        next: "day3_after_alone_4",
        glitch: { noise: true, noiseDuration: 300 }
    },
    "day3_after_alone_4": {
        next: "day3_after_alone_5",
        setFlags: ["evidence_photos_seen"]
    },
    "day3_after_alone_5": {
        next: "day3_after_alone_6"
    },
    "day3_after_alone_6": {
        glitch: { screenShake: true, shakeDuration: 500 },
        next: "day3_after_end"
    },

    "day3_after_end": {
        background: "school_gate_evening",
        character: null,
        changeSlot: "night",
        next: "day3_night_start"
    }
});
