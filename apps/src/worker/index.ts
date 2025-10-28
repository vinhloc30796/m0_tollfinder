import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = Record<string, never>;

const app = new Hono<{ Bindings: Env }>();
app.use("*", cors());

// Health
app.get("/health", (c) => c.json({ ok: true }));

export default {
  fetch: app.fetch,
};
