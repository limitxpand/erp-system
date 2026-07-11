/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { bills, billItems, inventory, calling, auditLogs, reminders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

export async function createBill(data: {
  customerId: number;
  totalAmount: number;
  remarks?: string;
  items: { inventoryId: number; quantity: number }[];
}) {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  try {
    const newBill = await db.transaction(async (tx) => {
      // 1. Create Bill
      const serialNumber = `BILL-${Date.now()}`;
      const [insertedBill] = await tx
        .insert(bills)
        .values({
          serialNumber,
          customerId: data.customerId,
          salesmanId: userId,
          totalAmount: data.totalAmount.toString(),
          remarks: data.remarks,
        })
        .returning();

      // 2. Add Bill Items & Decrement Inventory
      for (const item of data.items) {
        await tx.insert(billItems).values({
          billId: insertedBill.id,
          inventoryId: item.inventoryId,
          quantity: item.quantity,
        });

        // Decrement stock
        await tx
          .update(inventory)
          .set({
            quantity: sql`${inventory.quantity} - ${item.quantity}`,
          })
          .where(eq(inventory.id, item.inventoryId));
      }

      // 3. Add to Calling Queue
      const nextCallDate = new Date();
      nextCallDate.setDate(nextCallDate.getDate() + 3); // Example: Call after 3 days
      await tx.insert(calling).values({
        customerId: data.customerId,
        billId: insertedBill.id,
        nextCallDate: nextCallDate,
        callStatus: "Not Called",
      });

      // 4. Create 60-day Reminder
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 60);
      await tx.insert(reminders).values({
        title: `60-Day Follow-up: ${serialNumber}`,
        description: `Customer ID: ${data.customerId}, Bill Amount: ₹${data.totalAmount}`,
        dueDate: reminderDate,
      });

      // 5. Audit Log
      await tx.insert(auditLogs).values({
        userId: userId,
        module: "Billing",
        recordId: insertedBill.id,
        action: "create",
        newData: insertedBill,
      });

      return insertedBill;
    });

    // 6. Send WhatsApp Receipt
    try {
      const { customers } = await import("@/db/schema");
      const [customer] = await db.select().from(customers).where(eq(customers.id, data.customerId));
      
      if (customer && customer.contactNumber) {
        const { sendWhatsAppMessage } = await import("./whatsapp");
        const printUrl = `https://erp-system-rho-fawn.vercel.app/dashboard/billing/print/${newBill.id}`;
        
        const message = `Hello ${customer.name},\n\nYour bill (${newBill.serialNumber}) for Rs. ${data.totalAmount} has been generated at Anmol Fabrics.\n\nYou can view and download your bill here: ${printUrl}\n\nThank you for shopping with us!`;
        
        // Don't await to avoid blocking the UI, let it send in the background
        sendWhatsAppMessage(customer.contactNumber, message).catch(console.error);
      }
    } catch (e) {
      console.error("Error sending WhatsApp receipt:", e);
    }

    revalidatePath("/dashboard/billing");
    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/calling");
    return { success: true, bill: newBill };
  } catch (error: any) {
    console.error("Error creating bill:", error);
    return { success: false, error: error.message };
  }
}
export async function getBillDetails(id: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const [bill] = await db.select().from(bills).where(eq(bills.id, id));
  if (!bill) return null;
  
  const { customers, users } = await import("@/db/schema");
  const [customer] = await db.select().from(customers).where(eq(customers.id, bill.customerId!));
  const [salesman] = await db.select().from(users).where(eq(users.id, bill.salesmanId!));
  
  const items = await db.select({
    id: billItems.id,
    quantity: billItems.quantity,
    discountPerPiece: billItems.discountPerPiece,
    inventoryId: billItems.inventoryId,
    itemName: inventory.itemName,
    sku: inventory.sku,
    sellingPrice: inventory.sellingPrice
  })
  .from(billItems)
  .leftJoin(inventory, eq(billItems.inventoryId, inventory.id))
  .where(eq(billItems.billId, id));
  
  return {
    ...bill,
    customer,
    salesman,
    items
  };
}
