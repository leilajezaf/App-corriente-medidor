import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { supabase } from "./integrations/supabase/client";

import Home from "./routes/index";
import { Settings } from "./routes/Settings";
import ThermostatView from "./routes/ThermostatView";
import Register from "./routes/Register";
import Auth from "./routes/auth";
import { Home as HomeIcon, Thermometer, Settings as SettingsIcon } from "lucide-react";

// Componente para proteger las rutas privadas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center text-xs text-slate-400 font-sans">
        Verificando sesión...
      </div>
    );
  }

  // Si no hay sesión iniciada en Supabase, te lleva a la pantalla de Registro
  if (!session) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}

function NavigationBar() {
  const location = useLocation();

  // Ocultar la barra inferior en pantallas de autenticación
  if (location.pathname === "/auth" || location.pathname === "/register") {
    return null;
  }

  const navItems = [
    { path: "/", label: "Inicio", icon: HomeIcon },
    { path: "/thermostat", label: "Termostato", icon: Thermometer },
    { path: "/settings", label: "Ajustes", icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-100 shadow-xl rounded-full px-6 py-2.5 flex items-center gap-8 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              isActive ? "text-[#42C2C1]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F6F8FA] pb-20">
        <Routes>
          {/* Rutas Públicas de Registro y Login */}
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<Auth />} />

          {/* Rutas Protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/thermostat"
            element={
              <PrivateRoute>
                <ThermostatView />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
        </Routes>

        <NavigationBar />
      </div>
    </BrowserRouter>
  );
}

export default App;