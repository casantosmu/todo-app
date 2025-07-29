import { Type, type TSchema } from "@sinclair/typebox";

export const TypeNull = <T extends TSchema>(type: T) =>
  Type.Union([type, Type.Null()]);
