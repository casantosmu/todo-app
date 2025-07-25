import fastifyPlugin from "fastify-plugin";
import z from "zod";

declare module "fastify" {
  export interface FastifyInstance {
    config: Config;
  }
}

const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().default(3000),
  HOST: z.string().default("0.0.0.0"),
  DB_PATH: z.string().default("sync_tasks.db"),
});

type Config = z.infer<typeof configSchema>;

/**
 * This plugin decorates the Fastify instance with the application configuration.
 */
export default fastifyPlugin((server, options, done) => {
  const parsedConfig = configSchema.safeParse(process.env);

  if (!parsedConfig.success) {
    const errorMessages = parsedConfig.error.issues
      .map((issue) => {
        return `- ${issue.path.join(".")}: ${issue.message}`;
      })
      .join("\n");

    throw new Error(`Invalid environment variables:\n${errorMessages}`);
  }

  server.decorate("config", parsedConfig.data);
  done();
});
