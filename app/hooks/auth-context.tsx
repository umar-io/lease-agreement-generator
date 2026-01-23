'use client';

import { useContext, useState, createContext, ReactNode, useEffect } from "react";

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

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the API endpoint to get user profile
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // User not authenticated
        setUser(null);
        setError(null);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch user profile");
      }

      const profile = await response.json();
      if (profile) {
        setUser(profile);
        setError(null);
      }

    //   console.log(profile)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Auth error:", err);
      setUser(null);
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
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

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