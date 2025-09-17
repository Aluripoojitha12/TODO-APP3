import { Routes, Route, Navigate } from "react-router-dom";
import Hello from "./screens/Hello.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import Categories from "./screens/Categories.jsx";
import Tasks from "./screens/Tasks.jsx";

export default function App() {
  return (
    <Routes>
      {/* 1) Hello splash */}
      <Route path="/" element={<Hello />} />

      {/* 2) Onboarding screen */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* 3) Lists (Categories) */}
      <Route path="/lists" element={<Categories />} />

      {/* 4) Tasks within a list */}
      <Route path="/lists/:listId" element={<Tasks />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
