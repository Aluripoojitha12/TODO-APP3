import { useNavigate } from "react-router-dom";
import HeaderBar from "../ui/HeaderBar.jsx";

export default function Hello() {
  const nav = useNavigate();
  return (
    <main className="screen yellow-solid split">
      <HeaderBar />
      <section className="hero" style={{ textAlign: "center", margin: "auto" }}>
        <h1 className="title">Hello 👋</h1>
        <p className="muted">Welcome to your simple, colorful to-do app.</p>
        <button className="btn primary" onClick={() => nav("/onboarding")}>
          Next
        </button>
      </section>
    </main>
  );
}
