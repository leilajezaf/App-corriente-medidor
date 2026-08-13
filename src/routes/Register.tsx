import { useState } from "react";
import { UserPlus, Mail, Lock, User, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-3">
            <UserPlus className="size-8 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Registro de Usuario</h1>
          <p className="text-xs text-slate-400 mt-1">
            Alta de operadores y administradores para el panel de medición
          </p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>¡Usuario registrado con éxito!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="size-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Ej. Leila Fernández"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="size-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="size-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Rol de Acceso
            </label>
            <div className="relative">
              <ShieldCheck className="size-4 text-slate-500 absolute left-3.5 top-3" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="operator">Operador (Solo Lectura)</option>
                <option value="admin">Administrador (Control Total)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] text-sm"
          >
            Registrar Usuario
          </button>
        </form>
      </div>
    </div>
  );
}