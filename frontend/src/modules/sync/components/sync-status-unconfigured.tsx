import { CloudOff, LogIn } from "lucide-react";
import { SyncStatusBase } from "./sync-status-base";

export const SyncStatusUnconfigured = () => {
  return (
    <SyncStatusBase
      trigger={{
        ariaLabel: "Sync is off",
        icon: <CloudOff className="text-muted-foreground h-5 w-5" />,
      }}
      content={{
        icon: <CloudOff className="h-4 w-4" />,
        title: "Sync is off",
        description: "Your data is saved on this device only.",
        action: {
          label: "Turn on sync",
          icon: <LogIn className="h-4 w-4" />,
          onSelect: () => {
            /* TODO: Implement login/signup flow */
          },
        },
      }}
    />
  );
};
