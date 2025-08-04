import type { Session } from "@/modules/auth/models/session";
import { createContext, use } from "react";

interface AuthProviderState {
  session: Session | null;
  onLogin: (session: Session) => void;
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
