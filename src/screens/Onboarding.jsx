import { useNavigate } from "react-router-dom";
import HeaderBar from "../ui/HeaderBar.jsx";
import heroImg from "../assets/image.png";

export default function Onboarding() {
  const nav = useNavigate();
  return (
    <main className="screen yellow-solid split">
      <HeaderBar back to="/" />
      <section className="hero">
        <div className="illus">
          <img src={heroImg} alt="Organize illustration" />
        </div>
        <h2 className="title" style={{ fontSize: 28, marginTop: 6 }}>
          Get Organized Your Life
        </h2>
        <p className="muted">
          A simple, effective list manager to keep your day tidy.
        </p>
        <button className="btn primary" onClick={() => nav("/lists")}>
          Get Started
        </button>
      </section>
    </main>
  );
}

