/**
 * Post-load scenario overlays: choice causality + sea affinity flag wiring + wipe ease.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};
if (!SCENARIO[3]) SCENARIO[3] = {};
if (!SCENARIO[4]) SCENARIO[4] = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

(function () {
    const d1 = SCENARIO[1]["day1_eunsu_10"] || {};
    Object.assign(SCENARIO[1], {
        "day1_eunsu_10": Object.assign({}, d1, {
            choices: [
                { next: "day1_eunsu_11_honest", stats: { eunsu: { affinity: 2 }, sea: { affinity: 1 } } },
                { next: "day1_eunsu_11_brief", stats: { eunsu: { affinity: 1 } } },
                { next: "day1_eunsu_11_sea", stats: { sea: { affinity: 2 } } }
            ]
        }),
        "day1_eunsu_11_honest": {
            characters: { left: "sea_smile", center: "eunsu_normal" },
            next: "day1_eunsu_12"
        },
        "day1_eunsu_11_brief": {
            characters: { left: "sea_smile", center: "eunsu_normal" },
            next: "day1_eunsu_12"
        },
        "day1_eunsu_11_sea": {
            characters: { left: "sea_smile", center: "eunsu_normal" },
            next: "day1_eunsu_12"
        }
    });

    // Day3 locker photo: look already pockets → skip redundant photo_1
    const look = SCENARIO[3]["day3_morning_photo_look"] || {};
    const back = SCENARIO[3]["day3_morning_photo_back"] || {};
    Object.assign(SCENARIO[3], {
        "day3_morning_photo_look": Object.assign({}, look, {
            next: "day3_morning_photo_2"
        }),
        "day3_morning_photo_back": Object.assign({}, back, {
            next: "day3_morning_photo_1"
        })
    });

    const nurse15 = SCENARIO[4]["day4_lunch_nurse_15"] || {};
    Object.assign(SCENARIO[4], {
        "day4_lunch_nurse_15": Object.assign({}, nurse15, {
            choices: [
                { next: "day4_lunch_nurse_16", stats: { riin: { affinity: -3 } } },
                { next: "day4_lunch_nurse_ask_name", stats: { riin: { affinity: 2 } } },
                { next: "day4_lunch_nurse_ask_yuna", stats: { yuna: { affinity: 2 }, seolhwa: { affinity: 1 } } }
            ]
        }),
        "day4_lunch_nurse_ask_name": {
            character: "riin_cold",
            next: "day4_lunch_nurse_ask_name_2"
        },
        "day4_lunch_nurse_ask_name_2": {
            character: "riin_strained_smile",
            next: "day4_lunch_nurse_leave_ask"
        },
        "day4_lunch_nurse_ask_yuna": {
            character: "riin_cold",
            next: "day4_lunch_nurse_ask_yuna_2"
        },
        "day4_lunch_nurse_ask_yuna_2": {
            character: "riin_strained_smile",
            next: "day4_lunch_nurse_leave_yuna"
        },
        "day4_lunch_nurse_leave_ask": {
            background: "hallway",
            character: null,
            setFlags: ["saw_riin_syringe"],
            next: "day4_lunch_end"
        },
        "day4_lunch_nurse_leave_yuna": {
            background: "hallway",
            character: null,
            setFlags: ["saw_riin_syringe"],
            next: "day4_lunch_end"
        }
    });

    let swipeKey = null;
    for (const k of Object.keys(SCENARIO[4] || {})) {
        const g = SCENARIO[4][k] && SCENARIO[4][k].glitch;
        if (g && g.mirrorWipe) { swipeKey = k; break; }
    }
    if (swipeKey) {
        const scene = SCENARIO[4][swipeKey];
        const glitch = Object.assign({}, scene.glitch || {}, {
            swipeThreshold: 0.22,
            swipeVerticalSpan: 0.38
        });
        SCENARIO[4][swipeKey] = Object.assign({}, scene, { glitch });
    }

    const seaBranch = SCENARIO[5]["day5_ending_forget_sea_branch"] || {};
    Object.assign(SCENARIO[5], {
        "day5_ending_forget_sea_branch": Object.assign({}, seaBranch, {
            branches: [
                { condition: "high_sea_affinity", next: "day5_ending_forget_sea_1" }
            ]
        })
    });
})();
