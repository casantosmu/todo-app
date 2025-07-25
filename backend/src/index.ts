import Fastify from "fastify";
import configPlugin from "./plugins/config.js";
import dbPlugin from "./plugins/db.js";
import servicesPlugin from "./plugins/services.js";
import syncRoute from "./routes/sync.js";

const server = Fastify({
  disableRequestLogging: true,
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

// Register plugins
server.register(configPlugin);
server.register(dbPlugin);
server.register(servicesPlugin);

// Register routes
server.register(syncRoute);

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
