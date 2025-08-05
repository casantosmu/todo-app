import type { SyncMetadata } from "../models/sync-metadata";

const SYNC_METADATA_STORAGE_KEY = "sync-metadata";

export const syncMetadataService = {
  get(): SyncMetadata {
    const metadataStr = localStorage.getItem(SYNC_METADATA_STORAGE_KEY);

    if (metadataStr) {
      return JSON.parse(metadataStr) as SyncMetadata;
    }

    return {
      lastTimestamp: new Date(0).toISOString(),
    };
  },

  set(metadata: SyncMetadata) {
    localStorage.setItem(SYNC_METADATA_STORAGE_KEY, JSON.stringify(metadata));
  },
};
