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

document.addEventListener('DOMContentLoaded', async () => {
    const game = new GameEngine();

    // 디바이스 기믹 시스템 초기화
    game.device = new DeviceGimmickSystem(game);
    await game.device.init();

    // 메타 공포 시스템 초기화
    game.meta = new MetaHorrorSystem(game);

    // 엔진 초기화 (i18n 로드, UI 바인딩)
    await game.init();

    // 전역 접근 (디버그용)
    window.__game = game;
});
