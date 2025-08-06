import { Cloud, CloudCheck } from "lucide-react";
import { SyncStatusBase } from "./sync-status-base";

interface SyncStatusSyncedProps {
  lastTimestamp: string;
}

export const SyncStatusSynced = ({ lastTimestamp }: SyncStatusSyncedProps) => {
  const date = new Date(lastTimestamp);

  const formattedTime = `at ${date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  return (
    <SyncStatusBase
      trigger={{
        ariaLabel: "Synced",
        icon: <CloudCheck className="h-5 w-5 text-green-600" />,
      }}
      content={{
        icon: <Cloud className="h-4 w-4" />,
        title: "Up to date",
        description: `Last updated: ${formattedTime}.`,
      }}
    />
  );
};
