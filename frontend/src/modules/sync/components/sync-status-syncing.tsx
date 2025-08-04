import { Cloud, LoaderCircle } from "lucide-react";
import { SyncStatusBase } from "./sync-status-base";

export const SyncStatusSyncing = () => {
  return (
    <SyncStatusBase
      trigger={{
        ariaLabel: "Syncing...",
        icon: <LoaderCircle className="h-5 w-5 animate-spin text-blue-500" />,
      }}
      content={{
        icon: <Cloud className="h-4 w-4" />,
        title: "Syncing...",
        description: "We're updating your data from the cloud.",
      }}
    />
  );
};
