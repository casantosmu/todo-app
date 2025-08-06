import { eventEmitter, type AppEvents } from "@/lib/event-emitter";
import { useEffect, useState } from "react";
import type { SyncStatus } from "../models/sync-status";
import { syncMetadataService } from "../services/sync-metadata-service";

interface SyncState {
  status: SyncStatus;
  lastTimestamp: string;
}

export const useSyncState = () => {
  const [state, setState] = useState<SyncState>(() => {
    const metadata = syncMetadataService.get();
    return {
      status: "unconfigured",
      lastTimestamp: metadata.lastTimestamp,
    };
  });

  useEffect(() => {
    const handler = ({
      status,
      lastTimestamp,
    }: AppEvents["sync:status-change"]) => {
      setState((prev) => ({
        status,
        lastTimestamp: lastTimestamp ?? prev.lastTimestamp,
      }));
    };

    eventEmitter.on("sync:status-change", handler);

    return () => {
      eventEmitter.off("sync:status-change", handler);
    };
  }, []);

  return state;
};
