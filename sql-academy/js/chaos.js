/**
 * 混亂製造機 —— 標記／重載髒數據關卡
 */
import { loadThemeDatabase } from './db.js';

export async function ensureChaosMode(theme, lesson) {
  const dirty = !!(lesson && lesson.chaos);
  await loadThemeDatabase(theme, { dirty });
  return {
    dirty,
    message: dirty
      ? '混亂製造機已啟動：NULL、重複、日期格式、異常值已注入。用魯棒查詢對付佢哋。'
      : '資料庫為乾淨訓練集。'
  };
}

export function chaosBriefingExtra(dirty) {
  if (!dirty) return '';
  return '\n\n⚠️ 本關數據不乾淨。先偵察，再聚合——唔好假設每一列都合理。';
}
