/**
 * Day 4-1: Morning - 감시 극대화 (스릴러 모드 돌입)
 * BGM: tension.mp3. 공포 분위기.
 * 자취방 → 정문(은수 대기, 타이머 8초) → 유나 빈 자리 → 은수 수업('소속')
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    // ── 자취방: 공포 분위기, 안전앱 위치추적 인지 ──
    "day4_morning_start": {
        background: "room_morning",
        bgm: "tension.mp3",
        character: null,
        setMode: "THRILLER",
        next: "day4_morning_start_2"
    },
    "day4_morning_start_2": {
        next: "day4_morning_start_3"
    },
    "day4_morning_start_3": {
        next: "day4_morning_start_4"
    },
    "day4_morning_start_4": {
        next: "day4_morning_start_5"
    },
    "day4_morning_start_5": {
        next: "day4_morning_start_6"
    },
    "day4_morning_start_6": {
        next: "day4_morning_start_7"
    },
    "day4_morning_start_7": {
        // 안전앱 위치추적 인지
        next: "day4_morning_start_8"
    },
    "day4_morning_start_8": {
        next: "day4_morning_start_9"
    },
    "day4_morning_start_9": {
        next: "day4_morning_commute"
    },

    // ── 통학로 ──
    "day4_morning_commute": {
        background: "corridor",
        character: null,
        next: "day4_morning_commute_2"
    },
    "day4_morning_commute_2": {
        next: "day4_morning_commute_3"
    },
    "day4_morning_commute_3": {
        next: "day4_morning_gate"
    },

    // ── 정문: 모두가 같은 미소, 은수 대기 ──
    "day4_morning_gate": {
        background: "school_gate",
        character: null,
        next: "day4_morning_gate_2"
    },
    "day4_morning_gate_2": {
        glitch: { noise: true, noiseDuration: 150 },
        next: "day4_morning_gate_3"
    },
    "day4_morning_gate_3": {
        next: "day4_morning_gate_4"
    },
    "day4_morning_gate_4": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_morning_gate_5"
    },
    "day4_morning_gate_5": {
        next: "day4_morning_gate_6"
    },
    "day4_morning_gate_6": {
        // 은수가 정문에서 기다림
        character: "eunsu_gentle",
        next: "day4_morning_eunsu"
    },
    "day4_morning_eunsu": {
        next: "day4_morning_eunsu_2"
    },
    "day4_morning_eunsu_2": {
        next: "day4_morning_eunsu_3"
    },
    "day4_morning_eunsu_3": {
        next: "day4_morning_eunsu_4"
    },
    "day4_morning_eunsu_4": {
        // 타이머 선택지 8초: 손잡기/거절
        timedChoice: 8000,
        choices: [
            {
                next: "day4_morning_eunsu_comply",
                stats: { eunsu: { affinity: 5, danger: 5 } }
            },
            {
                next: "day4_morning_eunsu_refuse",
                stats: { eunsu: { danger: 10 } }
            }
        ],
        timeoutNext: "day4_morning_eunsu_comply"
    },

    // 선택1: 손을 잡는다
    "day4_morning_eunsu_comply": {
        character: "eunsu_smile",
        next: "day4_morning_eunsu_comply_2"
    },
    "day4_morning_eunsu_comply_2": {
        next: "day4_morning_eunsu_comply_3"
    },
    "day4_morning_eunsu_comply_3": {
        next: "day4_morning_classroom"
    },

    // 선택2: 괜찮다고 한다
    "day4_morning_eunsu_refuse": {
        character: null,
        next: "day4_morning_eunsu_refuse_2"
    },
    "day4_morning_eunsu_refuse_2": {
        character: "eunsu_cold",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day4_morning_eunsu_refuse_3"
    },
    "day4_morning_eunsu_refuse_3": {
        next: "day4_morning_eunsu_refuse_4"
    },
    "day4_morning_eunsu_refuse_4": {
        character: "eunsu_gentle",
        next: "day4_morning_classroom"
    },

    // ── 교실: 유나의 빈 자리 ──
    "day4_morning_classroom": {
        background: "classroom",
        character: null,
        next: "day4_morning_classroom_2"
    },
    "day4_morning_classroom_2": {
        next: "day4_morning_classroom_3"
    },
    "day4_morning_classroom_3": {
        next: "day4_morning_classroom_4"
    },
    "day4_morning_classroom_4": {
        glitch: { silence: true, silenceDuration: 1500 },
        next: "day4_morning_classroom_5"
    },
    "day4_morning_classroom_5": {
        // 세아가 다가옴
        character: "sea_smile",
        next: "day4_morning_sea"
    },
    "day4_morning_sea": {
        next: "day4_morning_sea_2"
    },
    "day4_morning_sea_2": {
        next: "day4_morning_sea_3"
    },
    "day4_morning_sea_3": {
        next: "day4_morning_sea_4"
    },
    "day4_morning_sea_4": {
        character: "sea_serious",
        next: "day4_morning_sea_5"
    },
    "day4_morning_sea_5": {
        character: "sea_smile",
        glitch: { expressionFlash: "sea_yandere", flashDuration: 150 },
        next: "day4_morning_sea_6"
    },
    "day4_morning_sea_6": {
        character: null,
        next: "day4_morning_class_start"
    },

    // ── 은수의 이상한 수업: '소속' ──
    "day4_morning_class_start": {
        character: "eunsu_gentle",
        next: "day4_morning_class_2"
    },
    "day4_morning_class_2": {
        next: "day4_morning_class_3"
    },
    "day4_morning_class_3": {
        next: "day4_morning_class_4"
    },
    "day4_morning_class_4": {
        next: "day4_morning_class_5"
    },
    "day4_morning_class_5": {
        // 은수가 주인공을 지목
        unskippable: true,
        next: "day4_morning_class_6"
    },
    "day4_morning_class_6": {
        unskippable: true,
        glitch: { corruptText: true, corruptIndices: [3, 7, 12] },
        next: "day4_morning_class_7"
    },
    "day4_morning_class_7": {
        // 30쌍의 눈
        unskippable: true,
        next: "day4_morning_class_8"
    },
    "day4_morning_class_8": {
        character: null,
        next: "day4_morning_class_9"
    },
    "day4_morning_class_9": {
        next: "day4_morning_end"
    },

    "day4_morning_end": {
        character: null,
        changeSlot: "lunch",
        next: "day4_lunch_start"
    }
});
