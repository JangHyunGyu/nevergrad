/**
 * Day 3-2: Lunch - 유나의 폭로
 * 위화감 30%. 유나 쪽지→옥상, 13명의 사진, 잠긴 문.
 * 대안: 세아와 점심(고등어/공포), 리인 보건실(음료/안도), 혼자 교실(여기서 나가).
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[3]) SCENARIO[3] = {};

Object.assign(SCENARIO[3], {

    // ── 점심 시작: 쪽지 발견 & 루트 선택 ──
    "day3_lunch_start": {
        background: "classroom",
        bgm: "daily_tense.mp3",
        character: null,
        branches: [
            { condition: "yuna_route_started", next: "day3_lunch_note_yuna" },
            { condition: "met_yuna", next: "day3_lunch_note_yuna_brief" }
        ],
        next: "day3_lunch_note_unknown"
    },
    // 유나를 만난 적 있을 때: 쪽지의 발신자를 안다
    "day3_lunch_note_yuna": {
        character: null,
        next: "day3_lunch_note_yuna_2"
    },
    "day3_lunch_note_yuna_2": {
        character: null,
        next: "day3_lunch_choice"
    },
    "day3_lunch_note_yuna_brief": {
        character: null,
        next: "day3_lunch_note_yuna_brief_2"
    },
    "day3_lunch_note_yuna_brief_2": {
        character: null,
        next: "day3_lunch_choice"
    },
    // 유나를 만난 적 없을 때: 쪽지의 발신자를 모른다
    "day3_lunch_note_unknown": {
        character: null,
        next: "day3_lunch_note_unknown_2"
    },
    "day3_lunch_note_unknown_2": {
        character: null,
        next: "day3_lunch_note_unknown_3"
    },
    "day3_lunch_note_unknown_3": {
        character: null,
        next: "day3_lunch_choice_no_yuna"
    },
    // 유나를 모르면 옥상 선택지 없음
    "day3_lunch_choice_no_yuna": {
        character: null,
        choices: [
            { next: "day3_lunch_sea_1", stats: { sea: { affinity: 5 } } },
            { next: "day3_lunch_riin_1", stats: { riin: { affinity: 5 } } },
            { next: "day3_lunch_alone_1", stats: { seolhwa: { affinity: 5 }, sea: { affinity: -3 } } }
        ]
    },
    "day3_lunch_choice": {
        character: null,
        choices: [
            { next: "day3_lunch_rooftop_1", condition: "met_yuna", setFlags: ["yuna_route_started"], stats: { yuna: { affinity: 8 }, seolhwa: { affinity: 3 } } },
            { next: "day3_lunch_sea_1", stats: { sea: { affinity: 5 } } },
            { next: "day3_lunch_riin_1", stats: { riin: { affinity: 5 } } },
            { next: "day3_lunch_alone_1", stats: { seolhwa: { affinity: 5 }, sea: { affinity: -3 } } }
        ]
    },

    // ══════════════════════════════════════
    //  ★ 옥상 루트: 유나의 폭로 (재설계 — 유나는 거의 침묵, 나레이션 중심) ★
    // ══════════════════════════════════════
    // 유나: "...와줬네요."
    "day3_lunch_rooftop_1": {
        background: "rooftop",
        sfx: "sfx_wind.mp3",
        character: "yuna_scared",
        next: "day3_lunch_rooftop_2"
    },
    // 유나가 아무 말 없이 카메라를 건넨다
    "day3_lunch_rooftop_2": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_3"
    },
    // 손이 떨리고 있다. 유나의 손이. 손가락 마디가 하얗다.
    "day3_lunch_rooftop_3": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_4",
        setFlags: ["yuna_memory_card"]
    },
    // 유나: "...넘겨보세요."
    "day3_lunch_rooftop_4": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_5"
    },
    // 카메라를 받았다. 화면에 사진이 떠 있다.
    "day3_lunch_rooftop_5": {
        character: "yuna_scared",
        interaction: { type: "photo_deck", deck: "yuna_13" },
        next: "day3_lunch_rooftop_6"
    },
    // 사진: 김도진
    "day3_lunch_rooftop_6": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_7"
    },
    // 넘겼다.
    "day3_lunch_rooftop_7": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_8"
    },
    // 사진: 박서진
    "day3_lunch_rooftop_8": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_9"
    },
    // 넘겼다.
    "day3_lunch_rooftop_9": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_10"
    },
    // 사진: 김태호
    "day3_lunch_rooftop_10": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_11"
    },
    // 넘겼다. 넘겼다. 넘겼다. 넘겼다.
    "day3_lunch_rooftop_11": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_12"
    },
    // ...마지막 사진. 교문 앞. 어제 아침.
    "day3_lunch_rooftop_12": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_13"
    },
    // 내 사진이다.
    "day3_lunch_rooftop_13": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_14"
    },
    // ...
    "day3_lunch_rooftop_14": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_15"
    },
    // 카메라를 내려놓지 못했다. 처음부터 다시 넘겼다.
    "day3_lunch_rooftop_15": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_16"
    },
    // 다른 머리색. 다른 이름표.
    "day3_lunch_rooftop_16": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_17",
        glitch: { shake: true, shakeDuration: 500 }
    },
    // ★ 같은 눈. 같은 코. 같은 입.
    "day3_lunch_rooftop_17": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_18",
        glitch: { noise: true, noiseDuration: 400 }
    },
    // ★ 13장. 13명. 한 사람. (+ NG+ 14번째 빈 프레임 0.8초)
    "day3_lunch_rooftop_18": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_19",
        glitch: { noise: true, noiseDuration: 500, shake: true, shakeDuration: 500, ngPlusEmptyFrame: true, ngPlusEmptyFrameDuration: 800 }
    },
    // 유나가 아무 말도 하지 않는다. 나를 보고 있을 뿐이다.
    "day3_lunch_rooftop_19": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_20"
    },
    // 카메라를 든 손이 떨린다. — 내 손이.
    "day3_lunch_rooftop_20": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_21"
    },
    // 유나가 입술을 깨물고 있다. 3년을 혼자 품고 있었다.
    "day3_lunch_rooftop_21": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_22"
    },
    // 무슨 질문을 해야 하는지 모르겠다.
    "day3_lunch_rooftop_22": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_23"
    },
    // 유나가 마침내 입을 연다. 작은 목소리.
    "day3_lunch_rooftop_23": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_24"
    },
    // 유나: "...매번 사라져요. 길면 일주일."
    "day3_lunch_rooftop_24": {
        character: "yuna_scared",
        typingSpeed: 120,
        unskippable: true,
        next: "day3_lunch_rooftop_25"
    },
    // 그것뿐이다. 그 한마디뿐이다.
    "day3_lunch_rooftop_25": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_26"
    },
    // ...13번째.
    "day3_lunch_rooftop_26": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_27"
    },
    // 넥타이를 잡아당겼다. 숨을 들이마시는데 공기가 목에서 걸린다.
    "day3_lunch_rooftop_27": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_28"
    },
    // 카메라를 돌려주려는데 — 유나가 고개를 저었다.
    "day3_lunch_rooftop_28": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_29"
    },
    // 유나: "...갖고 계세요."
    "day3_lunch_rooftop_29": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_30",
        setFlags: ["yuna_sd_card_copy"]
    },
    // 유나의 눈에서 눈물이 한 줄 흘렀다. 닦지 않았다.
    "day3_lunch_rooftop_30": {
        character: "yuna_scared",
        next: "day3_lunch_door_1"
    },

    // ── 잠긴 문 ──
    "day3_lunch_door_1": {
        character: null,
        stopSfx: "sfx_wind.mp3",
        sfx: "sfx_door_slam.mp3",
        glitch: { noise: true, noiseDuration: 300 },
        unskippable: true,
        next: "day3_lunch_door_2"
    },
    "day3_lunch_door_2": {
        character: null,
        next: "day3_lunch_door_3"
    },
    "day3_lunch_door_3": {
        character: "yuna_scared",
        next: "day3_lunch_door_choice"
    },
    "day3_lunch_door_choice": {
        character: null,
        choices: [
            {
                next: "day3_lunch_door_bang",
                setFlags: ["door_made_noise"],
                stats: { yuna: { affinity: -3 }, sea: { affinity: 5 }, eunsu: { affinity: 5 } }
            },
            {
                next: "day3_lunch_door_wait",
                stats: { yuna: { affinity: 5 }, sea: { affinity: -2 } }
            }
        ]
    },
    "day3_lunch_door_bang": {
        character: null,
        next: "day3_lunch_door_open"
    },
    "day3_lunch_door_wait": {
        character: null,
        next: "day3_lunch_door_open"
    },
    // 문 열림 → 계단 내려감
    "day3_lunch_door_open": {
        character: null,
        next: "day3_lunch_door_open_2"
    },
    // 유나가 보여준 사진이 머릿속에서 안 지워진다
    "day3_lunch_door_open_2": {
        character: null,
        next: "day3_lunch_door_open_3"
    },
    // 말이 안 된다. 논리적으로 안 된다.
    "day3_lunch_door_open_3": {
        character: null,
        next: "day3_lunch_door_open_4"
    },
    // "말이 안 되잖아... 나는 전 학교에서... 민수랑..."
    "day3_lunch_door_open_4": {
        character: null,
        next: "day3_lunch_door_open_5"
    },
    // 내 기억인데 남의 대본을 읽는 것처럼
    "day3_lunch_door_open_5": {
        character: null,
        next: "day3_lunch_door_open_6"
    },
    // 속이 뒤집힌다. 구역질인지 공포인지
    "day3_lunch_door_open_6": {
        character: null,
        next: "day3_lunch_nametag_1"
    },
    // ── 이름표 해리감 (복도) ──
    "day3_lunch_nametag_1": {
        character: null,
        next: "day3_lunch_nametag_2"
    },
    "day3_lunch_nametag_2": {
        character: null,
        next: "day3_lunch_door_open_7"
    },
    // 하지만 부정할 수도 없다. 사진이 있으니까.
    "day3_lunch_door_open_7": {
        character: null,
        next: "day3_lunch_door_open_8"
    },
    // 복도에서 스쳐가는 학생들. 누가 알고 있는 거지?
    "day3_lunch_door_open_8": {
        character: null,
        next: "day3_lunch_door_open_9"
    },
    // 유나: 사진 아무한테도 보여주지 마세요. 특히 선생님들한테.
    "day3_lunch_door_open_9": {
        character: "yuna_scared",
        next: "day3_lunch_door_open_10"
    },
    // 나: ...알겠어.
    "day3_lunch_door_open_10": {
        character: "yuna_scared",
        next: "day3_lunch_door_open_11"
    },
    // 유나가 1층에서 갈라진다. 그 눈이 '미안해요'와 '부탁해요'
    "day3_lunch_door_open_11": {
        character: "yuna_scared",
        next: "day3_lunch_door_open_12"
    },
    // 혼자 남겨졌다. 복도가 길다.
    "day3_lunch_door_open_12": {
        character: null,
        next: "day3_lunch_end"
    },

    // ══════════════════════════════════════
    //  세아 루트: 세아와 점심
    // ══════════════════════════════════════
    "day3_lunch_sea_1": {
        background: "classroom",
        character: "sea_smile",
        next: "day3_lunch_sea_2"
    },
    // 세아의 웃음이 어제랑 다르다. '확인한다'에 가깝다.
    "day3_lunch_sea_2": {
        character: "sea_smile",
        next: "day3_lunch_sea_3"
    },
    // 배경: 급식실. 세아 맞은편에 앉았다.
    "day3_lunch_sea_3": {
        character: null,
        background: "cafeteria",
        next: "day3_lunch_sea_4"
    },
    // 세아: 고등어 좋아하잖아
    "day3_lunch_sea_4": {
        character: "sea_smile",
        next: "day3_lunch_sea_5"
    },
    // 고등어를 좋아한다고 말한 적 없다
    "day3_lunch_sea_5": {
        character: "sea_smile",
        next: "day3_lunch_sea_6"
    },
    // 나: 그걸 어떻게 알아?
    "day3_lunch_sea_6": {
        character: "sea_smile",
        next: "day3_lunch_sea_7"
    },
    // 세아: 어제 반찬 고를 때 봤지
    "day3_lunch_sea_7": {
        character: "sea_smile",
        next: "day3_lunch_sea_8"
    },
    // ...그랬나? 기억이 안 나는데. 세아가 내 표정을 읽는다.
    "day3_lunch_sea_8": {
        character: "sea_smile",
        next: "day3_lunch_sea_9"
    },
    // 세아: 요즘 혼자 돌아다니는 거 같더라?
    "day3_lunch_sea_9": {
        character: "sea_serious",
        next: "day3_lunch_sea_10"
    },
    // 나: 별로 안 그런 것 같은데.
    "day3_lunch_sea_10": {
        character: "sea_serious",
        next: "day3_lunch_sea_11"
    },
    // 세아: 그냥 내 착각이겠지.
    "day3_lunch_sea_11": {
        character: "sea_serious",
        next: "day3_lunch_sea_12"
    },
    // 세아가 젓가락으로 반찬을 집다가 멈춘다. 긴 침묵.
    "day3_lunch_sea_12": {
        character: "sea_serious",
        next: "day3_lunch_sea_13"
    },
    // 주변이 시끄러운데 이 테이블만 조용하다
    "day3_lunch_sea_13": {
        character: "sea_serious",
        next: "day3_lunch_sea_14"
    },
    // 세아: 너 나한테 뭐 말 안 한 거 있지.
    "day3_lunch_sea_14": {
        character: "sea_serious",
        next: "day3_lunch_sea_15"
    },
    // 눈이 웃고 있지 않다. 거기에 있는 건 공포다. 내가 벗어나는 게 무서운 거다.
    "day3_lunch_sea_15": {
        character: "sea_serious",
        next: "day3_lunch_sea_16"
    },
    // 세아: ...농담이야. 먹어.
    "day3_lunch_sea_16": {
        character: "sea_smile",
        next: "day3_lunch_sea_17"
    },
    // 이번엔 완벽한 웃음이다. 너무 완벽해서 오히려 소름이 돋는다.
    "day3_lunch_sea_17": {
        character: "sea_smile",
        next: "day3_lunch_end"
    },

    // ══════════════════════════════════════
    //  리인 루트: 보건실 전해질 음료
    // ══════════════════════════════════════
    "day3_lunch_riin_1": {
        background: "nurse_office",
        character: null,
        branches: [
            { condition: "met_riin", next: "day3_lunch_riin_2" }
        ],
        next: "day3_lunch_riin_first"
    },
    // 리인을 처음 만나는 경우: 주인공 위화감
    "day3_lunch_riin_first": {
        character: "riin_smile",
        setFlags: ["met_riin"],
        next: "day3_lunch_riin_first_2"
    },
    "day3_lunch_riin_first_2": {
        character: "riin_smile",
        next: "day3_lunch_riin_3"
    },
    // 리인: 안색이 별로네
    "day3_lunch_riin_2": {
        character: "riin_smile",
        next: "day3_lunch_riin_3"
    },
    // 나: 좀 어지러워서요
    "day3_lunch_riin_3": {
        character: "riin_smile",
        next: "day3_lunch_riin_4"
    },
    // 침대에 앉았다. 이마에 손. 서늘한 손.
    "day3_lunch_riin_4": {
        character: "riin_smile",
        next: "day3_lunch_riin_5"
    },
    // 리인: 열은 없는데 얼굴색이 안 좋네
    "day3_lunch_riin_5": {
        character: "riin_smile",
        next: "day3_lunch_riin_6"
    },
    // 캐비닛에서 뭔가를 꺼낸다. 어깨가 잠깐 멈칫한다.
    "day3_lunch_riin_6": {
        character: "riin_smile",
        next: "day3_lunch_riin_7"
    },
    // 리인: 전해질 음료 있어.
    "day3_lunch_riin_7": {
        character: "riin_smile",
        next: "day3_lunch_riin_8"
    },
    // 연보라색 액체. 약품 같은 냄새. 손이 떨리고 있다.
    "day3_lunch_riin_8": {
        character: "riin_smile",
        next: "day3_lunch_riin_9"
    },
    // 리인: 비타민이랑 전해질 섞은 거야.
    "day3_lunch_riin_9": {
        character: "riin_smile",
        next: "day3_lunch_riin_choice"
    },
    "day3_lunch_riin_choice": {
        character: null,
        choices: [
            {
                next: "day3_lunch_riin_drink_1",
                setFlags: ["drank_riin_drink"],
                stats: { riin: { affinity: 5 } }
            },
            {
                next: "day3_lunch_riin_refuse_1",
                stats: { riin: { affinity: -3 } }
            }
        ]
    },
    // 마심: 쓴맛이 혀 밑에 남는다
    "day3_lunch_riin_drink_1": {
        character: "riin_smile",
        next: "day3_lunch_riin_drink_2"
    },
    // 리인: 다 마실 필요는 없어
    "day3_lunch_riin_drink_2": {
        character: "riin_smile",
        next: "day3_lunch_riin_drink_3"
    },
    // 리인이 컵을 가져간다. 입술을 세게 깨물고 있다.
    "day3_lunch_riin_drink_3": {
        character: "riin_smile",
        next: "day3_lunch_end"
    },
    // 거절: 리인 "...그래? 괜찮아."
    "day3_lunch_riin_refuse_1": {
        character: "riin_smile",
        next: "day3_lunch_riin_refuse_2"
    },
    // 싱크대에 버린다. 어깨에서 힘이 빠진다. ...안도.
    "day3_lunch_riin_refuse_2": {
        character: "riin_smile",
        next: "day3_lunch_end"
    },

    // ══════════════════════════════════════
    //  혼자 루트: 교실에서 설화 책상 글씨
    // ══════════════════════════════════════
    "day3_lunch_alone_1": {
        background: "classroom_empty",
        character: null,
        next: "day3_lunch_alone_2"
    },
    // 조용하다. 너무 조용하다.
    "day3_lunch_alone_2": {
        character: null,
        next: "day3_lunch_alone_3"
    },
    // 설화의 자리. 3일째 출석 안 함. 담임도 이름 건너뜀.
    "day3_lunch_alone_3": {
        character: null,
        next: "day3_lunch_alone_4"
    },
    // 책상 위에 연필로 쓴 글씨: '여기서 나가'
    "day3_lunch_alone_4": {
        character: null,
        next: "day3_lunch_alone_5",
        setFlags: ["saw_seolhwa_desk_msg"],
        glitch: { shake: true, shakeDuration: 300 }
    },
    // 심장이 멎는 것 같았다
    "day3_lunch_alone_5": {
        character: null,
        next: "day3_lunch_alone_6"
    },
    // 깊이 파여있다. 여러 번 같은 글씨를 반복해서 쓴 자국.
    "day3_lunch_alone_6": {
        character: null,
        next: "day3_lunch_alone_7"
    },
    // 필체가 책상 밑, 사물함과 같다. 내 글씨체.
    "day3_lunch_alone_7": {
        character: null,
        next: "day3_lunch_alone_8"
    },
    // 밥맛이 없다. 도시락을 덮었다.
    "day3_lunch_alone_8": {
        character: null,
        next: "day3_lunch_end"
    },

    // ── Day 3 점심 종료 ──
    "day3_lunch_end": {
        background: "classroom",
        character: null,
        changeSlot: "afterschool",
        next: "day3_after_start"
    }
});
