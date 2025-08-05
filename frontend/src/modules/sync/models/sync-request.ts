export interface SyncRequest {
  lastTimestamp: string;
  changes: Record<string, unknown[]>;
}
