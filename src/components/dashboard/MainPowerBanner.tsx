import React from 'react';
import { Bolt, Home, ShieldAlert, Sparkles, Info } from 'lucide-react';
// Si tus archivos están en src/utils/, usa estas líneas:
import { friendlyTexts } from '@/utils/friendlyDictionary';
import { formatCurrency, formatEnergy } from '@/utils/formatters';

// Si tus archivos están dentro de src/lib/, descomenta estas dos líneas de abajo:
// import { friendlyTexts } from '../../lib/friendlyDictionary';
// import { formatCurrency, formatEnergy } from '../../lib/formatters';

interface MainPowerBannerProps {
  kwhToday?: number;
  costToday?: number;
  isPeakHour?: boolean;
  onOpenInfoModal?: () => void;
}

export const MainPowerBanner: React.FC<MainPowerBannerProps> = ({
  kwhToday = 26.4,
  costToday = 1850,
  isPeakHour = false,
  onOpenInfoModal,
}) => {
  const currentSlot = isPeakHour
    ? friendlyTexts.timeSlots.peak
    : friendlyTexts.timeSlots.valley;

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md">
      {/* Insignia de Franja Horaria (Hora de Ahorro / Hora Pico) */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isPeakHour
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {isPeakHour ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{currentSlot.label}</span>
        </div>

        {onOpenInfoModal && (
          <button
            onClick={onOpenInfoModal}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            title="Saber más sobre el consumo"
            aria-label="Información sobre la tarifa"
          >
            <Info className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Fila Principal: Métricas e Ilustración de la Casa */}
      <div className="flex items-center justify-between">
        {/* Lado Izquierdo: Icono + Valores */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            {/* Círculo turquesa claro con el Rayo */}
            <div className="w-10 h-10 rounded-full bg-[#E2F7F7] flex items-center justify-center shrink-0">
              <Bolt className="w-5 h-5 text-[#42C2C1] fill-[#42C2C1]" />
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">
                {formatEnergy(kwhToday)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {friendlyTexts.powerTodayBanner.title}
              </span>
            </div>
          </div>

          {/* Desglose equivalente en Pesos ($) */}
          <div className="mt-2 pl-1 flex items-baseline gap-1.5">
            <span className="text-xs text-slate-400">
              {friendlyTexts.powerTodayBanner.subtext}:
            </span>
            <span className="text-sm font-bold text-[#42C2C1]">
              {formatCurrency(costToday)}
            </span>
          </div>
        </div>

        {/* Lado Derecho: Ilustración de Casa */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F0FCFC] text-[#42C2C1] p-3">
          <Home className="w-10 h-10 stroke-[1.5]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#42C2C1] rounded-full animate-pulse border-2 border-white" />
        </div>
      </div>

      {/* Leyenda explicativa al pie */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>{currentSlot.tooltip}</span>
      </div>
    </div>
  );
};

export default MainPowerBanner;