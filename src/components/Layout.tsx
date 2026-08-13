import { NavLink, Outlet } from "react-router-dom";
import { Zap, History, Settings, UserPlus } from "lucide-react";

export function Layout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
      isActive
        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/5"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header con Navegación */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="size-6 text-amber-400 animate-pulse" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              AmpGuard
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/" end className={linkClass}>
              <Zap className="size-4" />
              <span className="hidden sm:inline">En Vivo</span>
            </NavLink>
            <NavLink to="/historial" className={linkClass}>
              <History className="size-4" />
              <span className="hidden sm:inline">Historial</span>
            </NavLink>
            <NavLink to="/ajustes" className={linkClass}>
              <Settings className="size-4" />
              <span className="hidden sm:inline">Ajustes</span>
            </NavLink>
            <NavLink to="/registro" className={linkClass}>
              <UserPlus className="size-4" />
              <span className="hidden sm:inline">Registro</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Contenido Dinámico de las Pantallas */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}