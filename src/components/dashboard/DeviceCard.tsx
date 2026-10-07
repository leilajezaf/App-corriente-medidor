//mostrar el consumo individual en Pesos ($) y Watts ($W$)
import React from 'react';
import { Tv, Wifi, Lamp, Snowflake, Refrigerator, Power, WashingMachine } from 'lucide-react';
import { formatPower, formatCurrency } from '../../utils/formatters';

export interface DeviceData {
  id: string;
  name: string;
  category: 'climatizacion' | 'cocina' | 'iluminacion' | 'entretenimiento' | 'lavado' | 'otros';
  type: 'tv' | 'router' | 'lamp' | 'ac' | 'fridge' | 'washer' | 'generic';
  status: 'OPENED' | 'CLOSED';
  isActive: boolean;
  powerWatts?: number;
  costPerHour?: number; // Gasto estimado en $ por hora
  subtitle?: string; // ej. "23 °C" o "Programa Eco"
}

interface DeviceCardProps {
  device: DeviceData;
  onToggle: (id: string, newStatus: boolean) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle }) => {
  const { id, name, type, status, isActive, powerWatts, costPerHour, subtitle } = device;

  const renderIcon = () => {
    const iconClass = `w-6 h-6 ${isActive ? 'text-white' : 'text-slate-700'}`;
    switch (type) {
      case 'tv':
        return <Tv className={iconClass} />;
      case 'router':
        return <Wifi className={iconClass} />;
      case 'lamp':
        return <Lamp className={iconClass} />;
      case 'ac':
        return <Snowflake className={iconClass} />;
      case 'fridge':
        return <Refrigerator className={iconClass} />;
      case 'washer':
        return <WashingMachine className={iconClass} />;
      default:
        return <Power className={iconClass} />;
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 ${
        isActive
          ? 'bg-[#42C2C1] text-white shadow-lg shadow-[#42C2C1]/20 scale-[1.02]'
          : 'bg-white text-slate-800 border border-slate-100 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Cabecera de la tarjeta: Ícono + Toggle Switch */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isActive ? 'bg-white/20' : 'bg-slate-50'
          }`}
        >
          {renderIcon()}
        </div>

        <button
          onClick={() => onToggle(id, !isActive)}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
            isActive ? 'bg-white/30 justify-end' : 'bg-slate-200 justify-start'
          }`}
          aria-label={`Toggle ${name}`}
        >
          <div
            className={`w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${
              isActive ? 'bg-white' : 'bg-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Nombre y detalles del Electrodoméstico */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base leading-tight tracking-tight">
            {name}
          </h3>
          {subtitle && (
            <span
              className={`text-xs font-semibold ${
                isActive ? 'text-white/90' : 'text-slate-500'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* Muestra la potencia en W y el gasto estimado en $/h */}
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-[11px] font-medium tracking-wider uppercase ${
              isActive ? 'text-white/80' : 'text-slate-400'
            }`}
          >
            {status === 'OPENED' ? 'Encendido' : 'Apagado'}
          </span>

          {isActive && powerWatts !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">
                {formatPower(powerWatts)}
              </span>
              {costPerHour !== undefined && (
                <span className={`text-[10px] font-semibold ${isActive ? 'text-white/90' : 'text-emerald-600'}`}>
                  (~{formatCurrency(costPerHour)}/h)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;