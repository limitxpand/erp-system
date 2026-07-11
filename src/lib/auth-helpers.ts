import { auth } from "@/../auth";
import { redirect } from "next/navigation";

/**
 * Ensures the currently logged-in user is an Admin (roleId = 1).
 * If not, throws an error (useful for Server Actions).
 */
export async function verifyAdmin() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized: Please log in.");
  }

  // Admin roleId is assumed to be 1
  if (session.user.roleId !== 1) {
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  return session.user;
}
