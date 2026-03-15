/**
 * Day 4-4: Night - 세이브 파일 글리치 & 거울 반전
 * Room return + lock, Sea escalating messages, Eunsu messages
 * ★ Save file glitch: 13 save slots (forced system menu open)
 * ★ Mirror reversal: Seolhwa not reflected, 13-photo overlay, "13th shell"
 * Tactical planning notes with past iteration references
 * 3-way final plan choice
 * 위화감 95%. BREAKING glitch level.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    // ══════════════════════════════════════════
    // 밤 — 자취방 귀환
    // ══════════════════════════════════════════
    "day4_night_start": {
        background: "home",
        bgm: "tension_night.mp3",
        character: null,
        next: "day4_night_start_2"
    },
    "day4_night_start_2": {
        character: null,
        next: "day4_night_start_3"
    },
    "day4_night_start_3": {
        character: null,
        next: "day4_night_phone"
    },

    // ══════════════════════════════════════════
    // 세아의 집착 메시지 (점점 빨라지는 간격)
    // ══════════════════════════════════════════
    "day4_night_phone": {
        character: null,
        unskippable: true,
        next: "day4_night_phone_2"
    },
    "day4_night_phone_2": {
        character: null,
        unskippable: true,
        messengerDelay: 1200,
        next: "day4_night_phone_3"
    },
    "day4_night_phone_3": {
        character: null,
        unskippable: true,
        messengerDelay: 1200,
        next: "day4_night_phone_4"
    },
    // '약속이야.' 반복 — 30초
    "day4_night_phone_4": {
        character: null,
        unskippable: true,
        messengerDelay: 1000,
        next: "day4_night_phone_5"
    },
    // 15초
    "day4_night_phone_5": {
        character: null,
        unskippable: true,
        messengerDelay: 600,
        next: "day4_night_phone_6"
    },
    // 5초 — 글리치
    "day4_night_phone_6": {
        character: null,
        unskippable: true,
        messengerDelay: 300,
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_night_phone_7"
    },
    "day4_night_phone_7": {
        character: null,
        unskippable: true,
        next: "day4_night_phone_8"
    },
    // '자고 있어?' — 10초
    "day4_night_phone_8": {
        character: null,
        unskippable: true,
        messengerDelay: 500,
        next: "day4_night_phone_9"
    },
    // '...자지 마. 조금만 더.' — 5초
    "day4_night_phone_9": {
        character: null,
        unskippable: true,
        messengerDelay: 300,
        next: "day4_night_phone_10"
    },
    // '제발' — 3초
    "day4_night_phone_10": {
        character: null,
        unskippable: true,
        messengerDelay: 200,
        glitch: { noise: true, noiseDuration: 300 },
        next: "day4_night_phone_11"
    },
    "day4_night_phone_11": {
        character: null,
        unskippable: true,
        next: "day4_night_phone_eunsu"
    },

    // ── 은수 메시지 ──
    "day4_night_phone_eunsu": {
        character: null,
        unskippable: true,
        messengerDelay: 1500,
        next: "day4_night_phone_eunsu_2"
    },
    "day4_night_phone_eunsu_2": {
        character: null,
        unskippable: true,
        messengerDelay: 1200,
        next: "day4_night_phone_eunsu_3"
    },
    "day4_night_phone_eunsu_3": {
        character: null,
        unskippable: true,
        next: "day4_night_phone_end"
    },
    "day4_night_phone_end": {
        character: null,
        next: "day4_night_save_glitch"
    },

    // ══════════════════════════════════════════
    // ★ 세이브 파일 글리치 [메타: 시스템 메뉴 강제 오픈]
    // ══════════════════════════════════════════
    "day4_night_save_glitch": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_2"
    },
    "day4_night_save_glitch_2": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_3"
    },
    "day4_night_save_glitch_3": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_4"
    },
    // ★ 실제 세이브/로드 화면 강제 오픈
    "day4_night_save_glitch_4": {
        character: null,
        unskippable: true,
        glitch: { forceSaveMenu: true, noise: true, noiseDuration: 500 },
        next: "day4_night_save_glitch_5"
    },
    "day4_night_save_glitch_5": {
        character: null,
        unskippable: true,
        glitch: {
            saveSlotDisplay: true,
            slots: [
                { slot: 1,  day: "Day 5", time: "23:00", status: "처리 완료", name: "김도진" },
                { slot: 2,  day: "Day 5", time: "23:00", status: "처리 완료", name: "이준서" },
                { slot: 3,  day: "Day 4", time: "15:30", status: "탈출 시도, 실패", name: "박서진" },
                { slot: 4,  day: "Day 5", time: "23:00", status: "처리 완료", name: "정하율" },
                { slot: 5,  day: "Day 5", time: "23:00", status: "처리 완료", name: "강민혁" },
                { slot: 6,  day: "Day 5", time: "23:00", status: "처리 완료", name: "윤재원" },
                { slot: 7,  day: "Day 5", time: "22:47", status: "██역효과██ 외부 접촉, 탈출 시도", name: "김태호" },
                { slot: 8,  day: "Day 5", time: "23:00", status: "처리 완료", name: "최시우" },
                { slot: 9,  day: "Day 3", time: "11:20", status: "조기 발각, 강제 처리", name: "한지호" },
                { slot: 10, day: "Day 5", time: "23:00", status: "처리 완료", name: "송예준" },
                { slot: 11, day: "Day 5", time: "23:00", status: "처리 완료", name: "오태현" },
                { slot: 12, day: "Day 5", time: "23:00", status: "처리 완료", name: "임서율" },
                { slot: 13, day: "Day 4", time: "",       status: "진행 중",   name: "{name}" }
            ]
        },
        next: "day4_night_save_glitch_6"
    },
    // 슬롯 1 — 김도진
    "day4_night_save_glitch_6": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_7"
    },
    // 처리 완료 반복
    "day4_night_save_glitch_7": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_8"
    },
    "day4_night_save_glitch_8": {
        character: null,
        unskippable: true,
        glitch: { noise: true, noiseDuration: 400 },
        next: "day4_night_save_glitch_9"
    },
    "day4_night_save_glitch_9": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_10"
    },
    // 슬롯 7 — 김태호 (역효과, 설화)
    "day4_night_save_glitch_10": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_11"
    },
    // 슬롯 7 종료시간 차이: 22:47 vs 23:00
    "day4_night_save_glitch_11": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_12"
    },
    // 슬롯 3 — 박서진 (Day 4 탈출 실패)
    "day4_night_save_glitch_12": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_13"
    },
    // 슬롯 9 — 한지호 (Day 3 조기 발각)
    "day4_night_save_glitch_13": {
        character: null,
        unskippable: true,
        next: "day4_night_save_glitch_14"
    },
    // 슬롯 13 — 진행 중 (나)
    "day4_night_save_glitch_14": {
        character: null,
        unskippable: true,
        glitch: { noise: true, noiseDuration: 300 },
        next: "day4_night_save_glitch_15"
    },
    // 슬롯 1 로드 시도 → 권한 없음
    "day4_night_save_glitch_15": {
        character: null,
        unskippable: true,
        glitch: { saveSlotInteract: 1, result: "권한이 없습니다." },
        next: "day4_night_save_glitch_16"
    },
    // 슬롯 7 로드 시도 → 데이터 손상
    "day4_night_save_glitch_16": {
        character: null,
        unskippable: true,
        glitch: { saveSlotInteract: 7, result: "해당 데이터는 손상되었습니다." },
        next: "day4_night_save_glitch_17"
    },
    // 화면 글리치 → 꺼짐
    "day4_night_save_glitch_17": {
        character: null,
        unskippable: true,
        glitch: { heavyGlitch: true, screenOff: true },
        next: "day4_night_mirror"
    },

    // ══════════════════════════════════════════
    // ★ 거울 반전 — 이중 붕괴
    // ══════════════════════════════════════════

    // 화장실로 이동
    "day4_night_mirror": {
        background: "home",
        bgm: null,
        character: null,
        unskippable: true,
        next: "day4_night_mirror_2"
    },
    "day4_night_mirror_2": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_3"
    },
    "day4_night_mirror_3": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_4"
    },
    // 거울 — 김이 서려있다
    "day4_night_mirror_4": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_5"
    },
    "day4_night_mirror_5": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_6"
    },
    // 손을 올렸다 — 직전에 멈춤
    "day4_night_mirror_6": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_7"
    },
    "day4_night_mirror_7": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_8"
    },
    // 등 뒤에 기척 — 설화
    "day4_night_mirror_8": {
        unskippable: true,
        character: "seolhwa_sad",
        next: "day4_night_mirror_9"
    },
    "day4_night_mirror_9": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_10"
    },
    // 설화: "...닦지 마."
    "day4_night_mirror_10": {
        unskippable: true,
        character: "seolhwa_sad",
        next: "day4_night_mirror_11"
    },
    // 설화: "아직... 보지 마."
    "day4_night_mirror_11": {
        character: "seolhwa_sad",
        unskippable: true,
        next: "day4_night_mirror_12"
    },
    "day4_night_mirror_12": {
        unskippable: true,
        character: null,
        next: "day4_night_mirror_swipe"
    },

    // ★ 인터랙티브 연출 — 수동 스와이프
    // 플레이어가 직접 마우스 드래그 / 터치 스와이프로 거울의 김을 닦는다
    // 스와이프하지 않으면 진행되지 않는다
    "day4_night_mirror_swipe": {
        character: null,
        unskippable: true,
        glitch: {
            mirrorWipe: true,
            requireSwipe: true,
            silenceAll: true
        },
        next: "day4_night_mirror_swipe_2"
    },
    "day4_night_mirror_swipe_2": {
        character: null,
        unskippable: true,
        glitch: { silence: true },
        next: "day4_night_mirror_swipe_3"
    },
    // 이마가 드러난다
    "day4_night_mirror_swipe_3": {
        character: null,
        unskippable: true,
        glitch: { mirrorReveal: 1, silence: true },
        next: "day4_night_mirror_swipe_4"
    },
    // 눈이 드러난다
    "day4_night_mirror_swipe_4": {
        character: null,
        unskippable: true,
        glitch: { mirrorReveal: 2, silence: true },
        next: "day4_night_mirror_swipe_5"
    },
    // 코, 입, 턱 — 내 얼굴
    "day4_night_mirror_swipe_5": {
        character: null,
        unskippable: true,
        glitch: { mirrorReveal: 3, silence: true },
        next: "day4_night_mirror_hit1"
    },

    // ── 1타: 초자연적 공포 ──
    // 거울에 설화가 비치지 않는다
    "day4_night_mirror_hit1": {
        character: null,
        unskippable: true,
        glitch: {
            mirrorReflection: true,
            characterAbsentInMirror: "seolhwa",
            silence: true
        },
        next: "day4_night_mirror_hit1_2"
    },
    "day4_night_mirror_hit1_2": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit1_3"
    },
    "day4_night_mirror_hit1_3": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit1_4"
    },
    "day4_night_mirror_hit1_4": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit1_5"
    },
    // 뒤를 봤다 — 있다 / 거울 — 없다 교차
    "day4_night_mirror_hit1_5": {
        unskippable: true,
        character: "seolhwa_sad",
        next: "day4_night_mirror_hit1_6"
    },
    "day4_night_mirror_hit1_6": {
        unskippable: true,
        character: null,
        glitch: { mirrorReflection: true, characterAbsentInMirror: "seolhwa" },
        next: "day4_night_mirror_hit1_7"
    },
    "day4_night_mirror_hit1_7": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit1_8"
    },
    "day4_night_mirror_hit1_8": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit1_9"
    },
    // 설화는 물리적으로 존재하지 않는다
    "day4_night_mirror_hit1_9": {
        character: null,
        unskippable: true,
        glitch: { noise: true, noiseDuration: 500 },
        next: "day4_night_mirror_hit1_10"
    },
    // 은수의 관찰 일지 회상
    "day4_night_mirror_hit1_10": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit1_11"
    },
    "day4_night_mirror_hit1_11": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit1_12"
    },
    // 1년 전에 죽었다
    "day4_night_mirror_hit1_12": {
        character: null,
        unskippable: true,
        glitch: { heavyGlitch: true },
        next: "day4_night_mirror_hit1_13"
    },
    // 환각이었다
    "day4_night_mirror_hit1_13": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit1_14"
    },
    // 설화: "...미안해."
    "day4_night_mirror_hit1_14": {
        unskippable: true,
        character: "seolhwa_sad",
        next: "day4_night_mirror_hit1_15"
    },
    "day4_night_mirror_hit1_15": {
        unskippable: true,
        character: null,
        next: "day4_night_mirror_hit2"
    },

    // ── 2타: 존재론적 공포 ──
    "day4_night_mirror_hit2": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit2_2"
    },
    "day4_night_mirror_hit2_2": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit2_3"
    },
    // 사진 13장 대조
    "day4_night_mirror_hit2_3": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit2_4"
    },
    // #1 김도진 — 같다
    "day4_night_mirror_hit2_4": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit2_5"
    },
    // #3 박서진 — 같다
    "day4_night_mirror_hit2_5": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit2_6"
    },
    // #7 김태호 — 같다
    "day4_night_mirror_hit2_6": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_hit2_7"
    },
    // 전부 같다
    "day4_night_mirror_hit2_7": {
        character: null,
        unskippable: true,
        glitch: { noise: true, noiseDuration: 400 },
        next: "day4_night_mirror_hit2_8"
    },
    // 나는 13번째 껍데기다
    "day4_night_mirror_hit2_8": {
        character: null,
        unskippable: true,
        glitch: { heavyGlitch: true },
        next: "day4_night_mirror_hit2_9"
    },
    // 회상: 치킨가스, 커피... 환각을 등 뒤에 세워두고
    "day4_night_mirror_hit2_9": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_overlay"
    },

    // ★ 13장 사진 강제 오버레이
    "day4_night_mirror_overlay": {
        character: null,
        unskippable: true,
        glitch: {
            photoOverlay: true,
            photoSequence: [
                { slot: 1,  name: "김도진", hair: "short_black" },
                { slot: 2,  name: "이준서", hair: "short_brown" },
                { slot: 3,  name: "박서진", hair: "medium_brown" },
                { slot: 4,  name: "정하율", hair: "short_black" },
                { slot: 5,  name: "강민혁", hair: "short_dark" },
                { slot: 6,  name: "윤재원", hair: "medium_black" },
                { slot: 7,  name: "김태호", hair: "long_haggard" },
                { slot: 8,  name: "최시우", hair: "short_black" },
                { slot: 9,  name: "한지호", hair: "short_dark" },
                { slot: 10, name: "송예준", hair: "medium_dark" },
                { slot: 11, name: "오태현", hair: "short_brown" },
                { slot: 12, name: "임서율", hair: "medium_black" },
                { slot: 13, name: "{name}", hair: "current" }
            ],
            photoInterval: 400,
            overlayText: "나는 13번째 껍데기다.",
            overlayFadeDuration: 3000,
            silence: true
        },
        next: "day4_night_mirror_collapse"
    },

    // ── 붕괴 ──
    "day4_night_mirror_collapse": {
        unskippable: true,
        character: null,
        next: "day4_night_mirror_collapse_2"
    },
    // "기억해줘" — 문자 그대로
    "day4_night_mirror_collapse_2": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_collapse_3"
    },
    "day4_night_mirror_collapse_3": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_collapse_4"
    },
    "day4_night_mirror_collapse_4": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_collapse_5"
    },
    "day4_night_mirror_collapse_5": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_collapse_6"
    },
    // 12번이나 죽으면서도 — 한 번도 자기 자신을 위해 울어본 적 없는
    "day4_night_mirror_collapse_6": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_collapse_7"
    },
    "day4_night_mirror_collapse_7": {
        character: null,
        unskippable: true,
        next: "day4_night_mirror_collapse_8"
    },
    // 설화가 옆에 앉아있다 — 환각이. 죽은 사람이. 하지만 옆에 누가 있다.
    "day4_night_mirror_collapse_8": {
        unskippable: true,
        character: "seolhwa_sad",
        next: "day4_night_mirror_collapse_9"
    },
    "day4_night_mirror_collapse_9": {
        unskippable: true,
        character: null,
        next: "day4_night_plan"
    },

    // ══════════════════════════════════════════
    // 작전 수립
    // ══════════════════════════════════════════
    "day4_night_plan": {
        background: "home",
        bgm: "tension_night.mp3",
        character: null,
        next: "day4_night_plan_2"
    },
    "day4_night_plan_2": {
        character: null,
        next: "day4_night_plan_3"
    },
    "day4_night_plan_3": {
        character: null,
        next: "day4_night_plan_4"
    },
    // 하나. 기억 조작 실험. 13번째 반복.
    "day4_night_plan_4": {
        character: null,
        next: "day4_night_plan_5"
    },
    // 둘. 은수=총괄. 리인=약물. 세아=감시.
    "day4_night_plan_5": {
        character: null,
        next: "day4_night_plan_6"
    },
    // 셋. 설화 = 7번째 때 폐기. 지금 보는 설화 = 환각.
    "day4_night_plan_6": {
        character: null,
        next: "day4_night_plan_7"
    },
    // 넷. 유나 = 관찰자, 지하실 감금.
    "day4_night_plan_7": {
        character: null,
        next: "day4_night_plan_8"
    },
    // 다섯. 내일이 5일째. 밤 11시에 최종 처리.
    "day4_night_plan_8": {
        character: null,
        next: "day4_night_plan_9"
    },
    // 여섯. 구관 3층 비상구 = 설화가 찾아둔 탈출로.
    "day4_night_plan_9": {
        character: null,
        next: "day4_night_plan_10"
    },
    // 펜을 내려놓았다
    "day4_night_plan_10": {
        character: null,
        next: "day4_night_plan_11"
    },
    // 일곱. 리인 선생님이 열쇠를 갖고 있다.
    "day4_night_plan_11": {
        character: null,
        next: "day4_night_plan_12"
    },
    // 여덟. #3 Day4 정문 탈출 실패 — 정문으로는 안 된다.
    "day4_night_plan_12": {
        character: null,
        next: "day4_night_plan_13"
    },
    // 아홉. #7 설화와 함께 22:47 — 13분 일찍, 뭔가 달랐다.
    "day4_night_plan_13": {
        character: null,
        next: "day4_night_plan_14"
    },
    // 열. #9 Day3 발각 — 너무 빨리 움직이면 안 된다.
    "day4_night_plan_14": {
        character: null,
        next: "day4_night_plan_15"
    },
    "day4_night_plan_15": {
        character: null,
        next: "day4_night_plan_choice"
    },

    // ── 최종 계획 선택지 ──
    "day4_night_plan_choice": {
        character: null,
        choices: [
            {
                next: "day4_night_plan_escape",
                setFlags: ["plan_escape_school"]
            },
            {
                next: "day4_night_plan_expose",
                setFlags: ["plan_expose_truth"]
            },
            {
                next: "day4_night_plan_confront",
                setFlags: ["plan_confront_them"]
            }
        ]
    },

    // 선택1: 학교에서 탈출한다
    "day4_night_plan_escape": {
        character: null,
        next: "day4_night_plan_final"
    },
    // 선택2: 증거를 외부에 공개한다
    "day4_night_plan_expose": {
        character: null,
        next: "day4_night_plan_final"
    },
    // 선택3: 그들과 직접 대면한다
    "day4_night_plan_confront": {
        character: null,
        next: "day4_night_plan_final"
    },

    // ── 최종 메모 ──
    "day4_night_plan_final": {
        character: null,
        next: "day4_night_plan_final_2"
    },
    "day4_night_plan_final_2": {
        character: null,
        next: "day4_night_plan_final_3"
    },
    // '12번의 나는 전부 실패했다. 13번째는 — 다르게 한다.'
    "day4_night_plan_final_3": {
        character: null,
        unskippable: true,
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_night_plan_final_4"
    },
    "day4_night_plan_final_4": {
        character: null,
        next: "day4_night_end"
    },

    // ── Day 4 종료 ──
    "day4_night_end": {
        background: "home",
        bgm: null,
        character: null,
        changeDay: 5,
        changeSlot: "morning",
        next: "day5_morning_start"
    }
});
