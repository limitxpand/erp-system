/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { users, roles, auditLogs } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

export async function createUser(data: { username: string; roleId: number; passwordText: string }) {
  const session = await auth();
  const adminId = session?.user?.id ? parseInt(session.user.id) : null;

  try {
    const newUser = await db.insert(users).values({
      username: data.username,
      passwordHash: data.passwordText, // Plaintext for demo, use bcrypt in prod
      roleId: data.roleId,
    }).returning();

    if (newUser.length > 0) {
      await db.insert(auditLogs).values({
        userId: adminId,
        module: "Users",
        recordId: newUser[0].id,
        action: "create",
        newData: newUser[0],
      });
    }

    revalidatePath("/dashboard/users");
    return { success: true, user: newUser[0] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRole(name: string, permissions: any) {
  const session = await auth();
  const adminId = session?.user?.id ? parseInt(session.user.id) : null;

  try {
    const newRole = await db.insert(roles).values({
      name,
      permissions,
    }).returning();

    if (newRole.length > 0) {
      await db.insert(auditLogs).values({
        userId: adminId,
        module: "Roles",
        recordId: newRole[0].id,
        action: "create",
        newData: newRole[0],
      });
    }

    revalidatePath("/dashboard/roles");
    return { success: true, role: newRole[0] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
