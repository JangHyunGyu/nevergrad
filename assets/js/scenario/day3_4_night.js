/**
 * Day 3-4: Night - ★ GENRE SHIFT ★
 * 위화감 50-60%. 글리치: BREAKING.
 * 세아 메시지 폭격(13분 6개), 기억의 균열, 스탯 라벨 크랙,
 * 악몽 시퀀스(세아/은수/리인), 설화의 경고(5일, 기억해줘), 각성.
 * BGM: night_calm.mp3 → nightmare.mp3 → tension.mp3
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
        next: "day3_night_start_3"
    },
    "day3_night_start_3": {
        next: "day3_night_start_4"
    },
    "day3_night_start_4": {
        next: "day3_night_start_5"
    },
    "day3_night_start_5": {
        next: "day3_night_start_6"
    },
    "day3_night_start_6": {
        next: "day3_night_start_7"
    },
    "day3_night_start_7": {
        next: "day3_night_sea_msg"
    },

    // ══════════════════════════════════════
    //  세아의 메시지 폭격
    // ══════════════════════════════════════
    "day3_night_sea_msg": {
        next: "day3_night_sea_msg_2"
    },
    "day3_night_sea_msg_2": {
        next: "day3_night_sea_msg_3"
    },
    "day3_night_sea_msg_3": {
        next: "day3_night_sea_msg_4"
    },
    "day3_night_sea_msg_4": {
        next: "day3_night_sea_msg_5"
    },
    "day3_night_sea_msg_5": {
        next: "day3_night_sea_msg_6"
    },
    "day3_night_sea_msg_6": {
        next: "day3_night_sea_msg_7"
    },
    "day3_night_sea_msg_7": {
        next: "day3_night_sea_msg_8"
    },
    "day3_night_sea_msg_8": {
        next: "day3_night_sea_msg_9",
        stats: { sea: { danger: 10 } }
    },
    "day3_night_sea_msg_9": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day3_night_recall"
    },

    // ══════════════════════════════════════
    //  기억의 균열 [글리치: UI 테마 전환 시작]
    // ══════════════════════════════════════
    "day3_night_recall": {
        next: "day3_night_recall_2"
    },
    "day3_night_recall_2": {
        next: "day3_night_recall_3"
    },
    "day3_night_recall_3": {
        next: "day3_night_recall_4"
    },
    "day3_night_recall_4": {
        next: "day3_night_recall_5"
    },
    "day3_night_recall_5": {
        glitch: { themeShift: true },
        next: "day3_night_recall_6"
    },
    "day3_night_recall_6": {
        next: "day3_night_recall_7"
    },
    "day3_night_recall_7": {
        next: "day3_night_recall_8"
    },
    "day3_night_recall_8": {
        next: "day3_night_recall_9"
    },
    "day3_night_recall_9": {
        next: "day3_night_stat_crack"
    },

    // ══════════════════════════════════════
    //  ★ 스탯 라벨 크랙 [글리치: '호감도' → '위험도']
    // ══════════════════════════════════════
    "day3_night_stat_crack": {
        next: "day3_night_stat_crack_2"
    },
    "day3_night_stat_crack_2": {
        next: "day3_night_stat_crack_3"
    },
    "day3_night_stat_crack_3": {
        glitch: { shatterStatLabel: true, revealDuration: 2000 },
        next: "day3_night_stat_crack_4"
    },
    "day3_night_stat_crack_4": {
        next: "day3_night_stat_crack_5"
    },
    "day3_night_stat_crack_5": {
        next: "day3_night_nightmare"
    },

    // ══════════════════════════════════════
    //  악몽 시퀀스 [글리치: 풀 노이즈 + 화면 흔들림]
    // ══════════════════════════════════════
    "day3_night_nightmare": {
        background: "corridor_dark",
        bgm: "nightmare.mp3",
        character: null,
        glitch: { noise: true, noiseDuration: 500, screenShake: true },
        next: "day3_night_nightmare_2"
    },
    "day3_night_nightmare_2": {
        next: "day3_night_nightmare_3"
    },
    "day3_night_nightmare_3": {
        next: "day3_night_nightmare_4"
    },
    // ??? (세아)
    "day3_night_nightmare_4": {
        character: "sea_yandere",
        glitch: { ghostText: true },
        next: "day3_night_nightmare_5"
    },
    "day3_night_nightmare_5": {
        character: null,
        next: "day3_night_nightmare_6"
    },
    "day3_night_nightmare_6": {
        next: "day3_night_nightmare_7"
    },
    // ??? (은수)
    "day3_night_nightmare_7": {
        character: "eunsu_obsessed",
        glitch: { ghostText: true },
        next: "day3_night_nightmare_8"
    },
    "day3_night_nightmare_8": {
        character: null,
        next: "day3_night_nightmare_9"
    },
    "day3_night_nightmare_9": {
        next: "day3_night_nightmare_10"
    },
    // ??? (리인)
    "day3_night_nightmare_10": {
        character: "riin_dark",
        glitch: { ghostText: true },
        next: "day3_night_nightmare_11"
    },
    "day3_night_nightmare_11": {
        character: null,
        next: "day3_night_nightmare_12"
    },
    "day3_night_nightmare_12": {
        next: "day3_night_nightmare_13"
    },
    "day3_night_nightmare_13": {
        next: "day3_night_nightmare_14"
    },
    "day3_night_nightmare_14": {
        glitch: { heavyGlitch: true, noise: true },
        next: "day3_night_seolhwa"
    },

    // ══════════════════════════════════════
    //  ★ 설화의 경고
    // ══════════════════════════════════════
    "day3_night_seolhwa": {
        background: "corridor_dark",
        bgm: null,
        character: "seolhwa_fading",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day3_night_seolhwa_2"
    },
    "day3_night_seolhwa_2": {
        next: "day3_night_seolhwa_3"
    },
    "day3_night_seolhwa_3": {
        character: "seolhwa_sad",
        typingSpeed: 120,
        unskippable: true,
        next: "day3_night_seolhwa_4"
    },
    "day3_night_seolhwa_4": {
        next: "day3_night_seolhwa_5"
    },
    "day3_night_seolhwa_5": {
        typingSpeed: 150,
        unskippable: true,
        next: "day3_night_seolhwa_6"
    },
    "day3_night_seolhwa_6": {
        next: "day3_night_seolhwa_7"
    },
    "day3_night_seolhwa_7": {
        next: "day3_night_seolhwa_8"
    },
    "day3_night_seolhwa_8": {
        next: "day3_night_seolhwa_9"
    },
    "day3_night_seolhwa_9": {
        glitch: { ghostText: true },
        next: "day3_night_seolhwa_10"
    },
    "day3_night_seolhwa_10": {
        next: "day3_night_seolhwa_11"
    },
    "day3_night_seolhwa_11": {
        next: "day3_night_seolhwa_12"
    },
    "day3_night_seolhwa_12": {
        typingSpeed: 200,
        unskippable: true,
        next: "day3_night_seolhwa_13"
    },
    "day3_night_seolhwa_13": {
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
        next: "day3_night_seolhwa_19"
    },
    "day3_night_seolhwa_19": {
        next: "day3_night_seolhwa_20"
    },
    "day3_night_seolhwa_20": {
        character: "seolhwa_fading",
        glitch: { ghostText: true, silence: true },
        next: "day3_night_seolhwa_21"
    },
    "day3_night_seolhwa_21": {
        next: "day3_night_seolhwa_22"
    },
    "day3_night_seolhwa_22": {
        next: "day3_night_seolhwa_23"
    },
    "day3_night_seolhwa_23": {
        character: null,
        glitch: { heavyGlitch: true },
        next: "day3_night_wakeup"
    },

    // ══════════════════════════════════════
    //  각성
    // ══════════════════════════════════════
    "day3_night_wakeup": {
        background: "home",
        bgm: "tension.mp3",
        character: null,
        next: "day3_night_wakeup_2"
    },
    "day3_night_wakeup_2": {
        next: "day3_night_wakeup_3"
    },
    "day3_night_wakeup_3": {
        next: "day3_night_wakeup_4"
    },
    "day3_night_wakeup_4": {
        next: "day3_night_wakeup_5"
    },
    "day3_night_wakeup_5": {
        next: "day3_night_wakeup_6"
    },
    "day3_night_wakeup_6": {
        next: "day3_night_wakeup_7"
    },
    "day3_night_wakeup_7": {
        next: "day3_night_wakeup_8"
    },
    "day3_night_wakeup_8": {
        next: "day3_night_wakeup_9"
    },
    "day3_night_wakeup_9": {
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
        next: "day3_night_investigate_3"
    },
    "day3_night_investigate_3": {
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
        glitch: { ghostText: "day3_night_ghost_msg", ghostDuration: 1500 },
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
