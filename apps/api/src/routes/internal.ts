import { timingSafeEqual } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { Env } from "../env.ts";
import { errorBody } from "../errors.ts";
import { evaluateUsers } from "../jobs/evaluate.ts";

function secretsMatch(provided: string, expected: string): boolean {
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  if (providedBytes.length !== expectedBytes.length) return false;
  return timingSafeEqual(providedBytes, expectedBytes);
}

export function internalRoutes(env: Env) {
  return async function internalRoutes(app: FastifyInstance): Promise<void> {
    app.post("/internal/cron", async (request, reply) => {
      const header = request.headers["x-cron-secret"];
      const provided = Array.isArray(header) ? header[0] : header;
      if (typeof provided !== "string" || !secretsMatch(provided, env.CRON_SECRET)) {
        return reply
          .code(401)
          .send(errorBody("unauthorized", "Invalid cron secret."));
      }
      return evaluateUsers();
    });
  };
}
