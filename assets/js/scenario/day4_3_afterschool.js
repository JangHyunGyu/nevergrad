/**
 * Day 4-3: Afterschool - 진실
 * 3 choices: 세아를 따라간다 / 은수를 찾아간다 / 리인을 대면한다
 * 세아: 12번의 고백 — forceChoice 글리치, 팔찌 공개, 12회 반복 기억
 * 은수: 직접 고백 — 13번째 인지, 사랑인지 집착인지 고백
 * 리인: 내부 반란자 — 투약량 감소, 구관 비상구 열쇠, 내일 아침까지
 * 위화감 90%. CRITICAL glitch level.
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
        next: "day4_after_start_3"
    },
    "day4_after_start_3": {
        next: "day4_after_choice"
    },

    "day4_after_choice": {
        choices: [
            { next: "day4_after_sea_route" },
            { next: "day4_after_eunsu_route" },
            { next: "day4_after_riin_route" }
        ]
    },

    // ═══════════════════════════════════════
    // 세아 루트 — 12번의 고백
    // ═══════════════════════════════════════
    "day4_after_sea_route": {
        background: "student_council",
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
        next: "day4_after_sea_6"
    },
    "day4_after_sea_6": {
        character: "sea_serious",
        next: "day4_after_sea_7"
    },
    "day4_after_sea_7": {
        character: null,
        next: "day4_after_sea_8"
    },
    "day4_after_sea_8": {
        character: "sea_serious",
        next: "day4_after_sea_9"
    },
    "day4_after_sea_9": {
        character: null,
        next: "day4_after_sea_10"
    },
    "day4_after_sea_10": {
        next: "day4_after_sea_11"
    },
    "day4_after_sea_11": {
        character: "sea_serious",
        next: "day4_after_sea_force"
    },

    // ★ FORCE CHOICE: 두 번째 선택지가 첫 번째와 같은 텍스트로 바뀜
    "day4_after_sea_force": {
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
        character: "sea_serious",
        next: "day4_after_sea_accept_3"
    },
    "day4_after_sea_accept_3": {
        character: null,
        next: "day4_after_sea_12loop"
    },

    // 세아의 12번 루프 고백
    "day4_after_sea_12loop": {
        character: "sea_sad",
        unskippable: true,
        next: "day4_after_sea_12loop_2"
    },
    "day4_after_sea_12loop_2": {
        character: null,
        next: "day4_after_sea_12loop_3"
    },
    "day4_after_sea_12loop_3": {
        character: "sea_sad",
        unskippable: true,
        next: "day4_after_sea_12loop_4"
    },
    "day4_after_sea_12loop_4": {
        unskippable: true,
        next: "day4_after_sea_12loop_5"
    },
    "day4_after_sea_12loop_5": {
        character: null,
        next: "day4_after_sea_12loop_6"
    },
    "day4_after_sea_12loop_6": {
        // 팔찌 공개
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_7"
    },
    "day4_after_sea_12loop_7": {
        character: null,
        next: "day4_after_sea_12loop_8"
    },
    "day4_after_sea_12loop_8": {
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_9"
    },
    "day4_after_sea_12loop_9": {
        unskippable: true,
        next: "day4_after_sea_12loop_10"
    },
    "day4_after_sea_12loop_10": {
        character: null,
        next: "day4_after_sea_12loop_11"
    },
    "day4_after_sea_12loop_11": {
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_12"
    },
    "day4_after_sea_12loop_12": {
        character: null,
        next: "day4_after_sea_12loop_13"
    },
    "day4_after_sea_12loop_13": {
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_14"
    },
    "day4_after_sea_12loop_14": {
        character: null,
        next: "day4_after_sea_12loop_15"
    },
    "day4_after_sea_12loop_15": {
        // 포옹
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_16"
    },
    "day4_after_sea_12loop_16": {
        character: null,
        next: "day4_after_sea_12loop_17"
    },
    "day4_after_sea_12loop_17": {
        next: "day4_after_sea_12loop_18"
    },
    "day4_after_sea_12loop_18": {
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_19"
    },
    "day4_after_sea_12loop_19": {
        unskippable: true,
        next: "day4_after_sea_12loop_20"
    },
    "day4_after_sea_12loop_20": {
        unskippable: true,
        glitch: { noise: true },
        next: "day4_after_end",
        setFlags: ["sea_12loop_confession"]
    },

    // ═══════════════════════════════════════
    // 은수 루트 — 직접 고백
    // ═══════════════════════════════════════
    "day4_after_eunsu_route": {
        background: "teacher_office",
        bgm: "eunsu_theme.mp3",
        character: null,
        next: "day4_after_eunsu_2"
    },
    "day4_after_eunsu_2": {
        next: "day4_after_eunsu_3"
    },
    "day4_after_eunsu_3": {
        character: "eunsu_serious",
        next: "day4_after_eunsu_4"
    },
    "day4_after_eunsu_4": {
        unskippable: true,
        next: "day4_after_eunsu_5"
    },
    "day4_after_eunsu_5": {
        character: null,
        next: "day4_after_eunsu_6"
    },
    "day4_after_eunsu_6": {
        character: "eunsu_serious",
        unskippable: true,
        next: "day4_after_eunsu_7"
    },
    "day4_after_eunsu_7": {
        unskippable: true,
        next: "day4_after_eunsu_8"
    },
    "day4_after_eunsu_8": {
        next: "day4_after_eunsu_9"
    },
    "day4_after_eunsu_9": {
        unskippable: true,
        next: "day4_after_eunsu_10"
    },
    "day4_after_eunsu_10": {
        next: "day4_after_eunsu_11"
    },
    "day4_after_eunsu_11": {
        character: null,
        next: "day4_after_eunsu_12"
    },
    "day4_after_eunsu_12": {
        character: "eunsu_serious",
        unskippable: true,
        next: "day4_after_eunsu_13"
    },
    "day4_after_eunsu_13": {
        next: "day4_after_eunsu_14"
    },
    "day4_after_eunsu_14": {
        character: null,
        next: "day4_after_eunsu_15"
    },
    "day4_after_eunsu_15": {
        character: "eunsu_serious",
        unskippable: true,
        next: "day4_after_eunsu_16"
    },
    "day4_after_eunsu_16": {
        character: null,
        next: "day4_after_eunsu_17"
    },
    "day4_after_eunsu_17": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day4_after_eunsu_18"
    },
    "day4_after_eunsu_18": {
        character: null,
        next: "day4_after_eunsu_19"
    },
    "day4_after_eunsu_19": {
        next: "day4_after_eunsu_20"
    },
    "day4_after_eunsu_20": {
        character: null,
        glitch: { heavyGlitch: true },
        next: "day4_after_end",
        setFlags: ["eunsu_confession_d4"],
        stats: { eunsu: { danger: 20 } }
    },

    // ═══════════════════════════════════════
    // 리인 루트 — 내부 반란자
    // ═══════════════════════════════════════
    "day4_after_riin_route": {
        background: "infirmary",
        bgm: "riin_theme.mp3",
        character: null,
        next: "day4_after_riin_2"
    },
    "day4_after_riin_2": {
        next: "day4_after_riin_3"
    },
    "day4_after_riin_3": {
        character: "riin_neutral",
        next: "day4_after_riin_4"
    },
    "day4_after_riin_4": {
        character: null,
        next: "day4_after_riin_5"
    },
    "day4_after_riin_5": {
        next: "day4_after_riin_6"
    },
    "day4_after_riin_6": {
        character: "riin_neutral",
        next: "day4_after_riin_7"
    },
    "day4_after_riin_7": {
        character: null,
        next: "day4_after_riin_8"
    },
    "day4_after_riin_8": {
        next: "day4_after_riin_9"
    },
    "day4_after_riin_9": {
        next: "day4_after_riin_10"
    },
    "day4_after_riin_10": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_11"
    },
    "day4_after_riin_11": {
        character: null,
        next: "day4_after_riin_12"
    },
    "day4_after_riin_12": {
        next: "day4_after_riin_13"
    },
    "day4_after_riin_13": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_14"
    },
    "day4_after_riin_14": {
        unskippable: true,
        next: "day4_after_riin_15"
    },
    "day4_after_riin_15": {
        character: null,
        next: "day4_after_riin_16"
    },
    "day4_after_riin_16": {
        // 열쇠 등장
        next: "day4_after_riin_17"
    },
    "day4_after_riin_17": {
        next: "day4_after_riin_18"
    },
    "day4_after_riin_18": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_19"
    },
    "day4_after_riin_19": {
        character: null,
        next: "day4_after_riin_20"
    },
    "day4_after_riin_20": {
        character: "riin_cold",
        next: "day4_after_riin_21"
    },
    "day4_after_riin_21": {
        character: null,
        next: "day4_after_riin_22"
    },
    "day4_after_riin_22": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_23"
    },
    "day4_after_riin_23": {
        unskippable: true,
        next: "day4_after_riin_24"
    },
    "day4_after_riin_24": {
        character: null,
        next: "day4_after_riin_25"
    },
    "day4_after_riin_25": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_26"
    },
    "day4_after_riin_26": {
        character: null,
        next: "day4_after_riin_27"
    },
    "day4_after_riin_27": {
        next: "day4_after_end",
        setFlags: ["riin_rebel_reveal"]
    },

    // ── 방과후 종료 ──
    "day4_after_end": {
        background: "school_gate",
        character: null,
        changeSlot: "night",
        next: "day4_night_start"
    }
});
