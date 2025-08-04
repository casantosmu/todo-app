import { WifiOff } from "lucide-react";
import { SyncStatusBase } from "./sync-status-base";

export const SyncStatusOffline = () => {
  return (
    <SyncStatusBase
      trigger={{
        ariaLabel: "Offline",
        icon: <WifiOff className="text-muted-foreground h-5 w-5" />,
      }}
      content={{
        icon: <WifiOff className="h-4 w-4" />,
        title: "You're offline",
        description: "Pending changes will be synced once you're back online.",
      }}
    />
  );
};
