import { DefaultSession } from "@auth/core/types";

declare module "@auth/core" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    supabaseAccessToken?: string;
    user: DefaultSession["user"];
  }
}
