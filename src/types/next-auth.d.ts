import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      accountStatus: string;
    };
  }

  interface User {
    role: string;
    accountStatus: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accountStatus?: string;
  }
}
