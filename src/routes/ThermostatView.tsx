import React from "react";
import { ThermostatCard } from "@/components/dashboard/ThermostatCard";
import { HeaderUser } from "@/components/common/HeaderUser";

export const ThermostatView: React.FC = () => {
  const userTariff = Number(localStorage.getItem("user_tariff")) || 69.76;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 font-sans tracking-tight px-3 sm:px-0 pt-2">
      {/* Cabecera */}
      <HeaderUser userName="Leila Fernández" />

      {/* Encabezado orientativo */}
      <div className="px-1">
        <h1 className="text-lg font-bold text-slate-800">
          Simulador de Demanda y Ahorro
        </h1>
        <p className="text-xs text-slate-400">
          Elegí un tipo de equipo y regulá el dial para proyectar el impacto en Watts (W) y en la factura ($/h).
        </p>
      </div>

      {/* Tarjeta Dial Multidispositivo */}
      <ThermostatCard tariffPerKwh={userTariff} />
    </div>
  );
};

export default ThermostatView;