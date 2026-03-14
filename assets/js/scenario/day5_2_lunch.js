/**
 * Day 5-2: Lunch - 추격전, 세아/리인 조우, 설화의 개입, 은수 최종 대면.
 * BGM: chase.mp3 -> seolhwa_theme_broken.mp3 -> confrontation.mp3
 * 타이머 선택지 다수. SCENARIO.md lines 3648-4157 기반 완전 재작성.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

Object.assign(SCENARIO[5], {

    // ══════════════════════════════════════
    // 진입점: 아침에서 점심으로 전환
    // ══════════════════════════════════════
    "day5_lunch_start": {
        next: "day5_lunch_chase_1"
    },

    // ══════════════════════════════════════
    // 추격전 - 교실 탈출, 복도, PA 방송
    // ══════════════════════════════════════
    "day5_lunch_chase_1": {
        background: "corridor",
        bgm: "chase.mp3",
        character: null,
        glitch: { screenShake: true, noise: true },
        next: "day5_lunch_chase_2"
    },
    "day5_lunch_chase_2": {
        next: "day5_lunch_chase_3"
    },
    "day5_lunch_chase_3": {
        next: "day5_lunch_chase_3a"
    },
    "day5_lunch_chase_3a": {
        next: "day5_lunch_chase_4"
    },
    // PA broadcast - Eunsu
    "day5_lunch_chase_4": {
        character: "eunsu_pa",
        next: "day5_lunch_chase_5"
    },
    "day5_lunch_chase_5": {
        next: "day5_lunch_chase_6"
    },
    "day5_lunch_chase_6": {
        character: null,
        next: "day5_lunch_chase_7"
    },
    "day5_lunch_chase_7": {
        next: "day5_lunch_chase_8"
    },
    "day5_lunch_chase_8": {
        next: "day5_lunch_chase_9"
    },
    // Yuna follows
    "day5_lunch_chase_9": {
        character: "yuna_determined",
        next: "day5_lunch_chase_10"
    },
    // T-junction: 5-sec timer
    "day5_lunch_chase_10": {
        character: null,
        glitch: { screenShake: true },
        timedChoice: 5000,
        choices: [
            { next: "day5_lunch_left_1" },
            { next: "day5_lunch_right_1" }
        ],
        timeoutNext: "day5_lunch_left_1"
    },

    // ══════════════════════════════════════
    // 왼쪽: 세아 — "12번 동안 보내줬어"
    // ══════════════════════════════════════
    "day5_lunch_left_1": {
        background: "corridor_main",
        character: "sea_cry",
        next: "day5_lunch_left_2"
    },
    "day5_lunch_left_2": {
        next: "day5_lunch_left_3"
    },
    "day5_lunch_left_3": {
        next: "day5_lunch_left_4"
    },
    "day5_lunch_left_4": {
        next: "day5_lunch_left_5"
    },
    "day5_lunch_left_5": {
        next: "day5_lunch_left_6"
    },
    // "못 보내. 이번에는 못 보내."
    "day5_lunch_left_6": {
        next: "day5_lunch_left_7"
    },
    "day5_lunch_left_7": {
        next: "day5_lunch_left_8"
    },
    // "나도 알아... 내가 지금 제정신 아닌 거."
    "day5_lunch_left_8": {
        next: "day5_lunch_left_9"
    },
    "day5_lunch_left_9": {
        next: "day5_lunch_left_10"
    },
    // "기억 지우면 또 만날 수 있어."
    "day5_lunch_left_10": {
        next: "day5_lunch_left_11"
    },
    // "1일차에 '안녕하세요' 했을 때"
    "day5_lunch_left_11": {
        next: "day5_lunch_left_12"
    },
    "day5_lunch_left_12": {
        next: "day5_lunch_left_13"
    },
    // 본관 1층 철문 소리
    "day5_lunch_left_13": {
        glitch: { screenShake: true },
        next: "day5_lunch_left_14"
    },
    // "그건 나한테 웃는 게 아니야."
    "day5_lunch_left_14": {
        next: "day5_lunch_left_15"
    },
    "day5_lunch_left_15": {
        next: "day5_lunch_left_16"
    },
    "day5_lunch_left_16": {
        next: "day5_lunch_left_17"
    },
    // "...12번."
    "day5_lunch_left_17": {
        next: "day5_lunch_left_18"
    },
    "day5_lunch_left_18": {
        next: "day5_lunch_left_19"
    },
    "day5_lunch_left_19": {
        next: "day5_lunch_left_20"
    },
    "day5_lunch_left_20": {
        next: "day5_lunch_left_21"
    },
    "day5_lunch_left_21": {
        next: "day5_lunch_left_22"
    },
    // "매번 기억이 지워져서 또 왔어."
    "day5_lunch_left_22": {
        next: "day5_lunch_left_23"
    },
    // 계단 발소리 가까워짐
    "day5_lunch_left_23": {
        glitch: { screenShake: true },
        next: "day5_lunch_left_24"
    },
    "day5_lunch_left_24": {
        next: "day5_lunch_left_25"
    },
    // "...13번째도 비켜줘야 하는 거야?"
    "day5_lunch_left_25": {
        next: "day5_lunch_left_choice"
    },

    // 8초 타이머: 3 choices
    "day5_lunch_left_choice": {
        timedChoice: 8000,
        choices: [
            { next: "day5_lunch_left_c1_1" },
            { next: "day5_lunch_left_c2_1", setFlags: ["sea_companion"] },
            { next: "day5_lunch_left_c3_1", setFlags: ["cage_route_sea"] }
        ],
        timeoutNext: "day5_lunch_left_c1_1"
    },

    // ── 선택 1: "...미안해. 하지만 가야 해." ──
    "day5_lunch_left_c1_1": {
        next: "day5_lunch_left_c1_2"
    },
    "day5_lunch_left_c1_2": {
        next: "day5_lunch_left_c1_3"
    },
    "day5_lunch_left_c1_3": {
        next: "day5_lunch_left_c1_4"
    },
    "day5_lunch_left_c1_4": {
        next: "day5_lunch_left_c1_5"
    },
    "day5_lunch_left_c1_5": {
        next: "day5_lunch_left_c1_6"
    },
    "day5_lunch_left_c1_6": {
        next: "day5_lunch_left_c1_7"
    },
    "day5_lunch_left_c1_7": {
        next: "day5_lunch_left_c1_8"
    },
    "day5_lunch_left_c1_8": {
        next: "day5_lunch_seolhwa_1",
        setFlags: ["sea_let_go_13"]
    },

    // ── 선택 2: "같이 가자." ──
    "day5_lunch_left_c2_1": {
        next: "day5_lunch_left_c2_2"
    },
    "day5_lunch_left_c2_2": {
        next: "day5_lunch_left_c2_3"
    },
    "day5_lunch_left_c2_3": {
        next: "day5_lunch_left_c2_4"
    },
    "day5_lunch_left_c2_4": {
        next: "day5_lunch_left_c2_5"
    },
    "day5_lunch_left_c2_5": {
        next: "day5_lunch_left_c2_6"
    },
    "day5_lunch_left_c2_6": {
        next: "day5_lunch_left_c2_7"
    },
    "day5_lunch_left_c2_7": {
        next: "day5_lunch_left_c2_8"
    },
    "day5_lunch_left_c2_8": {
        next: "day5_lunch_left_c2_9"
    },
    "day5_lunch_left_c2_9": {
        next: "day5_lunch_left_c2_10"
    },
    "day5_lunch_left_c2_10": {
        next: "day5_lunch_seolhwa_1",
        setFlags: ["sea_companion"]
    },

    // ── 선택 3: "...비키지 마. 여기 있을게." → CAGE 루트 ──
    "day5_lunch_left_c3_1": {
        next: "day5_lunch_end",
        setFlags: ["cage_route_sea", "stayed_with_sea"]
    },

    // ══════════════════════════════════════
    // 오른쪽: 리인 — "설탕물이야"
    // ══════════════════════════════════════
    "day5_lunch_right_1": {
        background: "old_infirmary",
        character: null,
        next: "day5_lunch_right_2"
    },
    "day5_lunch_right_2": {
        next: "day5_lunch_right_3"
    },
    // 방화 셔터 통과
    "day5_lunch_right_3": {
        next: "day5_lunch_right_4"
    },
    "day5_lunch_right_4": {
        next: "day5_lunch_right_5"
    },
    // 보건실 진입
    "day5_lunch_right_5": {
        character: "riin_casual",
        next: "day5_lunch_right_6"
    },
    // 주사기 줄 - #13 라벨
    "day5_lunch_right_6": {
        next: "day5_lunch_right_7"
    },
    // "...왔어."
    "day5_lunch_right_7": {
        next: "day5_lunch_right_8"
    },
    "day5_lunch_right_8": {
        next: "day5_lunch_right_9"
    },
    // 리인이 주사기를 집어듦 - 공포
    "day5_lunch_right_9": {
        next: "day5_lunch_right_10"
    },
    "day5_lunch_right_10": {
        glitch: { noise: true },
        next: "day5_lunch_right_11"
    },
    // "...진정해." - 주사기를 싱크대에 내려놓음
    "day5_lunch_right_11": {
        next: "day5_lunch_right_12"
    },
    "day5_lunch_right_12": {
        next: "day5_lunch_right_13"
    },
    // 캐비넷에서 약병 꺼냄
    "day5_lunch_right_13": {
        next: "day5_lunch_right_14"
    },
    "day5_lunch_right_14": {
        next: "day5_lunch_right_15"
    },
    // 뚜껑 열고, 냄새 맡고, 한 모금 마심
    "day5_lunch_right_15": {
        next: "day5_lunch_right_16"
    },
    // ★ "설탕물이야."
    "day5_lunch_right_16": {
        glitch: { screenShake: true },
        next: "day5_lunch_right_17"
    },
    "day5_lunch_right_17": {
        next: "day5_lunch_right_18"
    },
    // "7번째부터."
    "day5_lunch_right_18": {
        next: "day5_lunch_right_19"
    },
    "day5_lunch_right_19": {
        next: "day5_lunch_right_20"
    },
    // "...왜요?"
    "day5_lunch_right_20": {
        next: "day5_lunch_right_21"
    },
    // 이설화 비명 회상
    "day5_lunch_right_21": {
        next: "day5_lunch_right_22"
    },
    "day5_lunch_right_22": {
        next: "day5_lunch_right_23"
    },
    "day5_lunch_right_23": {
        next: "day5_lunch_right_24"
    },
    "day5_lunch_right_24": {
        next: "day5_lunch_right_25"
    },
    // "수정 불가" 판정
    "day5_lunch_right_25": {
        next: "day5_lunch_right_26"
    },
    "day5_lunch_right_26": {
        next: "day5_lunch_right_27"
    },
    // 리인 자기 혐오 독백
    "day5_lunch_right_27": {
        next: "day5_lunch_right_28"
    },
    "day5_lunch_right_28": {
        next: "day5_lunch_right_29"
    },
    // 약 농도 줄임 -> 8번째부터 설탕물
    "day5_lunch_right_29": {
        next: "day5_lunch_right_30"
    },
    // 10번째 때 은수가 의심
    "day5_lunch_right_30": {
        next: "day5_lunch_right_31"
    },
    // 데자뷔의 이유
    "day5_lunch_right_31": {
        next: "day5_lunch_right_32"
    },
    // 비상구 열쇠 꺼냄
    "day5_lunch_right_32": {
        next: "day5_lunch_right_33"
    },
    "day5_lunch_right_33": {
        next: "day5_lunch_right_34"
    },
    // 구관 3층 비상구 설명
    "day5_lunch_right_34": {
        next: "day5_lunch_right_35"
    },
    "day5_lunch_right_35": {
        next: "day5_lunch_right_36"
    },
    // 이 구역이 조용한 이유
    "day5_lunch_right_36": {
        next: "day5_lunch_right_37"
    },
    // 쿵! 방화 셔터 흔들림
    "day5_lunch_right_37": {
        glitch: { screenShake: true },
        next: "day5_lunch_right_38"
    },
    "day5_lunch_right_38": {
        next: "day5_lunch_right_39"
    },
    // "...시간 없어. 받아."
    "day5_lunch_right_39": {
        next: "day5_lunch_right_choice"
    },

    // 6초 타이머: 3 choices
    "day5_lunch_right_choice": {
        timedChoice: 6000,
        choices: [
            { next: "day5_lunch_right_c1_1", setFlags: ["emergency_key"] },
            { next: "day5_lunch_right_c2_1", setFlags: ["emergency_key", "riin_companion"] },
            { next: "day5_lunch_right_c3_1" }
        ],
        timeoutNext: "day5_lunch_right_c1_1"
    },

    // ── 선택 1: 열쇠를 받는다 ──
    "day5_lunch_right_c1_1": {
        next: "day5_lunch_seolhwa_1",
        setFlags: ["emergency_key"]
    },

    // ── 선택 2: "같이 가요." ──
    "day5_lunch_right_c2_1": {
        next: "day5_lunch_seolhwa_1",
        setFlags: ["emergency_key", "riin_companion"]
    },

    // ── 선택 3: "...이것도 실험인 거 아니에요?" ──
    "day5_lunch_right_c3_1": {
        next: "day5_lunch_right_c3_2"
    },
    // 리인이 자기 팔에 주사기를 꽂음
    "day5_lunch_right_c3_2": {
        next: "day5_lunch_right_c3_3"
    },
    "day5_lunch_right_c3_3": {
        next: "day5_lunch_right_c3_4"
    },
    "day5_lunch_right_c3_4": {
        next: "day5_lunch_right_c3_5"
    },
    "day5_lunch_right_c3_5": {
        next: "day5_lunch_seolhwa_1",
        setFlags: ["emergency_key"]
    },

    // ══════════════════════════════════════
    // 설화의 개입
    // ══════════════════════════════════════
    "day5_lunch_seolhwa_1": {
        background: "old_stairway",
        bgm: "seolhwa_theme_broken.mp3",
        character: "seolhwa_ghost",
        next: "day5_lunch_seolhwa_2"
    },
    "day5_lunch_seolhwa_2": {
        next: "day5_lunch_seolhwa_3"
    },
    // 환각이라는 것을 안다
    "day5_lunch_seolhwa_3": {
        next: "day5_lunch_seolhwa_4"
    },
    // "...드디어 왔어."
    "day5_lunch_seolhwa_4": {
        next: "day5_lunch_seolhwa_5"
    },
    "day5_lunch_seolhwa_5": {
        next: "day5_lunch_seolhwa_6"
    },
    // "...알아버렸구나."
    "day5_lunch_seolhwa_6": {
        next: "day5_lunch_seolhwa_7"
    },
    // 계단에 앉는 설화
    "day5_lunch_seolhwa_7": {
        next: "day5_lunch_seolhwa_8"
    },
    // "나는 여기 없어."
    "day5_lunch_seolhwa_8": {
        next: "day5_lunch_seolhwa_9"
    },
    // 7번째 회상 - 같이 도망치려 했다
    "day5_lunch_seolhwa_9": {
        next: "day5_lunch_seolhwa_10"
    },
    // 시설 학생이었다
    "day5_lunch_seolhwa_10": {
        next: "day5_lunch_seolhwa_11"
    },
    // 쪽지를 넘겼다
    "day5_lunch_seolhwa_11": {
        next: "day5_lunch_seolhwa_12"
    },
    // 같이 뛰었다, 잡혔다
    "day5_lunch_seolhwa_12": {
        next: "day5_lunch_seolhwa_13"
    },
    "day5_lunch_seolhwa_13": {
        next: "day5_lunch_seolhwa_14"
    },
    // 환각의 눈물
    "day5_lunch_seolhwa_14": {
        next: "day5_lunch_seolhwa_15"
    },
    // "...미안해." "기억 못 해서."
    "day5_lunch_seolhwa_15": {
        next: "day5_lunch_seolhwa_16"
    },
    "day5_lunch_seolhwa_16": {
        next: "day5_lunch_seolhwa_17"
    },
    // "네 잘못이 아니야."
    "day5_lunch_seolhwa_17": {
        next: "day5_lunch_seolhwa_18"
    },
    // 리인이 약을 줄여줬으니까
    "day5_lunch_seolhwa_18": {
        next: "day5_lunch_seolhwa_19"
    },
    // 기억 속에서 살아있었다
    "day5_lunch_seolhwa_19": {
        next: "day5_lunch_seolhwa_20"
    },
    // 8번째 '뒤를 보지 마'
    "day5_lunch_seolhwa_20": {
        next: "day5_lunch_seolhwa_21"
    },
    // 10번째 꿈에서 지하실
    "day5_lunch_seolhwa_21": {
        next: "day5_lunch_seolhwa_22"
    },
    // 기억의 잔상 고백
    "day5_lunch_seolhwa_22": {
        next: "day5_lunch_seolhwa_23"
    },
    // 진짜가 아니다
    "day5_lunch_seolhwa_23": {
        next: "day5_lunch_seolhwa_24"
    },
    // "왼손잡이지?"
    "day5_lunch_seolhwa_24": {
        next: "day5_lunch_seolhwa_25"
    },
    "day5_lunch_seolhwa_25": {
        next: "day5_lunch_seolhwa_26"
    },
    // "'기억해줘'는—" / "나를 기억해줘."
    "day5_lunch_seolhwa_26": {
        next: "day5_lunch_seolhwa_27"
    },
    "day5_lunch_seolhwa_27": {
        next: "day5_lunch_seolhwa_28"
    },
    // 빛이 흐른다
    "day5_lunch_seolhwa_28": {
        next: "day5_lunch_seolhwa_29"
    },
    // 13번째는 달라
    "day5_lunch_seolhwa_29": {
        next: "day5_lunch_seolhwa_30"
    },

    // 8초 타이머: 2 choices
    "day5_lunch_seolhwa_30": {
        timedChoice: 8000,
        choices: [
            { next: "day5_lunch_seolhwa_c1_1" },
            { next: "day5_lunch_seolhwa_c2_1" }
        ],
        timeoutNext: "day5_lunch_seolhwa_c2_1"
    },

    // ── 선택 1: "같이 나가자." ──
    "day5_lunch_seolhwa_c1_1": {
        next: "day5_lunch_seolhwa_c1_2"
    },
    "day5_lunch_seolhwa_c1_2": {
        next: "day5_lunch_seolhwa_c1_3"
    },
    "day5_lunch_seolhwa_c1_3": {
        next: "day5_lunch_seolhwa_guide_1"
    },

    // ── 선택 2: "너는 어떻게 돼?" ──
    "day5_lunch_seolhwa_c2_1": {
        next: "day5_lunch_seolhwa_c2_2"
    },
    // 손끝이 흐릿하다
    "day5_lunch_seolhwa_c2_2": {
        next: "day5_lunch_seolhwa_c2_3"
    },
    // 서서히 사라질 거야
    "day5_lunch_seolhwa_c2_3": {
        next: "day5_lunch_seolhwa_c2_4"
    },
    // "하지만 괜찮아."
    "day5_lunch_seolhwa_c2_4": {
        next: "day5_lunch_seolhwa_c2_5"
    },
    "day5_lunch_seolhwa_c2_5": {
        next: "day5_lunch_seolhwa_c2_6"
    },
    "day5_lunch_seolhwa_c2_6": {
        next: "day5_lunch_seolhwa_guide_1"
    },

    // ══════════════════════════════════════
    // 설화의 길 안내
    // ══════════════════════════════════════
    "day5_lunch_seolhwa_guide_1": {
        background: "old_corridor_dark",
        next: "day5_lunch_seolhwa_guide_2"
    },
    "day5_lunch_seolhwa_guide_2": {
        next: "day5_lunch_seolhwa_guide_3"
    },
    // 설화 발소리 없음
    "day5_lunch_seolhwa_guide_3": {
        next: "day5_lunch_seolhwa_guide_4"
    },
    // 빛을 투과하는 설화
    "day5_lunch_seolhwa_guide_4": {
        next: "day5_lunch_seolhwa_guide_5"
    },
    // 유나: "선배, 혼자 중얼거리고 있어요."
    "day5_lunch_seolhwa_guide_5": {
        character: "yuna_worried",
        next: "day5_lunch_seolhwa_guide_6"
    },
    "day5_lunch_seolhwa_guide_6": {
        next: "day5_lunch_seolhwa_guide_7"
    },
    // 왼쪽 창고 통로
    "day5_lunch_seolhwa_guide_7": {
        character: "seolhwa_ghost",
        next: "day5_lunch_seolhwa_guide_8"
    },
    "day5_lunch_seolhwa_guide_8": {
        next: "day5_lunch_seolhwa_guide_9"
    },
    // 올라간다. 한 층. 두 층.
    "day5_lunch_seolhwa_guide_9": {
        next: "day5_lunch_seolhwa_guide_10"
    },
    // 3층 비상구 앞
    "day5_lunch_seolhwa_guide_10": {
        background: "emergency_exit",
        next: "day5_lunch_seolhwa_guide_11"
    },
    // 설화가 흐려지고 있다
    "day5_lunch_seolhwa_guide_11": {
        next: "day5_lunch_seolhwa_guide_12"
    },
    // 열쇠를 꽂았다 (or 설화가 잠금 풀어줌)
    "day5_lunch_seolhwa_guide_12": {
        branches: [
            { condition: "emergency_key", next: "day5_lunch_seolhwa_guide_13a" }
        ],
        next: "day5_lunch_seolhwa_guide_13b"
    },
    "day5_lunch_seolhwa_guide_13a": {
        next: "day5_lunch_seolhwa_guide_14"
    },
    "day5_lunch_seolhwa_guide_13b": {
        next: "day5_lunch_seolhwa_guide_14"
    },
    // 문이 열렸다. 밖의 공기.
    "day5_lunch_seolhwa_guide_14": {
        next: "day5_lunch_seolhwa_guide_15"
    },
    // 설화의 머리카락이 바람에 - 환각
    "day5_lunch_seolhwa_guide_15": {
        next: "day5_lunch_seolhwa_guide_16"
    },
    // 뒤에서 발소리
    "day5_lunch_seolhwa_guide_16": {
        glitch: { screenShake: true },
        next: "day5_lunch_eunsu_1"
    },

    // ══════════════════════════════════════
    // 최종 대면: 은수
    // ══════════════════════════════════════
    "day5_lunch_eunsu_1": {
        background: "emergency_exit",
        bgm: "confrontation.mp3",
        character: null,
        next: "day5_lunch_eunsu_2"
    },
    // 발소리 - 느린 구두 소리
    "day5_lunch_eunsu_2": {
        next: "day5_lunch_eunsu_3"
    },
    "day5_lunch_eunsu_3": {
        next: "day5_lunch_eunsu_4"
    },
    "day5_lunch_eunsu_4": {
        next: "day5_lunch_eunsu_5"
    },
    // 은수 등장
    "day5_lunch_eunsu_5": {
        character: "eunsu_obsessed",
        glitch: { noise: true },
        next: "day5_lunch_eunsu_6"
    },
    // 억지 미소, 경련
    "day5_lunch_eunsu_6": {
        next: "day5_lunch_eunsu_7"
    },
    // "거긴 위험해. 이리 와."
    "day5_lunch_eunsu_7": {
        next: "day5_lunch_eunsu_8"
    },
    // 미소가 떨어져 내림
    "day5_lunch_eunsu_8": {
        next: "day5_lunch_eunsu_9"
    },
    "day5_lunch_eunsu_9": {
        next: "day5_lunch_eunsu_10"
    },
    // "매번 이러더라."
    "day5_lunch_eunsu_10": {
        next: "day5_lunch_eunsu_11"
    },
    // "1번째 때는 화가 났어."
    "day5_lunch_eunsu_11": {
        next: "day5_lunch_eunsu_12"
    },
    // "3번째 때부터 — 무서웠어."
    "day5_lunch_eunsu_12": {
        next: "day5_lunch_eunsu_13"
    },
    "day5_lunch_eunsu_13": {
        next: "day5_lunch_eunsu_14"
    },
    // "선생님이 잘해주면 남아있을 줄 알았어."
    "day5_lunch_eunsu_14": {
        next: "day5_lunch_eunsu_15"
    },
    // 한 발 다가옴
    "day5_lunch_eunsu_15": {
        next: "day5_lunch_eunsu_16"
    },
    // "1일차에 교실에 들어왔을 때. 13번째인데도."
    "day5_lunch_eunsu_16": {
        next: "day5_lunch_eunsu_17"
    },
    "day5_lunch_eunsu_17": {
        next: "day5_lunch_eunsu_18"
    },
    // 주사기 꺼냄
    "day5_lunch_eunsu_18": {
        next: "day5_lunch_eunsu_19"
    },
    "day5_lunch_eunsu_19": {
        next: "day5_lunch_eunsu_20"
    },
    // "마지막 기회야"
    "day5_lunch_eunsu_20": {
        next: "day5_lunch_eunsu_21"
    },
    // "이거 한 대면 다 끝나."
    "day5_lunch_eunsu_21": {
        typingSpeed: 80,
        next: "day5_lunch_eunsu_22"
    },
    // "다시 1일차부터."
    "day5_lunch_eunsu_22": {
        next: "day5_lunch_eunsu_23"
    },
    // 침묵
    "day5_lunch_eunsu_23": {
        next: "day5_lunch_eunsu_24"
    },
    "day5_lunch_eunsu_24": {
        next: "day5_lunch_eunsu_25"
    },
    // "...제발."
    "day5_lunch_eunsu_25": {
        typingSpeed: 150,
        unskippable: true,
        next: "day5_lunch_eunsu_26"
    },
    // 주사기 떨림, 눈물
    "day5_lunch_eunsu_26": {
        next: "day5_lunch_eunsu_27"
    },
    "day5_lunch_eunsu_27": {
        next: "day5_lunch_eunsu_28"
    },
    // 시간이 멈춘 것 같다
    "day5_lunch_eunsu_28": {
        next: "day5_lunch_eunsu_29"
    },
    // 주사기와 비상구. 망각과 기억.
    "day5_lunch_eunsu_29": {
        next: "day5_lunch_eunsu_30"
    },
    // 12번의 몸이 기억
    "day5_lunch_eunsu_30": {
        next: "day5_lunch_eunsu_31"
    },
    // 한 발 더 다가옴
    "day5_lunch_eunsu_31": {
        next: "day5_lunch_eunsu_32"
    },
    // 설화가 보인다 — 뒤에
    "day5_lunch_eunsu_32": {
        next: "day5_lunch_eunsu_final"
    },

    // ★ 최종 선택지: 20초 타이머, 3 choices (GHOST는 타이머 초과로만 진입)
    "day5_lunch_eunsu_final": {
        glitch: { screenShake: true },
        timedChoice: 20000,
        choices: [
            { next: "day5_lunch_final_true", setFlags: ["chose_remember"] },
            { next: "day5_lunch_final_forget", setFlags: ["chose_forget"] },
            { next: "day5_lunch_final_resist", setFlags: ["chose_together"] }
        ],
        timeoutNext: "day5_lunch_final_ghost"
    },

    // ── Route stubs (lead to endings in other files) ──
    "day5_lunch_final_true": {
        next: "day5_lunch_end",
        setFlags: ["route_true"]
    },
    "day5_lunch_final_forget": {
        next: "day5_lunch_end",
        setFlags: ["route_forget"]
    },
    "day5_lunch_final_resist": {
        next: "day5_lunch_end",
        setFlags: ["route_resist"]
    },
    "day5_lunch_final_ghost": {
        next: "day5_lunch_end",
        setFlags: ["route_ghost"]
    },

    "day5_lunch_end": {
        character: null,
        changeSlot: "afterschool",
        next: "day5_after_start"
    }
});
