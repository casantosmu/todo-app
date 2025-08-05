import type { AuthSession } from "@/modules/sync/models/auth-session";
import { createContext, use } from "react";

interface AuthProviderState {
  session: AuthSession | null;
  onLogin: (session: AuthSession) => void;
  openAuthDialog: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthProviderState | null>(null);

export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
