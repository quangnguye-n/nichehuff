import type { FastifyInstance } from "fastify";
import type { Env } from "../env.ts";
import { errorBody } from "../errors.ts";
import { requireUser } from "../plugins/auth.ts";

export function budgetRoutes(env: Env) {
  return async function budgetRoutes(app: FastifyInstance): Promise<void> {
    app.get(
      "/budget",
      { preHandler: requireUser(env) },
      async (_request, reply) => {
        return reply
          .code(501)
          .send(errorBody("not_implemented", "Budget is not implemented yet."));
      },
    );
  };
}
