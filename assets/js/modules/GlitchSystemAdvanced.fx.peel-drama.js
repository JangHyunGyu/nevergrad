/**
 * Dramatic Day4+ peelStatLabel: screen shake + noise + darken on name-adjacent affinity.
 * Marker: __nevergradPeelDramaV1
 */
(function () {
    function apply() {
        if (typeof GlitchSystemAdvanced === 'undefined') return false;
        const proto = GlitchSystemAdvanced.prototype;
        if (proto.peelStatLabel && proto.peelStatLabel.__nevergradPeelDramaV1) return true;
        if (typeof proto.peelStatLabel !== 'function') return false;

        proto.peelStatLabel = async function peelStatLabelDrama(revealDuration = 1400) {
            const statEl = document.getElementById('stat-display');
            if (!statEl) return;

            const gameScreen = document.getElementById('game-screen');
            const duration = Math.max(900, Number(revealDuration) || 1400);

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

            if (gameScreen) {
                gameScreen.classList.add('screen-shake', 'stat-genre-flip');
                this.overlay?.classList?.add('noise');
            }

            try {
                this.engine?.audio?.playSFX?.('sfx_static.mp3', { volume: 0.6 });
            } catch (_) { /* optional */ }

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
            await sleep(60);
            peelLayer.classList.add('peeling');

            const flickerUntil = Date.now() + Math.min(700, duration * 0.45);
            while (Date.now() < flickerUntil) {
                base.textContent = Math.random() > 0.45 ? revealed : original;
                await sleep(70 + Math.floor(Math.random() * 50));
            }
            base.textContent = revealed;

            await sleep(Math.max(280, duration - 700));
            peelLayer.remove();

            if (gameScreen) {
                gameScreen.classList.remove('screen-shake');
                this.overlay?.classList?.remove('noise');
                await sleep(280);
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
        proto.peelStatLabel.__nevergradPeelDramaV1 = true;
        return true;
    }

    if (apply()) return;
    var tries = 0;
    var id = setInterval(function () {
        tries += 1;
        if (apply() || tries > 240) clearInterval(id);
    }, 25);
})();
