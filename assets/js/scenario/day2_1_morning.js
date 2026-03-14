/**
 * ============================================================================
 * Day 2-1: Morning - 달콤한 익숙함
 * ============================================================================
 * 로맨스 95%, 위화감 8~12%. 세아의 밀착, 은수의 관심 강화.
 * - 기상: 그룹방 '읽음 3', 민수 답 없음, 세아 새벽 1시 메시지
 * - 교문: 세아가 기다림, 라면/도시락 대화, "너니까 이러는 거지"
 * - 데자뷔 핀 #4: 자판기 위치를 이미 알고 있음
 * - 교실: 은수 출석, 설화 이름 안 불림, 이전 학교 서류 질문
 * - 오전 수업: 국어 조별 발표 '좋아하는 장소'
 * - 데자뷔 핀 #5: 은수의 차가운 손, 기억 누출
 * - 설화 관찰: 시선을 돌리지 않는다
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    // ===== Day 2 아침 진입점 (day1_night_end에서 연결) =====
    "day2_morning_start": {
        background: "room_morning",
        bgm: "morning_bright.mp3",
        character: null,
        next: "day2_morning_wakeup_1"
    },

    // ===== 자취방: 기상 =====
    "day2_morning_wakeup_1": {
        background: "room_morning",
        bgm: "morning_bright.mp3",
        character: null,
        next: "day2_morning_wakeup_2"
    },
    "day2_morning_wakeup_2": {
        next: "day2_morning_wakeup_3"
    },
    "day2_morning_wakeup_3": {
        next: "day2_morning_wakeup_4"
    },
    "day2_morning_wakeup_4": {
        next: "day2_morning_wakeup_5"
    },
    "day2_morning_wakeup_5": {
        next: "day2_morning_wakeup_6"
    },
    "day2_morning_wakeup_6": {
        next: "day2_morning_wakeup_7"
    },

    // ===== 교문: 세아와 등교 =====
    "day2_morning_wakeup_7": {
        background: "school_gate",
        character: null,
        next: "day2_morning_gate_1"
    },
    "day2_morning_gate_1": {
        character: "sea_smile",
        next: "day2_morning_gate_2"
    },
    "day2_morning_gate_2": {
        next: "day2_morning_gate_3"
    },
    "day2_morning_gate_3": {
        next: "day2_morning_gate_4"
    },
    "day2_morning_gate_4": {
        next: "day2_morning_gate_5"
    },

    // ===== 등교길 — 세아와 수다 =====
    "day2_morning_gate_5": {
        next: "day2_morning_walk_1"
    },
    "day2_morning_walk_1": {
        next: "day2_morning_walk_2"
    },
    "day2_morning_walk_2": {
        next: "day2_morning_walk_3"
    },
    "day2_morning_walk_3": {
        next: "day2_morning_walk_4"
    },
    "day2_morning_walk_4": {
        next: "day2_morning_walk_5"
    },
    "day2_morning_walk_5": {
        next: "day2_morning_walk_6"
    },
    "day2_morning_walk_6": {
        next: "day2_morning_walk_7",
        stats: { sea: { affinity: 3 } }
    },
    "day2_morning_walk_7": {
        character: "sea_smile",
        next: "day2_morning_walk_8"
    },
    "day2_morning_walk_8": {
        next: "day2_morning_walk_9"
    },
    "day2_morning_walk_9": {
        character: "sea_smile",
        next: "day2_morning_walk_10"
    },
    "day2_morning_walk_10": {
        next: "day2_morning_walk_11"
    },
    "day2_morning_walk_11": {
        next: "day2_morning_walk_12"
    },
    "day2_morning_walk_12": {
        next: "day2_morning_walk_13"
    },
    "day2_morning_walk_13": {
        character: "sea_smile",
        next: "day2_morning_walk_14"
    },
    "day2_morning_walk_14": {
        character: null,
        next: "day2_morning_walk_15"
    },
    "day2_morning_walk_15": {
        next: "day2_morning_walk_16"
    },
    "day2_morning_walk_16": {
        character: "sea_smile",
        next: "day2_morning_walk_17",
        stats: { sea: { affinity: 2 } }
    },

    // ===== 데자뷔 핀 #4 — 자판기 =====
    "day2_morning_walk_17": {
        background: "hallway",
        character: null,
        next: "day2_morning_deja4_1"
    },
    "day2_morning_deja4_1": {
        next: "day2_morning_deja4_2"
    },
    "day2_morning_deja4_2": {
        next: "day2_morning_deja4_3"
    },
    "day2_morning_deja4_3": {
        next: "day2_morning_deja4_4"
    },
    "day2_morning_deja4_4": {
        character: "sea_smile",
        next: "day2_morning_deja4_5"
    },
    "day2_morning_deja4_5": {
        character: null,
        next: "day2_morning_deja4_6",
        stats: { dejavu: 1, sea: { danger: 2 } },
        glitch: { type: "flicker", duration: 300 }
    },
    "day2_morning_deja4_6": {
        next: "day2_morning_class_1"
    },

    // ===== 세아 반응 (아직 복도) =====
    "day2_morning_class_1": {
        character: "sea_smile",
        next: "day2_morning_class_2"
    },
    "day2_morning_class_2": {
        character: null,
        next: "day2_morning_class_3"
    },

    // ===== 교실 — 출석 & 설화 =====
    "day2_morning_class_3": {
        background: "classroom",
        next: "day2_morning_class_4"
    },
    "day2_morning_class_4": {
        character: "eunsu_normal",
        next: "day2_morning_class_5",
        stats: { eunsu: { danger: 3 } }
    },
    "day2_morning_class_5": {
        next: "day2_morning_class_6"
    },
    "day2_morning_class_6": {
        next: "day2_morning_class_7"
    },

    // ===== 오전 수업 — 조별 발표 =====
    "day2_morning_class_7": {
        character: null,
        next: "day2_morning_pres_1"
    },
    "day2_morning_pres_1": {
        next: "day2_morning_pres_2"
    },
    "day2_morning_pres_2": {
        character: null,
        next: "day2_morning_pres_3"
    },
    "day2_morning_pres_3": {
        character: "eunsu_warm",
        next: "day2_morning_pres_4"
    },
    "day2_morning_pres_4": {
        character: null,
        next: "day2_morning_pres_5"
    },
    "day2_morning_pres_5": {
        character: "sea_smile",
        next: "day2_morning_pres_6"
    },
    "day2_morning_pres_6": {
        character: null,
        next: "day2_morning_pres_7"
    },
    "day2_morning_pres_7": {
        character: null,
        next: "day2_morning_pres_8"
    },
    "day2_morning_pres_8": {
        character: "sea_smile",
        next: "day2_morning_pres_9"
    },
    "day2_morning_pres_9": {
        next: "day2_morning_pres_10"
    },
    "day2_morning_pres_10": {
        next: "day2_morning_pres_11"
    },
    "day2_morning_pres_11": {
        character: null,
        next: "day2_morning_pres_12"
    },
    "day2_morning_pres_12": {
        next: "day2_morning_deja5_1",
        stats: { sea: { affinity: 2 } }
    },

    // ===== 데자뷔 핀 #5 — 은수의 체온 =====
    "day2_morning_deja5_1": {
        character: "eunsu_warm",
        next: "day2_morning_deja5_2"
    },
    "day2_morning_deja5_2": {
        next: "day2_morning_deja5_3"
    },
    "day2_morning_deja5_3": {
        character: null,
        next: "day2_morning_deja5_4"
    },
    "day2_morning_deja5_4": {
        next: "day2_morning_deja5_5"
    },
    "day2_morning_deja5_5": {
        character: "eunsu_warm",
        next: "day2_morning_deja5_6"
    },
    "day2_morning_deja5_6": {
        next: "day2_morning_deja5_6a",
        stats: { dejavu: 1, eunsu: { danger: 2 } },
        glitch: { type: "cold", duration: 500 }
    },
    "day2_morning_deja5_6a": {
        next: "day2_morning_deja5_7"
    },
    "day2_morning_deja5_7": {
        next: "day2_morning_deja5_7a"
    },
    "day2_morning_deja5_7a": {
        character: "eunsu_warm",
        next: "day2_morning_deja5_8"
    },
    "day2_morning_deja5_8": {
        character: null,
        next: "day2_morning_deja5_9"
    },
    "day2_morning_deja5_9": {
        next: "day2_morning_deja5_10"
    },
    "day2_morning_deja5_10": {
        character: "eunsu_warm",
        next: "day2_morning_deja5_11"
    },
    "day2_morning_deja5_11": {
        character: null,
        next: "day2_morning_seolhwa_2"
    },

    // ===== 설화 관찰 =====
    "day2_morning_seolhwa_2": {
        character: "seolhwa_quiet",
        next: "day2_morning_seolhwa_3"
    },
    "day2_morning_seolhwa_3": {
        character: "seolhwa_quiet",
        next: "day2_morning_seolhwa_4"
    },
    "day2_morning_seolhwa_4": {
        character: null,
        next: "day2_morning_seolhwa_5"
    },
    "day2_morning_seolhwa_5": {
        next: "day2_morning_end",
        glitch: { silence: true, silenceDuration: 2000 }
    },

    // ===== 아침 종료 =====
    "day2_morning_end": {
        background: "classroom",
        character: null,
        changeSlot: "lunch",
        next: "day2_lunch_start"
    }
});
