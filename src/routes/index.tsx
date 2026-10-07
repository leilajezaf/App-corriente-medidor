import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AmpGauge } from "@/components/AmpGauge";
import { amperesToKw, todayCurve, calculateEnergyCost } from "@/lib/energy";
import { Activity, AlertTriangle } from "lucide-react";
import { CostEstimateCard } from "@/components/CostEstimateCard";

// Componentes del Nuevo Rediseño UX/UI
import { HeaderUser } from "../components/common/HeaderUser";
import { MainPowerBanner } from "../components/dashboard/MainPowerBanner";
import { ApplianceTabs } from "../components/dashboard/ApplianceTabs";
import { DeviceCard, DeviceData } from "../components/dashboard/DeviceCard";

const MAX_AMPS = 40;

// Lista inicial de artefactos para discriminación de gastos
const INITIAL_DEVICES: DeviceData[] = [
  { id: "1", name: 'TV Smart', category: 'entretenimiento', type: 'tv', status: 'OPENED', isActive: true, powerWatts: 120, costPerHour: 15 },
  { id: "2", name: 'Router WiFi', category: 'entretenimiento', type: 'router', status: 'CLOSED', isActive: false, powerWatts: 12, costPerHour: 1.5 },
  { id: "3", name: 'Lámpara LED', category: 'iluminacion', type: 'lamp', status: 'CLOSED', isActive: false, powerWatts: 9, costPerHour: 1 },
  { id: "4", name: 'Aire Acond.', category: 'climatizacion', type: 'ac', status: 'OPENED', isActive: true, powerWatts: 1800, costPerHour: 220, subtitle: '23 °C' },
  { id: "5", name: 'Heladera Inverter', category: 'cocina', type: 'fridge', status: 'OPENED', isActive: true, powerWatts: 150, costPerHour: 18 },
  { id: "6", name: 'Lavarropas', category: 'lavado', type: 'washer', status: 'CLOSED', isActive: false, powerWatts: 500, costPerHour: 60 },
];

