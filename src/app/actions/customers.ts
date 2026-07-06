/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function createCustomer(data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  // Generate token ID (e.g. CUS000001)
  const count = await db.$count(customers);
  const tokenId = `CUS${(count + 1).toString().padStart(6, '0')}`;
  
  await db.insert(customers).values({
    tokenId,
    name: data.name,
    city: data.city,
    address: data.address,
    contactNumber: data.contactNumber,
    alternateNumber: data.alternateNumber,
    gst: data.gst,
    remarks: data.remarks,
    tags: data.tags,
    createdBy: parseInt(session.user.id || "0"),
  });
  
  revalidatePath("/dashboard/customers");
  return { success: true };
}

export async function getCustomers() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return db.select().from(customers);
}

export async function updateCustomer(id: number, data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const { eq } = await import("drizzle-orm");
  
  await db.update(customers).set({
    name: data.name,
    city: data.city,
    address: data.address,
    contactNumber: data.contactNumber,
    alternateNumber: data.alternateNumber,
    gst: data.gst,
    remarks: data.remarks,
    tags: data.tags,
    status: data.status,
    updatedBy: parseInt(session.user.id || "0"),
    updatedAt: new Date(),
  }).where(eq(customers.id, id));
  
  revalidatePath("/dashboard/customers");
  return { success: true };
}

export async function deleteCustomer(id: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const { eq } = await import("drizzle-orm");
  
  // Note: we might want to just soft delete or move to recycle bin
  // For now we'll do a soft delete
  await db.update(customers).set({
    status: "inactive",
    updatedAt: new Date(),
  }).where(eq(customers.id, id));
  
  revalidatePath("/dashboard/customers");
  return { success: true };
}
