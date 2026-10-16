import { buildApp } from "./app.ts";
import { createDb } from "./db/client.ts";
import { loadEnv } from "./env.ts";

const env = loadEnv();
const app = await buildApp(env, createDb(env));

try {
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
