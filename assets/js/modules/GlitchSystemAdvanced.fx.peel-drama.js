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

        proto.peelStatLabel = async function peelStatLabelDrama(revealDuration = 1600) {
            const statEl = document.getElementById('stat-display');
            if (!statEl) return;

            const gameScreen = document.getElementById('game-screen');
            // Force cinematic beat length even if scenario still passes 300
            const duration = Math.max(1400, Math.min(2200, Number(revealDuration) || 1600));

            statEl.classList.remove('hidden', 'stat-hidden');
            if (!statEl.textContent.trim()) {
                const last = this.engine?.state?._lastCharLabel;
                const aff = this.engine?.state ? this.engine.state.getDisplayAffinity?.('sea') : 0;
                const romance = this._localizedRomanceLabel?.() || '호감도';
                statEl.textContent = last?.text || `♡ ${romance} ${aff ?? ''}`.trim();
            }

            const original = (statEl.textContent || '').trim();
            const danger = this._localizedDangerLabel?.() || '위험도';
            const revealed = statEl.dataset.thrillerlabel
                || `⚠ ${danger} ${original.match(/\d+/)?.[0] || ''}`.trim();

            // 1) Screen shake (existing hooks) + heavy VFX + noise burst + darken
            if (gameScreen) {
                gameScreen.classList.add(
                    'screen-shake',
                    'screen-shake-mobile',
                    'vfx-shake-heavy',
                    'stat-genre-flip',
                    'stat-genre-noise-burst'
                );
                this.overlay?.classList?.add('noise', 'rgb-split', 'scanlines');
            }

            try {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate([40, 30, 60, 30, 80]);
                }
            } catch (_) { /* optional */ }

            try {
                this.engine?.audio?.playSFX?.('sfx_static.mp3', { volume: 0.72 });
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
                this.overlay?.classList?.remove('noise', 'rgb-split', 'scanlines');
                await sleep(220);
                gameScreen.classList.remove('stat-genre-flip');
                gameScreen.classList.add('stat-genre-settled');
            }

            statEl.textContent = revealed;
            statEl.classList.remove('stat-peeling');
            statEl.classList.add('stat-revealed');
            if (this.engine?.state) {
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
