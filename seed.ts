import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "./src/db";
import { roles, users } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding database...");
  
  // Seed Roles
  let adminRole = await db.select().from(roles).where(eq(roles.name, "Admin"));
  let adminRoleId;
  
  if (adminRole.length === 0) {
    const newRole = await db.insert(roles).values({
      name: "Admin",
      permissions: { all: true }
    }).returning();
    adminRoleId = newRole[0].id;
    console.log("Created Admin role.");
  } else {
    adminRoleId = adminRole[0].id;
  }

  // Seed Users
  let adminUser = await db.select().from(users).where(eq(users.username, "admin"));
  
  if (adminUser.length === 0) {
    await db.insert(users).values({
      username: "admin",
      passwordHash: "admin123", // In a real app, hash this with bcrypt/argon2
      roleId: adminRoleId
    });
    console.log("Created Admin user (admin / admin123).");
  } else {
    console.log("Admin user already exists.");
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error seeding:", err);
  process.exit(1);
});
