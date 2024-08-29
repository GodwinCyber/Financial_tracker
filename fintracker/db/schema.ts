/**
 * Database Schema Definitions:
 * - **Accounts Table (`accounts`)**:
 *   - `id`: Primary key, text
 *   - `plaidId`: Text, optional
 *   - `name`: Text, not null
 *   - `userId`: Text, not null
 *   - Relationships: One-to-many with `transactions`
 *   - Insert Schema: `insertAccountSchema`
 *
 * - **Categories Table (`categories`)**:
 *   - `id`: Primary key, text
 *   - `plaidId`: Text, optional
 *   - `name`: Text, not null
 *   - `userId`: Text, not null
 *   - Relationships: One-to-many with `transactions`
 *   - Insert Schema: `insertCategorySchema`
 *
 * - **Transactions Table (`transactions`)**:
 *   - `id`: Primary key, text
 *   - `amount`: Integer, not null
 *   - `payee`: Text, not null
 *   - `notes`: Text, optional
 *   - `date`: Timestamp (date mode), not null
 *   - `accountId`: Text, references `accounts.id`, not null
 *   - `categoryId`: Text, references `categories.id`, optional
 *   - Relationships: Many-to-one with `accounts`, many-to-one with `categories`
 *   - Insert Schema: `insertTransactionSchema` (coerces date to `Date` object)
 */

import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

import {
    integer,
    pgTable,
    text,
    timestamp
} from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export const accountsRelations = relations(accounts, ({ many}) => ({
    transactions: many(transactions),
}));

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date" }).notNull(),

    // create relation betweem categories, account and transactions
    accountId: text("account_id").references(() => accounts.id, {
        onDelete: "cascade",
    }).notNull(),
    categoryId: text("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
});

export const transactionsRelations = relations(transactions, ({ one}) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    categories: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
});

