/**
 * Day 4-2: Lunch - 수색
 * 3 choices: 유나 찾기 / 보건실 / 옥상
 * 유나: 사진부 교실(창문 진입), 사물함 이중바닥 카메라, 지하실 발견,
 *       지하 연구실(의료 침대, 뇌파 측정기, 피험자 기록 #1-#13),
 *       유나 구출, 은수 관찰 일지, 설화 환각 진실, 타이머 선택지
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
        character: null,
        next: "day4_lunch_choice"
    },

    "day4_lunch_choice": {
        character: null,
        choices: [
            { next: "day4_lunch_yuna_1" },
            { next: "day4_lunch_nurse_1" },
            { next: "day4_lunch_roof_1" }
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
        next: "day4_lunch_yuna_2"
    },
    "day4_lunch_yuna_2": {
        character: null,
        // 창문 진입
        next: "day4_lunch_yuna_3"
    },

    // ── 사물함 조사 ──
    "day4_lunch_yuna_3": {
        character: null,
        // 유나의 사물함 — 텅 비어있다
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
        next: "day4_lunch_yuna_9"
    },
    "day4_lunch_yuna_9": {
        character: null,
        // 날짜가 어젯밤
        next: "day4_lunch_yuna_10"
    },

    // ── 구관 복도, 지하 진입 ──
    "day4_lunch_yuna_10": {
        character: null,
        // 관계자 외 출입금지, 녹슨 문, 자물쇠 부서짐
        background: "old_building",
        next: "day4_lunch_yuna_11"
    },
    "day4_lunch_yuna_11": {
        character: null,
        // 안쪽에서 부순 흔적 — 유나
        next: "day4_lunch_yuna_12"
    },
    "day4_lunch_yuna_12": {
        character: null,
        // 계단을 내려간다
        next: "day4_lunch_yuna_13"
    },
    "day4_lunch_yuna_13": {
        character: null,
        // 첫 번째 계단, 핸드폰 플래시
        next: "day4_lunch_yuna_14"
    },
    "day4_lunch_yuna_14": {
        character: null,
        // 습한 냄새, 소독약
        next: "day4_lunch_yuna_15"
    },
    "day4_lunch_yuna_15": {
        character: null,
        // 두 번째, 세 번째 계단, 습도
        next: "day4_lunch_yuna_16"
    },
    "day4_lunch_yuna_16": {
        character: null,
        // 계단 꺾이는 곳, 형광등 불빛
        next: "day4_lunch_yuna_17"
    },
    "day4_lunch_yuna_17": {
        character: null,
        // 심장, 돌아갈 수 있다
        next: "day4_lunch_yuna_18"
    },
    "day4_lunch_yuna_18": {
        character: null,
        // 돌아가면 뭐가 달라지나 — 내려간다
        next: "day4_lunch_yuna_19"
    },

    // ── 지하 연구실 발견 ──
    "day4_lunch_yuna_19": {
        character: null,
        // ...지하실.
        background: "underground_lab",
        bgm: "dread.mp3",
        next: "day4_lunch_yuna_20"
    },
    "day4_lunch_yuna_20": {
        character: null,
        // 넓다, 교실 두 개 크기, 형광등 지직
        next: "day4_lunch_yuna_21"
    },
    "day4_lunch_yuna_21": {
        character: null,
        // 의료용 침대 여섯 대, 가죽 끈, 발버둥 흔적
        next: "day4_lunch_yuna_22"
    },
    "day4_lunch_yuna_22": {
        character: null,
        // 심전도, 뇌파 측정기, 대기 LED
        next: "day4_lunch_yuna_23"
    },
    "day4_lunch_yuna_23": {
        character: null,
        // 약품 캐비넷 유리 깨짐 — 유나. 앰플 M-07, M-09, S-13
        next: "day4_lunch_yuna_24"
    },
    "day4_lunch_yuna_24": {
        character: null,
        // 냉장고, 혈액 팩
        next: "day4_lunch_yuna_25"
    },
    "day4_lunch_yuna_25": {
        character: null,
        // 바닥 서류 흩어짐, 서류함 넘어짐
        next: "day4_lunch_yuna_26"
    },
    "day4_lunch_yuna_26": {
        character: null,
        // 벽 차트: '피험자 반응 기록'
        next: "day4_lunch_yuna_27"
    },

    // ── 피험자 기록 #1~#3 ──
    "day4_lunch_yuna_27": {
        character: null,
        // 번호와 사진 나열
        setFlags: ["found_subject_records"],
        next: "day4_lunch_yuna_28"
    },
    "day4_lunch_yuna_28": {
        character: null,
        // #1 김도진
        next: "day4_lunch_yuna_29"
    },
    "day4_lunch_yuna_29": {
        character: null,
        // #1 얼굴 — 입술, 눈, 이목구비
        next: "day4_lunch_yuna_30"
    },
    "day4_lunch_yuna_30": {
        character: null,
        // #2 이준서
        next: "day4_lunch_yuna_31"
    },
    "day4_lunch_yuna_31": {
        character: null,
        // #3 박서진
        next: "day4_lunch_yuna_32"
    },
    "day4_lunch_yuna_32": {
        character: null,
        // Day 4 지하실 발견 — 나처럼
        next: "day4_lunch_yuna_33"
    },

    // ── 피험자 기록 #4~#6 ──
    "day4_lunch_yuna_33": {
        character: null,
        // #4 정하율, #5 강민혁, #6 윤재원
        next: "day4_lunch_yuna_34"
    },
    "day4_lunch_yuna_34": {
        character: null,
        // '정상 처리' 손가락 떨림
        next: "day4_lunch_yuna_35"
    },

    // ── 피험자 #13 (나) ──
    "day4_lunch_yuna_35": {
        character: null,
        // #13 — 내 이름, 내 사진, '진행 중'
        glitch: { shake: true, noise: true },
        next: "day4_lunch_yuna_36"
    },
    "day4_lunch_yuna_36": {
        character: null,
        // 다리에서 힘이 빠진다
        next: "day4_lunch_yuna_37"
    },
    "day4_lunch_yuna_37": {
        character: null,
        // 13번째, 같은 몸, 다른 이름, 같은 5일
        next: "day4_lunch_yuna_38"
    },

    // ── 유나 발견 ──
    "day4_lunch_yuna_38": {
        character: null,
        // 구석에서 신음소리
        next: "day4_lunch_yuna_39"
    },
    "day4_lunch_yuna_39": {
        character: null,
        // 몸이 굳었다
        next: "day4_lunch_yuna_40"
    },
    "day4_lunch_yuna_40": {
        character: null,
        // 마지막 침대, 커튼, 맨발, 멍
        next: "day4_lunch_yuna_41"
    },
    "day4_lunch_yuna_41": {
        // "...선배...?"
        character: "yuna_weak",
        next: "day4_lunch_yuna_42"
    },
    "day4_lunch_yuna_42": {
        // 커튼을 젖혔다
        character: null,
        next: "day4_lunch_yuna_43"
    },
    "day4_lunch_yuna_43": {
        character: null,
        // 유나, 묶여 있었다, 한쪽만 풀림
        next: "day4_lunch_yuna_44"
    },
    "day4_lunch_yuna_44": {
        character: null,
        // 창백, 갈라진 입술, 주사 자국 3
        next: "day4_lunch_yuna_45"
    },
    "day4_lunch_yuna_45": {
        character: null,
        // 눈 초점 잃었다가 인식
        next: "day4_lunch_yuna_46"
    },
    "day4_lunch_yuna_46": {
        // "...선배... 여기 왔어요...?"
        character: "yuna_weak",
        next: "day4_lunch_yuna_47"
    },
    "day4_lunch_yuna_47": {
        // "유나...! 괜찮아?"
        character: null,
        next: "day4_lunch_yuna_48"
    },
    "day4_lunch_yuna_48": {
        character: null,
        // 가죽 끈 풀기, 손톱 갈려나감
        next: "day4_lunch_yuna_49"
    },
    "day4_lunch_yuna_49": {
        // "카메라 찾았어요?"
        character: "yuna_weak",
        next: "day4_lunch_yuna_50"
    },
    "day4_lunch_yuna_50": {
        // "찾았어. 여기 있어."
        character: null,
        next: "day4_lunch_yuna_51"
    },

    // ── 유나가 7번 기록을 가리킨다 ──
    "day4_lunch_yuna_51": {
        character: null,
        // 유나 눈에 초점, 기록 봤다는 걸 눈치챔
        next: "day4_lunch_yuna_52"
    },
    "day4_lunch_yuna_52": {
        // "7번... 7번 기록을 봐요..."
        character: "yuna_weak",
        next: "day4_lunch_yuna_53"
    },
    "day4_lunch_yuna_53": {
        // 유나 손가락이 서류 가리킴
        character: null,
        next: "day4_lunch_yuna_54"
    },
    "day4_lunch_yuna_54": {
        character: null,
        // 서류를 뒤졌다, 찾았다
        next: "day4_lunch_yuna_55"
    },

    // ── 피험자 #7 김태호 ──
    "day4_lunch_yuna_55": {
        character: null,
        // #7 사진 — 내 얼굴
        glitch: { shake: true },
        next: "day4_lunch_yuna_56"
    },
    "day4_lunch_yuna_56": {
        character: null,
        // #7 비고: 이설화 탈출 공모, 영구 처리
        next: "day4_lunch_yuna_57"
    },
    "day4_lunch_yuna_57": {
        // 유나: "이설화... 선배가 복도에서 말 거는 그 애..."
        character: "yuna_weak",
        next: "day4_lunch_yuna_58"
    },
    "day4_lunch_yuna_58": {
        // 유나 숨 가쁨, 약 때문
        character: null,
        next: "day4_lunch_yuna_59"
    },

    // ── 피험자 #8~#12 ──
    "day4_lunch_yuna_59": {
        character: null,
        // 나머지 서류, 손 떨림
        next: "day4_lunch_yuna_60"
    },
    "day4_lunch_yuna_60": {
        character: null,
        // #8 최시우, #9 한지호
        next: "day4_lunch_yuna_61"
    },
    "day4_lunch_yuna_61": {
        character: null,
        // #10 송예준, #11 오태현, #12 임서율
        next: "day4_lunch_yuna_62"
    },
    "day4_lunch_yuna_62": {
        character: null,
        // 사진들: 다른 머리색, 다른 이름, 같은 얼굴
        next: "day4_lunch_yuna_63"
    },
    "day4_lunch_yuna_63": {
        character: null,
        // 13명, 13개의 이름, 내 얼굴
        next: "day4_lunch_yuna_64"
    },

    // ── 프로젝트 네버그라드 문서 ──
    "day4_lunch_yuna_64": {
        character: null,
        // 문서 더미를 더 뒤진다
        next: "day4_lunch_yuna_65"
    },
    "day4_lunch_yuna_65": {
        character: null,
        // '동일 피험자 반복 시행 기록 — 프로젝트 네버그라드'
        glitch: { noise: true },
        next: "day4_lunch_yuna_66"
    },
    "day4_lunch_yuna_66": {
        character: null,
        // 피험자 고유 식별, 시행 횟수 13, 정체성 패키지
        next: "day4_lunch_yuna_67"
    },
    "day4_lunch_yuna_67": {
        character: null,
        // '정체성 패키지' — 부품처럼
        next: "day4_lunch_yuna_68"
    },

    // ── 은수 선생님 관찰 일지 ──
    "day4_lunch_yuna_68": {
        // 유나: "은수 선생님 일지도..."
        character: "yuna_weak",
        next: "day4_lunch_yuna_69"
    },
    "day4_lunch_yuna_69": {
        // 은수의 관찰 일지 — 사람을 물건처럼
        character: null,
        next: "day4_lunch_yuna_70"
    },
    "day4_lunch_yuna_70": {
        character: null,
        // 시행 #7 비고: 이설화 영구 격리 처리
        next: "day4_lunch_yuna_71"
    },
    "day4_lunch_yuna_71": {
        character: null,
        // 이설화 — 나와 함께 도망치려 했던 사람
        next: "day4_lunch_yuna_72"
    },
    "day4_lunch_yuna_72": {
        character: null,
        // "영구 격리 처리"된 사람
        next: "day4_lunch_yuna_73"
    },
    "day4_lunch_yuna_73": {
        character: null,
        // '영구 격리 처리' = '폐기'
        next: "day4_lunch_yuna_74"
    },
    "day4_lunch_yuna_74": {
        character: null,
        // 교실 뒷자리의 설화 = 이 기록의 이설화?
        next: "day4_lunch_yuna_75"
    },

    // ── 시행 #8 이후 관찰: 설화 환각 ──
    "day4_lunch_yuna_75": {
        character: null,
        // #8 이후: 허공에 대화, "이설화" 방어 기제, 약물 용량 재검토
        glitch: { shake: true, noise: true },
        next: "day4_lunch_yuna_76"
    },
    "day4_lunch_yuna_76": {
        character: null,
        // 은수 선생님이 이걸 썼다 — '약물 용량 재검토'
        next: "day4_lunch_yuna_77"
    },

    // ── 시행 #9~#12 동일 현상 ──
    "day4_lunch_yuna_77": {
        character: null,
        // #9~#12: 이설화 폐기 처리됨, 환각 확정
        next: "day4_lunch_yuna_78"
    },
    "day4_lunch_yuna_78": {
        character: null,
        // 부기: 방치가 합리적, 환각이 안정에 기여
        next: "day4_lunch_yuna_79"
    },
    "day4_lunch_yuna_79": {
        character: null,
        // 방치 — 죽은 사람의 환각, '안정에 기여'
        next: "day4_lunch_yuna_80"
    },
    "day4_lunch_yuna_80": {
        character: null,
        // ...환각.
        next: "day4_lunch_yuna_81"
    },
    "day4_lunch_yuna_81": {
        character: null,
        // 교실 뒷자리, 복도, "기억해줘" — 전부 내 머릿속
        glitch: { shake: true, ghostText: true },
        next: "day4_lunch_yuna_82"
    },

    // ── 관찰 일지 마지막: 유나 격리 ──
    "day4_lunch_yuna_82": {
        character: null,
        // 마지막 페이지, 이틀 전
        next: "day4_lunch_yuna_83"
    },
    "day4_lunch_yuna_83": {
        character: null,
        // 시행 #13 Day 2: 최유나 접촉 확인, 격리 권고
        next: "day4_lunch_yuna_84"
    },
    "day4_lunch_yuna_84": {
        character: null,
        // 시행 #13 Day 3: 최유나 격리 완료, 이사회 보고 보류
        next: "day4_lunch_yuna_85"
    },
    "day4_lunch_yuna_85": {
        character: null,
        // 이틀 전, 은수 선생님은 알고 있었다
        next: "day4_lunch_yuna_86"
    },
    "day4_lunch_yuna_86": {
        character: null,
        // 유나 '전학'
        next: "day4_lunch_yuna_87"
    },

    // ── 진실의 무게 ──
    "day4_lunch_yuna_87": {
        character: null,
        // 설화는 1년 전에 죽었다, 기억 지워진 채 밥을 먹고 있었다
        glitch: { shake: true },
        next: "day4_lunch_yuna_88"
    },
    "day4_lunch_yuna_88": {
        character: null,
        // 유나도 이걸 읽었다, 혼자서, 묶인 채로
        next: "day4_lunch_yuna_89"
    },

    // ── 유나 대화, 탈출 준비 ──
    "day4_lunch_yuna_89": {
        // "나가야 해요"
        character: "yuna_weak",
        next: "day4_lunch_yuna_90"
    },
    "day4_lunch_yuna_90": {
        // "점심시간 끝나면... 리인 선생님이..."
        character: "yuna_weak",
        next: "day4_lunch_yuna_91"
    },
    "day4_lunch_yuna_91": {
        // 유나가 나를 붙잡는다
        character: null,
        next: "day4_lunch_yuna_92"
    },
    "day4_lunch_yuna_92": {
        // "카메라 안에 전부 있어요. 3년 치 증거."
        character: "yuna_weak",
        next: "day4_lunch_yuna_93"
    },
    "day4_lunch_yuna_93": {
        // "경찰에... 뉴스에..."
        character: "yuna_weak",
        next: "day4_lunch_yuna_94"
    },
    "day4_lunch_yuna_94": {
        // 유나의 손을 잡았다. 차갑다.
        character: null,
        next: "day4_lunch_yuna_timer"
    },

    // ── 타이머 선택지: 6초 ──
    "day4_lunch_yuna_timer": {
        character: null,
        timedChoice: 6000,
        choices: [
            { next: "day4_lunch_yuna_escape" },
            { next: "day4_lunch_yuna_hide" }
        ],
        timeoutNext: "day4_lunch_yuna_hide"
    },

    "day4_lunch_yuna_escape": {
        character: null,
        setFlags: ["yuna_rescued"],
        next: "day4_lunch_yuna_end"
    },
    "day4_lunch_yuna_hide": {
        character: null,
        setFlags: ["yuna_rescued"],
        next: "day4_lunch_yuna_end"
    },
    "day4_lunch_yuna_end": {
        character: null,
        next: "day4_lunch_end"
    },

    // ═══════════════════════════════════════
    // 보건실 루트 — 리인의 본색
    // ═══════════════════════════════════════
    "day4_lunch_nurse_1": {
        background: "nurse_office",
        bgm: "tension_low.mp3",
        character: null,
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
        // 주사기를 뒤로 숨긴다
        character: null,
        next: "day4_lunch_nurse_6"
    },
    "day4_lunch_nurse_6": {
        character: null,
        // 유나 전학 언급
        next: "day4_lunch_nurse_7"
    },
    "day4_lunch_nurse_7": {
        character: null,
        // 리인 표정 변화 0.5초
        next: "day4_lunch_nurse_8"
    },
    "day4_lunch_nurse_8": {
        // "왜 그렇게 쳐다봐?"
        character: "riin_cold",
        next: "day4_lunch_nurse_9"
    },
    "day4_lunch_nurse_9": {
        // 목소리 차가웠다가 부드러워짐
        character: null,
        next: "day4_lunch_nurse_10"
    },
    "day4_lunch_nurse_10": {
        // "유나는 괜찮을 거야"
        character: "riin_smile",
        next: "day4_lunch_nurse_11"
    },
    "day4_lunch_nurse_11": {
        // '괜찮을 거야' — 미래형
        character: null,
        next: "day4_lunch_nurse_12"
    },
    "day4_lunch_nurse_12": {
        character: null,
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
        next: "day4_lunch_nurse_16"
    },
    "day4_lunch_nurse_16": {
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
        character: null,
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
        next: "day4_lunch_roof_5"
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
        changeSlot: "afterschool",
        next: "day4_after_start"
    }
});
