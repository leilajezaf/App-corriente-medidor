import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";

// Import como DEFAULT para Home (desde src/routes/index.tsx)
import Home from "./routes/index"; 

// Imports directos para las demás pantallas
import History from "./routes/History";
import Settings from "./routes/Settings";
import Register from "./routes/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="historial" element={<History />} />
          <Route path="ajustes" element={<Settings />} />
          <Route path="registro" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}