import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { Zap, Mail, Lock, AlertCircle, LogIn } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      if (err.message.includes("Invalid login credentials")) {
        setErrorMsg("Credenciales incorrectas o correo aún no verificado.");
      } else {
        setErrorMsg(err.message || "Error al intentar iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Logo y Nombre */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#42C2C1]/10 text-[#42C2C1] flex items-center justify-center mx-auto mb-3">
            <Zap className="size-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Watt App</h1>
          <p className="text-xs text-slate-400 mt-0.5">Control de energía para tu hogar</p>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="size-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="size-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#42C2C1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="size-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#42C2C1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#42C2C1] hover:bg-[#38b1b0] text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-[#42C2C1]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <LogIn className="size-4" />
            <span>{loading ? "Iniciando sesión..." : "Iniciar Sesión"}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-100">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-[#42C2C1] font-semibold hover:underline">
            Registrate gratis
          </Link>
        </div>

      </div>
    </div>
  );
}