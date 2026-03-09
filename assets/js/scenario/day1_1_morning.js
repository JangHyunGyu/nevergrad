/**
 * ============================================================================
 * Day 1-1: Morning - 벚꽃 흩날리는 전학 첫날
 * ============================================================================
 * 순수 로맨스 미연시 분위기. 위화감은 2% 이하.
 * - 세아의 "초코우유" 핀 하나
 * - 은수의 "오래간만" 핀 하나
 * - 설화의 존재 인지 (선택적)
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // ===== 오프닝: 벚꽃길 (lines 54-66) =====
    "day1_opening": {
        background: "cherry_blossom",
        bgm: "spring_bright.mp3",
        character: null,
        next: "day1_opening_2"
    },
    "day1_opening_2": {
        next: "day1_opening_3"
    },
    "day1_opening_3": {
        next: "day1_opening_4"
    },
    "day1_opening_4": {
        next: "day1_opening_5"
    },
    "day1_opening_5": {
        next: "day1_opening_6"
    },
    "day1_opening_6": {
        next: "day1_opening_7"
    },

    // ===== 교문 (lines 68-80) =====
    "day1_opening_7": {
        background: "school_gate",
        next: "day1_gate_1"
    },
    "day1_gate_1": {
        next: "day1_gate_2"
    },
    "day1_gate_2": {
        next: "day1_gate_3"
    },
    "day1_gate_3": {
        next: "day1_gate_4"
    },
    "day1_gate_4": {
        next: "day1_gate_5"
    },
    "day1_gate_5": {
        next: "day1_hallway_1"
    },

    // ===== 복도: 세아 첫 만남 (lines 84-136) =====
    "day1_hallway_1": {
        background: "hallway",
        next: "day1_hallway_2"
    },
    "day1_hallway_2": {
        next: "day1_hallway_3"
    },
    "day1_hallway_3": {
        next: "day1_hallway_4"
    },
    "day1_hallway_4": {
        next: "day1_sea_meet_1"
    },
    "day1_sea_meet_1": {
        character: "sea_smile",
        next: "day1_sea_meet_2",
        setFlags: ["met_sea"]
    },
    "day1_sea_meet_2": {
        next: "day1_sea_meet_3"
    },
    "day1_sea_meet_3": {
        next: "day1_sea_meet_4"
    },
    "day1_sea_meet_4": {
        next: "day1_sea_meet_5",
        stats: { sea: { affinity: 5 } }
    },
    "day1_sea_meet_5": {
        next: "day1_sea_meet_6"
    },
    "day1_sea_meet_6": {
        next: "day1_sea_meet_7"
    },
    "day1_sea_meet_7": {
        next: "day1_sea_meet_8"
    },
    "day1_sea_meet_8": {
        next: "day1_sea_meet_9"
    },
    "day1_sea_meet_9": {
        next: "day1_sea_meet_10"
    },
    "day1_sea_meet_10": {
        next: "day1_sea_meet_11"
    },
    "day1_sea_meet_11": {
        next: "day1_sea_meet_12"
    },
    "day1_sea_meet_12": {
        next: "day1_sea_meet_13"
    },
    "day1_sea_meet_13": {
        next: "day1_sea_meet_14"
    },
    "day1_sea_meet_14": {
        next: "day1_sea_meet_15"
    },
    "day1_sea_meet_15": {
        next: "day1_sea_meet_16"
    },
    "day1_sea_meet_16": {
        next: "day1_sea_meet_17"
    },
    "day1_sea_meet_17": {
        next: "day1_sea_meet_18"
    },
    "day1_sea_meet_18": {
        next: "day1_sea_meet_19"
    },
    "day1_sea_meet_19": {
        next: "day1_choco_1"
    },

    // ===== 초코우유 이벤트 (lines 140-189) =====
    "day1_choco_1": {
        next: "day1_choco_2"
    },
    "day1_choco_2": {
        next: "day1_choco_3"
    },
    "day1_choco_3": {
        next: "day1_choco_4"
    },
    "day1_choco_4": {
        next: "day1_choco_5"
    },
    "day1_choco_5": {
        next: "day1_choco_6"
    },
    "day1_choco_6": {
        next: "day1_choco_7"
    },
    "day1_choco_7": {
        next: "day1_choco_8"
    },
    "day1_choco_8": {
        next: "day1_choco_9"
    },
    "day1_choco_9": {
        next: "day1_choco_choice"
    },
    "day1_choco_choice": {
        choices: [
            {
                next: "day1_choco_accept_1",
                stats: { sea: { affinity: 3, danger: 2 } },
                setFlags: ["accepted_choco"]
            },
            {
                next: "day1_choco_question_1",
                stats: { sea: { affinity: -1, danger: 3 } },
                setFlags: ["questioned_sea", "sea_choco_milk"]
            },
            {
                next: "day1_choco_joke_1",
                stats: { sea: { affinity: 5, danger: 1 } },
                setFlags: ["joked_choco"]
            }
        ]
    },

    // --- 선택 1: 자연스럽게 받기 ---
    "day1_choco_accept_1": {
        next: "day1_choco_accept_2"
    },
    "day1_choco_accept_2": {
        next: "day1_choco_accept_3"
    },
    "day1_choco_accept_3": {
        character: "sea_smile",
        next: "day1_choco_accept_4"
    },
    "day1_choco_accept_4": {
        next: "day1_classroom_1"
    },

    // --- 선택 2: 의문 제기 ---
    "day1_choco_question_1": {
        next: "day1_choco_question_2"
    },
    "day1_choco_question_2": {
        character: "sea_shy",
        next: "day1_choco_question_3"
    },
    "day1_choco_question_3": {
        next: "day1_choco_question_4"
    },
    "day1_choco_question_4": {
        next: "day1_choco_question_5"
    },
    "day1_choco_question_5": {
        character: "sea_smile",
        next: "day1_choco_question_6"
    },
    "day1_choco_question_6": {
        next: "day1_classroom_1"
    },

    // --- 선택 3: 농담 ---
    "day1_choco_joke_1": {
        next: "day1_choco_joke_2"
    },
    "day1_choco_joke_2": {
        character: "sea_smile",
        next: "day1_choco_joke_3"
    },
    "day1_choco_joke_3": {
        next: "day1_choco_joke_4"
    },
    "day1_choco_joke_4": {
        next: "day1_classroom_1"
    },

    // ===== 교실 입장 & 은수 선생님 (lines 192-251) =====
    "day1_classroom_1": {
        background: "classroom",
        character: null,
        next: "day1_classroom_2"
    },
    "day1_classroom_2": {
        character: "sea_smile",
        next: "day1_classroom_3"
    },
    "day1_classroom_3": {
        character: null,
        next: "day1_classroom_4"
    },
    "day1_classroom_4": {
        next: "day1_classroom_5"
    },
    "day1_classroom_5": {
        character: "sea_smile",
        next: "day1_classroom_6"
    },
    "day1_classroom_6": {
        character: null,
        next: "day1_classroom_7"
    },
    "day1_classroom_7": {
        next: "day1_classroom_8"
    },
    "day1_classroom_8": {
        next: "day1_classroom_9"
    },
    "day1_classroom_9": {
        next: "day1_classroom_10"
    },
    "day1_classroom_10": {
        next: "day1_classroom_11"
    },
    "day1_classroom_11": {
        next: "day1_classroom_12"
    },
    "day1_classroom_12": {
        next: "day1_eunsu_1"
    },
    "day1_eunsu_1": {
        next: "day1_eunsu_2"
    },
    "day1_eunsu_2": {
        character: "eunsu_smile",
        next: "day1_eunsu_3",
        setFlags: ["met_eunsu"]
    },
    "day1_eunsu_3": {
        next: "day1_eunsu_4"
    },
    "day1_eunsu_4": {
        next: "day1_eunsu_5"
    },
    "day1_eunsu_5": {
        next: "day1_eunsu_6",
        // "전학생은 정말 오래간만" — 미세 위화감 핀
        stats: { eunsu: { danger: 5 } }
    },
    "day1_eunsu_6": {
        character: null,
        next: "day1_eunsu_7"
    },
    "day1_eunsu_7": {
        character: "eunsu_smile",
        next: "day1_eunsu_8"
    },
    "day1_eunsu_8": {
        character: null,
        next: "day1_eunsu_9"
    },
    "day1_eunsu_9": {
        character: "eunsu_smile",
        next: "day1_eunsu_10"
    },
    "day1_eunsu_10": {
        character: null,
        next: "day1_eunsu_11"
    },
    "day1_eunsu_11": {
        next: "day1_eunsu_12"
    },
    "day1_eunsu_12": {
        character: "eunsu_smile",
        next: "day1_eunsu_13"
    },
    "day1_eunsu_13": {
        character: null,
        next: "day1_eunsu_14"
    },
    "day1_eunsu_14": {
        next: "day1_eunsu_15"
    },

    // ===== 오전 수업 (lines 253-266) =====
    "day1_eunsu_15": {
        character: "eunsu_smile",
        next: "day1_class_1"
    },
    "day1_class_1": {
        character: null,
        next: "day1_class_2"
    },
    "day1_class_2": {
        next: "day1_class_3"
    },
    "day1_class_3": {
        character: "eunsu_smile",
        next: "day1_class_4"
    },
    "day1_class_4": {
        character: null,
        next: "day1_class_5"
    },
    "day1_class_5": {
        character: "eunsu_smile",
        next: "day1_class_6"
    },
    "day1_class_6": {
        character: null,
        next: "day1_class_7"
    },
    "day1_class_7": {
        next: "day1_break_1"
    },

    // ===== 쉬는 시간 & 세아 대화 (lines 267-287) =====
    "day1_break_1": {
        next: "day1_break_2"
    },
    "day1_break_2": {
        next: "day1_break_3"
    },
    "day1_break_3": {
        next: "day1_break_4"
    },
    "day1_break_4": {
        next: "day1_break_5"
    },
    "day1_break_5": {
        next: "day1_break_6"
    },
    "day1_break_6": {
        next: "day1_break_7"
    },
    "day1_break_7": {
        next: "day1_break_8"
    },
    "day1_break_8": {
        character: "sea_smile",
        next: "day1_break_9"
    },
    "day1_break_9": {
        next: "day1_seolhwa_1"
    },

    // ===== 설화 첫 인지 (lines 289-334) =====
    "day1_seolhwa_1": {
        next: "day1_seolhwa_2"
    },
    "day1_seolhwa_2": {
        next: "day1_seolhwa_3"
    },
    "day1_seolhwa_3": {
        next: "day1_seolhwa_4"
    },
    "day1_seolhwa_4": {
        character: null,
        next: "day1_seolhwa_5"
    },
    "day1_seolhwa_5": {
        next: "day1_seolhwa_6"
    },
    "day1_seolhwa_6": {
        character: "seolhwa_normal",
        next: "day1_seolhwa_choice"
    },
    "day1_seolhwa_choice": {
        choices: [
            {
                next: "day1_seolhwa_greet_1",
                setFlags: ["greeted_seolhwa", "met_seolhwa"],
                stats: { seolhwa: { trust: 5, affinity: 3 } }
            },
            {
                next: "day1_seolhwa_skip"
            }
        ]
    },

    // --- 선택 1: 인사한다 ---
    "day1_seolhwa_greet_1": {
        next: "day1_seolhwa_greet_2"
    },
    "day1_seolhwa_greet_2": {
        next: "day1_seolhwa_greet_3"
    },
    "day1_seolhwa_greet_3": {
        next: "day1_seolhwa_greet_4"
    },
    "day1_seolhwa_greet_4": {
        next: "day1_seolhwa_greet_5"
    },
    "day1_seolhwa_greet_5": {
        next: "day1_seolhwa_greet_6"
    },
    "day1_seolhwa_greet_6": {
        next: "day1_seolhwa_greet_7"
    },
    "day1_seolhwa_greet_7": {
        next: "day1_seolhwa_greet_8"
    },
    "day1_seolhwa_greet_8": {
        next: "day1_seolhwa_greet_9"
    },
    "day1_seolhwa_greet_9": {
        next: "day1_seolhwa_greet_10"
    },
    "day1_seolhwa_greet_10": {
        next: "day1_seolhwa_greet_11"
    },
    "day1_seolhwa_greet_11": {
        next: "day1_seolhwa_greet_12"
    },
    "day1_seolhwa_greet_12": {
        next: "day1_seolhwa_greet_13"
    },
    "day1_seolhwa_greet_13": {
        next: "day1_seolhwa_greet_14"
    },
    "day1_seolhwa_greet_14": {
        next: "day1_seolhwa_greet_15"
    },
    "day1_seolhwa_greet_15": {
        next: "day1_morning_end"
    },

    // --- 선택 2: 수업에 집중 ---
    "day1_seolhwa_skip": {
        character: null,
        next: "day1_morning_end"
    },

    // ===== 아침 파트 종료 → 점심으로 =====
    "day1_morning_end": {
        background: "classroom",
        character: null,
        changeSlot: "lunch",
        next: "day1_lunch_start"
    }
});
