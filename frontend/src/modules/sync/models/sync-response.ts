export interface SyncResponse {
  nextTimestamp: string;
  changes: Record<string, unknown[]>;
}
