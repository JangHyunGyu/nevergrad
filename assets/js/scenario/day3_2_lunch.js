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
        next: "day3_lunch_note"
    },
    "day3_lunch_note": {
        character: null,
        next: "day3_lunch_choice"
    },
    "day3_lunch_choice": {
        character: null,
        choices: [
            { next: "day3_lunch_rooftop_1" },
            { next: "day3_lunch_sea_1" },
            { next: "day3_lunch_riin_1" },
            { next: "day3_lunch_alone_1" }
        ]
    },

    // ══════════════════════════════════════
    //  ★ 옥상 루트: 유나의 폭로 ★
    // ══════════════════════════════════════
    "day3_lunch_rooftop_1": {
        background: "rooftop",
        character: "yuna_scared",
        next: "day3_lunch_rooftop_2"
    },
    "day3_lunch_rooftop_2": {
        character: null,
        next: "day3_lunch_rooftop_3"
    },
    // 유나: 메모리카드 꺼냄
    "day3_lunch_rooftop_3": {
        character: "yuna_normal",
        next: "day3_lunch_rooftop_4",
        setFlags: ["yuna_memory_card"]
    },
    // 유나: 3년 사진부
    "day3_lunch_rooftop_4": {
        character: "yuna_normal",
        next: "day3_lunch_rooftop_5"
    },
    // 유나: 전학생 올 때마다 찍었어요
    "day3_lunch_rooftop_5": {
        character: "yuna_normal",
        next: "day3_lunch_rooftop_6"
    },
    // 나레이션: 카메라 화면을 넘긴다
    "day3_lunch_rooftop_6": {
        character: null,
        next: "day3_lunch_rooftop_7"
    },
    // 유나: 1번 전학생
    "day3_lunch_rooftop_7": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_8"
    },
    // 사진: 김도진
    "day3_lunch_rooftop_8": {
        character: null,
        next: "day3_lunch_rooftop_9"
    },
    // 유나: 3번
    "day3_lunch_rooftop_9": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_10"
    },
    // 사진: 박서진
    "day3_lunch_rooftop_10": {
        character: null,
        next: "day3_lunch_rooftop_11"
    },
    // 유나: 7번
    "day3_lunch_rooftop_11": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_12"
    },
    // 사진: 김태호
    "day3_lunch_rooftop_12": {
        character: null,
        next: "day3_lunch_rooftop_13"
    },
    // 유나: 그리고 이게 선배예요
    "day3_lunch_rooftop_13": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_14"
    },
    // 사진: 내 사진
    "day3_lunch_rooftop_14": {
        character: null,
        next: "day3_lunch_rooftop_15"
    },
    // ...잠깐.
    "day3_lunch_rooftop_15": {
        character: null,
        next: "day3_lunch_rooftop_16"
    },
    // 사진 나란히 배열: 13장
    "day3_lunch_rooftop_16": {
        character: null,
        next: "day3_lunch_rooftop_17",
        glitch: { shake: true, shakeDuration: 500 }
    },
    // 13장의 사진. 13개의 이름. 전부 같은 얼굴.
    "day3_lunch_rooftop_17": {
        character: null,
        next: "day3_lunch_rooftop_18",
        glitch: { noise: true, noiseDuration: 400 }
    },
    // ...내 얼굴이다.
    "day3_lunch_rooftop_18": {
        character: null,
        next: "day3_lunch_rooftop_19"
    },
    // 유나: 왜 13명의 얼굴이 전부 똑같은 거죠?
    "day3_lunch_rooftop_19": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_20",
        stats: { yuna: { trust: 10 } }
    },
    // 유나: 왜 다들 자기 이름도 모르고...
    "day3_lunch_rooftop_20": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_21"
    },
    // 머릿속이 하얘진다
    "day3_lunch_rooftop_21": {
        character: null,
        next: "day3_lunch_rooftop_22",
        glitch: { whiteout: true, whiteoutDuration: 300 }
    },
    // 유나의 목소리가 멀어지는 것 같다
    "day3_lunch_rooftop_22": {
        character: null,
        next: "day3_lunch_rooftop_23"
    },
    // 나: 이거 합성 아니야?
    "day3_lunch_rooftop_23": {
        character: null,
        next: "day3_lunch_rooftop_24"
    },
    // 유나: 3년이에요, 선배. 3년 동안 매번...
    "day3_lunch_rooftop_24": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_25"
    },
    // 유나: 아무한테도 말 못 했어요
    "day3_lunch_rooftop_25": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_26"
    },
    // 유나 눈이 빨갛다. 카메라가 흔들린다
    "day3_lunch_rooftop_26": {
        character: null,
        next: "day3_lunch_rooftop_27"
    },
    // 유나: 1번이 왔을 때 저 중1이었어요
    "day3_lunch_rooftop_27": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_28"
    },
    // 유나: 3번이 왔을 때 이상하다고 느꼈어요
    "day3_lunch_rooftop_28": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_29"
    },
    // 유나: 5번째부터 무서웠어요
    "day3_lunch_rooftop_29": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_30"
    },
    // 유나가 두 손으로 얼굴을 감싼다. 어깨가 떨린다
    "day3_lunch_rooftop_30": {
        character: null,
        next: "day3_lunch_rooftop_31"
    },
    // 유나: 죄송해요. 갑자기 이런 거 보여줘서.
    "day3_lunch_rooftop_31": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_32"
    },
    // 나: 아니, 괜찮아.
    "day3_lunch_rooftop_32": {
        character: null,
        next: "day3_lunch_rooftop_33"
    },
    // 괜찮지 않다. 하지만 지금 울고 있는 건 유나다.
    "day3_lunch_rooftop_33": {
        character: null,
        next: "day3_lunch_rooftop_34"
    },
    // 유나: 저 혼자 알고 있으니까 미칠 것 같았어요
    "day3_lunch_rooftop_34": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_35"
    },
    // '사라진다'.
    "day3_lunch_rooftop_35": {
        character: null,
        next: "day3_lunch_rooftop_36"
    },
    // 나: 사라져? 전학생들이?
    "day3_lunch_rooftop_36": {
        character: null,
        next: "day3_lunch_rooftop_37"
    },
    // 유나: 네. 다 그래요. 길면 일주일...
    "day3_lunch_rooftop_37": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_38"
    },
    // 유나가 나를 본다. 시선은 단단하다.
    "day3_lunch_rooftop_38": {
        character: null,
        next: "day3_lunch_rooftop_39"
    },
    // 유나: 선배는... 13번째예요.
    "day3_lunch_rooftop_39": {
        character: "yuna_scared",
        next: "day3_lunch_rooftop_40",
        glitch: { noise: true, noiseDuration: 500, shake: true, shakeDuration: 500 }
    },
    // ...13번째.
    "day3_lunch_rooftop_40": {
        character: null,
        next: "day3_lunch_rooftop_41"
    },
    // 가슴이 답답하다. 숨이 안 쉬어진다.
    "day3_lunch_rooftop_41": {
        character: null,
        next: "day3_lunch_rooftop_42"
    },
    // 이 학교에 온 게 처음이 아니다? 내가... 13번째?
    "day3_lunch_rooftop_42": {
        character: null,
        next: "day3_lunch_rooftop_43"
    },
    // 그러면 "전 학교"는? "민수"는? 기억은?
    "day3_lunch_rooftop_43": {
        character: null,
        next: "day3_lunch_door_1"
    },

    // ── 잠긴 문 ──
    "day3_lunch_door_1": {
        character: null,
        glitch: { noise: true, noiseDuration: 300 },
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
                setFlags: ["door_made_noise"]
            },
            {
                next: "day3_lunch_door_wait",
                stats: { yuna: { trust: 5 } }
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
        character: null,
        next: "day3_lunch_door_open_11"
    },
    // 유나가 1층에서 갈라진다. 그 눈이 '미안해요'와 '부탁해요'
    "day3_lunch_door_open_11": {
        character: null,
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
        next: "day3_lunch_sea_2",
        stats: { sea: { affinity: 5 } }
    },
    // 세아의 웃음이 어제랑 다르다. '확인한다'에 가깝다.
    "day3_lunch_sea_2": {
        character: null,
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
        character: null,
        next: "day3_lunch_sea_6"
    },
    // 나: 그걸 어떻게 알아?
    "day3_lunch_sea_6": {
        character: null,
        next: "day3_lunch_sea_7"
    },
    // 세아: 어제 반찬 고를 때 봤지
    "day3_lunch_sea_7": {
        character: "sea_smile",
        next: "day3_lunch_sea_8"
    },
    // ...그랬나? 기억이 안 나는데. 세아가 내 표정을 읽는다.
    "day3_lunch_sea_8": {
        character: null,
        next: "day3_lunch_sea_9"
    },
    // 세아: 요즘 혼자 돌아다니는 거 같더라?
    "day3_lunch_sea_9": {
        character: "sea_serious",
        next: "day3_lunch_sea_10"
    },
    // 나: 별로 안 그런 것 같은데.
    "day3_lunch_sea_10": {
        character: null,
        next: "day3_lunch_sea_11"
    },
    // 세아: 그냥 내 착각이겠지.
    "day3_lunch_sea_11": {
        character: "sea_serious",
        next: "day3_lunch_sea_12"
    },
    // 세아가 젓가락으로 반찬을 집다가 멈춘다. 긴 침묵.
    "day3_lunch_sea_12": {
        character: null,
        next: "day3_lunch_sea_13"
    },
    // 주변이 시끄러운데 이 테이블만 조용하다
    "day3_lunch_sea_13": {
        character: null,
        next: "day3_lunch_sea_14"
    },
    // 세아: 너 나한테 뭐 말 안 한 거 있지.
    "day3_lunch_sea_14": {
        character: "sea_serious",
        next: "day3_lunch_sea_15",
        stats: { sea: { danger: 5 } }
    },
    // 눈이 웃고 있지 않다. 거기에 있는 건 공포다. 내가 벗어나는 게 무서운 거다.
    "day3_lunch_sea_15": {
        character: null,
        next: "day3_lunch_sea_16"
    },
    // 세아: ...농담이야. 먹어.
    "day3_lunch_sea_16": {
        character: "sea_smile",
        next: "day3_lunch_sea_17"
    },
    // 이번엔 완벽한 웃음이다. 너무 완벽해서 오히려 소름이 돋는다.
    "day3_lunch_sea_17": {
        character: null,
        next: "day3_lunch_end"
    },

    // ══════════════════════════════════════
    //  리인 루트: 보건실 건강 음료
    // ══════════════════════════════════════
    "day3_lunch_riin_1": {
        background: "nurse_office",
        character: null,
        next: "day3_lunch_riin_2"
    },
    // 리인: 안색이 별로네
    "day3_lunch_riin_2": {
        character: "riin_smile",
        next: "day3_lunch_riin_3"
    },
    // 나: 좀 어지러워서요
    "day3_lunch_riin_3": {
        character: null,
        next: "day3_lunch_riin_4"
    },
    // 침대에 앉았다. 이마에 손. 서늘한 손.
    "day3_lunch_riin_4": {
        character: null,
        next: "day3_lunch_riin_5"
    },
    // 리인: 열은 없는데 얼굴색이 안 좋네
    "day3_lunch_riin_5": {
        character: "riin_smile",
        next: "day3_lunch_riin_6"
    },
    // 캐비닛에서 뭔가를 꺼낸다. 어깨가 잠깐 멈칫한다.
    "day3_lunch_riin_6": {
        character: null,
        next: "day3_lunch_riin_7"
    },
    // 리인: 선생님이 만든 건강 음료 줄까?
    "day3_lunch_riin_7": {
        character: "riin_smile",
        next: "day3_lunch_riin_8"
    },
    // 연보라색 액체. 약품 같은 냄새. 손이 떨리고 있다.
    "day3_lunch_riin_8": {
        character: null,
        next: "day3_lunch_riin_9"
    },
    // 리인: 비타민이랑 허브 블렌딩이야. 몸에 좋아.
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
                stats: { riin: { affinity: 5, danger: 10 } }
            },
            {
                next: "day3_lunch_riin_refuse_1"
            }
        ]
    },
    // 마심: 쓴맛이 혀 밑에 남는다
    "day3_lunch_riin_drink_1": {
        character: null,
        next: "day3_lunch_riin_drink_2"
    },
    // 리인: 다 마실 필요는 없어
    "day3_lunch_riin_drink_2": {
        character: "riin_smile",
        next: "day3_lunch_riin_drink_3"
    },
    // 리인이 컵을 가져간다. 입술을 세게 깨물고 있다.
    "day3_lunch_riin_drink_3": {
        character: null,
        next: "day3_lunch_end"
    },
    // 거절: 리인 "...그래? 괜찮아."
    "day3_lunch_riin_refuse_1": {
        character: "riin_smile",
        next: "day3_lunch_riin_refuse_2"
    },
    // 싱크대에 버린다. 어깨에서 힘이 빠진다. ...안도.
    "day3_lunch_riin_refuse_2": {
        character: null,
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
