import { Browser, Page } from 'playwright';

export class PagePool {
    private browser: Browser;
    private pool: Page[];
    private poolSize: number;

    constructor(browser: Browser, poolSize: number = 5) {
        this.browser = browser;
        this.pool = [];
        this.poolSize = poolSize;
    }

    async init() {
        for (let i = 0; i < this.poolSize; i++) {
            const page = await this.browser.newPage();
            this.pool.push(page);
        }
    }

    async getPage(): Promise<Page> {
        if (this.pool.length > 0) {
            return Promise.resolve(this.pool.pop()!);
        } else {
            return this.browser.newPage();
        }
    }

    async releasePage(page: Page) {
        if (this.pool.length < this.poolSize) {
            this.pool.push(page);
        } else {
            await page.close();
        }
    }
}