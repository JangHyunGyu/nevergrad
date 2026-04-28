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
        character: null,
        next: "day3_after_start_3"
    },
    "day3_after_start_3": {
        character: null,
        next: "day3_after_choice"
    },
    "day3_after_choice": {
        character: null,
        choices: [
            { next: "day3_after_riin", stats: { riin: { affinity: 5 } } },
            { next: "day3_after_sea", stats: { sea: { affinity: 5 } } },
            { next: "day3_after_eunsu", stats: { eunsu: { affinity: 5 } } },
            { next: "day3_after_alone", stats: { seolhwa: { affinity: 5 }, sea: { affinity: -3 }, eunsu: { affinity: -3 } } }
        ]
    },

    // ══════════════════════════════════════
    //  리인 루트: 수상한 약 [글리치: 선택지 플리커 "도망쳐"]
    // ══════════════════════════════════════
    "day3_after_riin": {
        background: "nurse_office",
        bgm: "riin_theme.mp3",
        character: null,
        branches: [
            { condition: "met_riin", next: "day3_after_riin_2" }
        ],
        next: "day3_after_riin_first"
    },
    // 리인을 처음 만나는 경우 (Day 1/Day 3 점심 모두 안 감)
    "day3_after_riin_first": {
        character: null,
        setFlags: ["met_riin"],
        next: "day3_after_riin_first_2"
    },
    "day3_after_riin_first_2": {
        character: "riin_smile",
        next: "day3_after_riin_3"
    },
    "day3_after_riin_2": {
        character: null,
        sfx: "sfx_knock.mp3",
        next: "day3_after_riin_3"
    },
    "day3_after_riin_3": {
        character: "riin_smile",
        next: "day3_after_riin_4"
    },
    "day3_after_riin_4": {
        character: "riin_smile",
        next: "day3_after_riin_5"
    },
    "day3_after_riin_5": {
        character: "riin_smile",
        next: "day3_after_riin_6"
    },
    "day3_after_riin_6": {
        character: "riin_smile",
        next: "day3_after_riin_6a"
    },
    "day3_after_riin_6a": {
        character: "riin_smile",
        next: "day3_after_riin_7"
    },
    "day3_after_riin_7": {
        character: "riin_smile",
        next: "day3_after_riin_choice"
    },

    // ★ FLICKER GLITCH: 첫 번째 선택지가 0.1초간 "도망쳐"로 깜빡임 (붉은색)
    "day3_after_riin_choice": {
        character: null,
        glitch: { flickerChoice: 0, flickerText: "day3_after_riin_flicker", flickerDuration: 100, flickerColor: "#ff0000" },
        choices: [
            {
                next: "day3_after_riin_drink",
                setFlags: ["drank_riin_drink"],
                stats: { riin: { affinity: 5 } }
            },
            {
                next: "day3_after_riin_refuse",
                stats: { riin: { affinity: -3 } }
            }
        ]
    },

    // 마셨을 경우
    "day3_after_riin_drink": {
        character: "riin_smile",
        next: "day3_after_riin_drink_2"
    },
    "day3_after_riin_drink_2": {
        character: "riin_smile",
        glitch: { screenShake: true, shakeDuration: 500 },
        vibrate: "needle_touch",
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
        character: "riin_smile",
        next: "day3_after_yuna_check"
    },

    // 거절했을 경우
    "day3_after_riin_refuse": {
        character: "riin_smile",
        next: "day3_after_riin_refuse_2"
    },
    "day3_after_riin_refuse_2": {
        character: "riin_smile",
        next: "day3_after_riin_refuse_3"
    },
    "day3_after_riin_refuse_3": {
        character: "riin_relief",
        next: "day3_after_riin_refuse_4"
    },
    "day3_after_riin_refuse_4": {
        character: "riin_relief",
        next: "day3_after_liin_sugar_1"
    },

    // ── 설탕물 복선: 보건실 쓰레기통 (리인 거절 후) ──
    "day3_after_liin_sugar_1": {
        character: null,
        next: "day3_after_liin_sugar_2"
    },
    "day3_after_liin_sugar_2": {
        character: null,
        next: "day3_after_liin_sugar_3",
        setFlags: ["saw_m13_ampoule"]
    },
    "day3_after_liin_sugar_3": {
        character: null,
        next: "day3_after_liin_sugar_4"
    },
    "day3_after_liin_sugar_4": {
        character: null,
        sfx: "sfx_door_close.mp3",
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
        character: "sea_serious",
        // 점심에 유나 루트를 탔는지에 따라 분기
        branches: [
            { condition: "yuna_memory_card", next: "day3_after_sea_3" }
        ],
        next: "day3_after_sea_noyuna_0"
    },
    // ── 유나 루트를 탄 경우: 세아가 유나를 직접 언급 ──
    "day3_after_sea_3": {
        character: "sea_serious",
        next: "day3_after_sea_4"
    },
    "day3_after_sea_4": {
        character: "sea_smile",
        next: "day3_after_sea_4a"
    },
    "day3_after_sea_4a": {
        character: "sea_smile",
        next: "day3_after_sea_choice"
    },

    // 솔직히 말한다 / 얼버무린다
    "day3_after_sea_choice": {
        character: null,
        choices: [
            {
                next: "day3_after_sea_truth",
                stats: { sea: { affinity: -3 }, seolhwa: { affinity: 3 } }
            },
            {
                next: "day3_after_sea_lie",
                stats: { sea: { affinity: 5 } }
            }
        ]
    },

    // ── 유나 루트 안 탄 경우: 세아가 일반적으로 걱정/감시 ──
    "day3_after_sea_noyuna_0": {
        character: "sea_serious",
        next: "day3_after_sea_noyuna_0a"
    },
    "day3_after_sea_noyuna_0a": {
        character: "sea_serious",
        next: "day3_after_sea_noyuna_0b"
    },
    "day3_after_sea_noyuna_0b": {
        character: "sea_serious",
        next: "day3_after_sea_noyuna_0c"
    },
    "day3_after_sea_noyuna_0c": {
        character: "sea_serious",
        next: "day3_after_sea_noyuna"
    },
    "day3_after_sea_noyuna": {
        character: "sea_serious",
        next: "day3_after_sea_noyuna_2"
    },
    "day3_after_sea_noyuna_2": {
        character: "sea_serious",
        next: "day3_after_sea_noyuna_3"
    },
    "day3_after_sea_noyuna_3": {
        character: "sea_serious",
        next: "day3_after_sea_noyuna_4"
    },
    "day3_after_sea_noyuna_4": {
        character: "sea_smile",
        next: "day3_after_sea_noyuna_5"
    },
    "day3_after_sea_noyuna_5": {
        character: "sea_smile",
        next: "day3_after_sea_noyuna_6"
    },
    "day3_after_sea_noyuna_6": {
        character: "sea_smile",
        glitch: { noise: true, noiseDuration: 150 },
        next: "day3_after_yuna_check"
    },

    // 솔직히 말하면
    "day3_after_sea_truth": {
        character: null,
        next: "day3_after_sea_truth_2"
    },
    "day3_after_sea_truth_2": {
        character: "sea_smile",
        next: "day3_after_sea_truth_3"
    },
    "day3_after_sea_truth_3": {
        character: "sea_smile",
        next: "day3_after_sea_truth_4"
    },
    "day3_after_sea_truth_4": {
        character: "sea_smile",
        next: "day3_after_sea_truth_5"
    },
    "day3_after_sea_truth_5": {
        character: "sea_smile",
        next: "day3_after_sea_truth_6"
    },
    "day3_after_sea_truth_6": {
        character: "sea_smile",
        next: "day3_after_sea_truth_7"
    },
    "day3_after_sea_truth_7": {
        character: "sea_broken_smile",
        next: "day3_after_sea_truth_8"
    },
    "day3_after_sea_truth_8": {
        character: "sea_broken_smile",
        next: "day3_after_sea_truth_9"
    },
    "day3_after_sea_truth_9": {
        character: "sea_broken_smile",
        next: "day3_after_yuna_check"
    },

    // 얼버무리면
    "day3_after_sea_lie": {
        character: null,
        next: "day3_after_sea_lie_2"
    },
    "day3_after_sea_lie_2": {
        character: "sea_yandere",
        next: "day3_after_sea_lie_3"
    },
    "day3_after_sea_lie_3": {
        character: "sea_yandere",
        next: "day3_after_sea_lie_3a"
    },
    "day3_after_sea_lie_3a": {
        character: "sea_yandere",
        next: "day3_after_sea_lie_4"
    },
    "day3_after_sea_lie_4": {
        character: "sea_smile",
        next: "day3_after_sea_lie_4a"
    },
    "day3_after_sea_lie_4a": {
        character: "sea_smile",
        next: "day3_after_sea_lie_5"
    },
    "day3_after_sea_lie_5": {
        character: "sea_smile",
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
        character: null,
        next: "day3_after_eunsu_3"
    },
    "day3_after_eunsu_3": {
        character: "eunsu_writing",
        next: "day3_after_eunsu_4"
    },
    "day3_after_eunsu_4": {
        character: "eunsu_writing",
        next: "day3_after_eunsu_5"
    },
    "day3_after_eunsu_5": {
        character: null,
        next: "day3_after_eunsu_choice"
    },

    // 슬쩍 읽어본다 / 시선을 돌린다
    "day3_after_eunsu_choice": {
        character: null,
        choices: [
            {
                next: "day3_after_eunsu_peek",
                setFlags: ["saw_eunsu_documents"],
                stats: { eunsu: { affinity: 8 }, seolhwa: { affinity: 5 } }
            },
            {
                next: "day3_after_eunsu_ignore",
                stats: { eunsu: { affinity: 5 } }
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
        character: null,
        next: "day3_after_eunsu_peek_3"
    },
    "day3_after_eunsu_peek_3": {
        character: null,
        next: "day3_after_eunsu_peek_4"
    },
    "day3_after_eunsu_peek_4": {
        character: null,
        next: "day3_after_eunsu_peek_5"
    },
    "day3_after_eunsu_peek_5": {
        character: null,
        sfx: "sfx_page_turn.mp3",
        next: "day3_after_eunsu_peek_6"
    },
    "day3_after_eunsu_peek_6": {
        character: null,
        next: "day3_after_eunsu_peek_7"
    },
    "day3_after_eunsu_peek_7": {
        character: null,
        sfx: "sfx_footsteps.mp3",
        next: "day3_after_eunsu_peek_8"
    },
    "day3_after_eunsu_peek_8": {
        character: "eunsu_smile",
        stopSfx: true,
        next: "day3_after_eunsu_peek_8a"
    },
    "day3_after_eunsu_peek_8a": {
        character: "eunsu_smile",
        next: "day3_after_eunsu_peek_9"
    },
    "day3_after_eunsu_peek_9": {
        character: "eunsu_smile",
        next: "day3_after_eunsu_peek_10"
    },
    "day3_after_eunsu_peek_10": {
        character: "eunsu_gentle",
        next: "day3_after_eunsu_peek_11"
    },
    "day3_after_eunsu_peek_11": {
        character: "eunsu_gentle",
        next: "day3_after_yuna_check"
    },

    // 시선을 돌리면
    "day3_after_eunsu_ignore": {
        character: null,
        next: "day3_after_yuna_check"
    },

    // ══════════════════════════════════════
    //  혼자 남기 → 구관 탐색: 기계 소리
    // ══════════════════════════════════════
    "day3_after_alone": {
        background: "old_building_corridor",
        bgm: "tension.mp3",
        sfx: "sfx_footsteps.mp3",
        character: null,
        next: "day3_after_alone_2"
    },
    "day3_after_alone_2": {
        character: null,
        next: "day3_after_alone_3"
    },
    "day3_after_alone_3": {
        character: null,
        next: "day3_after_alone_4"
    },
    "day3_after_alone_4": {
        character: null,
        next: "day3_after_alone_5"
    },
    "day3_after_alone_5": {
        character: null,
        next: "day3_after_alone_6"
    },
    "day3_after_alone_6": {
        character: null,
        sfx: "sfx_static.mp3",
        stopSfx: "sfx_footsteps.mp3",
        glitch: { noise: true, noiseDuration: 200 },
        unskippable: true,
        next: "day3_after_alone_7"
    },
    "day3_after_alone_7": {
        character: null,
        next: "day3_after_alone_8"
    },
    "day3_after_alone_8": {
        character: null,
        next: "day3_after_alone_9"
    },
    "day3_after_alone_9": {
        character: null,
        next: "day3_after_alone_10",
        setFlags: ["found_old_building_nametags"]
    },
    "day3_after_alone_10": {
        character: null,
        next: "day3_after_alone_11"
    },
    "day3_after_alone_11": {
        character: null,
        next: "day3_after_yuna_check"
    },

    // ══════════════════════════════════════
    //  유나 후속: 메모리카드 (점심에 옥상에 갔을 경우)
    // ══════════════════════════════════════
    "day3_after_yuna_check": {
        character: null,
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
        character: "yuna_cautious",
        next: "day3_after_yuna_3"
    },
    "day3_after_yuna_3": {
        character: "yuna_cautious",
        next: "day3_after_yuna_4"
    },
    "day3_after_yuna_4": {
        character: "yuna_normal",
        next: "day3_after_yuna_5",
        setFlags: ["yuna_sd_card_copy"]
    },
    "day3_after_yuna_5": {
        character: "yuna_normal",
        next: "day3_after_yuna_6"
    },
    "day3_after_yuna_6": {
        character: "yuna_normal",
        next: "day3_after_yuna_6a"
    },
    "day3_after_yuna_6a": {
        character: "yuna_normal",
        next: "day3_after_yuna_7"
    },
    "day3_after_yuna_7": {
        character: "yuna_normal",
        next: "day3_after_yuna_8"
    },
    "day3_after_yuna_8": {
        character: "yuna_normal",
        next: "day3_after_yuna_9"
    },
    "day3_after_yuna_9": {
        character: "yuna_normal",
        next: "day3_after_yuna_9a"
    },
    "day3_after_yuna_9a": {
        character: "yuna_normal",
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
