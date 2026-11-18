/**
 * Low A: clear stale choice buttons on every scene load (incl. QA/direct jump).
 * Marker: __nevergradChoiceClearV1
 * Note: FaviconManager boot runs before GameEngine.js, so we wait for the class.
 */
(function () {
    function apply() {
        if (typeof GameEngine === 'undefined') return false;
        if (GameEngine.prototype._loadScene &&
            GameEngine.prototype._loadScene.__nevergradChoiceClearV1) return true;

        const orig = GameEngine.prototype._loadScene;
        GameEngine.prototype._loadScene = function (sceneId) { var __oc0, __oc1, __oc2, __oc3;
            try {
                (((__oc1 = (__oc0 = this.choices) === null || __oc0 === void 0 ? void 0 : __oc0.hide) === null || __oc1 === void 0 ? void 0 : __oc1.call(__oc0)));
                (((__oc3 = (__oc2 = this.choiceAdvanced) === null || __oc2 === void 0 ? void 0 : __oc2.reset) === null || __oc3 === void 0 ? void 0 : __oc3.call(__oc2)));
                const panel = document.getElementById('choice-panel');
                if (panel) {
                    panel.classList.add('hidden');
                    panel.innerHTML = '';
                    panel.style.position = '';
                    panel.style.minHeight = '';
                    // choiceSelect()의 autoAlpha:0 잔존 방지 (타이머 선택지 invisible 버그)
                    try { if (window.gsap) { window.gsap.killTweensOf(panel); window.gsap.set(panel, { clearProps: 'opacity,visibility' }); } } catch (_) { /* non-fatal */ }
                    panel.style.removeProperty('opacity');
                    panel.style.removeProperty('visibility');
                }
            } catch (_) { /* non-fatal */ }
            return orig.call(this, sceneId);
        };
        GameEngine.prototype._loadScene.__nevergradChoiceClearV1 = true;
        return true;
    }

    if (apply()) return;
    var tries = 0;
    var id = setInterval(function () {
        tries += 1;
        if (apply() || tries > 240) clearInterval(id);
    }, 25);
})();
