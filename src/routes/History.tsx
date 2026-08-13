import { useState } from "react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from "recharts";
import { Calendar, Filter, Zap, TrendingUp, AlertTriangle } from "lucide-react";

type ChartItem = {
  time?: string;
  day?: string;
  month?: string;
  amps?: number;
  peakAmps?: number;
  kwh?: number;
  totalKwh?: number;
};

// 1. Datos por Hora (Hoy)
const hourlyData: ChartItem[] = [
  { time: "00:00", amps: 4.2, kwh: 0.9 },
  { time: "03:00", amps: 3.1, kwh: 0.7 },
  { time: "06:00", amps: 8.5, kwh: 1.8 },
  { time: "09:00", amps: 18.4, kwh: 4.0 },
  { time: "12:00", amps: 24.1, kwh: 5.3 },
  { time: "15:00", amps: 15.2, kwh: 3.3 },
  { time: "18:00", amps: 31.8, kwh: 7.0 },
  { time: "21:00", amps: 22.0, kwh: 4.8 },
];

// 2. Datos por Día (Esta Semana)
const weeklyData: ChartItem[] = [
  { day: "Lun", peakAmps: 22.4, totalKwh: 18.2 },
  { day: "Mar", peakAmps: 28.1, totalKwh: 22.5 },
  { day: "Mié", peakAmps: 31.8, totalKwh: 26.8 },
  { day: "Jue", peakAmps: 19.5, totalKwh: 16.1 },
  { day: "Vie", peakAmps: 25.0, totalKwh: 21.4 },
  { day: "Sáb", peakAmps: 35.2, totalKwh: 30.0 },
  { day: "Dom", peakAmps: 18.0, totalKwh: 15.2 },
];

// 3. Datos por Semana/Mes (Este Mes)
const monthlyData: ChartItem[] = [
  { month: "Semana 1", peakAmps: 32.1, totalKwh: 145.0 },
  { month: "Semana 2", peakAmps: 29.4, totalKwh: 132.8 },
  { month: "Semana 3", peakAmps: 36.5, totalKwh: 158.2 },
  { month: "Semana 4", peakAmps: 24.8, totalKwh: 110.5 },
];

export default function History() {
  const [range, setRange] = useState<"today" | "week" | "month">("today");

  // Helper para obtener el conjunto de datos activo según el filtro elegido
  const getActiveData = () => {
    switch (range) {
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      case "today":
      default:
        return hourlyData;
    }
  };

  const activeData = getActiveData();

  // Helper para determinar la clave del eje X (time, day o month)
  const getXAxisKey = () => {
    if (range === "today") return "time";
    if (range === "week") return "day";
    return "month";
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Barra de Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="size-5 text-amber-400" />
            Historial de Consumo
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Análisis de picos de corriente y acumulado de energía.
          </p>
        </div>

        {/* Filtros de Rango (Hoy, Esta Semana, Este Mes) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <Filter className="size-4 text-slate-400 ml-2 mr-1" />
          
          <button
            onClick={() => setRange("today")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              range === "today"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            Hoy (24h)
          </button>

          <button
            onClick={() => setRange("week")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              range === "week"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            Esta Semana
          </button>

          <button
            onClick={() => setRange("month")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              range === "month"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            Este Mes
          </button>
        </div>
      </div>

      {/* Gráfico 1: Picos de Corriente (Amperes) */}
      <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-amber-400 shrink-0" />
            <h2 className="text-base font-bold text-slate-100">
              Picos de Corriente (Amperes)
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap pl-7 sm:pl-0">
              Límite térmico: <strong className="text-slate-300">32 A</strong>
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activeData as any[]}
              margin={{ left: -10, right: 10, top: 10, bottom: 0 }}
            >
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={getXAxisKey()} 
                tick={{ fontSize: 12, fill: "#cbd5e1" }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#cbd5e1" }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#f8fafc",
                }}
                formatter={(val: any) => [`${val} A`, "Corriente"]}
              />
              <ReferenceLine y={32} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '32A Máx', fill: '#ef4444', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey={range === "today" ? "amps" : "peakAmps"}
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 7, fill: '#fbbf24' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Gráfico 2: Barras de Consumo (kWh) */}
      <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="size-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-100">
            Consumo Acumulado (kWh)
          </h2>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeData as any[]}
              margin={{ left: -10, right: 10, top: 10, bottom: 0 }}
            >
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={getXAxisKey()} 
                tick={{ fontSize: 12, fill: "#cbd5e1" }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#cbd5e1" }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#f8fafc",
                }}
                formatter={(val: any) => [`${val} kWh`, "Energía"]}
              />
              <Bar 
                dataKey={range === "today" ? "kwh" : "totalKwh"} 
                fill="#10b981" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Registro en Tabla */}
      <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 mb-4">Detalle de Mediciones</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Periodo</th>
                <th className="py-3 px-4">Corriente Máx</th>
                <th className="py-3 px-4">Consumo</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {activeData.map((row: any, i) => {
                const currentAmps = row.amps ?? row.peakAmps ?? 0;
                const currentKwh = row.kwh ?? row.totalKwh ?? 0;
                const periodLabel = row.time || row.day || row.month;
                const isHigh = currentAmps > 30;

                return (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-100">{periodLabel}</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{currentAmps.toFixed(1)} A</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">{currentKwh.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">
                      {isHigh ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                          <AlertTriangle className="size-3" /> Carga Alta
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}