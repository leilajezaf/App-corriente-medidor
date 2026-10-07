import React, { useState, useEffect } from 'react';

interface TelemetryData {
  currentAmps: number;
  voltage: number;
  powerWatts: number;
  maxLimitAmps: number;
  history: number[];
}

export default function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    currentAmps: 14.2,
    voltage: 220.5,
    powerWatts: 3131,
    maxLimitAmps: 32,
    history: [12.1, 13.5, 12.8, 14.0, 13.8, 14.5, 14.2],
  });

  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomAmps = Number((12 + Math.random() * 5).toFixed(1));
      const randomVoltage = Number((218 + Math.random() * 5).toFixed(1));
      const watts = Math.round(randomAmps * randomVoltage);

      setTelemetry((prev) => {
        const updatedHistory = [...prev.history.slice(1), randomAmps];
        return {
          currentAmps: randomAmps,
          voltage: randomVoltage,
          powerWatts: watts,
          maxLimitAmps: 32,
          history: updatedHistory,
        };
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isLive]);

  // Cálculo del porcentaje y ángulo del dial HUD
  const loadPercentage = Math.min(100, Math.max(0, (telemetry.currentAmps / telemetry.maxLimitAmps) * 100));
  const angle = -135 + (loadPercentage / 100) * 270;

  // Generación de la línea del gráfico fluido en SVG
  const graphPoints = telemetry.history
    .map((val, idx) => {
      const x = (idx / (telemetry.history.length - 1)) * 260;
      const y = 50 - ((val - 8) / 12) * 40;
      return `${x},${Math.max(5, Math.min(55, y))}`;
    })
    .join(' ');

  return (
    <div className="min-h-screen bg-[#070b12] text-cyan-50 font-sans flex flex-col items-center justify-center p-4 md:p-8 select-none antialiased">
      
      {/* MARCO CONTENEDOR HUD */}
      <div className="w-full max-w-4xl bg-[#0d1424]/90 border border-cyan-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(6,182,212,0.15)] relative overflow-hidden">
        
        {/* LÍNEA DE ESTADO SUPERIOR */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)] animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-xs font-mono tracking-wider text-cyan-400/90 uppercase font-semibold">
              ESP8266 // REAL-TIME MONITORING
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              STATUS: STABLE
            </span>

            <button
              onClick={() => setIsLive(!isLive)}
              className="text-xs font-mono text-cyan-400/70 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400 px-3 py-1 rounded transition-all uppercase"
            >
              {isLive ? 'PAUSE' : 'RESUME'}
            </button>
          </div>
        </div>

        {/* REJILLA PRINCIPAL DE LECTURA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* DIAL TECNOLÓGICO ESTILO HUD */}
          <div className="md:col-span-6 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[280px] relative">
              <svg viewBox="0 0 200 170" className="w-full h-auto overflow-visible">
                <defs>
                  {/* Gradiente cian neón */}
                  <linearGradient id="hudArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>

                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Fondo del dial (Arco Segmentado) */}
                <path
                  d="M 30 140 A 70 70 0 1 1 170 140"
                  fill="none"
                  stroke="#101f38"
                  strokeWidth="8"
                  strokeDasharray="4 2"
                />

                {/* Arco Activo con Brillo HUD */}
                <path
                  d="M 30 140 A 70 70 0 1 1 170 140"
                  fill="none"
                  stroke="url(#hudArcGradient)"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * (loadPercentage / 100))}
                  filter="url(#glow)"
                  className="transition-all duration-700 ease-out"
                />

                {/* Marcas de escala (Ticks HUD) */}
                {[0, 8, 16, 24, 32].map((val, idx) => {
                  const tickAngle = -135 + (idx / 4) * 270;
                  const rad = (tickAngle * Math.PI) / 180;
                  const x1 = 100 + 58 * Math.cos(rad);
                  const y1 = 140 + 58 * Math.sin(rad);
                  const x2 = 100 + 52 * Math.cos(rad);
                  const y2 = 140 + 52 * Math.sin(rad);

                  const textX = 100 + 44 * Math.cos(rad);
                  const textY = 140 + 44 * Math.sin(rad) + 3;

                  return (
                    <g key={val}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                      <text x={textX} y={textY} className="text-[7px] font-mono fill-cyan-300/70" textAnchor="middle">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Aguja / Marcador HUD */}
                <g transform={`rotate(${angle}, 100, 140)`} className="transition-transform duration-700 ease-out">
                  <line x1="100" y1="140" x2="100" y2="72" stroke="#06b6d4" strokeWidth="2" filter="url(#glow)" />
                  <circle cx="100" cy="72" r="3" fill="#ffffff" />
                </g>

                {/* Centro del medidor */}
                <circle cx="100" cy="140" r="5" fill="#0d1424" stroke="#06b6d4" strokeWidth="2" />
              </svg>

              {/* LECTURA CENTRAL DE AMPERIOS */}
              <div className="text-center -mt-10">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-mono font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    {telemetry.currentAmps.toFixed(1)}
                  </span>
                  <span className="text-2xl font-mono font-semibold text-cyan-400">A</span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-300/60 uppercase block mt-1">
                  CURRENT LOAD
                </span>
              </div>
            </div>
          </div>

          {/* LECTURAS CIBERNÉTICAS Y GRÁFICO */}
          <div className="md:col-span-6 flex flex-col space-y-6">
            
            {/* VALORES DE TENSIÓN Y POTENCIA */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tensión */}
              <div className="bg-[#0a0f1d] border border-cyan-500/20 p-4 rounded-xl">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400/60 uppercase block mb-1">
                  VOLTAGE
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-white">
                    {telemetry.voltage.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">V</span>
                </div>
              </div>

              {/* Potencia */}
              <div className="bg-[#0a0f1d] border border-cyan-500/20 p-4 rounded-xl">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400/60 uppercase block mb-1">
                  POWER
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-white">
                    {telemetry.powerWatts}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">W</span>
                </div>
              </div>
            </div>

            {/* GRÁFICO DE ONDA EN TIEMPO REAL */}
            <div className="bg-[#0a0f1d] border border-cyan-500/20 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400/60 uppercase">
                  WAVEFORM HISTORY
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {telemetry.currentAmps} A NOW
                </span>
              </div>

              <div className="w-full h-16 relative flex items-center">
                <svg viewBox="0 0 260 60" className="w-full h-full overflow-visible">
                  {/* Rejilla suave de fondo */}
                  <line x1="0" y1="15" x2="260" y2="15" stroke="#101f38" strokeDasharray="2 2" />
                  <line x1="0" y1="35" x2="260" y2="35" stroke="#101f38" strokeDasharray="2 2" />

                  {/* Onda de consumo */}
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    points={graphPoints}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="transition-all duration-700 ease-linear"
                  />
                </svg>
              </div>
            </div>

            {/* PORCENTAJE DE CAPACIDAD */}
            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-cyan-300/60">GRID CAPACITY USAGE:</span>
              <span className="text-cyan-400 font-bold">{loadPercentage.toFixed(0)}% OF 32A</span>
            </div>

          </div>

        </div>

        {/* PIE DE PÁGINA TECNOLÓGICO */}
        <div className="mt-8 pt-4 border-t border-cyan-500/20 flex justify-between items-center text-[10px] font-mono text-cyan-300/50">
          <span>HARDWARE: SCT-013 + ADC ADS1115</span>
          <span>PROTOCOL: HTTP / JSON POLLING</span>
        </div>

      </div>

    </div>
  );
}