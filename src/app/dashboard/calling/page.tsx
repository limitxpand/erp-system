import { db } from "@/db";
import { calling, customers, bills } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import CallingClient from "./client";

export default async function CallingPage() {
  const callingData = await db
    .select({
      id: calling.id,
      nextCallDate: calling.nextCallDate,
      callStatus: calling.callStatus,
      review: calling.review,
      remarks: calling.remarks,
      customerName: customers.name,
      customerContact: customers.contactNumber,
      billId: calling.billId,
    })
    .from(calling)
    .leftJoin(customers, eq(calling.customerId, customers.id))
    .leftJoin(bills, eq(calling.billId, bills.id))
    .orderBy(desc(calling.nextCallDate));

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Calling Management</h2>
      <CallingClient initialData={callingData} />
    </div>
  );
}
