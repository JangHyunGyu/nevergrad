const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
    testDir: './tests/e2e',
    timeout: 60000,
    fullyParallel: false,
    workers: 1,
    reporter: 'line',
    use: {
        baseURL: 'http://127.0.0.1:4178',
        browserName: 'chromium',
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
            ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
            : {},
        viewport: { width: 1280, height: 800 },
        trace: 'retain-on-failure'
    },
    webServer: {
        command: 'node scripts/static-server.cjs',
        url: 'http://127.0.0.1:4178/',
        reuseExistingServer: true,
        timeout: 30000
    }
});
