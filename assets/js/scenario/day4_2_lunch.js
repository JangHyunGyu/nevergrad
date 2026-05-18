/**
 * Day 4-2: Lunch - 수색
 * 3 choices: 유나 찾기 / 보건실 / 옥상
 * 유나: 사진부 교실(창문 진입), 사물함 이중바닥 카메라,
 *       구관 지하실 문 — 진입 실패(새 자물쇠), 유나 신음소리,
 *       은수가 열쇠로 문을 열고 들어가는 것을 목격
 * 보건실: 리인 주사기 목격, 유나 언급, 수면제 제안 거절
 * 옥상: 설화 메시지 "나가는 방법은 하나", "지하에 답이 있어"
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    // ── 점심시간 시작: 선택지 ──
    "day4_lunch_start": {
        background: "classroom",
        bgm: "tension.mp3",
        sfx: "sfx_school_bell.mp3",
        character: null,
        unskippable: true,
        next: "day4_lunch_choice"
    },

    "day4_lunch_choice": {
        character: null,
        stopSfx: "sfx_school_bell.mp3",
        choices: [
            { next: "day4_lunch_yuna_1", condition: "met_yuna", stats: { yuna: { affinity: 10 }, seolhwa: { affinity: 5 } } },
            { next: "day4_lunch_nurse_1", stats: { riin: { affinity: 8 } } },
            { next: "day4_lunch_roof_1", stats: { seolhwa: { affinity: 10 }, eunsu: { affinity: -5 } } }
        ]
    },

    // ═══════════════════════════════════════
    // 유나 수색 루트 — 카메라 & 지하 연구실
    // ═══════════════════════════════════════

    // ── 사진부 교실 진입 ──
    "day4_lunch_yuna_1": {
        background: "corridor",
        bgm: "tension_low.mp3",
        character: null,
        unskippable: true,
        next: "day4_lunch_yuna_2"
    },
    "day4_lunch_yuna_2": {
        character: null,
        // 창문 진입
        next: "day4_lunch_yuna_3"
    },

    // ── 사물함 조사 ──
    "day4_lunch_yuna_3": {
        background: "classroom_empty",
        character: null,
        // 유나의 사물함 — 텅 비어있다
        interaction: { type: "locker_search", search: "yuna_locker" },
        unskippable: true,
        next: "day4_lunch_yuna_4"
    },
    "day4_lunch_yuna_4": {
        character: null,
        // 다른 사물함엔 먼지, 유나 것만 깨끗
        next: "day4_lunch_yuna_5"
    },

    // ── 이중 바닥, 카메라 발견 ──
    "day4_lunch_yuna_5": {
        character: null,
        // 합판 이중 바닥, 카메라 숨겨짐
        next: "day4_lunch_yuna_6"
    },
    "day4_lunch_yuna_6": {
        character: null,
        // 카메라 꺼냄, 배터리 거의 없음
        setFlags: ["found_yuna_camera"],
        next: "day4_lunch_yuna_7"
    },

    // ── 카메라 사진 확인 ──
    "day4_lunch_yuna_7": {
        character: null,
        // 200장, 양복 차림 사람들, 3년 증거
        next: "day4_lunch_yuna_8"
    },
    "day4_lunch_yuna_8": {
        character: null,
        // 마지막 사진: 지하 계단 + "여기 아래 — 유"
        glitch: { noise: true },
        unskippable: true,
        next: "day4_lunch_yuna_9"
    },
    "day4_lunch_yuna_9": {
        character: null,
        // 날짜가 어젯밤
        next: "day4_lunch_yuna_10"
    },

    // ── 구관 복도, 지하실 문 — 진입 실패 ──
    "day4_lunch_yuna_10": {
        character: null,
        // 구관 복도 끝, 녹슨 문, 새 자물쇠
        background: "old_building",
        unskippable: true,
        next: "day4_lunch_yuna_11"
    },
    "day4_lunch_yuna_11": {
        character: null,
        // 손잡이를 잡아당겼다. 새 자물쇠.
        sfx: { file: "sfx_padlock_rattle.mp3" },
        unskippable: true,
        next: "day4_lunch_yuna_12"
    },
    "day4_lunch_yuna_12": {
        character: null,
        // 문틈에 귀를 댔다. 신음소리.
        sfx: [
            { file: "sfx_machine_hum_loop.mp3", loop: true, volume: 0.45 },
            { file: "sfx_distant_groan.mp3", volume: 0.75 }
        ],
        unskippable: true,
        next: "day4_lunch_yuna_13"
    },
    "day4_lunch_yuna_13": {
        character: null,
        // ...유나.
        next: "day4_lunch_yuna_14"
    },
    "day4_lunch_yuna_14": {
        character: null,
        // 자물쇠를 흔들어봤다. 열 수 없다.
        sfx: { file: "sfx_padlock_rattle.mp3" },
        unskippable: true,
        next: "day4_lunch_yuna_15"
    },
    "day4_lunch_yuna_15": {
        character: null,
        // 발소리가 들린다. 누군가 오고 있다.
        sfx: { file: "sfx_footsteps.mp3", volume: 0.65 },
        unskippable: true,
        next: "day4_lunch_yuna_16"
    },
    "day4_lunch_yuna_16": {
        character: null,
        // 물러났다. 구석으로 숨었다.
        next: "day4_lunch_yuna_17"
    },
    "day4_lunch_yuna_17": {
        character: "eunsu_cold",
        // 은수 선생님이 열쇠로 문을 열고 들어감
        sfx: [
            { file: "sfx_key_turn.mp3" },
            { file: "sfx_door_close.mp3", volume: 0.75 }
        ],
        unskippable: true,
        setFlags: ["saw_eunsu_key"],
        next: "day4_lunch_yuna_18"
    },
    "day4_lunch_yuna_18": {
        character: "eunsu_cold",
        // 은수가 열쇠를 갖고 있다. 나는 열 수 없다.
        glitch: { noise: true, noiseDuration: 200 },
        unskippable: true,
        choices: [
            { next: "day4_lunch_yuna_19", stats: { yuna: { affinity: 4 }, eunsu: { affinity: -3 } } },
            { next: "day4_lunch_yuna_19", stats: { riin: { affinity: 2 } } },
            { next: "day4_lunch_yuna_19", stats: { seolhwa: { affinity: 2 } } }
        ]
    },
    "day4_lunch_yuna_19": {
        character: null,
        // 주먹을 쥐었다. 손톱이 손바닥을 파고든다.
        next: "day4_lunch_yuna_20"
    },
    "day4_lunch_yuna_20": {
        character: null,
        // 내일. 내일 반드시.
        stopSfx: { file: "sfx_machine_hum_loop.mp3", fadeOut: 0.8 },
        unskippable: true,
        next: "day4_lunch_end"
    },

    // ═══════════════════════════════════════
    // 보건실 루트 — 리인의 본색
    // ═══════════════════════════════════════
    "day4_lunch_nurse_1": {
        background: "nurse_office",
        bgm: "tension_low.mp3",
        character: "riin_neutral",
        unskippable: true,
        branches: [
            { condition: "met_riin", next: "day4_lunch_nurse_2" }
        ],
        next: "day4_lunch_nurse_first"
    },
    "day4_lunch_nurse_first": {
        character: "riin_neutral",
        setFlags: ["met_riin"],
        next: "day4_lunch_nurse_2"
    },
    "day4_lunch_nurse_2": {
        character: null,
        // 앰플 라벨 'M-13'
        next: "day4_lunch_nurse_3"
    },
    "day4_lunch_nurse_3": {
        character: null,
        // 나를 보고 멈춘다
        next: "day4_lunch_nurse_4"
    },
    "day4_lunch_nurse_4": {
        // "놀랐잖아"
        character: "riin_smile",
        next: "day4_lunch_nurse_5"
    },
    "day4_lunch_nurse_5": {
        // 주사기를 뒤로 숨긴다 — met_yuna에 따라 유나 질문 or 주사기 질문
        character: "riin_smile",
        branches: [
            { condition: "met_yuna", next: "day4_lunch_nurse_6" }
        ],
        next: "day4_lunch_nurse_noyuna"
    },
    // ── met_yuna = false: 유나 대신 주사기에 대해 질문 ──
    "day4_lunch_nurse_noyuna": {
        character: null,
        next: "day4_lunch_nurse_noyuna_2"
    },
    "day4_lunch_nurse_noyuna_2": {
        character: "riin_cold",
        next: "day4_lunch_nurse_noyuna_3"
    },
    "day4_lunch_nurse_noyuna_3": {
        character: "riin_cold",
        next: "day4_lunch_nurse_13"
    },
    // ── met_yuna = true: 유나 전학 언급 ──
    "day4_lunch_nurse_6": {
        character: null,
        // 유나 전학 언급
        next: "day4_lunch_nurse_7"
    },
    "day4_lunch_nurse_7": {
        character: "riin_cold",
        // 리인 표정 변화 0.5초
        next: "day4_lunch_nurse_8"
    },
    "day4_lunch_nurse_8": {
        // "왜 그렇게 쳐다봐?"
        character: "riin_cold",
        unskippable: true,
        next: "day4_lunch_nurse_9"
    },
    "day4_lunch_nurse_9": {
        // 목소리 차가웠다가 부드러워짐
        character: "riin_gentle",
        unskippable: true,
        next: "day4_lunch_nurse_10"
    },
    "day4_lunch_nurse_10": {
        // "유나는 괜찮을 거야"
        character: "riin_smile",
        next: "day4_lunch_nurse_11"
    },
    "day4_lunch_nurse_11": {
        // '괜찮을 거야' — 미래형
        character: "riin_smile",
        next: "day4_lunch_nurse_12"
    },
    "day4_lunch_nurse_12": {
        character: "riin_smile",
        // 리인은 유나가 지금 괜찮지 않다는 걸 알고 있다
        next: "day4_lunch_nurse_13"
    },
    "day4_lunch_nurse_13": {
        // "피곤해 보여"
        character: "riin_smile",
        next: "day4_lunch_nurse_14"
    },
    "day4_lunch_nurse_14": {
        // "약 하나 줄까?"
        character: "riin_smile",
        next: "day4_lunch_nurse_15"
    },
    "day4_lunch_nurse_15": {
        // 웃는 얼굴, 부드러운 목소리, 주사기
        character: null,
        choices: [
            { next: "day4_lunch_nurse_16", stats: { riin: { affinity: -3 } } },
            { next: "day4_lunch_nurse_16", stats: { riin: { affinity: 2 } } },
            { next: "day4_lunch_nurse_16", stats: { yuna: { affinity: 2 }, seolhwa: { affinity: 1 } } }
        ]
    },
    "day4_lunch_nurse_16": {
        background: "hallway",
        character: null,
        // 거절하고 나옴, 중얼거림
        setFlags: ["saw_riin_syringe"],
        next: "day4_lunch_end"
    },

    // ═══════════════════════════════════════
    // 옥상 루트 — 설화의 단서
    // ═══════════════════════════════════════
    "day4_lunch_roof_1": {
        background: "rooftop",
        bgm: "wind_ambient.mp3",
        sfx: "sfx_wind.mp3",
        character: null,
        unskippable: true,
        next: "day4_lunch_roof_2"
    },
    "day4_lunch_roof_2": {
        character: null,
        // 난간 밑 글씨, 칼로 깊게 판 흔적
        next: "day4_lunch_roof_3"
    },
    "day4_lunch_roof_3": {
        character: null,
        // "나가는 방법은 하나. — 이설화"
        setFlags: ["found_seolhwa_mark"],
        next: "day4_lunch_roof_4"
    },
    "day4_lunch_roof_4": {
        character: null,
        // 작은 글씨: "지하에 답이 있어"
        choices: [
            { next: "day4_lunch_roof_5", stats: { seolhwa: { affinity: 3 } } },
            { next: "day4_lunch_roof_5", stats: { yuna: { affinity: 1 }, eunsu: { affinity: -1 } } }
        ]
    },
    "day4_lunch_roof_5": {
        character: null,
        // 손가락으로 만짐, 금속 난간, 오래된 흔적
        next: "day4_lunch_roof_6"
    },
    "day4_lunch_roof_6": {
        character: null,
        // 환각이 새긴 글씨가 아니다, 물리적 흔적
        next: "day4_lunch_roof_7"
    },
    "day4_lunch_roof_7": {
        character: null,
        // 설화가 실제로 여기 있었던 시절에 새긴 거다
        next: "day4_lunch_end"
    },

    // ── 점심 종료 ──
    "day4_lunch_end": {
        background: "classroom",
        bgm: "tension.mp3",
        character: null,
        stopSfx: "sfx_wind.mp3",
        changeSlot: "afterschool",
        unskippable: true,
        next: "day4_after_start"
    }
});
