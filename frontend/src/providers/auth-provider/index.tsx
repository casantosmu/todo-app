import { AuthDialog } from "@/modules/auth/components/auth-dialog";
import type { Session } from "@/modules/auth/models/session";
import { authService } from "@/modules/auth/services/auth-service";
import { useMemo, useState, type PropsWithChildren } from "react";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(() => authService.getSession());
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const value = useMemo(
    () => ({
      session,
      onLogin: (session: Session) => {
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
