import React, { useState, useEffect } from 'react';

// --- INTERFACES & TYPES (TypeScript) ---
interface TelemetryData {
  currentAmps: number;
  voltage: number;
  powerWatts: number;
  maxLimitAmps: number;
  estimatedCost: number;
}

type TimeRange = 'HOY' | 'SEMANA' | 'MES';

interface HourlyDataItem {
  hour: string;
  watts: number;
  isPeak: boolean;
}

interface GaugeDialProps {
  value: number;
  max: number;
  unit: string;
  percentage: number;
}

interface MetricCardProps {
  label: string;
  value: string;
  status: string;
  icon: string;
}

interface EnergyChartsProps {
  timeRange: TimeRange;
}

interface ApplianceEstimatorProps {
  currentWatts: number;
}

// --- COMPONENTE 1: Tacómetro / Gauge Semicircular ---
const GaugeDial: React.FC<GaugeDialProps> = ({ value, max, unit, percentage }) => {
  const getGlowColor = (): string => {
    if (percentage < 50) return '#00E676'; // Verde
    if (percentage < 80) return '#FFB300'; // Amarillo
    return '#FF3D00'; // Rojo
  };

  const strokeDashoffset = 251.2 - (251.2 * (percentage / 100));

  return (
    <div className="relative w-64 h-40 flex items-center justify-center">
      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
        {/* Fondo del Arco */}
        <path
          d="M 20,50 A 30,30 0 1,1 80,50"
          fill="none"
          stroke="#2A2E3B"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Arco de Progreso Dinámico */}
        <path
          d="M 20,50 A 30,30 0 1,1 80,50"
          fill="none"
          stroke={getGlowColor()}
          strokeWidth="8"
          strokeDasharray="251.2"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0px 0px 8px ${getGlowColor()})` }}
        />
      </svg>

      {/* Lectura numérica central */}
      <div className="absolute top-10 text-center flex flex-col items-center">
        <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
          Corriente Real
        </span>
        <span className="text-4xl font-black tracking-tight text-white mt-1">
          {value.toFixed(1)} <span className="text-xl text-cyan-400 font-bold">{unit}</span>
        </span>
        <span className="text-[11px] text-gray-500 mt-1">
          Máx Térmica: {max} {unit}
        </span>
      </div>
    </div>
  );
};

// --- COMPONENTE 2: Tarjeta de Métrica ---
const MetricCard: React.FC<MetricCardProps> = ({ label, value, status, icon }) => {
  return (
    <div className="bg-[#181b23] border border-white/5 rounded-2xl p-3 flex flex-col justify-between hover:border-white/10 transition-all">
      <div className="flex justify-between items-center text-gray-400">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-base">{icon}</span>
      </div>
      <div className="mt-2">
        <p className="text-lg font-extrabold text-white">{value}</p>
        <p className="text-[10px] text-cyan-400 font-medium mt-0.5">{status}</p>
      </div>
    </div>
  );
};

// --- COMPONENTE 3: Gráficos de Consumo Discriminados ---
const EnergyCharts: React.FC<EnergyChartsProps> = ({ timeRange }) => {
  const chartData: Record<TimeRange, HourlyDataItem[]> = {
    HOY: [
      { hour: '08:00', watts: 1200, isPeak: false },
      { hour: '12:00', watts: 2100, isPeak: false },
      { hour: '16:00', watts: 1800, isPeak: false },
      { hour: '20:00', watts: 4200, isPeak: true },
      { hour: '23:00', watts: 2800, isPeak: true }
    ],
    SEMANA: [
      { hour: 'Lun', watts: 15000, isPeak: false },
      { hour: 'Mar', watts: 18000, isPeak: false },
      { hour: 'Mié', watts: 22000, isPeak: true },
      { hour: 'Jue', watts: 17000, isPeak: false },
      { hour: 'Vie', watts: 25000, isPeak: true }
    ],
    MES: [
      { hour: 'Sem 1', watts: 95000, isPeak: false },
      { hour: 'Sem 2', watts: 110000, isPeak: false },
      { hour: 'Sem 3', watts: 140000, isPeak: true },
      { hour: 'Sem 4', watts: 105000, isPeak: false }
    ]
  };

  const currentData = chartData[timeRange] || chartData.HOY;
  const maxWatt = Math.max(...currentData.map(d => d.watts));

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-end justify-between h-32 gap-2 pt-4 px-2">
        {currentData.map((item, idx) => {
          const heightPercent = Math.round((item.watts / maxWatt) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 border border-white/20 text-[10px] text-white px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity z-10 whitespace-nowrap">
                {item.watts} W
              </div>

              <div className="w-full bg-white/5 rounded-t-lg h-full flex items-end overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    item.isPeak
                      ? 'bg-gradient-to-t from-orange-600 to-amber-400'
                      : 'bg-gradient-to-t from-cyan-600 to-teal-400'
                  }`}
                />
              </div>
              <span className="text-[10px] text-gray-400">{item.hour}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 text-[11px] text-gray-400 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
          Consumo Habitual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          Pico de Consumo
        </span>
      </div>
    </div>
  );
};

