import type { AuthSession } from "@/modules/sync/models/auth-session";
import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { AuthDialog } from "../components/auth-dialog";
import { authService } from "../services/auth-service";
import { syncPollingService } from "../services/sync-polling-service";
import { AuthContext } from "./auth-provider-context";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(() => authService.getSession());
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    if (session) {
      syncPollingService.init();
    }
    return () => {
      if (session) {
        syncPollingService.stop("unconfigured");
      }
    };
  }, [session]);

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
        syncPollingService.stop("unconfigured");
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
