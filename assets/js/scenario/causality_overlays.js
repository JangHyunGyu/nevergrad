/**
 * Post-load scenario overlays: choice causality + sea affinity flag wiring + wipe ease.
 */
if (typeof SCENARIO === 'undefined') var SCENARIO = {};
if (!SCENARIO[1]) SCENARIO[1] = {};
if (!SCENARIO[3]) SCENARIO[3] = {};
if (!SCENARIO[4]) SCENARIO[4] = {};
if (!SCENARIO[5]) SCENARIO[5] = {};

(function () {
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
