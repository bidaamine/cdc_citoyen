import { compareSync, hashSync } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { demoUsers } from "@/lib/auth-demo";
import { loginSchema } from "@/lib/validators";

const seededUsers = demoUsers.map((user) => ({
  ...user,
  passwordHash: hashSync(user.password, 10),
}));

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        if (process.env.DATABASE_URL) {
          try {
            const { db } = await import("@/lib/db");
            const dbUser = await db.user.findUnique({
              where: { email: parsed.data.email },
              include: {
                roles: {
                  include: {
                    role: true,
                  },
                },
              },
            });

            if (dbUser && compareSync(parsed.data.password, dbUser.passwordHash)) {
              const primaryRole = dbUser.roles[0]?.role.code ?? "CITIZEN";

              return {
                id: dbUser.id,
                name: `${dbUser.firstName} ${dbUser.lastName}`,
                email: dbUser.email,
                role: primaryRole,
                accountStatus: dbUser.accountStatus,
              };
            }
          } catch (error) {
            console.warn("Database auth lookup failed, falling back to demo auth.", error);
          }
        }

        const user = seededUsers.find((entry) => entry.email === parsed.data.email);

        if (!user || !compareSync(parsed.data.password, user.passwordHash)) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accountStatus = user.accountStatus;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = String(token.role ?? "CITIZEN");
        session.user.accountStatus = String(token.accountStatus ?? "PENDING");
      }

      return session;
    },
  },
};
