'use client';

import { useContext, useState, createContext, ReactNode, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/server";

// Type definitions
export interface UserProfile {
  id: string;
  supabaseUserId: string;
  email: string;
  fullName: string | null;
  companyName: string | null;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  leases?: any[];
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = await createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        return;
      }

      // Fetch profile from Neon database
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profile = await response.json();
      setUser(profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch user
  const refetchUser = async () => {
    await fetchUserProfile();
  };

  // Sign out
  const signOut = async () => {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
      throw err;
    }
  };

  // Initialize on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        refetchUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}