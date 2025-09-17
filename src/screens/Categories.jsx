import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../data/DataContext.jsx";
import HeaderBar from "../ui/HeaderBar.jsx";

/* Emoji palette */
const EMOJIS = Array.from(
  "😀😃😄😁😆🥳🙂😉😊😇😍🤩😌😎🤗🤔😴😛😜🤪😝✅📝📌📎📦🛒💼📚🧹🧺🍎🍔☕🎯💻📱⭐🔥🚗🏠🌧️🌞🗓️"
);

const CORE_IDS = ["today", "planned", "personal", "work", "shopping"];

export default function Categories() {
  const { lists, addList, removeList, getTasks, updateList } = useData();

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📝");

  // Edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editFor, setEditFor] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("📝");

  const openAdd = () => { setName(""); setEmoji("📝"); setShowAdd(true); };

  const submit = (e) => {
    e?.preventDefault();
    if (!name.trim()) return;
    addList(name.trim(), emoji || "📝");
    setShowAdd(false);
  };

  const openEdit = (list) => {
    setEditFor(list);
    setEditName(list.name || "");
    setEditEmoji(list.emoji || "📝");
    setShowEdit(true);
  };

  const submitEdit = (e) => {
    e?.preventDefault();
    if (!editFor) return;
    const trimmed = editName.trim();
    if (!trimmed) return;
    updateList(editFor.id, { name: trimmed, emoji: editEmoji });
    setShowEdit(false);
  };

  return (
    <main className="screen yellow-solid">
      <HeaderBar title="Hello" menu />
      <div className="padded">
        <p className="muted">
          Today you have {getTasks("today").filter((t) => !t.done).length || 0} tasks
        </p>

        <div className="list-cards">
          {lists.map((list) => {
            const tasks = getTasks(list.id);
            const pending = tasks.filter((t) => !t.done).length;
            const isCore = CORE_IDS.includes(list.id);

            return (
              <article className="list-card" key={list.id}>
                <Link to={`/lists/${list.id}`} className="list-link">
                  <div className="icon">{list.emoji}</div>
                  <div className="meta">
                    <div className="name">{list.name}</div>
                    <div className="sub">
                      {pending} task{pending !== 1 && "s"}
                    </div>
                  </div>
                </Link>

                <div style={{ display: "flex", gap: 6, paddingRight: 8 }}>
                  <button
                    className="icon-btn"
                    title="Edit name & emoji"
                    onClick={() => openEdit(list)}
                  >
                    ✎
                  </button>
                  {!isCore && (
                    <button
                      className="icon-btn"
                      title="Delete list"
                      onClick={() => removeList(list.id)}
                    >
                      ⋮
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <button className="fab" onClick={openAdd} aria-label="Add list">＋</button>

      {/* Add Category Modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h3>Add Category</h3>

            <div className="row">
              <input
                type="text"
                placeholder="Category name (e.g., Errands)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <button type="button" className="btn emoji" title="Selected emoji">
                {emoji || "📝"}
              </button>
            </div>

            <div className="emoji-grid" style={{ marginTop: 8 }}>
              {EMOJIS.map((e) => (
                <button key={e} className="emoji-btn" onClick={() => setEmoji(e)} type="button">
                  {e}
                </button>
              ))}
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button type="button" className="btn" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn primary">Create</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Category (name + emoji) */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submitEdit}>
            <h3>Edit Category</h3>

            <div className="row">
              <input
                type="text"
                placeholder="Category name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
              />
              <button type="button" className="btn emoji" title="Selected emoji">
                {editEmoji}
              </button>
            </div>

            <div className="emoji-grid" style={{ marginTop: 8 }}>
              {EMOJIS.map((e) => (
                <button key={e} className="emoji-btn" onClick={() => setEditEmoji(e)} type="button">
                  {e}
                </button>
              ))}
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button type="button" className="btn" onClick={() => setShowEdit(false)}>Cancel</button>
              <button type="submit" className="btn primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
