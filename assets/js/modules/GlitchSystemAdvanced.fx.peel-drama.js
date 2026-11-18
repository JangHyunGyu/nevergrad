/**
 * Dramatic Day4+ peelStatLabel V2: heavy shake + static/noise burst + darken.
 * Marker: __nevergradPeelDramaV2
 */
(function () {
    function apply() {
        if (typeof GlitchSystemAdvanced === 'undefined') return false;
        const proto = GlitchSystemAdvanced.prototype;
        if (proto.peelStatLabel && proto.peelStatLabel.__nevergradPeelDramaV2) return true;
        if (typeof proto.peelStatLabel !== 'function') return false;

        proto.peelStatLabel = async function peelStatLabelDrama(revealDuration = 1600) { var __oc0, __oc1, __oc2, __oc3, __oc4, __oc5, __oc6, __oc7, __oc8, __oc9, __oc10, __oc11, __oc12, __oc13, __oc14, __oc15;
            const statEl = document.getElementById('stat-display');
            if (!statEl) return;

            const gameScreen = document.getElementById('game-screen');
            // Force cinematic beat length even if scenario still passes 300
            const duration = Math.max(1400, Math.min(2200, Number(revealDuration) || 1600));

            statEl.classList.remove('hidden', 'stat-hidden');
            if (!statEl.textContent.trim()) {
                const last = (((__oc1 = (__oc0 = this.engine) === null || __oc0 === void 0 ? void 0 : __oc0.state) === null || __oc1 === void 0 ? void 0 : __oc1._lastCharLabel));
                const aff = (((__oc2 = this.engine) === null || __oc2 === void 0 ? void 0 : __oc2.state)) ? (((__oc4 = (__oc3 = this.engine.state).getDisplayAffinity) === null || __oc4 === void 0 ? void 0 : __oc4.call(__oc3, 'sea'))) : 0;
                const romance = (((__oc5 = this._localizedRomanceLabel) === null || __oc5 === void 0 ? void 0 : __oc5.call(this))) || '호감도';
                statEl.textContent = ((last === null || last === void 0 ? void 0 : last.text)) || `♡ ${romance} ${((aff !== null && aff !== void 0 ? aff : ''))}`.trim();
            }

            const original = (statEl.textContent || '').trim();
            const danger = (((__oc6 = this._localizedDangerLabel) === null || __oc6 === void 0 ? void 0 : __oc6.call(this))) || '위험도';
            const revealed = statEl.dataset.thrillerlabel
                || `⚠ ${danger} ${(((__oc7 = original.match(/\d+/)) === null || __oc7 === void 0 ? void 0 : __oc7[0])) || ''}`.trim();

            // 1) Screen shake (existing hooks) + heavy VFX + noise burst + darken
            if (gameScreen) {
                gameScreen.classList.add(
                    'screen-shake',
                    'screen-shake-mobile',
                    'vfx-shake-heavy',
                    'stat-genre-flip',
                    'stat-genre-noise-burst'
                );
                (((__oc9 = (__oc8 = this.overlay) === null || __oc8 === void 0 ? void 0 : __oc8.classList) === null || __oc9 === void 0 ? void 0 : __oc9.add('noise', 'rgb-split', 'scanlines')));
            }

            try {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate([40, 30, 60, 30, 80]);
                }
            } catch (_) { /* optional */ }

            try {
                (((__oc12 = (__oc11 = (__oc10 = this.engine) === null || __oc10 === void 0 ? void 0 : __oc10.audio) === null || __oc11 === void 0 ? void 0 : __oc11.playSFX) === null || __oc12 === void 0 ? void 0 : __oc12.call(__oc11, 'sfx_static.mp3', { volume: 0.72 })));
            } catch (_) { /* optional */ }

            // 2) Label peel with RGB tear / glitch flicker on name-adjacent affinity
            statEl.classList.add('stat-peeling');
            const peelLayer = document.createElement('span');
            peelLayer.className = 'stat-peel-layer';
            peelLayer.textContent = original;

            statEl.textContent = '';
            const base = document.createElement('span');
            base.className = 'stat-peel-base';
            base.textContent = revealed;
            statEl.appendChild(base);
            statEl.appendChild(peelLayer);

            const sleep = (ms) => (this._sleep ? this._sleep(ms) : new Promise((r) => setTimeout(r, ms)));
            await sleep(40);
            peelLayer.classList.add('peeling');

            // Aggressive flicker + freeze-frame flashes
            const flickerUntil = Date.now() + Math.min(900, duration * 0.5);
            while (Date.now() < flickerUntil) {
                const roll = Math.random();
                if (roll > 0.55) base.textContent = revealed;
                else if (roll > 0.25) base.textContent = original;
                else base.textContent = '█▓░ ' + revealed.replace(/[호감위험도♡⚠\d\s]/g, '') + ' ░▓█';
                if (gameScreen && Math.random() > 0.6) {
                    gameScreen.classList.toggle('stat-genre-tear');
                }
                await sleep(45 + Math.floor(Math.random() * 55));
            }
            base.textContent = revealed;
            if (gameScreen) gameScreen.classList.remove('stat-genre-tear');

            await sleep(Math.max(320, duration - 900));
            peelLayer.remove();

            // 3) Settle into permanent dark thriller HUD
            if (gameScreen) {
                gameScreen.classList.remove(
                    'screen-shake',
                    'screen-shake-mobile',
                    'vfx-shake-heavy',
                    'stat-genre-noise-burst',
                    'stat-genre-tear'
                );
                (((__oc14 = (__oc13 = this.overlay) === null || __oc13 === void 0 ? void 0 : __oc13.classList) === null || __oc14 === void 0 ? void 0 : __oc14.remove('noise', 'rgb-split', 'scanlines')));
                await sleep(220);
                gameScreen.classList.remove('stat-genre-flip');
                gameScreen.classList.add('stat-genre-settled');
            }

            statEl.textContent = revealed;
            statEl.classList.remove('stat-peeling');
            statEl.classList.add('stat-revealed');
            if ((((__oc15 = this.engine) === null || __oc15 === void 0 ? void 0 : __oc15.state))) {
                this.engine.state._lastCharLabel = { text: revealed };
            }
        };
        proto.peelStatLabel.__nevergradPeelDramaV2 = true;
        return true;
    }

    if (apply()) return;
    var tries = 0;
    var id = setInterval(function () {
        tries += 1;
        if (apply() || tries > 240) clearInterval(id);
    }, 25);
})();
