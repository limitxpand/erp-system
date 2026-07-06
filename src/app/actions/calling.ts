/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { calling, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

export async function updateCallStatus(data: {
  callId: number;
  status: string;
  review: string;
  remarks: string;
  nextCallDate: Date | null;
}) {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  try {
    const updated = await db
      .update(calling)
      .set({
        callStatus: data.status,
        review: data.review,
        remarks: data.remarks,
        nextCallDate: data.nextCallDate,
        handledBy: userId,
        updatedAt: new Date(),
      })
      .where(eq(calling.id, data.callId))
      .returning();

    if (updated.length > 0) {
      await db.insert(auditLogs).values({
        userId: userId,
        module: "Calling",
        recordId: data.callId,
        action: "update_status",
        newData: updated[0],
      });
    }

    revalidatePath("/dashboard/calling");
    return { success: true, data: updated[0] };
  } catch (error: any) {
    console.error("Error updating call status:", error);
    return { success: false, error: error.message };
  }
}
