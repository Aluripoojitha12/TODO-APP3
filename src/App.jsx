import { Routes, Route, Navigate } from "react-router-dom";
import Hello from "./screens/Hello.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import Categories from "./screens/Categories.jsx";
import Tasks from "./screens/Tasks.jsx";
import { DataProvider } from "./data/DataContext.jsx";

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/lists" element={<Categories />} />
        <Route path="/lists/:listId" element={<Tasks />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DataProvider>
  );
}
