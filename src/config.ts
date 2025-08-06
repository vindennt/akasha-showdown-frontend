interface AppConfig {
  API_BASE_URL: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

export const config: AppConfig = {
  API_BASE_URL: import.meta.env.VITE_API_URL,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY,
};
