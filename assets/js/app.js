/**
 * ============================================================================
 * app.js - Nevergrad: 졸업하지 못한 교실 - 앱 진입점
 * ============================================================================
 *
 * [로드 순서]
 * 1. config.js          — 전역 설정 (CONFIG, INITIAL_STATS)
 * 2. modules/*.js       — 엔진 모듈 (StateManager, SaveManager, I18nManager 등)
 * 3. scenario/day*_*.js — 시나리오 데이터 (SCENARIO[1]~[5])
 * 4. app.js (이 파일)    — 초기화
 *
 * HTML에서 <script> 순서로 로드되거나, 빌드 도구로 번들링
 */

/**
 * 모바일 풀스크린 유틸리티
 * - Fullscreen API 지원 시 풀스크린 진입
 * - iOS Safari는 Fullscreen API 미지원이므로 standalone 모드(PWA)로 대체
 */
function requestMobileFullscreen() {
    const elem = document.documentElement;

    // Fullscreen API (Chrome, Firefox, Edge, Samsung Internet 등)
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
        // Safari desktop / older WebKit
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        // IE11 / Edge Legacy
        elem.msRequestFullscreen();
    }
    // iOS Safari: Fullscreen API 미지원 — PWA standalone + viewport meta로 대응
}

document.addEventListener('DOMContentLoaded', async () => {
    // 타이틀 배경 이미지 로드 체크 — 이미지 없으면 CSS 그라디언트 폴백
    const titleBgLayer = document.querySelector('.title-bg-layer');
    if (titleBgLayer) {
        const img = new Image();
        img.src = new URL('assets/images/background/title_bg.png', document.baseURI).href;
        img.onerror = () => titleBgLayer.classList.add('no-image');
    }

    const game = new GameEngine();

    // 크로스오버 감지 시스템 초기화 (Cupid 플레이 기록 감지)
    game.crossover = new CrossoverSystem(game);
    game.crossover.detect();

    // 디바이스 기믹 시스템 초기화
    game.deviceGimmick = new DeviceGimmickSystem(game);
    await game.deviceGimmick.init();

    // 메타 공포 시스템 초기화
    game.metaHorror = new MetaHorrorSystem(game);

    // 엔진 초기화 (i18n 로드, UI 바인딩)
    await game.init();

    // 전역 접근 (디버그용)
    window.__game = game;
});
