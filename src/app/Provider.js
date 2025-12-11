"use client";

import AuthContextProvider from "@/context/auth/AuthContextProvider";
import { UserContextProvider } from "@/context/useContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const [user, setUser] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <UserContextProvider value={{ user, setUser }}>
          {children}
        </UserContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
