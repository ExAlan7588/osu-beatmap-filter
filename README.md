# OSU! 圖譜篩選生成器

這是一個幫助 OSU! 玩家快速生成圖譜篩選條件的工具。

## 功能特點

- 支持多種遊戲模式（OSU!、太鼓、接水果、鋼琴）
- 可調整星級、AR、CS、HP、OD等參數
- 支持保存常用篩選組合
- 支持深色/淺色主題切換
- 支持中文/英文界面切換
- 整合Google Analytics訪客統計

## 技術棧

- 前端：純JavaScript + HTML + CSS
- 後端：Vercel Serverless Functions
- 分析：Google Analytics 4

## 本地開發

1. 安裝依賴：
```bash
npm install
```

2. 運行開發服務器：
```bash
npm run dev
```

## 環境變量

需要設置以下環境變量：

- `GA4_PROPERTY_ID`: Google Analytics 4 的屬性ID
- `GA4_CLIENT_EMAIL`: GA4 服務帳戶的電子郵件
- `GA4_PRIVATE_KEY`: GA4 服務帳戶的私鑰

## 部署

本項目使用 Vercel 進行部署。只需將代碼推送到 GitHub，然後在 Vercel 中導入項目即可。

## 授權

© 2025-2025 ExAlan7588. All Rights Reserved. 