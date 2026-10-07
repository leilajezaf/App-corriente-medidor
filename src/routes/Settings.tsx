import React, { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { TariffRow, fetchTariffs, formatARS } from "../services/tariffCalculator";
import {
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  DollarSign,
  Building2,
  MapPin,
  Percent,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const Settings: React.FC = () => {
  const [tariffs, setTariffs] = useState<TariffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Estado del formulario (creación o edición)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    provider: "",
    zone_name: "",
    price_per_kwh: 69.76,
    tax_multiplier: 1.28,
  });

  // Cargar lista de tarifas desde Supabase
  const loadData = async () => {
    setLoading(true);
    const data = await fetchTariffs();
    setTariffs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      provider: "",
      zone_name: "",
      price_per_kwh: 69.76,
      tax_multiplier: 1.28,
    });
  };

  // Cargar tarifa existente en el formulario para editar
  const handleEditClick = (tariff: TariffRow) => {
    setEditingId(tariff.id);
    setFormData({
      provider: tariff.provider,
      zone_name: tariff.zone_name,
      price_per_kwh: tariff.price_per_kwh,
      tax_multiplier: tariff.tax_multiplier,
    });
  };

  // Guardar (Insert o Update) en Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (editingId) {
        // Actualizar registro existente
        const { error } = await supabase
          .from("tariffs")
          .update({
            provider: formData.provider,
            zone_name: formData.zone_name,
            price_per_kwh: formData.price_per_kwh,
            tax_multiplier: formData.tax_multiplier,
          })
          .eq("id", editingId);

        if (error) throw error;
        setFeedback({ type: "success", msg: "Tarifa actualizada con éxito." });
      } else {
        // Insertar nuevo registro
        const { error } = await supabase.from("tariffs").insert([
          {
            provider: formData.provider,
            zone_name: formData.zone_name,
            price_per_kwh: formData.price_per_kwh,
            tax_multiplier: formData.tax_multiplier,
          },
        ]);

        if (error) throw error;
        setFeedback({ type: "success", msg: "Nueva tarifa guardada correctamente." });
      }

      resetForm();
      await loadData();
    } catch (err: any) {
      console.error("Error al guardar en Supabase:", err);
      setFeedback({ type: "error", msg: err.message || "Ocurrió un error al guardar la tarifa." });
    } finally {
      setSaving(false);
    }
  };

  // Eliminar tarifa de Supabase
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar esta tarifa?")) return;

    try {
      const { error } = await supabase.from("tariffs").delete().eq("id", id);
      if (error) throw error;
      setFeedback({ type: "success", msg: "Tarifa eliminada." });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: "error", msg: "Error al eliminar la tarifa." });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 text-slate-100">
      {/* Encabezado */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
          <SettingsIcon className="size-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Configuración de Tarifas</h1>
          <p className="text-xs text-slate-400">
            Administrá los cuadros tarifarios e impuestos guardados en Supabase
          </p>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulario (Columna Izquierda) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              {editingId ? <Edit2 className="size-4 text-amber-400" /> : <Plus className="size-4 text-emerald-400" />}
              {editingId ? "Editar Tarifa" : "Agregar Nueva Tarifa"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <X className="size-3" /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Distribuidora / Proveedor */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Distribuidora / Proveedor</label>
              <div className="relative">
                <Building2 className="size-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Edenor, Edesur, Edelap"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Zona o Categoría */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Zona / Categoría Tarifaria</label>
              <div className="relative">
                <MapPin className="size-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Quilmes R1, CABA T1-R"
                  value={formData.zone_name}
                  onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Precio del kWh */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Precio del kWh ($ ARS)</label>
              <div className="relative">
                <DollarSign className="size-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  placeholder="69.76"
                  value={formData.price_per_kwh}
                  onChange={(e) =>
                    setFormData({ ...formData, price_per_kwh: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Multiplicador de Impuestos */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Multiplicador de Impuestos (ej: 1.28 = +28%)
              </label>
              <div className="relative">
                <Percent className="size-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  required
                  min="1"
                  placeholder="1.28"
                  value={formData.tax_multiplier}
                  onChange={(e) =>
                    setFormData({ ...formData, tax_multiplier: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs"
            >
              <Save className="size-4" />
              {saving ? "Guardando..." : editingId ? "Actualizar Tarifa" : "Guardar Tarifa"}
            </button>
          </form>
        </div>

        {/* Listado de Tarifas Registradas (Columna Derecha) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">Tarifas Registradas en Supabase</h2>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              Cargando tarifas...
            </div>
          ) : tariffs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              No hay tarifas registradas en la tabla <code className="text-emerald-400">tariffs</code>.
            </div>
          ) : (
            <div className="space-y-3">
              {tariffs.map((t) => {
                const taxPct = Math.round((t.tax_multiplier - 1) * 100);
                return (
                  <div
                    key={t.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm">{t.provider}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {t.zone_name}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span>
                          Valor kWh: <strong className="text-emerald-400">{formatARS(t.price_per_kwh)}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Impuestos: <strong className="text-amber-400">+{taxPct}%</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(t)}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition"
                        title="Editar tarifa"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition"
                        title="Eliminar tarifa"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};