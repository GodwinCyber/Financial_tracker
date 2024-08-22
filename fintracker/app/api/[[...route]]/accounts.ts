import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      console.log("Auth Object:", auth);

      // Proceed only if userId is present
      if (auth?.userId) {
        const data = await db
          .select({
            id: accounts.id,
            name: accounts.name,
          })
          .from(accounts)
          .where(eq(accounts.userId, auth.userId));

        return c.json({ data });
      }

      console.log("User ID is missing or invalid");
      return c.json({ error: "Unauthorized" }, 401);
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({
      name: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      // Proceed only if userId is present
      if (auth?.userId) {
        const [data] = await db.insert(accounts).values({
          id: createId(),
          userId: auth.userId,
          ...values,
        }).returning();

        return c.json({ data });
      }

      console.log("User ID is missing or invalid");
      return c.json({ error: "Unauthorized" }, 401);
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        console.log("User ID is missing or invalid");
        return c.json({ error: "Unauthorized" }, 401);
      }
      const data = await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          inArray(accounts.id, values.ids)
        )
      )
      .returning({
        id: accounts.id,
      });

      return c.json({ data });
    },
  );

export default app;
