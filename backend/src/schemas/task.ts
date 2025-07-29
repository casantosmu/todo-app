import { Type, type Static } from "@sinclair/typebox";
import { TypeNull } from "./_utils.js";

export const TaskSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  completedAt: TypeNull(Type.String({ format: "date-time" })),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
  deletedAt: TypeNull(Type.String({ format: "date-time" })),
});

export type Task = Static<typeof TaskSchema>;
