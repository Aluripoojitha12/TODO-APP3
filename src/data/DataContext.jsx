import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid/non-secure"; // no install needed with vite

const DataCtx = createContext();

const LS_KEY = "todo-app-data-v1";

const defaultData = {
  lists: [
    { id: "today", name: "Today", emoji: "☀️" },
    { id: "planned", name: "Planned", emoji: "🗓️" },
    { id: "personal", name: "Personal", emoji: "🙂" },
    { id: "work", name: "Work", emoji: "💼" },
    { id: "shopping", name: "Shopping", emoji: "🛒" }
  ],
  tasks: {
    today: [],
    planned: [],
    personal: [],
    work: [],
    shopping: []
  }
};

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => localStorage.setItem(LS_KEY, JSON.stringify(data)), [data]);

  const api = useMemo(() => ({
    lists: data.lists,
    getTasks: (listId) => data.tasks[listId] || [],
    addList: (name, emoji = "📝") => {
      const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(4);
      setData(d => ({
        ...d,
        lists: [...d.lists, { id, name, emoji }],
        tasks: { ...d.tasks, [id]: [] }
      }));
    },
    removeList: (id) => {
      const { [id]: _, ...restTasks } = data.tasks;
      setData(d => ({ ...d, lists: d.lists.filter(l => l.id !== id), tasks: restTasks }));
    },
    addTask: (listId, title) => {
      setData(d => ({
        ...d,
        tasks: {
          ...d.tasks,
          [listId]: [...(d.tasks[listId] || []), { id: nanoid(), title, done: false }]
        }
      }));
    },
    toggleTask: (listId, taskId) => {
      setData(d => ({
        ...d,
        tasks: {
          ...d.tasks,
          [listId]: d.tasks[listId].map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        }
      }));
    },
    deleteTask: (listId, taskId) => {
      setData(d => ({
        ...d,
        tasks: { ...d.tasks, [listId]: d.tasks[listId].filter(t => t.id !== taskId) }
      }));
    }
  }), [data]);

  return <DataCtx.Provider value={api}>{children}</DataCtx.Provider>;
}

export const useData = () => useContext(DataCtx);
