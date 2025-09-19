// src/data/storage.js
const KEY = "todoapp3_store_v2";
const VERSION = 2;
// migrate from older keys if present
const OLD_KEYS = ["todoapp3_store_v1", "todo-app-data-v1"];

const safeParse = (t) => {
  try { return JSON.parse(t); } catch { return null; }
};

export function read() {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const data = safeParse(raw);
    if (data?.version === VERSION) return data;
  }
  // migration: use first valid older key
  for (const k of OLD_KEYS) {
    const r = localStorage.getItem(k);
    const d = r && safeParse(r);
    if (d && d.lists && d.tasks) {
      return { version: VERSION, lists: d.lists, tasks: d.tasks };
    }
  }
  return null;
}

let debounceTimer = null;
const listeners = new Set();

/** Debounced save to reduce writes */
export function save(state) {
  const payload = JSON.stringify({ version: VERSION, ...state });
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    localStorage.setItem(KEY, payload);
    listeners.forEach((fn) => fn("save"));
  }, 300);
}

export function clearAll() {
  localStorage.removeItem(KEY);
}

/** Subscribe to local saves or cross-tab storage events */
export function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

window.addEventListener("storage", (e) => {
  if (e.key === KEY) listeners.forEach((fn) => fn("external"));
});

/** Optional helpers for backup/restore */
export function exportAsURL(state) {
  const blob = new Blob(
    [JSON.stringify({ version: VERSION, ...state }, null, 2)],
    { type: "application/json" }
  );
  return URL.createObjectURL(blob);
}

export async function importFromFile(file) {
  const text = await file.text();
  const data = safeParse(text);
  if (!data) throw new Error("Invalid JSON");
  const { lists, tasks } = data;
  if (!Array.isArray(lists) || typeof tasks !== "object")
    throw new Error("Invalid schema");
  localStorage.setItem(KEY, JSON.stringify({ version: VERSION, lists, tasks }));
  return { lists, tasks };
}
