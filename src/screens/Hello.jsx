import { useNavigate } from "react-router-dom";
import HeaderBar from "../ui/HeaderBar.jsx";

export default function Hello() {
  const nav = useNavigate();
  return (
    <main className="screen yellow">
      <HeaderBar title="" />
      <section className="card center">
        <h1 className="title">Hello 👋</h1>
        <p className="muted">Welcome to your simple & clean To-Do app.</p>
        <button className="btn primary" onClick={() => nav("/start")}>
          Next
        </button>
      </section>
    </main>
  );
}
