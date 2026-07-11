import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET || "erpsystem_super_secret_key_2026_anmol",
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roleId = user.roleId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.roleId) {
        session.user.roleId = token.roleId as number;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        
        // RBAC Middleware Logic
        const roleId = (auth.user as any)?.roleId;
        const isAdmin = roleId === 1; // Assuming 1 is Admin
        
        const restrictedPaths = ['/dashboard/analytics', '/dashboard/users', '/dashboard/roles', '/dashboard/audit-log'];
        if (restrictedPaths.some(path => nextUrl.pathname.startsWith(path)) && !isAdmin) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        
        return true;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
