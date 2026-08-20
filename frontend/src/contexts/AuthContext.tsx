// Global React context for Supabase authentication
// Ensures all components share a single consistent session state

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { Session } from "@supabase/supabase-js";
import supabase from "../lib/supabase";

// Session -> user is logged in
// null -> user is logged out
// undefined -> loading or not initialized (if for example used outside AuthContextProvider)
interface AuthContextType {
  session: Session | null | undefined;
}

// Initialized to undefined because no session is known yet
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthContextProvider({ children }: Props) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(( response ) => {
      setSession(response.data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    // Cleanup function
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
}
