/**
 * FX soft-lock fix: ease mirror wipe defaults + keep wipe progress across resize.
 */
(function () {
    if (typeof GlitchSystemAdvanced === 'undefined') return;
    const proto = GlitchSystemAdvanced.prototype;
    const original = proto.showMirrorSwipe;
    if (typeof original !== 'function' || original.__nevergradFxPatched) return;

    proto.showMirrorSwipe = async function (mirrorBgUrl, onComplete, options = {}) {
        const lang = document.documentElement.lang || 'ko';
        const hints = {
            ko: 'Swipe down to wipe',
            en: 'Swipe down to wipe the fog (finger or mouse)',
            ja: 'Swipe down',
            es: 'Swipe down',
            fr: 'Swipe down',
            de: 'Swipe down',
            pt: 'Swipe down'
        };
        hints.ko = '\u2191 wipe (finger/mouse)';
        const eased = Object.assign({}, options, {
            threshold: options.threshold != null ? options.threshold : 0.26,
            verticalSpan: options.verticalSpan != null ? options.verticalSpan : 0.48
        });

        const realAdd = window.addEventListener.bind(window);
        const realRemove = window.removeEventListener.bind(window);
        window.addEventListener = function (type, listener, opts) {
            if (type === 'resize' && document.querySelector('.mirror-swipe-container')) {
                return;
            }
            return realAdd(type, listener, opts);
        };
        window.removeEventListener = function (type, listener, opts) {
            return realRemove(type, listener, opts);
        };

        const wrappedComplete = function () {
            window.addEventListener = realAdd;
            window.removeEventListener = realRemove;
            if (onComplete) onComplete();
        };

        try {
            const p = original.call(this, mirrorBgUrl, wrappedComplete, eased);
            requestAnimationFrame(function () {
                const hint = document.querySelector('.mirror-swipe-hint');
                if (hint) hint.textContent = hints[lang] || hints.en;
            });
            return await p;
        } catch (err) {
            window.addEventListener = realAdd;
            window.removeEventListener = realRemove;
            throw err;
        }
    };
    proto.showMirrorSwipe.__nevergradFxPatched = true;
})();
