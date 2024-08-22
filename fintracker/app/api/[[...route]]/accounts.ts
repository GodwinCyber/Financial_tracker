import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(), // Ensure this middleware is properly applied
    async (c) => {
      const auth = getAuth(c);
      console.log("Auth Object:", auth);

      if (!auth?.userId) {
        console.log("User ID is missing or invalid");
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId));

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(), // Ensure this middleware is properly applied
    zValidator("json", insertAccountSchema.pick({
      name: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db.insert(accounts).values({
        id: createId(),
        userId: auth.userId,
        ...values,
      }).returning();

      return c.json({ data });
    }
  );

export default app;
