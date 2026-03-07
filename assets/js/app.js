/**
 * ============================================================================
 * app.js - 앱 진입점
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
    const game = new GameEngine();
    await game.init();
});
