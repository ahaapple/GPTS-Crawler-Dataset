import fetch from 'node-fetch';
import * as fs from 'fs';

interface Comment {
    id: number;
    body: string;
}

// for https://github.com/airyland/gptshunter.com/issues/1
async function fetchAllComments(url: string, token: string, allComments: Comment[] = []) {
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
    };

    const response = await fetch(url, { headers: headers });
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const comments: Comment[] = await response.json() as Comment[];
    allComments = allComments.concat(comments);

    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
        const matches = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        if (matches && matches[1]) {
            return fetchAllComments(matches[1], token, allComments);
        }
    }

    return allComments;
}

async function fetchIssueComments(owner: string, repo: string, issueNumber: number, token: string): Promise<Comment[] | null> {
    const initialUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100`;
    try {
        return await fetchAllComments(initialUrl, token);
    } catch (error) {
        console.error(error);
        return null;
    }
}

function extractUrls(comments: Comment[]): string[] {
    const urlRegex = /https:\/\/chat.openai.com\/g\/g-[a-zA-Z0-9]+/g;
    let urls: string[] = [];

    comments.forEach(comment => {
        const foundUrls = comment.body.match(urlRegex);
        if (foundUrls) {
            urls = urls.concat(foundUrls);
        }
    });

    console.log("urls", urls);

    return urls;
}

async function writeUrlsToFile(urls: string[], filePath: string): Promise<void> {
    const openaiUrls = urls
        .filter(url => /^https:\/\/chat\.openai\.com\/g\/g-/.test(url))
        .map(url => {
            const match = url.match(/g-([a-zA-Z0-9]{9})/);
            return match ? match[1] : null;
        })
        .filter(id => id !== null);
    for (const url of openaiUrls) {
        fs.appendFileSync(filePath, '\n' + url, 'utf-8');
    }
}

const owner = 'airyland';
const repo = 'gptshunter.com';
const issueNumber = 1;
// you could get your token refer to  https://docs.github.com/en/enterprise-server@3.6/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const token = 'your github token';

fetchIssueComments(owner, repo, issueNumber, token)
    .then(comments => {
        if (comments) {
            const urls = extractUrls(comments);
            return writeUrlsToFile(urls, 'gpts-url-list');
        }
    })
    .catch(error => console.error(error));
