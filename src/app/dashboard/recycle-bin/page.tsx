import { db } from "@/db";
import { recycleBin, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import RecycleBinClient from "./client";

export default async function RecycleBinPage() {
  const data = await db
    .select({
      id: recycleBin.id,
      originalTable: recycleBin.module,
      originalId: recycleBin.originalId,
      originalData: recycleBin.data,
      deletedAt: recycleBin.deletedAt,
      deletedByUser: users.username,
    })
    .from(recycleBin)
    .leftJoin(users, eq(recycleBin.deletedBy, users.id))
    .orderBy(desc(recycleBin.deletedAt));

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Recycle Bin</h2>
      <RecycleBinClient initialData={data} />
    </div>
  );
}
