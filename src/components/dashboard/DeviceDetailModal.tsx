import React from "react";
import { DeviceData } from "./DeviceCard";
import { X, Zap, DollarSign, Lightbulb, Thermometer } from "lucide-react";
import { formatARS } from "../../services/tariffCalculator";

interface DeviceDetailModalProps {
  device: DeviceData | null;
  onClose: () => void;
  pricePerKwh?: number;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  device,
  onClose,
  pricePerKwh = 69.76,
}) => {
  if (!device) return null;

  // Cálculos de consumo y costo
  const hoursPerDay = 8;
  const kwhPerDay = ((device.powerWatts || 100) * hoursPerDay) / 1000;
  const kwhPerMonth = kwhPerDay * 30;
  const estimatedMonthlyCost = kwhPerMonth * pricePerKwh;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#42C2C1]/10 text-[#42C2C1] flex items-center justify-center font-bold">
              <Zap className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{device.name}</h3>
              <p className="text-xs text-slate-400 capitalize">{device.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Métricas de Potencia y Costo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-400">Potencia Nominal</span>
            <div className="text-lg font-bold text-slate-800 mt-0.5">
              {device.powerWatts || 100} <span className="text-xs font-semibold text-slate-400">Watts</span>
            </div>
          </div>
          <div className="bg-[#42C2C1]/10 p-3.5 rounded-2xl border border-[#42C2C1]/20">
            <span className="text-[11px] font-medium text-[#2ba09f]">Costo Estimado / mes</span>
            <div className="text-lg font-bold text-[#2ba09f] mt-0.5">
              {formatARS(estimatedMonthlyCost)}
            </div>
          </div>
        </div>

        {/* Consejos de Eficiencia */}
        <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <Lightbulb className="size-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Recomendación de uso eficiente:</strong>
            {device.category === "climatizacion" && "Mantener el equipo en 24 °C reduce el consumo hasta un 20% en comparación con 18 °C."}
            {device.category === "cocina" && "Asegúrate de que la goma de la puerta selle correctamente para evitar pérdidas de frío."}
            {device.category !== "climatizacion" && device.category !== "cocina" && "Desconecta o apaga en stand-by este dispositivo cuando no esté en uso para evitar consumos vampiro."}
          </div>
        </div>

        {/* Botón de Cierre */}
        <button
          onClick={onClose}
          className="w-full bg-[#42C2C1] hover:bg-[#38b1b0] text-white font-bold py-3 rounded-2xl transition shadow-md shadow-[#42C2C1]/20 text-sm"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};