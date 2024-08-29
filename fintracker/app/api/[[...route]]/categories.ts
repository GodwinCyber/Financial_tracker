/**
 * Categories API Endpoints:
 * - **GET /**: Retrieves all categories for the authenticated user.
 *   - Requires authentication.
 *   - Returns a list of categories with their IDs and names.
 * - **GET /:id**: Retrieves a single category by its ID.
 *   - Requires authentication and valid category ID in parameters.
 *   - Returns the category details or a 404 error if not found.
 * - **POST /**: Creates a new category.
 *   - Requires authentication and valid category details in the request body.
 *   - Returns the created category details.
 * - **POST /bulk-delete**: Deletes multiple categories based on an array of IDs.
 *   - Requires authentication and valid category IDs in the request body.
 *   - Returns the deleted category IDs or an error if unauthorized.
 * - **PATCH /:id**: Updates an existing category by its ID.
 *   - Requires authentication, valid category ID in parameters, and updated category details in the request body.
 *   - Returns the updated category details or a 404 error if not found.
 * - **DELETE /:id**: Deletes a category by its ID.
 *   - Requires authentication and valid category ID in parameters.
 *   - Returns the deleted category details or a 404 error if not found.
 */

import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";
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
            id: categories.id,
            name: categories.name,
          })
          .from(categories)
          .where(eq(categories.userId, auth.userId));

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
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id)
          ),
        );
      if (!data) {
        return c.json({ error: "Category not found" }, 404);
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertCategorySchema.pick({
      name: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      // Proceed only if userId is present
      if (auth?.userId) {
        const [data] = await db.insert(categories).values({
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
      .delete(categories)
      .where(
        and(
          eq(categories.userId, auth.userId),
          inArray(categories.id, values.ids)
        )
      )
      .returning({
        id: categories.id,
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
      insertCategorySchema.pick({
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
        .update(categories)
        .set(values)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id),
          ),
        )
        .returning();

        if (!data) {
          return c.json({ error: "Category not found" }, 404);
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
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id),
          ),
        )
        .returning({
          id: categories.id,
        });

        if (!data) {
          return c.json({ error: "Category not found" }, 404);
        }
        return c.json({ data });
    },
  )

export default app;
