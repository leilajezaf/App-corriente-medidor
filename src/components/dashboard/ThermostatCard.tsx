import React, { useState } from "react";
import { ArrowLeft, Minus, Plus, Power, Flame, Snowflake, Wind, Zap, DollarSign } from "lucide-react";

interface DevicePreset {
  id: string;
  name: string;
  baseWatts: number;
  type: "thermostat" | "power";
}

const PRESETS: DevicePreset[] = [
  { id: "ac", name: "Aire Acondicionado", baseWatts: 1800, type: "thermostat" },
  { id: "heater", name: "Calefactor Eléctrico", baseWatts: 1500, type: "power" },
  { id: "oven", name: "Horno / Anafe", baseWatts: 2000, type: "power" },
  { id: "washer", name: "Lavarropas (Agua Caliente)", baseWatts: 1200, type: "power" },
];

interface ThermostatCardProps {
  tariffPerKwh?: number;
  onBack?: () => void;
}

export const ThermostatCard: React.FC<ThermostatCardProps> = ({
  tariffPerKwh = 69.76,
  onBack,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<DevicePreset>(PRESETS[0]);
  const [temp, setTemp] = useState(24);
  const [powerLevel, setPowerLevel] = useState(3); // Niveles 1 al 5
  const [isOn, setIsOn] = useState(true);

  const minTemp = 16;
  const maxTemp = 28;

  // Cálculo de potencia Watts según el tipo de equipo
  let calculatedWatts = 0;
  if (isOn) {
    if (selectedPreset.type === "thermostat") {
      const tempFactor = 1 + (24 - temp) * 0.08;
      calculatedWatts = Math.round(selectedPreset.baseWatts * Math.max(0.4, tempFactor));
    } else {
      calculatedWatts = Math.round(selectedPreset.baseWatts * (powerLevel / 5));
    }
  }

  // Costo por hora estimado en pesos con impuestos (x1.28)
  const costPerHour = ((calculatedWatts / 1000) * tariffPerKwh * 1.28).toFixed(1);

  const handleDecrease = () => {
    if (selectedPreset.type === "thermostat") {
      setTemp((prev) => Math.max(minTemp, prev - 1));
    } else {
      setPowerLevel((prev) => Math.max(1, prev - 1));
    }
  };

  const handleIncrease = () => {
    if (selectedPreset.type === "thermostat") {
      setTemp((prev) => Math.min(maxTemp, prev + 1));
    } else {
      setPowerLevel((prev) => Math.min(5, prev + 1));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 font-sans">
      
      {/* Top Bar / Volver */}
      {onBack && (
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition text-slate-700">
          <ArrowLeft className="size-5" />
        </button>
      )}

      {/* Selector de Cargas a Simular */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Seleccionar Carga a Simular
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                setIsOn(true);
              }}
              className={`p-2.5 rounded-2xl border text-xs font-semibold transition text-left ${
                selectedPreset.id === preset.id
                  ? "border-[#42C2C1] bg-[#42C2C1]/10 text-[#2ba09f]"
                  : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3">
        <h2 className="text-base font-bold text-slate-800 text-center">
          {selectedPreset.name}
        </h2>
        <p className="text-xs text-center text-[#42C2C1] font-semibold">
          Simulador de Demanda Instantánea
        </p>
      </div>

      {/* Indicadores Dinámicos de Consumo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
          <span className="text-[11px] font-medium text-slate-400 flex items-center justify-center gap-1">
            <Zap className="size-3 text-amber-500" /> Potencia Est.
          </span>
          <div className="text-lg font-bold text-slate-800 mt-0.5">
            {calculatedWatts} <span className="text-xs font-semibold text-slate-400">W</span>
          </div>
        </div>

        <div className="bg-[#42C2C1]/10 p-3 rounded-2xl border border-[#42C2C1]/20 text-center">
          <span className="text-[11px] font-medium text-[#2ba09f] flex items-center justify-center gap-1">
            <DollarSign className="size-3" /> Costo Est.
          </span>
          <div className="text-lg font-bold text-[#2ba09f] mt-0.5">
            ${costPerHour} <span className="text-xs font-semibold opacity-80">/hora</span>
          </div>
        </div>
      </div>

      {/* Dial Adaptativo */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="2.5"
              strokeDasharray="2 3"
            />
          </svg>

          {/* Valor central del Dial */}
          <div className="absolute w-36 h-36 rounded-full bg-white shadow-xl shadow-slate-200/60 border border-slate-50 flex flex-col items-center justify-center">
            {selectedPreset.type === "thermostat" ? (
              <>
                <div className="flex items-start">
                  <span className={`text-5xl font-extrabold tracking-tight leading-none ${isOn ? 'text-slate-800' : 'text-slate-300'}`}>
                    {temp}
                  </span>
                  <span className="text-lg font-bold text-[#42C2C1] ml-0.5">°C</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 mt-1">
                  {temp === 24 ? "🌱 Nivel Eco (Ideal)" : temp < 24 ? "⚠️ Alto Consumo" : "❄️ Bajo Consumo"}
                </span>
              </>
            ) : (
              <>
                <div className="flex items-baseline">
                  <span className={`text-4xl font-extrabold tracking-tight leading-none ${isOn ? 'text-slate-800' : 'text-slate-300'}`}>
                    Nivel {powerLevel}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 mt-1">
                  Potencia al {powerLevel * 20}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Botones de Control (+ / - / Power) */}
        <div className="flex items-center gap-6 mt-1">
          <button
            onClick={handleDecrease}
            className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:scale-105 active:scale-95 transition"
          >
            <Minus className="size-5" />
          </button>

          <button
            onClick={() => setIsOn(!isOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition ${
              isOn ? "bg-[#42C2C1] shadow-[#42C2C1]/30" : "bg-slate-300"
            }`}
          >
            <Power className="size-5" />
          </button>

          <button
            onClick={handleIncrease}
            className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:scale-105 active:scale-95 transition"
          >
            <Plus className="size-5" />
          </button>
        </div>
      </div>

    </div>
  );
};