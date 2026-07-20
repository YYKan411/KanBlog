# SQL 速查卡（解碼室）

日常分析用得着嘅最小集合。配合 Lab 關卡用。

## 查詢骨架

```sql
SELECT     -- 欄 / 聚合 / 視窗
FROM       -- 主表
JOIN       -- 關係
WHERE      -- 過濾列
GROUP BY   -- 分組
HAVING     -- 過濾組
ORDER BY   -- 排序
LIMIT      -- 只要前 N
```

## JOIN 選擇

| 想要 | 用 |
|------|-----|
| 只要對得上兩邊 | `INNER JOIN` |
| 左邊全部保留 | `LEFT JOIN` |
| 兩邊全部（少用） | `FULL OUTER JOIN`（SQLite 要用 UNION 模擬） |

## NULL

```sql
WHERE x IS NULL
WHERE x IS NOT NULL
-- 錯：WHERE x = NULL
COALESCE(x, 0)   -- 空就當 0
```

## 聚合

```sql
COUNT(*)
COUNT(col)       -- 忽略 NULL
SUM(col) / AVG(col) / MIN(col) / MAX(col)
```

## Window

```sql
RANK() OVER (PARTITION BY grp ORDER BY metric DESC)
SUM(val) OVER (ORDER BY dt ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
```

## 資料品質偵察

```sql
-- 重複
SELECT key, COUNT(*) cnt FROM t GROUP BY key HAVING COUNT(*) > 1;

-- 怪日期（非 ISO）
SELECT * FROM t WHERE dt NOT LIKE '____-__-__';

-- 異常值
SELECT * FROM t WHERE amount < 0 OR amount IS NULL;
```

## 效能

```sql
EXPLAIN QUERY PLAN
SELECT ...;

CREATE INDEX idx_name ON table(column);
```

紅旗：`SELECT *`、隱式 `FROM a, b`、大表無 WHERE 嘅 JOIN、高基數欄亂建索引。
