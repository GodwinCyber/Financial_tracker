import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
// import { HTTPException } from "hono/http-exception";
//import { HTTPException } from "hono/http-exception";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// app.onError((err, c) => {
//   if (err instanceof HTTPException) {
//     return err.getResponse();
//   }
//   return c.json({ error: "Internal server error"}, 500);
// })

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
