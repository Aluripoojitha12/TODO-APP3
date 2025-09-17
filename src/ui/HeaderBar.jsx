import { Link } from "react-router-dom";

export default function HeaderBar({ title = "", back = false, to = -1, menu = false }) {
  return (
    <header className="topbar">
      <div className="left">
        {back ? (
          <Link to={to} className="icon-btn">←</Link>
        ) : menu ? (
          <button className="icon-btn">≡</button>
        ) : (
          <span />
        )}
      </div>
      <div className="center">{title}</div>
      <div className="right">
        <button className="icon-btn">⋯</button>
      </div>
    </header>
  );
}
