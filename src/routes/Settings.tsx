// src/routes/Settings.tsx

import { useState, useEffect } from "react";
import { fetchTariffs, TariffRow } from "../lib/tariffsService";
import { Sliders, Bell, ShieldAlert, DollarSign, Cpu, Save } from "lucide-react";
import { AccessibilitySettings } from "@/components/AccessibilitySettings";

export default function Settings() {
  const [dbZones, setDbZones] = useState<TariffRow[]>([]);
  const [loadingZones, setLoadingZones] = useState<boolean>(true);

  const [maxThermalAmps, setMaxThermalAmps] = useState<number>(() => {
    return Number(localStorage.getItem("user_max_amps")) || 32;
  });

  const [tariff, setTariff] = useState<number>(() => {
    return Number(localStorage.getItem("user_tariff")) || 110;
  });

  const [selectedZone, setSelectedZone] = useState<string>(() => {
    return localStorage.getItem("user_zone") || "";
  });

  const [voltage, setVoltage] = useState<number>(220);

  const [soundAlerts, setSoundAlerts] = useState<boolean>(true);
  const [simulationMode, setSimulationMode] = useState<boolean>(false);
  const [autoDisconnect, setAutoDisconnect] = useState<boolean>(false);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    async function loadData() {
      setLoadingZones(true);
      const zones = await fetchTariffs();
      setDbZones(zones);
      setLoadingZones(false);

      if (zones.length > 0 && !localStorage.getItem("user_zone")) {
        setSelectedZone(zones[0].id);
        setTariff(zones[0].price_per_kwh);
        localStorage.setItem("user_tariff", zones[0].price_per_kwh.toString());
        localStorage.setItem("user_tax_multiplier", (zones[0].tax_multiplier || 1.28).toString());
      }
    }
    loadData();
  }, []);

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    const found = dbZones.find((z) => z.id === zoneId);
    if (found) {
      setTariff(found.price_per_kwh);
      localStorage.setItem("user_tariff", found.price_per_kwh.toString());
      localStorage.setItem("user_tax_multiplier", (found.tax_multiplier || 1.28).toString());
      localStorage.setItem("user_zone", found.id);

      const formattedPrice = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(found.price_per_kwh);

      showToast(`Zona actualizada a ${formattedPrice}/kWh (${found.provider})`);
    }
  };

  const handleSave = () => {
    localStorage.setItem("user_tariff", tariff.toString());
    localStorage.setItem("user_zone", selectedZone);
    localStorage.setItem("user_max_amps", maxThermalAmps.toString());

    setSavedSuccess(true);
    showToast("✓ Configuración guardada correctamente");
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative pb-12">
      {/* Encabezado */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="size-5 text-amber-400" />
            Ajustes del Sistema
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Parámetros de la llave térmica, notificaciones, visualización y medición.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Save className="size-4" />
          Guardar
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 rounded-2xl text-sm font-semibold animate-fade-in text-center">
          ✓ Configuración guardada correctamente.
        </div>
      )}

      {/* 1. Capacidad Térmica */}
      <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-red-400" />
            <h2 className="text-base font-bold text-slate-100">Límite de Capacidad Térmica</h2>
          </div>
          <span className="text-2xl font-black text-amber-400 font-mono">{maxThermalAmps} A</span>
        </div>
        <p className="text-sm text-slate-300">
          Ajustá el valor nominal de tu llave térmica principal. El medidor neón usará este umbral para alertar sobrecargas.
        </p>
        <input
          type="range"
          min="10"
          max="63"
          step="1"
          value={maxThermalAmps}
          onChange={(e) => setMaxThermalAmps(Number(e.target.value))}
          className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-slate-800"
        />
        <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
          <span>10 A (Mín)</span>
          <span>25 A</span>
          <span>32 A (Hogar estándar)</span>
          <span>50 A</span>
          <span>63 A (Industrial)</span>
        </div>
      </section>

      {/* 2. COMPONENTE MODULARIZADO DE ACCESIBILIDAD */}
      <AccessibilitySettings />

      {/* 3. Alertas y Automatización */}
      <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Bell className="size-5 text-amber-400" />
          Alertas y Automatización
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-200">Alarma Sonora de Sobrecarga</p>
            <p className="text-xs text-slate-400">Emite un aviso cuando la corriente supere el 85% de la térmica.</p>
          </div>
          <button
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${
              soundAlerts ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "bg-slate-800"
            }`}
          >
            <div className={`bg-slate-950 w-6 h-6 rounded-full transition-transform duration-300 ${soundAlerts ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
          <div>
            <p className="text-sm font-semibold text-slate-200">Modo Simulación de Datos</p>
            <p className="text-xs text-slate-400">Genera variaciones aleatorias para pruebas visuales en vivo.</p>
          </div>
          <button
            onClick={() => setSimulationMode(!simulationMode)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${
              simulationMode ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-slate-800"
            }`}
          >
            <div className={`bg-slate-950 w-6 h-6 rounded-full transition-transform duration-300 ${simulationMode ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
          <div>
            <p className="text-sm font-semibold text-slate-200">Corte Virtual Preventivo</p>
            <p className="text-xs text-slate-400">Simula el disparo del disyuntor al alcanzar el 100% del límite.</p>
          </div>
          <button
            onClick={() => setAutoDisconnect(!autoDisconnect)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${
              autoDisconnect ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-slate-800"
            }`}
          >
            <div className={`bg-slate-950 w-6 h-6 rounded-full transition-transform duration-300 ${autoDisconnect ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      </section>

      {/* 4. Parámetros Financieros y Técnicos */}
      <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2">
            <DollarSign className="size-4 text-emerald-400" />
            Distribuidora y Zona Tarifaria (Desde Supabase)
          </label>
          <select
            value={selectedZone}
            onChange={(e) => handleZoneSelect(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none cursor-pointer"
          >
            {loadingZones ? (
              <option value="">Cargando tarifas desde la base de datos...</option>
            ) : (
              dbZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.provider} - {zone.zone_name} (${zone.price_per_kwh}/kWh)
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2">
            <DollarSign className="size-4 text-emerald-400" />
            Tarifa Base por kWh ($ ARS)
          </label>
          <input
            type="number"
            step="1"
            value={tariff}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTariff(val);
              localStorage.setItem("user_tariff", val.toString());
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">Costo unitario sin impuestos aplicados.</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2">
            <Cpu className="size-4 text-sky-400" />
            Tensión de Red (Voltios)
          </label>
          <input
            type="number"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">Usado para la conversión exacta P = V × I.</p>
        </div>
      </section>

      {/* Toast Flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl shadow-emerald-950/80 animate-bounce">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <p className="text-sm font-semibold tracking-wide">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}