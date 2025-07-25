import { AssertError, Value } from "@sinclair/typebox/value";
import fastifyPlugin from "fastify-plugin";
import { ConfigSchema, type Config } from "../schemas/config.js";

declare module "fastify" {
  export interface FastifyInstance {
    config: Config;
  }
}

/**
 * This plugin decorates the Fastify instance with the application configuration.
 */
export default fastifyPlugin((server, options, done) => {
  try {
    const config = Value.Parse(ConfigSchema, process.env);
    server.decorate("config", config);
    done();
  } catch (error) {
    const assertError = error as AssertError;
    const errorMessages = [...assertError.Errors()]
      .map((issue) => {
        const path = issue.path.substring(1);
        return `- ${path}: ${issue.message}`;
      })
      .join("\n");

    done(new Error(`Invalid environment variables:\n${errorMessages}`));
  }
});
