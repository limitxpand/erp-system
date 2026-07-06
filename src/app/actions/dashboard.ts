"use server";

import { db } from "@/db";
import { customers, bills, calling, inventory, reminders } from "@/db/schema";
import { sql, eq, and, gte } from "drizzle-orm";
import { auth } from "../../../auth";

export async function getDashboardMetrics() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Total Customers
  const [{ count: totalCustomers }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customers)
    .where(eq(customers.status, "active"));

  // Today's Sales
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [{ totalSales }] = await db
    .select({ totalSales: sql<number>`sum(CAST(${bills.totalAmount} AS DECIMAL))` })
    .from(bills)
    .where(gte(bills.createdAt, today));

  // Pending Calls
  const [{ count: pendingCalls }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(calling)
    .where(eq(calling.callStatus, "Not Called"));

  // Low Stock Items
  const [{ count: lowStock }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(inventory)
    .where(sql`${inventory.quantity} <= ${inventory.minQuantity}`);
    
  // Today's Reminders
  const todaysReminders = await db
    .select()
    .from(reminders)
    .where(and(eq(reminders.status, "pending"), gte(reminders.dueDate, today)))
    .limit(5);

  return {
    totalCustomers: Number(totalCustomers) || 0,
    todaySales: Number(totalSales) || 0,
    pendingCalls: Number(pendingCalls) || 0,
    lowStock: Number(lowStock) || 0,
    todaysReminders,
  };
}
