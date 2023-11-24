# GPTS-Crawler-DataSet

1. 从互联网各种渠道获取每个 gpts 的详细元数据
2. 将获取到的 gpts 据集公开
3. 支持通过 Google 搜索获取 gpts 的详细元数据
4. 支持通过 Github 获取 gpts 的详细元数据

https://www.topgpts.club/

## README.md

- en [English](README.md)
- zh_CN [简体中文](README.zh_CN.md)

## 特点

- 抓取成功率极高
- 支持异常重试
- 支持断点续传
- 支持 Google 搜索抓取
- 支持 Github 抓取

## GPTS 数据集

gizmos.jsonl 文件

每行是一个完整 GPTs的元数据，格式如下：

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
         "Hola... let's learn  😁"
      ],
      "profile_picture_url":"https://files.oaiusercontent.com/file-qcwptAh58EBhwh7c9gs3om63?se=2123-10-15T10%3A53%3A35Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3DEBOOK%2520%25282%2529.png&sig=ANxSurYw7dfGjpzlehF1PWJKQB4kp2Uok3DHfAw0Trg%3D",
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

## 抓取数据

1. 请确保已安装 Node.js >= 16


2. 克隆项目

```
git clone https://github.com/ahaapple/GPTS-Crawler-Dataset
```

3. 安装依赖

```
npm i

npx playwright install
```

4. 更新 gpts-url-list 文件


5. 抓取 gpts 元数据

```
npm start
```

6. 抓取的新的 gpts 元数据 会追加到 gizmos.jsonl 文件中

## 从 google 获取 gpts urls

更新 keyword-list 文件

然后执行

```
npm run google
```

## 从 github 获取 gpts urls

```
npm run github
```


## gpts-urls 文件去重

```
npm run deduplicate-urls
```

## gpts dataset 文件去重

```
npm run deduplicate-gpts
```

## 欢迎贡献

欢迎大家一起共建 GPTS 公开数据集，大家可以选择以下方式共建：

1. https://github.com/ahaapple/GPTS-Crawler-Dataset/issues/1  在 issue 中 comment 你的 gpts url
2. 直接更新 gpts-url-list 文件增加你的 gpts url
3. 直接更新 gizmos.jsonl 文件增加你抓取后的元数据
4. 直接更新 keywork-list 文件增加 google 搜索关键词

## Roadmap

- [ ] 支持更多数据源
- [ ] 处理 gizmos.jsonl 文件很大的情况


## Thanks To

1. gpts-works: https://github.com/all-in-aigc/gpts-works
2. gptshunter issue 数据源: https://github.com/airyland/gptshunter.com/issues/1
3. GPTHub 数据源: https://github.com/lencx/GPTHub/blob/main/gpthub.json
