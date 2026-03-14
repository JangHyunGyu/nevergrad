/**
 * ============================================================================
 * Day 3-4: Night - ★ 장르 전환 ★
 * ============================================================================
 * 위화감 60%+. 글리치: BREAKING.
 * - 세아 메시지 폭격 (13분 6개 + CRITICAL: '창문 열어둔 거지?')
 * - ★ 기억 블리드 (데자뷔 질문들 → "전 학교가 진짜 있긴 했나?")
 * - ★ 스탯 라벨 크랙 (호감도 → 위험도 / 투■량)
 * - 벽의 글씨 (3AM 각성 이벤트, 꿈 아님 — "여기서 나가")
 * - 설화의 경고 (각성 상태, "5일이야", "기억해. 왼손.")
 * - 최종 선택 + 유령 텍스트 x2
 * BGM: night_calm.mp3 → (점점 느려짐) → tension.mp3
 * ============================================================================
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    // ══════════════════════════════════════
    //  자취방 - 귀가
    // ══════════════════════════════════════
    "day3_night_start": {
        background: "home",
        bgm: "night_calm.mp3",
        character: null,
        next: "day3_night_start_2"
    },
    "day3_night_start_2": {
        next: "day3_night_sea_msg"
    },

    // ══════════════════════════════════════
    //  세아의 메시지 폭격 (13분 6개 → CRITICAL 메시지)
    // ══════════════════════════════════════
    "day3_night_sea_msg": {
        next: "day3_night_sea_msg_2"
    },
    "day3_night_sea_msg_2": {
        messengerDelay: 1200,
        next: "day3_night_sea_msg_3"
    },
    "day3_night_sea_msg_3": {
        messengerDelay: 800,
        next: "day3_night_sea_msg_4"
    },
    "day3_night_sea_msg_4": {
        messengerDelay: 600,
        next: "day3_night_sea_msg_5"
    },
    "day3_night_sea_msg_5": {
        messengerDelay: 500,
        next: "day3_night_sea_msg_6"
    },
    "day3_night_sea_msg_6": {
        messengerDelay: 400,
        next: "day3_night_sea_msg_7"
    },
    "day3_night_sea_msg_7": {
        next: "day3_night_sea_msg_8"
    },
    "day3_night_sea_msg_8": {
        next: "day3_night_sea_msg_9"
    },
    "day3_night_sea_msg_9": {
        next: "day3_night_sea_msg_10"
    },
    "day3_night_sea_msg_10": {
        next: "day3_night_sea_msg_11"
    },
    "day3_night_sea_msg_11": {
        next: "day3_night_sea_msg_12"
    },
    // CRITICAL: 창문 메시지 — 세아가 밖에서 보고 있다
    "day3_night_sea_msg_12": {
        messengerDelay: 300,
        stats: { sea: { danger: 10 } },
        next: "day3_night_sea_msg_13"
    },
    "day3_night_sea_msg_13": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day3_night_sea_msg_14"
    },
    "day3_night_sea_msg_14": {
        next: "day3_night_sea_msg_15"
    },
    "day3_night_sea_msg_15": {
        next: "day3_night_sea_msg_16"
    },
    "day3_night_sea_msg_16": {
        next: "day3_night_sea_msg_17"
    },
    "day3_night_sea_msg_17": {
        next: "day3_night_bleed"
    },

    // ══════════════════════════════════════
    //  ★ 기억 블리드 — 장르 전환의 시작
    // ══════════════════════════════════════
    "day3_night_bleed": {
        next: "day3_night_bleed_2"
    },
    "day3_night_bleed_2": {
        next: "day3_night_bleed_3"
    },
    "day3_night_bleed_3": {
        next: "day3_night_bleed_4"
    },
    "day3_night_bleed_4": {
        next: "day3_night_bleed_5"
    },
    "day3_night_bleed_5": {
        glitch: { themeShift: true },
        next: "day3_night_bleed_6"
    },
    "day3_night_bleed_6": {
        next: "day3_night_bleed_7"
    },
    "day3_night_bleed_7": {
        next: "day3_night_bleed_7a"
    },
    "day3_night_bleed_7a": {
        next: "day3_night_bleed_8"
    },
    "day3_night_bleed_8": {
        next: "day3_night_bleed_9"
    },
    "day3_night_bleed_9": {
        next: "day3_night_bleed_10"
    },
    "day3_night_bleed_10": {
        next: "day3_night_bleed_10a"
    },
    "day3_night_bleed_10a": {
        next: "day3_night_bleed_11"
    },
    "day3_night_bleed_11": {
        next: "day3_night_bleed_12"
    },
    "day3_night_bleed_12": {
        next: "day3_night_bleed_13"
    },
    // CRITICAL: "전 학교가 진짜 있긴 했나?"
    "day3_night_bleed_13": {
        glitch: { screenShake: true, noise: true, noiseDuration: 300 },
        next: "day3_night_bleed_14"
    },
    "day3_night_bleed_14": {
        next: "day3_night_bleed_15"
    },
    "day3_night_bleed_15": {
        next: "day3_night_stat_crack"
    },

    // ══════════════════════════════════════
    //  ★ 스탯 라벨 크랙 [글리치: '호감도' → '위험도' / '투■량']
    // ══════════════════════════════════════
    "day3_night_stat_crack": {
        next: "day3_night_stat_crack_2"
    },
    "day3_night_stat_crack_2": {
        next: "day3_night_stat_crack_3"
    },
    "day3_night_stat_crack_3": {
        next: "day3_night_stat_crack_4"
    },
    "day3_night_stat_crack_4": {
        glitch: { shatterStatLabel: true, revealDuration: 2000 },
        next: "day3_night_stat_crack_4a"
    },
    "day3_night_stat_crack_4a": {
        next: "day3_night_stat_crack_5"
    },
    "day3_night_stat_crack_5": {
        next: "day3_night_stat_crack_6"
    },
    "day3_night_stat_crack_6": {
        next: "day3_night_wall"
    },

    // ══════════════════════════════════════
    //  벽의 글씨 — 꿈이 아닌 현실 (새벽 3시 각성)
    // ══════════════════════════════════════
    "day3_night_wall": {
        bgm: { fadeOut: 3000 },
        next: "day3_night_wall_2"
    },
    "day3_night_wall_2": {
        next: "day3_night_wall_3"
    },
    "day3_night_wall_3": {
        next: "day3_night_wall_4"
    },
    // "여기서 나가"
    "day3_night_wall_4": {
        glitch: { screenShake: true, noise: true, noiseDuration: 500 },
        next: "day3_night_wall_5"
    },
    "day3_night_wall_5": {
        next: "day3_night_wall_6"
    },
    "day3_night_wall_6": {
        next: "day3_night_wall_7"
    },
    "day3_night_wall_7": {
        next: "day3_night_wall_8"
    },
    "day3_night_wall_8": {
        next: "day3_night_wall_9"
    },
    "day3_night_wall_9": {
        next: "day3_night_wall_10"
    },
    "day3_night_wall_10": {
        next: "day3_night_wall_11"
    },
    "day3_night_wall_11": {
        next: "day3_night_wall_12"
    },
    "day3_night_wall_12": {
        next: "day3_night_seolhwa"
    },

    // ══════════════════════════════════════
    //  설화의 경고 — 현실 (각성 상태, 환각/잔상)
    // ══════════════════════════════════════
    "day3_night_seolhwa": {
        bgm: null,
        character: "seolhwa_fading",
        glitch: { noise: true, noiseDuration: 300, temperatureDrop: true },
        next: "day3_night_seolhwa_2"
    },
    "day3_night_seolhwa_2": {
        next: "day3_night_seolhwa_3"
    },
    "day3_night_seolhwa_3": {
        next: "day3_night_seolhwa_4"
    },
    "day3_night_seolhwa_4": {
        next: "day3_night_seolhwa_4a"
    },
    "day3_night_seolhwa_4a": {
        next: "day3_night_seolhwa_4b"
    },
    "day3_night_seolhwa_4b": {
        next: "day3_night_seolhwa_5"
    },
    // "...5일이야."
    "day3_night_seolhwa_5": {
        character: "seolhwa_sad",
        typingSpeed: 120,
        unskippable: true,
        next: "day3_night_seolhwa_6"
    },
    "day3_night_seolhwa_6": {
        next: "day3_night_seolhwa_6a"
    },
    "day3_night_seolhwa_6a": {
        next: "day3_night_seolhwa_7"
    },
    // "5일 안에... 여기서 나가야 해."
    "day3_night_seolhwa_7": {
        typingSpeed: 150,
        unskippable: true,
        next: "day3_night_seolhwa_7a"
    },
    "day3_night_seolhwa_7a": {
        next: "day3_night_seolhwa_8"
    },
    // "나처럼 되기 전에."
    "day3_night_seolhwa_8": {
        typingSpeed: 150,
        unskippable: true,
        next: "day3_night_seolhwa_9"
    },
    "day3_night_seolhwa_9": {
        next: "day3_night_seolhwa_10"
    },
    "day3_night_seolhwa_10": {
        next: "day3_night_seolhwa_11"
    },
    "day3_night_seolhwa_11": {
        next: "day3_night_seolhwa_11a"
    },
    "day3_night_seolhwa_11a": {
        next: "day3_night_seolhwa_12"
    },
    // "...기억해. 왼손."
    "day3_night_seolhwa_12": {
        character: "seolhwa_fading",
        typingSpeed: 200,
        unskippable: true,
        glitch: { ghostText: true, silence: true },
        next: "day3_night_seolhwa_13"
    },
    // 눈 깜빡 → 사라짐
    "day3_night_seolhwa_13": {
        character: null,
        glitch: { heavyGlitch: true },
        next: "day3_night_seolhwa_14"
    },
    "day3_night_seolhwa_14": {
        next: "day3_night_seolhwa_15"
    },
    "day3_night_seolhwa_15": {
        next: "day3_night_seolhwa_16"
    },
    "day3_night_seolhwa_16": {
        next: "day3_night_seolhwa_17"
    },
    "day3_night_seolhwa_17": {
        next: "day3_night_seolhwa_18"
    },
    "day3_night_seolhwa_18": {
        next: "day3_night_choice"
    },

    // ══════════════════════════════════════
    //  최종 선택
    // ══════════════════════════════════════
    "day3_night_choice": {
        choices: [
            {
                next: "day3_night_investigate",
                setFlags: ["chose_investigate_d3"]
            },
            {
                next: "day3_night_deny"
            }
        ]
    },

    // 진실을 파헤친다
    "day3_night_investigate": {
        next: "day3_night_investigate_2",
        stats: { yuna: { trust: 5 } }
    },
    "day3_night_investigate_2": {
        next: "day3_night_end"
    },

    // 모른 척한다
    "day3_night_deny": {
        next: "day3_night_deny_2"
    },
    "day3_night_deny_2": {
        next: "day3_night_deny_3"
    },
    "day3_night_deny_3": {
        glitch: { ghostText: "day3_night_ghost_ok", ghostDuration: 1500 },
        next: "day3_night_deny_4"
    },
    "day3_night_deny_4": {
        glitch: { ghostText: "day3_night_ghost_run", ghostDuration: 1500, ghostDelay: 500 },
        next: "day3_night_end"
    },

    // ══════════════════════════════════════
    //  Day 3 종료 — ★ GENRE SHIFT 트리거 ★
    // ══════════════════════════════════════
    "day3_night_end": {
        background: "black",
        bgm: null,
        character: null,
        triggerGenreShift: true,
        changeDay: 4,
        changeSlot: "morning",
        next: "day4_morning_start"
    }
});
