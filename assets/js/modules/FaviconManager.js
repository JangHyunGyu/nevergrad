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
            href = 'favicon.svg';
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

    /**
     * 변이별 SVG 문자열 생성 — 동일한 방패 실루엣 위에
     * 색/크랙/숫자를 덧그려 "같은 아이콘인데 뭔가 다름" 연출.
     * @private
     */
    _buildSVG(variant) {
        // 기본 방패 도형 (모든 변이 공통 베이스)
        // base = {bg, shieldFill, shieldStroke}
        const palette = {
            cracked:  { bg1: '#1a1520', bg2: '#2d1f3a', shield: '#8fc99a', stroke: '#5a8765', overlay: null },
            red:      { bg1: '#1a0808', bg2: '#3a0f14', shield: '#8a2a2a', stroke: '#4a1010', overlay: null },
            thirteen: { bg1: '#0f0f12', bg2: '#1a1a20', shield: '#2a2a33', stroke: '#4a4a55', overlay: '13' }
        }[variant];
        if (!palette) return '';

        const crackPath = variant === 'cracked'
            ? `<path d="M256 160 L248 220 L262 250 L244 300 L258 340 L250 380"
                     stroke="#1a1520" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.85"/>
               <path d="M248 220 L220 240" stroke="#1a1520" stroke-width="4" fill="none" opacity="0.7"/>
               <path d="M262 250 L290 270" stroke="#1a1520" stroke-width="4" fill="none" opacity="0.7"/>`
            : '';

        const numberOverlay = palette.overlay === '13'
            ? `<text x="256" y="310" text-anchor="middle"
                     font-family="Georgia, serif" font-size="180" font-weight="bold"
                     fill="#c53030" opacity="0.95"
                     style="letter-spacing:-8px">13</text>`
            : '';

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}"/>
      <stop offset="100%" stop-color="${palette.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <!-- shield silhouette -->
  <path d="M256 90 L396 140 L396 280 Q396 390 256 430 Q116 390 116 280 L116 140 Z"
        fill="${palette.shield}" stroke="${palette.stroke}" stroke-width="10" opacity="0.95"/>
  ${crackPath}
  ${numberOverlay}
</svg>`;
    }
}

// 전역 노출 — app.js에서 new FaviconManager() 직접 사용 가능
if (typeof window !== 'undefined') {
    window.FaviconManager = FaviconManager;
}
