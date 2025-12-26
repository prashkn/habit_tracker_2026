function requiredEnv(name: string): string {
  const value = import.meta.env[name];
  if (!value || typeof value !== "string") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  supabaseUrl: requiredEnv("VITE_SUPABASE_URL"),
  supabaseKey: requiredEnv("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY"),
};
