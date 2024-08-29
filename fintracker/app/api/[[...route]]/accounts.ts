/**
 * Accounts API Endpoints:
 * - **GET /**: Fetches all accounts for the authenticated user.
 *   - Requires authentication.
 *   - Returns a list of accounts with their IDs and names.
 * - **GET /:id**: Fetches a single account by its ID.
 *   - Requires authentication and valid account ID in parameters.
 *   - Returns the account details or a 404 error if not found.
 * - **POST /**: Creates a new account.
 *   - Requires authentication and valid account details in the request body.
 *   - Returns the created account details.
 * - **POST /bulk-delete**: Deletes multiple accounts based on an array of IDs.
 *   - Requires authentication and valid account IDs in the request body.
 *   - Returns the deleted account IDs or an error if unauthorized.
 * - **PATCH /:id**: Updates an existing account by its ID.
 *   - Requires authentication, valid account ID in parameters, and updated account details in the request body.
 *   - Returns the updated account details or a 404 error if not found.
 * - **DELETE /:id**: Deletes an account by its ID.
 *   - Requires authentication and valid account ID in parameters.
 *   - Returns the deleted account details or a 404 error if not found.
 */


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
  .get(
    "/:id",
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const [data] = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id)
          ),
        );
      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }
      return c.json({ data });
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
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const [data] = await db
        .update(accounts)
        .set(values)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id),
          ),
        )
        .returning();

        if (!data) {
          return c.json({ error: "Account not found" }, 404);
        }
        return c.json({ data });
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const [data] = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id),
          ),
        )
        .returning({
          id: accounts.id,
        });

        if (!data) {
          return c.json({ error: "Account not found" }, 404);
        }
        return c.json({ data });
    },
  )

export default app;
