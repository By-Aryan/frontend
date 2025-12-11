"use client";
import { createContext } from "react";

type Auth = {
  accessToken: string;
  refreshToken: string;
  roles: string[];
  user: any;
};

type AuthContextType = {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
  login: (
    tokens: { accessToken: string; refreshToken: string },
    user: any,
    roles?: string[]
  ) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  hasApiError: boolean;
  handleApiError: (error: any) => any;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
