import { Cloud, CloudCheck } from "lucide-react";
import { SyncStatusBase } from "./sync-status-base";

export const SyncStatusSynced = () => {
  return (
    <SyncStatusBase
      trigger={{
        ariaLabel: "Synced",
        icon: <CloudCheck className="h-5 w-5 text-green-600" />,
      }}
      content={{
        icon: <Cloud className="h-4 w-4" />,
        title: "Up to date",
        description: "Last updated: just now.",
      }}
    />
  );
};
