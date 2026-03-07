/**
 * Day 4-1: Morning - 스릴러 페이즈 돌입
 * 위화감 70%. UI 완전 전환. 타이머 선택지 등장.
 * 학교 분위기 급변, 감시 강화, 유나 부재.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    "day4_morning_start": {
        background: "room_morning",
        bgm: "tension.mp3",
        character: null,
        // Day 4부터 THRILLER 모드
        setMode: "THRILLER",
        next: "day4_morning_start_2"
    },
    "day4_morning_start_2": {
        next: "day4_morning_start_3"
    },
    "day4_morning_start_3": {
        next: "day4_morning_gate"
    },

    // ── 등교 - 학교 분위기 급변 ──
    "day4_morning_gate": {
        background: "school_gate",
        character: null,
        next: "day4_morning_gate_2"
    },
    "day4_morning_gate_2": {
        next: "day4_morning_gate_3"
    },
    "day4_morning_gate_3": {
        // 은수가 정문에서 기다림
        character: "eunsu_gentle",
        next: "day4_morning_eunsu"
    },
    "day4_morning_eunsu": {
        next: "day4_morning_eunsu_2"
    },
    "day4_morning_eunsu_2": {
        // 타이머 선택지
        timedChoice: 8000,
        choices: [
            {
                next: "day4_morning_eunsu_comply"
            },
            {
                next: "day4_morning_eunsu_refuse",
                stats: { eunsu: { danger: 10 } }
            }
        ],
        timeoutNext: "day4_morning_eunsu_comply"
    },
    "day4_morning_eunsu_comply": {
        character: "eunsu_smile",
        next: "day4_morning_classroom",
        stats: { eunsu: { affinity: 5, danger: 5 } }
    },
    "day4_morning_eunsu_refuse": {
        character: "eunsu_cold",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day4_morning_eunsu_refuse_2"
    },
    "day4_morning_eunsu_refuse_2": {
        character: "eunsu_gentle",
        next: "day4_morning_classroom"
    },

    // ── 교실 - 유나 결석 ──
    "day4_morning_classroom": {
        background: "classroom",
        character: null,
        next: "day4_morning_classroom_2"
    },
    "day4_morning_classroom_2": {
        next: "day4_morning_classroom_3"
    },
    "day4_morning_classroom_3": {
        // 세아가 다가옴
        character: "sea_smile",
        next: "day4_morning_sea"
    },
    "day4_morning_sea": {
        next: "day4_morning_sea_2"
    },
    "day4_morning_sea_2": {
        character: "sea_serious",
        next: "day4_morning_sea_3"
    },
    "day4_morning_sea_3": {
        character: "sea_smile",
        glitch: { expressionFlash: "sea_yandere", flashDuration: 150 },
        next: "day4_morning_class_start"
    },

    // ── 수업 - 은수의 이상한 수업 ──
    "day4_morning_class_start": {
        character: "eunsu_gentle",
        next: "day4_morning_class_2"
    },
    "day4_morning_class_2": {
        next: "day4_morning_class_3"
    },
    "day4_morning_class_3": {
        glitch: { corruptText: true, corruptIndices: [3, 7, 12] },
        next: "day4_morning_class_4"
    },
    "day4_morning_class_4": {
        next: "day4_morning_end"
    },

    "day4_morning_end": {
        character: null,
        next: null
    }
});
