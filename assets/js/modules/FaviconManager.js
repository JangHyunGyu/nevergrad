/**
 * =========================================================================
 * FaviconManager.js - 앱 아이콘 동적 변이 (SCENARIO.md 5420-5423)
 * =========================================================================
 */

class FaviconManager {
    constructor() {
        this._currentVariant = null;
    }

    sync(ctx = {}) {
        const variant = this._pickVariant(ctx);
        if (variant === this._currentVariant) return;
        this.apply(variant);
    }

    _pickVariant({ saveMeta, state }) {
        if (saveMeta?.endingsSeen?.includes('COMPLICIT')) return 'thirteen';
        if ((saveMeta?.playCount || 0) > 0) return 'red';
        const THRILLER = (typeof CONFIG !== 'undefined' && CONFIG?.STAT_MODES?.THRILLER) || 'thriller';
        if (state?.mode === THRILLER) return 'cracked';
        return 'default';
    }

    apply(variant) {
        const link = this._ensureLink();
        let href;
        if (variant === 'default') {
            href = this._defaultHref();
        } else {
            const svg = this._buildSVG(variant);
            href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        }
        link.href = href;
        this._currentVariant = variant;
    }

    _ensureLink() {
        let link = document.querySelector('link[rel="icon"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/svg+xml';
            document.head.appendChild(link);
        }
        return link;
    }

    _defaultHref() {
        return (typeof window !== 'undefined' && window.__NEVERGRAD_LANG__)
            ? '../favicon.svg'
            : 'favicon.svg';
    }

    _buildSVG(variant) {
        const palette = {
            cracked:  { bg1: '#09070d', bg2: '#2d1f3a', crest: '#9ad0a4', stroke: '#5c9f6d', door: '#111719', mark: '#f2fff4', accent: '#ffb7c5', overlay: null },
            red:      { bg1: '#180606', bg2: '#3a0f14', crest: '#ba3b4a', stroke: '#5c1117', door: '#16090c', mark: '#ffe7e7', accent: '#ff5c74', overlay: null },
            thirteen: { bg1: '#0a0a0e', bg2: '#1b1b22', crest: '#6e707c', stroke: '#343640', door: '#111117', mark: '#efedf4', accent: '#c53030', overlay: '13' }
        }[variant];
        if (!palette) return '';

        const crackPath = variant === 'cracked'
            ? '<path d="M258 150L248 208L265 240L244 292L260 326L249 372" stroke="#09070d" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.9"/>'
              + '<path d="M248 208L217 231M265 240L300 263" stroke="#09070d" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.74"/>'
            : '';

        const numberOverlay = palette.overlay === '13'
            ? '<text x="256" y="426" text-anchor="middle" font-family="Georgia, serif" font-size="58" font-weight="bold" fill="' + palette.accent + '" opacity="0.98">13</text>'
            : '';

        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
          + '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">'
          + '<stop offset="0%" stop-color="' + palette.bg1 + '"/>'
          + '<stop offset="100%" stop-color="' + palette.bg2 + '"/>'
          + '</linearGradient></defs>'
          + '<rect width="512" height="512" rx="96" fill="url(#bg)"/>'
          + '<path d="M72 168H440M72 256H440M72 344H440M168 72V440M256 72V440M344 72V440" stroke="#ffffff" stroke-width="4" opacity="0.055"/>'
          + '<path d="M256 54L390 104V258C390 358 332 421 256 452C180 421 122 358 122 258V104Z" fill="#15101b" stroke="' + palette.crest + '" stroke-width="18" stroke-linejoin="round"/>'
          + '<path d="M159 129H353V341C353 356 341 368 326 368H186C171 368 159 356 159 341Z" fill="' + palette.door + '" stroke="' + palette.crest + '" stroke-width="10" stroke-linejoin="round" opacity="0.96"/>'
          + '<path d="M181 151H331V199H181ZM181 222H331V270H181Z" fill="' + palette.crest + '" opacity="0.16"/>'
          + '<path d="M206 342V169H239L300 278V169H335V342H302L241 233V342Z" fill="' + palette.mark + '"/>'
          + '<path d="M354 170C372 190 383 218 383 251" fill="none" stroke="' + palette.accent + '" stroke-width="10" stroke-linecap="round" opacity="0.78"/>'
          + '<path d="M372 178L348 177L358 199Z" fill="' + palette.accent + '" opacity="0.92"/>'
          + crackPath + numberOverlay + '</svg>';
    }
}

if (typeof window !== 'undefined') {
    window.FaviconManager = FaviconManager;
}

/* === nevergrad audit overlay bootloader === */
(function () {
    function syncEval(url) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
                (0, eval)(xhr.responseText);
            }
        } catch (e) { /* non-fatal */ }
    }
    try {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/css/glitch-fx-fix.css?v=20260924-timed-hook';
        document.head.appendChild(link);
    } catch (e) {}
    var bust = '?v=20260924-char-affinity-peel';
    try {
        ['/assets/css/name-affinity.css' + bust, '/assets/css/stat-genre-flip.css' + bust].forEach(function (href) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        });
    } catch (e) {}
    // Restore SceneRenderer if the main file was stubbed
    if (typeof SceneRenderer === 'undefined') {
        syncEval('https://raw.githubusercontent.com/JangHyunGyu/nevergrad/34336ad3db89828887e37163f2a60c456e30dc7c/assets/js/modules/SceneRenderer.js');
    }
    [
        '/assets/js/scenario/day2_4_night_b.js' + bust,
        '/assets/js/scenario/speakers_overlays.js' + bust,
        '/assets/js/scenario/causality_overlays.js' + bust,
        '/assets/js/scenario/causality_i18n_overlays.js' + bust,
        '/assets/js/modules/GlitchSystemAdvanced.fxfix-mirror.js' + bust,
        '/assets/js/modules/GlitchSystemAdvanced.fxfix-sign.js' + bust,
        '/assets/js/modules/GameEngine.fxfix-choice-clear.js' + bust,
        '/assets/js/modules/ChoiceSystemAdvanced.timed-hook.js' + bust,
        '/assets/js/modules/SceneRenderer.character-sync.js' + bust,
        '/assets/js/modules/GameEngine.fx.character-scene-sync.js' + bust,
        '/assets/js/modules/GlitchSystemAdvanced.fx.peel-drama.js' + bust
    ].forEach(syncEval);
    // Move affinity HUD next to speaker name (Cupid-style)
    try {
        var speaker = document.getElementById('speaker-name');
        var stat = document.getElementById('stat-display');
        if (speaker && stat && !stat.closest('.speaker-row')) {
            var row = document.createElement('div');
            row.className = 'speaker-row';
            speaker.parentNode.insertBefore(row, speaker);
            row.appendChild(speaker);
            row.appendChild(stat);
        }
    } catch (e) {}
})();