export default function Home() {
  const data = useMemo(() => todayCurve(), []);
  const [hour] = useState(() => new Date().getHours());

  // Estado del Filtro de Categoría y Artefactos
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [devices, setDevices] = useState<DeviceData[]>(INITIAL_DEVICES);

  // 1. Tarifa elegida en Ajustes ($69.76 por defecto)
  const userTariff = Number(localStorage.getItem("user_tariff")) || 69.76;
  
  // Lecturas acumuladas hasta la hora actual
  const current = data[Math.min(hour, 23)]!;
  const historicalSlice = useMemo(() => data.slice(0, hour + 1), [data, hour]);
  
  // Total de kWh consumidos y gasto del día
  const kwhToday = historicalSlice.reduce((acc, r) => acc + r.kwh, 0);
  const costoHoy = calculateEnergyCost(kwhToday, userTariff);

  // Determinar si estamos en Hora Pico (ej. de 18 a 22 hs)
  const isPeakHour = hour >= 18 && hour < 22;

  // Evaluamos si el consumo actual supera el 80%
  const ratio = current.amps / MAX_AMPS;
  const isHighLoad = ratio >= 0.8;

  // Últimas 5 mediciones registradas
  const recentReadings = useMemo(() => {
    return [...historicalSlice].reverse().slice(0, 5);
  }, [historicalSlice]);

  // Manejar encendido / apagado de tarjetas de electrodomésticos
  const handleToggleDevice = (id: string, newActive: boolean) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id
          ? { ...device, isActive: newActive, status: newActive ? 'OPENED' : 'CLOSED' }
          : device
      )
    );
  };

  // Filtrado de electrodomésticos según la pestaña seleccionada
  const filteredDevices = activeCategory === 'todos'
    ? devices
    : devices.filter((d) => d.category === activeCategory);

  return (
    <div className="max-w-md mx-auto space-y-5 pb-10 font-sans tracking-tight px-3 sm:px-0">
      
      {/* 1. CABECERA DE USUARIO */}
      <HeaderUser userName="Leila Fernández" />

      {/* 2. BANNER PRINCIPAL DE CONSUMO DIARIO EN TARJETA BLANCA/TURQUESA */}
      <MainPowerBanner
        kwhToday={kwhToday}
        costToday={costoHoy}
        isPeakHour={isPeakHour}
      />

      {/* 3. SECCIÓN DE DISCRIMINACIÓN POR ELECTRODOMÉSTICOS */}
      <section className="pt-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-slate-800">
            Control de Artefactos
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {filteredDevices.length} dispositivos
          </span>
        </div>

        {/* Pestañas de filtrado por categoría de artefactos */}
        <ApplianceTabs
          activeCategoryId={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Grid de tarjetas en 2 columnas (Fiel a la imagen) */}
        <div className="grid grid-cols-2 gap-3.5 mt-2">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={handleToggleDevice}
            />
          ))}
        </div>
      </section>

      {/* 4. MEDIDOR EN VIVO CON ALERTA DE CONSUMO ELEVADO */}
      <section
        className={`p-6 rounded-3xl relative transition-all duration-500 border ${
          isHighLoad
            ? "bg-red-950/40 border-red-500/80 shadow-[0_0_35px_rgba(239,68,68,0.3)]"
            : "bg-slate-900/95 border-slate-800 shadow-xl"
        }`}
      >
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Medición Arduino en Vivo
            </span>
          </div>

          {isHighLoad && (
            <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-extrabold px-3 py-1 rounded-full animate-pulse">
              <AlertTriangle className="size-3.5 shrink-0 text-red-400" />
              <span>Carga Alta</span>
            </div>
          )}
        </div>

        {/* Velocímetro Medidor */}
        <div className="w-full my-2 flex justify-center">
          <AmpGauge 
            Amps={current.amps} 
            maxAmps={MAX_AMPS} 
            estimatedKw={Number(amperesToKw(current.amps).toFixed(2))}
          />
        </div>
      </section>

      {/* 5. TARJETA DE ESTIMACIÓN Y DETALLES */}
      <section>
        <CostEstimateCard totalKwh={kwhToday} />
      </section>

      {/* 6. GRÁFICO HISTÓRICO Y CURVA */}
      <section className="p-5 bg-slate-900/95 rounded-3xl border border-slate-800 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-amber-500" />
            <h2 className="text-sm font-extrabold text-slate-100">
              Curva de Consumo Diario
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
            Amperes / hora
          </span>
        </div>
        
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -14, right: 10, top: 10, bottom: 4 }}>
              <defs>
                <linearGradient id="todayFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="60%" stopColor="#0ea5e9" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: "#cbd5e1", fontWeight: 600 }} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                interval={3} 
                dy={6}
              />
              
              <YAxis 
                tick={{ fontSize: 11, fill: "#cbd5e1", fontWeight: 600 }} 
                tickLine={false}
                axisLine={false}
                dx={-2}
              />
              
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "16px",
                  color: "#f8fafc",
                  fontSize: "13px",
                  fontWeight: "bold",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                }}
                formatter={(value: any) => [`${value} A`, "Corriente"]}
              />
              <Area
                type="monotone"
                dataKey="amps"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#todayFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 7. ÚLTIMAS MEDICIONES REGISTRADAS */}
      <section className="p-5 bg-slate-900/95 rounded-3xl border border-slate-800 shadow-lg">
        <h3 className="text-sm font-extrabold text-slate-100 mb-3 flex items-center gap-2">
          <span>⏱️</span> Últimas lecturas registradas
        </h3>
        <div className="divide-y divide-slate-800">
          {recentReadings.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
              <span className="text-slate-300 font-bold tabular-nums">{item.label} hs</span>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-slate-100 tabular-nums text-base">
                  {item.amps.toFixed(1)} A
                </span>
                <span className="text-[11px] text-slate-400 font-medium tabular-nums bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                  {amperesToKw(item.amps).toFixed(2)} kW
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}