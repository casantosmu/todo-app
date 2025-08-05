import { CloudOff, LoaderCircle } from "lucide-react";
import { syncService } from "../services/sync-service";
import { SyncStatusBase } from "./sync-status-base";

export const SyncStatusError = () => {
  return (
    <SyncStatusBase
      trigger={{
        ariaLabel: "Sync error",
        icon: <CloudOff className="text-destructive h-5 w-5" />,
      }}
      content={{
        icon: <CloudOff className="h-4 w-4" />,
        title: "Sync error",
        description: "Couldn't save your changes. We'll try again soon.",
        action: {
          label: "Retry now",
          icon: <LoaderCircle className="h-4 w-4" />,
          onSelect: () => {
            void syncService.sync();
          },
        },
      }}
    />
  );
};
