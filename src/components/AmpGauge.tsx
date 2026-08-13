import React from 'react';

interface AmpGaugeProps {
  Amps: number;
  maxAmps?: number;
  estimatedKw: number;
  statusText?: string;
}

export const AmpGauge: React.FC<AmpGaugeProps> = ({
  Amps = 14.6,
  maxAmps = 40,
  estimatedKw = 3.05,
  statusText = "Consumo moderado"
}) => {
  // Calculamos el porcentaje para la aguja o gráfico del arco
  const percentage = Math.min(Math.max((Amps / maxAmps) * 100, 0), 100);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl">
      <h2 className="text-slate-200 text-center text-base sm:text-lg font-semibold uppercase tracking-wider mb-4">
        Corriente en Vivo
      </h2>

      {/* Contenedor del Medidor */}
      <div className="relative flex flex-col items-center justify-center my-2">
        {/* SVG / Representación del Arco (Limpio, sin textos internos) */}
        <div className="relative w-64 h-36 flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
            {/* Fondo del Arco */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Arco de Color con Degradado */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="126"
              strokeDashoffset={126 - (126 * percentage) / 100}
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          {/* Cifra Principal Centrada (Sans-serif, legibilidad extrema) */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white tracking-tight leading-none">
                {Amps.toFixed(1)}
              </span>
              <span className="text-3xl font-bold text-amber-400">A</span>
            </div>
          </div>
        </div>

        {/* Limites 0A y 40A por FUERA del gráfico para evitar ruido visual */}
        <div className="w-64 flex justify-between px-2 mt-1 text-sm font-bold text-slate-300">
          <span>0 A</span>
          <span>{maxAmps} A</span>
        </div>
      </div>

      {/* Aclaración legible de capacidad del sistema */}
      <p className="text-center text-sm text-slate-300 mt-2 font-medium">
        Capacidad máxima contratada: <strong className="text-white font-semibold">{maxAmps}A</strong>
      </p>

      {/* Pill de Estado y Potencia */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold tracking-wide">
          {statusText}
        </span>
        <span className="text-slate-200 text-sm font-medium">
          Potencia estimada: <strong className="text-white text-base font-bold">{estimatedKw} kW</strong>
        </span>
      </div>
    </div>
  );
};