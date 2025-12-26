import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;
  client = createClient(env.supabaseUrl, env.supabaseKey);
  return client;
}

export const supabase = getSupabaseClient();
