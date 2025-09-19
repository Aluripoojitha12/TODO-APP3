import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { read, save, subscribe, clearAll, exportAsURL, importFromFile } from "./storage";

const DataCtx = createContext(null);

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

function slugify(name) {
  const s = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  return s || `list-${Math.random().toString(36).slice(2, 8)}`;
}

export function DataProvider({ children }) {
  // boot from storage (with migration), else defaults
  const boot = read();
  const [lists, setLists] = useState(boot?.lists ?? DEFAULT_LISTS);
  const [tasks, setTasks] = useState(boot?.tasks ?? DEFAULT_TASKS);

  // persist on any change (debounced inside save())
  useEffect(() => save({ lists, tasks }), [lists, tasks]);

  // cross-tab sync: reload state when storage changes elsewhere
  useEffect(() => {
    const unsub = subscribe(() => {
      const data = read();
      if (data) {
        setLists(data.lists);
        setTasks(data.tasks);
      }
    });
    return unsub;
  }, []);

  const ensureBucket = (listId) =>
    setTasks((prev) => (prev[listId] ? prev : { ...prev, [listId]: [] }));

  const addList = (name, emoji = "📝") => {
    const baseId = slugify(name);
    let id = baseId, i = 2;
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
      [listId]: (prev[listId] || []).map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      ),
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
      [listId]: (prev[listId] || []).map((t) =>
        t.id === taskId ? { ...t, color } : t
      ),
    }));
  };

  /** Optional helpers (use from a settings screen if you add one) */
  const clearCompleted = () => {
    setTasks((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, arr]) => [id, arr.filter((t) => !t.done)])
      )
    );
  };

  const resetAll = () => {
    clearAll();
    setLists(DEFAULT_LISTS);
    setTasks(DEFAULT_TASKS);
  };

  const exportDataURL = () => exportAsURL({ lists, tasks });

  const importDataFile = async (file) => {
    const next = await importFromFile(file);
    setLists(next.lists);
    setTasks(next.tasks);
  };

  const value = useMemo(
    () => ({
      lists,
      tasks,
      addList,
      removeList,
      updateList,
      getTasks,
      addTask,
      toggleTask,
      deleteTask,
      setTaskColor,
      // optional utilities
      clearCompleted,
      resetAll,
      exportDataURL,
      importDataFile,
    }),
    [lists, tasks]
  );

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export const useData = () => useContext(DataCtx);
