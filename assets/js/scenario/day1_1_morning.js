/**
 * ============================================================================
 * Day 1-1: Morning - 벚꽃 흩날리는 전학 첫날
 * ============================================================================
 * 순수 로맨스 미연시 분위기. 위화감은 2% 이하.
 * - 데자뷔 핀 #1: 복도에서 본능적으로 올바른 방향 선택
 * - 세아의 "초코우유 1+1" 핀 (3 choices)
 * - 은수 선생님 (여자) 소개 & 자기소개
 * - 설화 첫 인지 + 안경 남학생 오인 트릭 (2 choices)
 * - 데자뷔 핀 #2: 책상 밑 글씨
 * - 쉬는 시간 급우들 & 도시락 언급
 * - 체육: 근육 기억
 * ============================================================================
 */

if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};

Object.assign(SCENARIO[1], {

    // =====================================================================
    // 오프닝: 벚꽃길 (SCENARIO.md lines 77-91)
    // =====================================================================
    // L77: *4월.*
    "day1_opening_1": {
        background: "cherry_blossom",
        bgm: "spring_bright.mp3",
        character: null,
        next: "day1_opening_2"
    },
    // L79: *벚꽃이 흩날린다...*
    "day1_opening_2": {
        character: null,
        next: "day1_opening_3"
    },
    // L81: *교복이 아직 뻣뻣하다...*
    "day1_opening_3": {
        character: null,
        next: "day1_opening_4"
    },
    // L83: *오늘부터 이 학교 학생이다.*
    "day1_opening_4": {
        character: null,
        next: "day1_opening_5"
    },
    // L85: *전학. 처음이다...*
    "day1_opening_5": {
        character: null,
        next: "day1_opening_6"
    },
    // L87: *전 학교 애들이랑은 SNS로...*
    "day1_opening_6": {
        character: null,
        next: "day1_opening_7"
    },
    // L89: *벚꽃잎이 코끝을 스친다...*
    "day1_opening_7": {
        character: null,
        next: "day1_opening_8"
    },
    // L91: *현실은 그냥 재채기다.*
    "day1_opening_8": {
        character: null,
        next: "day1_gate_1"
    },

    // =====================================================================
    // 교문 (SCENARIO.md lines 93-103)
    // =====================================================================
    // L95: *낯선 교문 앞에 섰다.*
    "day1_gate_1": {
        character: null,
        background: "school_gate",
        next: "day1_gate_2"
    },
    // L97: *꽤 큰 학교다...*
    "day1_gate_2": {
        character: null,
        next: "day1_gate_3"
    },
    // L99: *학생들이 삼삼오오 교문을 지나간다...*
    "day1_gate_3": {
        character: null,
        next: "day1_gate_4"
    },
    // L101: *...아무도 나를 신경 쓰지 않는다...*
    "day1_gate_4": {
        character: null,
        next: "day1_gate_5"
    },
    // L103: *심호흡 한 번. 들어가자...*
    "day1_gate_5": {
        character: null,
        // SCENARIO.md 5506-5538: NG+ 조기 탈주 — 교문에서 "돌아선다" 선택 시 교실 원점 복귀
        branches: [
            { condition: "new_game_plus", next: "day1_gate_ngp_choice" }
        ],
        next: "day1_gate_cctv_1"
    },

    // NG+ 전용: 교문 앞 조기 탈주 선택지
    "day1_gate_ngp_choice": {
        character: null,
        choices: [
            { next: "day1_gate_cctv_1" },
            { next: "day1_gate_ngp_turn_back", setFlags: ["ngp_early_escape_attempted"] }
        ]
    },
    "day1_gate_ngp_turn_back": {
        character: null,
        next: "day1_gate_ngp_warp"
    },
    "day1_gate_ngp_warp": {
        character: null,
        // playEarlyEscapeSequence가 2.5초 화이트아웃 + 1.5초 블랙아웃 처리
        glitch: { earlyEscape: true },
        unskippable: true,
        next: "day1_gate_ngp_classroom"
    },
    "day1_gate_ngp_classroom": {
        character: null,
        background: "classroom",
        next: "day1_gate_ngp_teacher"
    },
    "day1_gate_ngp_teacher": {
        character: "eunsu_smile",
        next: "day1_gate_ngp_teacher_2"
    },
    "day1_gate_ngp_teacher_2": {
        character: null,
        // 주인공은 즉시 자기부정 (SCENARIO.md 5532-5534)
        next: "day1_classroom_1"
    },

    // ── 미세 공포 핀: CCTV (위화감 0%, 주인공은 전혀 의식하지 않음) ──
    // CCTV 3대를 배경 묘사로만 언급, 합리화조차 하지 않음
    "day1_gate_cctv_1": {
        character: null,
        next: "day1_hallway_1"
    },

    // =====================================================================
    // 복도 + 데자뷔 핀 #1 (SCENARIO.md lines 109-117)
    // =====================================================================
    // L109: *복도를 걷는다. 어디로 가야 할지 모르겠다.*
    "day1_hallway_1": {
        character: null,
        background: "hallway",
        sfx: "sfx_footsteps.mp3",
        next: "day1_hallway_2"
    },
    // L111: *안내판을 봐도 교실 위치가 헷갈린다...*
    "day1_hallway_2": {
        character: null,
        next: "day1_hallway_3"
    },
    // L113: *복도를 걷는다. 안내판을 슬쩍 보고 오른쪽으로 꺾었다.*
    // ★ 데자뷔 핀: 주인공은 안내판을 "보고" 선택했다고 믿는다. 1회차 위화감 0%
    "day1_hallway_3": {
        character: null,
        glitch: "deja_vu_direction",
        next: "day1_xover_seolhwa_1"
    },

    // =====================================================================
    // ★ 크로스오버: 설화 특수 대사 (Cupid + NG+ 전용)
    // 1회차 본편의 미스터리를 방해하지 않도록 TRUE/COMPLICIT 이후에만 노출
    // =====================================================================
    "day1_xover_seolhwa_1": {
        condition: ["cupid_played", "new_game_plus"],
        fallback: "day1_sea_meet_1",
        background: "corridor",
        character: "seolhwa_fade",
        glitch: {
            noise: true,
            noiseDuration: 200,
            ghostText: {
                ko: "순응도",
                en: "Compliance",
                ja: "順応度",
                es: "Cumplimiento",
                fr: "Conformité",
                de: "Konformität",
                pt: "Conformidade"
            },
            ghostX: 84,
            ghostY: 17,
            ghostDuration: 450
        },
        stopSfx: true,
        next: "day1_xover_seolhwa_2"
    },
    "day1_xover_seolhwa_2": {
        character: "seolhwa_fade",
        next: "day1_xover_seolhwa_3"
    },
    "day1_xover_seolhwa_3": {
        character: "seolhwa_fade",
        next: "day1_xover_seolhwa_4"
    },
    // 설화 사라짐
    "day1_xover_seolhwa_4": {
        character: null,
        background: "hallway",
        glitch: { noise: true, noiseDuration: 150 },
        next: "day1_xover_seolhwa_5"
    },
    "day1_xover_seolhwa_5": {
        character: null,
        setFlags: ["xover_seolhwa_d1"],
        next: "day1_sea_meet_1"
    },

    // =====================================================================
    // 세아 첫 만남 (SCENARIO.md lines 119-153)
    // =====================================================================
    // L119: 한세아 "혹시 전학생?"
    "day1_sea_meet_1": {
        character: "sea_smile",
        stopSfx: true,
        next: "day1_sea_meet_2",
        setFlags: ["met_sea"]
    },
    // L121: *뒤를 돌아보니 단정한 인상의 여학생이 서 있다.*
    "day1_sea_meet_2": {
        character: "sea_smile",
        next: "day1_sea_meet_3"
    },
    // L123: *밤색 트윈테일에 교복을 깔끔하게 입고 있다...*
    "day1_sea_meet_3": {
        character: "sea_smile",
        next: "day1_sea_meet_4"
    },
    // L125: *웃고 있다. 밝은 애다.*
    "day1_sea_meet_4": {
        character: "sea_smile",
        next: "day1_sea_meet_5"
    },
    // L127: 한세아 "한세아야. 이 반 반장. {name} 맞지?"
    "day1_sea_meet_5": {
        character: "sea_smile",
        next: "day1_sea_meet_6"
    },
    // L129: 나 "어, 응. 맞는데... 내 이름 어떻게 알아?"
    "day1_sea_meet_6": {
        character: "sea_smile",
        next: "day1_sea_meet_7"
    },
    // L131: 한세아 "담임선생님한테 들었지..."
    "day1_sea_meet_7": {
        character: "sea_normal",
        next: "day1_sea_meet_8"
    },
    // L133: 나 "아... 그렇구나."
    "day1_sea_meet_8": {
        character: "sea_normal",
        next: "day1_sea_meet_9"
    },
    // L135: *반장이니까 미리 얘기 듣는 게 당연하다.*
    "day1_sea_meet_9": {
        character: "sea_normal",
        next: "day1_sea_meet_10"
    },
    // L137: 한세아 "교실 찾고 있었지? 따라와, 안내해줄게."
    "day1_sea_meet_10": {
        character: "sea_normal",
        next: "day1_sea_meet_11"
    },
    // L139: *세아가 앞서 걷는다...*
    "day1_sea_meet_11": {
        character: "sea_normal",
        next: "day1_sea_meet_12"
    },
    // L141: 한세아 "여기가 과학실이고, 저 끝이 음악실..."
    "day1_sea_meet_12": {
        character: "sea_normal",
        next: "day1_sea_meet_13"
    },
    // L143: 한세아 "아, 매점은 1층 끝에 있어..."
    "day1_sea_meet_13": {
        character: "sea_normal",
        next: "day1_sea_meet_14"
    },
    // L145: 나 "와, 친절하다. 반장이라 그런 거야?"
    "day1_sea_meet_14": {
        character: "sea_normal",
        next: "day1_sea_meet_15"
    },
    // L147: 한세아 "반장이라 그런 것도 있고..."
    "day1_sea_meet_15": {
        character: "sea_normal",
        next: "day1_sea_meet_16"
    },
    // L149: *세아가 살짝 웃는다.*
    "day1_sea_meet_16": {
        character: "sea_normal",
        next: "day1_sea_meet_17"
    },
    // L151: 한세아 "그냥 새로 온 애가 헤매고 있으면 도와주고 싶잖아."
    "day1_sea_meet_17": {
        character: "sea_smile",
        next: "day1_sea_meet_18"
    },
    // L153: *...좋은 사람이네.*
    "day1_sea_meet_18": {
        character: "sea_smile",
        next: "day1_choco_entry"
    },

    // =====================================================================
    // 초코우유 이벤트 (SCENARIO.md lines 155-208)
    // =====================================================================
    // NG+ 진입 분기: 1회차에서 초코 거부(chose_strawberry)했으면 세아가 핑계 없이 딸기우유를 건넴 (SCENARIO.md 5500)
    "day1_choco_entry": {
        character: "sea_smile",
        branches: [
            { condition: ["new_game_plus", "chose_strawberry"], next: "day1_choco_ngp_1" }
        ],
        next: "day1_choco_1"
    },
    // NG+ 딸기우유 대체 연출 (핑계 없는 건네기)
    "day1_choco_ngp_1": {
        character: "sea_smile",
        glitch: {
            ngPlusGhostText: {
                ko: "...\ub124\uac00 \uac00\ub974\uccd0 \uc92c\uc796\uc544. \uc774\uc804 \ud68c\ucc28\uc5d0\uc11c.",
                en: "...You taught me that. In the previous cycle.",
                ja: "...\u524d\u306e\u5468\u56de\u3067\u3001\u3042\u306a\u305f\u304c\u6559\u3048\u3066\u304f\u308c\u305f\u3067\u3057\u3087\u3002",
                es: "...Tu me ensenaste eso. En el ciclo anterior.",
                fr: "...Tu me l'as appris. Dans le cycle precedent.",
                de: "...Das hast du mir beigebracht. Im vorherigen Durchlauf.",
                pt: "...Voce me ensinou isso. No ciclo anterior."
            },
            ghostDuration: 500
        },
        next: "day1_choco_ngp_2"
    },
    "day1_choco_ngp_2": {
        character: "sea_normal",
        next: "day1_choco_ngp_3"
    },
    "day1_choco_ngp_3": {
        character: "sea_normal",
        setFlags: ["accepted_choco"],
        next: "day1_classroom_1"
    },
    // L157: *교실 가는 길에 세아가 가방에서 뭔가를 꺼낸다.*
    "day1_choco_1": {
        character: "sea_smile",
        next: "day1_choco_2"
    },
    // L159: 한세아 "아 맞다, 이거. 초코우유 하나 줄까?..."
    "day1_choco_2": {
        character: "sea_normal",
        next: "day1_choco_3"
    },
    // L161: *작은 초코우유 팩을 내민다.*
    "day1_choco_3": {
        character: "sea_normal",
        next: "day1_choco_4"
    },
    // L163: *1+1이면 공짜니까 안 받을 이유가 없지.*
    "day1_choco_4": {
        character: "sea_normal",
        next: "day1_choco_5"
    },
    // L167: 나 "어? 고마운데... 이거 왜?"
    "day1_choco_5": {
        character: "sea_normal",
        next: "day1_choco_6"
    },
    // L169: 한세아 "너 긴장해서 아침 안 먹고 왔지?..."
    "day1_choco_6": {
        character: "sea_normal",
        next: "day1_choco_choice"
    },
    // L171-174: 선택지 3개
    "day1_choco_choice": {
        character: "sea_normal",
        choices: [
            {
                next: "day1_choco_accept_1",
                stats: { sea: { affinity: 3 } },
                setFlags: ["accepted_choco"]
            },
            {
                next: "day1_choco_question_1",
                stats: { sea: { affinity: -1 } },
                setFlags: ["questioned_sea", "sea_choco_milk", "chose_strawberry"]
            },
            {
                next: "day1_choco_joke_1",
                stats: { sea: { affinity: 5 } },
                setFlags: ["joked_choco"]
            }
        ]
    },

    // --- 선택 1: "고마워, 잘 마실게." (L176-184) ---
    // L178: *빨대를 꽂아서 마신다. 달다. 맛있다.*
    "day1_choco_accept_1": {
        character: "sea_normal",
        next: "day1_choco_accept_2"
    },
    // L180: 나 "맛있다. 고마워, 세아."
    "day1_choco_accept_2": {
        character: "sea_normal",
        next: "day1_choco_accept_3"
    },
    // L182: 한세아 "맞지? 초코가 무난하잖아."
    "day1_choco_accept_3": {
        character: "sea_smile",
        next: "day1_choco_accept_4"
    },
    // L184: narration *뭐, 대부분 좋아하긴 하지...*
    "day1_choco_accept_4": {
        character: "sea_smile",
        next: "day1_classroom_1"
    },

    // --- 선택 2: "...내가 이거 좋아하는 걸 어떻게 알아?" (L186-198) ---
    // L188: 나 "...잠깐, 내가 초코우유 좋아하는 거 어떻게 알아?"
    "day1_choco_question_1": {
        character: "sea_normal",
        next: "day1_choco_question_2"
    },
    // L190: *세아의 표정이 아주 미세하게 경직됐다...*
    "day1_choco_question_2": {
        character: "sea_normal",
        next: "day1_choco_question_3"
    },
    // L192: 한세아 "...1+1이었다니까?..."
    "day1_choco_question_3": {
        character: "sea_normal",
        next: "day1_choco_question_4"
    },
    // L194: 나 "아니, 맞아. 좋아해. 고마워."
    "day1_choco_question_4": {
        character: "sea_normal",
        next: "day1_choco_question_5"
    },
    // L196: 한세아 "다행이다~"
    "day1_choco_question_5": {
        character: "sea_smile",
        next: "day1_choco_question_6"
    },
    // L198: *세아가 웃는다. 뭐, 1+1이니까...*
    "day1_choco_question_6": {
        character: "sea_smile",
        next: "day1_classroom_1"
    },

    // --- 선택 3: "나 사실 딸기우유가 더 좋긴 한데." (L200-208) ---
    // L202: 나 "나 사실 딸기우유파인데."
    "day1_choco_joke_1": {
        character: "sea_normal",
        next: "day1_choco_joke_2"
    },
    // L204: *세아가 멈칫한다. 아주 잠깐...*
    "day1_choco_joke_2": {
        character: "sea_normal",
        next: "day1_choco_joke_3"
    },
    // L206: 한세아 "아 진짜? ...다음엔 무조건 딸기다. 기억해 둘게."
    "day1_choco_joke_3": {
        character: "sea_smile",
        next: "day1_classroom_1"
    },

    // =====================================================================
    // 교실 입장 & 은수 선생님 (SCENARIO.md lines 210-252)
    // =====================================================================
    // L214: *세아의 안내로 교실에 도착했다.*
    "day1_classroom_1": {
        background: "classroom",
        character: null,
        next: "day1_classroom_2"
    },
    // L216: *문을 열고 들어서니...*
    "day1_classroom_2": {
        character: null,
        sfx: "sfx_door_open.mp3",
        next: "day1_classroom_3"
    },
    // L218: *...긴장된다. 웅성웅성...*
    "day1_classroom_3": {
        character: null,
        next: "day1_classroom_4"
    },
    // L220: *가방을 내려놓고 자리에 앉았다...*
    "day1_classroom_4": {
        character: null,
        next: "day1_classroom_5"
    },
    // L222: *가벼운 수다를 떠는 사이, 교실 문이 열리고 담임선생님이 들어온다.*
    "day1_classroom_5": {
        character: null,
        next: "day1_eunsu_1"
    },
    // L224: *안경을 쓴 젊은 여자 선생님. 부드러운 인상이다.*
    "day1_eunsu_1": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_eunsu_2",
        setFlags: ["met_eunsu"]
    },
    // L226: 박은수 "자, 여러분. 오늘 새로 전학 온 학생을 소개할게요."
    "day1_eunsu_2": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_eunsu_3"
    },
    // L228: *교실이 조용해진다.*
    "day1_eunsu_3": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_eunsu_4"
    },
    // L230: 박은수 "{name} 학생, 나와서 인사해줄래요?"
    "day1_eunsu_4": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_eunsu_5"
    },
    // L232: *칠판 앞에 서니 더 긴장된다...*
    "day1_eunsu_5": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_eunsu_6"
    },
    // L234: 박은수 "어서 와요, 잘 왔어요."
    "day1_eunsu_6": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_eunsu_7"
    },
    // L236: *선생님이 웃는다. 따뜻하게...*
    "day1_eunsu_7": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_eunsu_8"
    },
    // L240: 박은수 "자, 자기소개 해볼까요?"
    "day1_eunsu_8": {
        characters: { left: "sea_smile", center: "eunsu_normal" },
        next: "day1_eunsu_9"
    },
    // L242: 나 "안녕하세요. {name}입니다..."
    "day1_eunsu_9": {
        characters: { left: "sea_smile", center: "eunsu_normal" },
        next: "day1_eunsu_10"
    },
    // L244: 박은수 "취미나 좋아하는 거 없어요?"
    "day1_eunsu_10": {
        characters: { left: "sea_smile", center: "eunsu_normal" },
        choices: [
            { next: "day1_eunsu_11", stats: { eunsu: { affinity: 2 }, sea: { affinity: 1 } } },
            { next: "day1_eunsu_11", stats: { eunsu: { affinity: 1 } } },
            { next: "day1_eunsu_11", stats: { sea: { affinity: 2 } } }
        ]
    },
    // L246: 나 "음... 게임이랑 음악 듣는 거 좋아합니다."
    "day1_eunsu_11": {
        characters: { left: "sea_smile", center: "eunsu_normal" },
        next: "day1_eunsu_12"
    },
    // L248: *학생들이 웃는다...*
    "day1_eunsu_12": {
        characters: { left: "sea_smile", center: "eunsu_normal" },
        next: "day1_eunsu_13"
    },
    // L250: 박은수 "좋아요. 다들 잘 챙겨주세요..."
    "day1_eunsu_13": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_eunsu_14"
    },
    // L252: *자리로 돌아간다. 세아가 엄지를 들어 보여준다...*
    "day1_eunsu_14": {
        characters: { left: "sea_smile", center: "eunsu_warm" },
        next: "day1_seolhwa_1"
    },

    // =====================================================================
    // 설화 첫 인지 + 안경 남학생 (SCENARIO.md lines 254-302)
    // =====================================================================
    // L256: *두 번째 수업이 시작되기 전. 자리에 앉아서 뒤를 슬쩍 봤다.*
    "day1_seolhwa_1": {
        character: null,
        next: "day1_seolhwa_2"
    },
    // L258: *뒷자리에 누가 있다.*
    "day1_seolhwa_2": {
        character: null,
        next: "day1_seolhwa_3"
    },
    // L260: *색이 옅고 부스스한 머리...*
    "day1_seolhwa_3": {
        character: "seolhwa_quiet",
        next: "day1_seolhwa_4"
    },
    // L262: *유독 조용하다...*
    "day1_seolhwa_4": {
        character: "seolhwa_quiet",
        next: "day1_seolhwa_5"
    },
    // L264: *뒤쪽 구석에 안경 쓴 남학생도...*
    "day1_seolhwa_5": {
        character: null,
        next: "day1_seolhwa_choice"
    },
    // L268-270: 선택지 2개
    "day1_seolhwa_choice": {
        character: null,
        choices: [
            {
                next: "day1_seolhwa_greet_1",
                setFlags: ["greeted_seolhwa", "met_seolhwa"],
                stats: { seolhwa: { affinity: 3 } }
            },
            {
                next: "day1_seolhwa_skip",
                setFlags: ["skipped_seolhwa"]
            }
        ]
    },

    // --- 선택 1: "안녕, 나 {name}이야." (L272-302) ---
    // L274: *뒤를 돌아봤다.*
    "day1_seolhwa_greet_1": {
        character: null,
        next: "day1_seolhwa_greet_2"
    },
    // L276: 나 "안녕, 나 {name}이야. 잘 부탁해."
    "day1_seolhwa_greet_2": {
        character: null,
        next: "day1_seolhwa_greet_3"
    },
    // L278: *설화가 나를 봤다. 눈이 마주친다.*
    "day1_seolhwa_greet_3": {
        character: "seolhwa_quiet",
        next: "day1_seolhwa_greet_4"
    },
    // L280: *...어색하게 웃는다...*
    "day1_seolhwa_greet_4": {
        character: "seolhwa_quiet",
        next: "day1_seolhwa_greet_5"
    },
    // L282: *짧은 침묵 후, 아주 작은 목소리로:*
    "day1_seolhwa_greet_5": {
        character: "seolhwa_quiet",
        next: "day1_seolhwa_greet_6"
    },
    // L284: 이설화 "...안녕."
    "day1_seolhwa_greet_6": {
        character: "seolhwa_quiet",
        next: "day1_seolhwa_greet_7"
    },
    // L286: *한마디. 그것뿐이다...*
    "day1_seolhwa_greet_7": {
        character: "seolhwa_quiet",
        next: "day1_seolhwa_greet_8"
    },
    // L288: 옆자리 남학생 "야, 전학생. 뒤에 누구한테 말한 거야?"
    "day1_seolhwa_greet_8": {
        character: null,
        next: "day1_seolhwa_greet_9"
    },
    // L290: 나 "뒤에 앉은 애한테 인사했는데, 반응이 없어서."
    "day1_seolhwa_greet_9": {
        character: null,
        next: "day1_seolhwa_greet_10"
    },
    // L292: 옆자리 남학생 "아, 쟤? 원래 아무랑도 말 안 해. 1학년 때부터 저래."
    "day1_seolhwa_greet_10": {
        character: null,
        next: "day1_seolhwa_greet_11"
    },
    // L294: *뒤를 봤다. 설화가 창밖을 보고 있다. 구석의 안경 남학생도...*
    "day1_seolhwa_greet_11": {
        character: null,
        next: "day1_seolhwa_greet_12"
    },
    // L296: 나 "그런가. 조용한 타입이구나."
    "day1_seolhwa_greet_12": {
        character: null,
        next: "day1_seolhwa_greet_13"
    },
    // L298: 옆자리 남학생 "말 걸면 가끔 대답은 하는데, 먼저 말 걸어 본 적은 없음. 나도 이름 모름."
    "day1_seolhwa_greet_13": {
        character: null,
        next: "day1_seolhwa_greet_14"
    },
    // L300: *그렇구나. 뭐, 반에 한두 명은 있는 타입이지...*
    "day1_seolhwa_greet_14": {
        character: null,
        next: "day1_dejavu2_1"
    },

    // --- 선택 2: (지금은 수업에 집중하자) ---
    "day1_seolhwa_skip": {
        character: null,
        next: "day1_dejavu2_1"
    },

    // =====================================================================
    // 데자뷔 핀 #2: 책상 밑 글씨 (SCENARIO.md lines 304-314)
    // =====================================================================
    // L306: *수업 중 연필을 떨어뜨려서 책상 밑을 봤다.*
    "day1_dejavu2_1": {
        character: null,
        glitch: "deja_vu_desk",
        next: "day1_dejavu2_2"
    },
    // L308: *책상 밑면에 뭔가 긁힌 자국이 있다...*
    "day1_dejavu2_2": {
        character: null,
        next: "day1_dejavu2_3"
    },
    // L310: *...필체가 낯익다...*
    "day1_dejavu2_3": {
        character: null,
        next: "day1_dejavu2_4"
    },
    // L312: *...읽을 수 없을 만큼 흐릿하다. 신경 쓰지 말자.*
    "day1_dejavu2_4": {
        character: null,
        next: "day1_break_1"
    },

    // =====================================================================
    // 쉬는 시간 — 급우들 (SCENARIO.md lines 316-336)
    // =====================================================================
    // L318: *쉬는 시간. 남학생 몇 명이 다가온다.*
    "day1_break_1": {
        character: null,
        next: "day1_break_2"
    },
    // L320: 급우A "야, 전학생. 어디서 왔어?"
    "day1_break_2": {
        character: null,
        next: "day1_break_3"
    },
    // L322: 나 "○○시요."
    "day1_break_3": {
        character: null,
        next: "day1_break_4"
    },
    // L324: 급우A "게임 뭐 해?"
    "day1_break_4": {
        character: null,
        next: "day1_break_5"
    },
    // L326: *자연스럽게 대화가 이어진다...*
    "day1_break_5": {
        character: null,
        next: "day1_break_6"
    },
    // L328: 급우B "야 근데 세아가 엄청 챙겨주더라."
    "day1_break_6": {
        character: null,
        next: "day1_break_7"
    },
    // L330: 급우A "세아가 원래 저래."
    "day1_break_7": {
        character: null,
        next: "day1_break_8"
    },
    // L332: 급우B "도시락까지 싸온 건 처음인데?"
    "day1_break_8": {
        character: null,
        next: "day1_break_9"
    },
    // L334: *...도시락?*
    "day1_break_9": {
        character: null,
        next: "day1_pe_1"
    },

    // =====================================================================
    // 체육: 근육 기억 (SCENARIO.md lines 338-350)
    // =====================================================================
    // L342: *체육 시간. 축구...*
    "day1_pe_1": {
        background: "playground",
        bgm: "daily_bright.mp3",
        character: null,
        next: "day1_pe_3"
    },
    // L346: 급우A "오 잘하는데?"
    "day1_pe_3": {
        character: null,
        next: "day1_pe_3b"
    },
    // 나 "ㅋㅋ 운 좋았어."
    "day1_pe_3b": {
        character: null,
        next: "day1_pe_4"
    },
    // *유나가 운동장 구석에서 카메라를 들고 있다.*
    "day1_pe_4": {
        character: null,
        sfx: "sfx_camera_shutter.mp3",
        next: "day1_pe_yuna_1"
    },
    "day1_pe_yuna_1": {
        character: "yuna_shy",
        next: "day1_pe_yuna_2"
    },
    "day1_pe_yuna_2": {
        character: "yuna_shy",
        setFlags: ["met_yuna"],
        next: "day1_pe_yuna_3"
    },
    "day1_pe_yuna_3": {
        character: "yuna_shy",
        next: "day1_pe_wall_1"
    },

    // ── 담장 (위화감 0%, 배경 묘사만. 주인공은 전혀 의식하지 않음) ──
    "day1_pe_wall_1": {
        character: null,
        next: "day1_pe_wall_3"
    },
    "day1_pe_wall_3": {
        character: null,
        next: "day1_morning_end"
    },

    // =====================================================================
    // 아침 파트 종료 → 점심으로
    // =====================================================================
    "day1_morning_end": {
        background: "classroom",
        character: null,
        changeSlot: "lunch",
        next: "day1_lunch_start"
    }
});