// --- COMPONENTE 4: Diagnóstico Visual ---
const ApplianceEstimator: React.FC<ApplianceEstimatorProps> = ({ currentWatts }) => {
  const getEstimates = (watts: number): string => {
    if (watts < 300) return 'Luces LED, Router y dispositivos en standby.';
    if (watts < 1500) return 'Heladera, Televisor y Computadora.';
    if (watts < 3000) return 'Lavarropas, Microondas o Plancha encendida.';
    return 'Consumo Muy Alto: Probable Aire Acondicionado o Pava Eléctrica.';
  };

  return (
    <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-500/20 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div>
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            Diagnóstico Visual Inteligente
          </h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            {getEstimates(currentWatts)}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (App.tsx) ---
export default function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    currentAmps: 12.4,
    voltage: 220,
    powerWatts: 2728,
    maxLimitAmps: 25,
    estimatedCost: 12500
  });

  const [timeRange, setTimeRange] = useState<TimeRange>('HOY');
  const [isLive, setIsLive] = useState<boolean>(true);

  // Simulación de recepción de datos del ESP8266 en tiempo real
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomAmps = Number((8 + Math.random() * 12).toFixed(1));
      const calculatedWatts = Math.round(randomAmps * telemetry.voltage);

      setTelemetry(prev => ({
        ...prev,
        currentAmps: randomAmps,
        powerWatts: calculatedWatts
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, telemetry.voltage]);

  const loadPercentage = Math.min(
    Math.round((telemetry.currentAmps / telemetry.maxLimitAmps) * 100),
    100
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-4 max-w-md mx-auto space-y-6 pb-12 font-sans">
      {/* Header Top Bar */}
      <header className="flex justify-between items-center border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Mi Medidor</h1>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
              }`}
            ></span>
            {isLive ? 'ESP8266 Conectado' : 'Pausado'}
          </p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-medium text-gray-300"
        >
          {isLive ? '⏸️ Pausar' : '▶️ En Vivo'}
        </button>
      </header>

      {/* Tacómetro / Gauge Semicircular */}
      <section className="bg-[#181b23] border border-white/5 rounded-3xl p-5 shadow-2xl flex flex-col items-center relative overflow-hidden">
        <GaugeDial
          value={telemetry.currentAmps}
          max={telemetry.maxLimitAmps}
          unit="A"
          percentage={loadPercentage}
        />

        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-300">
            Carga de Instalación:{' '}
            <span
              className={
                loadPercentage > 80
                  ? 'text-red-400 font-bold'
                  : 'text-emerald-400 font-bold'
              }
            >
              {loadPercentage}%
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {loadPercentage < 50
              ? '🟢 Consumo bajo y seguro'
              : loadPercentage < 80
              ? '🟡 Consumo moderado'
              : '🔴 Precaución: Carga elevada'}
          </p>
        </div>
      </section>

      {/* Grid de Métricas Secundarias 2x2 */}
      <section className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Tensión Red"
          value={`${telemetry.voltage} V`}
          status="220V Nominal"
          icon="⚡"
        />
        <MetricCard
          label="Potencia Activa"
          value={`${(telemetry.powerWatts / 1000).toFixed(2)} kW`}
          status={`${telemetry.powerWatts} W`}
          icon="🔌"
        />
        <MetricCard
          label="Gasto Estimado"
          value={`$${telemetry.estimatedCost}`}
          status="Proyección Mes"
          icon="💡"
        />
        <MetricCard
          label="Térmica Tablero"
          value={`${telemetry.maxLimitAmps} A`}
          status="Límite Máximo"
          icon="🛡️"
        />
      </section>

      {/* Pestañas y Gráficos Discriminados */}
      <section className="bg-[#181b23] border border-white/5 rounded-3xl p-4 space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <h2 className="text-sm font-semibold text-gray-200">Historial de Consumo</h2>
          <div className="flex bg-white/5 p-1 rounded-xl text-xs gap-1">
            {(['HOY', 'SEMANA', 'MES'] as TimeRange[]).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-cyan-500 text-black font-bold shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <EnergyCharts timeRange={timeRange} />
      </section>

      {/* Estimador de Electrodomésticos */}
      <ApplianceEstimator currentWatts={telemetry.powerWatts} />
    </div>
  );
}