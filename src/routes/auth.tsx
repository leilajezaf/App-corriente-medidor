import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Zap } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("¡Registro exitoso! Revisa tu email para confirmar.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1313] px-4">
      <div className="panel w-full max-w-md p-8 rounded-2xl border border-[#1e2c2a] bg-[#121c1b] text-slate-100 shadow-xl">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-[#10b981]/10 rounded-full mb-3 text-[#10b981]">
            <Zap className="size-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Watt App</h1>
          <p className="text-sm text-slate-400 mt-1">Control de energía para tu hogar</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3 rounded-xl bg-[#1a2725] border border-[#2a3d39] text-white focus:outline-none focus:border-[#10b981] text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#1a2725] border border-[#2a3d39] text-white focus:outline-none focus:border-[#10b981] text-base"
            />
          </div>

          {message && <p className="text-sm text-[#10b981] text-center font-medium">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#10b981] text-[#0b1313] font-bold rounded-xl text-base hover:bg-[#0e9f6e] transition duration-200 shadow-lg shadow-[#10b981]/20 cursor-pointer"
          >
            {loading ? "Cargando..." : isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-slate-400 hover:text-white underline cursor-pointer"
          >
            {isSignUp ? "¿Ya tenés cuenta? Iniciá sesión" : "¿No tenés cuenta? Registrate gratis"}
          </button>
        </div>
      </div>
    </div>
  );
}