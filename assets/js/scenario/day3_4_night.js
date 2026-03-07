/**
 * Day 3-4: Night - ★ GENRE SHIFT ★
 * 위화감 50-60%. UI 테마 전환 시작. 호감도→위험도 라벨 크랙.
 * 악몽 시퀀스 + 메모리카드 내용 회상 + 설화 등장.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    // ── 자기방 - 밤 ──
    "day3_night_start": {
        background: "room_night",
        bgm: "night_ambient.mp3",
        character: null,
        next: "day3_night_phone"
    },
    "day3_night_phone": {
        next: "day3_night_phone_2"
    },
    "day3_night_phone_2": {
        next: "day3_night_phone_3"
    },
    "day3_night_phone_3": {
        // 세아의 메시지 - 점점 집착적
        next: "day3_night_phone_4"
    },
    "day3_night_phone_4": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day3_night_recall"
    },

    // ── 오늘 있었던 일 회상 ──
    "day3_night_recall": {
        next: "day3_night_recall_2"
    },
    "day3_night_recall_2": {
        next: "day3_night_recall_3"
    },
    "day3_night_recall_3": {
        // ★ THEME SHIFT 시작: CSS 변수 전환
        glitch: { shiftTheme: "transition", shiftDuration: 3000 },
        next: "day3_night_recall_4"
    },
    "day3_night_recall_4": {
        next: "day3_night_stat_crack"
    },

    // ── ★ 스탯 라벨 크랙 이벤트 ──
    "day3_night_stat_crack": {
        // ★ GLITCH LEVEL 3: 호감도 라벨이 깨지며 '위험도'가 순간 보임
        glitch: { shatterStatLabel: true, revealDuration: 2000 },
        next: "day3_night_stat_crack_2"
    },
    "day3_night_stat_crack_2": {
        next: "day3_night_nightmare"
    },

    // ── 악몽 시퀀스 ──
    "day3_night_nightmare": {
        background: "school_dark",
        bgm: "nightmare.mp3",
        character: null,
        glitch: { noise: true, noiseDuration: 500, screenShake: true },
        next: "day3_night_nightmare_2"
    },
    "day3_night_nightmare_2": {
        next: "day3_night_nightmare_3"
    },
    "day3_night_nightmare_3": {
        // 세아의 얼굴이 순간 어두운 표정으로 플래시
        character: "sea_dark",
        glitch: { expressionFlash: "sea_yandere", flashDuration: 200 },
        next: "day3_night_nightmare_4"
    },
    "day3_night_nightmare_4": {
        character: null,
        next: "day3_night_nightmare_5"
    },
    "day3_night_nightmare_5": {
        // 은수의 목소리
        character: "eunsu_dark",
        glitch: { expressionFlash: "eunsu_obsessed", flashDuration: 200 },
        next: "day3_night_nightmare_6"
    },
    "day3_night_nightmare_6": {
        character: null,
        next: "day3_night_nightmare_7"
    },
    "day3_night_nightmare_7": {
        // 리인의 실루엣
        character: "riin_dark",
        next: "day3_night_nightmare_8"
    },
    "day3_night_nightmare_8": {
        character: null,
        glitch: { heavyGlitch: true, glitchDuration: 1000 },
        next: "day3_night_seolhwa"
    },

    // ── ★ 설화 등장 ──
    "day3_night_seolhwa": {
        background: "school_dark",
        bgm: null,
        character: "seolhwa_ghost",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day3_night_seolhwa_2"
    },
    "day3_night_seolhwa_2": {
        next: "day3_night_seolhwa_3"
    },
    "day3_night_seolhwa_3": {
        next: "day3_night_seolhwa_4"
    },
    "day3_night_seolhwa_4": {
        glitch: { heavyGlitch: true, glitchDuration: 500 },
        character: null,
        next: "day3_night_wakeup"
    },

    // ── 각성 ──
    "day3_night_wakeup": {
        background: "room_night",
        bgm: "tension.mp3",
        character: null,
        next: "day3_night_wakeup_2"
    },
    "day3_night_wakeup_2": {
        next: "day3_night_wakeup_3"
    },
    "day3_night_wakeup_3": {
        next: "day3_night_choice"
    },
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
    "day3_night_investigate": {
        next: "day3_night_investigate_2",
        stats: { yuna: { trust: 5 } }
    },
    "day3_night_investigate_2": {
        next: "day3_night_end"
    },
    "day3_night_deny": {
        next: "day3_night_deny_2"
    },
    "day3_night_deny_2": {
        glitch: { ghostText: "day3_night_ghost_msg", ghostDuration: 1500 },
        next: "day3_night_end"
    },

    // ── Day 3 종료 ──
    "day3_night_end": {
        background: "room_night",
        bgm: null,
        character: null,
        // ★ GENRE SHIFT 트리거
        triggerGenreShift: true,
        next: null
    }
});
