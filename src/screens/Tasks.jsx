import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useData } from "../data/DataContext.jsx";
import HeaderBar from "../ui/HeaderBar.jsx";

/** Solid HEX palette for task color selector (used in Add modal) */
const COLORS = ["#6C63FF", "#4CC3FF", "#00C2A8", "#FF6B6B"];

/** Back-compat for old saved values like 'var(--c1)' */
const VAR_MAP = {
  "var(--c1)": "#6C63FF",
  "var(--c2)": "#4CC3FF",
  "var(--c3)": "#00C2A8",
  "var(--c4)": "#FF6B6B",
};
const toHex = (c) => (!c ? null : c.startsWith("var(") ? VAR_MAP[c] || null : c);
const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};
const pastelBg = (hex, a = 0.18) => {
  if (!hex) return undefined;
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/** Emoji list with Array.from so multi-byte emoji render correctly */
const EMOJIS = Array.from(
  "😀😃😄😁😆🥳🙂😉😊😇😍🤩😌😎🤗🤔😴😛😜🤪😝✅📝📌📎📦🛒💼📚🧹🧺🍎🍔☕🎯💻📱⭐🔥"
);

export default function Tasks() {
  const { listId } = useParams();
  // removed setTaskColor so the quick chips disappear; colors are chosen in the modal only
  const { lists, getTasks, addTask, toggleTask, deleteTask } = useData();

  const list = lists.find((l) => l.id === listId);
  const tasks = getTasks(listId);

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(null);
  const [emoji, setEmoji] = useState("");

  const isDesktop = useMemo(() => !/Mobi|Android/i.test(navigator.userAgent), []);

  const submit = (e) => {
    e?.preventDefault();
    if (!title.trim()) return;
    addTask(listId, { title: title.trim(), color, emoji });
    setTitle("");
    setColor(null);
    setEmoji("");
    setShowAdd(false);
  };

  return (
    /* Tasks page only: yellow hero on top, white below (handled by .tasks-linear in CSS) */
    <main className="screen yellow tasks-linear">
      <HeaderBar back to="/lists" title={`${list?.emoji || "📝"} ${list?.name || "List"}`} />

      <div className="padded">
        {tasks.length === 0 && <p className="muted">No tasks yet. Add one!</p>}

        <ul className="tasks">
          {tasks.map((t) => {
            const hex = toHex(t.color);
            return (
              <li
                key={t.id}
                className="task"
                /* card shows soft tint + colored left border; no color chips on the right */
                style={{
                  background: pastelBg(hex) || "var(--card)",
                  borderLeft: `6px solid ${hex || "#e5e7eb"}`
                }}
              >
                <span className="badge" style={{ background: hex || "#d1d5db" }} />
                <label className="checkbox" style={{ flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(listId, t.id)}
                  />
                  <span className={`title ${t.done ? "done" : ""}`}>
                    {t.emoji ? `${t.emoji} ` : ""}{t.title}
                  </span>
                </label>

                {/* delete button only; color chips removed for a simpler look */}
                <button
                  className="icon-btn"
                  onClick={() => deleteTask(listId, t.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button className="fab" onClick={() => setShowAdd(true)} aria-label="Add task">
        ＋
      </button>

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h3>Add Task</h3>

            <div className="row">
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                style={{ background: "#fff" }}
              />
              {isDesktop && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => setEmoji(emoji ? "" : "🙂")}
                  title="Toggle emoji picker"
                >
                  {emoji || "😊"}
                </button>
              )}
            </div>

            {isDesktop && emoji !== "" && (
              <div className="emoji-grid" style={{ marginTop: 8 }}>
                {EMOJIS.map((e) => (
                  <button key={e} className="emoji-btn" onClick={() => setEmoji(e)} type="button">
                    {e}
                  </button>
                ))}
              </div>
            )}

            <div className="row">
              <span className="muted" style={{ minWidth: 60 }}>Color</span>
              <div style={{ display: "flex", gap: 10 }}>
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`color-chip ${color === c ? "selected" : ""}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button type="button" className="btn" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
