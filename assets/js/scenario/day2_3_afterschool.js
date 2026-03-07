/**
 * Day 2-3: Afterschool - 위화감 상승 (15%)
 * 은수의 폰 검사, 세아의 독점욕, 설화 BGM 끊김 연출
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[2]) SCENARIO[2] = {};

Object.assign(SCENARIO[2], {

    "day2_after_start": {
        background: "classroom",
        bgm: "sunset_warm.mp3",
        character: null,
        sunset: true,
        next: "day2_after_eunsu_phone"
    },

    // ===== 은수의 폰 검사 (핵심 위화감 이벤트) =====
    "day2_after_eunsu_phone": {
        character: "eunsu_smile",
        sunset: true,
        next: "day2_after_eunsu_phone_2"
    },
    "day2_after_eunsu_phone_2": {
        next: "day2_after_eunsu_phone_3"
    },
    "day2_after_eunsu_phone_3": {
        next: "day2_after_eunsu_phone_choice",
        stats: { eunsu: { danger: 8 } }
    },
    "day2_after_eunsu_phone_choice": {
        character: null,
        choices: [
            {
                next: "day2_after_phone_comply",
                stats: { eunsu: { affinity: 5, danger: 5 } },
                setFlags: ["gave_phone_eunsu"]
            },
            {
                next: "day2_after_phone_refuse",
                stats: { eunsu: { affinity: -3, danger: 3 } },
                setFlags: ["refused_phone_eunsu"]
            }
        ]
    },
    "day2_after_phone_comply": {
        character: "eunsu_smile",
        next: "day2_after_phone_comply_2",
        setFlags: ["phone_checked"]
    },
    "day2_after_phone_comply_2": {
        character: null,
        next: "day2_after_choice"
    },
    "day2_after_phone_refuse": {
        character: "eunsu_smile",
        next: "day2_after_phone_refuse_2"
    },
    "day2_after_phone_refuse_2": {
        character: null,
        next: "day2_after_choice"
    },

    // ===== 방과후 선택 =====
    "day2_after_choice": {
        sunset: true,
        choices: [
            { next: "day2_after_sea" },
            { next: "day2_after_yuna", condition: "met_yuna" },
            { next: "day2_after_riin", condition: "met_riin" },
            { next: "day2_after_home" }
        ]
    },

    // 세아 — 독점욕 심화
    "day2_after_sea": {
        background: "classroom",
        character: "sea_smile",
        sunset: true,
        next: "day2_after_sea_2"
    },
    "day2_after_sea_2": {
        character: "sea_shy",
        next: "day2_after_sea_3",
        stats: { sea: { affinity: 5 } }
    },
    "day2_after_sea_3": {
        next: "day2_after_sea_4"
    },
    "day2_after_sea_4": {
        character: "sea_smile",
        next: "day2_after_end",
        stats: { sea: { danger: 5 } }
    },

    // 유나 — 뭔가 말하려다 멈춤
    "day2_after_yuna": {
        background: "library",
        character: "yuna_normal",
        sunset: true,
        next: "day2_after_yuna_2"
    },
    "day2_after_yuna_2": {
        character: "yuna_scared",
        next: "day2_after_yuna_3",
        stats: { yuna: { trust: 5 } }
    },
    "day2_after_yuna_3": {
        character: "yuna_smile",
        next: "day2_after_end"
    },

    // 리인 — 이상한 서류
    "day2_after_riin": {
        background: "nurse_office",
        character: "riin_smile",
        sunset: true,
        next: "day2_after_riin_2"
    },
    "day2_after_riin_2": {
        next: "day2_after_riin_3"
    },
    "day2_after_riin_3": {
        character: "riin_cold",
        next: "day2_after_riin_4"
    },
    "day2_after_riin_4": {
        character: "riin_smile",
        next: "day2_after_end"
    },

    // 귀가 — 설화 목격 (greeted_seolhwa 플래그 시)
    "day2_after_home": {
        background: "school_gate",
        sunset: true,
        next: "day2_after_home_check"
    },
    "day2_after_home_check": {
        branches: [
            { condition: "greeted_seolhwa", next: "day2_after_home_seolhwa" },
            { next: "day2_after_end" }
        ]
    },
    "day2_after_home_seolhwa": {
        // 글리치 레벨 1: BGM 끊김 + 미세 노이즈
        glitch: { silence: true, silenceDuration: 3000 },
        character: "seolhwa_normal",
        next: "day2_after_home_seolhwa_2"
    },
    "day2_after_home_seolhwa_2": {
        character: null,
        next: "day2_after_home_seolhwa_3"
    },
    "day2_after_home_seolhwa_3": {
        next: "day2_after_end"
    },

    "day2_after_end": {
        background: "street",
        character: null,
        sunset: true,
        next: null
    }
});
