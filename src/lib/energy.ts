export type LoadLevel = "eco" | "mid" | "high" | "critical";

export type TariffZone = {
  provider: string;       // "Edesur", "Edenor", "Edelap"
  zoneName: string;       // "GBA Sur", "CABA", "La Plata"
  pricePerKwh: number;    // Ej: 110
  taxMultiplier: number;  // Ej: 1.28 (PBA) o 1.21 (CABA)
};

export const LOAD_META: Record<LoadLevel, { label: string; color: string }> = {
  eco: { label: "Consumo leve", color: "var(--eco)" },
  mid: { label: "Consumo moderado", color: "var(--mid)" },
  high: { label: "Consumo elevado", color: "var(--high)" },
  critical: { label: "Consumo crítico", color: "var(--critical)" },
};

/** ratio: 0..1 sobre la corriente máxima del medidor */
export function loadLevel(ratio: number): LoadLevel {
  if (ratio < 0.35) return "eco";
  if (ratio < 0.6) return "mid";
  if (ratio < 0.85) return "high";
  return "critical";
}

export function loadColor(ratio: number): string {
  return LOAD_META[loadLevel(ratio)].color;
}

export const VOLTAGE = 220;

export function amperesToKw(amps: number, voltage = VOLTAGE, powerFactor = 0.95) {
  return (amps * voltage * powerFactor) / 1000;
}

// Formateo de moneda con es-AR
export function money(value: number, currency = "$") {
  return `${currency}${value.toLocaleString("es-AR", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

/* ---------- Datos de demostración (se reemplazan por lecturas del medidor) ---------- */

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export type Reading = { label: string; amps: number; kwh: number };

export function todayCurve(): Reading[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const base = 4 + 9 * Math.exp(-Math.pow(hour - 20, 2) / 12) + 5 * Math.exp(-Math.pow(hour - 9, 2) / 8);
    const amps = Math.max(1.2, base + pseudoRandom(hour + 1) * 3.5);
    return {
      label: `${String(hour).padStart(2, "0")}:00`,
      amps: Number(amps.toFixed(1)),
      kwh: Number(amperesToKw(amps).toFixed(2)),
    };
  });
}

export function weekSeries(): Reading[] {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  return days.map((label, i) => {
    const kwh = 6 + pseudoRandom(i + 20) * 9;
    return { label, amps: Number((kwh * 4).toFixed(1)), kwh: Number(kwh.toFixed(2)) };
  });
}

export function monthSeries(): Reading[] {
  return Array.from({ length: 30 }, (_, i) => {
    const kwh = 5.5 + pseudoRandom(i + 60) * 11;
    return { label: `${i + 1}`, amps: Number((kwh * 4).toFixed(1)), kwh: Number(kwh.toFixed(2)) };
  });
}

/* ---------- Estimación de Costos y Tarifas por Zona ---------- */

// Diccionario con las zonas predeterminadas (GBA Sur, CABA, La Plata, etc.)
export const DEFAULT_ZONES: Record<string, TariffZone> = {
  edesur_gba: { provider: "Edesur", zoneName: "GBA Sur", pricePerKwh: 110, taxMultiplier: 1.28 },
  edesur_caba: { provider: "Edesur", zoneName: "CABA", pricePerKwh: 105, taxMultiplier: 1.21 },
  edenor_caba: { provider: "Edenor", zoneName: "CABA / GBA Norte", pricePerKwh: 108, taxMultiplier: 1.21 },
  edelap_lp: { provider: "Edelap", zoneName: "La Plata / Gran La Plata", pricePerKwh: 125, taxMultiplier: 1.30 },
};

/**
 * Calcula el gasto total en ARS ($) soportando un objeto TariffZone o un número simple para la tarifa.
 */
export function calculateEnergyCost(
  kwh: number, 
  tariff: number | TariffZone = DEFAULT_ZONES.edesur_gba, 
  includeTaxes: boolean = true
): number {
  if (typeof tariff === "number") {
    // Si se pasa un número simple (ej. $110), usa el multiplicador predeterminado de PBA (1.28)
    const baseCost = kwh * tariff;
    return includeTaxes ? baseCost * 1.28 : baseCost;
  }

  // Si se pasa un objeto TariffZone (ej. DEFAULT_ZONES.edesur_caba)
  const baseCost = kwh * tariff.pricePerKwh;
  return includeTaxes ? baseCost * tariff.taxMultiplier : baseCost;
}

/* Helper listo para formatear de manera consistente el valor total en Pesos Argentinos */
export function formatARS(amount: number): string {
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}