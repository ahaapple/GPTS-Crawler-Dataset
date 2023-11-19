# GPTS-Crawler-DataSet

1. Obtain detailed metadata for each GPT from various internet channels.
2. Make the collected GPTS dataset public.

https://www.topgpts.club/

## README.md

- en [English](README.md)
- zh_CN [简体中文](README.zh_CN.md)

## Features

- Very high success rate in crawling.
- Supports retrying in case of exceptions.
- Supports resuming from breakpoints.

## GPTS Dataset

`gizmos.jsonl` file

Each line contains complete metadata of a GPT, formatted as follows:

```
{
   "id": "g-09h5uQiFC",
   "organization_id": "org-DBPI2J2yWFv4MX06zS0084p2",
   "short_url": "g-09h5uQiFC-ms-roxana",
   "author": {
      "user_id": "user-D1v1q4QlhTH4hw9dGQZFxH1O",
      "display_name": "robotsbuildingeducation.com",
      "link_to": "https://robotsbuildingeducation.com",
      "selected_display": "website",
      "is_verified": true
   },
   "voice": {
      "id": "ember"
   },
   "workspace_id": null,
   "model": null,
   "instructions": null,
   "settings": null,
   "display": {
      "name": "Ms. Roxana",
      "description": "The AI Mentor",
      "welcome_message": "Hello",
      "prompt_starters": [
         "Hola... let's learn 😁"
      ],
      "profile_picture_url": "https://files.oaiusercontent.com/file-qcwptAh58EBhwh7c9gs3om63?se=2123-10-15T10%3A53%3A35Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3DEBOOK%2520%25282%2529.png&sig=ANxSurYw7dfGjpzlehF1PWJKQB4kp2Uok3DHfAw0Trg%3D",
      "categories": []
   },
   "share_recipient": "marketplace",
   "updated_at": "2023-11-17T02:09:37.466844+00:00",
   "last_interacted_at": null,
   "tags": [
      "public",
      "reportable"
   ],
   "version": null,
   "live_version": null,
   "training_disabled": null,
   "allowed_sharing_recipients": null,
   "review_info": null,
   "appeal_info": null,
   "vanity_metrics": null
}
```

## Crawling Data

1. Ensure Node.js >= 16 is installed.


2. Clone the project:

```
git clone https://github.com/ahaapple/GPTS-Crawler-Dataset
```

3. Install dependencies:

```
npm i

npx playwright install
```

4. Update the `gpts-url-list` file.


5. Crawl GPTS metadata:

```
npm start
```

6. New GPTS metadata crawled will be appended to the `gizmos.jsonl` file.

## Crawling GitHub Issue Comment

First, modify the following configuration in the `issue` file:

```
const owner = 'airyland';
const repo = 'gptshunter.com';
const issueNumber = 1;
// you could get your token refer to  https://docs.github.com/en/enterprise-server@3.6/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const token = 'your github token';
```

Then execute:

```
npm run issue
```

## Deduplicate `gpts-urls` File

```
npm run deduplicate-urls
```

## Deduplicate GPTS Dataset File

```
npm run deduplicate-gpts
```

## Contributions Welcome

We welcome everyone to contribute to the GPTS public dataset. You can contribute in the following ways:

1. Comment your GPTS URL in the issue at https://github.com/ahaapple/GPTS-Crawler-Dataset/issues/1.
2. Directly update the `gpts-url-list` file with your GPTS URL.
3. Directly update the `gizmos.jsonl` file with your crawled metadata.

## Roadmap

- [ ] Support more data sources.
- [ ] Handle cases where the `gizmos.jsonl` file becomes very large.

## Thanks To

1. gpts-works: https://github.com/all-in-aigc/gpts-works
2. gptshunter issue data source: https://github.com/airyland/gptshunter.com/issues/1
3. GPTHub data source: https://github.com/lencx/GPTHub/blob/main/gpthub.json
