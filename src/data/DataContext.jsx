import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DataCtx = createContext(null);

const LS_KEY = "todoapp3_store_v1";

const DEFAULT_LISTS = [
  { id: "today",    name: "Today",    emoji: "📅" },
  { id: "planned",  name: "Planned",  emoji: "🗓️" },
  { id: "personal", name: "Personal", emoji: "🧑‍🦰" },
  { id: "work",     name: "Work",     emoji: "💼" },
  { id: "shopping", name: "Shopping", emoji: "🛒" },
];

const DEFAULT_TASKS = {
  today:    [{ id: "t1", title: "Welcome 👋", done: false, color: "#4CC3FF", emoji: "⭐" }],
  planned:  [],
  personal: [],
  work:     [],
  shopping: [],
};

function loadStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { lists: DEFAULT_LISTS, tasks: DEFAULT_TASKS };
    const parsed = JSON.parse(raw);
    if (!parsed.lists || !Array.isArray(parsed.lists)) parsed.lists = DEFAULT_LISTS;
    if (!parsed.tasks || typeof parsed.tasks !== "object") parsed.tasks = DEFAULT_TASKS;
    return parsed;
  } catch {
    return { lists: DEFAULT_LISTS, tasks: DEFAULT_TASKS };
  }
}

function saveStore(store) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch {}
}

function slugify(name) {
  const s = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  return s || `list-${Math.random().toString(36).slice(2, 8)}`;
}

export function DataProvider({ children }) {
  const [lists, setLists] = useState(DEFAULT_LISTS);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);

  useEffect(() => {
    const { lists, tasks } = loadStore();
    setLists(lists);
    setTasks(tasks);
  }, []);

  useEffect(() => {
    saveStore({ lists, tasks });
  }, [lists, tasks]);

  const ensureBucket = (listId) => {
    setTasks((prev) => (prev[listId] ? prev : { ...prev, [listId]: [] }));
  };

  const addList = (name, emoji = "📝") => {
    const baseId = slugify(name);
    let id = baseId;
    let i = 2;
    const existing = new Set(lists.map((l) => l.id));
    while (existing.has(id)) id = `${baseId}-${i++}`;
    const newList = { id, name, emoji };
    setLists((prev) => [...prev, newList]);
    setTasks((prev) => ({ ...prev, [id]: [] }));
    return newList;
  };

  const DEFAULT_IDS = new Set(DEFAULT_LISTS.map((l) => l.id));

  const removeList = (id) => {
    if (DEFAULT_IDS.has(id)) return; // keep defaults undeletable
    setLists((prev) => prev.filter((l) => l.id !== id));
    setTasks((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  /** Update list properties (e.g., name, emoji). ID stays the same. */
  const updateList = (id, patch) => {
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const getTasks = (listId) => tasks[listId] || [];

  const addTask = (listId, { title, color = null, emoji = "" }) => {
    ensureBucket(listId);
    const id = Math.random().toString(36).slice(2, 10);
    const t = { id, title, done: false, color, emoji };
    setTasks((prev) => ({ ...prev, [listId]: [...(prev[listId] || []), t] }));
    return t;
  };

  const toggleTask = (listId, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [listId]: (prev[listId] || []).map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
    }));
  };

  const deleteTask = (listId, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [listId]: (prev[listId] || []).filter((t) => t.id !== taskId),
    }));
  };

  const setTaskColor = (listId, taskId, color) => {
    setTasks((prev) => ({
      ...prev,
      [listId]: (prev[listId] || []).map((t) => (t.id === taskId ? { ...t, color } : t)),
    }));
  };

  const value = useMemo(
    () => ({
      lists,
      tasks,
      addList,
      removeList,
      updateList,   // exposed
      getTasks,
      addTask,
      toggleTask,
      deleteTask,
      setTaskColor,
    }),
    [lists, tasks]
  );

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export const useData = () => useContext(DataCtx);
