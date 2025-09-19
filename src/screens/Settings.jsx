// src/screens/Settings.jsx
import { useRef, useState } from "react";
import { useData } from "../data/DataContext.jsx";
import HeaderBar from "../ui/HeaderBar.jsx";

export default function Settings() {
  const { exportDataURL, importDataFile, resetAll, clearCompleted } = useData();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const download = () => {
    const url = exportDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = `todo-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      await importDataFile(file);
      alert("Imported successfully.");
    } catch (err) {
      alert(err.message || "Import failed.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <main className="screen yellow">
      <HeaderBar back to="/" title="Settings" />
      <div className="padded">
        <div className="card">
          <h3>Backup</h3>
          <p className="muted">Download your lists & tasks as a JSON file.</p>
          <button className="btn" onClick={download}>Download backup</button>
        </div>

        <div className="card">
          <h3>Restore</h3>
          <p className="muted">Load a JSON backup (overwrites current data).</p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            onChange={onImport}
            disabled={busy}
          />
        </div>

        <div className="card">
          <h3>Maintenance</h3>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button className="btn" onClick={clearCompleted}>Clear completed</button>
            <button
              className="btn"
              onClick={() => { if (confirm("Reset all data?")) resetAll(); }}
            >
              Reset app
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
