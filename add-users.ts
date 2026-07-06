import { db } from "./src/db/index";
import { users, roles } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function addUsers() {
  console.log("Adding users...");
  
  // Get Admin role
  const adminRole = await db.select().from(roles).where(eq(roles.name, "Admin")).limit(1);
  const roleId = adminRole[0]?.id;

  if (!roleId) {
    console.error("Admin role not found!");
    return;
  }

  const usersToAdd = [
    { username: "Anmol0001", password: "Anmol0001" },
    { username: "Salish0001", password: "Salish0001" },
    { username: "Deepak", password: "Deepak" }
  ];

  for (const user of usersToAdd) {
    try {
      await db.insert(users).values({
        username: user.username,
        passwordHash: user.password, // Stored in plaintext for demo
        roleId,
      });
      console.log(`Added user: ${user.username}`);
    } catch (e) {
      console.log(`User ${user.username} might already exist or error occurred.`);
    }
  }
  
  console.log("Done.");
  process.exit(0);
}

addUsers();
