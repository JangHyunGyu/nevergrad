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
        return true;
    }

    if (apply()) return;
    var tries = 0;
    var id = setInterval(function () {
        tries += 1;
        if (apply() || tries > 240) clearInterval(id);
    }, 25);
})();
