import { Link, useNavigate, Outlet } from "@tanstack/react-router";
import { Activity, BarChart3, Settings, LogOut, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Inicio", icon: Activity },
  { to: "/historico", label: "Histórico", icon: BarChart3 },
  { to: "/configuracion", label: "Configuración", icon: Settings },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const { session } = useSession();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-eco text-eco-foreground glow-eco">
            <Zap className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold">Watt</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              activeProps={{ className: "bg-surface-2 text-foreground" }}
              activeOptions={{ exact: to === "/" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {session ? (
          <div className="flex items-center gap-2">
            <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground sm:block">
              {session.user.email}
            </span>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Cerrar sesión">
              <LogOut className="size-4" />
            </Button>
          </div>
        ) : (
          <Button asChild size="sm">
            <Link to="/auth">Ingresar</Link>
          </Button>
        )}
      </header>

      {/* AQUÍ SE RENDERIZARÁ EL CONTENIDO O LA RUTA */}
      <main className="mx-auto w-full max-w-5xl px-4">{children ?? <Outlet />}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-[11px] text-muted-foreground"
              activeProps={{ className: "text-eco" }}
              activeOptions={{ exact: to === "/" }}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}