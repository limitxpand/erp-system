/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { recycleBin, auditLogs, customers, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

export async function restoreRecord(recycleBinId: number, originalTable: string, originalData: any) {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  try {
    if (originalTable === "customers") {
      await db.insert(customers).values(originalData);
    } else if (originalTable === "inventory") {
      await db.insert(inventory).values(originalData);
    } else {
      throw new Error(`Restoring to ${originalTable} is not implemented.`);
    }

    await db.delete(recycleBin).where(eq(recycleBin.id, recycleBinId));

    await db.insert(auditLogs).values({
      userId,
      module: "RecycleBin",
      recordId: recycleBinId,
      action: "restore",
      newData: { originalTable, originalData },
    });

    revalidatePath("/dashboard/recycle-bin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
