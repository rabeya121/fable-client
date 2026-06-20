"use client";
import { createContext, useContext } from "react";
import { useSession } from "@/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data, isPending } = useSession();

  return (
    <AuthContext.Provider value={{ 
      user: data?.user || null, 
      isPending 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}