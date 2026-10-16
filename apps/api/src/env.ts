import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const envPath = path.join(packageRoot, ".env");

if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const optionalText = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : undefined;
  });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8080),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: optionalText,
  CRON_SECRET: z.string().min(1),
  STRAVA_CLIENT_ID: optionalText,
  STRAVA_CLIENT_SECRET: optionalText,
  STRAVA_WEBHOOK_VERIFY_TOKEN: optionalText,
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return envSchema.parse(source);
}
