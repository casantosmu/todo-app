import { Type, type Static } from "@sinclair/typebox";

export const ConfigSchema = Type.Object({
  NODE_ENV: Type.Union(
    [
      Type.Literal("development"),
      Type.Literal("production"),
      Type.Literal("test"),
    ],
    { default: "development" },
  ),
  PORT: Type.Number({ default: 3000 }),
  HOST: Type.String({ default: "localhost" }),
  DB_PATH: Type.String({ default: "./data/db.sqlite" }),
  LOG_LEVEL: Type.Union(
    [
      Type.Literal("silent"),
      Type.Literal("fatal"),
      Type.Literal("error"),
      Type.Literal("warn"),
      Type.Literal("info"),
      Type.Literal("debug"),
      Type.Literal("trace"),
    ],
    { default: "info" },
  ),
});

export type Config = Static<typeof ConfigSchema>;
