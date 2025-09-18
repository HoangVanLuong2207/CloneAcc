import { accounts, type Account, type InsertAccount } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

interface IStorage {
  getAllAccounts(): Promise<Account[]>;
  createAccount(insertAccount: InsertAccount): Promise<Account>;
  updateAccountStatus(id: number, status: boolean): Promise<Account | undefined>;
  deleteAccount(id: number): Promise<boolean>;
  getAccountStats(): Promise<{ total: number; active: number; inactive: number }>;
}

export class DatabaseStorage implements IStorage {
  async getAllAccounts(): Promise<Account[]> {
    return await db.select().from(accounts);
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const [account] = await db
      .insert(accounts)
      .values(insertAccount)
      .returning();
    return account;
  }

  async updateAccountStatus(id: number, status: boolean): Promise<Account | undefined> {
    const [account] = await db
      .update(accounts)
      .set({ status })
      .where(eq(accounts.id, id))
      .returning();
    return account || undefined;
  }

  async deleteAccount(id: number): Promise<boolean> {
    const result = await db
      .delete(accounts)
      .where(eq(accounts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAccountStats(): Promise<{ total: number; active: number; inactive: number }> {
    const [stats] = await db
      .select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(*) filter (where status = true)`,
        inactive: sql<number>`count(*) filter (where status = false)`
      })
      .from(accounts);
    
    return {
      total: Number(stats.total),
      active: Number(stats.active),
      inactive: Number(stats.inactive)
    };
  }
}

export const storage = new DatabaseStorage();