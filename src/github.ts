import { chromium } from "playwright";
import * as fs from 'fs';
import readline from 'readline';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processUrls(lines: string[]): Promise<void> {
    for (const url of lines) {
        let attempts = 2;
        while (attempts > 0) {
            const browser = await chromium.launch(
                { headless: false, slowMo: 50 }
            );
            console.log('Processing URL :', url);
            try {
                const page = await browser.newPage();
                await page.goto(`${url}`);
                await page.waitForLoadState('domcontentloaded');
                const extractedUrls = await page.$$eval('a[href^="https://chat.openai.com/g/g-"]', anchors => anchors.map(anchor => anchor.href));
                console.log("extractedUrls", extractedUrls);

                const openaiUrls = extractedUrls
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
                console.log(`${openaiUrls.length} URLs appended to ${filePath}`);
                break;
            } catch (e) {
                console.error('Error processing URL:', url, e);
                attempts--;
                if (attempts > 0) {
                    console.log(`Retrying... Attempts left: ${attempts}`);
                } else {
                    console.log('All retry attempts failed for', url);
                }
            } finally {
                await browser.close();
                await sleep(2000);
            }
        }
    }
}

async function deduplicateJsonl(filePath: string): Promise<void> {
    const fileStream = fs.createReadStream(filePath, 'utf8');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const uniqueIds = new Set<string>();

    let lineCount = 0;
    for await (const line of rl) {
        lineCount++;
        try {
            uniqueIds.add(line);
        } catch (e) {
            console.error('Error parsing line:', line, e);
        }
    }

    fileStream.close();
    rl.close();

    const sortedUniqueIds = Array.from(uniqueIds).sort().join('\n');

    console.log('original lines', lineCount, 'unique Lines', uniqueIds.size);

    fs.writeFileSync(filePath, sortedUniqueIds, 'utf8');
    console.log(`Deduplication complete. ${uniqueIds.size} items saved to ${filePath}`);
}

const urlsToProcess = ['https://github.com/xxx'];
const filePath = 'gpts-url-list';

processUrls(urlsToProcess)
    .then(() => deduplicateJsonl(filePath))
    .catch(console.error);
