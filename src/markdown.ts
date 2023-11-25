import { promises as fs } from 'fs';
import path from 'path';

type ExtractUrlsFunction = (dir: string) => Promise<void>;

const extractUrls: ExtractUrlsFunction = async (dir) => {
    try {
        const files = await fs.readdir(dir);
        const mdFiles = files.filter(file => file.endsWith('.md'));

        for (const file of mdFiles) {
            const content = await fs.readFile(path.join(dir, file), 'utf8');
            const urls = content.match(/https:\/\/chat\.openai\.com\/g\/g-\w+/g) || [];

            const openaiUrls = urls
                .filter(url => /^https:\/\/chat\.openai\.com\/g\/g-/.test(url))
                .map(url => {
                    const match = url.match(/g-([a-zA-Z0-9]{9})/);
                    return match ? match[1] : null;
                })
                .filter(id => id !== null);

            for (const url of openaiUrls) {
                await fs.appendFile('gpts-url-list', '\n' + url, 'utf-8');
            }

            if (openaiUrls.length > 0) {
                console.log(`${openaiUrls} appended to 'gpts-url-list'`);
            } else {
                console.log(`No URLs found in ${file}.`);
            }
        }
    } catch (err) {
        console.error('Error reading directory:', err);
    }
};

const dir = '/git/xxxx'; // Replace with your directory path
extractUrls(dir);