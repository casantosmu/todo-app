import { SyncStatusError } from "./sync-status-error";
import { SyncStatusOffline } from "./sync-status-offline";
import { SyncStatusSynced } from "./sync-status-synced";
import { SyncStatusSyncing } from "./sync-status-syncing";
import { SyncStatusUnconfigured } from "./sync-status-unconfigured";

interface SyncStatusProps {
  status: "unconfigured" | "synced" | "syncing" | "offline" | "error";
}

export const SyncStatus = ({ status }: SyncStatusProps) => {
  switch (status) {
    case "unconfigured":
      return <SyncStatusUnconfigured />;
    case "syncing":
      return <SyncStatusSyncing />;
    case "synced":
      return <SyncStatusSynced />;
    case "offline":
      return <SyncStatusOffline />;
    case "error":
      return <SyncStatusError />;
  }
};
