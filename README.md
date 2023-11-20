#GPTS-Crawler-DataSet

1. Obtain detailed metadata of each GPTs from various channels on the Internet
2. Make the obtained GPTS data set public
3. Supports obtaining detailed metadata of GPTs through Google search

https://www.topgpts.club/

## README.md

- en [English](README.md)
- zh_CN [Simplified Chinese](README.zh_CN.md)

## Features

- High crawl success rate
- Support exception retry
- Support breakpoint resume download
- Support Google search crawling

## GPTS data set

gizmos.jsonl file

Each line is the metadata of a complete GPTs, in the following format:

```
{
    "id":"g-09h5uQiFC",
    "organization_id":"org-DBPI2J2yWFv4MX06zS0084p2",
    "short_url":"g-09h5uQiFC-ms-roxana",
    "author":{
       "user_id":"user-D1v1q4QlhTH4hw9dGQZFxH1O",
       "display_name":"robotsbuildingeducation.com",
       "link_to":"https://robotsbuildingeducation.com",
       "selected_display":"website",
       "is_verified":true
    },
    "voice":{
       "id":"ember"
    },
    "workspace_id":null,
    "model":null,
    "instructions":null,
    "settings":null,
    "display":{
       "name":"Ms. Roxana",
       "description":"The AI Mentor",
       "welcome_message":"Hello",
       "prompt_starters":[
          "Hola... let's learn 😁"
       ],
       "profile_picture_url":"https://files.oaiusercontent.com/file-qcwptAh58EBhwh7c9gs3om63?se=2123-10-15T10%3A53%3A35Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rs cd =attachment%3B%20filename%3DEBOOK%2520%25282%2529.png&sig=ANxSurYw7dfGjpzlehF1PWJKQB4kp2Uok3DHfAw0Trg%3D",
       "categories":[
       ]
    },
    "share_recipient":"marketplace",
    "updated_at":"2023-11-17T02:09:37.466844+00:00",
    "last_interacted_at":null,
    "tags":[
       "public",
       "reportable"
    ],
    "version":null,
    "live_version":null,
    "training_disabled":null,
    "allowed_sharing_recipients":null,
    "review_info":null,
    "appeal_info":null,
    "vanity_metrics":null
}
```

## dedicate data

1. Please make sure Node.js >= 16 is installed


2. Clone project

```
git clone https://github.com/ahaapple/GPTS-Crawler-Dataset
```

3. Install dependencies

```
npm i

npx playwright install
```

4. Update gpts-url-list file


5. Grab gpts metadata

```
npm start
```

6. The new gpts metadata captured will be appended to the gizmos.jsonl file

## Get gpts urls from google

Update keyword-list file

and then execute

```
npm run google
```

## gpts-urls file deduplication

```
npm run deduplicate-urls
```

## gpts dataset file deduplication

```
npm run deduplicate-gpts
```

## Contributions welcome

Everyone is welcome to build the GPTS public data set together. You can choose the following methods to build it:

1. https://github.com/ahaapple/GPTS-Crawler-Dataset/issues/1 Comment your gpts url in the issue
2. Directly update the gpts-url-list file to add your gpts url
3. Directly update the gizmos.jsonl file to add your crawled metadata
4. Directly update the keywork-list file to add google search keywords

## Roadmap

- [ ] Support more data sources
- [ ] Handle the situation when the gizmos.jsonl file is very large

## Thanks To

1. gpts-works: https://github.com/all-in-aigc/gpts-works
2. gptshunter issue data source: https://github.com/airyland/gptshunter.com/issues/1
3. GPTHub data source: https://github.com/lencx/GPTHub/blob/main/gpthub.json