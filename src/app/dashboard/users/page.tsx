import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import UsersClient from "./client";

export default async function UsersPage() {
  const usersData = await db
    .select({
      id: users.id,
      username: users.username,
      isActive: users.isActive,
      roleName: roles.name,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .orderBy(desc(users.createdAt));

  const rolesData = await db.select().from(roles).orderBy(roles.name);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      <UsersClient initialUsers={usersData} roles={rolesData} />
    </div>
  );
}
