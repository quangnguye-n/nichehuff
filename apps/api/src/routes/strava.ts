import type { FastifyInstance } from "fastify";

export async function stravaRoutes(app: FastifyInstance): Promise<void> {
  app.post("/strava/callback", async () => ({ ok: true }));
  app.get("/strava/webhook", async () => ({ ok: true }));
  app.post("/strava/webhook", async () => ({ ok: true }));
}
