import { chromium, Page} from 'playwright';

import fs from 'fs';
import readline from 'readline';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.0.0 Safari/537.36'
];

async function scrollToBottom(page: Page) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, (Math.floor(Math.random() * 5) + 1) * 100);
        });
    });
}

async function readKeywords(): Promise<string[]> {
    const fileStream = fs.createReadStream('keyword-list', 'utf8');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const keywords: string[] = [];
    for await (const line of rl) {
        keywords.push(line);
    }

    return keywords;
}

const js1 = `() => {
    Object.defineProperties(navigator,{
        webdriver:{
            get: () => false
        }
    });
}`;


const webglOverrideScript = `() => {
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) {
            return 'Intel Open Source Technology Center';
        }
        if (parameter === 37446) {
            return 'Mesa DRI Intel(R) Ivybridge Mobile ';
        }
        return getParameter(parameter);
    };
}`;


const canvasOverrideScript = `() => {
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function() {
        return toDataURL.call(this).replace(/^data:image\/png;base64,/, '');
    };

    const getImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function(x, y, width, height) {
        const result = getImageData.call(this, x, y, width, height);
        for (let i = 0; i < result.data.length; i += 4) {
            result.data[i] = result.data[i] ^ 1;
        }
        return result;
    };
}`;

const pluginOverrideScript = `() => {
    const fakePlugins = [
        { name: 'PDF Viewer', filename: 'pdf_viewer_plugin', description: 'Portable Document Format' },
    ];

    window.navigator.__proto__.__defineGetter__('plugins', () => {
        return fakePlugins;
    });
}`;

const webrtcOverrideScript = `() => {
    const oldCreateObjectURL = URL.createObjectURL;
    const oldGetUserMedia = navigator.mediaDevices.getUserMedia;

    URL.createObjectURL = function(stream) {
        return oldCreateObjectURL.apply(URL, arguments);
    };

    navigator.mediaDevices.getUserMedia = function(constraints) {
        return oldGetUserMedia.apply(navigator.mediaDevices, arguments);
    };
}`;

async function applyEvasions(page) {
    await page.addInitScript(webglOverrideScript);
    await page.addInitScript(canvasOverrideScript);
    await page.addInitScript(pluginOverrideScript);
    await page.addInitScript(webrtcOverrideScript);
}

async function run() {
    const keywords = await readKeywords();

    for (const keyword of keywords) {
        sleep(5000);
        const browser = await chromium.launch(
            { headless: false,
                slowMo: 50,
                args: [
                    `--window-size=${Math.floor(Math.random() * 600) + 800},${Math.floor(Math.random() * 400) + 600}`, // 随机窗口大小
                    `--lang=${["en-US", "de-DE", "fr-FR", "es-ES"][Math.floor(Math.random() * 4)]}`, // 随机语言
                    `--timezone=${["America/New_York", "Europe/Berlin", "Asia/Tokyo", "Australia/Sydney"][Math.floor(Math.random() * 4)]}` // 随机时区
                ]
            }
        );
        try {
            const context = await browser.newContext({
                userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
            });

            const page = await context.newPage();
            const searchUrl = `https://www.google.com/search?q=site%3Achat.openai.com+${encodeURIComponent(keyword)}`;

            await page.evaluate(js1);
            await applyEvasions(page);

            await page.goto(searchUrl);
            await page.waitForLoadState('networkidle');
            await scrollToBottom(page);
            const links = await page.$$eval('a[href^="http"]', anchors => anchors.map(anchor => anchor.href));
            const openaiUrls = links
                .filter(url => /^https:\/\/chat\.openai\.com\/g\/g-/.test(url))
                .map(url => {
                    const match = url.match(/g-([a-zA-Z0-9]{9})/);
                    return match ? match[1] : null;
                })
                .filter(id => id !== null);

            const filePath = 'gpts-url-list';
            for (const url of openaiUrls) {
                fs.appendFileSync(filePath, '\n' + url, 'utf-8');
            }
            console.log(`${openaiUrls} appended to ${filePath}`);

            const seconds = Math.floor(Math.random() * 5) + 1;
            sleep(seconds * 1000);
        } finally {
            await browser.close();
        }
    }
}
run();
