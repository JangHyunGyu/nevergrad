/**
 * Day 3-3: Afterschool - 심화
 * 위화감 20-40%. 글리치: UNSETTLING.
 * 리인의 수상한 약(선택지 플리커), 세아 감시 드러남,
 * 은수 전학생 관리 대장(커피+서류), 혼자 메모리카드 확인.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    // ── 방과후 시작 ──
    "day3_after_start": {
        background: "classroom",
        bgm: "daily_tense.mp3",
        character: null,
        next: "day3_after_choice"
    },
    "day3_after_choice": {
        choices: [
            { next: "day3_after_riin" },
            { next: "day3_after_sea" },
            { next: "day3_after_eunsu" },
            { next: "day3_after_alone" }
        ]
    },

    // ══════════════════════════════════════
    //  리인 루트: 수상한 약 [글리치: 선택지 플리커]
    // ══════════════════════════════════════
    "day3_after_riin": {
        background: "nurse_office",
        bgm: "riin_theme.mp3",
        character: "riin_smile",
        next: "day3_after_riin_2"
    },
    "day3_after_riin_2": {
        next: "day3_after_riin_3"
    },
    "day3_after_riin_3": {
        next: "day3_after_riin_choice"
    },
    // ★ FLICKER GLITCH: 첫 번째 선택지가 0.1초간 "도망쳐"로 깜빡임
    "day3_after_riin_choice": {
        glitch: { flickerChoice: 0, flickerText: "day3_after_riin_flicker", flickerDuration: 100 },
        choices: [
            {
                next: "day3_after_riin_drink",
                setFlags: ["drank_riin_drink"],
                stats: { riin: { affinity: 5, danger: 10 } }
            },
            {
                next: "day3_after_riin_refuse"
            }
        ]
    },

    // 마셨을 경우
    "day3_after_riin_drink": {
        character: "riin_smile",
        next: "day3_after_riin_drink_2"
    },
    "day3_after_riin_drink_2": {
        next: "day3_after_riin_drink_3",
        stats: { riin: { danger: 5 } }
    },
    "day3_after_riin_drink_3": {
        character: null,
        glitch: { noise: true, noiseDuration: 200 },
        next: "day3_after_end"
    },

    // 거절했을 경우
    "day3_after_riin_refuse": {
        character: "riin_cold",
        next: "day3_after_riin_refuse_2"
    },
    "day3_after_riin_refuse_2": {
        character: null,
        next: "day3_after_end"
    },

    // ══════════════════════════════════════
    //  세아 루트: 감시 드러남
    // ══════════════════════════════════════
    "day3_after_sea": {
        background: "corridor",
        bgm: "sea_theme.mp3",
        character: "sea_serious",
        next: "day3_after_sea_2"
    },
    "day3_after_sea_2": {
        next: "day3_after_sea_choice"
    },
    // 솔직히 말한다 / 얼버무린다
    "day3_after_sea_choice": {
        choices: [
            {
                next: "day3_after_sea_truth",
                stats: { sea: { trust: 5, danger: 5 } }
            },
            {
                next: "day3_after_sea_lie"
            }
        ]
    },

    // 솔직히 말하면
    "day3_after_sea_truth": {
        next: "day3_after_sea_truth_2"
    },
    "day3_after_sea_truth_2": {
        character: "sea_smile",
        next: "day3_after_sea_truth_3"
    },
    "day3_after_sea_truth_3": {
        next: "day3_after_sea_truth_4"
    },
    "day3_after_sea_truth_4": {
        next: "day3_after_sea_truth_5"
    },
    "day3_after_sea_truth_5": {
        next: "day3_after_sea_truth_6"
    },
    "day3_after_sea_truth_6": {
        next: "day3_after_sea_truth_7"
    },
    "day3_after_sea_truth_7": {
        next: "day3_after_end"
    },

    // 얼버무리면
    "day3_after_sea_lie": {
        next: "day3_after_sea_lie_2",
        stats: { sea: { danger: 5 } }
    },
    "day3_after_sea_lie_2": {
        character: "sea_yandere",
        glitch: { noise: true, noiseDuration: 150 },
        next: "day3_after_end"
    },

    // ══════════════════════════════════════
    //  은수 루트: 전학생 관리 대장
    // ══════════════════════════════════════
    "day3_after_eunsu": {
        background: "classroom",
        bgm: "eunsu_theme.mp3",
        character: "eunsu_smile",
        next: "day3_after_eunsu_2"
    },
    "day3_after_eunsu_2": {
        next: "day3_after_eunsu_3"
    },
    "day3_after_eunsu_3": {
        next: "day3_after_eunsu_choice"
    },
    // 슬쩍 읽어본다 / 시선을 돌린다
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

    // 슬쩍 읽어보면
    "day3_after_eunsu_peek": {
        character: null,
        next: "day3_after_eunsu_peek_2",
        setFlags: ["evidence_transfer_list"]
    },
    "day3_after_eunsu_peek_2": {
        next: "day3_after_eunsu_peek_3"
    },
    "day3_after_eunsu_peek_3": {
        next: "day3_after_eunsu_peek_4"
    },
    "day3_after_eunsu_peek_4": {
        character: "eunsu_serious",
        next: "day3_after_eunsu_peek_5"
    },
    "day3_after_eunsu_peek_5": {
        character: "eunsu_smile",
        next: "day3_after_eunsu_peek_6"
    },
    "day3_after_eunsu_peek_6": {
        next: "day3_after_eunsu_peek_7",
        stats: { eunsu: { danger: 10 } }
    },
    "day3_after_eunsu_peek_7": {
        next: "day3_after_end"
    },

    // 시선을 돌리면
    "day3_after_eunsu_ignore": {
        next: "day3_after_eunsu_ignore_2"
    },
    "day3_after_eunsu_ignore_2": {
        character: "eunsu_smile",
        next: "day3_after_eunsu_ignore_3"
    },
    "day3_after_eunsu_ignore_3": {
        next: "day3_after_eunsu_ignore_4",
        stats: { eunsu: { danger: 5 } }
    },
    "day3_after_eunsu_ignore_4": {
        character: null,
        next: "day3_after_end"
    },

    // ══════════════════════════════════════
    //  혼자 루트: 메모리카드 확인
    // ══════════════════════════════════════
    "day3_after_alone": {
        background: "classroom",
        bgm: "tension.mp3",
        character: null,
        next: "day3_after_alone_2",
        condition: "yuna_memory_card",
        fallback: "day3_after_alone_no_card"
    },
    "day3_after_alone_no_card": {
        background: "classroom",
        bgm: "tension.mp3",
        character: null,
        next: "day3_after_end"
    },
    "day3_after_alone_2": {
        next: "day3_after_alone_3"
    },
    "day3_after_alone_3": {
        next: "day3_after_alone_4",
        glitch: { noise: true, noiseDuration: 300 },
        setFlags: ["evidence_photos_seen"]
    },
    "day3_after_alone_4": {
        glitch: { screenShake: true, shakeDuration: 500 },
        next: "day3_after_end"
    },

    // ── Day 3 방과후 종료 ──
    "day3_after_end": {
        background: "school_gate",
        character: null,
        changeSlot: "night",
        next: "day3_night_start"
    }
});
