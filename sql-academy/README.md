# 解碼室 Decode Lab

由零到高階嘅 SQL 自學工具，專為 data analyst 而設。  
唔係 LeetCode 式 Pass/Fail——有興趣主題資料庫、蘇格拉底式導師、髒數據實戰，同真實 SQLite 執行。

## 點樣開始

1. 用任何靜態伺服器開 `sql-academy/`（或直接開 `index.html`）
2. 揀興趣主題（英超／動漫／股票）
3. 由 Stage 0 開始寫 SQL

本地預覽：

```bash
cd sql-academy
python3 -m http.server 8765
# 開 http://localhost:8765
```

## 四大階段

| 階段 | 重點 | 工具能力 |
|------|------|----------|
| 0→1 新手 | SELECT / WHERE / GROUP BY | 興趣主題虛擬 DB |
| 1→10 中階 | JOIN / Window Functions | 蘇格拉底式引導（唔直接俾答案） |
| 10→50 實戰 | Data Cleaning / 業務邏輯 | 髒數據混亂製造機 |
| 50→100 高階 | Index / EXPLAIN / 效能 | 執行計畫評判官 |

## 護城河設計

1. **導師唔會直接吐 SQL**——只指出邏輯漏洞、偽代碼、方向性提示
2. **真實 SQLite（sql.js）**——你寫嘅 SQL 真係跑，唔係假模擬
3. **本地優先**——基本檢查同提示用規則引擎；可選填 API key 用大模型加強引導

## 目錄

```
sql-academy/
├── index.html          入場／揀主題
├── lab.html            學習主介面
├── css/lab.css
├── js/
│   ├── app.js          主流程
│   ├── db.js           SQLite 引擎
│   ├── themes.js       興趣主題 schema + seed
│   ├── curriculum.js   四階段題庫
│   ├── tutor.js        蘇格拉底導師
│   ├── chaos.js        髒數據製造
│   ├── explain.js      效能分析
│   └── progress.js     進度（localStorage）
└── README.md
```

## 給 Data Analyst 嘅目標

學完你要識：

- 自己驗證 engineer 交嚟嘅 query 邏輯正唔正確
- 睇穿髒數據同業務邊界條件
- 讀 EXPLAIN，知道邊啲寫法會喺大數據量下爆
