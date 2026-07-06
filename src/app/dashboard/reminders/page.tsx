import { db } from "@/db";
import { reminders, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import RemindersClient from "./client";

export default async function RemindersPage() {
  const remindersData = await db
    .select({
      id: reminders.id,
      title: reminders.title,
      description: reminders.description,
      dueDate: reminders.dueDate,
      status: reminders.status,
      assignedToUser: users.username,
    })
    .from(reminders)
    .leftJoin(users, eq(reminders.assignedTo, users.id))
    .orderBy(desc(reminders.dueDate));

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Reminders</h2>
      <RemindersClient initialData={remindersData} />
    </div>
  );
}
