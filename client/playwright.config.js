/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    testDir: './tests', 
    timeout: 30000, 
    retries: 2, 
    webServer: {
        command: 'npm run start', 
        url: 'http://localhost:3000', 
        timeout: 120 * 1000, 
    },
    use: {
        baseURL: 'http://localhost:3000', 
        headless: true, 
        viewport: { width: 1280, height: 720 }, 
        screenshot: 'only-on-failure', 
        video: 'retain-on-failure', 
    },
    projects: [
        {
            name: 'chromium', 
            use: { browserName: 'chromium' },
        },
    ],
};

module.exports = config;