import { pgTable, uuid, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull().default(""),
  kakobuyLink: text("kakobuy_link").notNull().default(""),
  usfansLink: text("usfans_link").notNull().default(""),
  category: text("category").notNull().default("Inne"),
  rating: integer("rating").notNull().default(0),
  description: text("description").notNull().default(""),
  qcImages: jsonb("qc_images").notNull().default(sql`'[]'::jsonb`).$type<string[]>(),
  batch: text("batch").notNull().default("best"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
