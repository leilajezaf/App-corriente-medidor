import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AmpGauge } from "@/components/AmpGauge";
import { amperesToKw, loadColor, todayCurve, calculateEnergyCost, formatARS } from "@/lib/energy";
import { Leaf, Flame, Gauge, Wallet, Activity, AlertTriangle } from "lucide-react";
import { CostEstimateCard } from "../components/CostEstimateCard";

const MAX_AMPS = 40;

export default function Home() {
  const data = useMemo(() => todayCurve(), []);
  const [hour] = useState(() => new Date().getHours());

  // 1. Tarifa elegida en Ajustes ($69.76 por defecto)
  const userTariff = Number(localStorage.getItem("user_tariff")) || 69.76;
  
  // Lecturas acumuladas hasta la hora actual
  const current = data[Math.min(hour, 23)]!;
  const historicalSlice = useMemo(() => data.slice(0, hour + 1), [data, hour]);
  
  // Total de kWh consumidos
  const kwhToday = historicalSlice.reduce((acc, r) => acc + r.kwh, 0);

  // Gasto del día
  const costoHoy = calculateEnergyCost(kwhToday, userTariff);
  const textoGasto = formatARS(costoHoy);

  // Promedio de corriente
  const avgAmps = useMemo(() => {
    if (historicalSlice.length === 0) return 0;
    const totalAmps = historicalSlice.reduce((acc, r) => acc + r.amps, 0);
    return totalAmps / historicalSlice.length;
  }, [historicalSlice]);

  const peak = data.reduce((a, b) => (b.amps > a.amps ? b : a));
  const ratio = current.amps / MAX_AMPS;

  // Evaluamos si el consumo actual supera el 80%
  const isHighLoad = ratio >= 0.8;

  // Últimas 5 mediciones
  const recentReadings = useMemo(() => {
    return [...historicalSlice].reverse().slice(0, 5);
  }, [historicalSlice]);

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-10 font-sans tracking-tight">
      
      {/* 1. SECCIÓN PRINCIPAL: MANÓMETRO (MÁXIMA JERARQUÍA EN MÓVIL) */}
      <section
        className={`panel flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl relative transition-all duration-500 border ${
          isHighLoad
            ? "bg-red-950/40 border-red-500/80 shadow-[0_0_35px_rgba(239,68,68,0.3)]"
            : "bg-slate-900/95 border-slate-800 shadow-xl"
        }`}
      >
        {/* En Vivo Indicator */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Medición en Vivo
            </span>
          </div>

          {isHighLoad && (
            <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/50 text-red-300 text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-full animate-pulse">
              <AlertTriangle className="size-4 shrink-0 text-red-400" />
              <span>Consumo Elevado</span>
            </div>
          )}
        </div>

        {/* Velocímetro Medidor */}
        <div className="w-full my-2 flex justify-center scale-105 sm:scale-110">
          <AmpGauge 
            Amps={current.amps} 
            maxAmps={MAX_AMPS} 
            estimatedKw={Number(amperesToKw(current.amps).toFixed(2))}
          />
        </div>
      </section>

      {/* 2. TARJETAS DE MÉTRICAS CLAVE (DESPLIEGUE LINEAL DE 1 COLUMNA) */}
      <section className="space-y-3">
        <StatLinear
          icon={<Wallet className="size-6 text-emerald-400" />}
          label="Gasto Estimado de Hoy"
          value={textoGasto}
          hint="Calculado con tu tarifa guardada"
          isPrimary={true}
        />

        <StatLinear
          icon={<Leaf className="size-6 text-emerald-400" />}
          label="Consumo Total de Hoy"
          value={`${kwhToday.toFixed(1)} kWh`}
          hint="Acumulado desde las 00:00 hs"
          color={loadColor(ratio)}
        />

        <StatLinear
          icon={<Flame className="size-6 text-amber-400" />}
          label="Pico de Corriente Máximo"
          value={`${peak.amps.toFixed(1)} A`}
          hint={`Pico registrado a las ${peak.label} hs`}
          color={loadColor(peak.amps / MAX_AMPS)}
        />

        <StatLinear
          icon={<Gauge className="size-6 text-sky-400" />}
          label="Promedio de Corriente"
          value={`${avgAmps.toFixed(1)} A`}
          hint="Promedio general del día"
        />
      </section>

      {/* 3. TARJETA DE GASTO ESTIMADO Y DETALLES */}
      <section>
        <CostEstimateCard totalKwh={kwhToday} />
      </section>

      {/* 4. GRÁFICO HISTÓRICO Y CURVA */}
      <section className="panel p-5 sm:p-6 bg-slate-900/95 rounded-3xl border border-slate-800 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="size-6 text-amber-500" />
            <h2 className="text-lg font-extrabold text-slate-100">
              Curva de Consumo Diario
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
            Amperes / hora
          </span>
        </div>
        
        <div className="h-64 w-full">
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
                tick={{ fontSize: 13, fill: "#cbd5e1", fontWeight: 600 }} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                interval={3} 
                dy={6}
              />
              
              <YAxis 
                tick={{ fontSize: 13, fill: "#cbd5e1", fontWeight: 600 }} 
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
                  fontSize: "15px",
                  fontWeight: "bold",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                }}
                formatter={(value: any) => [`${value} A`, "Corriente"]}
              />
              <Area
                type="monotone"
                dataKey="amps"
                stroke="#f59e0b"
                strokeWidth={3.5}
                fill="url(#todayFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 5. ÚLTIMAS MEDICIONES REGISTRADAS */}
      <section className="panel p-5 sm:p-6 bg-slate-900/95 rounded-3xl border border-slate-800 shadow-lg">
        <h3 className="text-base font-extrabold text-slate-100 mb-4 flex items-center gap-2">
          <span>⏱️</span> Últimas lecturas registradas
        </h3>
        <div className="divide-y divide-slate-800">
          {recentReadings.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-base">
              <span className="text-slate-300 font-bold tabular-nums">{item.label} hs</span>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-slate-100 tabular-nums text-lg">
                  {item.amps.toFixed(1)} A
                </span>
                <span className="text-xs text-slate-400 font-medium tabular-nums bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
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

// COMPONENTE DE MÉTRICA EN FORMATO FILA ÚNICA (FACILIDAD DE LECTURA)
function StatLinear({
  icon,
  label,
  value,
  hint,
  color,
  isPrimary = false
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  color?: string;
  isPrimary?: boolean;
}) {
  return (
    <div
      className={`panel flex items-center justify-between p-4 sm:p-5 rounded-2xl transition-all ${
        isPrimary
          ? "bg-slate-900 border-2 border-emerald-500/60 shadow-lg shadow-emerald-950/20"
          : "bg-slate-900/95 border border-slate-800"
      }`}
    >
      <div className="space-y-1 pr-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
          {icon}
          <span>{label}</span>
        </div>
        <p className="text-xs text-slate-400 font-medium">{hint}</p>
      </div>

      <div className="text-right shrink-0">
        <span
          className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${
            isPrimary ? "text-emerald-400" : ""
          }`}
          style={color && !isPrimary ? { color } : undefined}
        >
          {value}
        </span>
      </div>
    </div>
  );
}