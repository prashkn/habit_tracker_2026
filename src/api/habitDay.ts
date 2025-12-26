import { supabase } from "./supabaseClient";
import type { ChecklistItem } from "../components/Checklist";

export type HabitDayUpsertResult = {
  id: number;
};

export type HabitDayRow = Record<string, unknown>;

/**
 * Fetches a single row from `habits` at primary key `id = dayId`.
 * Returns null when no row exists.
 */
export async function fetchHabitDay(
  dayId: number
): Promise<HabitDayRow | null> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", dayId)
    .maybeSingle();

  if (error) throw error;
  return (data as HabitDayRow | null) ?? null;
}

/**
 * Upserts a single "day row" in `habits` at primary key `id = dayId`.
 * Each checklist item's `id` is treated as a boolean column name.
 */
export async function upsertHabitDay(
  dayId: number,
  items: ChecklistItem[]
): Promise<HabitDayUpsertResult> {
  const payload: Record<string, boolean | number> = { id: dayId };
  for (const item of items) payload[item.id] = item.checked;

  const { data, error } = await supabase
    .from("habits")
    .upsert(payload, { onConflict: "id" })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data?.id ?? dayId };
}
