/**
 * Day 3-3: Afterschool - 심화
 * 위화감 20-40%. 글리치: UNSETTLING.
 * 리인의 수상한 약(선택지 플리커 "도망쳐"), 세아 감시 드러남,
 * 은수 피험자 관리 대장, 유나 후속(SD카드), 구관 탐색(기계 소리).
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    // ── 방과후 시작: 종례 직후 ──
    "day3_after_start": {
        background: "classroom",
        bgm: "daily_tense.mp3",
        character: null,
        next: "day3_after_start_2"
    },
    "day3_after_start_2": {
        next: "day3_after_start_3"
    },
    "day3_after_start_3": {
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
    //  리인 루트: 수상한 약 [글리치: 선택지 플리커 "도망쳐"]
    // ══════════════════════════════════════
    "day3_after_riin": {
        background: "nurse_office",
        bgm: "riin_theme.mp3",
        character: null,
        next: "day3_after_riin_2"
    },
    "day3_after_riin_2": {
        next: "day3_after_riin_3"
    },
    "day3_after_riin_3": {
        character: "riin_smile",
        next: "day3_after_riin_4"
    },
    "day3_after_riin_4": {
        next: "day3_after_riin_5"
    },
    "day3_after_riin_5": {
        next: "day3_after_riin_6"
    },
    "day3_after_riin_6": {
        next: "day3_after_riin_7"
    },
    "day3_after_riin_7": {
        next: "day3_after_riin_choice"
    },

    // ★ FLICKER GLITCH: 첫 번째 선택지가 0.1초간 "도망쳐"로 깜빡임 (붉은색)
    "day3_after_riin_choice": {
        glitch: { flickerChoice: 0, flickerText: "day3_after_riin_flicker", flickerDuration: 100, flickerColor: "#ff0000" },
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
        glitch: { screenShake: true, shakeDuration: 500 },
        next: "day3_after_riin_drink_3"
    },
    "day3_after_riin_drink_3": {
        character: "riin_pain",
        next: "day3_after_riin_drink_4"
    },
    "day3_after_riin_drink_4": {
        character: "riin_smile",
        next: "day3_after_riin_drink_5"
    },
    "day3_after_riin_drink_5": {
        character: null,
        next: "day3_after_yuna_check",
        stats: { riin: { danger: 5 } }
    },

    // 거절했을 경우
    "day3_after_riin_refuse": {
        character: "riin_smile",
        next: "day3_after_riin_refuse_2"
    },
    "day3_after_riin_refuse_2": {
        next: "day3_after_riin_refuse_3"
    },
    "day3_after_riin_refuse_3": {
        character: "riin_relief",
        next: "day3_after_riin_refuse_4"
    },
    "day3_after_riin_refuse_4": {
        next: "day3_after_yuna_check"
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
        next: "day3_after_sea_3"
    },
    "day3_after_sea_3": {
        next: "day3_after_sea_4"
    },
    "day3_after_sea_4": {
        next: "day3_after_sea_4a"
    },
    "day3_after_sea_4a": {
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
        character: "sea_broken_smile",
        next: "day3_after_sea_truth_8"
    },
    "day3_after_sea_truth_8": {
        next: "day3_after_sea_truth_9"
    },
    "day3_after_sea_truth_9": {
        character: null,
        next: "day3_after_yuna_check"
    },

    // 얼버무리면
    "day3_after_sea_lie": {
        next: "day3_after_sea_lie_2"
    },
    "day3_after_sea_lie_2": {
        character: "sea_yandere",
        next: "day3_after_sea_lie_3",
        stats: { sea: { danger: 5 } }
    },
    "day3_after_sea_lie_3": {
        next: "day3_after_sea_lie_3a"
    },
    "day3_after_sea_lie_3a": {
        next: "day3_after_sea_lie_4"
    },
    "day3_after_sea_lie_4": {
        next: "day3_after_sea_lie_4a"
    },
    "day3_after_sea_lie_4a": {
        next: "day3_after_sea_lie_5"
    },
    "day3_after_sea_lie_5": {
        next: "day3_after_sea_lie_5a"
    },
    "day3_after_sea_lie_5a": {
        character: "sea_smile",
        glitch: { noise: true, noiseDuration: 150 },
        next: "day3_after_yuna_check"
    },

    // ══════════════════════════════════════
    //  은수 루트: 피험자 관리 대장
    // ══════════════════════════════════════
    "day3_after_eunsu": {
        background: "teacher_office",
        bgm: "eunsu_theme.mp3",
        character: null,
        next: "day3_after_eunsu_2"
    },
    "day3_after_eunsu_2": {
        next: "day3_after_eunsu_3"
    },
    "day3_after_eunsu_3": {
        character: "eunsu_writing",
        next: "day3_after_eunsu_4"
    },
    "day3_after_eunsu_4": {
        next: "day3_after_eunsu_5"
    },
    "day3_after_eunsu_5": {
        character: null,
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
        setFlags: ["evidence_subject_ledger"]
    },
    "day3_after_eunsu_peek_2": {
        next: "day3_after_eunsu_peek_3"
    },
    "day3_after_eunsu_peek_3": {
        next: "day3_after_eunsu_peek_4"
    },
    "day3_after_eunsu_peek_4": {
        next: "day3_after_eunsu_peek_5"
    },
    "day3_after_eunsu_peek_5": {
        next: "day3_after_eunsu_peek_6"
    },
    "day3_after_eunsu_peek_6": {
        next: "day3_after_eunsu_peek_7"
    },
    "day3_after_eunsu_peek_7": {
        next: "day3_after_eunsu_peek_8"
    },
    "day3_after_eunsu_peek_8": {
        character: "eunsu_smile",
        next: "day3_after_eunsu_peek_8a"
    },
    "day3_after_eunsu_peek_8a": {
        next: "day3_after_eunsu_peek_9"
    },
    "day3_after_eunsu_peek_9": {
        next: "day3_after_eunsu_peek_10"
    },
    "day3_after_eunsu_peek_10": {
        next: "day3_after_eunsu_peek_11",
        stats: { eunsu: { danger: 10 } }
    },
    "day3_after_eunsu_peek_11": {
        character: null,
        next: "day3_after_yuna_check"
    },

    // 시선을 돌리면
    "day3_after_eunsu_ignore": {
        next: "day3_after_yuna_check"
    },

    // ══════════════════════════════════════
    //  혼자 남기 → 구관 탐색: 기계 소리
    // ══════════════════════════════════════
    "day3_after_alone": {
        background: "old_building_corridor",
        bgm: "tension.mp3",
        character: null,
        next: "day3_after_alone_2"
    },
    "day3_after_alone_2": {
        next: "day3_after_alone_3"
    },
    "day3_after_alone_3": {
        next: "day3_after_alone_4"
    },
    "day3_after_alone_4": {
        next: "day3_after_alone_5"
    },
    "day3_after_alone_5": {
        next: "day3_after_alone_6"
    },
    "day3_after_alone_6": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day3_after_alone_7"
    },
    "day3_after_alone_7": {
        next: "day3_after_alone_8"
    },
    "day3_after_alone_8": {
        next: "day3_after_alone_9"
    },
    "day3_after_alone_9": {
        next: "day3_after_alone_10",
        setFlags: ["found_old_building_nametags"]
    },
    "day3_after_alone_10": {
        next: "day3_after_alone_11"
    },
    "day3_after_alone_11": {
        next: "day3_after_yuna_check"
    },

    // ══════════════════════════════════════
    //  유나 후속: 메모리카드 (점심에 옥상에 갔을 경우)
    // ══════════════════════════════════════
    "day3_after_yuna_check": {
        condition: "yuna_memory_card",
        next: "day3_after_yuna",
        fallback: "day3_after_end"
    },
    "day3_after_yuna": {
        background: "school_back",
        bgm: "yuna_theme.mp3",
        character: "yuna_cautious",
        next: "day3_after_yuna_2"
    },
    "day3_after_yuna_2": {
        next: "day3_after_yuna_3"
    },
    "day3_after_yuna_3": {
        next: "day3_after_yuna_4"
    },
    "day3_after_yuna_4": {
        next: "day3_after_yuna_5",
        setFlags: ["yuna_sd_card_copy"]
    },
    "day3_after_yuna_5": {
        next: "day3_after_yuna_6"
    },
    "day3_after_yuna_6": {
        next: "day3_after_yuna_6a"
    },
    "day3_after_yuna_6a": {
        next: "day3_after_yuna_7"
    },
    "day3_after_yuna_7": {
        next: "day3_after_yuna_8"
    },
    "day3_after_yuna_8": {
        character: null,
        next: "day3_after_yuna_9"
    },
    "day3_after_yuna_9": {
        next: "day3_after_yuna_9a"
    },
    "day3_after_yuna_9a": {
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
