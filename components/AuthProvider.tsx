"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import LogRocket from "logrocket";
LogRocket.init("8tvj77/gigachat-bot");

export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
