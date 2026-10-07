//formato a los números, por ejemplo: pasar 1250.5 a $ 1.250,50 o formatear los kWh.
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Formatear consumo en kWh
export const formatEnergy = (kwh: number): string => {
  return `${kwh.toFixed(1)} kWh`;
};

// Formatear potencia en Watts o kW
export const formatPower = (watts: number): string => {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }
  return `${Math.round(watts)} W`;
};