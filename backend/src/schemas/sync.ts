import { Type, type Static } from "@sinclair/typebox";

export const SyncBodySchema = Type.Object({
  lastSyncToken: Type.Integer(),
  // deviceId: Type.String(),
  changes: Type.Array(
    Type.Object({
      operation: Type.Union([
        Type.Literal("INSERT"),
        Type.Literal("UPDATE"),
        Type.Literal("DELETE"),
      ]),
      tableName: Type.String(),
      recordId: Type.String(),
      data: Type.Record(Type.String(), Type.Unknown()),
      timestamp: Type.String({ format: "date-time" }),
    }),
  ),
});

export const SyncResponseSchema = Type.Object({
  newSyncToken: Type.Integer(),
});

export type SyncBody = Static<typeof SyncBodySchema>;
export type SyncResponse = Static<typeof SyncResponseSchema>;
