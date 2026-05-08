/**
 * ============================================================================
 * config.js - Nevergrad: 졸업하지 못한 교실 - 게임 설정
 * ============================================================================
 */

const NEVERGRAD_TEXT_MARKERS = (typeof globalThis !== 'undefined' && globalThis.NEVERGRAD_TEXT_MARKERS) || Object.freeze({
    unknownName(lang = 'ko') {
        const labels = {
            ko: '미상',
            en: 'Unknown',
            ja: '不明',
            es: 'Desconocido',
            fr: 'Inconnu',
            de: 'Unbekannt',
            pt: 'Desconhecido'
        };
        return labels[lang] || labels.en;
    },

    lockedTitle(lang = 'ko') {
        const labels = {
            ko: '미해금',
            en: 'Locked',
            ja: '未解放',
            es: 'Bloqueado',
            fr: 'Verrouillé',
            de: 'Gesperrt',
            pt: 'Bloqueado'
        };
        return labels[lang] || labels.en;
    },

    corruptedRecord(lang = 'ko') {
        const labels = {
            ko: '기록 손상',
            en: 'Record Corrupted',
            ja: '記録破損',
            es: 'Registro dañado',
            fr: 'Dossier corrompu',
            de: 'Datensatz beschädigt',
            pt: 'Registro corrompido'
        };
        return labels[lang] || labels.en;
    },

    corruptedPlaceholder(length = 3) {
        return '?'.repeat(Math.max(1, Number(length) || 3));
    }
});

if (typeof globalThis !== 'undefined') {
    globalThis.NEVERGRAD_TEXT_MARKERS = NEVERGRAD_TEXT_MARKERS;
}

