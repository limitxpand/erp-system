import { db } from "@/db";
import { roles } from "@/db/schema";
import { desc } from "drizzle-orm";
import RolesClient from "./client";

export default async function RolesPage() {
  const rolesData = await db.select().from(roles).orderBy(desc(roles.createdAt));

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
      <RolesClient initialRoles={rolesData} />
    </div>
  );
}
