import { eventEmitter, type AppEvents } from "@/lib/event-emitter";
import { useEffect, useState } from "react";
import type { SyncStatus } from "../models/sync-status";

export const useSyncStatus = () => {
  const [status, setStatus] = useState<SyncStatus>("unconfigured");

  useEffect(() => {
    const handler = ({ status }: AppEvents["sync:status-change"]) => {
      setStatus(status);
    };

    eventEmitter.on("sync:status-change", handler);

    return () => {
      eventEmitter.off("sync:status-change", handler);
    };
  }, []);

  return status;
};
