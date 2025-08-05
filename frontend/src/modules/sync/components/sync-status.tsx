import { useSyncStatus } from "../hooks/use-sync-status";
import { SyncStatusError } from "./sync-status-error";
import { SyncStatusOffline } from "./sync-status-offline";
import { SyncStatusSynced } from "./sync-status-synced";
import { SyncStatusSyncing } from "./sync-status-syncing";
import { SyncStatusUnconfigured } from "./sync-status-unconfigured";

export const SyncStatus = () => {
  const status = useSyncStatus();

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
