import React from "react";
import { DollarSign, Info, ShieldAlert } from "lucide-react";

interface CostEstimateProps {
  /** Consumo total acumulado en kWh */
  totalKwh: number;
}

export const CostEstimateCard: React.FC<CostEstimateProps> = ({ totalKwh }) => {
  // 1. Obtener tarifa base (ej: 69.76) y multiplicador de impuestos (ej: 1.28)
  const savedTariff = Number(localStorage.getItem("user_tariff")) || 69.76;
  const taxMultiplier = Number(localStorage.getItem("user_tax_multiplier")) || 1.28;

  // 2. Cálculos: consumo puro, costo de impuestos estimados y total final
  const pureCost = totalKwh * savedTariff;
  const totalCostWithTaxes = pureCost * taxMultiplier;
  const estimatedTaxesAmount = totalCostWithTaxes - pureCost;

  // 3. Formateador ARS
  const formatARS = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <DollarSign className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Gasto Estimado de Consumo
            </h3>
            <p className="text-xs text-slate-400">Cálculo de consumo con impuestos orientativos</p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1">
          <Info className="size-3" /> Valor Aprox.
        </span>
      </div>

      {/* Muestra Principal del Total Estimado */}
      <div className="mb-4">
        <div className="text-3xl font-extrabold text-slate-100 tracking-tight">
          {formatARS(totalCostWithTaxes)}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Basado en <strong className="text-slate-200">{totalKwh.toFixed(2)} kWh</strong> a{" "}
          <span className="text-emerald-400 font-semibold">{formatARS(savedTariff)}/kWh</span>
        </p>
      </div>

      {/* Desglose explicativo */}
      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-3 text-xs space-y-1.5">
        <div className="flex justify-between text-slate-300">
          <span>Consumo puro estimado:</span>
          <span className="font-medium text-slate-100">{formatARS(pureCost)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Impuestos estim. (~{Math.round((taxMultiplier - 1) * 100)}%):</span>
          <span className="text-amber-400/90 font-medium">+{formatARS(estimatedTaxesAmount)}</span>
        </div>
        <div className="flex justify-between text-slate-200 pt-1 border-t border-slate-800/60 font-semibold">
          <span>Total Estimado:</span>
          <span className="text-emerald-400">{formatARS(totalCostWithTaxes)}</span>
        </div>
      </div>

      {/* Nota legal */}
      <div className="flex items-start gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 leading-snug">
        <ShieldAlert className="size-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Aviso informativo:</strong> Los impuestos y cargos se calculan de manera estimada según la zona seleccionada. No reemplaza una liquidación oficial de la distribuidora.
        </p>
      </div>
    </div>
  );
};