import { chromium } from "playwright";
import * as fs from 'fs';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const processedIds = new Set<string>();
    if (fs.existsSync('gizmos.jsonl')) {
        const gizmosData = fs.readFileSync('gizmos.jsonl', 'utf8');
        gizmosData.split(/\r?\n/).forEach(line => {
            if (line) {
                const gizmo = JSON.parse(line);
                if (gizmo && gizmo.id) {
                    processedIds.add(gizmo.id.slice(2));
                }
            }
        });
    }

    console.log('processed number', processedIds.size);

    const data = fs.readFileSync("gpts-url-list");
    const lines = data.toString().split(/\r?\n/);

    console.log('Processing', lines.length, 'URLs');

    const outputStream = fs.createWriteStream('gizmos.jsonl', { flags: 'a' });


    for (const url of lines) {
        if (processedIds.has(url)) {
            console.log('Skipping already processed URL:', url);
            continue;
        }

        let attempts = 2;
        while (attempts > 0) {
            // In order to process real-person detection
            const browser = await chromium.launch(
                { headless: false, slowMo: 50 }
            );
            console.log('Processing URL :', url);
            try {
                const page = await browser.newPage();
                await page.goto(`https://chat.openai.com/g/g-${url}`);
                await page.waitForLoadState('networkidle');

                const propsString = await page.evaluate(() => {
                    try {
                        const script = document.querySelector('#__NEXT_DATA__');
                        return script ? script.innerHTML : null;
                    } catch (e) {
                        console.error('Error:', e);
                        return null;
                    }
                });

                if (propsString) {
                    const props = JSON.parse(propsString);
                    const gizmo = props['props']['pageProps']['gizmo']['gizmo'];
                    outputStream.write('\n' + JSON.stringify(gizmo));
                    console.log('Successfully Processed URL :', url);
                }

                break;
            } catch (e) {
                console.error('Error processing URL:', url, e);
                attempts--;
                if (attempts > 0) {
                    console.log(`Retrying... Attempts left: ${attempts}`);
                } else {
                    console.log('All retry attempts failed,', url);
                }

            } finally {
                await browser.close();
                await sleep(2000);
            }
        }
    }
    outputStream.close();
})();
