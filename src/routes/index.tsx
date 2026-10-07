import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { todayCurve, calculateEnergyCost } from "@/lib/energy";
import { Activity } from "lucide-react";

import { HeaderUser } from "@/components/common/HeaderUser";
import { MainPowerBanner } from "@/components/dashboard/MainPowerBanner";
import { ApplianceTabs } from "@/components/dashboard/ApplianceTabs";
import { DeviceCard, DeviceData } from "@/components/dashboard/DeviceCard";
import { DeviceDetailModal } from "@/components/dashboard/DeviceDetailModal";

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

  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [devices, setDevices] = useState<DeviceData[]>(INITIAL_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);

  const userTariff = Number(localStorage.getItem("user_tariff")) || 69.76;
  
  const historicalSlice = useMemo(() => data.slice(0, hour + 1), [data, hour]);
  const kwhToday = historicalSlice.reduce((acc, r) => acc + r.kwh, 0);
  const costoHoy = calculateEnergyCost(kwhToday, userTariff);

  const isPeakHour = hour >= 18 && hour < 22;

  const handleToggleDevice = (id: string, newActive: boolean) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id
          ? { ...device, isActive: newActive, status: newActive ? 'OPENED' : 'CLOSED' }
          : device
      )
    );
  };

  const filteredDevices = activeCategory === 'todos'
    ? devices
    : devices.filter((d) => d.category === activeCategory);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12 font-sans tracking-tight px-3 sm:px-0">
      
      {/* 1. CABECERA DE USUARIO */}
      <HeaderUser userName="Leila Fernández" />

      {/* 2. BANNER PRINCIPAL DE CONSUMO DIARIO */}
      <MainPowerBanner
        kwhToday={kwhToday}
        costToday={costoHoy}
        isPeakHour={isPeakHour}
      />

      {/* 3. CONTROL Y DISCRIMINACIÓN DE ARTEFACTOS */}
      <section className="pt-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-slate-800">
            Control de Artefactos
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {filteredDevices.length} dispositivos
          </span>
        </div>

        <ApplianceTabs
          activeCategoryId={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <div className="grid grid-cols-2 gap-3.5 mt-2">
          {filteredDevices.map((device) => (
            <div key={device.id} onClick={() => setSelectedDevice(device)} className="cursor-pointer">
              <DeviceCard
                device={device}
                onToggle={(id, active) => {
                  handleToggleDevice(id, active);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. CURVA DE CONSUMO DIARIO */}
      <section className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-[#42C2C1]" />
            <h2 className="text-sm font-bold text-slate-800">
              Curva de Consumo Diario
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            Amperes / hora
          </span>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="todayFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#42C2C1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#42C2C1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
              
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 10, fill: "#94A3B8" }} 
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                interval={4}
              />
              
              <YAxis 
                tick={{ fontSize: 10, fill: "#94A3B8" }} 
                tickLine={false}
                axisLine={false}
              />
              
              <Tooltip
                contentStyle={{
                  background: "#1E293B",
                  border: "none",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                formatter={(value: any) => [`${value} A`, "Corriente"]}
              />
              <Area
                type="monotone"
                dataKey="amps"
                stroke="#42C2C1"
                strokeWidth={2.5}
                fill="url(#todayFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* MODAL DE DETALLE DE DISPOSITIVO */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          pricePerKwh={userTariff}
          onClose={() => setSelectedDevice(null)}
        />
      )}

    </div>
  );
}