import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Env } from "../env.ts";

export type Db = SupabaseClient;

export function createDb(env: Env): Db {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
