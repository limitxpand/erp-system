/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { reminders, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

export async function updateReminderStatus(id: number, status: string) {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  try {
    const updated = await db
      .update(reminders)
      .set({ status })
      .where(eq(reminders.id, id))
      .returning();

    if (updated.length > 0) {
      await db.insert(auditLogs).values({
        userId,
        module: "Reminders",
        recordId: id,
        action: "update_status",
        newData: updated[0],
      });
    }

    revalidatePath("/dashboard/reminders");
    return { success: true, data: updated[0] };
  } catch (error: any) {
    console.error("Error updating reminder:", error);
    return { success: false, error: error.message };
  }
}

export async function createReminder(data: { title: string; description?: string; dueDate: Date }) {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  try {
    const [newReminder] = await db.insert(reminders).values({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      assignedTo: userId,
    }).returning();

    revalidatePath("/dashboard/reminders");
    return { success: true, data: newReminder };
  } catch (error: any) {
    console.error("Error creating reminder:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteReminder(id: number) {
  try {
    await db.delete(reminders).where(eq(reminders.id, id));
    revalidatePath("/dashboard/reminders");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting reminder:", error);
    return { success: false, error: error.message };
  }
}
