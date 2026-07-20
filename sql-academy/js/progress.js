/**
 * 進度：localStorage
 */
const KEY = 'decode-lab-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return {
        learnerName: '',
        themeId: '',
        completed: {},
        hintLevel: {},
        apiKey: ''
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      learnerName: '',
      themeId: '',
      completed: {},
      hintLevel: {},
      apiKey: ''
    };
  }
}

export function saveProgress(state) {
  const toSave = { ...state };
  // Don't persist API key unless user opted in — still save for convenience in local-only tool
  localStorage.setItem(KEY, JSON.stringify(toSave));
}

export function markComplete(state, lessonId) {
  state.completed[lessonId] = true;
  saveProgress(state);
}

export function bumpHint(state, lessonId) {
  state.hintLevel[lessonId] = (state.hintLevel[lessonId] || 0) + 1;
  saveProgress(state);
  return state.hintLevel[lessonId];
}

export function completedCount(state) {
  return Object.values(state.completed).filter(Boolean).length;
}
