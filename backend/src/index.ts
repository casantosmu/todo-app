import cors from "@fastify/cors";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import configPlugin from "./plugins/config.js";
import dbPlugin from "./plugins/db.js";
import gracefulShutdownPlugin from "./plugins/graceful-shutdown.js";
import loggingPlugin from "./plugins/logging.js";
import syncRoute from "./routes/sync.js";

const server = Fastify({
  disableRequestLogging: true,
  ajv: {
    customOptions: {
      removeAdditional: "all",
    },
  },
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    errorKey: "error",
    messageKey: "message",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        messageKey: "message",
      },
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

// Register plugins
server.register(cors);
server.register(configPlugin);
server.register(dbPlugin);
server.register(gracefulShutdownPlugin);
server.register(loggingPlugin);

// Register routes
server.register(syncRoute, { prefix: "/api/sync" });

try {
  await server.ready();

  await server.listen({
    port: server.config.PORT,
    host: server.config.HOST,
  });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
