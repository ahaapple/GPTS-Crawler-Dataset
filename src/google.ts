import { chromium, Page} from 'playwright';

import fs from 'fs';
import readline from 'readline';

import { PagePool } from './page_pool.js';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
            }, 300);
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

async function run() {

    // const pool = new PagePool(browser, 1);
    // await pool.init();

    const keywords = await readKeywords();

    for (const keyword of keywords) {
        sleep(5000);
        const browser = await chromium.launch(
            { headless: false, slowMo: 50 }
        );
        try {
            const page = await browser.newPage();
            const searchUrl = `https://www.google.com/search?q=site%3Achat.openai.com+${encodeURIComponent(keyword)}`;
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
            // await pool.releasePage(page);
            const filePath = 'gpts-url-list';
            for (const url of openaiUrls) {
                fs.appendFileSync(filePath, '\n' + url, 'utf-8');
            }
            console.log(`${openaiUrls} appended to ${filePath}`);
            sleep(5000);
        } finally {
            await browser.close();
        }
    }
}

run();
