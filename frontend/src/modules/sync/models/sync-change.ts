export interface SyncChange {
  id: number;
  operation: "INSERT" | "UPDATE" | "DELETE";
  tableName: string;
  recordId: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export const SYNC_OPERATION = {
  INSERT: "INSERT",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const;
