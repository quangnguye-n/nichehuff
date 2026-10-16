import type { FastifyReply, FastifyRequest } from "fastify";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import type { Env } from "../env.ts";
import { errorBody } from "../errors.ts";

const jwksByUrl = new Map<string, JWTVerifyGetKey>();

function supabaseIssuer(supabaseUrl: string): string {
  return new URL("/auth/v1", supabaseUrl).href.replace(/\/$/, "");
}

function jwksFor(supabaseUrl: string): JWTVerifyGetKey {
  const existing = jwksByUrl.get(supabaseUrl);
  if (existing) return existing;
  const jwks = createRemoteJWKSet(
    new URL("/auth/v1/.well-known/jwks.json", supabaseUrl),
  );
  jwksByUrl.set(supabaseUrl, jwks);
  return jwks;
}

export async function verifySupabaseAccessToken(
  token: string,
  env: Env,
): Promise<string> {
  const key = env.SUPABASE_JWT_SECRET
    ? new TextEncoder().encode(env.SUPABASE_JWT_SECRET)
    : jwksFor(env.SUPABASE_URL);
  const { payload } = await jwtVerify(token, key, {
    audience: "authenticated",
    issuer: supabaseIssuer(env.SUPABASE_URL),
  });
  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    throw new Error("Supabase token is missing sub.");
  }
  if (payload.role !== "authenticated") {
    throw new Error("Supabase token role is not authenticated.");
  }
  return payload.sub;
}

export function requireUser(env: Env) {
  return async function requireUser(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const header = request.headers.authorization;
    if (typeof header !== "string" || !header.startsWith("Bearer ")) {
      await reply
        .code(401)
        .send(errorBody("unauthorized", "Missing bearer token."));
      return;
    }

    try {
      request.userId = await verifySupabaseAccessToken(
        header.slice("Bearer ".length).trim(),
        env,
      );
    } catch {
      await reply.code(401).send(errorBody("unauthorized", "Invalid token."));
    }
  };
}
