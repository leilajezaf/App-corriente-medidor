import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../integrations/supabase/client";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // Registro directo con Supabase Auth guardando rol y nombre en user_metadata
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setSubmitted(true);
        setTimeout(() => {
          navigate("/"); // Redirige al inicio tras registrarse
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error al registrar:", err);
      setErrorMsg(err.message || "Ocurrió un error al registrar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Cabecera */}
        <div className="text-center">
          <div className="inline-flex p-3 bg-[#42C2C1]/10 rounded-2xl border border-[#42C2C1]/20 mb-3 text-[#42C2C1]">
            <UserPlus className="size-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Alta de Usuario</h1>
          <p className="text-xs text-slate-400 mt-1">
            Registro para el panel de medición y simulación energética
          </p>
        </div>

        {/* Notificación de Éxito */}
        {submitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            <span>¡Usuario registrado con éxito! Redirigiendo...</span>
          </div>
        )}

        {/* Notificación de Error */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nombre Completo */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="size-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Ej. Leila Fernández"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#42C2C1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="size-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#42C2C1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="size-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#42C2C1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Rol de Acceso */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Rol de Acceso
            </label>
            <div className="relative">
              <ShieldCheck className="size-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 focus:border-[#42C2C1] focus:outline-none transition-colors appearance-none"
              >
                <option value="operator">Operador (Solo Lectura)</option>
                <option value="admin">Administrador (Control Total)</option>
              </select>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#42C2C1] hover:bg-[#38b1b0] text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-[#42C2C1]/20 transition-all active:scale-[0.98]"
          >
            {loading ? "Registrando..." : "Registrar Usuario"}
          </button>
        </form>

        {/* Link a Inicio de Sesión */}
        <div className="text-center text-slate-400 pt-2 border-t border-slate-100">
          ¿Ya tenés cuenta?{" "}
          <Link to="/auth" className="text-[#42C2C1] font-semibold hover:underline">
            Iniciar Sesión
          </Link>
        </div>

      </div>
    </div>
  );
}