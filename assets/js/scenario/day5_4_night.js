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
 * G. COMPLICIT END - "공범" — 순응 기록 + 은수 호감도 50 이상 + Day 5의 명시적 동의
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    "day5_night_start": {
        skipTextFlags: ["route_true","route_escape","route_resist","route_forget","route_ghost","ending_bridge_true_done","ending_bridge_resist_done","ending_bridge_forget_done","ending_bridge_ghost_done","ending_bridge_true_farewell"],
        background: "black",
        bgm: null,
        character: null,
        stopSfx: true,
        clearFlags: ["high_eunsu_affinity", "high_sea_affinity", "high_seolhwa_affinity", "complicit_ready"],
        unskippable: true,
        next: "day5_night_affinity_check"
    },

    // ── 호감도 → 플래그 변환 (COMPLICIT END 조건) ──
    "day5_night_affinity_check": {
        character: null,
        affinityChar: "eunsu",
        affinityBranches: [
            { minAffinity: 50, next: "day5_night_set_high_affinity" },
            { minAffinity: -100, next: "day5_night_sea_affinity_check" }
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
            { minAffinity: -100, next: "day5_night_seolhwa_affinity_check" }
        ]
    },
    "day5_night_set_high_sea_affinity": {
        character: null,
        setFlags: ["high_sea_affinity"],
        next: "day5_night_seolhwa_affinity_check"
    },
    "day5_night_complicit_eval": {
        "character": null,
        "branches": [
            {
                "condition": "route_complicit",
                "next": "day5_night_set_complicit_ready"
            }
        ],
        "next": "day5_night_routing"
    },
    "day5_night_set_complicit_ready": {
        character: null,
        setFlags: ["complicit_ready"],
        next: "day5_night_routing"
    },

    // ── 엔딩 라우터 ──
    "day5_night_routing": {
        "character": null,
        "branches": [
            {
                "condition": [
                    "stayed_with_sea"
                ],
                "next": "day5_ending_cage_sea_1"
            },
            {
                "condition": [
                    "stayed_with_eunsu"
                ],
                "next": "day5_ending_cage_eunsu_1"
            },
            {
                "condition": [
                    "route_complicit"
                ],
                "next": "day5_ending_complicit_1"
            },
            {
                "condition": [
                    "route_escape"
                ],
                "next": "day5_ending_escape_1"
            },
            {
                "condition": [
                    "forced_forget"
                ],
                "next": "day5_ending_forget_forced_1"
            },
            {
                "condition": [
                    "ghost_guided"
                ],
                "next": "day5_ending_ghost_guided_1"
            },
            {
                "condition": [
                    "ending_bridge_true_done"
                ],
                "next": "day5_ending_true_19"
            },
            {
                "condition": [
                    "ending_bridge_resist_done"
                ],
                "next": "day5_ending_resist_22"
            },
            {
                "condition": [
                    "ending_bridge_forget_done"
                ],
                "next": "day5_ending_forget_14"
            },
            {
                "condition": [
                    "ending_bridge_ghost_done"
                ],
                "next": "day5_ending_ghost_17"
            },
            {
                "condition": [
                    "route_true",
                    "has_evidence"
                ],
                "next": "day5_ending_true_1"
            },
            {
                "condition": [
                    "route_resist"
                ],
                "next": "day5_ending_resist_1"
            },
            {
                "condition": [
                    "route_forget"
                ],
                "next": "day5_ending_forget_1"
            },
            {
                "condition": [
                    "route_ghost"
                ],
                "next": "day5_ending_ghost_1"
            },
            {
                "condition": [
                    "broke_through_eunsu",
                    "escape_with_yuna",
                    "has_evidence"
                ],
                "next": "day5_ending_true_1"
            },
            {
                "condition": [
                    "broke_through_eunsu",
                    "escape_with_yuna"
                ],
                "next": "day5_ending_escape_1"
            },
            {
                "condition": [
                    "chose_together"
                ],
                "next": "day5_ending_resist_1"
            },
            {
                "condition": [
                    "chose_forget"
                ],
                "next": "day5_ending_forget_1"
            },
            {
                "condition": [
                    "timer_expired"
                ],
                "next": "day5_ending_ghost_1"
            },
            {
                "condition": [],
                "next": "day5_ending_forget_1"
            }
        ]
    },

    // ── 붙잡힘 후 강제 망각 진입 ──
    "day5_ending_forget_forced_1": {
        background: "emergency_exit",
        bgm: null,
        character: null,
        unskippable: true,
        next: "day5_ending_forget_forced_2"
    },
    "day5_ending_forget_forced_2": {
        character: "riin_pain",
        unskippable: true,
        next: "day5_ending_forget_forced_3"
    },
    "day5_ending_forget_forced_3": {
        character: "riin_pain",
        unskippable: true,
        next: "day5_ending_forget_forced_4"
    },
    "day5_ending_forget_forced_4": {
        character: null,
        unskippable: true,
        next: "day5_ending_forget_10"
    },

    // ── 붙잡힘 후 설화가 밀어 올린 탈출 ──
    "day5_ending_ghost_guided_1": {
        background: "emergency_exit",
        bgm: "ending_ghost.mp3",
        character: null,
        unskippable: true,
        next: "day5_ending_ghost_guided_2"
    },
    "day5_ending_ghost_guided_2": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_guided_3"
    },
    "day5_ending_ghost_guided_3": {
        character: null,
        unskippable: true,
        next: "day5_ending_ghost_guided_4"
    },
    "day5_ending_ghost_guided_4": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_guided_5"
    },
    "day5_ending_ghost_guided_5": {
        character: null,
        unskippable: true,
        next: "day5_ending_ghost_17"
    },

    // ══════════════════════════════════════════
    // A. TRUE END — "졸업"
    // ══════════════════════════════════════════
    "day5_ending_true_1": {
        background: "corridor_emergency",
        bgm: "ending_hope.mp3",
        character: "eunsu_shaking",
        unskippable: true,
        next: "day5_ending_true_2"
    },
    "day5_ending_true_2": {
        character: "eunsu_shaking",
        unskippable: true,
        next: "day5_ending_true_3"
    },
    "day5_ending_true_3": {
        character: "eunsu_shaking",
        unskippable: true,
        next: "day5_ending_true_4"
    },
    "day5_ending_true_4": {
        character: null,
        unskippable: true,
        next: "day5_ending_true_5"
    },
    "day5_ending_true_5": {
        background: "emergency_stair_night",
        character: null,
        unskippable: true,
        next: "day5_ending_true_6"
    },
    "day5_ending_true_6": {
        character: null,
        background: "emergency_stair_night",
        unskippable: true,
        next: "day5_ending_true_7"
    },
    "day5_ending_true_7": {
        character: "seolhwa_fading",
        next: "day5_ending_true_8"
    },
    "day5_ending_true_8": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_true_9"
    },
    "day5_ending_true_9": {
        character: null,
        unskippable: true,
        next: "day5_ending_true_10"
    },
    "day5_ending_true_10": {
        character: "seolhwa_normal",
        charOpacity: 0.9,
        unskippable: true,
        next: "day5_ending_true_11"
    },
    "day5_ending_true_11": {
        charOpacity: 0.45,
        character: "seolhwa_smile",
        unskippable: true,
        next: "day5_ending_true_12"
    },
    "day5_ending_true_12": {
        character: "seolhwa_normal",
        charOpacity: 0.9,
        unskippable: true,
        next: "day5_ending_true_13"
    },
    "day5_ending_true_13": {
        character: "seolhwa_normal",
        charOpacity: 0.9,
        unskippable: true,
        next: "day5_ending_true_14"
    },
    "day5_ending_true_14": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_true_14a"
    },
    // 문 안쪽의 은수와 문 밖의 주인공·유나를 분리한다.
    "day5_ending_true_14a": {
        "character": null,
        "unskippable": true,
        "next": "day5_ending_true_14b"
    },
    // 설화는 주인공에게만 보인다.
    "day5_ending_true_14b": {
        "character": null,
        "unskippable": true,
        "next": "day5_ending_true_15"
    },
    "day5_ending_true_15": {
        character: "seolhwa_sad",
        charOpacity: 0.9,
        next: "day5_ending_true_voice_check"
    },
    "day5_ending_true_16": {
        character: "seolhwa_normal",
        charOpacity: 0.9,
        next: "day5_ending_true_17"
    },
    "day5_ending_true_17": {
        character: null,
        branches: [{ condition: "ending_bridge_true_farewell", next: "day5_after_true_12" }],
        next: "day5_ending_true_18"
    },
    "day5_ending_true_18": {
        character: null,
        next: "day5_ending_true_19"
    },
    "day5_ending_true_19": {
        background: "emergency_stair_night",
        bgm: "ending_hope.mp3",
        character: null,
        unskippable: true,
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
        unskippable: true,
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
        background: "emergency_stair_night",
        character: null,
        fadeOut: false,
        unskippable: true,
        next: "day5_ending_true_25"
    },
    "day5_ending_true_25": {
        character: "yuna_normal",
        background: "emergency_stair_night",
        unskippable: true,
        next: "day5_ending_true_26"
    },
    "day5_ending_true_26": {
        background: "news_article",
        character: null,
        unskippable: true,
        next: "day5_ending_true_27"
    },
    "day5_ending_true_27": {
        character: null,
        unskippable: true,
        next: "day5_ending_true_riin_check"
    },
    "day5_ending_true_28": {
        character: null,
        background: "ending_true",
        unskippable: true,
        next: "day5_ending_true_29"
    },
    "day5_ending_true_29": {
        character: null,
        next: "day5_ending_true_30"
    },
    "day5_ending_true_30": {
        character: null,
        next: "day5_ending_true_memory_check"
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
        unskippable: true,
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
        "character": null,
        "choices": [
            {
                "next": "day5_xover_preview_1"
            },
            {
                "next": "day5_archive_cycle07_1"
            },
            {
                "next": "day5_archive_cycle12_1"
            },
            {
                "next": "day5_xover_server_end"
            }
        ]
    },
    // PREVIEW 실행 — Cupid Day 1 오프닝 연출
    "day5_xover_preview_1": {
        background: "cherry_blossom",
        bgm: "spring_bright.mp3",
        character: null,
        unskippable: true,
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
        unskippable: true,
        setFlags: ["xover_preview_played"],
        next: "day5_xover_server_end"
    },
    "day5_xover_server_end": {
        background: "black",
        bgm: null,
        character: null,
        unskippable: true,
        next: "day5_observer_1"
    },

    // ── 포스트 크레딧 ──
    "day5_postcredit_1": {
        background: "black",
        bgm: null,
        character: null,
        glitch: { noise: true },
        typingSpeed: 80,
        unskippable: true,
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
        unskippable: true,
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
        unskippable: true,
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
        textPace: "document",
        character: null,
        monospace: true,
        typingSpeed: 30,
        next: "day5_observer_5"
    },
    "day5_observer_5": {
        textPace: "document",
        character: null,
        next: "day5_observer_6"
    },
    "day5_observer_6": {
        textPace: "document",
        character: null,
        monospace: true,
        typingSpeed: 20,
        dynamicData: true,
        next: "day5_observer_7"
    },
    "day5_observer_7": {
        textPace: "document",
        character: null,
        autoAdvance: true,
        autoAdvanceDelay: 2000,
        next: "day5_observer_8"
    },
    "day5_observer_8": {
        textPace: "document",
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
            // 종료 씬: next가 없으므로 returnToTitle로 타이틀 복귀 오버레이를 띄운다 (검은 화면 데드엔드 방지)
            { next: null, returnToTitle: true, setFlags: ["observer_graduated"] },
            { next: null, returnToTitle: true, setFlags: ["observer_stayed"] }
        ]
    },

    // ══════════════════════════════════════════
    // B. ESCAPE END — "도주"
    // ══════════════════════════════════════════
    "day5_ending_escape_1": {
        background: "school_fence_dawn",
        bgm: "ending_melancholy.mp3",
        character: null,
        unskippable: true,
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
        unskippable: true,
        next: "day5_ending_escape_13"
    },
    // ── 에필로그 ──
    "day5_ending_escape_13": {
        character: null,
        background: "ending_escape",
        fadeIn: true,
        unskippable: true,
        next: "day5_ending_escape_riin_check"
    },
    "day5_ending_escape_14": {
        character: null,
        next: "day5_ending_escape_15"
    },
    "day5_ending_escape_15": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_1"
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
        background: "corridor_emergency",
        bgm: "ending_bittersweet.mp3",
        character: "eunsu_normal",
        unskippable: true,
        next: "day5_ending_resist_2"
    },
    "day5_ending_resist_2": {
        character: null,
        next: "day5_ending_resist_3"
    },
    "day5_ending_resist_3": {
        character: "eunsu_serious",
        next: "day5_ending_resist_4"
    },
    "day5_ending_resist_4": {
        character: "eunsu_serious",
        next: "day5_ending_resist_5"
    },
    "day5_ending_resist_5": {
        character: "eunsu_serious",
        next: "day5_ending_resist_6"
    },
    "day5_ending_resist_6": {
        character: null,
        next: "day5_ending_resist_7"
    },
    "day5_ending_resist_7": {
        characters: { center: "eunsu_shaking", right: "seolhwa_fading" },
        character: null,
        unskippable: true,
        next: "day5_ending_resist_8"
    },
    "day5_ending_resist_8": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_resist_9"
    },
    "day5_ending_resist_9": {
        character: "eunsu_shaking",
        unskippable: true,
        next: "day5_ending_resist_10"
    },
    "day5_ending_resist_10": {
        character: "eunsu_shaking",
        unskippable: true,
        next: "day5_ending_resist_11"
    },
    "day5_ending_resist_11": {
        "character": "eunsu_shaking",
        "charOpacity": 0.9,
        "next": "day5_ending_resist_12"
    },
    "day5_ending_resist_12": {
        "character": "eunsu_shaking",
        "charOpacity": 0.9,
        "next": "day5_ending_resist_13"
    },
    "day5_ending_resist_13": {
        "character": "eunsu_shaking",
        "charOpacity": 0.9,
        "next": "day5_ending_resist_14"
    },
    "day5_ending_resist_14": {
        character: "eunsu_shaking",
        next: "day5_ending_resist_15"
    },
    "day5_ending_resist_15": {
        character: "eunsu_shaking",
        next: "day5_ending_resist_16"
    },
    "day5_ending_resist_16": {
        character: null,
        next: "day5_ending_resist_17"
    },
    "day5_ending_resist_17": {
        character: "eunsu_shaking",
        next: "day5_ending_resist_18"
    },
    "day5_ending_resist_18": {
        character: "eunsu_crying",
        unskippable: true,
        next: "day5_ending_resist_18a"
    },
    "day5_ending_resist_18a": {
        character: "eunsu_shaking",
        next: "day5_ending_resist_18b"
    },
    "day5_ending_resist_18b": {
        character: "eunsu_shaking",
        next: "day5_ending_resist_18c"
    },
    "day5_ending_resist_18c": {
        character: "eunsu_crying",
        next: "day5_ending_resist_18d"
    },
    "day5_ending_resist_18d": {
        character: "eunsu_crying",
        next: "day5_ending_resist_19"
    },
    "day5_ending_resist_19": {
        character: "eunsu_crying",
        next: "day5_ending_resist_20"
    },
    "day5_ending_resist_20": {
        character: "eunsu_crying",
        next: "day5_ending_resist_21"
    },
    "day5_ending_resist_21": {
        character: null,
        next: "day5_ending_resist_22"
    },
    "day5_ending_resist_22": {
        background: "ending_resist",
        bgm: "ending_bittersweet.mp3",
        character: null,
        unskippable: true,
        next: "day5_ending_resist_23"
    },
    "day5_ending_resist_23": {
        character: null,
        next: "day5_ending_resist_24"
    },
    "day5_ending_resist_24": {
        "background": "faculty_office",
        "character": null,
        "next": "day5_ending_resist_epilogue_1"
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
        unskippable: true,
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
        unskippable: true,
        next: "day5_ending_cage_eunsu_6"
    },
    "day5_ending_cage_eunsu_6": {
        character: null,
        background: "classroom_afternoon",
        unskippable: true,
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
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_1"
    },
    // ── CAGE END — "새장" (세아 변형) ──
    "day5_ending_cage_sea_1": {
        background: "corridor",
        bgm: "ending_dark.mp3",
        character: "sea_normal",
        unskippable: true,
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
        character: "sea_cry",
        next: "day5_ending_cage_sea_5"
    },
    "day5_ending_cage_sea_5": {
        character: null,
        fadeOut: true,
        unskippable: true,
        next: "day5_ending_cage_sea_6"
    },
    "day5_ending_cage_sea_6": {
        background: "ending_cage_sea",
        character: null,
        unskippable: true,
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
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_1"
    },
    // ── CAGE END 공통 타이틀 + 루프 ──
    // 게임이 끝나지 않는다. 엔딩 크레딧이 뜨지 않는다.
    // 화면이 어두워졌다 밝아지며 "Day 1"이 반복된다.
    "day5_ending_cage_title": {
        background: "ending_cage",
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
                flashText: {
                    ko: "처리 기록: 피험자 잔류 확인. 내부 체류 지속.",
                    en: "Processing record: subject containment confirmed. Internal stay continuing.",
                    ja: "処理記録: 被験者の残留を確認。内部滞在を継続。",
                    es: "Registro de proceso: permanencia del sujeto confirmada. Estancia interna continua.",
                    fr: "Journal de traitement : maintien du sujet confirme. Sejour interne en cours.",
                    de: "Verarbeitungsprotokoll: Verbleib des Subjekts bestaetigt. Interner Aufenthalt wird fortgesetzt.",
                    pt: "Registro de processamento: permanencia do sujeito confirmada. Estadia interna continua.",
                    zh: "处理记录：确认受试者滞留。持续在内部停留。"
                },
                flashDuration: 500
            },
            5: {
                eunsuBreaksFourthWall: true,
                eunsuLine: {
                    ko: "아직 보고 계시네요.",
                    en: "...You are still watching.",
                    ja: "...まだ見ているんですね。",
                    es: "...Todavia estas mirando.",
                    fr: "...Vous regardez encore.",
                    de: "...Sie sehen immer noch zu.",
                    pt: "...Voce ainda esta assistindo.",
                    zh: "您还在看着呢。"
                },
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
                    {
                        ko: "이번에도 안 나갔네.",
                        en: "...You did not leave this time either.",
                        ja: "...今回も出ていかなかったね。",
                        es: "...Esta vez tampoco saliste.",
                        fr: "...Tu n'es pas parti cette fois non plus.",
                        de: "...Diesmal bist du auch nicht gegangen.",
                        pt: "...Voce tambem nao foi embora desta vez.",
                        zh: "这次你也没有离开呢。"
                    },
                    {
                        ko: "이번에도 못 나가게 할 거예요?",
                        en: "Are you not letting them go either?",
                        ja: "あなたも行かせてくれないの?",
                        es: "Tu tampoco los vas a dejar ir?",
                        fr: "Toi non plus, tu ne les laisses pas partir ?",
                        de: "Laesst du sie auch nicht gehen?",
                        pt: "Voce tambem nao vai deixar ir?",
                        zh: "这次也不打算放他们走吗？"
                    }
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
        unskippable: true,
        next: "day5_ending_forget_2"
    },
    "day5_ending_forget_2": {
        character: "eunsu_normal",
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
        character: "eunsu_shaking",
        next: "day5_ending_forget_8"
    },
    "day5_ending_forget_8": {
        character: "eunsu_crying",
        next: "day5_ending_forget_9"
    },
    "day5_ending_forget_9": {
        character: null,
        next: "day5_ending_forget_10"
    },
    "day5_ending_forget_10": {
        character: "seolhwa_fading",
        next: "day5_ending_forget_11"
    },
    "day5_ending_forget_11": {
        character: "seolhwa_fading",
        next: "day5_ending_forget_12"
    },
    "day5_ending_forget_12": {
        character: "seolhwa_fading",
        glitch: { heavyGlitch: true },
        unskippable: true,
        next: "day5_ending_forget_13"
    },
    // ── 화이트아웃 후 새 아침 ──
    "day5_ending_forget_13": {
        character: null,
        background: "white",
        fadeOut: true,
        unskippable: true,
        next: "day5_ending_forget_14"
    },
    "day5_ending_forget_14": {
        "character": null,
        "background": "room_morning",
        "bgm": "morning_peaceful.mp3",
        "unskippable": true,
        "next": "day5_ending_forget_epilogue_1"
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
        unskippable: true,
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
        character: "eunsu_smile",
        background: "school_gate",
        unskippable: true,
        next: "day5_ending_forget_sea_branch"
    },
    // ── 세아 호감도 MAX 분기 ──
    "day5_ending_forget_sea_branch": {
        character: null,
        affinityChar: "sea",
        affinityBranches: [
            { minAffinity: 50, next: "day5_ending_forget_sea_1" },
            { minAffinity: -100, next: "day5_ending_forget_title" }
        ]
    },
    "day5_ending_forget_sea_1": {
        background: "school_gate",
        character: "sea_smile",
        unskippable: true,
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
        background: "ending_forget",
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
        unskippable: true,
        glitch: { heavyGlitch: true },
        next: "day5_ending_ghost_2"
    },
    "day5_ending_ghost_2": {
        character: "eunsu_obsessed",
        unskippable: true,
        next: "day5_ending_ghost_3"
    },
    "day5_ending_ghost_3": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_4"
    },
    "day5_ending_ghost_4": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_5"
    },
    "day5_ending_ghost_5": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_6"
    },
    "day5_ending_ghost_6": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_7"
    },
    "day5_ending_ghost_7": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_8"
    },
    "day5_ending_ghost_8": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_9"
    },
    "day5_ending_ghost_9": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_10"
    },
    "day5_ending_ghost_10": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_11"
    },
    "day5_ending_ghost_11": {
        character: null,
        unskippable: true,
        next: "day5_ending_ghost_12"
    },
    "day5_ending_ghost_12": {
        character: null,
        unskippable: true,
        next: "day5_ending_ghost_13"
    },
    "day5_ending_ghost_13": {
        charOpacity: 0.45,
        background: "emergency_stair_night",
        character: "seolhwa_smile",
        unskippable: true,
        next: "day5_ending_ghost_14"
    },
    "day5_ending_ghost_14": {
        character: "seolhwa_fading",
        unskippable: true,
        next: "day5_ending_ghost_15"
    },
    "day5_ending_ghost_15": {
        character: null,
        unskippable: true,
        next: "day5_ending_ghost_16"
    },
    // ── 에필로그 ──
    "day5_ending_ghost_16": {
        character: null,
        background: "school_night",
        bgm: "ending_melancholy.mp3",
        stopSfx: "sfx_whisper.mp3",
        unskippable: true,
        next: "day5_ending_ghost_17"
    },
    "day5_ending_ghost_17": {
        background: "ending_ghost",
        bgm: "ending_melancholy.mp3",
        character: null,
        unskippable: true,
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
        "character": null,
        "next": "day5_ending_ghost_epilogue_1"
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
        unskippable: true,
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
        background: "ending_complicit",
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
        unskippable: true,
        next: "day5_ending_complicit_12"
    },
    // ── 에필로그 ──
    "day5_ending_complicit_12": {
        background: "school_gate_morning",
        bgm: null,
        character: null,
        unskippable: true,
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
        characters: { left: "eunsu_normal", right: "seolhwa_quiet" },
        background: "corridor",
        character: null,
        next: "day5_ending_complicit_18"
    },
    "day5_ending_complicit_18": {
        "character": null,
        "next": "day5_ending_complicit_epilogue_1"
    },
    "day5_ending_complicit_title": {
        character: null,
        endingTitle: "COMPLICIT END",
        endingSubtitle: "day5_ending_complicit_subtitle",
        unskippable: true,
        glitch: {
            textReplace: {
                ko: { from: "졸업하지 못한 교실", to: "졸업시키지 않는 교실" },
                en: { from: "The Classroom That Never Graduates", to: "The Classroom That Refuses Graduation" },
                ja: { from: "卒業できない教室", to: "卒業させない教室" },
                es: { from: "El Aula Sin Graduación", to: "El aula que no deja graduarse" },
                fr: { from: "La classe sans diplôme", to: "La classe qui refuse le diplome" },
                de: { from: "Das Klassenzimmer ohne Abschluss", to: "Das Klassenzimmer, das keinen Abschluss erlaubt" },
                pt: { from: "A Sala de Aula Sem Formatura", to: "A sala que recusa a formatura" },
                zh: { from: "无法毕业的教室", to: "不让人毕业的教室" }
            },
            endingCreditSaveUI: "COMPLICIT"
        },
        metaEffect: "complicitSlot",
        next: null
    },
    "day5_night_seolhwa_affinity_check": {
        "affinityChar": "seolhwa",
        "affinityBranches": [
            {
                "minAffinity": 25,
                "next": "day5_night_set_high_seolhwa_affinity"
            },
            {
                "minAffinity": -100,
                "next": "day5_night_complicit_eval"
            }
        ]
    },
    "day5_night_set_high_seolhwa_affinity": {
        "autoAdvance": true,
        "next": "day5_night_complicit_eval",
        "setFlags": [
            "high_seolhwa_affinity"
        ]
    },
    "day5_ending_true_voice_check": {
        "affinityChar": "seolhwa",
        "affinityBranches": [
            {
                "minAffinity": 25,
                "next": "day5_ending_true_16_clear_intro"
            },
            {
                "minAffinity": -100,
                "next": "day5_ending_true_16"
            }
        ]
    },
    "day5_ending_true_16_clear_intro": {
        "character": null,
        "next": "day5_ending_true_16_clear",
        "setFlags": [
            "high_seolhwa_affinity"
        ]
    },
    "day5_ending_true_16_clear": {
        "character": "seolhwa_normal",
        "next": "day5_ending_true_17",
        "charOpacity": 0.9,
        "voicePreset": "seolhwa_clear"
    },
    "day5_ending_true_riin_check": {
        "autoAdvance": true,
        "next": "day5_ending_true_sea_check",
        "branches": [
            {
                "condition": "riin_companion",
                "next": "day5_ending_true_27_riin"
            }
        ]
    },
    "day5_ending_true_27_riin": {
        "character": null,
        "next": "day5_ending_true_27_riin_2"
    },
    "day5_ending_true_27_riin_2": {
        "character": null,
        "next": "day5_ending_true_sea_check"
    },
    "day5_ending_true_sea_check": {
        "autoAdvance": true,
        "next": "day5_ending_true_28",
        "branches": [
            {
                "condition": "sea_companion",
                "next": "day5_ending_true_27_sea"
            }
        ]
    },
    "day5_ending_true_27_sea": {
        "character": null,
        "next": "day5_ending_true_27_sea_2"
    },
    "day5_ending_true_27_sea_2": {
        "character": null,
        "next": "day5_ending_true_28"
    },
    "day5_ending_true_memory_check": {
        "autoAdvance": true,
        "next": "day5_ending_true_31",
        "branches": [
            {
                "condition": "high_seolhwa_affinity",
                "next": "day5_ending_true_30_memory"
            }
        ]
    },
    "day5_ending_true_30_memory": {
        "character": null,
        "next": "day5_ending_true_31"
    },
    "day5_ending_escape_riin_check": {
        "autoAdvance": true,
        "next": "day5_ending_escape_sea_check",
        "branches": [
            {
                "condition": "riin_companion",
                "next": "day5_ending_escape_riin"
            }
        ]
    },
    "day5_ending_escape_riin": {
        "character": null,
        "next": "day5_ending_escape_riin_after_1"
    },
    "day5_ending_escape_sea_check": {
        "autoAdvance": true,
        "next": "day5_ending_escape_14",
        "branches": [
            {
                "condition": "sea_companion",
                "next": "day5_ending_escape_sea"
            }
        ]
    },
    "day5_ending_escape_sea": {
        "character": null,
        "next": "day5_ending_escape_sea_after_1"
    }
});

