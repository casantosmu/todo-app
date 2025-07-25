export interface SyncChange {
  id: number;
  operation: "CREATE" | "UPDATE" | "DELETE";
  entityId: string;
  entityName: string;
  value: unknown;
  timestamp: Date;
}

export const SYNC_OPERATION = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const;