const CONFIG = {
    // ===== 게임 기본 설정 =====
    TITLE: "졸업하지 못한 교실",
    SUBTITLE: "5일의 기록",
    VERSION: "0.1.1",

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
        unknown: NEVERGRAD_TEXT_MARKERS.unknownName('ko')
    },

    // 이름 공개 후 전환되는 실명
    CHAR_REAL_NAMES: {
        eunsu: "은수",
        riin: "리인"
    },

    // ===== 캐릭터 표정 매핑 =====
    EXPRESSIONS: {
        eunsu: {
            normal: "assets/images/characters/eunsu_normal.webp",
            smile: "assets/images/characters/eunsu_smile.webp",
            gentle: "assets/images/characters/eunsu_gentle.webp",
            warm: "assets/images/characters/eunsu_warm.webp",
            serious: "assets/images/characters/eunsu_serious.webp",
            cold: "assets/images/characters/eunsu_cold.webp",
            dark: "assets/images/characters/eunsu_dark.webp",
            obsessed: "assets/images/characters/eunsu_obsessed.webp",
            writing: "assets/images/characters/eunsu_normal.webp",    // alias: 서류 작성 중
            pa: "assets/images/characters/eunsu_normal.webp",         // alias: PA 방송 (음성만)
            shaking: "assets/images/characters/eunsu_shaking.webp",   // 떨리는 상태
            shocked: "assets/images/characters/eunsu_cold.webp",      // alias: 충격받은 상태
            crying: "assets/images/characters/eunsu_crying.webp"      // 울먹이는 상태
        },
        riin: {
            normal: "assets/images/characters/riin_normal.webp",
            smile: "assets/images/characters/riin_smile.webp",
            gentle: "assets/images/characters/riin_gentle.webp",
            cold: "assets/images/characters/riin_cold.webp",
            dark: "assets/images/characters/riin_dark.webp",
            neutral: "assets/images/characters/riin_neutral.webp",
            casual: "assets/images/characters/riin_normal.webp",      // alias: 평상시
            pain: "assets/images/characters/riin_pain.webp",          // 고통/죄책감
            relief: "assets/images/characters/riin_relief.webp"       // 안도
        },
        sea: {
            normal: "assets/images/characters/sea_normal.webp",
            smile: "assets/images/characters/sea_smile.webp",
            serious: "assets/images/characters/sea_serious.webp",
            stare: "assets/images/characters/sea_stare.webp",
            sad: "assets/images/characters/sea_sad.webp",
            hurt: "assets/images/characters/sea_hurt.webp",
            cry: "assets/images/characters/sea_cry.webp",
            yandere: "assets/images/characters/sea_yandere.webp",
            cold: "assets/images/characters/sea_serious.webp",        // alias: 차가운 표정
            vulnerable: "assets/images/characters/sea_vulnerable.webp",
            broken_smile: "assets/images/characters/sea_broken_smile.webp"
        },
        yuna: {
            normal: "assets/images/characters/yuna_normal.webp",
            smile: "assets/images/characters/yuna_smile.webp",
            shy: "assets/images/characters/yuna_shy.webp",
            scared: "assets/images/characters/yuna_scared.webp",
            cry: "assets/images/characters/yuna_cry.webp",
            weak: "assets/images/characters/yuna_weak.webp",
            determined: "assets/images/characters/yuna_determined.webp",
            cautious: "assets/images/characters/yuna_scared.webp",    // alias: 경계하는 상태
            worried: "assets/images/characters/yuna_scared.webp"      // alias: 걱정하는 상태
        },
        seolhwa: {
            normal: "assets/images/characters/seolhwa_normal.webp",
            smile: "assets/images/characters/seolhwa_smile.webp",
            sad: "assets/images/characters/seolhwa_sad.webp",
            fade: "assets/images/characters/seolhwa_fade.webp",
            fading: "assets/images/characters/seolhwa_fade.webp",     // alias: 사라지는 중
            ghost: "assets/images/characters/seolhwa_ghost.webp",
            quiet: "assets/images/characters/seolhwa_quiet.webp"
        },
        classmate: {
            default: null  // 급우: 전용 이미지 없음, 엔진에서 null 처리
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
        corridor_dark: "assets/images/background/corridor_dark.png",     // 어두운 복도 (고유)
        room_morning: "assets/images/background/room_morning.png",
        school_gate_evening: "assets/images/background/school_gate.png", // school_gate + sunset
        // 학교 외부 (구도가 고유한 것)
        garden: "assets/images/background/garden.png",
        school_gate: "assets/images/background/school_gate.png",
        school_night: "assets/images/background/school_night.png",      // 외부에서 본 밤 학교 (고유)
        school_dark: "assets/images/background/school_dark.png",        // 내부 칠흑 복도 (고유)
        school_dawn: "assets/images/background/school_dawn.png",        // 새벽 안개 속 학교 (고유)
        sunset_outside: "assets/images/background/sunset_outside.png",  // 언덕 파노라마 (고유)
        street: "assets/images/background/street.png",
        outside_school: "assets/images/background/outside_school.png",
        exit_door: "assets/images/background/exit_door.png",
        cherry_blossom: "assets/images/background/cherry_blossom.png",
        night_rain: "assets/images/background/night_rain.png",          // 도시 거리 비 (고유)
        // 자취방
        home: "assets/images/background/home.png",
        room_night: "assets/images/background/room_night.png",        // 스탠드+폰빛 고유 구도
        bathroom: "assets/images/background/bathroom_night.png",
        bathroom_night: "assets/images/background/bathroom_night.png",
        // 특수
        black: "assets/images/background/black.png",
        white: "assets/images/background/white.png",
        // 물증 클로즈업
        closeup_safety_app: "assets/images/background/closeup_safety_app.png",
        closeup_white_envelope: "assets/images/background/closeup_white_envelope.png",
        closeup_fingernails: "assets/images/background/closeup_fingernails.png",
        closeup_sd_card: "assets/images/background/closeup_sd_card.png",
        closeup_attendance_book: "assets/images/background/closeup_attendance_book.png",
        closeup_subject_ledger: "assets/images/background/closeup_subject_ledger.png",
        closeup_fogged_mirror: "assets/images/background/closeup_fogged_mirror.png",
        closeup_cctv_led: "assets/images/background/closeup_cctv_led.png",
        closeup_wall_scratches: "assets/images/background/closeup_wall_scratches.png",
        closeup_desk_underside_scratches: "assets/images/background/closeup_desk_underside_scratches.png",
        // 학교 내부 (추가)
        playground: "assets/images/background/playground.png",
        student_council: "assets/images/background/student_council.png",
        cafeteria: "assets/images/background/cafeteria.png",
        old_building_corridor: "assets/images/background/old_building_corridor.png",
        corridor_old: "assets/images/background/corridor_old.png",
        corridor_main: "assets/images/background/corridor.png",            // 본관 복도 (corridor 재사용)
        corridor_emergency: "assets/images/background/emergency_corridor.png",
        locked_corridor_junction: "assets/images/background/locked_corridor_junction.webp",
        old_infirmary: "assets/images/background/old_infirmary.png",
        old_stairway: "assets/images/background/old_stairway.png",
        old_corridor_dark: "assets/images/background/old_corridor_dark.png",
        hidden_service_passage: "assets/images/background/hidden_service_passage.webp",
        underground_lab: "assets/images/background/underground_lab.png",
        basement_records_room: "assets/images/background/basement_records_room.webp",
        // 학교 외부 (추가)
        school_back: "assets/images/background/school_back.png",
        street_morning: "assets/images/background/street_morning.png",
        school_gate_dark: "assets/images/background/school_gate_dark.png",
        school_gate_morning: "assets/images/background/school_gate_morning.png",
        school_fence_dawn: "assets/images/background/school_fence_dawn.png",
        // 자취방 (추가)
        room_dark: "assets/images/background/room_dark.png",
        apartment_entry_morning: "assets/images/background/apartment_entry_morning.webp",
        // 엔딩 전용
        emergency_exit: "assets/images/background/emergency_exit.png",
        emergency_stair_night: "assets/images/background/emergency_stair_night.webp",
        classroom_afternoon: "assets/images/background/classroom_afternoon.png",
        new_classroom: "assets/images/background/new_classroom.png",
        news_article: "assets/images/background/news_article.png",
        dawn_road: "assets/images/background/dawn_road.png",
        new_place: "assets/images/background/new_place.png",
        lab_documents: "assets/images/evidence/day5_lab_documents.png",
        ending_true: "assets/images/cg/ending_true_dawn_gate.png",
        ending_escape: "assets/images/cg/ending_escape_rain.png",
        ending_cage: "assets/images/cg/ending_cage_classroom.png",
        ending_ghost: "assets/images/cg/ending_ghost_classroom.png",
        ending_forget: "assets/images/cg/ending_forget_empty_seat.png",
        office: "assets/images/background/teacher_office.png"              // 사무실 (교무실 재사용)
    },

    EVIDENCE_IMAGES: {
        yuna_photo: "assets/images/evidence/yuna_photo_evidence.png",
        player_photo: "assets/images/evidence/player_yuna_camera_photo_anime.png",
        player_mirror: "assets/images/evidence/player_mirror_reflection_anime.png",
        player_face: "assets/images/evidence/player_face_portrait_anime.png",
        locker_camera: "assets/images/evidence/locker_hidden_camera.png",
        lab_documents: "assets/images/evidence/day5_lab_documents.png"
    },

    SUBJECT_FACE_IMAGES: {
        1: "assets/images/evidence/subjects_anime/subject_01.png",
        2: "assets/images/evidence/subjects_anime/subject_02.png",
        3: "assets/images/evidence/subjects_anime/subject_03.png",
        4: "assets/images/evidence/subjects_anime/subject_04.png",
        5: "assets/images/evidence/subjects_anime/subject_05.png",
        6: "assets/images/evidence/subjects_anime/subject_06.png",
        7: "assets/images/evidence/subjects_anime/subject_07.png",
        8: "assets/images/evidence/subjects_anime/subject_08.png",
        9: "assets/images/evidence/subjects_anime/subject_09.png",
        10: "assets/images/evidence/subjects_anime/subject_10.png",
        11: "assets/images/evidence/subjects_anime/subject_11.png",
        12: "assets/images/evidence/subjects_anime/subject_12.png",
        13: "assets/images/evidence/subjects_anime/subject_13.png"
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
            icon: "♡"
        },
        thriller: {
            // Day 4+에서 캐릭터별 다른 라벨로 표시
            eunsu:   { label: "위험도",  icon: "⚠" },
            sea:     { label: "집착도",  icon: "⚠" },
            riin:    { label: "신뢰도",  icon: "♦" },
            yuna:    { label: "호감도",  icon: "♡" },
            seolhwa: { label: "동기화",  icon: "☆" }
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
// affinity 하나로 통합 — Day 1~3은 "호감도", Day 4+는 캐릭터별 라벨 전환
const INITIAL_STATS = {
    eunsu:   { affinity: 10 },   // 처음부터 은근한 호감
    riin:    { affinity: 5 },
    sea:     { affinity: 15 },   // 처음엔 가장 가까움
    yuna:    { affinity: 5 },    // 유일한 아군 후보
    seolhwa: { affinity: 0 }     // 미지수
};
