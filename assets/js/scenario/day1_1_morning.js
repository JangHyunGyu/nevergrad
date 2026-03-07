/**
 * ============================================================================
 * Day 1-1: Morning - 벚꽃 흩날리는 전학 첫날
 * ============================================================================
 * 순수 로맨스 미연시 분위기. 위화감은 2% 이하.
 * - 세아의 "초코우유" 핀 하나
 * - 은수의 "드디어" 실언 하나
 * - 설화의 존재 인지 (선택적)
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 오프닝: 벚꽃 =====
    "day1_opening": {
        background: "cherry_blossom",
        bgm: "spring_bright.mp3",
        character: null,
        next: "day1_opening_2"
    },
    "day1_opening_2": {
        background: "school_gate",
        next: "day1_opening_3"
    },
    "day1_opening_3": {
        background: "school_gate",
        next: "day1_hallway_1"
    },

    // ===== 복도에서 세아 등장 =====
    "day1_hallway_1": {
        background: "hallway",
        next: "day1_sea_first"
    },
    "day1_sea_first": {
        background: "hallway",
        character: "sea_smile",
        next: "day1_sea_first_2"
    },
    "day1_sea_first_2": {
        next: "day1_sea_first_3"
    },
    "day1_sea_first_3": {
        next: "day1_sea_first_4",
        setFlags: ["met_sea"],
        stats: { sea: { affinity: 5 } }
    },
    "day1_sea_first_4": {
        next: "day1_sea_choco"
    },

    // ===== 초코우유 이벤트 (위화감 핀 #1) =====
    "day1_sea_choco": {
        character: "sea_smile",
        next: "day1_sea_choco_2"
    },
    "day1_sea_choco_2": {
        character: null,
        next: "day1_sea_choco_choice"
    },
    "day1_sea_choco_choice": {
        choices: [
            {
                next: "day1_sea_choco_accept",
                stats: { sea: { affinity: 3, danger: 2 } },
                setFlags: ["accepted_choco"]
            },
            {
                next: "day1_sea_choco_question",
                stats: { sea: { affinity: -1, danger: 3 } },
                setFlags: ["questioned_sea", "sea_choco_milk"]
            },
            {
                next: "day1_sea_choco_joke",
                stats: { sea: { affinity: 5, danger: 1 } },
                setFlags: ["joked_choco"]
            }
        ]
    },
    "day1_sea_choco_accept": {
        character: "sea_smile",
        next: "day1_classroom_enter"
    },
    "day1_sea_choco_question": {
        character: "sea_shy",
        next: "day1_sea_choco_question_2"
    },
    "day1_sea_choco_question_2": {
        next: "day1_classroom_enter"
    },
    "day1_sea_choco_joke": {
        character: "sea_shy",
        next: "day1_classroom_enter"
    },

    // ===== 교실 입장 =====
    "day1_classroom_enter": {
        background: "classroom",
        character: null,
        next: "day1_classroom_enter_2"
    },
    "day1_classroom_enter_2": {
        next: "day1_classroom_enter_3"
    },
    "day1_classroom_enter_3": {
        next: "day1_eunsu_enter"
    },

    // ===== 담임 박은수 등장 (위화감 핀 #2) =====
    "day1_eunsu_enter": {
        next: "day1_eunsu_first"
    },
    "day1_eunsu_first": {
        character: "eunsu_smile",
        next: "day1_eunsu_first_2",
        setFlags: ["met_eunsu"]
    },
    "day1_eunsu_first_2": {
        next: "day1_eunsu_first_3"
    },
    "day1_eunsu_first_3": {
        character: null,
        next: "day1_eunsu_first_4"
    },
    "day1_eunsu_first_4": {
        character: "eunsu_smile",
        next: "day1_eunsu_first_5",
        // "드디어 왔구나" — 위화감 핀. 은수의 danger 은밀히 상승
        stats: { eunsu: { danger: 5 } }
    },
    "day1_eunsu_first_5": {
        character: null,
        next: "day1_eunsu_first_6"
    },
    "day1_eunsu_first_6": {
        character: "eunsu_shy",
        next: "day1_eunsu_first_7"
    },
    "day1_eunsu_first_7": {
        next: "day1_seat_guide"
    },

    // ===== 자리 배정 & 설화 첫 인지 =====
    "day1_seat_guide": {
        character: "eunsu_smile",
        next: "day1_seolhwa_notice"
    },
    "day1_seolhwa_notice": {
        character: null,
        next: "day1_seolhwa_notice_2"
    },
    "day1_seolhwa_notice_2": {
        character: "seolhwa_normal",
        next: "day1_seolhwa_notice_3"
    },
    "day1_seolhwa_notice_3": {
        next: "day1_seolhwa_greet_choice"
    },
    "day1_seolhwa_greet_choice": {
        choices: [
            {
                next: "day1_seolhwa_greet",
                setFlags: ["greeted_seolhwa", "met_seolhwa"],
                stats: { seolhwa: { trust: 5, affinity: 3 } }
            },
            {
                next: "day1_seolhwa_skip"
            }
        ]
    },
    "day1_seolhwa_greet": {
        next: "day1_seolhwa_greet_2"
    },
    "day1_seolhwa_greet_2": {
        character: "seolhwa_normal",
        next: "day1_seolhwa_greet_3"
    },
    "day1_seolhwa_greet_3": {
        character: null,
        next: "day1_seolhwa_greet_4"
    },
    "day1_seolhwa_greet_4": {
        next: "day1_seolhwa_greet_5"
    },
    "day1_seolhwa_greet_5": {
        next: "day1_seolhwa_greet_6"
    },
    "day1_seolhwa_greet_6": {
        // "거기 빈자린데?" — 설화가 보이지 않는다
        next: "day1_seolhwa_greet_7"
    },
    "day1_seolhwa_greet_7": {
        next: "day1_seolhwa_greet_8"
    },
    "day1_seolhwa_greet_8": {
        character: "seolhwa_normal",
        next: "day1_seolhwa_greet_9"
    },
    "day1_seolhwa_greet_9": {
        next: "day1_seolhwa_greet_10"
    },
    "day1_seolhwa_greet_10": {
        // 주인공이 스스로 합리화 — 아직은 미연시 톤 유지
        next: "day1_morning_end"
    },
    "day1_seolhwa_skip": {
        next: "day1_morning_end"
    },

    // ===== 아침 파트 종료 → 점심으로 =====
    "day1_morning_end": {
        background: "classroom",
        character: null,
        next: null // day1_2_lunch.js의 첫 씬으로 연결
    }
});
