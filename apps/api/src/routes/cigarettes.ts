import type { FastifyInstance } from "fastify";
import type { Env } from "../env.ts";
import { errorBody } from "../errors.ts";
import { requireUser } from "../plugins/auth.ts";

export function cigaretteRoutes(env: Env) {
  return async function cigaretteRoutes(app: FastifyInstance): Promise<void> {
    app.post(
      "/cigarettes",
      { preHandler: requireUser(env) },
      async (_request, reply) => {
        return reply
          .code(501)
          .send(
            errorBody("not_implemented", "Cigarette logging is not implemented yet."),
          );
      },
    );
  };
}
