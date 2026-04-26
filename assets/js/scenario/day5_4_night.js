/**
 * Day 5-4: Night - ★ ENDINGS ★
 *
 * 엔딩 분류 (7 endings):
 * A. TRUE END     - "졸업" — 증거 확보 + 유나 구출 + 비상구 탈출
 * B. ESCAPE END   - "도주" — 유나 구출 후 바로 탈출 (증거 불충분)
 * C. RESIST END   - "반항" — "같이 나가요, 선생님" 선택
 * D. CAGE END     - "새장" — "여기 남을게요" 선택 (은수/세아 변형)
 * E. FORGET END   - "망각" — "기억을 지워주세요" 선택
 * F. GHOST END    - "잔상" — 타이머 초과 → 설화 개입
 * G. COMPLICIT END - "공범" — 숨겨진 엔딩 (모른 척 계열 + 은수 호감도 최대)
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    "day5_night_start": {
        background: "black",
        bgm: null,
        character: null,
        clearFlags: ["high_eunsu_affinity", "high_sea_affinity", "complicit_ready"],
        next: "day5_night_affinity_check"
    },

    // ── 호감도 → 플래그 변환 (COMPLICIT END 조건) ──
    "day5_night_affinity_check": {
        character: null,
        affinityChar: "eunsu",
        affinityBranches: [
            { minAffinity: 50, next: "day5_night_set_high_affinity" },
            { minAffinity: 0, next: "day5_night_sea_affinity_check" }
        ]
    },
    "day5_night_set_high_affinity": {
        character: null,
        setFlags: ["high_eunsu_affinity"],
        next: "day5_night_sea_affinity_check"
    },
    "day5_night_sea_affinity_check": {
        character: null,
        affinityChar: "sea",
        affinityBranches: [
            { minAffinity: 50, next: "day5_night_set_high_sea_affinity" },
            { minAffinity: 0, next: "day5_night_complicit_eval" }
        ]
    },
    "day5_night_set_high_sea_affinity": {
        character: null,
        setFlags: ["high_sea_affinity"],
        next: "day5_night_complicit_eval"
    },
    "day5_night_complicit_eval": {
        character: null,
        branches: [
            { condition: ["complicit_route", "high_eunsu_affinity"], next: "day5_night_set_complicit_ready" }
        ],
        next: "day5_night_routing"
    },
    "day5_night_set_complicit_ready": {
        character: null,
        setFlags: ["complicit_ready"],
        next: "day5_night_routing"
    },

    // ── 엔딩 라우터 ──
    "day5_night_routing": {
        character: null,
        branches: [
            { condition: ["route_escape"], next: "day5_ending_escape_1" },
            { condition: ["forced_forget"], next: "day5_ending_forget_forced_1" },
            { condition: ["ghost_guided"], next: "day5_ending_ghost_guided_1" },
            { condition: ["route_true", "has_evidence"], next: "day5_ending_true_1" },
            { condition: ["route_resist"], next: "day5_ending_resist_1" },
            { condition: ["route_forget"], next: "day5_ending_forget_1" },
            { condition: ["route_ghost"], next: "day5_ending_ghost_1" },
            { condition: ["broke_through_eunsu", "escape_with_yuna", "has_evidence"], next: "day5_ending_true_1" },
            { condition: ["broke_through_eunsu", "escape_with_yuna"], next: "day5_ending_escape_1" },
            { condition: ["chose_together"], next: "day5_ending_resist_1" },
            { condition: ["complicit_route", "high_eunsu_affinity"], next: "day5_ending_complicit_1" },
            { condition: ["complicit_ready"], next: "day5_ending_complicit_1" },
            { condition: ["stayed_with_eunsu"], next: "day5_ending_cage_eunsu_1" },
            { condition: ["stayed_with_sea"], next: "day5_ending_cage_sea_1" },
            { condition: ["chose_forget"], next: "day5_ending_forget_1" },
            { condition: ["timer_expired"], next: "day5_ending_ghost_1" },
            { condition: [], next: "day5_ending_forget_1" }
        ]
    },

    // ── 붙잡힘 후 강제 망각 진입 ──
    "day5_ending_forget_forced_1": {
        background: "emergency_exit",
        bgm: null,
        character: null,
        next: "day5_ending_forget_forced_2"
    },
    "day5_ending_forget_forced_2": {
        character: "eunsu_normal",
        next: "day5_ending_forget_forced_3"
    },
    "day5_ending_forget_forced_3": {
        character: null,
        next: "day5_ending_forget_forced_4"
    },
    "day5_ending_forget_forced_4": {
        character: null,
        next: "day5_ending_forget_10"
    },

    // ── 붙잡힘 후 설화가 밀어 올린 탈출 ──
    "day5_ending_ghost_guided_1": {
        background: "emergency_exit",
        bgm: "ending_ghost.mp3",
        character: null,
        next: "day5_ending_ghost_guided_2"
    },
    "day5_ending_ghost_guided_2": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_guided_3"
    },
    "day5_ending_ghost_guided_3": {
        character: null,
        next: "day5_ending_ghost_guided_4"
    },
    "day5_ending_ghost_guided_4": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_guided_5"
    },
    "day5_ending_ghost_guided_5": {
        character: null,
        next: "day5_ending_ghost_17"
    },

    // ══════════════════════════════════════════
    // A. TRUE END — "졸업"
    // ══════════════════════════════════════════
    "day5_ending_true_1": {
        background: "corridor_emergency",
        bgm: "ending_hope.mp3",
        character: null,
        next: "day5_ending_true_2"
    },
    "day5_ending_true_2": {
        character: "eunsu_shaking",
        next: "day5_ending_true_3"
    },
    "day5_ending_true_3": {
        character: "eunsu_shaking",
        next: "day5_ending_true_4"
    },
    "day5_ending_true_4": {
        character: null,
        next: "day5_ending_true_5"
    },
    "day5_ending_true_5": {
        character: null,
        next: "day5_ending_true_6"
    },
    "day5_ending_true_6": {
        character: null,
        background: "exit_door",
        next: "day5_ending_true_7"
    },
    "day5_ending_true_7": {
        character: null,
        next: "day5_ending_true_8"
    },
    "day5_ending_true_8": {
        character: "seolhwa_fading",
        next: "day5_ending_true_9"
    },
    "day5_ending_true_9": {
        character: null,
        next: "day5_ending_true_10"
    },
    "day5_ending_true_10": {
        character: "seolhwa_normal",
        next: "day5_ending_true_11"
    },
    "day5_ending_true_11": {
        character: null,
        next: "day5_ending_true_12"
    },
    "day5_ending_true_12": {
        character: "seolhwa_normal",
        next: "day5_ending_true_13"
    },
    "day5_ending_true_13": {
        character: "seolhwa_normal",
        next: "day5_ending_true_14"
    },
    "day5_ending_true_14": {
        character: "seolhwa_fading",
        next: "day5_ending_true_14a"
    },
    // 은수의 반응: "결국, 내가 진 거구나. 그 아이한테."
    "day5_ending_true_14a": {
        character: "eunsu_shocked",
        next: "day5_ending_true_14b"
    },
    // 주사기가 바닥에 떨어져 굴러갔다
    "day5_ending_true_14b": {
        character: null,
        sfx: "sfx_glass_break.mp3",
        next: "day5_ending_true_15"
    },
    "day5_ending_true_15": {
        character: null,
        next: "day5_ending_true_16"
    },
    "day5_ending_true_16": {
        character: "seolhwa_normal",
        next: "day5_ending_true_17"
    },
    "day5_ending_true_17": {
        character: null,
        next: "day5_ending_true_18"
    },
    "day5_ending_true_18": {
        character: null,
        next: "day5_ending_true_19"
    },
    "day5_ending_true_19": {
        character: null,
        next: "day5_ending_true_20"
    },
    "day5_ending_true_20": {
        character: null,
        next: "day5_ending_true_21"
    },
    "day5_ending_true_21": {
        character: null,
        next: "day5_ending_true_21a"
    },
    "day5_ending_true_21a": {
        character: null,
        glitch: { noise: true, noiseDuration: 300 },
        next: "day5_ending_true_22"
    },
    "day5_ending_true_22": {
        character: "yuna_normal",
        next: "day5_ending_true_23"
    },
    "day5_ending_true_23": {
        character: "yuna_normal",
        next: "day5_ending_true_24"
    },
    // ── 에필로그 / 3개월 후 ──
    "day5_ending_true_24": {
        background: "black",
        character: null,
        fadeOut: true,
        next: "day5_ending_true_25"
    },
    "day5_ending_true_25": {
        character: "yuna_normal",
        background: "news_article",
        next: "day5_ending_true_26"
    },
    "day5_ending_true_26": {
        character: null,
        next: "day5_ending_true_27"
    },
    "day5_ending_true_27": {
        character: null,
        next: "day5_ending_true_28"
    },
    "day5_ending_true_28": {
        character: null,
        background: "ending_true",
        next: "day5_ending_true_29"
    },
    "day5_ending_true_29": {
        character: null,
        next: "day5_ending_true_30"
    },
    "day5_ending_true_30": {
        character: null,
        next: "day5_ending_true_31"
    },
    "day5_ending_true_31": {
        character: null,
        next: "day5_ending_true_32"
    },
    "day5_ending_true_32": {
        character: null,
        next: "day5_ending_true_title"
    },
    "day5_ending_true_title": {
        character: null,
        endingTitle: "TRUE END",
        endingSubtitle: "day5_ending_true_subtitle",
        unskippable: true,
        metaEffect: "graduationSlots",
        glitch: { endingCreditSaveUI: "TRUE" },
        next: "day5_postcredit_1"
    },

    // ══════════════════════════════════════════
    // ★ 보너스/NG+ 전용: 연구소 서버 파일
    // TRUE END 직후 자동 재생 금지. 감정선은 이사회 포스트크레딧에서 종료한다.
    // Cupid 플레이어: cycle_01.zip [정상] + PREVIEW 선택지
    // 비플레이어: cycle_01.zip [손상됨]
    // ══════════════════════════════════════════
    "day5_xover_server_1": {
        background: "black",
        bgm: null,
        character: null,
        setFlags: ["postgame_bonus_server"],
        typingSpeed: 40,
        next: "day5_xover_server_2"
    },
    "day5_xover_server_2": {
        character: null,
        typingSpeed: 40,
        next: "day5_xover_server_3"
    },
    // 분기: Cupid 플레이 여부에 따라 cycle_01 상태 다름
    "day5_xover_server_3": {
        character: null,
        condition: "cupid_played",
        fallback: "day5_xover_server_3_damaged",
        typingSpeed: 40,
        next: "day5_xover_server_4"
    },
    // Cupid 비플레이어: cycle_01 [손상됨]
    "day5_xover_server_3_damaged": {
        character: null,
        typingSpeed: 40,
        next: "day5_xover_server_end"
    },
    // Cupid 플레이어: cycle_01 [정상] → PREVIEW 선택지
    "day5_xover_server_4": {
        character: null,
        typingSpeed: 40,
        next: "day5_xover_server_preview_choice"
    },
    "day5_xover_server_preview_choice": {
        character: null,
        choices: [
            { next: "day5_xover_preview_1" },
            { next: "day5_xover_server_end" }
        ]
    },
    // PREVIEW 실행 — Cupid Day 1 오프닝 연출
    "day5_xover_preview_1": {
        background: "cherry_blossom",
        bgm: "spring_bright.mp3",
        character: null,
        next: "day5_xover_preview_2"
    },
    "day5_xover_preview_2": {
        character: null,
        next: "day5_xover_preview_3"
    },
    "day5_xover_preview_3": {
        character: null,
        next: "day5_xover_preview_4"
    },
    "day5_xover_preview_4": {
        character: null,
        next: "day5_xover_preview_heroine"
    },
    // ★ Cupid 공략 히로인 표시 (cupid_heroine별 분기)
    "day5_xover_preview_heroine": {
        character: null,
        dynamicData: true,
        typingSpeed: 30,
        next: "day5_xover_preview_5"
    },
    // cycle_01 표시 + 페이드아웃
    "day5_xover_preview_5": {
        character: null,
        glitch: { noise: true, noiseDuration: 500 },
        setFlags: ["xover_preview_played"],
        next: "day5_xover_server_end"
    },
    "day5_xover_server_end": {
        background: "black",
        bgm: null,
        character: null,
        next: "day5_observer_1"
    },

    // ── 포스트 크레딧 ──
    "day5_postcredit_1": {
        background: "black",
        bgm: null,
        character: null,
        glitch: { noise: true },
        typingSpeed: 80,
        next: "day5_postcredit_2"
    },
    "day5_postcredit_2": {
        character: null,
        next: "day5_postcredit_3"
    },
    "day5_postcredit_3": {
        character: null,
        typingSpeed: 60,
        next: "day5_postcredit_4"
    },
    "day5_postcredit_4": {
        character: null,
        next: "day5_postcredit_5"
    },
    "day5_postcredit_5": {
        character: null,
        next: "day5_postcredit_6"
    },
    "day5_postcredit_6": {
        character: null,
        next: "day5_postcredit_7"
    },
    "day5_postcredit_7": {
        character: null,
        glitch: { heavyGlitch: true },
        typingSpeed: 100,
        next: "day5_postcredit_8"
    },
    "day5_postcredit_8": {
        character: null,
        next: "day5_postcredit_end"
    },
    "day5_postcredit_end": {
        character: null,
        branches: [
            { condition: "postgame_bonus_server", next: "day5_xover_server_1" },
            { condition: "postgame_bonus_log", next: "day5_observer_1" }
        ],
        next: null
    },

    // ══════════════════════════════════════════
    // ★ 보너스/NG+ 전용 플레이 로그 분석
    // ══════════════════════════════════════════
    "day5_observer_1": {
        background: "black",
        bgm: null,
        character: null,
        setFlags: ["postgame_bonus_log"],
        typingSpeed: 80,
        next: "day5_observer_2"
    },
    "day5_observer_2": {
        character: null,
        autoAdvance: true,
        autoAdvanceDelay: 3000,
        next: "day5_observer_3"
    },
    "day5_observer_3": {
        character: null,
        typingSpeed: 100,
        next: "day5_observer_4"
    },
    "day5_observer_4": {
        character: null,
        monospace: true,
        typingSpeed: 30,
        next: "day5_observer_5"
    },
    "day5_observer_5": {
        character: null,
        next: "day5_observer_6"
    },
    "day5_observer_6": {
        character: null,
        monospace: true,
        typingSpeed: 20,
        dynamicData: true,
        next: "day5_observer_7"
    },
    "day5_observer_7": {
        character: null,
        autoAdvance: true,
        autoAdvanceDelay: 2000,
        next: "day5_observer_8"
    },
    "day5_observer_8": {
        character: null,
        monospace: true,
        typingSpeed: 25,
        dynamicData: true,
        next: "day5_observer_cupid_check"
    },
    // ★ Cupid + NG+ 플레이어에게만 추가 행 노출 (보너스 레이어)
    "day5_observer_cupid_check": {
        character: null,
        condition: ["cupid_played", "new_game_plus"],
        fallback: "day5_observer_9",
        next: "day5_observer_cupid_extra"
    },
    "day5_observer_cupid_extra": {
        character: null,
        monospace: true,
        typingSpeed: 25,
        dynamicData: true,
        autoAdvance: true,
        autoAdvanceDelay: 6000,
        next: "day5_observer_9"
    },
    "day5_observer_9": {
        character: null,
        autoAdvance: true,
        autoAdvanceDelay: 5000,
        next: "day5_observer_10"
    },
    "day5_observer_10": {
        character: null,
        typingSpeed: 100,
        next: "day5_observer_11"
    },
    "day5_observer_11": {
        character: null,
        choices: [
            { next: null, setFlags: ["observer_graduated"] },
            { next: null, setFlags: ["observer_stayed"] }
        ]
    },

    // ══════════════════════════════════════════
    // B. ESCAPE END — "도주"
    // ══════════════════════════════════════════
    "day5_ending_escape_1": {
        background: "school_fence_dawn",
        bgm: "ending_melancholy.mp3",
        character: null,
        next: "day5_ending_escape_2"
    },
    "day5_ending_escape_2": {
        character: null,
        next: "day5_ending_escape_3"
    },
    "day5_ending_escape_3": {
        character: null,
        next: "day5_ending_escape_4"
    },
    "day5_ending_escape_4": {
        character: "yuna_normal",
        next: "day5_ending_escape_5"
    },
    "day5_ending_escape_5": {
        character: null,
        next: "day5_ending_escape_6"
    },
    "day5_ending_escape_6": {
        character: null,
        background: "dawn_road",
        next: "day5_ending_escape_7"
    },
    "day5_ending_escape_7": {
        character: null,
        next: "day5_ending_escape_8"
    },
    "day5_ending_escape_8": {
        character: null,
        next: "day5_ending_escape_9"
    },
    "day5_ending_escape_9": {
        character: "yuna_normal",
        next: "day5_ending_escape_10"
    },
    "day5_ending_escape_10": {
        character: null,
        next: "day5_ending_escape_11"
    },
    "day5_ending_escape_11": {
        character: null,
        next: "day5_ending_escape_12"
    },
    "day5_ending_escape_12": {
        character: null,
        glitch: { noise: true },
        next: "day5_ending_escape_13"
    },
    // ── 에필로그 ──
    "day5_ending_escape_13": {
        character: null,
        background: "ending_escape",
        fadeIn: true,
        next: "day5_ending_escape_14"
    },
    "day5_ending_escape_14": {
        character: null,
        next: "day5_ending_escape_15"
    },
    "day5_ending_escape_15": {
        character: "yuna_normal",
        next: "day5_ending_escape_title"
    },
    "day5_ending_escape_title": {
        character: null,
        endingTitle: "ESCAPE END",
        endingSubtitle: "day5_ending_escape_subtitle",
        unskippable: true,
        metaEffect: "escapeSlot",
        glitch: { endingCreditSaveUI: "ESCAPE" },
        next: null
    },

    // ══════════════════════════════════════════
    // C. RESIST END — "반항"
    // ══════════════════════════════════════════
    "day5_ending_resist_1": {
        background: "exit_door",
        bgm: "ending_bittersweet.mp3",
        character: "eunsu_normal",
        next: "day5_ending_resist_2"
    },
    "day5_ending_resist_2": {
        character: null,
        next: "day5_ending_resist_3"
    },
    "day5_ending_resist_3": {
        character: "eunsu_normal",
        next: "day5_ending_resist_4"
    },
    "day5_ending_resist_4": {
        character: "eunsu_normal",
        next: "day5_ending_resist_5"
    },
    "day5_ending_resist_5": {
        character: "eunsu_normal",
        next: "day5_ending_resist_6"
    },
    "day5_ending_resist_6": {
        character: null,
        next: "day5_ending_resist_7"
    },
    "day5_ending_resist_7": {
        character: "seolhwa_fading",
        next: "day5_ending_resist_8"
    },
    "day5_ending_resist_8": {
        character: "seolhwa_fading",
        next: "day5_ending_resist_9"
    },
    "day5_ending_resist_9": {
        character: "eunsu_shocked",
        next: "day5_ending_resist_10"
    },
    "day5_ending_resist_10": {
        character: "eunsu_gentle",
        next: "day5_ending_resist_11"
    },
    "day5_ending_resist_11": {
        character: "seolhwa_normal",
        next: "day5_ending_resist_12"
    },
    "day5_ending_resist_12": {
        character: "seolhwa_normal",
        next: "day5_ending_resist_13"
    },
    "day5_ending_resist_13": {
        character: "seolhwa_normal",
        next: "day5_ending_resist_14"
    },
    "day5_ending_resist_14": {
        character: null,
        next: "day5_ending_resist_15"
    },
    "day5_ending_resist_15": {
        character: "eunsu_normal",
        next: "day5_ending_resist_16"
    },
    "day5_ending_resist_16": {
        character: null,
        next: "day5_ending_resist_17"
    },
    "day5_ending_resist_17": {
        character: "eunsu_gentle",
        next: "day5_ending_resist_18"
    },
    "day5_ending_resist_18": {
        character: "eunsu_crying",
        next: "day5_ending_resist_18a"
    },
    "day5_ending_resist_18a": {
        character: "eunsu_normal",
        next: "day5_ending_resist_18b"
    },
    "day5_ending_resist_18b": {
        character: null,
        next: "day5_ending_resist_18c"
    },
    "day5_ending_resist_18c": {
        character: "eunsu_normal",
        next: "day5_ending_resist_18d"
    },
    "day5_ending_resist_18d": {
        character: "eunsu_normal",
        next: "day5_ending_resist_19"
    },
    "day5_ending_resist_19": {
        character: null,
        next: "day5_ending_resist_20"
    },
    "day5_ending_resist_20": {
        character: "eunsu_gentle",
        next: "day5_ending_resist_21"
    },
    "day5_ending_resist_21": {
        character: null,
        next: "day5_ending_resist_22"
    },
    "day5_ending_resist_22": {
        character: null,
        next: "day5_ending_resist_23"
    },
    "day5_ending_resist_23": {
        character: null,
        next: "day5_ending_resist_24"
    },
    "day5_ending_resist_24": {
        character: null,
        next: "day5_ending_resist_title"
    },
    "day5_ending_resist_title": {
        character: null,
        endingTitle: "RESIST END",
        endingSubtitle: "day5_ending_resist_subtitle",
        unskippable: true,
        metaEffect: "resistSlot",
        glitch: { endingCreditSaveUI: "RESIST" },
        next: null
    },

    // ══════════════════════════════════════════
    // D. CAGE END — "새장" (은수 변형)
    // ══════════════════════════════════════════
    "day5_ending_cage_eunsu_1": {
        background: "classroom",
        bgm: "ending_dark.mp3",
        sfx: "sfx_door_slam.mp3",
        character: "eunsu_normal",
        next: "day5_ending_cage_eunsu_2"
    },
    "day5_ending_cage_eunsu_2": {
        character: "eunsu_normal",
        next: "day5_ending_cage_eunsu_3"
    },
    "day5_ending_cage_eunsu_3": {
        character: "eunsu_smile",
        next: "day5_ending_cage_eunsu_4"
    },
    "day5_ending_cage_eunsu_4": {
        character: "eunsu_smile",
        next: "day5_ending_cage_eunsu_5"
    },
    "day5_ending_cage_eunsu_5": {
        character: null,
        fadeOut: true,
        next: "day5_ending_cage_eunsu_6"
    },
    "day5_ending_cage_eunsu_6": {
        character: null,
        background: "ending_cage",
        next: "day5_ending_cage_eunsu_7"
    },
    "day5_ending_cage_eunsu_7": {
        character: null,
        next: "day5_ending_cage_eunsu_8"
    },
    "day5_ending_cage_eunsu_8": {
        character: null,
        next: "day5_ending_cage_eunsu_9"
    },
    "day5_ending_cage_eunsu_9": {
        character: null,
        next: "day5_ending_cage_eunsu_10"
    },
    "day5_ending_cage_eunsu_10": {
        character: null,
        next: "day5_ending_cage_eunsu_11"
    },
    "day5_ending_cage_eunsu_11": {
        character: null,
        next: "day5_ending_cage_title"
    },
    // ── CAGE END — "새장" (세아 변형) ──
    "day5_ending_cage_sea_1": {
        background: "corridor",
        bgm: "ending_dark.mp3",
        character: "sea_normal",
        next: "day5_ending_cage_sea_2"
    },
    "day5_ending_cage_sea_2": {
        character: "sea_normal",
        next: "day5_ending_cage_sea_3"
    },
    "day5_ending_cage_sea_3": {
        character: "sea_normal",
        next: "day5_ending_cage_sea_4"
    },
    "day5_ending_cage_sea_4": {
        character: null,
        next: "day5_ending_cage_sea_5"
    },
    "day5_ending_cage_sea_5": {
        character: null,
        fadeOut: true,
        next: "day5_ending_cage_sea_6"
    },
    "day5_ending_cage_sea_6": {
        background: "ending_cage",
        character: null,
        next: "day5_ending_cage_sea_7"
    },
    "day5_ending_cage_sea_7": {
        character: null,
        next: "day5_ending_cage_sea_8"
    },
    "day5_ending_cage_sea_8": {
        character: null,
        next: "day5_ending_cage_sea_9"
    },
    "day5_ending_cage_sea_9": {
        character: null,
        next: "day5_ending_cage_title"
    },
    // ── CAGE END 공통 타이틀 + 루프 ──
    // 게임이 끝나지 않는다. 엔딩 크레딧이 뜨지 않는다.
    // 화면이 어두워졌다 밝아지며 "Day 1"이 반복된다.
    "day5_ending_cage_title": {
        character: null,
        endingTitle: "CAGE END",
        endingSubtitle: "day5_ending_cage_subtitle",
        unskippable: true,
        glitch: { endingCreditSaveUI: "CAGE" },
        next: "day5_cage_loop"
    },
    "day5_cage_loop": {
        background: "classroom",
        bgm: "spring_bright.mp3",
        character: null,
        cageLoop: true,
        // ── 메타 연출 강화 ──
        // 2nd repeat: subtle changes
        //   - 세아 대사 타이밍 0.1초 빨라짐
        //   - 은수 미소 longer duration
        //   - 설화 자리에 빈 교복 (주인 없는)
        // 3rd repeat: 0.5초간 텍스트 플래시
        //   "처리 기록: 피험자 잔류 확인. 내부 체류 지속."
        // 5th repeat: 은수가 카메라/플레이어를 정면으로 본다
        //   "...아직 보고 계시네요." → 화면 꺼짐
        cageRepeatEffects: {
            2: {
                seaDialogTimingOffset: -100,
                eunsuSmileDurationMultiplier: 1.5,
                seolhwaSeatOverride: "empty_uniform"
            },
            3: {
                flashText: "처리 기록: 피험자 잔류 확인. 내부 체류 지속.",
                flashDuration: 500
            },
            5: {
                eunsuBreaksFourthWall: true,
                eunsuLine: "...아직 보고 계시네요.",
                screenBlackout: true
            }
        },
        // ── 세아 변형 (CAGE 세아 루트) ──
        // 매 반복마다 도시락 반찬이 줄어든다
        // 5th repeat: 빈 도시락통
        //   "...이번에도 안 나갔네."
        //   "당신도 안 보내주는 거예요?"
        seaCageVariants: {
            lunchboxDegrade: true,
            5: {
                emptyLunchbox: true,
                seaLines: [
                    "...이번에도 안 나갔네.",
                    "당신도 안 보내주는 거예요?"
                ]
            }
        }
    },

    // ══════════════════════════════════════════
    // E. FORGET END — "망각"
    // ══════════════════════════════════════════
    "day5_ending_forget_1": {
        background: "emergency_exit",
        bgm: null,
        character: null,
        next: "day5_ending_forget_2"
    },
    "day5_ending_forget_2": {
        character: null,
        next: "day5_ending_forget_3"
    },
    "day5_ending_forget_3": {
        character: "eunsu_normal",
        next: "day5_ending_forget_4"
    },
    "day5_ending_forget_4": {
        character: null,
        next: "day5_ending_forget_5"
    },
    "day5_ending_forget_5": {
        character: null,
        next: "day5_ending_forget_6"
    },
    "day5_ending_forget_6": {
        character: null,
        next: "day5_ending_forget_7"
    },
    "day5_ending_forget_7": {
        character: "eunsu_normal",
        next: "day5_ending_forget_8"
    },
    "day5_ending_forget_8": {
        character: "eunsu_normal",
        next: "day5_ending_forget_9"
    },
    "day5_ending_forget_9": {
        character: null,
        next: "day5_ending_forget_10"
    },
    "day5_ending_forget_10": {
        character: null,
        next: "day5_ending_forget_11"
    },
    "day5_ending_forget_11": {
        character: null,
        next: "day5_ending_forget_12"
    },
    "day5_ending_forget_12": {
        character: null,
        glitch: { heavyGlitch: true },
        next: "day5_ending_forget_13"
    },
    // ── 화이트아웃 후 새 아침 ──
    "day5_ending_forget_13": {
        character: null,
        background: "white",
        fadeOut: true,
        next: "day5_ending_forget_14"
    },
    "day5_ending_forget_14": {
        character: null,
        background: "home",
        bgm: "morning_peaceful.mp3",
        next: "day5_ending_forget_15"
    },
    "day5_ending_forget_15": {
        character: null,
        next: "day5_ending_forget_16"
    },
    "day5_ending_forget_16": {
        character: null,
        next: "day5_ending_forget_17"
    },
    "day5_ending_forget_17": {
        character: null,
        next: "day5_ending_forget_18"
    },
    "day5_ending_forget_18": {
        character: null,
        next: "day5_ending_forget_19"
    },
    "day5_ending_forget_19": {
        background: "school_gate",
        character: "eunsu_smile",
        next: "day5_ending_forget_20"
    },
    "day5_ending_forget_20": {
        character: "eunsu_smile",
        next: "day5_ending_forget_21"
    },
    "day5_ending_forget_21": {
        character: "eunsu_smile",
        next: "day5_ending_forget_22"
    },
    "day5_ending_forget_22": {
        character: null,
        background: "ending_forget",
        next: "day5_ending_forget_sea_branch"
    },
    // ── 세아 호감도 MAX 분기 ──
    "day5_ending_forget_sea_branch": {
        character: null,
        affinityChar: "sea",
        affinityBranches: [
            { minAffinity: 50, next: "day5_ending_forget_sea_1" },
            { minAffinity: 0, next: "day5_ending_forget_title" }
        ]
    },
    "day5_ending_forget_sea_1": {
        background: "school_gate",
        character: "sea_smile",
        next: "day5_ending_forget_sea_2"
    },
    "day5_ending_forget_sea_2": {
        character: "sea_smile",
        next: "day5_ending_forget_sea_3"
    },
    "day5_ending_forget_sea_3": {
        character: null,
        next: "day5_ending_forget_title"
    },
    "day5_ending_forget_title": {
        character: null,
        endingTitle: "FORGET END",
        endingSubtitle: "day5_ending_forget_subtitle",
        unskippable: true,
        metaEffect: "forgetSlot",
        glitch: { endingCreditSaveUI: "FORGET" },
        next: null
    },

    // ══════════════════════════════════════════
    // F. GHOST END — "잔상"
    // ══════════════════════════════════════════
    "day5_ending_ghost_1": {
        background: "emergency_exit",
        bgm: "ending_ghost.mp3",
        sfx: "sfx_whisper.mp3",
        character: null,
        glitch: { heavyGlitch: true },
        next: "day5_ending_ghost_2"
    },
    "day5_ending_ghost_2": {
        character: null,
        next: "day5_ending_ghost_3"
    },
    "day5_ending_ghost_3": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_4"
    },
    "day5_ending_ghost_4": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_5"
    },
    "day5_ending_ghost_5": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_6"
    },
    "day5_ending_ghost_6": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_7"
    },
    "day5_ending_ghost_7": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_8"
    },
    "day5_ending_ghost_8": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_9"
    },
    "day5_ending_ghost_9": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_10"
    },
    "day5_ending_ghost_10": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_11"
    },
    "day5_ending_ghost_11": {
        character: null,
        next: "day5_ending_ghost_12"
    },
    "day5_ending_ghost_12": {
        character: null,
        next: "day5_ending_ghost_13"
    },
    "day5_ending_ghost_13": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_14"
    },
    "day5_ending_ghost_14": {
        character: "seolhwa_fading",
        next: "day5_ending_ghost_15"
    },
    "day5_ending_ghost_15": {
        character: null,
        next: "day5_ending_ghost_16"
    },
    // ── 에필로그 ──
    "day5_ending_ghost_16": {
        character: null,
        background: "ending_ghost",
        bgm: "ending_melancholy.mp3",
        next: "day5_ending_ghost_17"
    },
    "day5_ending_ghost_17": {
        character: null,
        next: "day5_ending_ghost_18"
    },
    "day5_ending_ghost_18": {
        character: null,
        next: "day5_ending_ghost_19"
    },
    "day5_ending_ghost_19": {
        character: null,
        next: "day5_ending_ghost_20"
    },
    "day5_ending_ghost_20": {
        character: null,
        next: "day5_ending_ghost_21"
    },
    "day5_ending_ghost_21": {
        character: null,
        next: "day5_ending_ghost_22"
    },
    "day5_ending_ghost_22": {
        character: null,
        next: "day5_ending_ghost_title"
    },
    "day5_ending_ghost_title": {
        character: null,
        endingTitle: "GHOST END",
        endingSubtitle: "day5_ending_ghost_subtitle",
        unskippable: true,
        metaEffect: "ghostSlot",
        glitch: { endingCreditSaveUI: "GHOST" },
        next: null
    },

    // ══════════════════════════════════════════
    // G. COMPLICIT END — "공범" (숨겨진 엔딩)
    // ══════════════════════════════════════════
    "day5_ending_complicit_1": {
        background: "office",
        bgm: "ending_dark.mp3",
        character: null,
        next: "day5_ending_complicit_2"
    },
    "day5_ending_complicit_2": {
        character: "eunsu_normal",
        next: "day5_ending_complicit_3"
    },
    "day5_ending_complicit_3": {
        character: "eunsu_normal",
        next: "day5_ending_complicit_4"
    },
    "day5_ending_complicit_4": {
        character: null,
        next: "day5_ending_complicit_5"
    },
    "day5_ending_complicit_5": {
        character: null,
        next: "day5_ending_complicit_6"
    },
    "day5_ending_complicit_6": {
        character: "eunsu_normal",
        next: "day5_ending_complicit_7"
    },
    "day5_ending_complicit_7": {
        character: "eunsu_normal",
        next: "day5_ending_complicit_8"
    },
    "day5_ending_complicit_8": {
        character: null,
        autoAdvance: true,
        next: "day5_ending_complicit_8a"
    },
    "day5_ending_complicit_8a": {
        character: null,
        next: "day5_ending_complicit_8b"
    },
    "day5_ending_complicit_8b": {
        character: null,
        next: "day5_ending_complicit_sign"
    },
    // ★ 서명 인터랙션 — 유저가 직접 드래그/터치로 서명해야 진행
    // SCENARIO.md 5608: 짧고 날카로운 단일 진동 0.1초 (돌이킬 수 없음의 촉감)
    // SCENARIO.md 5640: 스크린샷 감지 '반응 없음' — 기록을 허용한다
    "day5_ending_complicit_sign": {
        character: null,
        unskippable: true,
        glitch: { requireSignature: true },
        next: "day5_ending_complicit_9"
    },
    "day5_ending_complicit_9": {
        character: null,
        next: "day5_ending_complicit_10"
    },
    "day5_ending_complicit_10": {
        character: null,
        next: "day5_ending_complicit_11"
    },
    "day5_ending_complicit_11": {
        character: null,
        fadeOut: true,
        next: "day5_ending_complicit_12"
    },
    // ── 에필로그 ──
    "day5_ending_complicit_12": {
        background: "school_gate_morning",
        bgm: null,
        character: null,
        next: "day5_ending_complicit_13"
    },
    "day5_ending_complicit_13": {
        character: null,
        next: "day5_ending_complicit_14"
    },
    "day5_ending_complicit_14": {
        character: null,
        next: "day5_ending_complicit_15"
    },
    "day5_ending_complicit_15": {
        character: null,
        next: "day5_ending_complicit_16"
    },
    "day5_ending_complicit_16": {
        character: null,
        next: "day5_ending_complicit_17"
    },
    "day5_ending_complicit_17": {
        character: null,
        next: "day5_ending_complicit_18"
    },
    "day5_ending_complicit_18": {
        character: null,
        next: "day5_ending_complicit_title"
    },
    "day5_ending_complicit_title": {
        character: null,
        endingTitle: "COMPLICIT END",
        endingSubtitle: "day5_ending_complicit_subtitle",
        unskippable: true,
        glitch: {
            textReplace: { from: "졸업하지 못한 교실", to: "졸업시키지 않는 교실" },
            endingCreditSaveUI: "COMPLICIT"
        },
        metaEffect: "complicitSlot",
        next: null
    }
});
