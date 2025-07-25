import { Type, type Static } from "@sinclair/typebox";

export const SyncChangeSchema = Type.Array(
  Type.Object({
    tableName: Type.String(),
    recordId: Type.String(),
    operation: Type.Union([
      Type.Literal("INSERT"),
      Type.Literal("UPDATE"),
      Type.Literal("DELETE"),
    ]),
    data: Type.Record(Type.String(), Type.Unknown()),
  }),
);

export const SyncBodySchema = Type.Object({
  lastSyncToken: Type.Integer(),
  changes: SyncChangeSchema,
});

export const SyncResponseSchema = Type.Object({
  newSyncToken: Type.Integer(),
  changes: SyncChangeSchema,
});

export type SyncChange = Static<typeof SyncChangeSchema>;
export type SyncBody = Static<typeof SyncBodySchema>;
export type SyncResponse = Static<typeof SyncResponseSchema>;
