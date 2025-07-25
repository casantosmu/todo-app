import fastifyPlugin from "fastify-plugin";

const SIGNALS: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

/**
 * This plugin handles OS signals to ensure a graceful shutdown of the server.
 */
export default fastifyPlugin((server, options, done) => {
  for (const signal of SIGNALS) {
    process.on(signal, () => {
      server.log.info(`Received ${signal}. Starting graceful shutdown...`);
      server
        .close()
        .then(() => {
          server.log.info("Server closed successfully.");
          process.exit(0);
        })
        .catch((error: unknown) => {
          server.log.error(error, "Error during server shutdown:");
          process.exit(1);
        });
    });
  }

  done();
});
