/**
 * Day 4-1: Morning - 감시 극대화 (스릴러 모드 돌입)
 * BGM: tension.mp3. 공포 분위기.
 * 자취방(벽글씨, 거울회피, 봉투) → 통학로(앱 글리치, 동기화 보행) →
 * 정문(전원 같은 미소, 은수 대기, 타이머 8초) → 유나 빈 자리(기억 소거) →
 * 은수 수업('소속')
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    // ═══════════════════════════════════════════════════
    // ── 자취방: 새벽 기상, 벽 글씨, 거울 회피, 봉투 ──
    // ═══════════════════════════════════════════════════

    "day4_morning_start": {
        background: "room_morning",
        bgm: "tension.mp3",
        character: null,
        setMode: "THRILLER",
        next: "day4_morning_start_2"
    },
    // 벽의 글씨 확인
    "day4_morning_start_2": {
        next: "day4_morning_start_3"
    },
    "day4_morning_start_3": {
        next: "day4_morning_start_4"
    },
    // 손톱 밑 상처 발견
    "day4_morning_start_4": {
        next: "day4_morning_start_5"
    },
    // 수면 중 자기가 쓴 건가?
    "day4_morning_start_5": {
        next: "day4_morning_start_6"
    },
    // 깨어 있으면서 기억 못 하는 건가
    "day4_morning_start_6": {
        next: "day4_morning_start_7"
    },

    // ── 거울 회피 시퀀스 ──
    // 김 서린 거울
    "day4_morning_start_7": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_morning_start_8"
    },
    // 형체가 비친다 — 내 윤곽인데 낯설다
    "day4_morning_start_8": {
        next: "day4_morning_start_9"
    },
    // 내 얼굴 위에 다른 얼굴이 겹쳐 보인다
    "day4_morning_start_9": {
        glitch: { noise: true, noiseDuration: 150 },
        next: "day4_morning_start_10"
    },
    // 닦지 않았다 — 얼굴 보는 게 무섭다
    "day4_morning_start_10": {
        next: "day4_morning_start_11"
    },
    // 본능이 말한다. 닦지 마.
    "day4_morning_start_11": {
        unskippable: true,
        next: "day4_morning_start_12"
    },

    // ── 세수, 등교 준비 ──
    // 거울 등지고 세수
    "day4_morning_start_12": {
        next: "day4_morning_start_13"
    },
    // 교복 입는 손이 떨린다
    "day4_morning_start_13": {
        next: "day4_morning_start_14"
    },

    // ── 창문 밖 감시자 ──
    // 양복, 선글라스, 올려다보는 사람
    "day4_morning_start_14": {
        next: "day4_morning_start_15"
    },
    // 2초 깜빡 — 없다
    "day4_morning_start_15": {
        glitch: { screenFlash: true, flashDuration: 100 },
        next: "day4_morning_start_16"
    },
    // 유나의 말 회상: '같은 사람들이 있어요'
    "day4_morning_start_16": {
        next: "day4_morning_start_17"
    },

    // ── 현관문 앞 그림자 ──
    // 문 아래 틈으로 그림자
    "day4_morning_start_17": {
        next: "day4_morning_start_18"
    },
    // 5초, 10초, 숨을 죽였다
    "day4_morning_start_18": {
        unskippable: true,
        glitch: { silence: true, silenceDuration: 2000 },
        next: "day4_morning_start_19"
    },
    // 15초 — 그림자 사라짐, 발소리 없음
    "day4_morning_start_19": {
        next: "day4_morning_start_20"
    },
    // 문을 열었다. 복도에 아무도 없다
    "day4_morning_start_20": {
        next: "day4_morning_start_21"
    },

    // ── 하얀 봉투 ──
    // 현관 앞 바닥에 하얀 봉투
    "day4_morning_start_21": {
        next: "day4_morning_start_22"
    },
    // '금일 일정: 정상 진행. — 관리부'
    "day4_morning_start_22": {
        glitch: { noise: true, noiseDuration: 300 },
        next: "day4_morning_start_23"
    },
    // 관리부? 이 건물에 관리부 같은 건 없다
    "day4_morning_start_23": {
        next: "day4_morning_start_24"
    },
    // 봉투를 가방에 넣었다. 손이 떨린다
    "day4_morning_start_24": {
        next: "day4_morning_commute"
    },

    // ═══════════════════════════════════════════════════
    // ── 통학로: 안전 앱 글리치, 동기화 보행 ──
    // ═══════════════════════════════════════════════════

    "day4_morning_commute": {
        background: "corridor",
        character: null,
        next: "day4_morning_commute_2"
    },
    // '환영합니다, 피험자 #1—' 글리치
    "day4_morning_commute_2": {
        glitch: { corruptText: true, corruptDuration: 300 },
        next: "day4_morning_commute_3"
    },
    // 다시 보니 '좋은 아침이에요, {name}!'
    "day4_morning_commute_3": {
        next: "day4_morning_commute_4"
    },
    // '피험자'? 보안 앱 버그겠지... 아니다
    "day4_morning_commute_4": {
        next: "day4_morning_commute_5"
    },
    // 한 번도 내가 설치한 적 없는 앱
    "day4_morning_commute_5": {
        next: "day4_morning_commute_6"
    },
    // 삭제 시도 — '권한이 없습니다'
    "day4_morning_commute_6": {
        glitch: { noise: true, noiseDuration: 150 },
        next: "day4_morning_commute_7"
    },
    // 나를 관리하는 앱
    "day4_morning_commute_7": {
        next: "day4_morning_commute_8"
    },
    // 횡단보도 — 동기화된 학생들
    "day4_morning_commute_8": {
        next: "day4_morning_commute_9"
    },
    // 전부 같은 속도, 같은 보폭, 같은 각도
    "day4_morning_commute_9": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_morning_gate"
    },

    // ═══════════════════════════════════════════════════
    // ── 정문: 모두가 웃고 있다, 은수 대기 ──
    // ═══════════════════════════════════════════════════

    "day4_morning_gate": {
        background: "school_gate",
        character: null,
        next: "day4_morning_gate_2"
    },
    // 학생들의 표정이 전부 같다
    "day4_morning_gate_2": {
        next: "day4_morning_gate_3"
    },
    // 모두 웃고 있다. 똑같은 미소.
    "day4_morning_gate_3": {
        glitch: { noise: true, noiseDuration: 150 },
        next: "day4_morning_gate_4"
    },
    // 정문을 들어서는 순간 — 표정 전환
    "day4_morning_gate_4": {
        next: "day4_morning_gate_5"
    },
    // 또 다른 한 명. 정문 넘는 순간 동시에 같은 미소
    "day4_morning_gate_5": {
        next: "day4_morning_gate_6"
    },
    // 전원이다. 예외 없이.
    "day4_morning_gate_6": {
        glitch: { noise: true, noiseDuration: 200 },
        unskippable: true,
        next: "day4_morning_gate_7"
    },
    // 세 여학생 동시에 고개를 돌려 나를 본다
    "day4_morning_gate_7": {
        glitch: { noise: true, noiseDuration: 250 },
        next: "day4_morning_gate_8"
    },
    // 인형극 같다
    "day4_morning_gate_8": {
        next: "day4_morning_gate_9"
    },

    // ── 은수 정문 대기 ──
    // 은수 선생님이 서 있다 — 이 사람만 진짜 웃고 있다
    "day4_morning_gate_9": {
        character: "eunsu_gentle",
        next: "day4_morning_gate_10"
    },
    // 그게 더 무섭다
    "day4_morning_gate_10": {
        next: "day4_morning_eunsu"
    },

    "day4_morning_eunsu": {
        next: "day4_morning_eunsu_2"
    },
    "day4_morning_eunsu_2": {
        next: "day4_morning_eunsu_3"
    },
    // 팔짱을 끼고 내 옆에 선다
    "day4_morning_eunsu_3": {
        next: "day4_morning_eunsu_choice"
    },

    // 타이머 선택지 8초: 같이 걷는다 / 먼저 가겠다고 한다
    "day4_morning_eunsu_choice": {
        timedChoice: 8000,
        choices: [
            {
                next: "day4_morning_eunsu_comply",
                stats: { eunsu: { affinity: 5, danger: 5 } }
            },
            {
                next: "day4_morning_eunsu_refuse",
                stats: { eunsu: { danger: 10 } }
            }
        ],
        timeoutNext: "day4_morning_eunsu_comply"
    },

    // 선택1: 같이 걷는다
    "day4_morning_eunsu_comply": {
        character: "eunsu_smile",
        next: "day4_morning_classroom"
    },

    // 선택2: 먼저 가겠다고 한다
    "day4_morning_eunsu_refuse": {
        character: null,
        next: "day4_morning_eunsu_refuse_2"
    },
    "day4_morning_eunsu_refuse_2": {
        character: "eunsu_cold",
        glitch: { noise: true, noiseDuration: 300 },
        next: "day4_morning_eunsu_refuse_3"
    },
    // '위험하니까'
    "day4_morning_eunsu_refuse_3": {
        unskippable: true,
        next: "day4_morning_eunsu_refuse_4"
    },
    // '위험'의 무게가 달라졌다 — 경고다
    "day4_morning_eunsu_refuse_4": {
        next: "day4_morning_eunsu_refuse_5"
    },
    // 은수가 반 걸음 뒤에서 따라온다
    "day4_morning_eunsu_refuse_5": {
        character: "eunsu_gentle",
        next: "day4_morning_classroom"
    },

    // ═══════════════════════════════════════════════════
    // ── 교실: 유나의 빈 자리 — 기억 소거 ──
    // ═══════════════════════════════════════════════════

    "day4_morning_classroom": {
        background: "classroom",
        character: null,
        next: "day4_morning_classroom_2"
    },
    // 유나의 자리 — 비어있다. 흔적 자체가 없다
    "day4_morning_classroom_2": {
        glitch: { silence: true, silenceDuration: 1500 },
        next: "day4_morning_classroom_3"
    },
    // 책상이 너무 깨끗하다
    "day4_morning_classroom_3": {
        next: "day4_morning_classroom_4"
    },
    // 스티커도 없다
    "day4_morning_classroom_4": {
        next: "day4_morning_classroom_5"
    },

    // 세아: '전학 갔대'
    "day4_morning_classroom_5": {
        character: "sea_smile",
        next: "day4_morning_sea"
    },
    "day4_morning_sea": {
        next: "day4_morning_sea_2"
    },
    "day4_morning_sea_2": {
        next: "day4_morning_sea_3"
    },
    // 어제 유나는 3년간의 증거를 보여줬다
    "day4_morning_sea_3": {
        character: "sea_smile",
        next: "day4_morning_sea_4"
    },

    // 앞자리 남학생에게 질문
    "day4_morning_sea_4": {
        next: "day4_morning_sea_5"
    },
    // '그런 애 있었나?'
    "day4_morning_sea_5": {
        glitch: { noise: true, noiseDuration: 200 },
        next: "day4_morning_sea_6"
    },
    // 옆자리 여학생에게 질문
    "day4_morning_sea_6": {
        next: "day4_morning_sea_7"
    },
    // '작년에 전학 간 애?'
    "day4_morning_sea_7": {
        glitch: { noise: true, noiseDuration: 250 },
        next: "day4_morning_sea_8"
    },
    // 유나는 어제까지 여기 있었다
    "day4_morning_sea_8": {
        next: "day4_morning_sea_9"
    },
    // 교실 전체가 유나를 잊은 것처럼
    "day4_morning_sea_9": {
        next: "day4_morning_sea_10"
    },
    // 처음부터 없었던 것처럼
    "day4_morning_sea_10": {
        unskippable: true,
        glitch: { silence: true, silenceDuration: 2000 },
        next: "day4_morning_class_start"
    },

    // ═══════════════════════════════════════════════════
    // ── 은수의 수업 — '소속' ──
    // ═══════════════════════════════════════════════════

    "day4_morning_class_start": {
        character: "eunsu_gentle",
        next: "day4_morning_class_2"
    },
    // 분필로 '소속' 쓴다
    "day4_morning_class_2": {
        next: "day4_morning_class_3"
    },
    // 출석부 — 유나의 이름이 수정 테이프로 지워져 있다
    "day4_morning_class_3": {
        glitch: { noise: true, noiseDuration: 150 },
        next: "day4_morning_class_4"
    },
    // '소속이란 건... 안전함이야'
    "day4_morning_class_4": {
        next: "day4_morning_class_5"
    },
    // '소속되어 있다는 건 — 누군가가 너를 돌봐주고 있다는 뜻이야'
    "day4_morning_class_5": {
        next: "day4_morning_class_6"
    },
    // '이 학교를 떠나려는 건... 쉬운 일이 아니야'
    "day4_morning_class_6": {
        next: "day4_morning_class_7"
    },
    // 선생님의 시선이 나에게 고정, 한 발짝 다가옴
    "day4_morning_class_7": {
        next: "day4_morning_class_8"
    },
    // '떠나려고 한 사람은... 대부분 후회하더라'
    "day4_morning_class_8": {
        unskippable: true,
        next: "day4_morning_class_9"
    },
    // '그렇지, {name}?'
    "day4_morning_class_9": {
        unskippable: true,
        glitch: { corruptText: true, corruptIndices: [3, 7, 12] },
        next: "day4_morning_class_10"
    },
    // 30쌍의 눈 — 전부 웃고 있다
    "day4_morning_class_10": {
        unskippable: true,
        next: "day4_morning_class_11"
    },
    // 아니, 29쌍. 유나의 자리만 비어있다
    "day4_morning_class_11": {
        next: "day4_morning_class_12"
    },
    // 비어있는 자리가 — 대답 같다
    "day4_morning_class_12": {
        character: null,
        unskippable: true,
        glitch: { silence: true, silenceDuration: 2000 },
        next: "day4_morning_end"
    },

    "day4_morning_end": {
        character: null,
        changeSlot: "lunch",
        next: "day4_lunch_start"
    }
});
