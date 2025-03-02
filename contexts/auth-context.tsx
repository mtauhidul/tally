// contexts/auth-context.tsx
"use client";

import { authAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: { id: string; email: string; onboardingCompleted: boolean } | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    onboardingCompleted: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const loadUser = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Get user profile
        const response = await authAPI.getProfile();
        setUser(response.data.data);
        setIsAuthenticated(true);
        setOnboardingComplete(!!response.data.data.onboardingCompleted);
      } catch (err) {
        console.error("Error loading user:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      setOnboardingComplete(!!response.user.onboardingCompleted);
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      setOnboardingComplete(false); // New users need to complete onboarding
    } catch (err: unknown) {
      console.error("Registration error:", err);
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
      setOnboardingComplete(false);
    } catch (err: unknown) {
      console.error("Logout error:", err);
      // Still clear user data even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      setOnboardingComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const isAxiosError = (
    error: unknown
  ): error is { response: { data: { error: string } } } => {
    return typeof error === "object" && error !== null && "response" in error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        onboardingComplete,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
