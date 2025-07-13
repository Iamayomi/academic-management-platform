"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { apiRequest, getQueryFn, queryClient, setAuthToken, removeAuthToken } from "@/lib/queryClient";
import { AuthResponse } from "@/types/auth";
import { LoginData, RegisterData, User } from "@/types/interface";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AuthResponse, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<AuthResponse, Error, RegisterData>;
}

// Create Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null, Error>({
    queryKey: [`/user/me/`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    // refetchOnWindowFocus: false,
    // staleTime: 5 * 60 * 1000, // Override default Infinity for user data
  });

  // console.log("User", data);

  const loginMutation = useMutation<AuthResponse, Error, LoginData>({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/auth/login", credentials);

      return await res.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(["/user/me"], data.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
        // variant: "success",
      });
      router.push("/profile");
    },
    onError: (error) => {
      console.log(error);

      // toast({
      //   title: "Login failed",
      //   description: error.message,
      //   variant: "destructive",
      // });
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/auth/register", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(["/user/me"], data.user);
      toast({
        title: "Registration successful",
        description: `Welcome to , ${data.user.name}!`,
        // variant: "success",
      });
      router.push("/profile");
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      removeAuthToken();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/user/me"], null);
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      router.push("/");
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
