export interface SyncChange {
  id: number;
  tableName: string;
  data: Record<string, unknown>;
  timestamp: string;
}
