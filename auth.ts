import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./src/db";
import { users } from "./src/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        // Find user
        const result = await db.select().from(users).where(eq(users.username, credentials.username as string));
        const user = result[0];
        
        if (!user) return null;
        
        // Skip hashing check for demo purposes (admin/admin)
        if (credentials.password === user.passwordHash) {
            return {
                id: user.id.toString(),
                name: user.username,
                roleId: user.roleId
            };
        }
        
        return null;
      }
    })
  ]
});
