//Mueve o adapta aquí la lógica que calcula pesos ($) a partir de los kWh consumidos por franja horaria.
//no solo traiga las tarifas de Supabase, sino que también maneje la tarifa seleccionada por el usuario (o una por defecto de Edenor/Edesur) y haga el cálculo de costos en pesos ($)
import { supabase } from "../integrations/supabase/client";

export type TariffRow = {
  id: string;
  provider: string;
  zone_name: string;
  price_per_kwh: number;
  tax_multiplier: number;
};

export interface CostBreakdown {
  provider: string;
  pricePerKwh: number;
  taxMultiplier: number;
  taxPercentage: number;
  pureCost: number;
  estimatedTaxesAmount: number;
  totalCostWithTaxes: number;
}

/**
 * Consulta la lista de tarifas configuradas en Supabase
 */
export async function fetchTariffs(): Promise<TariffRow[]> {
  const { data, error } = await supabase
    .from("tariffs")
    .select("*")
    .order("provider", { ascending: true });

  if (error) {
    console.error("Error al consultar la tabla tariffs:", error);
    return [];
  }

  return (data as TariffRow[]) || [];
}

/**
 * Calcula el costo en ARS a partir de kWh consumidos y un registro de tarifa
 */
export function calculateCostFromTariff(
  totalKwh: number,
  tariff: TariffRow
): CostBreakdown {
  const pricePerKwh = Number(tariff.price_per_kwh) || 0;
  const taxMultiplier = Number(tariff.tax_multiplier) || 1.0;

  const pureCost = totalKwh * pricePerKwh;
  const totalCostWithTaxes = pureCost * taxMultiplier;
  const estimatedTaxesAmount = totalCostWithTaxes - pureCost;
  const taxPercentage = Math.round((taxMultiplier - 1) * 100);

  return {
    provider: tariff.provider,
    pricePerKwh,
    taxMultiplier,
    taxPercentage,
    pureCost,
    estimatedTaxesAmount,
    totalCostWithTaxes,
  };
}

/**
 * Formateador auxiliar para ARS
 */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}