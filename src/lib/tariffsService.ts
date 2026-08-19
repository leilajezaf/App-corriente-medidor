import { supabase } from "../integrations/supabase/client";

export type TariffRow = {
  id: string;
  provider: string;
  zone_name: string;
  price_per_kwh: number;
  tax_multiplier: number;
};

export async function fetchTariffs(): Promise<TariffRow[]> {
  // @ts-ignore
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