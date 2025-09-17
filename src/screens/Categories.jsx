import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../data/DataContext.jsx";
import HeaderBar from "../ui/HeaderBar.jsx";

/* Build with Array.from so surrogate pairs stay intact.
   Keep to common, single-codepoint emoji for widest support. */
const EMOJIS = Array.from(
  "😀😃😄😁😆🥳🙂😉😊😇😍🤩😌😎🤗🤔😴😛😜🤪😝✅📝📌📎📦🛒💼📚🧹🧺🍎🍔☕🎯💻📱⭐🔥🚗🏠🌧️🌞🗓️"
);

export default function Categories() {
  const { lists, addList, removeList, getTasks } = useData();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📝");

  const openAdd = () => { setName(""); setEmoji("📝"); setShowAdd(true); };

  const submit = (e) => {
    e?.preventDefault();
    if (!name.trim()) return;
    addList(name.trim(), emoji || "📝");
    setShowAdd(false);
  };

  return (
    <main className="screen yellow">
      <HeaderBar title="Hello" menu />
      <div className="padded">
        <p className="muted">
          Today you have {getTasks("today").filter((t) => !t.done).length || 0} tasks
        </p>

        <div className="list-cards">
          {lists.map((list) => {
            const tasks = getTasks(list.id);
            const pending = tasks.filter((t) => !t.done).length;

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

                {["today","planned","personal","work","shopping"].includes(list.id) ? null : (
                  <button className="icon-btn" title="Delete list" onClick={() => removeList(list.id)}>⋮</button>
                )}
              </article>
            );
          })}
        </div>
      </div>

      <button className="fab" onClick={openAdd} aria-label="Add list">＋</button>

      {/* Add Category Modal with emoji keyboard */}
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
    </main>
  );
}
