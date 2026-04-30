/**
 * ============================================================================
 * FaviconManager.js - 앱 아이콘 동적 변이 (SCENARIO.md 5420-5423)
 * ============================================================================
 *
 * 웹 브라우저 환경에서 가능한 "앱 아이콘 변이" — favicon을 게임 진행에
 * 따라 다르게 노출해, 브라우저 탭/북마크/홈 스크린 아이콘이 조용히 변한다.
 *
 * 우선순위 (높은 것이 이김):
 *   1. COMPLICIT 엔딩 본 적 있음   → 'thirteen' (숫자 13)
 *   2. 아무 엔딩이든 1회차 클리어   → 'red'       (어두운 붉은 방패)
 *   3. 현재 세션이 스릴러 모드     → 'cracked'   (금 간 방패)
 *   4. 그 외                      → 'default'   (기본 파일: favicon.svg)
 *
 * 적용 트리거:
 *   - 앱 부팅 직후 (app.js에서 init 이후)
 *   - 장르 전환 직후 (StateManager.triggerGenreShift → engine이 호출)
 *   - 엔딩 기록 직후 (SaveManager.recordEnding → engine이 호출)
 */

class FaviconManager {
    constructor() {
        this._currentVariant = null;
    }

    /**
     * 현재 상태 기반으로 적절한 변이를 선택해 적용
     * @param {Object} ctx
     * @param {Object} [ctx.saveMeta] - SaveManager.getMeta() 결과
     * @param {Object} [ctx.state]    - StateManager 인스턴스 (mode 참조)
     */
    sync(ctx = {}) {
        const variant = this._pickVariant(ctx);
        if (variant === this._currentVariant) return;
        this.apply(variant);
    }

    _pickVariant({ saveMeta, state }) {
        if (saveMeta?.endingsSeen?.includes('COMPLICIT')) return 'thirteen';
        if ((saveMeta?.playCount || 0) > 0) return 'red';
        // CONFIG는 window scope에 있음 (전역 script 로드)
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

    /**
     * 변이별 SVG 문자열 생성 — 동일한 학교 배지 실루엣 위에
     * 색/크랙/숫자를 덧그려 "같은 아이콘인데 뭔가 다름" 연출.
     * @private
     */
    _buildSVG(variant) {
        const palette = {
            cracked:  { bg1: '#09070d', bg2: '#2d1f3a', crest: '#9ad0a4', stroke: '#5c9f6d', door: '#111719', mark: '#f2fff4', accent: '#ffb7c5', overlay: null },
            red:      { bg1: '#180606', bg2: '#3a0f14', crest: '#ba3b4a', stroke: '#5c1117', door: '#16090c', mark: '#ffe7e7', accent: '#ff5c74', overlay: null },
            thirteen: { bg1: '#0a0a0e', bg2: '#1b1b22', crest: '#6e707c', stroke: '#343640', door: '#111117', mark: '#efedf4', accent: '#c53030', overlay: '13' }
        }[variant];
        if (!palette) return '';

        const crackPath = variant === 'cracked'
            ? `<path d="M258 150L248 208L265 240L244 292L260 326L249 372"
                     stroke="#09070d" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.9"/>
               <path d="M248 208L217 231M265 240L300 263"
                     stroke="#09070d" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.74"/>`
            : '';

        const numberOverlay = palette.overlay === '13'
            ? `<text x="256" y="426" text-anchor="middle"
                     font-family="Georgia, serif" font-size="58" font-weight="bold"
                     fill="${palette.accent}" opacity="0.98">13</text>`
            : '';

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}"/>
      <stop offset="100%" stop-color="${palette.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <path d="M72 168H440M72 256H440M72 344H440M168 72V440M256 72V440M344 72V440"
        stroke="#ffffff" stroke-width="4" opacity="0.055"/>
  <path d="M256 54L390 104V258C390 358 332 421 256 452C180 421 122 358 122 258V104Z"
        fill="#15101b" stroke="${palette.crest}" stroke-width="18" stroke-linejoin="round"/>
  <path d="M159 129H353V341C353 356 341 368 326 368H186C171 368 159 356 159 341Z"
        fill="${palette.door}" stroke="${palette.crest}" stroke-width="10" stroke-linejoin="round" opacity="0.96"/>
  <path d="M181 151H331V199H181ZM181 222H331V270H181Z"
        fill="${palette.crest}" opacity="0.16"/>
  <path d="M206 342V169H239L300 278V169H335V342H302L241 233V342Z"
        fill="${palette.mark}"/>
  <path d="M354 170C372 190 383 218 383 251"
        fill="none" stroke="${palette.accent}" stroke-width="10" stroke-linecap="round" opacity="0.78"/>
  <path d="M372 178L348 177L358 199Z" fill="${palette.accent}" opacity="0.92"/>
  ${crackPath}
  ${numberOverlay}
</svg>`;
    }
}

// 전역 노출 — app.js에서 new FaviconManager() 직접 사용 가능
if (typeof window !== 'undefined') {
    window.FaviconManager = FaviconManager;
}
