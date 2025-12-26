import { supabase } from "./supabaseClient";

export type HabitRow = Record<string, unknown>;

/**
 * Fetches rows from the `habits` table.
 * We select all columns so the app can evolve without changing this call.
 */
export async function fetchHabits(): Promise<HabitRow[]> {
  const { data, error } = await supabase.from("habits").select("*");
  if (error) throw error;

  console.log("fetchHabits", data);
  return data ?? [];
}
