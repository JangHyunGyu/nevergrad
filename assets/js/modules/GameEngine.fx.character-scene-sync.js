/**
 * Character/location sync: clear sticky sprites on background change unless cast is set.
 * Marker: __nevergradCharSceneSyncV1
 */
(function () {
    function apply() {
        if (typeof GameEngine === 'undefined') return false;
        if (GameEngine.prototype._loadScene &&
            GameEngine.prototype._loadScene.__nevergradCharSceneSyncV1) return true;

        const orig = GameEngine.prototype._loadScene;
        GameEngine.prototype._loadScene = function (sceneId) {
            const prevBg = this._currentBackgroundKey || null;
            const result = orig.call(this, sceneId);
            try {
                const scene = this.currentSceneData;
                if (!scene || !this.renderer) return result;

                const bgKey = scene.background || this._currentBackgroundKey || null;
                const bgChanged = Boolean(bgKey) && bgKey !== prevBg;
                if (bgKey) this._currentBackgroundKey = bgKey;

                const hasChar = Object.prototype.hasOwnProperty.call(scene, 'character')
                    || Object.prototype.hasOwnProperty.call(scene, 'characters');

                if (bgChanged && !hasChar) {
                    this.renderer.clearCharacters?.({ immediate: true });
                }

                // Singular character: wipe leftover left/right slots
                if (scene.character && !scene.characters) {
                    this.renderer.clearCharacterSlot?.('left', { immediate: bgChanged });
                    this.renderer.clearCharacterSlot?.('right', { immediate: bgChanged });
                }

                // Multi cast: wipe positions not listed
                if (scene.characters && typeof scene.characters === 'object') {
                    const desired = new Set(Object.keys(scene.characters).filter((k) => scene.characters[k]));
                    if (scene.character) desired.add('center');
                    ['left', 'center', 'right'].forEach((pos) => {
                        if (!desired.has(pos)) {
                            this.renderer.clearCharacterSlot?.(pos, { immediate: bgChanged });
                        }
                    });
                }
            } catch (_) { /* non-fatal */ }
            return result;
        };
        GameEngine.prototype._loadScene.__nevergradCharSceneSyncV1 = true;
        return true;
    }

    if (apply()) return;
    var tries = 0;
    var id = setInterval(function () {
        tries += 1;
        if (apply() || tries > 240) clearInterval(id);
    }, 25);
})();

/* character_scene_sync_inline — CF was SPA-falling back the standalone overlays file */
(function () {
  function patch(day, id, fields) {
    if (typeof SCENARIO === 'undefined' || !SCENARIO[day] || !SCENARIO[day][id]) return;
    Object.assign(SCENARIO[day][id], fields);
  }
  function run() {
    patch(1, 'day1_lunch_riin_1', { character: 'riin_gentle' });
    patch(1, 'day1_lunch_riin_2', { character: 'riin_gentle' });
    patch(1, 'day1_after_riin_1', { character: 'riin_gentle' });
    patch(1, 'day1_after_riin_12', { character: null, background: 'hallway' });
    patch(1, 'day1_after_yuna_1', { character: 'yuna_shy' });
    patch(3, 'day3_lunch_sea_3', { character: 'sea_smile' });
    patch(4, 'day4_after_sea_route', { character: 'sea_smile' });
  }
  run();
  var n = 0;
  var t = setInterval(function () {
    run();
    if (++n > 80) clearInterval(t);
  }, 50);
})();

/* peel duration bump (inline — CF SPA-falls back some new module filenames) */
(function () {
  function bump() {
    if (typeof SCENARIO === 'undefined' || !SCENARIO[3]) return;
    var s = SCENARIO[3]['day3_night_stat_crack_4'];
    if (s && s.glitch && s.glitch.peelStatLabel) {
      s.glitch.revealDuration = 1600;
    }
  }
  bump();
  var n = 0, t = setInterval(function () { bump(); if (++n > 80) clearInterval(t); }, 50);
})();