// Expansion work order 2026-10-16
Object.assign(SCENARIO[5], {
    "day5_ending_cage_sea_epilogue_1": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_2"
    },
    "day5_ending_cage_sea_epilogue_2": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_3"
    },
    "day5_ending_cage_sea_epilogue_3": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_4"
    },
    "day5_ending_cage_sea_epilogue_4": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_5"
    },
    "day5_ending_cage_sea_epilogue_5": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_6"
    },
    "day5_ending_cage_sea_epilogue_6": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_7"
    },
    "day5_ending_cage_sea_epilogue_7": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_8"
    },
    "day5_ending_cage_sea_epilogue_8": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_9"
    },
    "day5_ending_cage_sea_epilogue_9": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_10"
    },
    "day5_ending_cage_sea_epilogue_10": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_11"
    },
    "day5_ending_cage_sea_epilogue_11": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_epilogue_12"
    },
    "day5_ending_cage_sea_epilogue_12": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_inside_choice"
    },
    "day5_ending_cage_sea_inside_choice": {
        "choices": [
            {
                "next": "day5_ending_cage_sea_window_1"
            },
            {
                "next": "day5_ending_cage_sea_hand_1"
            }
        ]
    },
    "day5_ending_cage_sea_window_1": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_window_2"
    },
    "day5_ending_cage_sea_window_2": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_window_3"
    },
    "day5_ending_cage_sea_window_3": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_window_4"
    },
    "day5_ending_cage_sea_window_4": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_window_5"
    },
    "day5_ending_cage_sea_window_5": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_close_1"
    },
    "day5_ending_cage_sea_hand_1": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_hand_2"
    },
    "day5_ending_cage_sea_hand_2": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_hand_3"
    },
    "day5_ending_cage_sea_hand_3": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_hand_4"
    },
    "day5_ending_cage_sea_hand_4": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_hand_5"
    },
    "day5_ending_cage_sea_hand_5": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_close_1"
    },
    "day5_ending_cage_sea_close_1": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_close_2"
    },
    "day5_ending_cage_sea_close_2": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_sea_close_3"
    },
    "day5_ending_cage_sea_close_3": {
        "background": "ending_cage_sea",
        "character": null,
        "next": "day5_ending_cage_title"
    },
    "day5_ending_cage_eunsu_epilogue_1": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_2"
    },
    "day5_ending_cage_eunsu_epilogue_2": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_3"
    },
    "day5_ending_cage_eunsu_epilogue_3": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_4"
    },
    "day5_ending_cage_eunsu_epilogue_4": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_5"
    },
    "day5_ending_cage_eunsu_epilogue_5": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_6"
    },
    "day5_ending_cage_eunsu_epilogue_6": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_7"
    },
    "day5_ending_cage_eunsu_epilogue_7": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_8"
    },
    "day5_ending_cage_eunsu_epilogue_8": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_9"
    },
    "day5_ending_cage_eunsu_epilogue_9": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_10"
    },
    "day5_ending_cage_eunsu_epilogue_10": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_11"
    },
    "day5_ending_cage_eunsu_epilogue_11": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_12"
    },
    "day5_ending_cage_eunsu_epilogue_12": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_13"
    },
    "day5_ending_cage_eunsu_epilogue_13": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_14"
    },
    "day5_ending_cage_eunsu_epilogue_14": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_15"
    },
    "day5_ending_cage_eunsu_epilogue_15": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_16"
    },
    "day5_ending_cage_eunsu_epilogue_16": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_17"
    },
    "day5_ending_cage_eunsu_epilogue_17": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_18"
    },
    "day5_ending_cage_eunsu_epilogue_18": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_19"
    },
    "day5_ending_cage_eunsu_epilogue_19": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_20"
    },
    "day5_ending_cage_eunsu_epilogue_20": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_21"
    },
    "day5_ending_cage_eunsu_epilogue_21": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_22"
    },
    "day5_ending_cage_eunsu_epilogue_22": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_23"
    },
    "day5_ending_cage_eunsu_epilogue_23": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_24"
    },
    "day5_ending_cage_eunsu_epilogue_24": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_25"
    },
    "day5_ending_cage_eunsu_epilogue_25": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_26"
    },
    "day5_ending_cage_eunsu_epilogue_26": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_eunsu_epilogue_27"
    },
    "day5_ending_cage_eunsu_epilogue_27": {
        "background": "ending_cage_eunsu",
        "character": null,
        "next": "day5_ending_cage_title"
    },
    "day5_ending_escape_epilogue_1": {
        "background": "new_place",
        "character": "yuna_weak",
        "next": "day5_ending_escape_epilogue_2"
    },
    "day5_ending_escape_epilogue_2": {
        "background": "new_place",
        "character": "yuna_weak",
        "next": "day5_ending_escape_epilogue_3"
    },
    "day5_ending_escape_epilogue_3": {
        "background": "new_place",
        "character": "yuna_weak",
        "next": "day5_ending_escape_epilogue_4"
    },
    "day5_ending_escape_epilogue_4": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_5"
    },
    "day5_ending_escape_epilogue_5": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_6"
    },
    "day5_ending_escape_epilogue_6": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_7"
    },
    "day5_ending_escape_epilogue_7": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_8"
    },
    "day5_ending_escape_epilogue_8": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_9"
    },
    "day5_ending_escape_epilogue_9": {
        "background": "new_place",
        "character": "yuna_scared",
        "next": "day5_ending_escape_epilogue_10"
    },
    "day5_ending_escape_epilogue_10": {
        "background": "new_place",
        "character": "yuna_scared",
        "next": "day5_ending_escape_epilogue_11"
    },
    "day5_ending_escape_epilogue_11": {
        "background": "new_place",
        "character": "yuna_scared",
        "next": "day5_ending_escape_epilogue_12"
    },
    "day5_ending_escape_epilogue_12": {
        "background": "new_place",
        "character": "yuna_scared",
        "next": "day5_ending_escape_epilogue_13"
    },
    "day5_ending_escape_epilogue_13": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_14"
    },
    "day5_ending_escape_epilogue_14": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_15"
    },
    "day5_ending_escape_epilogue_15": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_16"
    },
    "day5_ending_escape_epilogue_16": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_17"
    },
    "day5_ending_escape_epilogue_17": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_18",
        "branches": [
            {
                "condition": "found_washed_note",
                "next": "day5_history_callback_37"
            }
        ]
    },
    "day5_ending_escape_epilogue_18": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_19"
    },
    "day5_ending_escape_epilogue_19": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_20"
    },
    "day5_ending_escape_epilogue_20": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_21"
    },
    "day5_ending_escape_epilogue_21": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_22"
    },
    "day5_ending_escape_epilogue_22": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_23"
    },
    "day5_ending_escape_epilogue_23": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_24"
    },
    "day5_ending_escape_epilogue_24": {
        "background": "new_place",
        "character": "yuna_normal",
        "choices": [
            {
                "next": "day5_expansion_action_10_a"
            },
            {
                "next": "day5_expansion_action_10_b"
            },
            {
                "next": "day5_ending_escape_epilogue_25"
            }
        ]
    },
    "day5_ending_escape_epilogue_25": {
        "background": "new_place",
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_26"
    },
    "day5_ending_escape_epilogue_26": {
        "background": "new_place",
        "character": "yuna_smile",
        "next": "day5_ending_escape_epilogue_27"
    },
    "day5_ending_escape_epilogue_27": {
        "background": "new_place",
        "character": "yuna_smile",
        "next": "day5_ending_escape_epilogue_28"
    },
    "day5_ending_escape_epilogue_28": {
        "background": "new_place",
        "character": "yuna_smile",
        "next": "day5_ending_escape_epilogue_29"
    },
    "day5_ending_escape_epilogue_29": {
        "background": "new_place",
        "character": "yuna_smile",
        "next": "day5_ending_escape_epilogue_30"
    },
    "day5_ending_escape_epilogue_30": {
        "background": "new_place",
        "character": "yuna_smile",
        "next": "day5_ending_escape_title"
    },
    "day5_ending_escape_riin_after_1": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_riin_after_2"
    },
    "day5_ending_escape_riin_after_2": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_riin_after_3"
    },
    "day5_ending_escape_riin_after_3": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_riin_after_4"
    },
    "day5_ending_escape_riin_after_4": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_riin_after_5"
    },
    "day5_ending_escape_riin_after_5": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_riin_after_6"
    },
    "day5_ending_escape_riin_after_6": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_riin_after_7"
    },
    "day5_ending_escape_riin_after_7": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_riin_after_8"
    },
    "day5_ending_escape_riin_after_8": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_riin_after_9"
    },
    "day5_ending_escape_riin_after_9": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_sea_check"
    },
    "day5_ending_escape_sea_after_1": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_sea_after_2"
    },
    "day5_ending_escape_sea_after_2": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_sea_after_3"
    },
    "day5_ending_escape_sea_after_3": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_sea_after_4"
    },
    "day5_ending_escape_sea_after_4": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_sea_after_5"
    },
    "day5_ending_escape_sea_after_5": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_sea_after_6"
    },
    "day5_ending_escape_sea_after_6": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_sea_after_7"
    },
    "day5_ending_escape_sea_after_7": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_sea_after_8"
    },
    "day5_ending_escape_sea_after_8": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_sea_after_9"
    },
    "day5_ending_escape_sea_after_9": {
        "character": "yuna_scared",
        "next": "day5_ending_escape_14"
    },
    "day5_ending_resist_epilogue_1": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_2"
    },
    "day5_ending_resist_epilogue_2": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_3"
    },
    "day5_ending_resist_epilogue_3": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_4"
    },
    "day5_ending_resist_epilogue_4": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_5"
    },
    "day5_ending_resist_epilogue_5": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_6"
    },
    "day5_ending_resist_epilogue_6": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_7"
    },
    "day5_ending_resist_epilogue_7": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_8"
    },
    "day5_ending_resist_epilogue_8": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_9"
    },
    "day5_ending_resist_epilogue_9": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_10"
    },
    "day5_ending_resist_epilogue_10": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_11"
    },
    "day5_ending_resist_epilogue_11": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_12"
    },
    "day5_ending_resist_epilogue_12": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_13"
    },
    "day5_ending_resist_epilogue_13": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_14"
    },
    "day5_ending_resist_epilogue_14": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_15"
    },
    "day5_ending_resist_epilogue_15": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_16"
    },
    "day5_ending_resist_epilogue_16": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_17"
    },
    "day5_ending_resist_epilogue_17": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_18"
    },
    "day5_ending_resist_epilogue_18": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_19"
    },
    "day5_ending_resist_epilogue_19": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_20"
    },
    "day5_ending_resist_epilogue_20": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_21"
    },
    "day5_ending_resist_epilogue_21": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_22"
    },
    "day5_ending_resist_epilogue_22": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_23"
    },
    "day5_ending_resist_epilogue_23": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_24"
    },
    "day5_ending_resist_epilogue_24": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_25"
    },
    "day5_ending_resist_epilogue_25": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_epilogue_26"
    },
    "day5_ending_resist_epilogue_26": {
        "background": "dawn_road",
        "character": "eunsu_crying",
        "next": "day5_ending_resist_title"
    },
    "day5_ending_forget_epilogue_1": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_2"
    },
    "day5_ending_forget_epilogue_2": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_3"
    },
    "day5_ending_forget_epilogue_3": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_4"
    },
    "day5_ending_forget_epilogue_4": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_5"
    },
    "day5_ending_forget_epilogue_5": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_6",
        "glitch": {
            "memoryFlash": {
                "background": "cg_cycle07_seolhwa",
                "duration": 450
            }
        }
    },
    "day5_ending_forget_epilogue_6": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_7"
    },
    "day5_ending_forget_epilogue_7": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_8"
    },
    "day5_ending_forget_epilogue_8": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_9"
    },
    "day5_ending_forget_epilogue_9": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_10",
        "glitch": {
            "memoryFlash": {
                "background": "cg_cycle12_yuna",
                "duration": 450
            }
        }
    },
    "day5_ending_forget_epilogue_10": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_11"
    },
    "day5_ending_forget_epilogue_11": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_12"
    },
    "day5_ending_forget_epilogue_12": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_13",
        "glitch": {
            "memoryFlash": {
                "background": "cg_cycle07_seolhwa",
                "duration": 450
            }
        }
    },
    "day5_ending_forget_epilogue_13": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_14"
    },
    "day5_ending_forget_epilogue_14": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_15"
    },
    "day5_ending_forget_epilogue_15": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_16",
        "glitch": {
            "memoryFlash": {
                "background": "cg_cycle12_yuna",
                "duration": 450
            }
        }
    },
    "day5_ending_forget_epilogue_16": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_17"
    },
    "day5_ending_forget_epilogue_17": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_18"
    },
    "day5_ending_forget_epilogue_18": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_19"
    },
    "day5_ending_forget_epilogue_19": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_20"
    },
    "day5_ending_forget_epilogue_20": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_21"
    },
    "day5_ending_forget_epilogue_21": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_22"
    },
    "day5_ending_forget_epilogue_22": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_23"
    },
    "day5_ending_forget_epilogue_23": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_24"
    },
    "day5_ending_forget_epilogue_24": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_epilogue_25"
    },
    "day5_ending_forget_epilogue_25": {
        "background": "classroom",
        "character": null,
        "next": "day5_ending_forget_15"
    },
    "day5_ending_ghost_epilogue_1": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_2"
    },
    "day5_ending_ghost_epilogue_2": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_3"
    },
    "day5_ending_ghost_epilogue_3": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_4"
    },
    "day5_ending_ghost_epilogue_4": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_5"
    },
    "day5_ending_ghost_epilogue_5": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_6"
    },
    "day5_ending_ghost_epilogue_6": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_7"
    },
    "day5_ending_ghost_epilogue_7": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_8"
    },
    "day5_ending_ghost_epilogue_8": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_9",
        "glitch": {
            "memoryFlash": {
                "background": "cg_cycle07_seolhwa",
                "duration": 450
            }
        }
    },
    "day5_ending_ghost_epilogue_9": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_10"
    },
    "day5_ending_ghost_epilogue_10": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_11"
    },
    "day5_ending_ghost_epilogue_11": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_12",
        "glitch": {
            "memoryFlash": {
                "background": "cg_cycle12_yuna",
                "duration": 450
            }
        }
    },
    "day5_ending_ghost_epilogue_12": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_13"
    },
    "day5_ending_ghost_epilogue_13": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_14"
    },
    "day5_ending_ghost_epilogue_14": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_15"
    },
    "day5_ending_ghost_epilogue_15": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_16"
    },
    "day5_ending_ghost_epilogue_16": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_17"
    },
    "day5_ending_ghost_epilogue_17": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_18"
    },
    "day5_ending_ghost_epilogue_18": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_19"
    },
    "day5_ending_ghost_epilogue_19": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_20",
        "branches": [
            {
                "condition": "deduced_full_truth",
                "next": "day5_history_callback_38"
            }
        ]
    },
    "day5_ending_ghost_epilogue_20": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_21"
    },
    "day5_ending_ghost_epilogue_21": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_22"
    },
    "day5_ending_ghost_epilogue_22": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_23"
    },
    "day5_ending_ghost_epilogue_23": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_24"
    },
    "day5_ending_ghost_epilogue_24": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_epilogue_25"
    },
    "day5_ending_ghost_epilogue_25": {
        "background": "dawn_road",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_ending_ghost_title"
    },
    "day5_ending_complicit_epilogue_1": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_2"
    },
    "day5_ending_complicit_epilogue_2": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_3"
    },
    "day5_ending_complicit_epilogue_3": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_4"
    },
    "day5_ending_complicit_epilogue_4": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_5"
    },
    "day5_ending_complicit_epilogue_5": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_6",
        "glitch": {
            "memoryFlash": {
                "background": "cg_cycle07_seolhwa",
                "duration": 450
            }
        }
    },
    "day5_ending_complicit_epilogue_6": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_7"
    },
    "day5_ending_complicit_epilogue_7": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_8"
    },
    "day5_ending_complicit_epilogue_8": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_9"
    },
    "day5_ending_complicit_epilogue_9": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_10"
    },
    "day5_ending_complicit_epilogue_10": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_11"
    },
    "day5_ending_complicit_epilogue_11": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_epilogue_12",
        "branches": [
            {
                "condition": "deduced_full_truth",
                "next": "day5_history_callback_39"
            }
        ]
    },
    "day5_ending_complicit_epilogue_12": {
        "background": "ending_complicit_monitors",
        "character": null,
        "bgm": "complicit_cold_pulse.mp3",
        "next": "day5_ending_complicit_control_choice"
    },
    "day5_ending_complicit_control_choice": {
        "choices": [
            {
                "next": "day5_ending_complicit_low_1",
                "setFlags": [
                    "complicit_reduced_dose"
                ]
            },
            {
                "next": "day5_ending_complicit_same_1",
                "setFlags": [
                    "complicit_kept_dose"
                ]
            },
            {
                "next": "day5_ending_complicit_high_1",
                "setFlags": [
                    "complicit_increased_dose"
                ]
            }
        ]
    },
    "day5_ending_complicit_low_1": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_low_2"
    },
    "day5_ending_complicit_low_2": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_low_3"
    },
    "day5_ending_complicit_low_3": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_low_4"
    },
    "day5_ending_complicit_low_4": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_low_5"
    },
    "day5_ending_complicit_low_5": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_close_1"
    },
    "day5_ending_complicit_same_1": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_same_2"
    },
    "day5_ending_complicit_same_2": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_same_3"
    },
    "day5_ending_complicit_same_3": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_same_4"
    },
    "day5_ending_complicit_same_4": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_same_5"
    },
    "day5_ending_complicit_same_5": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_close_1"
    },
    "day5_ending_complicit_high_1": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_high_2"
    },
    "day5_ending_complicit_high_2": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_high_3"
    },
    "day5_ending_complicit_high_3": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_high_4"
    },
    "day5_ending_complicit_high_4": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_high_5"
    },
    "day5_ending_complicit_high_5": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_close_1"
    },
    "day5_ending_complicit_close_1": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_close_2"
    },
    "day5_ending_complicit_close_2": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_close_3"
    },
    "day5_ending_complicit_close_3": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_close_4"
    },
    "day5_ending_complicit_close_4": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_close_5"
    },
    "day5_ending_complicit_close_5": {
        "background": "ending_complicit_monitors",
        "character": null,
        "next": "day5_ending_complicit_title"
    },
    "day5_archive_cycle07_1": {
        "background": "old_building_corridor",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_2",
        "charOpacity": 1
    },
    "day5_archive_cycle07_2": {
        "background": "old_building_corridor",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_3",
        "charOpacity": 1
    },
    "day5_archive_cycle07_3": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_4",
        "charOpacity": 1
    },
    "day5_archive_cycle07_4": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_5",
        "charOpacity": 1
    },
    "day5_archive_cycle07_5": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_6",
        "charOpacity": 1
    },
    "day5_archive_cycle07_6": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_7",
        "charOpacity": 1
    },
    "day5_archive_cycle07_7": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_8",
        "charOpacity": 1
    },
    "day5_archive_cycle07_8": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_9",
        "charOpacity": 1
    },
    "day5_archive_cycle07_9": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_10",
        "charOpacity": 1
    },
    "day5_archive_cycle07_10": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_11",
        "charOpacity": 1
    },
    "day5_archive_cycle07_11": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_12",
        "charOpacity": 1
    },
    "day5_archive_cycle07_12": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_13",
        "charOpacity": 1
    },
    "day5_archive_cycle07_13": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_14",
        "charOpacity": 1
    },
    "day5_archive_cycle07_14": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_15",
        "charOpacity": 1
    },
    "day5_archive_cycle07_15": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_16",
        "charOpacity": 1
    },
    "day5_archive_cycle07_16": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_17",
        "charOpacity": 1
    },
    "day5_archive_cycle07_17": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_18",
        "charOpacity": 1
    },
    "day5_archive_cycle07_18": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_19",
        "charOpacity": 1
    },
    "day5_archive_cycle07_19": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_20",
        "charOpacity": 1
    },
    "day5_archive_cycle07_20": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_21",
        "charOpacity": 1
    },
    "day5_archive_cycle07_21": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_22",
        "charOpacity": 1
    },
    "day5_archive_cycle07_22": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_23",
        "charOpacity": 1
    },
    "day5_archive_cycle07_23": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_24",
        "charOpacity": 1
    },
    "day5_archive_cycle07_24": {
        "background": "old_building_corridor",
        "character": "seolhwa_normal",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_25",
        "charOpacity": 1
    },
    "day5_archive_cycle07_25": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_26",
        "charOpacity": 1
    },
    "day5_archive_cycle07_26": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_27",
        "charOpacity": 1
    },
    "day5_archive_cycle07_27": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_28",
        "charOpacity": 1,
        "glitch": {
            "chaseFootsteps": {
                "fromPan": -0.9,
                "toPan": 0.9,
                "steps": 8,
                "interval": 220
            }
        }
    },
    "day5_archive_cycle07_28": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_29",
        "charOpacity": 1
    },
    "day5_archive_cycle07_29": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_30",
        "charOpacity": 1
    },
    "day5_archive_cycle07_30": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_31",
        "charOpacity": 1
    },
    "day5_archive_cycle07_31": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_32",
        "charOpacity": 1
    },
    "day5_archive_cycle07_32": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_33",
        "charOpacity": 1
    },
    "day5_archive_cycle07_33": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_34",
        "charOpacity": 1
    },
    "day5_archive_cycle07_34": {
        "background": "underground_lab",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_35",
        "charOpacity": 1
    },
    "day5_archive_cycle07_35": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_36",
        "charOpacity": 1,
        "rain": true,
        "sfx": {
            "file": "sfx_rain_loop.mp3",
            "loop": true
        }
    },
    "day5_archive_cycle07_36": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_37",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_37": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_38",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_38": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_39",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_39": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_40",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_40": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_41",
        "charOpacity": 1,
        "rain": true,
        "glitch": {
            "chaseFootsteps": {
                "fromPan": -0.9,
                "toPan": 0.9,
                "steps": 8,
                "interval": 220
            }
        }
    },
    "day5_archive_cycle07_41": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_42",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_42": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_43",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_43": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_44",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_44": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_45",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_45": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_46",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_46": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_47",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_47": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_48",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_48": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_49",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_49": {
        "background": "emergency_exit",
        "character": "seolhwa_warning",
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_50",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_50": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_51",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_51": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_52",
        "charOpacity": 1,
        "rain": true,
        "glitch": {
            "panSFX": "sfx_whisper_seolhwa",
            "pan": -0.85
        }
    },
    "day5_archive_cycle07_52": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_53",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_53": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_54",
        "charOpacity": 1,
        "rain": true,
        "glitch": {
            "panSFX": "sfx_whisper_seolhwa",
            "pan": -0.85
        }
    },
    "day5_archive_cycle07_54": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_55",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_55": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_56",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_56": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_57",
        "charOpacity": 1,
        "rain": true,
        "glitch": {
            "chaseFootsteps": {
                "fromPan": -0.9,
                "toPan": 0.9,
                "steps": 8,
                "interval": 220
            }
        }
    },
    "day5_archive_cycle07_57": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_58",
        "charOpacity": 1,
        "rain": true,
        "glitch": {
            "panSFX": "sfx_whisper_seolhwa",
            "pan": -0.85
        }
    },
    "day5_archive_cycle07_58": {
        "background": "cg_cycle07_seolhwa",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_59",
        "charOpacity": 1,
        "rain": true
    },
    "day5_archive_cycle07_59": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_60",
        "charOpacity": 1
    },
    "day5_archive_cycle07_60": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_61",
        "charOpacity": 1,
        "glitch": {
            "chaseFootsteps": {
                "fromPan": -0.9,
                "toPan": 0.9,
                "steps": 8,
                "interval": 220
            }
        }
    },
    "day5_archive_cycle07_61": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_62",
        "charOpacity": 1
    },
    "day5_archive_cycle07_62": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_63",
        "charOpacity": 1
    },
    "day5_archive_cycle07_63": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_64",
        "charOpacity": 1
    },
    "day5_archive_cycle07_64": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_65",
        "charOpacity": 1,
        "glitch": {
            "panSFX": "sfx_whisper_seolhwa",
            "pan": -0.85
        }
    },
    "day5_archive_cycle07_65": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_66",
        "charOpacity": 1
    },
    "day5_archive_cycle07_66": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_67",
        "charOpacity": 1
    },
    "day5_archive_cycle07_67": {
        "background": "emergency_exit",
        "character": null,
        "bgm": "cycle07_elegy.mp3",
        "next": "day5_archive_cycle07_68",
        "charOpacity": 1
    },
    "day5_archive_cycle07_68": {
        "background": "black",
        "character": null,
        "bgm": "seolhwa_theme_broken.mp3",
        "next": "day5_archive_cycle07_69",
        "charOpacity": 1,
        "stopSfx": true
    },
    "day5_archive_cycle07_69": {
        "background": "black",
        "character": null,
        "bgm": "seolhwa_theme_broken.mp3",
        "next": "day5_archive_cycle07_70",
        "charOpacity": 1
    },
    "day5_archive_cycle07_70": {
        "background": "black",
        "character": null,
        "bgm": "seolhwa_theme_broken.mp3",
        "next": "day5_archive_cycle07_71",
        "charOpacity": 1,
        "glitch": {
            "panSFX": "sfx_whisper_seolhwa",
            "pan": -0.85
        }
    },
    "day5_archive_cycle07_71": {
        "background": "black",
        "character": null,
        "bgm": "seolhwa_theme_broken.mp3",
        "next": "day5_archive_cycle07_72",
        "charOpacity": 1
    },
    "day5_archive_cycle07_72": {
        "background": "black",
        "character": null,
        "bgm": "seolhwa_theme_broken.mp3",
        "next": "day5_archive_cycle07_73",
        "charOpacity": 1
    },
    "day5_archive_cycle07_73": {
        "background": "black",
        "character": null,
        "bgm": "seolhwa_theme_broken.mp3",
        "next": "day5_archive_cycle07_74",
        "charOpacity": 1
    },
    "day5_archive_cycle07_74": {
        "background": "black",
        "character": null,
        "bgm": "seolhwa_theme_broken.mp3",
        "next": "day5_archive_cycle07_75",
        "charOpacity": 1
    },
    "day5_archive_cycle07_75": {
        "background": "black",
        "character": null,
        "bgm": null,
        "next": "day5_xover_server_4",
        "charOpacity": 1
    },
    "day5_archive_cycle12_1": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_2"
    },
    "day5_archive_cycle12_2": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_3"
    },
    "day5_archive_cycle12_3": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_4"
    },
    "day5_archive_cycle12_4": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_5"
    },
    "day5_archive_cycle12_5": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_6"
    },
    "day5_archive_cycle12_6": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_7"
    },
    "day5_archive_cycle12_7": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_8"
    },
    "day5_archive_cycle12_8": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_9"
    },
    "day5_archive_cycle12_9": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_10"
    },
    "day5_archive_cycle12_10": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_11"
    },
    "day5_archive_cycle12_11": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_12"
    },
    "day5_archive_cycle12_12": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_13"
    },
    "day5_archive_cycle12_13": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_14"
    },
    "day5_archive_cycle12_14": {
        "background": "photo_club_room",
        "character": "yuna_normal",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_15"
    },
    "day5_archive_cycle12_15": {
        "background": "photo_club_room",
        "character": "yuna_scared",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_16"
    },
    "day5_archive_cycle12_16": {
        "background": "photo_club_room",
        "character": "yuna_scared",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_17"
    },
    "day5_archive_cycle12_17": {
        "background": "photo_club_room",
        "character": "yuna_scared",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_18"
    },
    "day5_archive_cycle12_18": {
        "background": "photo_club_room",
        "character": "yuna_serious",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_19"
    },
    "day5_archive_cycle12_19": {
        "background": "photo_club_room",
        "character": "yuna_serious",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_20"
    },
    "day5_archive_cycle12_20": {
        "background": "photo_club_room",
        "character": "yuna_serious",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_21"
    },
    "day5_archive_cycle12_21": {
        "background": "photo_club_room",
        "character": "yuna_serious",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_22"
    },
    "day5_archive_cycle12_22": {
        "background": "photo_club_room",
        "character": "yuna_serious",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_23"
    },
    "day5_archive_cycle12_23": {
        "background": "photo_club_room",
        "character": "yuna_serious",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_24"
    },
    "day5_archive_cycle12_24": {
        "background": "photo_club_room",
        "character": "yuna_scared",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_25"
    },
    "day5_archive_cycle12_25": {
        "background": "photo_club_room",
        "character": "yuna_scared",
        "bgm": "yuna_theme.mp3",
        "next": "day5_archive_cycle12_26"
    },
    "day5_archive_cycle12_26": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_27"
    },
    "day5_archive_cycle12_27": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_28"
    },
    "day5_archive_cycle12_28": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_29"
    },
    "day5_archive_cycle12_29": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_30"
    },
    "day5_archive_cycle12_30": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_31"
    },
    "day5_archive_cycle12_31": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_32"
    },
    "day5_archive_cycle12_32": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_33"
    },
    "day5_archive_cycle12_33": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_34"
    },
    "day5_archive_cycle12_34": {
        "background": "nurse_office",
        "character": "riin_startled",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_35"
    },
    "day5_archive_cycle12_35": {
        "background": "nurse_office",
        "character": "riin_startled",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_36"
    },
    "day5_archive_cycle12_36": {
        "background": "nurse_office",
        "character": "riin_startled",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_37"
    },
    "day5_archive_cycle12_37": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_38"
    },
    "day5_archive_cycle12_38": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_39"
    },
    "day5_archive_cycle12_39": {
        "background": "nurse_office",
        "character": "riin_pain",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_40",
        "glitch": {
            "drugBlur": true,
            "drugBlurDuration": 800
        }
    },
    "day5_archive_cycle12_40": {
        "background": "old_basement_door",
        "character": "yuna_scared",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_41",
        "glitch": {
            "drugBlur": true,
            "drugBlurDuration": 800
        }
    },
    "day5_archive_cycle12_41": {
        "background": "old_basement_door",
        "character": "yuna_scared",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_42"
    },
    "day5_archive_cycle12_42": {
        "background": "old_basement_door",
        "character": "yuna_scared",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_43"
    },
    "day5_archive_cycle12_43": {
        "background": "old_basement_door",
        "character": "yuna_scared",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_44"
    },
    "day5_archive_cycle12_44": {
        "background": "old_basement_door",
        "character": "yuna_scared",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_45"
    },
    "day5_archive_cycle12_45": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_46"
    },
    "day5_archive_cycle12_46": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_47"
    },
    "day5_archive_cycle12_47": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_48"
    },
    "day5_archive_cycle12_48": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_49",
        "glitch": {
            "drugBlur": true,
            "drugBlurDuration": 800
        }
    },
    "day5_archive_cycle12_49": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_50"
    },
    "day5_archive_cycle12_50": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_51"
    },
    "day5_archive_cycle12_51": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_52"
    },
    "day5_archive_cycle12_52": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_53"
    },
    "day5_archive_cycle12_53": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_54"
    },
    "day5_archive_cycle12_54": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_55"
    },
    "day5_archive_cycle12_55": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_56",
        "glitch": {
            "drugBlur": true,
            "drugBlurDuration": 800
        }
    },
    "day5_archive_cycle12_56": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_57"
    },
    "day5_archive_cycle12_57": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_58"
    },
    "day5_archive_cycle12_58": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_59"
    },
    "day5_archive_cycle12_59": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_60"
    },
    "day5_archive_cycle12_60": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_61"
    },
    "day5_archive_cycle12_61": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_62",
        "glitch": {
            "drugBlur": true,
            "drugBlurDuration": 800
        }
    },
    "day5_archive_cycle12_62": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_63"
    },
    "day5_archive_cycle12_63": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_64"
    },
    "day5_archive_cycle12_64": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_65"
    },
    "day5_archive_cycle12_65": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_66",
        "glitch": {
            "drugBlur": true,
            "drugBlurDuration": 800
        }
    },
    "day5_archive_cycle12_66": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_67"
    },
    "day5_archive_cycle12_67": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_68"
    },
    "day5_archive_cycle12_68": {
        "background": "cg_cycle12_yuna",
        "character": null,
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_69"
    },
    "day5_archive_cycle12_69": {
        "background": "old_basement_door",
        "character": "eunsu_cold",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_70"
    },
    "day5_archive_cycle12_70": {
        "background": "old_basement_door",
        "character": "eunsu_cold",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_71"
    },
    "day5_archive_cycle12_71": {
        "background": "old_basement_door",
        "character": "eunsu_cold",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_72"
    },
    "day5_archive_cycle12_72": {
        "background": "old_basement_door",
        "character": "eunsu_cold",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_73"
    },
    "day5_archive_cycle12_73": {
        "background": "old_basement_door",
        "character": "eunsu_cold",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_74"
    },
    "day5_archive_cycle12_74": {
        "background": "old_basement_door",
        "character": "eunsu_cold",
        "bgm": "tension_night.mp3",
        "next": "day5_archive_cycle12_75"
    },
    "day5_archive_cycle12_75": {
        "background": "black",
        "character": null,
        "bgm": null,
        "next": "day5_archive_cycle12_76"
    },
    "day5_archive_cycle12_76": {
        "background": "black",
        "character": null,
        "bgm": null,
        "next": "day5_xover_server_4"
    },
    "day5_history_callback_37": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_18"
    },
    "day5_history_callback_38": {
        "character": null,
        "next": "day5_ending_ghost_epilogue_20"
    },
    "day5_history_callback_39": {
        "character": null,
        "next": "day5_ending_complicit_epilogue_12"
    },
    "day5_expansion_action_10_a": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_25"
    },
    "day5_expansion_action_10_b": {
        "character": "yuna_normal",
        "next": "day5_ending_escape_epilogue_25"
    }
});
