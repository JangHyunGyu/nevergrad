/**
 * Low A: clear stale choice buttons on every scene load (incl. QA/direct jump).
 * Marker: __nevergradChoiceClearV1
 */
(function () {
    if (typeof GameEngine === 'undefined') return;
    if (GameEngine.prototype._loadScene && GameEngine.prototype._loadScene.__nevergradChoiceClearV1) return;

    const orig = GameEngine.prototype._loadScene;
    GameEngine.prototype._loadScene = function (sceneId) {
        try {
            this.choices?.hide?.();
            this.choiceAdvanced?.reset?.();
            const panel = document.getElementById('choice-panel');
            if (panel) {
                panel.classList.add('hidden');
                panel.innerHTML = '';
                panel.style.position = '';
                panel.style.minHeight = '';
            }
        } catch (_) { /* non-fatal */ }
        return orig.call(this, sceneId);
    };
    GameEngine.prototype._loadScene.__nevergradChoiceClearV1 = true;
})();
