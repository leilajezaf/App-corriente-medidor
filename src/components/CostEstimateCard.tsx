// src/components/CostEstimateCard.tsx
import React, { useEffect, useState } from "react";
import { DollarSign, Info, ShieldAlert } from "lucide-react";
import {
  fetchTariffs,
  calculateCostFromTariff,
  formatARS,
  TariffRow,
  CostBreakdown,
} from "../services/tariffCalculator";

interface CostEstimateProps {
  /** Consumo total acumulado en kWh */
  totalKwh: number;
}

export const CostEstimateCard: React.FC<CostEstimateProps> = ({ totalKwh }) => {
  const [tariffs, setTariffs] = useState<TariffRow[]>([]);
  const [selectedTariff, setSelectedTariff] = useState<TariffRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTariffData() {
      setLoading(true);
      const data = await fetchTariffs();
      setTariffs(data);

      if (data.length > 0) {
        // Seleccionamos la primera tarifa de Supabase por defecto
        setSelectedTariff(data[0]);
      }
      setLoading(false);
    }

    loadTariffData();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-400 text-sm flex items-center justify-center h-48">
        Cargando tarifas de Supabase...
      </div>
    );
  }

  // Si no hay datos cargados en Supabase, mostramos un fallback
  const fallbackTariff: TariffRow = {
    id: "fallback",
    provider: "Tarifa Estimada",
    zone_name: "General",
    price_per_kwh: 69.76,
    tax_multiplier: 1.28,
  };

  const currentTariff = selectedTariff || fallbackTariff;
  const breakdown: CostBreakdown = calculateCostFromTariff(totalKwh, currentTariff);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
      {/* Encabezado con selector de distribuidora */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <DollarSign className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Gasto Estimado ({breakdown.provider})
            </h3>
            <p className="text-xs text-slate-400">Cálculo en vivo vía Supabase</p>
          </div>
        </div>

        {tariffs.length > 1 && (
          <select
            value={currentTariff.id}
            onChange={(e) => {
              const found = tariffs.find((t) => t.id === e.target.value);
              if (found) setSelectedTariff(found);
            }}
            className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
          >
            {tariffs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.provider} ({t.zone_name})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Muestra Principal del Total Estimado */}
      <div className="mb-4">
        <div className="text-3xl font-extrabold text-slate-100 tracking-tight">
          {formatARS(breakdown.totalCostWithTaxes)}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Basado en <strong className="text-slate-200">{totalKwh.toFixed(2)} kWh</strong> a{" "}
          <span className="text-emerald-400 font-semibold">
            {formatARS(breakdown.pricePerKwh)}/kWh
          </span>
        </p>
      </div>

      {/* Desglose explicativo */}
      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-3 text-xs space-y-1.5">
        <div className="flex justify-between text-slate-300">
          <span>Consumo puro estimado:</span>
          <span className="font-medium text-slate-100">{formatARS(breakdown.pureCost)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Impuestos (~{breakdown.taxPercentage}%):</span>
          <span className="text-amber-400/90 font-medium">
            +{formatARS(breakdown.estimatedTaxesAmount)}
          </span>
        </div>
        <div className="flex justify-between text-slate-200 pt-1 border-t border-slate-800/60 font-semibold">
          <span>Total Estimado:</span>
          <span className="text-emerald-400">{formatARS(breakdown.totalCostWithTaxes)}</span>
        </div>
      </div>

      {/* Nota legal */}
      <div className="flex items-start gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 leading-snug">
        <ShieldAlert className="size-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Aviso informativo:</strong> Tarifas consultadas en la base de datos de Supabase.
        </p>
      </div>
    </div>
  );
};