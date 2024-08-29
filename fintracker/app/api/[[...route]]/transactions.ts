/**
 * Transactions API Endpoint:
 * - **GET /**: Retrieves a list of transactions for the authenticated user within a specified date range and optionally filtered by account.
 *   - Requires authentication and optional query parameters: `from` (start date), `to` (end date), and `accountId`.
 *   - Returns a JSON object with transaction details including `id`, `date`, `category`, `categoryId`, `payee`, `amount`, `notes`, `account`, and `accountId`.

 * - **GET /:id**: Retrieves a specific transaction by ID for the authenticated user.
 *   - Requires authentication and a route parameter `id`.
 *   - Returns a JSON object with transaction details or an error if the transaction is not found.

 * - **POST /**: Creates a new transaction.
 *   - Requires authentication and a JSON body that follows the `insertTransactionSchema` (excluding `id`).
 *   - Returns a JSON object with the created transaction.

 * - **POST /bulk-create**: Creates multiple transactions at once.
 *   - Requires authentication and a JSON body containing an array of transaction objects (excluding `id`).
 *   - Returns a JSON object with the created transactions.

 * - **POST /bulk-delete**: Deletes multiple transactions by IDs.
 *   - Requires authentication and a JSON body containing an array of transaction IDs.
 *   - Returns a JSON object with the deleted transactions.

 * - **PATCH /:id**: Updates a specific transaction by ID.
 *   - Requires authentication, a route parameter `id`, and a JSON body that follows the `insertTransactionSchema` (excluding `id`).
 *   - Returns a JSON object with the updated transaction or an error if the transaction is not found.

 * - **DELETE /:id**: Deletes a specific transaction by ID.
 *   - Requires authentication and a route parameter `id`.
 *   - Returns a JSON object with the deleted transaction or an error if the transaction is not found.
 */

import { db } from "@/db/drizzle";
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts
} from "@/db/schema";
import { Hono } from "hono";
import { parse, subDays } from "date-fns";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      console.log("Auth Object:", auth);

      const { from, to, accountId } = c.req.valid("query");

      // Proceed only if userId is present
      if (auth?.userId) {
        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);

        const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;

        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

        const data = await db
          .select({
            id: transactions.id,
            date: transactions.date,
            category: categories.name,
            categoryId: transactions.categoryId,
            payee: transactions.payee,
            amount: transactions.amount,
            notes: transactions.notes,
            account: accounts.name,
            accountId: transactions.accountId,

          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .leftJoin(categories, eq(transactions.categoryId, categories.id))
          .where(
            and(
              accountId ? eq(transactions.accountId, accountId) : undefined,
              eq(accounts.userId, auth.userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate),
            )
          )
          .orderBy(desc(transactions.date));

        return c.json({ data });
      }

      return c.json({ error: "Unauthorized" }, 401);
    })
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
    
      if (auth?.userId) {
        const [data] = await db
          .select({
            id: transactions.id,
            date: transactions.date,
            categoryId: transactions.categoryId,
            payee: transactions.payee,
            amount: transactions.amount,
            notes: transactions.notes,
            accountId: transactions.accountId,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              eq(transactions.id, id),
              eq(accounts.userId, auth.userId),
            ),
          );
    
        if (!data) {
          return c.json({ error: "not found" }, 404);
        }
    
        return c.json({ data });
      }
    
      return c.json({ error: "Unauthorized" }, 401);
    }
  )    
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({
      id: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      // Proceed only if userId is present
      if (auth?.userId) {
        const [data] = await db.insert(transactions).values({
          id: createId(),
          ...values,
        }).returning();

        return c.json({ data });
      }
      return c.json({ error: "Unauthorized" }, 401);
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        }),
      ),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (auth?.userId) {
        const data = await db
          .insert(transactions)
          .values(
            values.map((value) => ({
              id: createId(),
              ...value,
            }))
          )
          .returning();

        return c.json({ data });
      }
      return c.json({ error: "Unauthorized" }, 401);
    },
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

      if (auth?.userId) {
        const transactionsToDelete = db.$with("transaction_to_delete").as(
          db.select({ id: transactions.id })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId),
            )),
        );
        const data = await db
          .with(transactionsToDelete)
          .delete(transactions)
          .where(
            inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
          )
          .returning({
            id: transactions.id,
          });

        return c.json({ data });
      }
      return c.json({ error: "Unauthorized" }, 401);
    }
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
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (auth?.userId) {
        const transactionsToUpdate = db.$with("transaction_to_update").as(
          db.select({ id: transactions.id })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(and(
              eq(transactions.id, id),
              eq(accounts.userId, auth.userId),
            )),
        );

        const [data] = await db
          .with(transactionsToUpdate)
          .update(transactions)
          .set(values)
          .where(
            inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
          )
          .returning();

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }
        return c.json({ data });
      }
      return c.json({ error: "Unauthorized" }, 401);
    }
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

      if (auth?.userId) {
        const transactionsToDelete = db.$with("transaction_to_delete").as(
          db.select({ id: transactions.id })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(and(
              eq(transactions.id, id),
              eq(accounts.userId, auth.userId),
            )),
        );

        const [data] = await db
          .with(transactionsToDelete)
          .delete(transactions)
          .where(
            inArray(
              transactions.id,
              sql`(select id from ${transactionsToDelete})`
            ),
          )
          .returning({
            id: transactions.id,
          });

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }
        return c.json({ data });
      }
      return c.json({ error: "Unauthorized" }, 401);
    }
  );

export default app;
