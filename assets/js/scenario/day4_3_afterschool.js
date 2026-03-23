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
        character: null,
        next: "day4_after_start_3"
    },
    "day4_after_start_3": {
        character: null,
        next: "day4_xover_yuna_1"
    },

    // ═══════════════════════════════════════
    // ★ 크로스오버: 유나 단독 씬 (Cupid 플레이어 전용)
    // Cupid 미플레이 → fallback(짧은 버전)으로 분기
    // ═══════════════════════════════════════
    "day4_xover_yuna_1": {
        condition: ["cupid_played", "met_yuna"],
        fallback: "day4_xover_yuna_skip",
        background: "corridor",
        character: "yuna_cautious",
        next: "day4_xover_yuna_2"
    },
    "day4_xover_yuna_2": {
        character: "yuna_normal",
        next: "day4_xover_yuna_3"
    },
    "day4_xover_yuna_3": {
        character: "yuna_normal",
        next: "day4_xover_yuna_4"
    },
    "day4_xover_yuna_4": {
        character: "yuna_normal",
        next: "day4_xover_yuna_5"
    },
    "day4_xover_yuna_5": {
        character: "yuna_normal",
        next: "day4_xover_yuna_6"
    },
    "day4_xover_yuna_6": {
        character: "yuna_normal",
        next: "day4_xover_yuna_7"
    },
    "day4_xover_yuna_7": {
        character: "yuna_determined",
        next: "day4_xover_yuna_8"
    },
    "day4_xover_yuna_8": {
        character: "yuna_determined",
        next: "day4_xover_yuna_9"
    },
    "day4_xover_yuna_9": {
        character: "yuna_determined",
        next: "day4_xover_yuna_10"
    },
    "day4_xover_yuna_10": {
        character: null,
        glitch: { noise: true, noiseDuration: 200 },
        setFlags: ["xover_yuna_d4"],
        next: "day4_after_choice"
    },
    // ── Cupid 미플레이어 또는 유나 미조우 플레이어용 짧은 버전 ──
    "day4_xover_yuna_skip": {
        background: "corridor",
        branches: [
            { condition: "met_yuna", next: "day4_xover_yuna_skip_met" }
        ],
        // met_yuna 미충족 시: 유나를 모르는 상태이므로 스프라이트 없이 스킵
        character: null,
        next: "day4_after_choice"
    },
    // ── met_yuna는 있지만 cupid_played가 없는 경우 ──
    "day4_xover_yuna_skip_met": {
        background: "corridor",
        character: "yuna_normal",
        next: "day4_xover_yuna_skip_2"
    },
    "day4_xover_yuna_skip_2": {
        character: "yuna_normal",
        next: "day4_xover_yuna_skip_3"
    },
    "day4_xover_yuna_skip_3": {
        character: "yuna_normal",
        next: "day4_after_choice"
    },

    "day4_after_choice": {
        character: null,
        choices: [
            { next: "day4_after_sea_route", stats: { sea: { affinity: 10 } } },
            { next: "day4_after_eunsu_route", stats: { eunsu: { affinity: 10 } } },
            { next: "day4_after_riin_route", stats: { riin: { affinity: 10 } }, condition: "met_riin" }
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
        character: null,
        next: "day4_after_sea_3"
    },
    "day4_after_sea_3": {
        character: "sea_smile",
        next: "day4_after_sea_4"
    },
    "day4_after_sea_4": {
        character: "sea_smile",
        next: "day4_after_sea_5"
    },
    "day4_after_sea_5": {
        character: "sea_smile",
        next: "day4_after_sea_6"
    },
    "day4_after_sea_6": {
        character: "sea_serious",
        next: "day4_after_sea_7"
    },
    "day4_after_sea_7": {
        character: "sea_serious",
        next: "day4_after_sea_8"
    },
    "day4_after_sea_8": {
        character: "sea_serious",
        next: "day4_after_sea_9"
    },
    "day4_after_sea_9": {
        character: "sea_serious",
        next: "day4_after_sea_10"
    },
    "day4_after_sea_10": {
        character: "sea_serious",
        next: "day4_after_sea_11"
    },
    "day4_after_sea_11": {
        character: "sea_serious",
        next: "day4_after_sea_force"
    },

    // ★ FORCE CHOICE: 두 번째 선택지가 첫 번째와 같은 텍스트로 바뀜
    "day4_after_sea_force": {
        character: null,
        glitch: { forceChoice: 0 },
        choices: [
            {
                next: "day4_after_sea_accept",
                stats: { sea: { affinity: 10 } }
            },
            {
                next: "day4_after_sea_accept",
                stats: { sea: { affinity: 10 } }
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
        character: "sea_serious",
        next: "day4_after_sea_12loop"
    },

    // 세아의 Show don't tell — 서진, 팔찌
    "day4_after_sea_12loop": {
        // 세아가 나를 안았다
        character: "sea_sad",
        unskippable: true,
        next: "day4_after_sea_12loop_2"
    },
    "day4_after_sea_12loop_2": {
        // 세아가 중얼거린다
        character: "sea_sad",
        next: "day4_after_sea_12loop_3"
    },
    "day4_after_sea_12loop_3": {
        // "...서진아."
        character: "sea_sad",
        unskippable: true,
        next: "day4_after_sea_12loop_4"
    },
    "day4_after_sea_12loop_4": {
        // ...뭐?
        character: null,
        unskippable: true,
        next: "day4_after_sea_12loop_5"
    },
    "day4_after_sea_12loop_5": {
        // "...누구?"
        character: null,
        next: "day4_after_sea_12loop_6"
    },
    "day4_after_sea_12loop_6": {
        // 세아의 몸이 굳었다
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_7"
    },
    "day4_after_sea_12loop_7": {
        // 서진. 3번째 이름표.
        character: null,
        next: "day4_after_sea_12loop_8"
    },
    "day4_after_sea_12loop_8": {
        // "...아무것도 아니야."
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_9"
    },
    "day4_after_sea_12loop_9": {
        // 세아가 나를 놓지 않는다. 어깨가 떨린다.
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_10"
    },
    "day4_after_sea_12loop_10": {
        // 실팔찌 발견
        character: "sea_cry",
        next: "day4_after_sea_12loop_11"
    },
    "day4_after_sea_12loop_11": {
        // '세아'. 내 필체다.
        character: null,
        unskippable: true,
        next: "day4_after_sea_12loop_12"
    },
    "day4_after_sea_12loop_12": {
        // 세아가 눈치챘다
        character: "sea_cry",
        next: "day4_after_sea_12loop_13"
    },
    "day4_after_sea_12loop_13": {
        // "...예쁘지?"
        character: "sea_cry",
        unskippable: true,
        next: "day4_after_sea_12loop_14"
    },
    "day4_after_sea_12loop_14": {
        // 웃고 있다. 울면서.
        character: "sea_cry",
        unskippable: true,
        glitch: { noise: true },
        next: "day4_after_ft_sea_pre",
        setFlags: ["sea_12loop_confession"]
    },

    // ═══════════════════════════════════════
    // ★ 세아 심문 (FreeTalk 감정적 조종)
    // 12번의 고백 후, 세아가 마지막으로 붙잡으며 자유 입력
    // ═══════════════════════════════════════
    "day4_after_ft_sea_pre": {
        character: "sea_cry",
        next: "day4_after_ft_sea"
    },
    "day4_after_ft_sea": {
        character: "sea_cry",
        type: "free_talk",
        freeTalkMode: "interrogation",
        freeTalkChar: "sea",
        freeTalkContext: "12번의 반복 고백 후, 주인공이 떠나려 한다",
        freeTalkNext: "day4_after_ft_sea_post"
    },
    "day4_after_ft_sea_post": {
        character: "sea_sad",
        next: "day4_after_end"
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
        character: null,
        next: "day4_after_eunsu_3"
    },
    "day4_after_eunsu_3": {
        character: "eunsu_serious",
        next: "day4_after_eunsu_4"
    },
    "day4_after_eunsu_4": {
        character: "eunsu_serious",
        unskippable: true,
        next: "day4_after_eunsu_5"
    },
    "day4_after_eunsu_5": {
        // 커피를 내린다. 잔 두 개.
        character: "eunsu_serious",
        next: "day4_after_eunsu_6"
    },
    "day4_after_eunsu_6": {
        // 설탕 두 스푼, 크림 반
        character: null,
        unskippable: true,
        next: "day4_after_eunsu_7"
    },
    "day4_after_eunsu_7": {
        // 내가 알려준 적 없다
        character: null,
        unskippable: true,
        next: "day4_after_eunsu_8"
    },
    "day4_after_eunsu_8": {
        // "맞지? 네 취향."
        character: "eunsu_serious",
        next: "day4_after_eunsu_9"
    },
    "day4_after_eunsu_9": {
        // 선생님이 웃는다. 안도.
        character: "eunsu_gentle",
        unskippable: true,
        next: "day4_after_eunsu_10"
    },
    "day4_after_eunsu_10": {
        // 서랍. 포스트잇. 이름들.
        character: null,
        unskippable: true,
        next: "day4_after_eunsu_11"
    },
    "day4_after_eunsu_11": {
        // 맨 아래 포스트잇에 내 이름
        character: null,
        unskippable: true,
        next: "day4_after_eunsu_12"
    },
    "day4_after_eunsu_12": {
        // "...다 봤구나. 지하실."
        character: "eunsu_serious",
        unskippable: true,
        next: "day4_after_eunsu_13"
    },
    "day4_after_eunsu_13": {
        // 침묵.
        character: null,
        next: "day4_after_eunsu_14"
    },
    "day4_after_eunsu_14": {
        // "괜찮아, {name}. 선생님이 다 해결해줄게."
        character: "eunsu_gentle",
        unskippable: true,
        next: "day4_after_eunsu_15"
    },
    "day4_after_eunsu_15": {
        // 선생님의 손이 내 머리를 쓰다듬는다
        character: "eunsu_gentle",
        unskippable: true,
        next: "day4_after_eunsu_16"
    },
    "day4_after_eunsu_16": {
        // ...이 손이 12번의 기억을 지웠다
        character: "eunsu_gentle",
        unskippable: true,
        glitch: { heavyGlitch: true },
        next: "day4_after_end",
        setFlags: ["eunsu_confession_d4"]
    },

    // ═══════════════════════════════════════
    // 리인 루트 — 내부 반란자
    // ═══════════════════════════════════════
    "day4_after_riin_route": {
        background: "nurse_office",
        bgm: "riin_theme.mp3",
        character: null,
        next: "day4_after_riin_2"
    },
    "day4_after_riin_2": {
        character: null,
        next: "day4_after_riin_3"
    },
    "day4_after_riin_3": {
        character: "riin_neutral",
        next: "day4_after_riin_4"
    },
    "day4_after_riin_4": {
        character: "riin_neutral",
        next: "day4_after_riin_5"
    },
    "day4_after_riin_5": {
        character: "riin_neutral",
        next: "day4_after_riin_6"
    },
    "day4_after_riin_6": {
        character: "riin_neutral",
        next: "day4_after_riin_7"
    },
    "day4_after_riin_7": {
        character: "riin_neutral",
        next: "day4_after_riin_8"
    },
    "day4_after_riin_8": {
        character: "riin_neutral",
        next: "day4_after_riin_9"
    },
    "day4_after_riin_9": {
        character: "riin_neutral",
        next: "day4_after_riin_10"
    },
    "day4_after_riin_10": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_11"
    },
    "day4_after_riin_11": {
        character: "riin_cold",
        next: "day4_after_riin_12"
    },
    "day4_after_riin_12": {
        character: "riin_cold",
        next: "day4_after_riin_13"
    },
    "day4_after_riin_13": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_14"
    },
    "day4_after_riin_14": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_15"
    },
    "day4_after_riin_15": {
        character: "riin_cold",
        next: "day4_after_riin_16"
    },
    "day4_after_riin_16": {
        character: "riin_cold",
        // 열쇠 등장
        next: "day4_after_riin_17"
    },
    "day4_after_riin_17": {
        character: "riin_cold",
        next: "day4_after_riin_18"
    },
    "day4_after_riin_18": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_19"
    },
    "day4_after_riin_19": {
        character: "riin_cold",
        next: "day4_after_riin_20"
    },
    "day4_after_riin_20": {
        character: "riin_cold",
        next: "day4_after_riin_21"
    },
    "day4_after_riin_21": {
        character: "riin_cold",
        next: "day4_after_riin_22"
    },
    "day4_after_riin_22": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_23"
    },
    "day4_after_riin_23": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_24"
    },
    "day4_after_riin_24": {
        character: "riin_cold",
        next: "day4_after_riin_25"
    },
    "day4_after_riin_25": {
        character: "riin_cold",
        unskippable: true,
        next: "day4_after_riin_26"
    },
    "day4_after_riin_26": {
        character: "riin_cold",
        next: "day4_after_riin_27"
    },
    "day4_after_riin_27": {
        character: "riin_cold",
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
