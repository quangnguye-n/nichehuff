import Fastify, { type FastifyInstance } from "fastify";
import type { Db } from "./db/client.ts";
import type { Env } from "./env.ts";
import { budgetRoutes } from "./routes/budget.ts";
import { cigaretteRoutes } from "./routes/cigarettes.ts";
import { healthRoutes } from "./routes/health.ts";
import { internalRoutes } from "./routes/internal.ts";
import { stravaRoutes } from "./routes/strava.ts";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }

  interface FastifyInstance {
    db: Db;
  }
}

export async function buildApp(env: Env, db: Db): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });
  app.decorate("db", db);
  await app.register(healthRoutes);
  await app.register(stravaRoutes);
  await app.register(budgetRoutes(env));
  await app.register(cigaretteRoutes(env));
  await app.register(internalRoutes(env));
  return app;
}
