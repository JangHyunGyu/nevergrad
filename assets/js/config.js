/**
 * ============================================================================
 * config.js - Nevergrad: 졸업하지 못한 교실 - 게임 설정
 * ============================================================================
 */

const CONFIG = {
    // ===== 게임 기본 설정 =====
    TITLE: "졸업하지 못한 교실",
    SUBTITLE: "5일의 기록",
    VERSION: "0.1.0",

    // ===== API =====
    API_ENDPOINT: "https://chatbot-api.yama5993.workers.dev/",
    APP_TYPE: "nevergrad",

    // ===== 타이핑 속도 (ms per char) =====
    TYPING_SPEED: 30,
    TYPING_SPEED_FAST: 10,

    // ===== 일수 =====
    TOTAL_DAYS: 5,
    TIME_SLOTS: ["morning", "lunch", "afterschool", "night"],
    TIME_SLOT_NAMES: {
        morning: "아침",
        lunch: "점심",
        afterschool: "방과후",
        night: "밤"
    },

    // ===== 캐릭터 ID =====
    CHARACTERS: {
        EUNSU: "eunsu",       // 박은수 - 담임교사
        RIIN: "riin",         // 강리인 - 보건교사
        SEA: "sea",           // 한세아 - 반장
        YUNA: "yuna",         // 최유나 - 사진부
        SEOLHWA: "seolhwa"    // 이설화 - 신비로운 소녀
    },

    // ===== 캐릭터 표시 이름 =====
    // 기본 표시 이름 (직함). 호감도 이벤트 후 CHAR_REAL_NAMES로 전환
    CHAR_NAMES: {
        eunsu: "담임교사",
        riin: "보건교사",
        sea: "한세아",
        yuna: "최유나",
        seolhwa: "이설화",
        me: "나",
        unknown: "???"
    },

    // 이름 공개 후 전환되는 실명
    CHAR_REAL_NAMES: {
        eunsu: "은수",
        riin: "리인"
    },

    // ===== 캐릭터 표정 매핑 =====
    EXPRESSIONS: {
        eunsu: {
            normal: "assets/images/characters/eunsu_normal.png",
            smile: "assets/images/characters/eunsu_smile.png",
            gentle: "assets/images/characters/eunsu_gentle.png",
            shy: "assets/images/characters/eunsu_shy.png",
            serious: "assets/images/characters/eunsu_serious.png",
            angry: "assets/images/characters/eunsu_angry.png",
            close: "assets/images/characters/eunsu_close.png",
            cold: "assets/images/characters/eunsu_cold.png",
            dark: "assets/images/characters/eunsu_dark.png",
            obsessed: "assets/images/characters/eunsu_obsessed.png"
        },
        riin: {
            normal: "assets/images/characters/riin_normal.png",
            smile: "assets/images/characters/riin_smile.png",
            seductive: "assets/images/characters/riin_seductive.png",
            close: "assets/images/characters/riin_close.png",
            pleased: "assets/images/characters/riin_pleased.png",
            cold: "assets/images/characters/riin_cold.png",
            dark: "assets/images/characters/riin_dark.png"
        },
        sea: {
            normal: "assets/images/characters/sea_normal.png",
            smile: "assets/images/characters/sea_smile.png",
            shy: "assets/images/characters/sea_shy.png",
            serious: "assets/images/characters/sea_serious.png",
            sad: "assets/images/characters/sea_sad.png",
            angry: "assets/images/characters/sea_angry.png",
            hurt: "assets/images/characters/sea_hurt.png",
            dark: "assets/images/characters/sea_dark.png",
            cry: "assets/images/characters/sea_cry.png",
            yandere: "assets/images/characters/sea_yandere.png"
        },
        yuna: {
            normal: "assets/images/characters/yuna_normal.png",
            smile: "assets/images/characters/yuna_smile.png",
            scared: "assets/images/characters/yuna_scared.png",
            desperate: "assets/images/characters/yuna_desperate.png",
            cry: "assets/images/characters/yuna_cry.png",
            weak: "assets/images/characters/yuna_weak.png",
            determined: "assets/images/characters/yuna_determined.png"
        },
        seolhwa: {
            normal: "assets/images/characters/seolhwa_normal.png",
            smile: "assets/images/characters/seolhwa_smile.png",
            sad: "assets/images/characters/seolhwa_sad.png",
            fade: "assets/images/characters/seolhwa_fade.png",
            fading: "assets/images/characters/seolhwa_fade.png",  // 시나리오 호환 alias
            ghost: "assets/images/characters/seolhwa_ghost.png"
        }
    },

    // ===== 배경 이미지 =====
    // 같은 장소의 시간대 변형은 CSS 필터/오버레이로 처리 (setTimeOfDay)
    // 기본 이미지(낮)만 준비 → morning/sunset/night/dawn/dark/rain 자동 적용
    // 구도/장소 자체가 다른 것만 별도 이미지
    BACKGROUNDS: {
        // 학교 내부
        classroom: "assets/images/background/classroom.png",
        classroom_empty: "assets/images/background/classroom_empty.png",  // 구조 다름
        hallway: "assets/images/background/hallway.png",
        corridor: "assets/images/background/corridor.png",
        stairway: "assets/images/background/stairway.png",
        rooftop: "assets/images/background/rooftop.png",
        nurse_office: "assets/images/background/nurse_office.png",
        teacher_office: "assets/images/background/teacher_office.png",
        faculty_office: "assets/images/background/faculty_office.png",
        gym: "assets/images/background/gym.png",
        library: "assets/images/background/library.png",
        old_building: "assets/images/background/old_building.png",
        basement: "assets/images/background/basement.png",
        // CSS 시간대 변형 (기본 이미지 재사용 + setTimeOfDay 호출)
        corridor_dark: "assets/images/background/corridor.png",           // corridor + dark
        room_morning: "assets/images/background/home.png",               // home + morning
        school_gate_evening: "assets/images/background/school_gate.png", // school_gate + sunset
        // 학교 외부 (구도가 고유한 것)
        garden: "assets/images/background/garden.png",
        school_gate: "assets/images/background/school_gate.png",
        school_night: "assets/images/background/school_night.png",      // 외부에서 본 밤 학교 (고유)
        school_dawn: "assets/images/background/school_dawn.png",        // 새벽 안개 속 학교 (고유)
        sunset_outside: "assets/images/background/sunset_outside.png",  // 언덕 파노라마 (고유)
        street: "assets/images/background/street.png",
        outside_school: "assets/images/background/outside_school.png",
        exit_door: "assets/images/background/exit_door.png",
        cherry_blossom: "assets/images/background/cherry_blossom.png",
        night_rain: "assets/images/background/night_rain.png",          // 도시 거리 비 (고유)
        // 자취방
        home: "assets/images/background/home.png",
        // 특수
        black: "assets/images/background/black.png"
    },

    // ===== 스탯 시스템 =====
    // Phase 1~2 (Day 1~3 오전): "호감도"로 표시 (순수 미연시)
    // Phase 3 (Day 3 밤~): "신뢰도 / 위험도"로 전환
    STAT_MODES: {
        ROMANCE: "romance",     // 호감도 (위장)
        THRILLER: "thriller"    // 신뢰도 + 위험도 (본색)
    },

    STAT_LABELS: {
        romance: {
            primary: "호감도",
            icon: "♥"
        },
        thriller: {
            trust: "신뢰도",
            danger: "위험도",
            icon_trust: "◈",
            icon_danger: "⚠"
        }
    },

    // 스탯 범위
    STAT_MIN: -100,
    STAT_MAX: 100,

    // ===== 장르 전환 트리거 =====
    // Day 3 밤 시나리오 도달 시 전환
    GENRE_SHIFT_SCENE: "day3_night_reveal",

    // ===== 글리치 연출 강도 레벨 =====
    GLITCH_LEVELS: {
        NONE: 0,        // Day 1 전체
        SUBTLE: 1,      // Day 2 오후 (아주 미세한 위화감)
        UNSETTLING: 2,  // Day 3 (불쾌한 골짜기)
        BREAKING: 3,    // Day 4 (장르 전환)
        NIGHTMARE: 4    // Day 5 (완전 붕괴)
    },

    // ===== UI 테마 =====
    THEMES: {
        romance: {
            primary: "#FFB7C5",       // 벚꽃 핑크
            secondary: "#FFF0F5",
            text: "#4A3040",
            dialogueBg: "rgba(255, 240, 245, 0.92)",
            accent: "#FF69B4"
        },
        transition: {
            primary: "#C8A0B0",       // 탁해지는 핑크
            secondary: "#E8D8E0",
            text: "#3A2030",
            dialogueBg: "rgba(232, 216, 224, 0.90)",
            accent: "#B04060"
        },
        thriller: {
            primary: "#8B0000",       // 핏빛
            secondary: "#1A0A0A",
            text: "#D0C0C0",
            dialogueBg: "rgba(26, 10, 10, 0.95)",
            accent: "#FF2020"
        }
    }
};

// ===== 초기 캐릭터 스탯 =====
const INITIAL_STATS = {
    eunsu:   { trust: 0, danger: 30, affinity: 10 },  // 처음부터 은근한 위험
    riin:    { trust: 0, danger: 20, affinity: 5 },
    sea:     { trust: 0, danger: 10, affinity: 15 },   // 처음엔 가장 안전해 보임
    yuna:    { trust: 0, danger: 0,  affinity: 5 },    // 유일한 아군 후보
    seolhwa: { trust: 0, danger: 0,  affinity: 0 }     // 미지수
};

// Phase 1(로맨스)에서는 affinity만 유저에게 보여줌
// Phase 2(스릴러 전환)에서 trust/danger가 드러남
// affinity는 사실 내부적으로 trust + danger의 가중 합이었음을 나중에 폭로
