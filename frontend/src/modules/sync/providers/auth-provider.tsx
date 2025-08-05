import type { AuthSession } from "@/modules/sync/models/auth-session";
import { useMemo, useState, type PropsWithChildren } from "react";
import { AuthDialog } from "../components/auth-dialog";
import { authService } from "../services/auth-service";
import { AuthContext } from "./auth-provider-context";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(() => authService.getSession());
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const value = useMemo(
    () => ({
      session,
      onLogin: (session: AuthSession) => {
        setSession(session);
        setIsAuthDialogOpen(false);
      },
      openAuthDialog: () => {
        setIsAuthDialogOpen(true);
      },
      logout: () => {
        authService.logout();
        setSession(null);
      },
    }),
    [session],
  );

  return (
    <AuthContext value={value}>
      {children}
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
      />
    </AuthContext>
  );
};
