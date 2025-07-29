import { Type, type Static } from "@sinclair/typebox";
import {
  SyncTaskDeleteSchema,
  SyncTaskInsertSchema,
  SyncTaskUpdateSchema,
} from "./sync-task.js";

export const SyncChangeSchema = Type.Union([
  SyncTaskInsertSchema,
  SyncTaskUpdateSchema,
  SyncTaskDeleteSchema,
]);

export const SyncRequestSchema = Type.Object({
  lastSyncToken: Type.Integer(),
  changes: Type.Array(SyncChangeSchema),
});

export const SyncResponseSchema = Type.Object({
  newSyncToken: Type.Integer(),
});

export type SyncChange = Static<typeof SyncChangeSchema>;
export type SyncRequest = Static<typeof SyncRequestSchema>;
export type SyncResponse = Static<typeof SyncResponseSchema>;
