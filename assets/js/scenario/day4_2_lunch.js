/**
 * Day 4-2: Lunch - 유나 실종, 탈출 계획 시작
 * 위화감 75%. 학교 감시 강화. 유나를 찾거나 증거를 모음.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[4]) SCENARIO[4] = {};

Object.assign(SCENARIO[4], {

    "day4_lunch_start": {
        background: "classroom",
        bgm: "tension.mp3",
        character: null,
        next: "day4_lunch_start_2"
    },
    "day4_lunch_start_2": {
        next: "day4_lunch_choice"
    },
    "day4_lunch_choice": {
        choices: [
            {
                next: "day4_lunch_search_yuna"
            },
            {
                next: "day4_lunch_nurse"
            },
            {
                next: "day4_lunch_rooftop"
            }
        ]
    },

    // ── 유나 수색 루트 ──
    "day4_lunch_search_yuna": {
        background: "corridor",
        character: null,
        next: "day4_lunch_search_2"
    },
    "day4_lunch_search_2": {
        next: "day4_lunch_search_3"
    },
    "day4_lunch_search_3": {
        background: "classroom_empty",
        next: "day4_lunch_search_4"
    },
    "day4_lunch_search_4": {
        next: "day4_lunch_search_5",
        setFlags: ["found_yuna_camera"]
    },
    "day4_lunch_search_5": {
        glitch: { noise: true, noiseDuration: 300 },
        next: "day4_lunch_search_6"
    },
    "day4_lunch_search_6": {
        // 누군가 복도에서 지켜보고 있다
        glitch: { screenShake: true, shakeDuration: 200 },
        next: "day4_lunch_end"
    },

    // ── 보건실 루트 - 리인의 본색 ──
    "day4_lunch_nurse": {
        background: "nurse_office",
        character: "riin_smile",
        next: "day4_lunch_nurse_2"
    },
    "day4_lunch_nurse_2": {
        next: "day4_lunch_nurse_3"
    },
    "day4_lunch_nurse_3": {
        character: "riin_cold",
        next: "day4_lunch_nurse_4",
        condition: "drank_riin_medicine"
    },
    "day4_lunch_nurse_3_alt": {
        character: "riin_close",
        next: "day4_lunch_nurse_4"
    },
    "day4_lunch_nurse_4": {
        timedChoice: 6000,
        choices: [
            {
                next: "day4_lunch_nurse_confront",
                stats: { riin: { danger: 10 } }
            },
            {
                next: "day4_lunch_nurse_pretend"
            }
        ],
        timeoutNext: "day4_lunch_nurse_pretend"
    },
    "day4_lunch_nurse_confront": {
        character: "riin_dark",
        next: "day4_lunch_nurse_confront_2"
    },
    "day4_lunch_nurse_confront_2": {
        glitch: { heavyGlitch: true, glitchDuration: 500 },
        next: "day4_lunch_end",
        setFlags: ["confronted_riin"]
    },
    "day4_lunch_nurse_pretend": {
        character: "riin_smile",
        next: "day4_lunch_nurse_pretend_2",
        stats: { riin: { affinity: 5 } }
    },
    "day4_lunch_nurse_pretend_2": {
        next: "day4_lunch_end"
    },

    // ── 옥상 루트 - 설화의 흔적 ──
    "day4_lunch_rooftop": {
        background: "rooftop",
        character: null,
        next: "day4_lunch_rooftop_2"
    },
    "day4_lunch_rooftop_2": {
        next: "day4_lunch_rooftop_3"
    },
    "day4_lunch_rooftop_3": {
        next: "day4_lunch_rooftop_4",
        setFlags: ["found_seolhwa_mark"]
    },
    "day4_lunch_rooftop_4": {
        glitch: { noise: true, noiseDuration: 400, ghostText: "day4_lunch_ghost", ghostDuration: 2000 },
        next: "day4_lunch_rooftop_5"
    },
    "day4_lunch_rooftop_5": {
        next: "day4_lunch_end"
    },

    "day4_lunch_end": {
        background: "classroom",
        character: null,
        next: null
    }
});
