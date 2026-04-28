/**
 * Day 5-3: Afterschool - 최종 대면 + 엔딩 분기 전환.
 *
 * 구관 3층 비상구 앞에서 은수와의 최종 대면.
 * 4지 선택지(20초 타이머):
 *   1. "안 돼요. 나는 기억할 거예요." → TRUE
 *   2. "...지워주세요."               → FORGET
 *   3. "같이 나가요, 선생님."          → RESIST
 *   4. (타임아웃) 설화 개입             → GHOST
 *
 * 추가 분기(이전 선택 기반):
 *   - stayed_with_eunsu → CAGE
 *   - caught_by_sea / caught_by_riin → 붙잡힘 → 최종 대면 단축
 *
 * BGM: confrontation.mp3 / ending_dark.mp3
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    // ══════════════════════════════════════
    // 진입점
    // ══════════════════════════════════════
    "day5_after_start": {
        background: "black",
        bgm: "confrontation.mp3",
        character: null,
        next: "day5_after_branch"
    },

    // ── 메인 분기: 이전 선택에 따른 라우팅 ──
    "day5_after_branch": {
        character: null,
        branches: [
            { condition: "stayed_with_eunsu", next: "day5_after_cage_1" },
            { condition: "stayed_with_sea", next: "day5_after_end" },
            { condition: "caught_by_sea", next: "day5_after_caught_1" },
            { condition: "caught_by_riin", next: "day5_after_caught_1" },
            { condition: "route_escape", next: "day5_after_end" },
            { condition: "route_true", next: "day5_after_end" },
            { condition: "route_forget", next: "day5_after_end" },
            { condition: "route_resist", next: "day5_after_end" },
            { condition: "route_ghost", next: "day5_after_end" },
            { condition: "broke_through_eunsu", next: "day5_after_confront_1" }
        ],
        next: "day5_after_confront_1"
    },

    // ══════════════════════════════════════
    // A) CAGE 루트 — "여기 남는다" 선택 후
    // ══════════════════════════════════════
    "day5_after_cage_1": {
        background: "classroom",
        bgm: "ending_dark.mp3",
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_cage_2"
    },
    "day5_after_cage_2": {
        character: null,
        unskippable: true,
        next: "day5_after_cage_3"
    },
    "day5_after_cage_3": {
        character: null,
        unskippable: true,
        next: "day5_after_cage_4"
    },
    "day5_after_cage_4": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_cage_5"
    },
    "day5_after_cage_5": {
        character: null,
        unskippable: true,
        next: "day5_after_cage_6"
    },
    "day5_after_cage_6": {
        character: null,
        unskippable: true,
        next: "day5_after_cage_7"
    },
    "day5_after_cage_7": {
        character: "eunsu_obsessed",
        typingSpeed: 100,
        unskippable: true,
        next: "day5_after_cage_8"
    },
    "day5_after_cage_8": {
        character: null,
        unskippable: true,
        next: "day5_after_cage_9"
    },
    "day5_after_cage_9": {
        character: null,
        unskippable: true,
        next: "day5_after_cage_10"
    },
    "day5_after_cage_10": {
        character: null,
        unskippable: true,
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // B) 붙잡힘 루트 — 세아/리인에게 붙잡힌 후
    //    약물 투여 or 저항 → 최종 대면으로 합류
    // ══════════════════════════════════════
    "day5_after_caught_1": {
        background: "basement",
        bgm: "confrontation.mp3",
        character: null,
        glitch: { heavyGlitch: true },
        unskippable: true,
        next: "day5_after_caught_2"
    },
    "day5_after_caught_2": {
        character: null,
        unskippable: true,
        next: "day5_after_caught_3"
    },
    "day5_after_caught_3": {
        character: null,
        unskippable: true,
        next: "day5_after_caught_4"
    },
    "day5_after_caught_4": {
        character: "eunsu_obsessed",
        unskippable: true,
        next: "day5_after_caught_5"
    },
    "day5_after_caught_5": {
        character: "eunsu_obsessed",
        unskippable: true,
        next: "day5_after_caught_6"
    },
    "day5_after_caught_6": {
        character: "riin_dark",
        unskippable: true,
        next: "day5_after_caught_7"
    },
    "day5_after_caught_7": {
        character: null,
        unskippable: true,
        next: "day5_after_caught_choice"
    },
    "day5_after_caught_choice": {
        character: null,
        timedChoice: 5000,
        unskippable: true,
        vibrate: "danger",
        choices: [
            {
                next: "day5_after_caught_resist_1",
                setFlags: ["final_resistance"],
                stats: { eunsu: { affinity: -8 }, seolhwa: { affinity: 8 } }
            },
            {
                next: "day5_after_caught_submit_1",
                stats: { eunsu: { affinity: 8 } }
            }
        ],
        timeoutNext: "day5_after_caught_submit_1"
    },

    // ── 붙잡힘 → 저항 → 설화 개입 ──
    "day5_after_caught_resist_1": {
        character: null,
        glitch: { heavyGlitch: true },
        vibrate: "danger",
        unskippable: true,
        next: "day5_after_caught_resist_2"
    },
    "day5_after_caught_resist_2": {
        character: null,
        unskippable: true,
        next: "day5_after_caught_resist_3"
    },
    "day5_after_caught_resist_3": {
        character: "riin_pain",
        unskippable: true,
        next: "day5_after_caught_resist_4"
    },
    "day5_after_caught_resist_4": {
        character: null,
        glitch: { heavy: true },
        unskippable: true,
        next: "day5_after_caught_resist_5"
    },
    "day5_after_caught_resist_5": {
        character: "seolhwa_fading",
        glitch: { silence: true, silenceDuration: 3000 },
        unskippable: true,
        next: "day5_after_caught_resist_6"
    },
    "day5_after_caught_resist_6": {
        character: null,
        unskippable: true,
        next: "day5_after_caught_resist_7"
    },
    "day5_after_caught_resist_7": {
        character: null,
        unskippable: true,
        next: "day5_after_end",
        setFlags: ["ghost_guided", "timer_expired"]
    },

    // ── 붙잡힘 → 굴복 → 약물 투여 ──
    "day5_after_caught_submit_1": {
        character: "riin_pain",
        unskippable: true,
        next: "day5_after_caught_submit_2"
    },
    "day5_after_caught_submit_2": {
        character: null,
        unskippable: true,
        next: "day5_after_caught_submit_3"
    },
    "day5_after_caught_submit_3": {
        character: null,
        unskippable: true,
        vibrate: "paralysis",
        next: "day5_after_caught_submit_4"
    },
    "day5_after_caught_submit_4": {
        character: null,
        glitch: { heavyGlitch: true, drugBlur: true },
        unskippable: true,
        next: "day5_after_end",
        setFlags: ["forced_forget"]
    },

    // ══════════════════════════════════════
    // C) 최종 대면 — 은수와 비상구 앞
    //    (탈출 성공 루트가 여기로 합류)
    // ══════════════════════════════════════
    "day5_after_confront_1": {
        background: "exit_door",
        character: null,
        sfx: "sfx_footsteps.mp3",
        unskippable: true,
        next: "day5_after_confront_2"
    },
    "day5_after_confront_2": {
        character: null,
        unskippable: true,
        next: "day5_after_confront_3"
    },
    "day5_after_confront_3": {
        character: null,
        unskippable: true,
        next: "day5_after_confront_4"
    },
    "day5_after_confront_4": {
        character: "eunsu_obsessed",
        glitch: { screenShake: true, noise: true },
        stopSfx: true,
        unskippable: true,
        next: "day5_after_confront_5"
    },
    "day5_after_confront_5": {
        character: "eunsu_obsessed",
        unskippable: true,
        next: "day5_after_confront_6"
    },
    "day5_after_confront_6": {
        character: null,
        unskippable: true,
        next: "day5_after_confront_7"
    },
    "day5_after_confront_7": {
        character: null,
        unskippable: true,
        next: "day5_after_confront_8"
    },
    "day5_after_confront_8": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_9"
    },
    "day5_after_confront_9": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_10"
    },
    "day5_after_confront_10": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_11"
    },
    "day5_after_confront_11": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_12"
    },
    "day5_after_confront_12": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_13"
    },
    "day5_after_confront_13": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_14"
    },
    "day5_after_confront_14": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_15"
    },
    "day5_after_confront_15": {
        character: null,
        unskippable: true,
        next: "day5_after_confront_16"
    },
    "day5_after_confront_16": {
        character: null,
        unskippable: true,
        next: "day5_after_confront_17"
    },
    "day5_after_confront_17": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_18"
    },
    "day5_after_confront_18": {
        character: "eunsu_gentle",
        unskippable: true,
        next: "day5_after_confront_19"
    },
    "day5_after_confront_19": {
        character: "eunsu_crying",
        unskippable: true,
        next: "day5_after_confront_20"
    },
    "day5_after_confront_20": {
        glitch: { borderPulse: true },
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_final_choice"
    },

    // ══════════════════════════════════════
    // ★ 최종 선택지: 20초 타이머
    // ══════════════════════════════════════
    "day5_after_final_choice": {
        character: null,
        timedChoice: 20000,
        unskippable: true,
        vibrate: "heartbeat",
        choices: [
            {
                next: "day5_after_true_1",
                stats: { eunsu: { affinity: -8 }, yuna: { affinity: 10 }, seolhwa: { affinity: 8 } }
            },
            {
                next: "day5_after_forget_1",
                setFlags: ["chose_forget"],
                stats: { eunsu: { affinity: 8 } }
            },
            {
                next: "day5_after_resist_1",
                setFlags: ["chose_together"],
                stats: { seolhwa: { affinity: 10 } }
            }
        ],
        timeoutNext: "day5_after_ghost_1",
        timeoutFlags: ["timer_expired"]
    },

    // ══════════════════════════════════════
    // 선택 1: "안 돼요. 나는 기억할 거예요."
    // → TRUE END
    // ══════════════════════════════════════
    "day5_after_true_1": {
        character: "eunsu_obsessed",
        sfx: "sfx_glass_break.mp3",
        glitch: { heavyGlitch: true },
        unskippable: true,
        next: "day5_after_true_2"
    },
    "day5_after_true_2": {
        character: "eunsu_obsessed",
        unskippable: true,
        setFlags: ["route_true", "broke_through_eunsu", "escape_with_yuna", "has_evidence"],
        next: "day5_after_true_3"
    },
    "day5_after_true_3": {
        character: null,
        // 추격전 시작 — 뒤(왼쪽)에서 점점 오른쪽으로 발소리
        glitch: { chaseFootsteps: { fromPan: -1, toPan: 1, steps: 12, interval: 0.18 } },
        unskippable: true,
        next: "day5_after_true_4"
    },
    "day5_after_true_4": {
        character: null,
        // 발소리 더 가까이 — 빠르고 강한 스윕
        glitch: { chaseFootsteps: { fromPan: -0.8, toPan: 0.8, steps: 14, interval: 0.14 } },
        unskippable: true,
        next: "day5_after_true_5"
    },
    "day5_after_true_5": {
        character: null,
        vibrate: "door_resistance",
        // 비상구 앞 — 발소리가 오른쪽 뒤에서 몰아쳐옴
        glitch: { chaseFootsteps: { fromPan: 0.3, toPan: 1, steps: 10, interval: 0.12 } },
        unskippable: true,
        next: "day5_after_true_6"
    },
    "day5_after_true_6": {
        character: null,
        unskippable: true,
        next: "day5_after_true_7"
    },
    "day5_after_true_7": {
        character: null,
        unskippable: true,
        next: "day5_after_true_seolhwa_branch"
    },

    // ── 설화 비상구 안쪽 ──
    "day5_after_true_seolhwa_branch": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_true_8"
    },
    "day5_after_true_8": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_true_9"
    },
    "day5_after_true_9": {
        character: null,
        unskippable: true,
        next: "day5_after_true_10"
    },
    "day5_after_true_10": {
        character: "seolhwa_normal",
        unskippable: true,
        next: "day5_after_true_11"
    },
    "day5_after_true_11": {
        character: "seolhwa_normal",
        unskippable: true,
        next: "day5_after_true_11a"
    },
    // "기억할게. 이설화."
    "day5_after_true_11a": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_true_12"
    },
    "day5_after_true_12": {
        character: null,
        unskippable: true,
        setFlags: ["broke_through_eunsu", "escape_with_yuna", "has_evidence", "ending_bridge_true_done"],
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // 선택 2: "...지워주세요."
    // → FORGET END
    // ══════════════════════════════════════
    "day5_after_forget_1": {
        character: "eunsu_obsessed",
        unskippable: true,
        next: "day5_after_forget_2"
    },
    "day5_after_forget_2": {
        character: "eunsu_obsessed",
        unskippable: true,
        setFlags: ["route_forget"],
        next: "day5_after_forget_3"
    },
    "day5_after_forget_3": {
        character: null,
        unskippable: true,
        next: "day5_after_forget_4"
    },
    "day5_after_forget_4": {
        character: null,
        unskippable: true,
        next: "day5_after_forget_5"
    },
    "day5_after_forget_5": {
        character: null,
        unskippable: true,
        next: "day5_after_forget_6"
    },
    "day5_after_forget_6": {
        character: null,
        unskippable: true,
        next: "day5_after_forget_7"
    },
    "day5_after_forget_7": {
        character: "eunsu_warm",
        unskippable: true,
        next: "day5_after_forget_8"
    },
    "day5_after_forget_8": {
        character: null,
        unskippable: true,
        next: "day5_after_forget_9"
    },
    "day5_after_forget_9": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_forget_10"
    },
    "day5_after_forget_10": {
        character: null,
        unskippable: true,
        next: "day5_after_forget_11"
    },
    "day5_after_forget_11": {
        character: null,
        glitch: { heavyGlitch: true, drugBlur: true },
        unskippable: true,
        next: "day5_after_forget_12"
    },
    "day5_after_forget_12": {
        character: null,
        unskippable: true,
        setFlags: ["ending_bridge_forget_done"],
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // 선택 3: "같이 나가요, 선생님."
    // → RESIST END
    // ══════════════════════════════════════
    "day5_after_resist_1": {
        character: "eunsu_obsessed",
        unskippable: true,
        next: "day5_after_resist_2"
    },
    "day5_after_resist_2": {
        character: null,
        unskippable: true,
        setFlags: ["route_resist", "chose_together"],
        next: "day5_after_resist_3"
    },
    "day5_after_resist_3": {
        character: "eunsu_warm",
        unskippable: true,
        next: "day5_after_resist_4"
    },
    "day5_after_resist_4": {
        character: "eunsu_warm",
        unskippable: true,
        next: "day5_after_resist_5"
    },
    "day5_after_resist_5": {
        character: "eunsu_warm",
        unskippable: true,
        next: "day5_after_resist_6"
    },
    "day5_after_resist_6": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_resist_7"
    },
    "day5_after_resist_7": {
        character: "eunsu_obsessed",
        unskippable: true,
        next: "day5_after_resist_8"
    },
    "day5_after_resist_8": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_resist_9"
    },
    "day5_after_resist_9": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_resist_10"
    },
    "day5_after_resist_10": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_resist_11"
    },
    "day5_after_resist_11": {
        character: null,
        unskippable: true,
        next: "day5_after_resist_12"
    },
    "day5_after_resist_12": {
        character: "eunsu_warm",
        unskippable: true,
        next: "day5_after_resist_13"
    },
    "day5_after_resist_13": {
        character: null,
        unskippable: true,
        next: "day5_after_resist_13a"
    },
    // "감옥에 갈 수도 있어."
    "day5_after_resist_13a": {
        character: "eunsu_shaking",
        unskippable: true,
        next: "day5_after_resist_13b"
    },
    // "알아요."
    "day5_after_resist_13b": {
        character: null,
        unskippable: true,
        next: "day5_after_resist_13c"
    },
    // "11번째 오태현은..."
    "day5_after_resist_13c": {
        character: "eunsu_shaking",
        unskippable: true,
        next: "day5_after_resist_13d"
    },
    // 선생님의 손이 미세하게 떨렸다
    "day5_after_resist_13d": {
        character: null,
        unskippable: true,
        next: "day5_after_resist_13e"
    },
    // "그날 밤 기억을 지웠어..."
    "day5_after_resist_13e": {
        character: "eunsu_crying",
        unskippable: true,
        next: "day5_after_resist_13f"
    },
    // "그때 알았어. 이건 관계가 아니라 조건화였다는 걸..."
    "day5_after_resist_13f": {
        character: "eunsu_crying",
        unskippable: true,
        next: "day5_after_resist_13g"
    },
    // "어떻게 나를 데려가겠다는 거야."
    "day5_after_resist_13g": {
        character: "eunsu_crying",
        unskippable: true,
        next: "day5_after_resist_14"
    },
    "day5_after_resist_14": {
        character: null,
        unskippable: true,
        next: "day5_after_resist_15"
    },
    "day5_after_resist_15": {
        character: "seolhwa_fading",
        unskippable: true,
        setFlags: ["ending_bridge_resist_done"],
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // 선택 4 (타임아웃): 설화 개입
    // → GHOST END
    // ══════════════════════════════════════
    "day5_after_ghost_1": {
        character: null,
        unskippable: true,
        next: "day5_after_ghost_2"
    },
    "day5_after_ghost_2": {
        character: "eunsu_obsessed",
        unskippable: true,
        setFlags: ["route_ghost", "timer_expired"],
        next: "day5_after_ghost_3"
    },
    "day5_after_ghost_3": {
        character: "seolhwa_fading",
        glitch: { heavyGlitch: true },
        unskippable: true,
        next: "day5_after_ghost_4"
    },
    "day5_after_ghost_4": {
        character: null,
        unskippable: true,
        next: "day5_after_ghost_5"
    },
    "day5_after_ghost_5": {
        character: "seolhwa_normal",
        unskippable: true,
        next: "day5_after_ghost_6"
    },
    "day5_after_ghost_6": {
        character: "seolhwa_normal",
        unskippable: true,
        next: "day5_after_ghost_7"
    },
    "day5_after_ghost_7": {
        character: null,
        unskippable: true,
        next: "day5_after_ghost_8"
    },
    "day5_after_ghost_8": {
        character: "seolhwa_normal",
        unskippable: true,
        next: "day5_after_ghost_9"
    },
    "day5_after_ghost_9": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_after_ghost_10"
    },
    "day5_after_ghost_10": {
        character: null,
        unskippable: true,
        next: "day5_after_ghost_11"
    },
    "day5_after_ghost_11": {
        character: "seolhwa_normal",
        unskippable: true,
        next: "day5_after_ghost_12"
    },
    "day5_after_ghost_12": {
        character: null,
        glitch: { noise: true },
        unskippable: true,
        next: "day5_after_ghost_13"
    },
    "day5_after_ghost_13": {
        character: null,
        unskippable: true,
        setFlags: ["ending_bridge_ghost_done"],
        next: "day5_after_end"
    },

    // ══════════════════════════════════════
    // 공통 종단: Night 파일로 전환
    // ══════════════════════════════════════
    "day5_after_end": {
        character: null,
        stopSfx: true,
        autoAdvance: true,
        autoAdvanceDelay: 300,
        changeSlot: "night",
        next: "day5_night_start"
    }
});
