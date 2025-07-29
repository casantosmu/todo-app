import { Type, type Static } from "@sinclair/typebox";
import { TypeNull } from "./_utils.js";
import { TaskSchema } from "./task.js";

export const SyncTaskInsertSchema = Type.Object({
  operation: Type.Literal("INSERT"),
  tableName: Type.Literal("tasks"),
  recordId: Type.String(),
  data: TaskSchema,
  timestamp: Type.String({ format: "date-time" }),
});

export const SyncTaskUpdateSchema = Type.Object({
  operation: Type.Literal("UPDATE"),
  tableName: Type.Literal("tasks"),
  recordId: Type.String(),
  data: Type.Object({
    title: Type.Optional(Type.String()),
    completedAt: Type.Optional(TypeNull(Type.String({ format: "date-time" }))),
    updatedAt: Type.String({ format: "date-time" }),
  }),
  timestamp: Type.String({ format: "date-time" }),
});

export const SyncTaskDeleteSchema = Type.Object({
  operation: Type.Literal("DELETE"),
  tableName: Type.Literal("tasks"),
  recordId: Type.String(),
  data: Type.Object({
    deletedAt: Type.String({ format: "date-time" }),
    updatedAt: Type.String({ format: "date-time" }),
  }),
  timestamp: Type.String({ format: "date-time" }),
});

export type SyncTaskInsert = Static<typeof SyncTaskInsertSchema>;
export type SyncTaskUpdate = Static<typeof SyncTaskUpdateSchema>;
export type SyncTaskDelete = Static<typeof SyncTaskDeleteSchema>;
