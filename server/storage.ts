import { db } from "./db";
import { products, type InsertProduct, type Product } from "../shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}

export const storage: IStorage = new DbStorage();
