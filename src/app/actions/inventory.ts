/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { inventory } from "@/db/schema";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function createInventoryItem(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  await db.insert(inventory).values({
    itemName: data.itemName,
    category: data.category,
    sku: data.sku,
    quantity: parseInt(data.quantity) || 0,
    minQuantity: parseInt(data.minQuantity) || 0,
    sellingPrice: data.sellingPrice ? data.sellingPrice.toString() : "0",
    costPrice: data.costPrice ? data.costPrice.toString() : "0",
    createdBy: parseInt(session.user.id || "0"),
  });
  
  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function getInventory() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return db.select().from(inventory);
}

export async function updateInventory(id: number, data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const { eq } = await import("drizzle-orm");
  
  await db.update(inventory).set({
    itemName: data.itemName,
    category: data.category,
    sku: data.sku,
    quantity: parseInt(data.quantity) || 0,
    minQuantity: parseInt(data.minQuantity) || 0,
    sellingPrice: data.sellingPrice ? data.sellingPrice.toString() : "0",
    costPrice: data.costPrice ? data.costPrice.toString() : "0",
    status: data.status,
    updatedBy: parseInt(session.user.id || "0"),
    updatedAt: new Date(),
  }).where(eq(inventory.id, id));
  
  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function deleteInventory(id: number) {
  const { verifyAdmin } = await import("@/lib/auth-helpers");
  await verifyAdmin();
  
  const { eq } = await import("drizzle-orm");
  
  await db.update(inventory).set({
    status: "inactive",
    updatedAt: new Date(),
  }).where(eq(inventory.id, id));
  
  revalidatePath("/dashboard/inventory");
  return { success: true };
}
